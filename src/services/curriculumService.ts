import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { GradeCurriculum, Chapter, Module, Lesson } from '../types/curriculum';
import grade1Data from '../data/grade1_counting.json';
import grade2Data from '../data/grade2_placeholder.json';
import grade3Data from '../data/grade3_placeholder.json';
import grade4Data from '../data/grade4_placeholder.json';
import grade5Data from '../data/grade5_placeholder.json';
import grade6Data from '../data/grade6_placeholder.json';
import grade7Data from '../data/grade7_placeholder.json';

// Keep static JSON for seeding
const SEED_DATA: Record<number, GradeCurriculum> = {
  1: grade1Data as GradeCurriculum,
  2: grade2Data as GradeCurriculum,
  3: grade3Data as GradeCurriculum,
  4: grade4Data as GradeCurriculum,
  5: grade5Data as GradeCurriculum,
  6: grade6Data as GradeCurriculum,
  7: grade7Data as GradeCurriculum,
};

class CurriculumService {
  private cache: Record<number, GradeCurriculum> = {};

  isGradeCached(grade: number): boolean {
    return !!this.cache[grade];
  }

  async getCurriculumByGrade(grade: number): Promise<GradeCurriculum | null> {
    if (this.cache[grade]) {
      return this.cache[grade];
    }

    try {
      const docRef = doc(db, 'curriculum', `grade_${grade}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as GradeCurriculum;
        this.cache[grade] = data;
        return data;
      }
      
      // Fallback for grades without data
      const fallback = {
        grade,
        chapters: [
          { 
            id: `g${grade}c1`, 
            title: `Grade ${grade} Math Journey`, 
            modules: [
              { 
                id: `g${grade}m1`, 
                title: 'Getting Started', 
                description: `Welcome to Grade ${grade}! High-level missions coming soon.`,
                learningGoal: `Begin your Grade ${grade} math adventure.`,
                difficulty: 'Beginner' as const,
                unit: 1,
                icon: 'star',
                status: 'available' as const, 
                lessons: [] 
              }
            ] 
          }
        ]
      };
      this.cache[grade] = fallback;
      return fallback;
    } catch (error) {
      console.error(`Error fetching curriculum for grade ${grade}:`, error);
      return null;
    }
  }

  async getCurrentChapter(grade: number): Promise<Chapter | null> {
    const curriculum = await this.getCurriculumByGrade(grade);
    return curriculum?.chapters[0] || null;
  }

  async getLessonById(grade: number, lessonId: string): Promise<Lesson | null> {
    const result = await this.getLessonWithContext(grade, lessonId);
    return result?.lesson || null;
  }

  async getLessonWithContext(grade: number, lessonId: string): Promise<{ lesson: Lesson, module: Module, chapter: Chapter } | null> {
    const curriculum = await this.getCurriculumByGrade(grade);
    if (!curriculum) return null;
    
    for (const chapter of curriculum.chapters) {
      for (const module of chapter.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) return { lesson, module, chapter };
      }
    }
    return null;
  }

  async getModuleById(grade: number, moduleId: string): Promise<Module | null> {
    const curriculum = await this.getCurriculumByGrade(grade);
    if (!curriculum) return null;

    for (const chapter of curriculum.chapters) {
      const module = chapter.modules.find(m => m.id === moduleId);
      if (module) return module;
    }
    return null;
  }

  // Temporary function to seed the database with local JSON data
  async uploadCurriculum(): Promise<void> {
    try {
      for (const grade of [1, 2, 3, 4, 5, 6, 7]) {
        const data = SEED_DATA[grade];
        if (data) {
          const docRef = doc(db, 'curriculum', `grade_${grade}`);
          await setDoc(docRef, data);
          console.log(`Successfully uploaded curriculum for grade ${grade}`);
        }
      }
    } catch (error) {
      console.error("Error uploading curriculum to Firestore:", error);
      throw error;
    }
  }
}

export const curriculumService = new CurriculumService();
