import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import MissionFeedbackBar from '../components/MissionFeedbackBar'
import MissionCelebration from '../components/MissionCelebration'
import EmojiCountQuestion from '../components/questions/EmojiCountQuestion'
import TrueFalseQuestion from '../components/questions/TrueFalseQuestion'
import SequenceQuestion from '../components/questions/SequenceQuestion'
import DragMatchQuestion from '../components/questions/DragMatchQuestion'
import LongDivisionQuestion from '../components/questions/LongDivisionQuestion'
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion'
import NumberLineQuestion from '../components/questions/NumberLineQuestion'
import PatternGridQuestion from '../components/questions/PatternGridQuestion'
import SumCompositionQuestion from '../components/questions/SumCompositionQuestion'
import { Volume2, Lightbulb, Calculator as CalcIcon, MessageCircleQuestion, ArrowLeft, Plus, Minus } from 'lucide-react'
import type { UserStats } from '../types/user'
import Calculator from '../components/Calculator'
import './Mission.css' // Reuse mission styles
import './Practice.css'
import MultiplicationTable from '../components/MultiplicationTable'
import AdditionMixer from '../components/AdditionMixer'
import SubtractionMixer from '../components/SubtractionMixer'
import DivisionMixer from '../components/DivisionMixer'
import VerticalMixer from '../components/VerticalMixer'
import mascot from '../assets/mascot.webp'
import { Hash, Sparkles, Trophy } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

type PracticeMode = 'hub' | 'personalized' | 'multiplication' | 'addition' | 'subtraction' | 'division' | 'v-addition' | 'v-subtraction'

function Practice() {
  const navigate = useNavigate()
  const { currentUser, loading } = useAuth()
  const quizStartTime = useRef(Date.now())
  
  const [struggles, setStruggles] = useState<UserStats['struggledQuestions']>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const SAVED_PRACTICE_MODE_KEY = 'mbalo_practice_mode'
  const [mode, setMode] = useState<PracticeMode>(() => {
    return (localStorage.getItem(SAVED_PRACTICE_MODE_KEY) as PracticeMode) || 'hub'
  })

  useEffect(() => {
    localStorage.setItem(SAVED_PRACTICE_MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login')
    } else if (currentUser) {
      const userStruggles = currentUser.stats?.struggledQuestions || []
      // Sort by errorCount descending or just use the list
      setStruggles(userStruggles)
    }
  }, [currentUser, loading, navigate])

  const handleSpeak = (text: string, options: string[] = [], isHint: boolean = false) => {
    if (!('speechSynthesis' in window)) return;
    const fullText = isHint ? `Safari Tip: ${text}` : `${text}. Your options are: ${options.join(', ')}`;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const playSound = (type: 'correct' | 'incorrect') => {
    const soundUrls = {
      correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
      incorrect: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'
    };
    const audio = new Audio(soundUrls[type]);
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Sound play prevented:", e));
  };
  const currentStruggle = struggles[currentQuestionIndex]
  const currentQuestion = currentStruggle?.questionData
  const totalQuestions = struggles.length
  const progress = showCelebration ? 100 : ((currentQuestionIndex) / totalQuestions) * 100

  const handleAnswer = async (isCorrect: boolean) => {
    if (feedback) return

    if (isCorrect) {
      setScore(s => s + 1)
      setFeedback('correct')
      setCurrentExplanation(null)
      playSound('correct')
      
      // Clear this struggle since they got it right!
      if (currentUser) {
        await authService.clearStruggle(currentUser.uid, currentStruggle.questionId);
      }
    } else {
      setFeedback('incorrect')
      setCurrentExplanation(currentQuestion.explanation || null)
      playSound('incorrect')
    }
  }

  const handleContinue = () => {
    setFeedback(null)
    setCurrentExplanation(null)
    setShowHint(false)
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(i => i + 1)
    } else {
      setShowCelebration(true)
    }
  }

  const renderQuestion = (question: any) => {
    const disabled = !!feedback
    if (!question) return null;
    
    switch (question.type) {
      case 'emoji-count':
        return <EmojiCountQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'true-false':
        return <TrueFalseQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'sequence':
        return <SequenceQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'drag-match':
        return <DragMatchQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} />
      case 'long-division':
        return <LongDivisionQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'number-line':
        return <NumberLineQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'pattern-grid':
        return <PatternGridQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      case 'sum-composition':
        return <SumCompositionQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
      default:
        return <MultipleChoiceQuestion key={question.id} question={question} onAnswer={handleAnswer} disabled={disabled} feedback={feedback} />
    }
  }

  if (loading) return <div className="quiz-loading">Loading your personalized safari...</div>
  if (mode === 'multiplication') {
    return <MultiplicationTable onBack={() => setMode('hub')} />
  }
  
  if (mode === 'addition') {
    return <AdditionMixer onBack={() => setMode('hub')} />
  }

  if (mode === 'subtraction') {
    return <SubtractionMixer onBack={() => setMode('hub')} />
  }

  if (mode === 'division') {
    return <DivisionMixer onBack={() => setMode('hub')} grade={currentUser?.grade || 1} />
  }

  if (mode === 'v-addition') {
    return <VerticalMixer onBack={() => setMode('hub')} type="addition" />
  }

  if (mode === 'v-subtraction') {
    return <VerticalMixer onBack={() => setMode('hub')} type="subtraction" />
  }

  if (mode === 'hub') {
    return (
      <DashboardLayout>
        <div className="practice-hub-container">
          <header className="hub-header">
            <div className="hub-title-group">
              <h1>Safari Practice Hub</h1>
              <p>Master your math skills with specialized training!</p>
            </div>
          </header>

          <div className="hub-grid">
            <section className="hub-section">
              <div className="section-header">
                <Sparkles className="section-icon text-fun" size={24} />
                <h2>Personalized Training</h2>
              </div>
              <div className={`hub-card practice-personalized-card ${struggles.length === 0 ? 'empty' : ''}`}>
                <div className="card-content">
                  <img src={mascot} alt="Mbalo" className="card-mascot" />
                  <div className="card-text">
                    <h3>Mission Review</h3>
                    <p>
                      {struggles.length > 0 
                        ? `Master ${struggles.length} tricky problems.` 
                        : "No tricky problems!"}
                    </p>
                    <button 
                      className="btn-game btn-game-teal" 
                      onClick={() => struggles.length > 0 && setMode('personalized')}
                      disabled={struggles.length === 0}
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="hub-section">
              <div className="section-header">
                <Trophy className="section-icon text-energy" size={24} />
                <h2>Mastery Tools</h2>
              </div>
              <div className="hub-tools-grid">
                <div className="hub-card tool-card" onClick={() => setMode('multiplication')}>
                  <div className="tool-icon-circle bg-orange">
                    <Hash size={32} />
                  </div>
                  <div className="tool-info">
                    <h3>Multiplication Table</h3>
                    <p>Master tables up to 12.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>

                <div className="hub-card tool-card" onClick={() => setMode('addition')}>
                  <div className="tool-icon-circle bg-blue">
                    <Plus size={32} />
                  </div>
                  <div className="tool-info">
                    <h3>Addition Mixer</h3>
                    <p>Mix numbers in a fun way.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>

                <div className="hub-card tool-card" onClick={() => setMode('subtraction')}>
                  <div className="tool-icon-circle bg-green">
                    <Minus size={32} />
                  </div>
                  <div className="tool-info">
                    <h3>Subtraction Mixer</h3>
                    <p>Take numbers away in a fun way.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>

                <div className="hub-card tool-card" onClick={() => setMode('v-addition')}>
                  <div className="tool-icon-circle bg-orange">
                    <Plus size={32} />
                  </div>
                  <div className="tool-info">
                    <h3>Column Addition</h3>
                    <p>Practice carries and regrouping.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>

                <div className="hub-card tool-card" onClick={() => setMode('v-subtraction')}>
                  <div className="tool-icon-circle bg-green">
                    <Minus size={32} />
                  </div>
                  <div className="tool-info">
                    <h3>Column Subtraction</h3>
                    <p>Practice borrowing and regrouping.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>

                <div className="hub-card tool-card" onClick={() => setMode('division')}>
                  <div className="tool-icon-circle bg-cyan" style={{ backgroundColor: 'var(--mbalo-blue-light)', color: 'var(--mbalo-blue)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>÷</div>
                  </div>
                  <div className="tool-info">
                    <h3>Division Mixer</h3>
                    <p>Share numbers into equal groups.</p>
                    <span className="tool-action">Start →</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // If in personalized mode, show the existing quiz-like interface
  return (
    <div className="quiz-container practice-container">
      <header className="quiz-header">
        <button className="btn-exit" onClick={() => setMode('hub')}>
          <ArrowLeft size={24} />
        </button>
        {!showCelebration && (
          <>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        )}
      </header>

      {!showCelebration ? (
        <div className="quiz-card card-game card-game-white">
          <div className="practice-badge">Personalized Practice</div>
          <div className="quiz-tools-top">
            <button
              className={`tool-btn tts-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={() => handleSpeak(currentQuestion.question, currentQuestion.options)}
            >
              <Volume2 size={24} />
            </button>
          </div>

          {showHint && (
            <div className="hint-bubble pop-in">
              <div className="hint-content">
                <MessageCircleQuestion size={20} className="hint-icon" />
                <p>{currentQuestion.hint || currentQuestion.explanation || "You've got this!"}</p>
              </div>
            </div>
          )}

          {renderQuestion(currentQuestion)}

          <div className="quiz-tools-bottom">
            <button className={`tool-btn hint-btn ${showHint ? 'is-active' : ''}`} onClick={() => setShowHint(!showHint)}>
              <Lightbulb size={24} />
            </button>
            <button className="tool-btn calc-btn-trigger" onClick={() => setShowCalculator(true)}>
              <CalcIcon size={24} />
            </button>
          </div>
        </div>
      ) : (
        <MissionCelebration
          title="Great Practice!"
          text="You're getting stronger with every challenge!"
          lessonTitle="Personalized Review"
          scorePercentage={(score / totalQuestions) * 100}
          score={score}
          totalQuestions={totalQuestions}
          timeTaken={Math.floor((Date.now() - quizStartTime.current) / 1000)}
          onBack={() => setMode('hub')}
          onRetry={() => {
            setCurrentQuestionIndex(0)
            setScore(0)
            setShowCelebration(false)
            setFeedback(null)
            quizStartTime.current = Date.now()
          }}
        />
      )}

      {feedback && (
        <MissionFeedbackBar
          feedback={feedback}
          explanation={currentExplanation}
          onContinue={handleContinue}
        />
      )}

      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
    </div>
  )
}

export default Practice
