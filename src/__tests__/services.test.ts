import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Firebase ───
const mockSetDoc = vi.fn(() => Promise.resolve())
const mockGetDoc = vi.fn()
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn((_db, _collection, _id) => ({ path: `${_collection}/${_id}` })),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  setDoc: mockSetDoc,
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn(),
}))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(() => Promise.resolve()),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
  deleteUser: vi.fn(),
}))
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('../config/firebase', () => ({ auth: { currentUser: null }, db: {}, default: {} }))

import type { UserProfile, UserStats } from '../types/user'

const DEFAULT_STATS: UserStats = {
  lessonsCompleted: 0, completedLessonIds: [], totalPoints: 0, totalTimeSpent: 0,
  timeSpent: 0, accuracy: 0, moduleProgress: [], struggledQuestions: [], milestones: [],
}

const baseProfile: UserProfile = {
  uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', grade: 1,
  joinedAt: '2025-01-01', stats: { ...DEFAULT_STATS },
}

// We test the service logic by importing and calling it
// The authService module is the real one (not mocked here)
import { authService } from '../services/authService'

describe('AuthService — completeLesson', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls setDoc with incremented lesson count for a new lesson', async () => {
    const profile = { ...baseProfile, stats: { ...DEFAULT_STATS, lessonsCompleted: 0, completedLessonIds: [] } }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.completeLesson('test-uid', 'lesson-new', 80, 100, 60)

    expect(mockSetDoc).toHaveBeenCalledTimes(1)
    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    expect(updatedStats.lessonsCompleted).toBe(1)
    expect(updatedStats.completedLessonIds).toContain('lesson-new')
    expect(updatedStats.totalPoints).toBe(100)
    expect(updatedStats.totalTimeSpent).toBe(60)
  })

  it('does not double-count an already completed lesson', async () => {
    const profile = {
      ...baseProfile,
      stats: { ...DEFAULT_STATS, lessonsCompleted: 5, completedLessonIds: ['lesson-1', 'lesson-2'] },
    }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.completeLesson('test-uid', 'lesson-1', 90, 50, 30)

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    // Lessons completed should NOT increment
    expect(updatedStats.lessonsCompleted).toBe(5)
    // Should not add duplicate
    expect(updatedStats.completedLessonIds.filter((id: string) => id === 'lesson-1').length).toBe(1)
  })

  it('awards "First Lesson" milestone on first completion', async () => {
    const profile = { ...baseProfile, stats: { ...DEFAULT_STATS, lessonsCompleted: 0, milestones: [] } }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.completeLesson('test-uid', 'lesson-first', 100, 100, 60)

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    expect(updatedStats.milestones).toContain('First Lesson')
  })

  it('awards "Perfect Score" milestone on 100% score', async () => {
    const profile = { ...baseProfile, stats: { ...DEFAULT_STATS, lessonsCompleted: 3, milestones: [] } }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.completeLesson('test-uid', 'lesson-perfect', 100, 100, 60)

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    expect(updatedStats.milestones).toContain('Perfect Score')
  })

  it('updates module progress when moduleId is provided', async () => {
    const profile = { ...baseProfile, stats: { ...DEFAULT_STATS, lessonsCompleted: 0, moduleProgress: [] } }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.completeLesson('test-uid', 'lesson-mod', 80, 50, 30, 'module-1', 4)

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    const modProg = updatedStats.moduleProgress.find(m => m.moduleId === 'module-1')
    expect(modProg).toBeDefined()
    expect(modProg!.progress).toBe(25) // 1 of 4 = 25%
  })

  it('does not return a profile when user does not exist', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false, data: () => null })
    const result = await authService.getUserProfile('nonexistent')
    expect(result).toBeNull()
  })
})

describe('AuthService — recordStruggle & clearStruggle', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('adds a new struggle entry', async () => {
    const profile = { ...baseProfile, stats: { ...DEFAULT_STATS, struggledQuestions: [] } }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.recordStruggle('test-uid', {
      questionId: 'q-new', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1',
      questionData: { id: 'q-new', question: 'test', options: [], correctAnswer: '1', type: 'multiple-choice' },
    })

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    expect(updatedStats.struggledQuestions.length).toBe(1)
    expect(updatedStats.struggledQuestions[0].questionId).toBe('q-new')
    expect(updatedStats.struggledQuestions[0].errorCount).toBe(1)
  })

  it('increments errorCount on repeat struggle', async () => {
    const profile = {
      ...baseProfile,
      stats: {
        ...DEFAULT_STATS,
        struggledQuestions: [{
          questionId: 'q-repeat', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1',
          questionData: {}, errorCount: 2, lastAttempted: '2025-01-01',
        }],
      },
    }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.recordStruggle('test-uid', {
      questionId: 'q-repeat', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1', questionData: {},
    })

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    const struggle = updatedStats.struggledQuestions.find(s => s.questionId === 'q-repeat')
    expect(struggle!.errorCount).toBe(3)
  })

  it('removes a struggle by questionId', async () => {
    const profile = {
      ...baseProfile,
      stats: {
        ...DEFAULT_STATS,
        struggledQuestions: [
          { questionId: 'q-keep', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1', questionData: {}, errorCount: 1, lastAttempted: '2025-01-01' },
          { questionId: 'q-remove', moduleId: 'm1', lessonId: 'l1', chapterId: 'c1', questionData: {}, errorCount: 3, lastAttempted: '2025-01-01' },
        ],
      },
    }
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => profile })

    await authService.clearStruggle('test-uid', 'q-remove')

    const setDocCall = mockSetDoc.mock.calls[0] as any[]
    const updatedStats = setDocCall[1].stats as UserStats
    expect(updatedStats.struggledQuestions.length).toBe(1)
    expect(updatedStats.struggledQuestions[0].questionId).toBe('q-keep')
  })
})
