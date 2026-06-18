import { Timestamp } from 'firebase/firestore';
import type { UserLexemeState } from '../types/srs';

// The model weights (Theta) for the Half-Life calculation.
// In a real Duolingo-style system, these are learned via logistic regression across millions of logs.
// For Mbalo, we use logical mock weights:
// successes increase half-life (+), failures decrease it (-), views increase it slightly (+), intrinsic difficulty decreases it (-)
const THETA_SUCCESSES = 1.5;
const THETA_FAILURES = -0.8;
const THETA_TOTAL_VIEWS = 0.2;
const THETA_DIFFICULTY = -0.5;

/**
 * Calculates the current recall probability (p) of a lexeme.
 * p = 2^(-Δ/h)
 * @param state The user's current state for the lexeme
 * @param currentTimeMs The current time in milliseconds
 * @returns A probability between 0.0 and 1.0
 */
export function calculateRecallProbability(state: UserLexemeState, currentTimeMs: number): number {
  if (!state.lastReviewedAt) {
    return 0; // Never reviewed
  }

  const lastReviewTime = state.lastReviewedAt.toMillis();
  const deltaMs = currentTimeMs - lastReviewTime;
  
  // Convert delta to days
  const deltaDays = deltaMs / (1000 * 60 * 60 * 24);

  // If delta is negative (clock skew), cap at 0
  const safeDeltaDays = Math.max(0, deltaDays);

  return Math.pow(2, -(safeDeltaDays / state.halfLife));
}

/**
 * Calculates the new half-life (h) in days.
 * h = 2^(Θ * x)
 */
export function calculateHalfLife(
  successes: number,
  failures: number,
  totalViews: number,
  intrinsicDifficulty: number
): number {
  // Feature vector x (using log1p to smooth exponential growth of counters)
  const xSuccesses = Math.log1p(successes);
  const xFailures = Math.log1p(failures);
  const xTotalViews = Math.log1p(totalViews);
  const xDifficulty = intrinsicDifficulty;

  const exponent = 
    (THETA_SUCCESSES * xSuccesses) +
    (THETA_FAILURES * xFailures) +
    (THETA_TOTAL_VIEWS * xTotalViews) +
    (THETA_DIFFICULTY * xDifficulty);

  return Math.pow(2, exponent);
}

/**
 * Reducer function to update a LexemeState after a review.
 * @param currentState The current state (or a default empty state)
 * @param isCorrect Whether the user answered correctly
 * @param intrinsicDifficulty The difficulty of the lexeme (default 1.0)
 * @returns A new UserLexemeState object
 */
export function reduceLexemeState(
  currentState: UserLexemeState,
  isCorrect: boolean,
  intrinsicDifficulty: number = 1.0
): UserLexemeState {
  const newSuccesses = currentState.successes + (isCorrect ? 1 : 0);
  const newFailures = currentState.failures + (isCorrect ? 0 : 1);
  const newTotalViews = currentState.totalViews + 1;

  const newHalfLife = calculateHalfLife(newSuccesses, newFailures, newTotalViews, intrinsicDifficulty);

  return {
    ...currentState,
    successes: newSuccesses,
    failures: newFailures,
    totalViews: newTotalViews,
    halfLife: newHalfLife,
    lastReviewedAt: Timestamp.now()
  };
}

/**
 * Helper to create an initial state for a brand new lexeme
 */
export function createInitialLexemeState(lexemeId: string): UserLexemeState {
  return {
    lexemeId,
    successes: 0,
    failures: 0,
    totalViews: 0,
    halfLife: calculateHalfLife(0, 0, 0, 1.0), // Initial default half-life
    lastReviewedAt: null
  };
}
