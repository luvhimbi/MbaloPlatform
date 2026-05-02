import React, { useState } from 'react'
import type { QuizQuestion } from '../../types/curriculum'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const SequenceQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelectedOption(option)
    onAnswer(option === question.correctAnswer)
  }

  return (
    <>
      <h2 className="question-text">{question.question}</h2>
      {question.sequence && (
        <div className="sequence-display">
          {question.sequence.map((num, i) => (
            <div key={i} className={`sequence-bubble ${num === -1 ? 'missing' : ''}`}>
              {num === -1 ? '?' : num}
            </div>
          ))}
          {/* If the sequence doesn't have a -1 (missing), show "?" at end */}
          {question.sequence.every(n => n !== -1) && (
            <div className="sequence-bubble missing">?</div>
          )}
        </div>
      )}
      <div className="options-grid">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            className={`option-btn ${selectedOption === option
              ? (feedback === 'correct' ? 'correct' : 'incorrect')
              : (feedback && option === question.correctAnswer ? 'correct' : '')
            }`}
            onClick={() => handleSelect(option)}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  )
}

export default SequenceQuestion
