import React, { useEffect } from 'react'
import mascotCheering from '../assets/mascot-cheering.webp'
import mascot from '../assets/mascot.webp'
import confetti from 'canvas-confetti'
import { RotateCcw } from 'lucide-react'

interface QuizCelebrationProps {
  title: string
  text: string
  lessonTitle: string
  onBack: () => void
  onRetry: () => void
  scorePercentage: number
  score: number
  totalQuestions: number
  timeTaken: number // in seconds
}

const QuizCelebration: React.FC<QuizCelebrationProps> = ({ 
  title, 
  text, 
  lessonTitle, 
  onBack, 
  onRetry,
  scorePercentage,
  score,
  totalQuestions,
  timeTaken
}) => {
  useEffect(() => {
    if (scorePercentage >= 50) {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#009688', '#FFC107'] // Mbalo Safari palette
      });
      
      // Play victory sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(e => console.log("Sound play prevented:", e));
    }
  }, [scorePercentage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pointsEarned = Math.round((score / totalQuestions) * 100); // Mock points
  return (
    <div className="celebration-screen pop-in">
      <h1 className={scorePercentage < 50 ? 'text-try-again' : ''}>{title}</h1>
      <img 
        src={scorePercentage >= 50 ? mascotCheering : mascot} 
        alt="Mascot" 
        className="mascot-celebration" 
      />
      <p className="question-text">{text}</p>
      
      <div className="celebration-actions">
        <button className="btn-game btn-game-primary" onClick={onBack}>
          Back to Dashboard
        </button>
        {scorePercentage < 100 && (
          <button className="btn-game btn-game-outline" onClick={onRetry}>
            <RotateCcw size={18} style={{marginRight: '8px'}} />
            Try Again
          </button>
        )}
      </div>

      <div className="celebration-stats-container">
        <div className="stats-box">
          <span className="stats-value">{scorePercentage}%</span>
          <span className="stats-label">Accuracy</span>
        </div>
        <div className="stats-divider"></div>
        <div className="stats-box">
          <span className="stats-value">{formatTime(timeTaken)}</span>
          <span className="stats-label">Time</span>
        </div>
        <div className="stats-divider"></div>
        <div className="stats-box">
          <span className="stats-value">{score} / {totalQuestions}</span>
          <span className="stats-label">Score</span>
        </div>
      </div>

      <p className="lesson-completed-text">You completed <strong>{lessonTitle}</strong>!</p>
    </div>
  )
}

export default QuizCelebration
