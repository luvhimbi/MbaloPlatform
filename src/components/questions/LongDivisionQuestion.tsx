import React, { useState, useCallback } from 'react'
import type { QuizQuestion } from '../../types/curriculum'
import './LongDivisionQuestion.css'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const LongDivisionQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const dividend = question.dividend ?? 0
  const divisor = question.divisor ?? 1
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null)

  // Shuffle options once
  const [shuffledOptions] = useState(() =>
    [...question.options].sort(() => Math.random() - 0.5)
  )

  const handleDragStart = (e: React.DragEvent, value: string) => {
    if (disabled) return
    e.dataTransfer.setData('text/plain', value)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    const value = e.dataTransfer.getData('text/plain')
    setDroppedAnswer(value)
    setSelectedAnswer(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Also support tap-to-select on mobile
  const handleOptionTap = (value: string) => {
    if (disabled) return
    if (selectedAnswer === value) {
      // Tapping the same option again deselects it
      setSelectedAnswer(null)
    } else {
      setSelectedAnswer(value)
    }
  }

  const handleDropZoneTap = () => {
    if (disabled || !selectedAnswer) return
    setDroppedAnswer(selectedAnswer)
    setSelectedAnswer(null)
  }

  const handleSubmit = () => {
    if (!droppedAnswer || disabled) return
    const isCorrect = droppedAnswer === question.correctAnswer
    onAnswer(isCorrect)
  }

  const handleClearDrop = () => {
    if (disabled) return
    setDroppedAnswer(null)
  }

  const getDropZoneClass = () => {
    let cls = 'division-drop-zone'
    if (droppedAnswer) cls += ' has-answer'
    if (feedback === 'correct') cls += ' is-correct'
    if (feedback === 'incorrect') cls += ' is-incorrect'
    return cls
  }

  return (
    <>
      <h2 className="question-text">{question.question}</h2>

      <div className="division-layout">
        {/* The visual division bracket */}
        <div className="division-bracket">
          <div className={getDropZoneClass()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleDropZoneTap}
          >
            {droppedAnswer ? (
              <span className="dropped-value" onClick={(e) => { e.stopPropagation(); handleClearDrop(); }}>
                {droppedAnswer}
              </span>
            ) : (
              <span className="drop-placeholder">?</span>
            )}
          </div>

          <div className="division-symbol">
            <div className="division-bracket-arm" />
          </div>

          <div className="division-numbers">
            <span className="division-divisor">{divisor}</span>
            <div className="division-bar" />
            <span className="division-dividend">{dividend}</span>
          </div>
        </div>

        <div className="division-equals">
          <span className="equals-text">{dividend} ÷ {divisor} = </span>
          <span className="equals-answer">{droppedAnswer || '?'}</span>
        </div>
      </div>

      {/* Draggable answer options */}
      <div className="division-options">
        {shuffledOptions.map((opt) => (
          <button
            key={opt}
            className={`division-option-chip ${selectedAnswer === opt ? 'is-selected' : ''} ${droppedAnswer === opt ? 'is-used' : ''}`}
            draggable={!disabled && droppedAnswer !== opt}
            onDragStart={(e) => handleDragStart(e, opt)}
            onClick={() => handleOptionTap(opt)}
            disabled={disabled}
          >
            {opt}
          </button>
        ))}
      </div>

      {droppedAnswer && !feedback && (
        <button className="btn-game btn-game-teal btn-check-match" onClick={handleSubmit}>
          Check my answer!
        </button>
      )}
    </>
  )
}

export default LongDivisionQuestion
