import React, { useState, useEffect } from 'react'
import { ArrowLeft, Dices, Play, Volume2, Sparkles, Trophy } from 'lucide-react'
import './AdditionMixer.css'
import mascot from '../assets/mascot.webp'
import { getAnimalIcon, getAnimalName } from './AnimalIcons'
import confetti from 'canvas-confetti'

type Phase = 'setup' | 'guess' | 'teach' | 'celebrate'

const AdditionMixer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [num1, setNum1] = useState<number>(3)
  const [num2, setNum2] = useState<number>(4)
  const [phase, setPhase] = useState<Phase>('setup')
  const [userGuess, setUserGuess] = useState('')
  const [teachStep, setTeachStep] = useState(0)
  const [wordProblem, setWordProblem] = useState('')
  
  const sum = num1 + num2

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
    setNum1(Math.floor(Math.random() * 10) + 1)
    setNum2(Math.floor(Math.random() * 10) + 1)
    speak("Let's mix it up!", 'happy')
  }

  const startGuessing = () => {
    setPhase('guess')
    setUserGuess('')
    
    const animal1 = getAnimalName(num1, num1 !== 1)
    const animal2 = getAnimalName(num2, num2 !== 1)
    
    let problemText = ''
    if (num1 === num2) {
       problemText = `There are ${num1} ${animal1}. Then ${num2} more join them. How many ${animal1} are there in total?`
    } else {
       problemText = `There are ${num1} ${animal1} and ${num2} ${animal2}. How many animals are there in total?`
    }
    setWordProblem(problemText)
    speak(problemText)
  }

  const checkGuess = () => {
    const guess = parseInt(userGuess)
    if (isNaN(guess)) return

    if (guess === sum) {
      speak(`Awesome! ${num1} plus ${num2} is ${sum}! Let's see how it works.`, 'happy')
      setPhase('teach')
      startTeaching()
    } else {
      speak(`Not quite! Let's count them together to find out!`, 'encourage')
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
          speak(`Let's count... Here are ${num1}.`, 'neutral')
        } else if (step === 2) {
          speak(`And here come ${num2} more!`, 'encourage')
        } else if (step === 3) {
          speak(`Putting them together makes ${sum}!`, 'happy')
        } else if (step === 4) {
          speak(`One, two... that makes ${sum} in total!`, 'happy')
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
      <header className="mixer-header">
        <button className="btn-exit" onClick={onBack}><ArrowLeft size={22} /></button>
      </header>

      <div className="mixer-machine">
        {phase === 'setup' && (
          <>
            <button className="random-dice" onClick={handleRandomize} title="Randomize">
              <Dices size={24} />
            </button>
            <h3 className="teach-step-text">Choose numbers to mix!</h3>
            <div className="number-selectors">
              <div className="number-box" onClick={() => setNum1((n) => (n % 10) + 1)}>
                {num1}
              </div>
              <div className="plus-sign">+</div>
              <div className="number-box" onClick={() => setNum2((n) => (n % 10) + 1)}>
                {num2}
              </div>
            </div>
            <button className="mixer-btn" onClick={startGuessing}>
              <Play fill="currentColor" size={20} /> Mix Them Up!
            </button>
          </>
        )}

        {phase === 'guess' && (
          <div className="guess-input-area">
            <div className="word-problem-box" style={{ background: '#FFF3E0', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '2px dashed #E67E22' }}>
              <p style={{ fontSize: '1.2rem', margin: 0, color: '#D35400', fontWeight: 'bold' }}>{wordProblem}</p>
            </div>
            <div className="number-selectors" style={{ marginBottom: '1rem' }}>
              <div className="number-box">{num1}</div>
              <div className="plus-sign">+</div>
              <div className="number-box">{num2}</div>
              <div className="plus-sign">=</div>
              <input 
                type="number" 
                className="addition-guess-input"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                autoFocus
              />
            </div>
            <button className="mixer-btn" onClick={checkGuess} disabled={!userGuess}>
              Check Answer
            </button>
          </div>
        )}

        {(phase === 'teach' || phase === 'celebrate') && (
          <div className="visual-teach-area">
            <h3 className="teach-step-text">
              {teachStep === 0 && "Let's look..."}
              {teachStep === 1 && `Here are ${num1}.`}
              {teachStep === 2 && `And ${num2} more.`}
              {teachStep === 3 && `Putting them together...`}
              {teachStep >= 4 && `${num1} + ${num2} = ${sum}`}
            </h3>

            {teachStep >= 1 && teachStep < 3 && (
              <div className="animal-group">
                {Array.from({ length: num1 }).map((_, i) => (
                  <div key={`n1-${i}`} className="animal-item">
                    {getAnimalIcon(num1, 60)}
                  </div>
                ))}
              </div>
            )}
            
            {teachStep >= 2 && teachStep < 3 && (
              <div className="animal-group" style={{ marginTop: '2rem', borderTop: '2px dashed #E0D5C5', paddingTop: '2rem' }}>
                {Array.from({ length: num2 }).map((_, i) => (
                  <div key={`n2-${i}`} className="animal-item">
                    {getAnimalIcon(num2, 60)}
                  </div>
                ))}
              </div>
            )}

            {teachStep >= 3 && (
              <div className="combine-area">
                <div className="animal-group">
                  {Array.from({ length: num1 }).map((_, i) => (
                    <div key={`c1-${i}`} className="animal-item">
                      {getAnimalIcon(num1, 60)}
                    </div>
                  ))}
                  {Array.from({ length: num2 }).map((_, i) => (
                    <div key={`c2-${i}`} className="animal-item">
                      {getAnimalIcon(num2, 60)}
                    </div>
                  ))}
                </div>
                {teachStep >= 4 && (
                  <div className="total-sum">
                    = {sum}
                  </div>
                )}
              </div>
            )}

            {phase === 'celebrate' && (
              <div style={{ marginTop: '2rem' }}>
                <button className="mixer-btn" onClick={() => setPhase('setup')}>
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

export default AdditionMixer
