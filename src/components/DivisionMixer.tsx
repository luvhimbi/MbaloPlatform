import React, { useState, useEffect } from 'react'
import { ArrowLeft, Dices, Play, Sparkles } from 'lucide-react'
import './DivisionMixer.css'
import { getAnimalIcon, getAnimalName } from './AnimalIcons'
import confetti from 'canvas-confetti'

type Phase = 'setup' | 'guess' | 'teach' | 'celebrate'

interface DivisionMixerProps {
  onBack: () => void;
  grade?: number;
}

const DivisionMixer: React.FC<DivisionMixerProps> = ({ onBack, grade = 1 }) => {
  const [divisor, setDivisor] = useState<number>(3) // Groups
  const [quotient, setQuotient] = useState<number>(4) // Size of each group
  const [phase, setPhase] = useState<Phase>('setup')
  const [userGuess, setUserGuess] = useState('')
  const [teachStep, setTeachStep] = useState(0)
  const [wordProblem, setWordProblem] = useState('')
  
  const dividend = divisor * quotient // Total

  // Adjust difficulty based on grade
  const maxDivisor = grade >= 3 ? 12 : grade === 2 ? 10 : 5;
  const maxQuotient = grade >= 3 ? 12 : grade === 2 ? 10 : 10;

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
    const d = Math.floor(Math.random() * maxDivisor) + 1
    const q = Math.floor(Math.random() * maxQuotient) + 1
    setDivisor(d)
    setQuotient(q)
    speak("Let's mix it up!", 'happy')
  }

  const startGuessing = () => {
    setPhase('guess')
    setUserGuess('')
    
    const animalName = getAnimalName(dividend, true)
    const problemText = `There are ${dividend} ${animalName}. We need to split them equally into ${divisor} groups. How many ${animalName} go in each group?`
    setWordProblem(problemText)
    speak(problemText)
  }

  const checkGuess = () => {
    const guess = parseInt(userGuess)
    if (isNaN(guess)) return

    if (guess === quotient) {
      speak(`Awesome! ${dividend} divided by ${divisor} is ${quotient}! Let's see how it works.`, 'happy')
      setPhase('teach')
      startTeaching()
    } else {
      speak(`Not quite! Let's share them and find out!`, 'encourage')
      setPhase('teach')
      startTeaching()
    }
  }

  const startTeaching = () => {
    setTeachStep(0)

    // Wait for the "Awesome" or "Not quite" speech to finish before starting the sequence
    setTimeout(() => {
      // For large numbers, skip step-by-step animation to save time
      if (dividend > 20) {
         speak(`Let's share them! Each group gets ${quotient}. So ${dividend} divided by ${divisor} is ${quotient}!`, 'happy')
         setTeachStep(divisor);
         setTimeout(() => {
            setPhase('celebrate')
            triggerConfetti()
         }, 4000);
         return;
      }

      speak(`Let's share them into ${divisor} groups!`, 'neutral')
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setTeachStep(step);
        
        if (step <= divisor) {
          speak(`Group ${step} gets ${quotient}.`, 'neutral')
        } else {
          speak(`Each group has ${quotient}! ${dividend} divided by ${divisor} is ${quotient}!`, 'happy')
          clearInterval(interval);
          setTimeout(() => {
            setPhase('celebrate')
            triggerConfetti()
          }, 3500)
        }
      }, 3500)
    }, 3000)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3498DB', '#2980B9', '#F1C40F', '#FF6B6B']
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

  const renderTeachVisuals = () => {
    if (dividend > 20) {
      // Summary view
      return (
        <div className="teach-safari-groups">
          {Array.from({ length: divisor }).map((_, i) => (
            <div key={i} className="teach-safari-group">
               <span style={{ fontWeight: 800, color: 'var(--mbalo-blue-dark)' }}>Group {i+1}</span>
               <div className="teach-group-animals">
                 <div style={{ width: 40, height: 40 }}>{getAnimalIcon(dividend, 40)}</div>
                 <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>x {quotient}</span>
               </div>
            </div>
          ))}
        </div>
      );
    }

    // Step-by-step
    return (
      <div className="teach-safari-groups">
        {Array.from({ length: divisor }).map((_, i) => {
          const isVisible = teachStep > i;
          if (!isVisible) return null;
          
          return (
            <div key={i} className="teach-safari-group">
               <span style={{ fontWeight: 800, color: 'var(--mbalo-blue-dark)' }}>Group {i+1}</span>
               <div className="teach-group-animals">
                 {Array.from({ length: quotient }).map((_, j) => (
                   <div key={j} style={{ width: 30, height: 30, animation: `popIn 0.3s ${j * 0.1}s both` }}>
                     {getAnimalIcon(dividend, 30)}
                   </div>
                 ))}
               </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="division-mixer-container">
      <header className="mixer-header">
        <button className="btn-exit" onClick={onBack}><ArrowLeft size={22} /></button>
      </header>

      <div className="mixer-machine">
        {phase === 'setup' && (
          <>
            <button className="random-dice" onClick={handleRandomize} title="Randomize">
              <Dices size={24} />
            </button>
            <h3 className="teach-step-text" style={{ color: 'var(--mbalo-blue-dark)' }}>Choose numbers to share!</h3>
            <div className="number-selectors">
              <div className="number-box" onClick={() => setQuotient((q) => (q % maxQuotient) + 1)} title="Click to change total">
                {dividend}
              </div>
              <div className="divide-sign">÷</div>
              <div className="number-box" onClick={() => setDivisor((d) => (d % maxDivisor) + 1)} title="Click to change groups">
                {divisor}
              </div>
            </div>
            
            <button className="mixer-btn" onClick={startGuessing}>
              <Play size={24} fill="currentColor" /> Share!
            </button>
          </>
        )}

        {phase === 'guess' && (
          <div className="guess-input-area">
            <h3 className="teach-step-text" style={{ color: 'var(--mbalo-blue-dark)' }}>How many in each group?</h3>
            <div className="number-selectors" style={{ marginBottom: '1rem' }}>
              <div className="number-box" style={{ cursor: 'default' }}>{dividend}</div>
              <div className="divide-sign">÷</div>
              <div className="number-box" style={{ cursor: 'default' }}>{divisor}</div>
            </div>
            
            <div className="word-problem-box" style={{ background: '#EBF5FB', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '2px dashed #3498DB', maxWidth: '600px' }}>
              <p style={{ fontSize: '1.2rem', margin: 0, color: '#2980B9', fontWeight: 'bold' }}>{wordProblem}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                className="division-guess-input"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                placeholder="?"
                autoFocus
              />
              <button className="mixer-btn" onClick={checkGuess}>
                Check
              </button>
            </div>
          </div>
        )}

        {phase === 'teach' && (
          <div className="visual-teach-area">
            <h3 className="teach-step-text">Sharing {dividend} into {divisor} groups!</h3>
            {renderTeachVisuals()}
          </div>
        )}

        {phase === 'celebrate' && (
          <div className="combine-area">
            <Sparkles size={48} color="#3498DB" className="pulse" style={{ margin: '0 auto' }} />
            <h2 style={{ color: 'var(--mbalo-blue-dark)', fontSize: '2.5rem', margin: '1rem 0' }}>You did it!</h2>
            <div className="total-sum" style={{ color: 'var(--mbalo-blue)' }}>{dividend} ÷ {divisor} = {quotient}</div>
            <button className="mixer-btn" onClick={() => {
              setPhase('setup')
              handleRandomize()
            }} style={{ marginTop: '2rem' }}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DivisionMixer
