import React from 'react'
import mascotCheering from '../assets/mascot-cheering.webp'
import mascot from '../assets/mascot.webp'
import { CheckCircle2, XCircle } from 'lucide-react'
import Lottie from 'lottie-react'

interface MissionFeedbackBarProps {
  feedback: 'correct' | 'incorrect'
  explanation?: string | null
  onContinue: () => void
}

const MissionFeedbackBar: React.FC<MissionFeedbackBarProps> = ({ feedback, explanation, onContinue }) => {
  const [checkAnim, setCheckAnim] = React.useState<any>(null);

  React.useEffect(() => {
    if (feedback === 'correct') {
      fetch('https://assets9.lottiefiles.com/packages/lf20_rc5d0f61.json')
        .then(res => res.json())
        .then(data => setCheckAnim(data))
        .catch(e => console.log('Lottie fetch failed', e));
    }
  }, [feedback]);

  const isCorrect = feedback === 'correct'

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
            <div className="feedback-message">
              {isCorrect ? (
                <>
                  {checkAnim ? (
                    <div style={{ width: 40, height: 40, marginRight: 8 }}>
                      <Lottie animationData={checkAnim} loop={false} />
                    </div>
                  ) : (
                    <CheckCircle2 size={24} />
                  )}
                  <h3>Combo Strike!</h3>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <h3>Oops! Let's try again.</h3>
                </>
              )}
            </div>
            <p>
              {feedback === 'correct' 
                ? 'You found the right path! 🌟' 
                : explanation || 'Not quite this time, but you are learning with every step! ✨'
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

export default MissionFeedbackBar
