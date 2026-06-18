export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'true-false' | 'emoji-count' | 'sequence' | 'drag-match' | 'long-division' | 'number-line' | 'pattern-grid' | 'sum-composition';
  image?: string;
  explanation?: string;
  hint?: string;
  lexemeIds?: string[]; // IDs of the mathematical concepts tested
  difficulty?: number; // Intrinsic difficulty override (1.0 to 5.0)
  // Emoji counting
  emoji?: string;
  emojiCount?: number;
  // Sequence / find next number
  sequence?: number[];
  // Drag-and-drop matching
  matchPairs?: { left: string; right: string }[];
  // Long division
  dividend?: number;
  divisor?: number;
  // Number line
  numberLineConfig?: { min: number; max: number; step: number; indicatorValue?: number };
  // Pattern grid
  patternGrid?: string[];
  // Sum composition
  sumTarget?: number;
  sumPieces?: number[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'quiz';
  questions: QuizQuestion[];
  isCompleted: boolean;
  score?: number;
  pointsValue: number;
}



export interface Module {
  id: string;
  title: string;
  description: string;
  learningGoal: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  unit: number;
  icon?: string;
  lessons: Lesson[];
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface Chapter {
  id: string;
  title: string;
  modules: Module[];
}

export interface Mission {
  id: string;
  moduleId: string;
  moduleTitle: string;
  grade: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  note?: string;
  learningGoal?: string;
  difficulty?: string;
}

export interface GradeCurriculum {
  grade: number;
  chapters: Chapter[];
}
