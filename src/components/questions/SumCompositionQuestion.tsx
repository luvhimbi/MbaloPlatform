import React, { useState, useEffect } from 'react'
import type { QuizQuestion } from '../../types/curriculum'
import './QuestionTypes.css'

interface Props {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
  feedback: 'correct' | 'incorrect' | null
}

const SumCompositionQuestion: React.FC<Props> = ({ question, onAnswer, disabled, feedback }) => {
  const target = question.sumTarget || 10
  const pieces = question.sumPieces || [3, 2, 5, 5]
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null])
  const [usedPieces, setUsedPieces] = useState<number[]>([]) // Indices of pieces used

  const handlePieceClick = (pieceValue: number, pieceIdx: number) => {
    if (disabled || usedPieces.includes(pieceIdx)) return

    const nextEmptySlot = slots.indexOf(null)
    if (nextEmptySlot !== -1) {
      const newSlots = [...slots]
      newSlots[nextEmptySlot] = pieceValue
      setSlots(newSlots)
      setUsedPieces([...usedPieces, pieceIdx])
    }
  }

  const handleSlotClick = (slotIdx: number) => {
    if (disabled || slots[slotIdx] === null) return

    const pieceValue = slots[slotIdx]
    const newSlots = [...slots]
    newSlots[slotIdx] = null
    setSlots(newSlots)

    // Find the first index in usedPieces that matches this value and remove it
    // Note: this is a bit tricky if there are multiple same-value pieces.
    // Better to store piece index in the slot.
  }

  // Refined state to track piece indices in slots
  const [slotPieceIndices, setSlotPieceIndices] = useState<(number | null)[]>([null, null, null])

  const addPiece = (idx: number) => {
    if (disabled || slotPieceIndices.includes(idx)) return
    const nextSlot = slotPieceIndices.indexOf(null)
    if (nextSlot !== -1) {
      const newSlotIndices = [...slotPieceIndices]
      newSlotIndices[nextSlot] = idx
      setSlotPieceIndices(newSlotIndices)
    }
  }

  const removePiece = (slotIdx: number) => {
    if (disabled || slotPieceIndices[slotIdx] === null) return
    const newSlotIndices = [...slotPieceIndices]
    newSlotIndices[slotIdx] = null
    setSlotPieceIndices(newSlotIndices)
  }

  const checkAnswer = () => {
    const currentSum = slotPieceIndices.reduce((acc, idx) => {
      if (idx === null) return acc
      return (acc || 0) + pieces[idx]
    }, 0)
    onAnswer(currentSum === target)
  }

  const isAllFilled = slotPieceIndices.every(idx => idx !== null)

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
      
      <div className="sum-comp-target bounce-in-up">
        {target}
      </div>

      <div className="sum-comp-slots">
        {slotPieceIndices.map((pieceIdx, i) => (
          <div 
            key={i} 
            className={`sum-slot ${pieceIdx !== null ? 'filled' : ''} ${feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : ''}`}
            onClick={() => removePiece(i)}
          >
            {pieceIdx !== null && <span className="sum-piece-active pop-in">{pieces[pieceIdx]}</span>}
          </div>
        ))}
      </div>

      <div className="sum-comp-pieces">
        {pieces.map((val, idx) => (
          <div 
            key={idx} 
            className={`sum-piece ${slotPieceIndices.includes(idx) ? 'used' : ''}`}
            onClick={() => addPiece(idx)}
          >
            {val}
          </div>
        ))}
      </div>

      {!feedback && isAllFilled && (
        <button className="btn-game btn-game-teal btn-check-sum bounce-in-up" onClick={checkAnswer}>
          Check Answer ✓
        </button>
      )}
    </div>
  )
}

export default SumCompositionQuestion
