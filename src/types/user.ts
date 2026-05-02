export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  grade?: number;
}

export interface UserStats {
  lessonsCompleted: number;
  completedLessonIds: string[];
  totalPoints: number;
  totalTimeSpent: number; // in seconds
  timeSpent: number;
  accuracy: number; // percentage
  moduleProgress: {
    moduleId: string;
    progress: number; // 0 to 100
  }[];
  struggledQuestions: {
    questionId: string;
    moduleId: string;
    lessonId: string;
    chapterId: string;
    questionData: any;
    errorCount: number;
    lastAttempted: string;
  }[];
  milestones: string[];
}

export interface UserProfile extends User {
  bio?: string;
  stats: UserStats;
  joinedAt: string;
}
