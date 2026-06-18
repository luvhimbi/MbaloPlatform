import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { curriculumService } from '../services/curriculumService'
import type { Lesson, QuizQuestion } from '../types/curriculum'
import mascot from '../assets/mascot.webp'
import mascotSad from '../assets/mascot-sad.webp'
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
import { Volume2, Lightbulb, Calculator as CalcIcon, MessageCircleQuestion } from 'lucide-react'
import Calculator from '../components/Calculator'
import './Mission.css'
import { authService } from '../services/authService'

function Mission() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const quizStartTime = useRef(Date.now())
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [parentModule, setParentModule] = useState<any | null>(null)
  const [parentChapter, setParentChapter] = useState<any | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)


  // Ensure voices are loaded for TTS
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Restore progress from localStorage
  useEffect(() => {
    if (!lessonId) return;
    const saved = localStorage.getItem(`quiz_progress_${lessonId}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.done) {
          // If it was already done, we don't restore it anymore as per user request
          // This ensures a fresh start when they click review
          return;
        }
        setCurrentQuestionIndex(data.index || 0);
        setScore(data.score || 0);
        if (data.startTime) quizStartTime.current = data.startTime;
      } catch (e) {
        console.error("Failed to restore safari progress:", e);
      }
    }
  }, [lessonId]);

  // Save progress to localStorage
  useEffect(() => {
    if (!lessonId || !lesson) return;
    const data = {
      index: currentQuestionIndex,
      score: score,
      startTime: quizStartTime.current,
      done: showCelebration
    };
    localStorage.setItem(`quiz_progress_${lessonId}`, JSON.stringify(data));
  }, [lessonId, lesson, currentQuestionIndex, score, showCelebration]);

  const clearSafariMemory = () => {
    if (lessonId) localStorage.removeItem(`quiz_progress_${lessonId}`);
  };


  const handleExit = () => {
    setShowExitConfirm(true)
  }

  useEffect(() => {
    let isMounted = true;
    async function loadLesson() {
      if (currentUser && lessonId) {
        const result = await curriculumService.getLessonWithContext(currentUser.grade || 1, lessonId)
        if (result && isMounted) {
          setLesson(result.lesson)
          setParentModule(result.module)
          setParentChapter(result.chapter)
        }
      }
    }
    loadLesson();
    return () => { isMounted = false; }
  }, [currentUser, lessonId])

  const handleSpeak = (text: string, options: string[] = [], isHint: boolean = false) => {
    if (!('speechSynthesis' in window)) return;

    const fullText = isHint ? `Safari Tip: ${text}` : `${text}. Your options are: ${options.join(', ')}`;

    // If already speaking THIS text, don't restart (just toggle)
    if (window.speechSynthesis.speaking && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // A tiny timeout ensures the cancel event has processed before we speak again
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(fullText);

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Natural'))) || voices[0];

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.error("Speech error:", e);
        }
        setIsSpeaking(false);
      };

      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.lang = 'en-US';

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

  const toggleHint = () => {
    const hintText = currentQuestion.hint || currentQuestion.explanation || "Take your time! Count them slowly one by one. You can do this!";
    
    Swal.fire({
      title: "Mbalo's Safari Hint",
      text: hintText,
      imageUrl: mascot,
      imageWidth: 120,
      imageHeight: 120,
      imageAlt: 'Mbalo Mascot',
      confirmButtonText: 'Got it, Mbalo!',
      padding: '2rem',
      background: 'var(--mbalo-bg)',
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title',
        confirmButton: 'swal2-confirm'
      },
      buttonsStyling: false,
      didOpen: () => {
        handleSpeak(hintText, [], true);
      }
    });
  }

  if (!lesson) return <div className="quiz-loading">Preparing your Mission...</div>

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const totalQuestions = lesson.questions.length
  const progress = showCelebration ? 100 : ((currentQuestionIndex) / totalQuestions) * 100

  const handleAnswer = (isCorrect: boolean) => {
    if (feedback) return

    if (isCorrect) {
      setScore(s => s + 1)
      setFeedback('correct')
      setCurrentExplanation(null)
      playSound('correct')
    } else {
      setFeedback('incorrect')
      setCurrentExplanation(currentQuestion.explanation || null)
      playSound('incorrect')
      
      // Record struggle
      if (currentUser && lessonId && parentModule && parentChapter) {
        authService.recordStruggle(currentUser.uid, {
          questionId: currentQuestion.id,
          moduleId: parentModule.id,
          lessonId: lessonId,
          chapterId: parentChapter.id,
          questionData: currentQuestion
        });
      }
    }
  }

  const handleContinue = async () => {
    setFeedback(null)
    setCurrentExplanation(null)
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(i => i + 1)
    } else {
      setShowCelebration(true)
      // Save stats
      if (currentUser && lessonId && lesson) {
        try {
          // Use latest score
          const finalScore = feedback === 'correct' ? score + 1 : score;
          const finalScorePercentage = (finalScore / totalQuestions) * 100;
          const pointsEarned = Math.round((finalScore / totalQuestions) * lesson.pointsValue);
          const duration = Math.floor((Date.now() - quizStartTime.current) / 1000);
          
          await authService.completeLesson(
            currentUser.uid, 
            lessonId, 
            finalScorePercentage, 
            pointsEarned, 
            duration,
            parentModule?.id,
            parentModule?.lessons?.length
          );
          clearSafariMemory();
        } catch (error) {
          console.error("Failed to save progress:", error);
        }
      }
    }
  }

  const renderQuestion = (question: QuizQuestion) => {
    const disabled = !!feedback

    switch (question.type) {
      case 'emoji-count':
        return (
          <EmojiCountQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'true-false':
        return (
          <TrueFalseQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'sequence':
        return (
          <SequenceQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'drag-match':
        return (
          <DragMatchQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )
      case 'long-division':
        return (
          <LongDivisionQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'number-line':
        return (
          <NumberLineQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'pattern-grid':
        return (
          <PatternGridQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      case 'sum-composition':
        return (
          <SumCompositionQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
      default:
        return (
          <MultipleChoiceQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={disabled}
            feedback={feedback}
          />
        )
    }
  }

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        {!showCelebration && <button className="btn-exit" onClick={handleExit}>✕</button>}
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
          <div className="quiz-tools-top">
            <div className="quiz-progress-text text-muted">
              Mission Progress
            </div>
            <button
              className={`tool-btn tts-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={() => handleSpeak(currentQuestion.question, currentQuestion.options)}
              title="Read Aloud"
            >
              <Volume2 size={24} />
            </button>
          </div>


          {renderQuestion(currentQuestion)}

          <div className="quiz-tools-bottom">
            <button
              className="tool-btn hint-btn"
              onClick={toggleHint}
              title="Get a Hint"
            >
              <Lightbulb size={24} />
            </button>
            <button
              className="tool-btn calc-btn-trigger"
              onClick={() => setShowCalculator(true)}
              title="Math Tool"
            >
              <CalcIcon size={24} />
            </button>
          </div>
        </div>
      ) : (
        <MissionCelebration
          title="Mission Complete! 🚀"
          text="Fantastic! You've successfully completed this mission."
          lessonTitle={lesson.title}
          scorePercentage={Math.round((score / lesson.questions.length) * 100)}
          score={score}
          totalQuestions={totalQuestions}
          timeTaken={Math.floor((Date.now() - quizStartTime.current) / 1000)}
          onBack={() => {
            clearSafariMemory();
            navigate('/dashboard');
          }}
          onRetry={() => {
            clearSafariMemory();
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

      {showExitConfirm && (
        <div className="quiz-exit-overlay pop-in">
          <div className="exit-confirm-card">
            <img src={mascotSad} alt="Sad Mascot" className="exit-mascot-img" />
            <h2>Wait, brave adventurer!</h2>
            <p>Our safari dog friend will miss you. Do you want to stay and finish the mission?</p>
            <div className="exit-actions">
              <button className="btn-game btn-game-teal" onClick={() => setShowExitConfirm(false)}>
                I'll stay!
              </button>
              <button className="btn-game btn-game-outline" onClick={() => navigate('/dashboard')}>
                Leave for now
              </button>
            </div>
          </div>
        </div>
      )}

      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

    </div>
  )
}

export default Mission
