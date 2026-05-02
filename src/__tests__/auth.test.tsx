import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// ─── Mock AuthContext ───
const mockUseAuth = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ─── Mock authService ───
vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    getUserProfile: vi.fn(),
    updateUserGrade: vi.fn(),
    updateUserName: vi.fn(),
    deleteAccount: vi.fn(),
    completeLesson: vi.fn(),
    recordStruggle: vi.fn(),
    clearStruggle: vi.fn(),
    getMissions: vi.fn(() => []),
  },
}))

// ─── Mock curriculumService ───
vi.mock('../services/curriculumService', () => ({
  curriculumService: {
    getCurriculumByGrade: vi.fn(() => Promise.resolve(null)),
    getCurrentChapter: vi.fn(() => Promise.resolve(null)),
    getLessonById: vi.fn(() => Promise.resolve(null)),
    getLessonWithContext: vi.fn(() => Promise.resolve(null)),
    getModuleById: vi.fn(() => Promise.resolve(null)),
    isGradeCached: vi.fn(() => false),
    uploadCurriculum: vi.fn(),
  },
}))

// ─── Mock images ───
vi.mock('../assets/mascot.webp', () => ({ default: '/mascot.webp' }))
vi.mock('../assets/mascot-sad.webp', () => ({ default: '/mascot-sad.webp' }))
vi.mock('../assets/mascot-happy.webp', () => ({ default: '/mascot-happy.webp' }))
vi.mock('../assets/mascot-playful.webp', () => ({ default: '/mascot-playful.webp' }))
vi.mock('../assets/mascot-studying.webp', () => ({ default: '/mascot-studying.webp' }))

// ─── Mock sweetalert2 ───
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: false })),
  },
}))

import Login from '../pages/Login'
import Landing from '../pages/Landing'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { authService } from '../services/authService'

// ──────────────────────────────────────────────
// A. AUTH & ROUTING TESTS
// ──────────────────────────────────────────────
describe('Auth & Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({ currentUser: null, loading: false })
  })

  describe('Landing Page', () => {
    it('renders the hero section with CTA buttons', () => {
      render(
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      )
      expect(screen.getByText(/Master Math with Your/i)).toBeInTheDocument()
      expect(screen.getByText(/Start Your Quest/i)).toBeInTheDocument()
      expect(screen.getByText(/Meet the Team/i)).toBeInTheDocument()
    })

    it('renders feature cards section', () => {
      render(
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      )
      expect(screen.getByText('Structured Lessons')).toBeInTheDocument()
      expect(screen.getByText('Practice Mode')).toBeInTheDocument()
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument()
    })

    it('renders the learning modules section', () => {
      render(
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      )
      expect(screen.getAllByText('Addition')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Subtraction')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Multiplication')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Division')[0]).toBeInTheDocument()
    })
  })

  describe('Login Page', () => {
    it('renders email, password fields and submit button', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument()
    })

    it('renders Google sign-in button', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument()
    })

    it('validates empty email on submit', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }))
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
    })

    it('validates empty password on submit', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      const emailInput = screen.getByPlaceholderText('your.email@example.com')
      await user.type(emailInput, 'test@test.com')
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }))
      expect(screen.getByText('Please enter your password')).toBeInTheDocument()
    })

    it('validates malformed email format', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      const emailInput = screen.getByPlaceholderText('your.email@example.com')
      await user.type(emailInput, 'notanemail')
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }))
      expect(screen.getByText("That doesn't look like a valid email")).toBeInTheDocument()
    })

    it('shows error on invalid credentials', async () => {
      const user = userEvent.setup()
      vi.mocked(authService.login).mockRejectedValueOnce({ code: 'auth/invalid-credential' })

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )

      await user.type(screen.getByPlaceholderText('your.email@example.com'), 'test@test.com')
      await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass')
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
      })
    })

    it('shows password toggle button', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      const toggleBtn = screen.getByText('Show')
      await user.click(toggleBtn)
      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('renders forgot password link', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    })
  })

  describe('ProtectedRoute', () => {
    it('redirects to /login when no user is logged in', () => {
      mockUseAuth.mockReturnValue({ currentUser: null, loading: false })

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Dashboard Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
    })

    it('renders children when user is logged in', () => {
      mockUseAuth.mockReturnValue({
        currentUser: {
          uid: 'test-uid',
          email: 'test@mbalo.com',
          displayName: 'Test User',
          grade: 1,
          joinedAt: '2025-01-01',
          stats: {
            lessonsCompleted: 0,
            completedLessonIds: [],
            totalPoints: 0,
            totalTimeSpent: 0,
            timeSpent: 0,
            accuracy: 0,
            moduleProgress: [],
            struggledQuestions: [],
            milestones: [],
          },
        },
        loading: false,
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Dashboard Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
    })
  })
})
