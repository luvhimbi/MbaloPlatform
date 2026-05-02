import React from 'react'
import mascotCheering from '../assets/mascot-cheering.webp'
import mascot from '../assets/mascot.webp'

interface QuizFeedbackBarProps {
  feedback: 'correct' | 'incorrect'
  explanation?: string | null
  onContinue: () => void
}

const QuizFeedbackBar: React.FC<QuizFeedbackBarProps> = ({ feedback, explanation, onContinue }) => {
  return (
    <div className={`quiz-feedback-bar ${feedback} slide-up`}>
      <div className="feedback-bar-content">
        <div className="feedback-mascot-info">
          <img 
            src={feedback === 'correct' ? mascotCheering : mascot} 
            alt="Feedback Mascot" 
            className="bar-mascot-img" 
          />
          <div className="bar-speech-bubble">
            <h3>{feedback === 'correct' ? 'Amazing job!' : 'Keep going!'}</h3>
            <p>
              {feedback === 'correct' 
                ? 'You found the right path! 🌟' 
                : explanation || 'So close! Let\'s try another one! ✨'
              }
            </p>
          </div>
        </div>
        <button className={`btn-game ${feedback === 'correct' ? 'btn-game-teal' : 'btn-game-orange'} btn-continue-bar`} onClick={onContinue}>
          Continue ➔
        </button>
      </div>
    </div>
  )
}

export default QuizFeedbackBar
