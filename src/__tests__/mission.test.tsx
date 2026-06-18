import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// ─── Mocks ───
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ lessonId: 'test-lesson-1' }) }
})

const mockUser = {
  uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', grade: 1,
  joinedAt: '2025-01-01',
  stats: { lessonsCompleted: 0, completedLessonIds: [], totalPoints: 0, totalTimeSpent: 0, timeSpent: 0, accuracy: 0, moduleProgress: [], struggledQuestions: [], milestones: [] },
}
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ currentUser: mockUser, loading: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('../services/authService', () => ({
  authService: { completeLesson: vi.fn(() => Promise.resolve()), recordStruggle: vi.fn(() => Promise.resolve()), clearStruggle: vi.fn(() => Promise.resolve()), login: vi.fn(), loginWithGoogle: vi.fn(), logout: vi.fn(), register: vi.fn(), getUserProfile: vi.fn(), getMissions: vi.fn(() => []) },
}))

const MOCK_QUESTIONS = [
  { id: 'q1', question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correctAnswer: '5', type: 'multiple-choice' as const, explanation: '2 plus 3 equals 5', hint: 'Count on your fingers!' },
  { id: 'q2', question: 'What is 4 + 1?', options: ['3', '4', '5', '6'], correctAnswer: '5', type: 'multiple-choice' as const },
  { id: 'q3', question: 'What is 1 + 1?', options: ['1', '2', '3', '4'], correctAnswer: '2', type: 'multiple-choice' as const },
]
const MOCK_LESSON = { id: 'test-lesson-1', title: 'Test Addition', type: 'quiz' as const, questions: MOCK_QUESTIONS, isCompleted: false, pointsValue: 100 }
const MOCK_MODULE = { id: 'mod-1', title: 'Test Module', description: 'Test', learningGoal: 'Learn', difficulty: 'Beginner' as const, unit: 1, lessons: [MOCK_LESSON], status: 'available' as const }
const MOCK_CHAPTER = { id: 'ch-1', title: 'Test Chapter', modules: [MOCK_MODULE] }

vi.mock('../services/curriculumService', () => ({
  curriculumService: {
    getCurriculumByGrade: vi.fn(() => Promise.resolve({ grade: 1, chapters: [MOCK_CHAPTER] })),
    getLessonById: vi.fn(() => Promise.resolve(MOCK_LESSON)),
    getLessonWithContext: vi.fn(() => Promise.resolve({ lesson: MOCK_LESSON, module: MOCK_MODULE, chapter: MOCK_CHAPTER })),
    getCurrentChapter: vi.fn(() => Promise.resolve(MOCK_CHAPTER)),
    getModuleById: vi.fn(() => Promise.resolve(MOCK_MODULE)),
    isGradeCached: vi.fn(() => true),
    uploadCurriculum: vi.fn(),
  },
}))
vi.mock('../assets/mascot.webp', () => ({ default: '/mascot.webp' }))
vi.mock('../assets/mascot-sad.webp', () => ({ default: '/mascot-sad.webp' }))
vi.mock('../assets/mascot-happy.webp', () => ({ default: '/m-happy.webp' }))
vi.mock('../assets/mascot-playful.webp', () => ({ default: '/m-play.webp' }))
vi.mock('../assets/mascot-studying.webp', () => ({ default: '/m-study.webp' }))
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: false })) } }))

import Mission from '../pages/Mission'
import MissionFeedbackBar from '../components/MissionFeedbackBar'
import MissionCelebration from '../components/MissionCelebration'
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion'
import { curriculumService } from '../services/curriculumService'

describe('Quiz Engine', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  describe('Mission Page', () => {
    it('renders loading state initially', () => {
      vi.mocked(curriculumService.getCurriculumByGrade).mockResolvedValue(null)
      render(<MemoryRouter initialEntries={['/mission/test-lesson-1']}><Mission /></MemoryRouter>)
      expect(screen.getByText(/Preparing your Mission/i)).toBeInTheDocument()
    })

    it('renders mission questions correctly', async () => {
      render(<MemoryRouter initialEntries={['/mission/test-lesson-1']}><Mission /></MemoryRouter>)
      await waitFor(() => {
        expect(screen.getByText('What is 2 + 3?')).toBeInTheDocument()
      })
    })

    it('handles correct answers and shows feedback', async () => {
      render(<MemoryRouter initialEntries={['/mission/test-lesson-1']}><Mission /></MemoryRouter>)
      await waitFor(() => { expect(document.querySelector('.quiz-progress-bar')).toBeInTheDocument() })
    })
  })

  describe('MultipleChoiceQuestion', () => {
    it('renders all answer options', () => {
      render(<MultipleChoiceQuestion question={MOCK_QUESTIONS[0]} onAnswer={vi.fn()} disabled={false} feedback={null} />)
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('6')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('calls onAnswer(true) for correct option', async () => {
      const user = userEvent.setup(); const onAnswer = vi.fn()
      render(<MultipleChoiceQuestion question={MOCK_QUESTIONS[0]} onAnswer={onAnswer} disabled={false} feedback={null} />)
      await user.click(screen.getByText('5'))
      expect(onAnswer).toHaveBeenCalledWith(true)
    })

    it('calls onAnswer(false) for wrong option', async () => {
      const user = userEvent.setup(); const onAnswer = vi.fn()
      render(<MultipleChoiceQuestion question={MOCK_QUESTIONS[0]} onAnswer={onAnswer} disabled={false} feedback={null} />)
      await user.click(screen.getByText('4'))
      expect(onAnswer).toHaveBeenCalledWith(false)
    })

    it('does not call onAnswer when disabled', async () => {
      const user = userEvent.setup(); const onAnswer = vi.fn()
      render(<MultipleChoiceQuestion question={MOCK_QUESTIONS[0]} onAnswer={onAnswer} disabled={true} feedback="correct" />)
      await user.click(screen.getByText('5'))
      expect(onAnswer).not.toHaveBeenCalled()
    })
  })

  describe('MissionFeedbackBar', () => {
    it('renders correct feedback', () => {
      render(<MissionFeedbackBar feedback="correct" explanation={null} onContinue={vi.fn()} />)
      expect(screen.getByText(/Combo Strike/i)).toBeInTheDocument()
    })

    it('renders incorrect feedback with explanation', () => {
      render(<MissionFeedbackBar feedback="incorrect" explanation="2 plus 3 equals 5" onContinue={vi.fn()} />)
      expect(screen.getByText(/Oops/i)).toBeInTheDocument()
      expect(screen.getByText('2 plus 3 equals 5')).toBeInTheDocument()
    })

    it('calls onContinue when clicked', async () => {
      const user = userEvent.setup(); const onContinue = vi.fn()
      render(<MissionFeedbackBar feedback="correct" explanation={null} onContinue={onContinue} />)
      await user.click(screen.getByText(/Continue/i))
      expect(onContinue).toHaveBeenCalledOnce()
    })
  })

  describe('MissionCelebration', () => {
    it('renders full score celebration', () => {
      render(<MemoryRouter><MissionCelebration title="Mission Complete!" text="Fantastic!" lessonTitle="Test" scorePercentage={80} score={4} totalQuestions={5} timeTaken={120} onBack={vi.fn()} onRetry={vi.fn()} /></MemoryRouter>)
      expect(screen.getByText('Mission Complete!')).toBeInTheDocument()
      expect(screen.getByText('Fantastic!')).toBeInTheDocument()
    })

    it('calls onRetry when retry clicked', async () => {
      const user = userEvent.setup(); const onRetry = vi.fn()
      render(<MemoryRouter><MissionCelebration title="Good!" text="Try more!" lessonTitle="T" scorePercentage={60} score={3} totalQuestions={5} timeTaken={60} onBack={vi.fn()} onRetry={onRetry} /></MemoryRouter>)
      await user.click(screen.getByText(/Try Again/i))
      expect(onRetry).toHaveBeenCalledOnce()
    })
  })
})
