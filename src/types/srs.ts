import { Timestamp } from 'firebase/firestore';

export interface Lexeme {
  id: string;
  intrinsicDifficulty: number; // 1.0 to 5.0
  description: string;
}

export interface UserLexemeState {
  lexemeId: string;
  successes: number;
  failures: number;
  totalViews: number;
  lastReviewedAt: Timestamp | null;
  halfLife: number; // in days
}
