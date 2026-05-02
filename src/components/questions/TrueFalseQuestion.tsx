import React, { useState } from 'react'
import type { QuizQuestion } from '../../types/curriculum'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const TrueFalseQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelectedOption(option)
    onAnswer(option === question.correctAnswer)
  }

  return (
    <>
      <h2 className="question-text">{question.question}</h2>
      <div className="true-false-grid">
        <button
          className={`tf-btn tf-true ${selectedOption === 'True'
            ? (feedback === 'correct' ? 'correct' : 'incorrect')
            : (feedback && question.correctAnswer === 'True' ? 'correct' : '')
          }`}
          onClick={() => handleSelect('True')}
          disabled={disabled}
        >
          <ThumbsUp size={40} />
          <span>True</span>
        </button>
        <button
          className={`tf-btn tf-false ${selectedOption === 'False'
            ? (feedback === 'correct' ? 'correct' : 'incorrect')
            : (feedback && question.correctAnswer === 'False' ? 'correct' : '')
          }`}
          onClick={() => handleSelect('False')}
          disabled={disabled}
        >
          <ThumbsDown size={40} />
          <span>False</span>
        </button>
      </div>
    </>
  )
}

export default TrueFalseQuestion
