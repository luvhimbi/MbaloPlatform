import { authService } from './authService';
import { curriculumService } from './curriculumService';
import type { UserProfile } from '../types/user';

export interface PlatformAnalytics {
  totalLearners: number;
  totalAdmins: number;
  averageAccuracy: number;
  totalLessonsCompleted: number;
  totalPointsEarned: number;
  gradeDistribution: Record<number, number>;
  recentUsers: UserProfile[];
  activeLearnersToday: number;
}

export interface GradeContentStats {
  grade: number;
  chapters: number;
  modules: number;
  lessons: number;
  questions: number;
  hasRealContent: boolean;
}

class AdminService {

  async getAnalytics(): Promise<PlatformAnalytics> {
    const users = await authService.getAllUsers();

    const learners = users.filter(u => u.role !== 'admin');
    const admins = users.filter(u => u.role === 'admin');

    // Calculate aggregate stats
    let totalAccuracy = 0;
    let accuracyCount = 0;
    let totalLessonsCompleted = 0;
    let totalPointsEarned = 0;
    const gradeDistribution: Record<number, number> = {};
    let activeToday = 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const user of learners) {
      const stats = user.stats;
      if (stats) {
        if (stats.accuracy > 0) {
          totalAccuracy += stats.accuracy;
          accuracyCount++;
        }
        totalLessonsCompleted += stats.lessonsCompleted || 0;
        totalPointsEarned += stats.totalPoints || 0;
      }

      const grade = user.grade || 1;
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;

      // Check if user joined today (rough "active" approximation)
      if (user.joinedAt) {
        const joinedDate = new Date(user.joinedAt);
        if (joinedDate >= todayStart) {
          activeToday++;
        }
      }
    }

    // Sort by joinedAt descending, take most recent 10
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
      .slice(0, 10);

    return {
      totalLearners: learners.length,
      totalAdmins: admins.length,
      averageAccuracy: accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0,
      totalLessonsCompleted,
      totalPointsEarned,
      gradeDistribution,
      recentUsers,
      activeLearnersToday: activeToday,
    };
  }

  async getCurriculumStats(): Promise<GradeContentStats[]> {
    const stats: GradeContentStats[] = [];

    for (let grade = 1; grade <= 7; grade++) {
      try {
        const curriculum = await curriculumService.getCurriculumByGrade(grade);
        if (curriculum) {
          let moduleCount = 0;
          let lessonCount = 0;
          let questionCount = 0;

          for (const chapter of curriculum.chapters) {
            moduleCount += chapter.modules.length;
            for (const mod of chapter.modules) {
              lessonCount += mod.lessons.length;
              for (const lesson of mod.lessons) {
                questionCount += lesson.questions.length;
              }
            }
          }

          stats.push({
            grade,
            chapters: curriculum.chapters.length,
            modules: moduleCount,
            lessons: lessonCount,
            questions: questionCount,
            hasRealContent: lessonCount > 5, // placeholder grades have very few lessons
          });
        } else {
          stats.push({ grade, chapters: 0, modules: 0, lessons: 0, questions: 0, hasRealContent: false });
        }
      } catch {
        stats.push({ grade, chapters: 0, modules: 0, lessons: 0, questions: 0, hasRealContent: false });
      }
    }

    return stats;
  }

  async uploadCurriculumForGrade(grade: number): Promise<void> {
    // Re-uses the existing curriculum service upload
    await curriculumService.uploadCurriculum();
  }
}

export const adminService = new AdminService();
