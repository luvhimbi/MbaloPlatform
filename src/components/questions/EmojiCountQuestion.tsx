import React, { useState } from 'react'
import type { QuizQuestion } from '../../types/curriculum'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const EmojiCountQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const emojis = Array(question.emojiCount || 0).fill(question.emoji || '🍎')

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelectedOption(option)
    onAnswer(option === question.correctAnswer)
  }

  return (
    <>
      <h2 className="question-text">{question.question}</h2>
      <div className="emoji-display">
        {emojis.map((e, i) => (
          <span key={i} className="emoji-item pop-in" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
        ))}
      </div>
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

export default EmojiCountQuestion
