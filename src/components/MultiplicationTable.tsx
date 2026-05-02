import React, { useState, useEffect } from 'react'
import { ArrowLeft, Lightbulb, Volume2, Star, RotateCcw, Flame, Zap, Trophy, Sparkles } from 'lucide-react'
import './MultiplicationTable.css'
import mascot from '../assets/mascot.webp'
import Swal from 'sweetalert2'
import { getAnimalIcon, getAnimalName } from './AnimalIcons'
import confetti from 'canvas-confetti'

type Phase = 'learn' | 'try' | 'teach' | 'celebrate'

const SAVED_STATE_KEY = 'mbalo_multiplication_state'

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(SAVED_STATE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error("Failed to parse saved state", e)
  }
  return null
}

const MultiplicationTable: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const initialState = loadSavedState()

  const [activeNum, setActiveNum] = useState<number | null>(initialState?.activeNum || null)
  const [currentFactor, setCurrentFactor] = useState(initialState?.currentFactor || 1)
  const [phase, setPhase] = useState<Phase>(initialState?.phase || 'learn')
  const [userGuess, setUserGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [teachStep, setTeachStep] = useState(0)
  const [teachIsCorrect, setTeachIsCorrect] = useState(false)
  const [streak, setStreak] = useState(initialState?.streak || 0)
  const [starsEarned, setStarsEarned] = useState<Record<number, number>>(initialState?.starsEarned || {})
  const [wordProblem, setWordProblem] = useState('')

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem(SAVED_STATE_KEY, JSON.stringify({
      activeNum,
      currentFactor,
      phase,
      streak,
      starsEarned
    }))
  }, [activeNum, currentFactor, phase, streak, starsEarned])

  const nums = Array.from({ length: 12 }, (_, i) => i + 1)

  const speak = (text: string, mood: 'happy' | 'encourage' | 'neutral' = 'neutral', onEnd?: () => void) => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (mood === 'happy') {
      u.rate = 1.0
      u.pitch = 1.4
      u.volume = 1
    } else if (mood === 'encourage') {
      u.rate = 0.9
      u.pitch = 1.2
      u.volume = 1
    } else {
      u.rate = 0.85
      u.pitch = 1.0
      u.volume = 0.9
    }
    if (onEnd) u.onend = onEnd
    window.speechSynthesis.speak(u)
  }

  const correctAnswer = activeNum ? activeNum * currentFactor : 0

  // Speak the equation when entering learn phase
  useEffect(() => {
    if (activeNum && phase === 'learn') {
      speak(`${activeNum} times ${currentFactor}`)
    }
  }, [activeNum, currentFactor, phase])

  const showTip = () => {
    if (!activeNum) return

    const tips: Record<number, { trick: string; example: string; why: string }> = {
      1: {
        trick: "The Mirror Rule",
        example: "1 × 7 = 7, 1 × 100 = 100",
        why: "Any number times 1 stays the same — like looking in a mirror!"
      },
      2: {
        trick: "The Double Rule",
        example: "2 × 6 = 6 + 6 = 12",
        why: "Times 2 just means add the number to itself. 2 × 8? That's 8 + 8 = 16!"
      },
      3: {
        trick: "Double + One More",
        example: "3 × 4 = (2 × 4) + 4 = 8 + 4 = 12",
        why: "First double it (times 2), then add one more group."
      },
      4: {
        trick: "Double Double",
        example: "4 × 3 = double 3 = 6, double again = 12",
        why: "Double the number, then double your answer. That's it!"
      },
      5: {
        trick: "The Clock Rule",
        example: "5 × 3 = 15, 5 × 4 = 20, 5 × 7 = 35",
        why: "Count by 5s like minutes on a clock. The answer always ends in 0 or 5."
      },
      6: {
        trick: "5 Groups + 1 More",
        example: "6 × 7 = (5 × 7) + 7 = 35 + 7 = 42",
        why: "Do 5 times first (easy!), then just add one more group."
      },
      7: {
        trick: "5 Groups + 2 More",
        example: "7 × 8 = (5 × 8) + (2 × 8) = 40 + 16 = 56",
        why: "Split it: do 5× (easy) plus 2× (double), then add them."
      },
      8: {
        trick: "Double, Double, Double",
        example: "8 × 3: double 3 = 6, double 6 = 12, double 12 = 24",
        why: "Double three times in a row! Start with the number and keep doubling."
      },
      9: {
        trick: "The Finger Trick",
        example: "9 × 4: hold up 10 fingers, put down finger 4. Left: 3, Right: 6 → 36!",
        why: "Or use: 10 × the number, minus the number. 9 × 6 = 60 - 6 = 54."
      },
      10: {
        trick: "The Zero Rule",
        example: "10 × 5 = 50, 10 × 12 = 120",
        why: "Just write the number and add a 0 at the end. Easiest table ever!"
      },
      11: {
        trick: "The Twin Rule (1-9)",
        example: "11 × 3 = 33, 11 × 7 = 77, 11 × 9 = 99",
        why: "For 1-9, just write the digit twice! 11 × 5 = 55. For bigger numbers: 11 × 12 = 132."
      },
      12: {
        trick: "10 Groups + 2 More",
        example: "12 × 4 = (10 × 4) + (2 × 4) = 40 + 8 = 48",
        why: "Split it into 10× (add a zero) and 2× (double), then add together."
      }
    }

    const tip = tips[activeNum]
    const fullText = `${tip.trick}. ${tip.why}. For example, ${tip.example}.`

    Swal.fire({
      html: `<div style="text-align:left;font-family:'Fredoka',sans-serif">
        <style>
          @keyframes textPulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.02); color: #D35400; }
            100% { opacity: 1; transform: scale(1); }
          }
          .reading-animation { animation: textPulse 1.5s infinite; }
        </style>
        <div style="text-align:center;margin-bottom:12px">
          <img src="${mascot}" style="width:70px" />
        </div>
        <h3 style="color:#2D5A27;margin:0 0 8px;text-align:center;font-size:1.2rem">${tip.trick}</h3>
        <p style="color:#5D4037;font-size:1rem;margin:0 0 12px;line-height:1.5">${tip.why}</p>
        <div style="background:#f5f0e8;padding:12px;border-radius:12px;border:2px solid #e0d5c5;margin-bottom:4px">
          <p style="margin:0;font-weight:900;color:#E67E22;font-size:1rem">Example:</p>
          <div id="tip-example" style="display:inline-block; transition: all 0.3s;">
            <p style="margin:4px 0 0;font-size:1.1rem;font-weight:800;color:#5D4037">${tip.example}</p>
          </div>
        </div>
      </div>`,
      showDenyButton: true,
      confirmButtonText: 'Got it!',
      denyButtonText: 'Read it to me',
      confirmButtonColor: '#2D5A27',
      denyButtonColor: '#E67E22',
      background: '#FFF8F0',
      preDeny: () => {
        const exampleEl = document.getElementById('tip-example')
        
        if (exampleEl) {
          exampleEl.classList.add('reading-animation')
        }
        
        speak(fullText, 'neutral', () => {
          if (exampleEl) {
             exampleEl.classList.remove('reading-animation')
          }
        })
        return false // Prevents the modal from closing
      },
      didClose: () => {
        window.speechSynthesis.cancel() // Stops talking when modal closes
      }
    })
  }

  const handleRevealAndTry = () => {
    setPhase('try')
    setUserGuess('')
    setAttempts(0)
    
    if (activeNum) {
      const animalName = getAnimalName(activeNum, true)
      const problemText = `There are ${activeNum} groups, and each group has ${currentFactor} ${animalName}. How many are there in total?`
      setWordProblem(problemText)
      speak(problemText)
    }
  }

  const celebrateCorrect = () => {
    setPhase('celebrate')
    speak(`Yes! ${activeNum} times ${currentFactor} is ${correctAnswer}! Amazing!`, 'happy')

    confetti({
      particleCount: attempts === 0 ? 150 : 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D5A27', '#E67E22', '#F1C40F', '#FF6B6B']
    })

    try {
      const ctx = new AudioContext()
      const notes = attempts === 0 ? [523, 659, 784] : [523, 659]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4)
        osc.connect(gain).connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.15)
        osc.stop(ctx.currentTime + i * 0.15 + 0.4)
      })
    } catch {}
  }

  const startTeaching = (correct: boolean) => {
    setPhase('teach')
    setTeachStep(0)
    setTeachIsCorrect(correct)
    
    if (!activeNum) return;
    
    const showVisual = activeNum <= 6 && currentFactor <= 6
    if (!showVisual) {
       // Fast track for large numbers
       if (correct) {
          celebrateCorrect()
       } else {
          speak(`No worries! ${activeNum} times ${currentFactor} is ${correctAnswer}. Let's look at the groups!`, 'encourage')
          Swal.fire({
            html: `<div style="text-align:center;font-family:'Fredoka',sans-serif">
              <p style="font-size:1.5rem;font-weight:900;color:#5D4037">${activeNum} × ${currentFactor} = ${correctAnswer}</p>
            </div>`,
            confirmButtonText: "I'll remember!",
            confirmButtonColor: '#2D5A27',
            background: '#FFF8F0'
          }).then(() => {
            setPhase('learn')
            setUserGuess('')
            setAttempts(0)
          })
       }
       return
    }

    // Step-by-step
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTeachStep(step);
      
      if (step <= activeNum) {
        if (step === 1) {
          speak(`Here is 1 group of ${currentFactor}.`, 'neutral')
        } else if (step === activeNum) {
          speak(`And here is ${activeNum} groups!`, 'encourage')
        } else {
          speak(`${step} groups...`, 'neutral')
        }
      } else if (step === activeNum + 1) {
        speak(`Counting them all together makes ${correctAnswer}!`, 'happy')
        clearInterval(interval)
        setTimeout(() => {
           if (correct) {
             celebrateCorrect()
           } else {
             setPhase('learn')
             setUserGuess('')
             setAttempts(0)
           }
        }, 3000)
      }
    }, 3500)
  }

  const handleSubmitGuess = () => {
    const guess = parseInt(userGuess)
    if (isNaN(guess)) return

    if (guess === correctAnswer) {
      // Correct!
      const newStreak = streak + 1
      setStreak(newStreak)

      // Award stars based on attempts
      if (attempts === 0) {
        setStarsEarned(prev => ({ ...prev, [currentFactor]: 3 }))
      } else if (attempts === 1) {
        setStarsEarned(prev => ({ ...prev, [currentFactor]: 2 }))
      } else {
        setStarsEarned(prev => ({ ...prev, [currentFactor]: 1 }))
      }
      
      startTeaching(true)
    } else {
      // Wrong — give intelligent feedback
      const diff = Math.abs(guess - correctAnswer)
      setAttempts(prev => prev + 1)
      setStreak(0)
      setUserGuess('')

      if (attempts >= 1) {
        // After 2 wrong tries, start the teach phase
        startTeaching(false)
      } else if (diff === 1) {
        speak(`So close! You said ${guess}, the answer is just one away. Try again!`, 'encourage')
      } else if (diff <= 3) {
        speak(`Almost! You're very close. Try a little ${guess < correctAnswer ? 'higher' : 'lower'}.`, 'encourage')
      } else if (diff <= 10) {
        speak(`Good try! You're in the right area. Think a bit ${guess < correctAnswer ? 'bigger' : 'smaller'}.`, 'encourage')
      } else if (guess === activeNum + currentFactor) {
        speak(`Hmm, that looks like you added instead of multiplied! Remember, times means groups of.`, 'encourage')
      } else {
        speak("Not quite! Look at the animal groups and count them. You can do this!", 'encourage')
      }
    }
  }

  const handleNext = () => {
    if (currentFactor < 12) {
      setCurrentFactor((prev: number) => prev + 1)
      setPhase('learn')
      setUserGuess('')
      setAttempts(0)
    }
  }

  const handleFinishLevel = () => {
    const totalStars = Object.values(starsEarned).reduce((a, b) => a + b, 0)
    const maxStars = Object.keys(starsEarned).length * 3
    Swal.fire({
      html: `<div style="text-align:center;font-family:'Fredoka',sans-serif">
        <img src="${mascot}" style="width:100px;margin-bottom:10px" />
        <h2 style="color:var(--mbalo-brown)">Level Complete! 🏆</h2>
        <p style="font-size:1.5rem">⭐ ${totalStars} / ${maxStars} stars</p>
        <p style="color:#666">You mastered the table of ${activeNum}!</p>
      </div>`,
      confirmButtonText: 'Back to Levels',
      confirmButtonColor: '#2D5A27',
      background: '#FFF8F0'
    }).then(() => {
      setActiveNum(null)
      setStarsEarned({})
      setStreak(0)
    })
  }

  // Render visible groups for the visual aid
  // Show GROUPS clearly: e.g. 3 × 4 = 3 groups, each with 4 animals
  const renderGroups = () => {
    if (!activeNum) return null
    // Limit visual to avoid overwhelming
    const showVisual = activeNum <= 6 && currentFactor <= 6

    if (!showVisual) {
      return (
        <div className="visual-safari">
          <div className="safari-label">
            {activeNum} × {currentFactor} means {activeNum} groups of {currentFactor}
          </div>
          <div className="safari-summary">
            {getAnimalIcon(activeNum, 36)}
            <span>× {activeNum * currentFactor}</span>
          </div>
        </div>
      )
    }

    const visibleGroups = phase === 'teach' ? teachStep : activeNum;

    return (
      <div className="visual-safari">
        <div className="safari-label">
          {phase === 'teach'
            ? `${visibleGroups <= activeNum ? visibleGroups : activeNum} group${visibleGroups !== 1 ? 's' : ''} of ${currentFactor} ${getAnimalName(activeNum, currentFactor !== 1)}`
            : `${activeNum} groups of ${currentFactor} ${getAnimalName(activeNum, currentFactor !== 1)}`}
        </div>
        <div className="safari-groups">
          {Array.from({ length: activeNum }).map((_, groupIdx) => {
            const isVisible = phase !== 'teach' || groupIdx < teachStep;
            if (!isVisible) return null;
            return (
              <div key={groupIdx} className="safari-group" style={{ animation: phase === 'teach' ? 'practiceFadeIn 0.5s ease-out' : 'none' }}>
                <div className="group-animals">
                  {Array.from({ length: currentFactor }).map((_, animalIdx) => (
                    <div key={animalIdx} className="safari-animal-unit-svg">
                      {getAnimalIcon(activeNum, 32)}
                    </div>
                  ))}
                </div>
                <span className="group-count">{currentFactor}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // =====================
  // LEVEL SELECTION
  // =====================
  if (!activeNum) {
    return (
      <div className="math-tool-container selection-screen">
        <header className="tool-header">
          <button className="btn-exit" onClick={onBack}><ArrowLeft size={22} /></button>
          <h2>Safari Multiplication</h2>
        </header>
        <p className="selection-subtitle">Pick a table to learn!</p>
        <div className="level-grid">
          {nums.map(n => (
            <button key={n} className="level-card" onClick={() => {
              setActiveNum(n)
              setCurrentFactor(1)
              setPhase('learn')
              setUserGuess('')
              setAttempts(0)
              setStarsEarned({})
              setStreak(0)
            }}>
              <div className="level-animal-svg">
                {getAnimalIcon(n, 64)}
              </div>
              <span className="level-number">{n}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // =====================
  // MISSION MODE
  // =====================
  return (
    <div className="math-tool-container mission-mode">
      <header className="tool-header">
        <button className="btn-exit" onClick={() => setActiveNum(null)}>
          <ArrowLeft size={20} />
          <span>Levels</span>
        </button>

        <button className="tip-btn-circle" onClick={showTip}>
          <Lightbulb size={22} />
        </button>
      </header>

      <div className="mission-content">
        <div className="equation-hero-card card-game">
          {/* Streak indicator */}
          {streak > 1 && (
            <div className="streak-badge"><Flame size={18} /> {streak} in a row!</div>
          )}

          {/* The equation */}
          <div className="equation-main">
            <span className="num">{activeNum}</span>
            <span className="op">×</span>
            <span className="num">{currentFactor}</span>
            <span className="eq">=</span>
            <div className={`result-display ${
              phase === 'celebrate' ? 'revealed' : 'mystery'
            }`}>
              {phase === 'celebrate' ? correctAnswer : '?'}
            </div>
          </div>

          {/* Visual groups */}
          {renderGroups()}

          {/* Phase-specific content */}
          <div className="action-footer">
            {phase === 'learn' && (
              <>
                <p className="phase-instruction">Look at the groups, then test yourself!</p>
                <div className="learn-actions">
                  <button className="btn-game btn-game-teal big-action" onClick={handleRevealAndTry}>
                    I'm Ready to Try! <Zap size={18} />
                  </button>
                  <button className="btn-game btn-game-white speak-btn" onClick={() => speak(`${activeNum} times ${currentFactor}`)}>
                    <Volume2 size={20} /> Hear it
                  </button>
                </div>
              </>
            )}

            {phase === 'try' && (
              <>
                <div className="word-problem-box" style={{ background: '#E8F8F5', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '2px dashed #1ABC9C' }}>
                  <p style={{ fontSize: '1.1rem', margin: 0, color: '#117A65', fontWeight: 'bold' }}>{wordProblem}</p>
                </div>
                <p className="phase-instruction">
                  {attempts === 0 ? 'What is the answer?' : 'Try again! You can do it!'}
                </p>
                <div className="guess-input-group">
                  <input
                    type="number"
                    className="guess-input"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitGuess()}
                    placeholder="?"
                    autoFocus
                    inputMode="numeric"
                  />
                  <button 
                    className="btn-game btn-game-orange big-action"
                    onClick={handleSubmitGuess}
                    disabled={!userGuess}
                  >
                    Check
                  </button>
                </div>
              </>
            )}

            {phase === 'teach' && (
              <div className="teach-phase-footer">
                <h3 style={{ color: '#E67E22', margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
                  {teachStep === 0 && "Let's count..."}
                  {teachStep > 0 && teachStep <= activeNum && `${teachStep} group${teachStep > 1 ? 's' : ''}...`}
                  {teachStep > activeNum && `That makes ${correctAnswer}!`}
                </h3>
              </div>
            )}

            {phase === 'celebrate' && (
              <>
                <div className="celebration">
                  <div className="stars-earned">
                    {[1, 2, 3].map(s => (
                      <Star key={s} size={32} className={`star-icon ${s <= (starsEarned[currentFactor] || 0) ? 'star-filled' : 'star-empty'}`} />
                    ))}
                  </div>
                  <p className="celebrate-text">
                    {starsEarned[currentFactor] === 3 ? <><Sparkles size={18} /> Perfect!</> :
                     starsEarned[currentFactor] === 2 ? 'Great job!' : 'You got it!'}
                  </p>
                </div>
                {currentFactor < 12 ? (
                  <button className="btn-game btn-game-teal big-action pulse-button" onClick={handleNext}>
                    Next →
                  </button>
                ) : (
                  <button className="btn-game btn-game-teal big-action" onClick={handleFinishLevel}>
                    <Trophy size={20} /> Finish Level!
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiplicationTable
