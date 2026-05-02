import React, { useState } from 'react'
import type { QuizQuestion } from '../../types/curriculum'
import './QuestionTypes.css'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const PatternGridQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const pattern = question.patternGrid || []

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelectedOption(option)
    onAnswer(option === question.correctAnswer)
  }

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
      
      <div className="pattern-grid">
        {pattern.map((item, idx) => (
          <div key={idx} className="pattern-cell bounce-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            {item}
          </div>
        ))}
        <div className={`pattern-cell question-mark pulse ${feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : ''}`}>
          {selectedOption || '???'}
        </div>
      </div>

      <div className="options-grid">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            className={`option-btn ${selectedOption === option
              ? (feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : '')
              : (feedback && option === question.correctAnswer ? 'correct' : '')
            }`}
            onClick={() => handleSelect(option)}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PatternGridQuestion
