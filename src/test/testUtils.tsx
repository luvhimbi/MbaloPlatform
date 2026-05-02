import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { UserProfile } from '../types/user'

// ─── Mock Auth Context ───
const AuthContext = React.createContext<{ currentUser: UserProfile | null; loading: boolean }>({
  currentUser: null,
  loading: false,
})

export const MOCK_USER: UserProfile = {
  uid: 'test-uid-123',
  email: 'test@mbalo.com',
  displayName: 'Test Explorer',
  grade: 1,
  joinedAt: '2025-01-01T00:00:00Z',
  stats: {
    lessonsCompleted: 5,
    completedLessonIds: ['lesson-1', 'lesson-2'],
    totalPoints: 250,
    totalTimeSpent: 600,
    timeSpent: 10,
    accuracy: 85,
    moduleProgress: [{ moduleId: 'mod-1', progress: 50 }],
    struggledQuestions: [
      {
        questionId: 'q-struggle-1',
        moduleId: 'mod-1',
        lessonId: 'lesson-1',
        chapterId: 'ch-1',
        questionData: {
          id: 'q-struggle-1',
          question: 'What is 3 + 4?',
          options: ['5', '6', '7', '8'],
          correctAnswer: '7',
          type: 'multiple-choice' as const,
        },
        errorCount: 2,
        lastAttempted: '2025-04-01T00:00:00Z',
      },
    ],
    milestones: ['First Lesson'],
  },
}

export const MOCK_USER_FRESH: UserProfile = {
  uid: 'test-uid-fresh',
  email: 'fresh@mbalo.com',
  displayName: 'Fresh Learner',
  grade: 1,
  joinedAt: '2025-04-01T00:00:00Z',
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
}

// ─── Providers Wrapper ───
interface WrapperOptions {
  user?: UserProfile | null
  initialRoute?: string
}

export function createWrapper(options: WrapperOptions = {}) {
  const { user = null, initialRoute = '/' } = options

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthContext.Provider value={{ currentUser: user, loading: false }}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </AuthContext.Provider>
    )
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: WrapperOptions & Omit<RenderOptions, 'wrapper'> = {}
) {
  const { user, initialRoute, ...renderOptions } = options
  return render(ui, {
    wrapper: createWrapper({ user, initialRoute }),
    ...renderOptions,
  })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
