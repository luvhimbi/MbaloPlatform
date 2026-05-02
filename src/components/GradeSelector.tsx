import React from 'react'
import { BookOpen, Egg, Rabbit, Bird, Fish, TreePine, Mountain, Crown } from 'lucide-react'
import mascot from '../assets/mascot.webp'
import './GradeSelector.css'

interface GradeSelectorProps {
  isOpen: boolean
  onClose: () => void
  currentGrade: number
  onGradeChange: (grade: number) => void
  isUpdating: boolean
}

const GRADE_ICONS = [Egg, Rabbit, Bird, Fish, TreePine, Mountain, Crown]
const GRADE_LABELS = ['Hatchling', 'Explorer', 'Flyer', 'Swimmer', 'Ranger', 'Climber', 'Champion']

const GradeSelector: React.FC<GradeSelectorProps> = ({
  isOpen,
  onClose,
  currentGrade,
  onGradeChange,
  isUpdating
}) => {
  if (!isOpen) return null

  const handleSelect = (grade: number) => {
    onGradeChange(grade)
    onClose()
  }

  return (
    <div className="grade-selector-overlay" onClick={onClose}>
      <div className="grade-selector-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        
        <div className="sheet-header">
          <img src={mascot} alt="Safari Dog" className="sheet-mascot" />
          <div>
            <h2>Pick your Safari Level!</h2>
            <p>Choose the right grade for your math missions</p>
          </div>
        </div>

        <div className="grade-cards-grid">
          {[1, 2, 3, 4, 5, 6, 7].map((g) => {
            const Icon = GRADE_ICONS[g - 1]
            return (
              <button
                key={g}
                className={`grade-card ${currentGrade === g ? 'active' : ''}`}
                onClick={() => handleSelect(g)}
                disabled={isUpdating}
              >
                <Icon size={32} className="grade-icon" />
                <span className="grade-number">Grade {g}</span>
                <span className="grade-sublabel">{GRADE_LABELS[g - 1]}</span>
                {currentGrade === g && <span className="current-badge">Current</span>}
              </button>
            )
          })}
        </div>

        <button className="sheet-close-btn" onClick={onClose}>
          <BookOpen size={18} />
          Keep Current Level
        </button>
      </div>
    </div>
  )
}

export default GradeSelector
