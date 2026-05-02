import React, { useState, useCallback } from 'react'
import type { QuizQuestion } from '../../types/curriculum'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
}

const DragMatchQuestion: React.FC<Props> = ({ question, onAnswer, disabled }) => {
  const pairs = question.matchPairs || []
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Shuffle the right-side items
  const [shuffledRight] = useState(() =>
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  )

  const handleLeftClick = useCallback((left: string) => {
    if (disabled || submitted) return
    setSelectedLeft(left)
  }, [disabled, submitted])

  const handleRightClick = useCallback((right: string) => {
    if (disabled || submitted || !selectedLeft) return

    setMatches(prev => {
      const newMatches = { ...prev }
      // Remove any existing match for this left or right
      Object.keys(newMatches).forEach(k => {
        if (newMatches[k] === right) delete newMatches[k]
      })
      newMatches[selectedLeft] = right
      return newMatches
    })
    setSelectedLeft(null)
  }, [disabled, submitted, selectedLeft])

  const handleSubmit = () => {
    if (submitted) return
    setSubmitted(true)

    const allCorrect = pairs.every(pair => matches[pair.left] === pair.right)
    onAnswer(allCorrect)
  }

  const isMatched = (right: string) => Object.values(matches).includes(right)
  const getMatchColor = (left: string) => {
    if (!matches[left]) return ''
    const colors = ['match-color-1', 'match-color-2', 'match-color-3', 'match-color-4']
    const idx = pairs.findIndex(p => p.left === left)
    return colors[idx % colors.length]
  }

  const getRightMatchColor = (right: string) => {
    const left = Object.keys(matches).find(k => matches[k] === right)
    if (!left) return ''
    return getMatchColor(left)
  }

  const allMatched = pairs.length > 0 && Object.keys(matches).length === pairs.length

  return (
    <>
      <h2 className="question-text">{question.question}</h2>
      <div className="match-container">
        <div className="match-column">
          {pairs.map((pair) => (
            <button
              key={pair.left}
              className={`match-item match-left ${selectedLeft === pair.left ? 'selected' : ''} ${getMatchColor(pair.left)} ${submitted && matches[pair.left] === pair.right ? 'correct' : ''} ${submitted && matches[pair.left] && matches[pair.left] !== pair.right ? 'incorrect' : ''}`}
              onClick={() => handleLeftClick(pair.left)}
              disabled={disabled || submitted}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="match-lines" />
        <div className="match-column">
          {shuffledRight.map((right) => (
            <button
              key={right}
              className={`match-item match-right ${isMatched(right) ? 'matched' : ''} ${getRightMatchColor(right)} ${selectedLeft ? 'awaiting' : ''}`}
              onClick={() => handleRightClick(right)}
              disabled={disabled || submitted || !selectedLeft}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
      {allMatched && !submitted && (
        <button className="btn-game btn-game-teal btn-check-match" onClick={handleSubmit}>
          Check my answers! ✓
        </button>
      )}
    </>
  )
}

export default DragMatchQuestion
