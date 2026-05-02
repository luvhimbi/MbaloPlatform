import React, { useState, useEffect } from 'react'
import type { QuizQuestion } from '../../types/curriculum'
import './QuestionTypes.css'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const NumberLineQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const config = question.numberLineConfig || { min: 0, max: 10, step: 1 }
  const [selectedValue, setSelectedValue] = useState<number | null>(null)

  const range = config.max - config.min
  const steps = range / config.step
  
  const handleSelect = (value: number) => {
    if (disabled) return
    setSelectedValue(value)
    onAnswer(value.toString() === question.correctAnswer)
  }

  // Calculate position percentage
  const getPos = (val: number) => ((val - config.min) / range) * 100

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
      
      <div className="number-line-wrapper">
        <div className="number-line-display">
          <div className="number-line-axis">
            {/* Main Ticks */}
            {Array.from({ length: steps + 1 }).map((_, i) => {
              const val = config.min + (i * config.step)
              return (
                <div 
                  key={i} 
                  className="number-line-tick" 
                  style={{ left: `${getPos(val)}%` }}
                >
                  <span className="number-line-label">{val}</span>
                </div>
              )
            })}
            
            {/* Selected Indicator */}
            {selectedValue !== null && (
              <div 
                className={`number-line-indicator pop-in ${feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : ''}`}
                style={{ left: `${getPos(selectedValue)}%` }}
              >
                <div className="indicator-bubble">?</div>
                <div className="indicator-stem"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="options-grid">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            className={`option-btn ${selectedValue?.toString() === option
              ? (feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : '')
              : (feedback && option === question.correctAnswer ? 'correct' : '')
            }`}
            onClick={() => handleSelect(Number(option))}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NumberLineQuestion
