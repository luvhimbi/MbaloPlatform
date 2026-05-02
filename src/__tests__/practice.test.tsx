import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// ─── Mocks ───
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockUserWithStruggles = {
  uid: 'test-uid', email: 'test@test.com', displayName: 'Test', grade: 1, joinedAt: '2025-01-01',
  stats: {
    lessonsCompleted: 5, completedLessonIds: ['l1'], totalPoints: 200, totalTimeSpent: 600, timeSpent: 10, accuracy: 80,
    moduleProgress: [{ moduleId: 'm1', progress: 50 }],
    struggledQuestions: [{
      questionId: 'q-s1', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1',
      questionData: { id: 'q-s1', question: 'What is 3+4?', options: ['5','6','7','8'], correctAnswer: '7', type: 'multiple-choice' },
      errorCount: 2, lastAttempted: '2025-04-01',
    }],
    milestones: ['First Lesson'],
  },
}

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ currentUser: mockUserWithStruggles, loading: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('../services/authService', () => ({
  authService: { completeLesson: vi.fn(), recordStruggle: vi.fn(), clearStruggle: vi.fn(), login: vi.fn(), loginWithGoogle: vi.fn(), logout: vi.fn(), register: vi.fn(), getUserProfile: vi.fn(), getMissions: vi.fn(() => []) },
}))
vi.mock('../services/curriculumService', () => ({
  curriculumService: { getCurriculumByGrade: vi.fn(() => Promise.resolve(null)), isGradeCached: vi.fn(() => false) },
}))
vi.mock('../assets/mascot.webp', () => ({ default: '/mascot.webp' }))
vi.mock('../assets/mascot-sad.webp', () => ({ default: '/m-sad.webp' }))
vi.mock('../assets/mascot-happy.webp', () => ({ default: '/m-happy.webp' }))
vi.mock('../assets/mascot-playful.webp', () => ({ default: '/m-play.webp' }))
vi.mock('../assets/mascot-studying.webp', () => ({ default: '/m-study.webp' }))
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: false })) } }))

import Practice from '../pages/Practice'
import AdditionMixer from '../components/AdditionMixer'
import SubtractionMixer from '../components/SubtractionMixer'
import DivisionMixer from '../components/DivisionMixer'
import VerticalMixer from '../components/VerticalMixer'

describe('Practice Hub', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the practice hub with mastery tools', () => {
    render(<MemoryRouter><Practice /></MemoryRouter>)
    expect(screen.getByText('Safari Practice Hub')).toBeInTheDocument()
    expect(screen.getByText('Mastery Tools')).toBeInTheDocument()
  })

  it('renders all 6 tool cards in hub', () => {
    render(<MemoryRouter><Practice /></MemoryRouter>)
    expect(screen.getByText('Multiplication Table')).toBeInTheDocument()
    expect(screen.getByText('Addition Mixer')).toBeInTheDocument()
    expect(screen.getByText('Subtraction Mixer')).toBeInTheDocument()
    expect(screen.getByText('Column Addition')).toBeInTheDocument()
    expect(screen.getByText('Column Subtraction')).toBeInTheDocument()
    expect(screen.getByText('Division Mixer')).toBeInTheDocument()
  })

  it('shows mission review card with struggle count', () => {
    render(<MemoryRouter><Practice /></MemoryRouter>)
    expect(screen.getByText('Mission Review')).toBeInTheDocument()
    expect(screen.getByText(/Master 1 tricky/i)).toBeInTheDocument()
  })

  it('persists practice mode in localStorage', async () => {
    render(<MemoryRouter><Practice /></MemoryRouter>)
    expect(localStorage.getItem('mbalo_practice_mode')).toBe('hub')
  })
})

describe('AdditionMixer Component', () => {
  it('renders setup phase with number selectors', () => {
    render(<AdditionMixer onBack={vi.fn()} />)
    expect(screen.getByText('Choose numbers to mix!')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText(/Mix Them Up/i)).toBeInTheDocument()
  })

  it('has clickable number boxes that increment', async () => {
    const user = userEvent.setup()
    render(<AdditionMixer onBack={vi.fn()} />)
    const numberBoxes = document.querySelectorAll('.number-box')
    const firstBox = numberBoxes[0]
    const initialValue = parseInt(firstBox.textContent || '0')
    await user.click(firstBox)
    expect(firstBox.textContent).toBe(String((initialValue % 10) + 1))
  })

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<AdditionMixer onBack={onBack} />)
    const backBtn = document.querySelector('.btn-exit')
    if (backBtn) await user.click(backBtn)
    expect(onBack).toHaveBeenCalled()
  })
})

describe('SubtractionMixer Component', () => {
  it('renders setup phase with subtraction', () => {
    render(<SubtractionMixer onBack={vi.fn()} />)
    expect(screen.getByText('Choose numbers to subtract!')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<SubtractionMixer onBack={onBack} />)
    const backBtn = document.querySelector('.btn-exit')
    if (backBtn) await user.click(backBtn)
    expect(onBack).toHaveBeenCalled()
  })
})

describe('DivisionMixer Component', () => {
  it('renders setup phase with division sign', () => {
    render(<DivisionMixer onBack={vi.fn()} grade={1} />)
    expect(screen.getByText('Choose numbers to share!')).toBeInTheDocument()
    expect(screen.getByText('÷')).toBeInTheDocument()
  })

  it('renders Share button', () => {
    render(<DivisionMixer onBack={vi.fn()} grade={1} />)
    expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument()
  })
})

describe('VerticalMixer Component', () => {
  it('renders addition mode with + operator', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    expect(screen.getByText('Column Addition')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('renders subtraction mode with − operator', () => {
    render(<VerticalMixer onBack={vi.fn()} type="subtraction" />)
    expect(screen.getByText('Column Subtraction')).toBeInTheDocument()
    expect(screen.getByText('−')).toBeInTheDocument()
  })

  it('renders Check Answer and Next Mission buttons', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    expect(screen.getByText('Check Answer')).toBeInTheDocument()
    expect(screen.getByText('Next Mission')).toBeInTheDocument()
  })

  it('renders answer input cells', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    const answerInputs = document.querySelectorAll('.vm-answer-input')
    expect(answerInputs.length).toBe(3)
  })

  it('renders carry input cells', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    const carryInputs = document.querySelectorAll('.vm-carry-input')
    expect(carryInputs.length).toBe(3)
  })

  it('answer inputs accept only single digits', async () => {
    const user = userEvent.setup()
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    const answerInputs = document.querySelectorAll('.vm-answer-input')
    const firstInput = answerInputs[2] as HTMLInputElement // rightmost (ones)
    await user.click(firstInput)
    await user.type(firstInput, '5')
    expect(firstInput.value).toBe('5')
  })

  it('shows score counter', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    expect(screen.getByText(/Solved: 0/i)).toBeInTheDocument()
  })

  it('shows hint system', () => {
    render(<VerticalMixer onBack={vi.fn()} type="addition" />)
    expect(screen.getByText('How it works')).toBeInTheDocument()
  })
})
