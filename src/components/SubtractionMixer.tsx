import React, { useState } from 'react'
import { ArrowLeft, Dices, Play, Sparkles } from 'lucide-react'
import './SubtractionMixer.css'
import { getAnimalIcon, getAnimalName } from './AnimalIcons'
import confetti from 'canvas-confetti'

type Phase = 'setup' | 'guess' | 'teach' | 'celebrate'

const SubtractionMixer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [num1, setNum1] = useState<number>(7)
  const [num2, setNum2] = useState<number>(3)
  const [phase, setPhase] = useState<Phase>('setup')
  const [userGuess, setUserGuess] = useState('')
  const [teachStep, setTeachStep] = useState(0)
  const [wordProblem, setWordProblem] = useState('')
  
  const difference = num1 - num2

  const speak = (text: string, mood: 'happy' | 'encourage' | 'neutral' = 'neutral') => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (mood === 'happy') {
      u.rate = 1.0; u.pitch = 1.4; u.volume = 1;
    } else if (mood === 'encourage') {
      u.rate = 0.9; u.pitch = 1.2; u.volume = 1;
    } else {
      u.rate = 0.85; u.pitch = 1.0; u.volume = 0.9;
    }
    window.speechSynthesis.speak(u)
  }

  const handleRandomize = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * a) // Ensure b <= a
    setNum1(a)
    setNum2(b)
    speak("Let's mix it up!", 'happy')
  }

  const startGuessing = () => {
    setPhase('guess')
    setUserGuess('')
    
    const animal1 = getAnimalName(num1, true) // Always use plural for the group
    const problemText = `There are ${num1} ${animal1}. Then ${num2} run away. How many ${animal1} are left?`
    setWordProblem(problemText)
    speak(problemText)
  }

  const checkGuess = () => {
    const guess = parseInt(userGuess)
    if (isNaN(guess)) return

    if (guess === difference) {
      speak(`Awesome! ${num1} minus ${num2} is ${difference}! Let's see how it works.`, 'happy')
      setPhase('teach')
      startTeaching()
    } else {
      speak(`Not quite! Let's take some away together and find out!`, 'encourage')
      setPhase('teach')
      startTeaching()
    }
  }

  const startTeaching = () => {
    setTeachStep(0)
    
    // Wait for initial feedback speech to finish
    setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setTeachStep(step);
        
        if (step === 1) {
          const animal1 = getAnimalName(num1, true)
          speak(`Here are ${num1} ${animal1}.`, 'neutral')
        } else if (step === 2) {
          speak(`Now, let's take ${num2} away.`, 'encourage')
        } else if (step === 3) {
          speak(`We are left with ${difference}!`, 'happy')
          clearInterval(interval);
          setTimeout(() => {
            setPhase('celebrate')
            triggerConfetti()
          }, 3000)
        }
      }, 3500)
    }, 3000)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D5A27', '#E67E22', '#F1C40F', '#FF6B6B']
    })
    try {
      const ctx = new AudioContext()
      const notes = [523, 659, 784, 1046]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4)
        osc.connect(gain).connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.4)
      })
    } catch {}
  }

  return (
    <div className="addition-mixer-container">
      <header className="mixer-header" style={{ background: 'transparent', boxShadow: 'none', padding: 0, justifyContent: 'flex-start' }}>
        <button className="btn-exit" onClick={onBack}><ArrowLeft size={22} /></button>
      </header>

      <div className="mixer-machine">
        {phase === 'setup' && (
          <>
            <button className="random-dice" onClick={handleRandomize} title="Randomize">
              <Dices size={24} />
            </button>
            <h3 className="teach-step-text">Choose numbers to subtract!</h3>
            <div className="number-selectors">
              <div className="number-box" onClick={() => setNum1((n) => (n % 10) + 1)}>
                {num1}
              </div>
              <div className="plus-sign" style={{ color: '#E74C3C' }}>-</div>
              <div className="number-box" onClick={() => {
                const next = (num2 + 1) % (num1 + 1);
                setNum2(next);
              }}>
                {num2}
              </div>
            </div>
            <button className="mixer-btn" style={{ background: '#E74C3C', boxShadow: '0 6px 0 #C0392B' }} onClick={startGuessing}>
              <Play fill="currentColor" size={20} /> Take Them Away!
            </button>
          </>
        )}

        {phase === 'guess' && (
          <div className="guess-input-area">
            <div className="word-problem-box" style={{ background: '#E8F6F3', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '2px dashed #1ABC9C' }}>
              <p style={{ fontSize: '1.2rem', margin: 0, color: '#16A085', fontWeight: 'bold' }}>{wordProblem}</p>
            </div>
            <div className="number-selectors" style={{ marginBottom: '1rem' }}>
              <div className="number-box">{num1}</div>
              <div className="plus-sign" style={{ color: '#E74C3C' }}>-</div>
              <div className="number-box">{num2}</div>
              <div className="plus-sign">=</div>
              <input 
                type="number" 
                className="subtraction-guess-input"
                style={{
                  fontSize: '2.5rem', textAlign: 'center', width: '150px',
                  border: '4px solid #E0D5C5', borderRadius: '20px', padding: '1rem',
                  outline: 'none', fontFamily: "'Fredoka', sans-serif", color: '#5D4037', fontWeight: 900
                }}
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                autoFocus
              />
            </div>
            <button className="mixer-btn" style={{ background: '#E74C3C', boxShadow: '0 6px 0 #C0392B' }} onClick={checkGuess} disabled={!userGuess}>
              Check Answer
            </button>
          </div>
        )}

        {(phase === 'teach' || phase === 'celebrate') && (
          <div className="visual-teach-area">
            <h3 className="teach-step-text">
              {teachStep === 0 && "Let's look..."}
              {teachStep === 1 && `Here are ${num1}.`}
              {teachStep === 2 && `Taking away ${num2}...`}
              {teachStep >= 3 && `${num1} - ${num2} = ${difference}`}
            </h3>

            {teachStep >= 1 && (
              <div className="animal-group" style={{ position: 'relative' }}>
                {Array.from({ length: num1 }).map((_, i) => {
                  const isTakenAway = teachStep >= 2 && i >= difference;
                  return (
                    <div 
                      key={`n1-${i}`} 
                      className="animal-item"
                      style={{
                        transition: 'all 1s ease',
                        opacity: isTakenAway ? 0.3 : 1,
                        transform: isTakenAway ? 'scale(0.8) translateY(20px)' : 'scale(1)',
                        filter: isTakenAway ? 'grayscale(100%)' : 'none'
                      }}
                    >
                      {getAnimalIcon(num1, 60)}
                      {isTakenAway && (
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#E74C3C', fontSize: '3rem', fontWeight: 900
                        }}>
                          X
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {teachStep >= 3 && (
              <div className="combine-area">
                <div className="total-sum">
                  = {difference}
                </div>
              </div>
            )}

            {phase === 'celebrate' && (
              <div style={{ marginTop: '2rem' }}>
                <button className="mixer-btn" style={{ background: '#E74C3C', boxShadow: '0 6px 0 #C0392B' }} onClick={() => setPhase('setup')}>
                  <Sparkles size={20} /> Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubtractionMixer
