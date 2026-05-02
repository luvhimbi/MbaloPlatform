import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, RefreshCw, Calculator as CalcIcon, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import confetti from 'canvas-confetti'
import Calculator from './Calculator'
import './VerticalMixer.css'

interface Props {
  onBack: () => void
  type: 'addition' | 'subtraction'
}

const VerticalMixer: React.FC<Props> = ({ onBack, type }) => {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [message, setMessage] = useState('')
  const [score, setScore] = useState(0)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // We use a fixed number of columns (3) for 2-digit problems.
  // Columns are indexed RIGHT to LEFT: col 0 = ones, col 1 = tens, col 2 = hundreds (carry/overflow)
  const NUM_COLS = 3

  // State for each column's answer digit and carry
  const [answerDigits, setAnswerDigits] = useState<string[]>(Array(NUM_COLS).fill(''))
  const [carryDigits, setCarryDigits] = useState<string[]>(Array(NUM_COLS).fill(''))

  // Refs for auto-focus
  const answerRefs = useRef<(HTMLInputElement | null)[]>([])
  const carryRefs = useRef<(HTMLInputElement | null)[]>([])

  const generateProblem = useCallback(() => {
    let n1: number, n2: number
    if (type === 'addition') {
      n1 = Math.floor(Math.random() * 90) + 10
      n2 = Math.floor(Math.random() * 90) + 10
    } else {
      n1 = Math.floor(Math.random() * 90) + 10
      n2 = Math.floor(Math.random() * (n1 - 10)) + 10
    }
    setNum1(n1)
    setNum2(n2)
    setAnswerDigits(Array(NUM_COLS).fill(''))
    setCarryDigits(Array(NUM_COLS).fill(''))
    setIsCorrect(null)
    setShowHint(false)
    setMessage(type === 'addition' ? 'Add column by column, right to left!' : 'Subtract column by column, right to left!')
  }, [type])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  // Get individual digits of a number, padded to NUM_COLS, indexed right-to-left
  const getDigitsRTL = (n: number): string[] => {
    const s = n.toString()
    const result: string[] = []
    for (let i = s.length - 1; i >= 0; i--) {
      result.push(s[i])
    }
    while (result.length < NUM_COLS) result.push('')
    return result
  }

  const n1Digits = getDigitsRTL(num1)
  const n2Digits = getDigitsRTL(num2)

  const handleCheck = () => {
    let answerStr = ''
    for (let i = NUM_COLS - 1; i >= 0; i--) {
      answerStr += answerDigits[i] || '0'
    }
    const answer = parseInt(answerStr)
    const expected = type === 'addition' ? num1 + num2 : num1 - num2

    if (answer === expected) {
      setIsCorrect(true)
      setMessage('Safari Success! You nailed it! 🦒')
      setScore(s => s + 1)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    } else {
      setIsCorrect(false)
      setMessage(`Not quite! The answer is ${expected}. Try the next one!`)
    }
  }

  const updateAnswer = (colIndex: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...answerDigits]
    next[colIndex] = val
    setAnswerDigits(next)
    if (val && colIndex < NUM_COLS - 1) {
      answerRefs.current[colIndex + 1]?.focus()
    }
  }

  const updateCarry = (colIndex: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...carryDigits]
    next[colIndex] = val
    setCarryDigits(next)
  }

  // Build hint text based on the current problem
  const getHintSteps = () => {
    const d1 = n1Digits // right-to-left
    const d2 = n2Digits

    if (type === 'addition') {
      const onesSum = parseInt(d1[0]) + parseInt(d2[0])
      const hasCarry = onesSum >= 10
      return [
        { step: 1, label: 'Ones column', text: `Add the ones: ${d1[0]} + ${d2[0]} = ${onesSum}. ${hasCarry ? `Write ${onesSum % 10} below and carry ${Math.floor(onesSum / 10)} to the tens.` : `Write ${onesSum} below.`}` },
        { step: 2, label: 'Tens column', text: `Add the tens: ${d1[1]} + ${d2[1]}${hasCarry ? ` + 1 (carry)` : ''}. Write the result below.` },
        { step: 3, label: 'Check', text: `If the tens add up to 10 or more, write the ones digit below and carry 1 to the hundreds column.` },
      ]
    } else {
      const needsBorrow = parseInt(d1[0]) < parseInt(d2[0])
      return [
        { step: 1, label: 'Ones column', text: `Subtract the ones: ${d1[0]} − ${d2[0]}. ${needsBorrow ? `Since ${d1[0]} < ${d2[0]}, borrow 1 from the tens. Now it's ${parseInt(d1[0]) + 10} − ${d2[0]} = ${parseInt(d1[0]) + 10 - parseInt(d2[0])}.` : `${d1[0]} − ${d2[0]} = ${parseInt(d1[0]) - parseInt(d2[0])}.`}` },
        { step: 2, label: 'Tens column', text: `Subtract the tens: ${d1[1]}${needsBorrow ? ` − 1 (borrowed)` : ''} − ${d2[1]}. Write the result below.` },
        { step: 3, label: 'Check', text: `If the top digit is smaller than the bottom, you need to borrow from the next column.` },
      ]
    }
  }

  // Convert right-to-left arrays to left-to-right for display
  const displayN1 = [...n1Digits].reverse()
  const displayN2 = [...n2Digits].reverse()
  const displayAnswer = [...answerDigits].reverse()
  const displayCarry = [...carryDigits].reverse()

  return (
    <div className="mixer-layout vertical-mixer">
      <header className="mixer-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="mixer-title">
          <h2>Column {type === 'addition' ? 'Addition' : 'Subtraction'}</h2>
        </div>
        <div className="mixer-stats">
          <div className="stat-pill">
            <RefreshCw size={18} />
            <span>Solved: {score}</span>
          </div>
        </div>
      </header>

      <main className="mixer-main">
        <div className="vm-card">
          {/* The grid */}
          <div className="vm-grid" style={{ gridTemplateColumns: `48px repeat(${NUM_COLS}, 72px)` }}>
            
            {/* Row 1: Carry / Borrow */}
            <div className="vm-cell vm-op-cell" />
            {displayCarry.map((c, i) => (
              <div key={`carry-${i}`} className="vm-cell vm-carry-cell">
                <input
                  ref={el => { carryRefs.current[NUM_COLS - 1 - i] = el }}
                  type="text"
                  inputMode="numeric"
                  className="vm-carry-input"
                  value={c}
                  onChange={(e) => updateCarry(NUM_COLS - 1 - i, e.target.value)}
                  maxLength={1}
                />
              </div>
            ))}

            {/* Row 2: First number */}
            <div className="vm-cell vm-op-cell" />
            {displayN1.map((d, i) => (
              <div key={`n1-${i}`} className="vm-cell vm-digit-cell">
                <span className="vm-digit">{d}</span>
              </div>
            ))}

            {/* Row 3: Operator + Second number */}
            <div className="vm-cell vm-op-cell">
              <span className="vm-operator">{type === 'addition' ? '+' : '−'}</span>
            </div>
            {displayN2.map((d, i) => (
              <div key={`n2-${i}`} className="vm-cell vm-digit-cell">
                <span className="vm-digit">{d}</span>
              </div>
            ))}

            {/* Row 4: Divider */}
            <div className="vm-divider" style={{ gridColumn: `1 / -1` }} />

            {/* Row 5: Answer inputs */}
            <div className="vm-cell vm-op-cell" />
            {displayAnswer.map((a, i) => (
              <div key={`ans-${i}`} className="vm-cell vm-answer-cell">
                <input
                  ref={el => { answerRefs.current[NUM_COLS - 1 - i] = el }}
                  type="text"
                  inputMode="numeric"
                  className={`vm-answer-input ${isCorrect === true ? 'success' : isCorrect === false ? 'error' : ''}`}
                  value={a}
                  onChange={(e) => updateAnswer(NUM_COLS - 1 - i, e.target.value)}
                  maxLength={1}
                />
              </div>
            ))}
          </div>

          {/* Tools row */}
          <div className="vm-tools-row">
            <button 
              className={`vm-tool-btn ${showHint ? 'active' : ''}`} 
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb size={20} />
              <span>How it works</span>
              {showHint ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button 
              className="vm-tool-btn" 
              onClick={() => setShowCalculator(true)}
            >
              <CalcIcon size={20} />
              <span>Calculator</span>
            </button>
          </div>

          {/* Hint modal */}
          {showHint && (
            <div className="vm-hint-overlay" onClick={() => setShowHint(false)}>
              <div className="vm-hint-modal" onClick={(e) => e.stopPropagation()}>
                <div className="vm-hint-modal-header">
                  <h4 className="vm-hint-title">
                    {type === 'addition' ? '➕ How to Add Columns' : '➖ How to Subtract Columns'}
                  </h4>
                  <button className="vm-hint-close" onClick={() => setShowHint(false)}>✕</button>
                </div>
                <div className="vm-hint-steps">
                  {getHintSteps().map((s) => (
                    <div key={s.step} className="vm-hint-step">
                      <div className="vm-hint-step-num">{s.step}</div>
                      <div className="vm-hint-step-body">
                        <strong>{s.label}</strong>
                        <p>{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-game btn-game-outline vm-hint-got-it" onClick={() => setShowHint(false)}>
                  Got it!
                </button>
              </div>
            </div>
          )}

          {/* Feedback & buttons */}
          <div className="vm-controls">
            <p className={`vm-message ${isCorrect === true ? 'success' : isCorrect === false ? 'error' : ''}`}>
              {message}
            </p>
            <div className="vm-btn-row">
              <button className="btn-game btn-game-primary" onClick={handleCheck}>
                Check Answer
              </button>
              <button className="btn-game btn-game-outline" onClick={generateProblem}>
                Next Mission
              </button>
            </div>
          </div>
        </div>
      </main>

      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
    </div>
  )
}

export default VerticalMixer
