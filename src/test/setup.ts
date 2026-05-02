import '@testing-library/jest-dom'
import { vi, beforeAll, afterAll } from 'vitest'

// ─── Mock Firebase Auth ───
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    // Default: no user signed in
    callback(null)
    return vi.fn() // unsubscribe
  }),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
  deleteUser: vi.fn(),
}))

// ─── Mock Firebase Firestore ───
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
  setDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((_docRef, onNext) => {
    // Immediately call with no data
    onNext({ exists: () => false, data: () => null })
    return vi.fn() // unsubscribe
  }),
}))

// ─── Mock Firebase App ───
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

// ─── Mock the firebase config module ───
vi.mock('../config/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}))

// ─── Mock canvas-confetti ───
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// ─── Mock SpeechSynthesis ───
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}
Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
})

// ─── Mock SpeechSynthesisUtterance ───
vi.stubGlobal('SpeechSynthesisUtterance', vi.fn().mockImplementation(() => ({
  text: '',
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: '',
  voice: null,
  onstart: null,
  onend: null,
  onerror: null,
})))

// ─── Mock Audio ───
class MockAudio {
  volume = 1;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
}
vi.stubGlobal('Audio', MockAudio)

// ─── Mock AudioContext ───
vi.stubGlobal('AudioContext', vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(() => ({
    connect: vi.fn(() => ({
      connect: vi.fn(),
    })),
    start: vi.fn(),
    stop: vi.fn(),
    type: '',
    frequency: { value: 0 },
  })),
  createGain: vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })),
  currentTime: 0,
  destination: {},
})))

// ─── Mock matchMedia ───
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ─── Suppress console.error for expected errors in tests ───
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React act() warnings and Firebase mock warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('act(') || args[0].includes('Firebase') || args[0].includes('Profile sync error'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
