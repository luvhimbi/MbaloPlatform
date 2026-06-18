import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  deleteUser,
  fetchSignInMethodsForEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { UserProfile, UserStats } from '../types/user';
import type { Mission } from '../types/curriculum';
const DEFAULT_STATS: UserStats = {
  lessonsCompleted: 0,
  completedLessonIds: [],
  totalPoints: 0,
  totalTimeSpent: 0,
  timeSpent: 0,
  accuracy: 0,
  moduleProgress: [],
  struggledQuestions: [],
  milestones: []
};

class AuthService {

  async register(email: string, password: string, displayName: string, grade: number): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const newUserProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName,
        grade,
        joinedAt: new Date().toISOString(),
        stats: DEFAULT_STATS
      };

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);

      return newUserProfile;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      let profile = await this.getUserProfile(firebaseUser.uid);
      
      if (!profile) {
        // If profile doesn't exist but Auth succeeded, create a default profile
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || email,
          displayName: firebaseUser.displayName || email.split('@')[0],
          grade: 1,
          joinedAt: new Date().toISOString(),
          stats: DEFAULT_STATS
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      }
      return profile;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const additionalInfo = getAdditionalUserInfo(userCredential);
      
      if (additionalInfo?.isNewUser) {
        // Delete the newly created auth user because they must sign up via Onboarding
        await deleteUser(firebaseUser);
        await signOut(auth);
        throw new Error('auth/user-not-found');
      }

      let profile = await this.getUserProfile(firebaseUser.uid);
      
      if (!profile) {
        await signOut(auth);
        throw new Error('auth/user-not-found');
      }
      return profile;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Proceed if enumeration protection is active
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async updateUserGrade(uid: string, newGrade: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { grade: newGrade }, { merge: true });
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  }

  async updateUserName(uid: string, newName: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { displayName: newName }, { merge: true });
      
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.uid === uid) {
        await updateProfile(firebaseUser, { displayName: newName });
      }
    } catch (error) {
      console.error("Error updating name:", error);
      throw error;
    }
  }

  async deleteAccount(uid: string): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.uid === uid) {
        // Delete from Firestore first
        await deleteDoc(doc(db, 'users', uid));
        // Delete from Auth
        await deleteUser(firebaseUser);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error; // Bubble up network/offline errors
    }
  }

  // Temporary stub for missions until we move them to Firestore
  getMissions(): Mission[] {
    return [];
  }

  async completeLesson(uid: string, lessonId: string, scorePercentage: number, points: number, timeSeconds: number, moduleId?: string, totalLessonsInModule?: number): Promise<void> {
    try {
      const profile = await this.getUserProfile(uid);
      if (!profile) return;

      const stats = profile.stats || DEFAULT_STATS;
      const completedLessonIds = stats.completedLessonIds || [];
      
      // Don't double count lessons if already completed
      const isNewCompletion = !completedLessonIds.includes(lessonId);
      
      let moduleProgress = stats.moduleProgress || [];
      if (moduleId && totalLessonsInModule) {
        const existingMod = moduleProgress.find(m => m.moduleId === moduleId);
        const lessonsDoneInModule = isNewCompletion 
          ? (existingMod ? Math.round((existingMod.progress / 100) * totalLessonsInModule) + 1 : 1)
          : (existingMod ? Math.round((existingMod.progress / 100) * totalLessonsInModule) : 0);
        
        const newProgress = Math.min(100, Math.round((lessonsDoneInModule / totalLessonsInModule) * 100));
        
        if (existingMod) {
          existingMod.progress = newProgress;
        } else {
          moduleProgress.push({ moduleId, progress: newProgress });
        }
      }

      // Milestones
      const milestones = stats.milestones || [];
      const newLessonsCount = isNewCompletion ? (stats.lessonsCompleted || 0) + 1 : stats.lessonsCompleted;
      
      if (newLessonsCount === 1 && !milestones.includes('First Lesson')) milestones.push('First Lesson');
      if (newLessonsCount === 10 && !milestones.includes('Math Explorer')) milestones.push('Math Explorer');
      if (newLessonsCount === 50 && !milestones.includes('Math Master')) milestones.push('Math Master');
      if (scorePercentage === 100 && !milestones.includes('Perfect Score')) milestones.push('Perfect Score');

      const updatedStats: UserStats = {
        ...stats,
        lessonsCompleted: newLessonsCount,
        completedLessonIds: isNewCompletion 
          ? [...completedLessonIds, lessonId] 
          : completedLessonIds,
        totalPoints: (stats.totalPoints || 0) + points,
        totalTimeSpent: (stats.totalTimeSpent || 0) + timeSeconds,
        timeSpent: Math.floor(((stats.totalTimeSpent || 0) + timeSeconds) / 60), // Update minutes
        accuracy: Math.round((((stats.accuracy || 0) * (stats.lessonsCompleted || 0)) + scorePercentage) / ((stats.lessonsCompleted || 0) + 1)),
        moduleProgress,
        milestones
      };

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { stats: updatedStats }, { merge: true });
    } catch (error) {
      console.error("Error completing lesson:", error);
      throw error;
    }
  }
  async recordStruggle(uid: string, struggle: { questionId: string, moduleId: string, lessonId: string, chapterId: string, questionData: any }): Promise<void> {
    try {
      const profile = await this.getUserProfile(uid);
      if (!profile) return;

      const stats = profile.stats || DEFAULT_STATS;
      const struggles = [...(stats.struggledQuestions || [])];
      
      const existingIdx = struggles.findIndex(s => s.questionId === struggle.questionId);
      
      if (existingIdx >= 0) {
        struggles[existingIdx] = {
          ...struggles[existingIdx],
          errorCount: (struggles[existingIdx].errorCount || 0) + 1,
          lastAttempted: new Date().toISOString()
        };
      } else {
        struggles.push({
          ...struggle,
          errorCount: 1,
          lastAttempted: new Date().toISOString()
        });
      }

      const updatedStats: UserStats = {
        ...stats,
        struggledQuestions: struggles
      };

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { stats: updatedStats }, { merge: true });
    } catch (error) {
      console.error("Error recording struggle:", error);
    }
  }

  async clearStruggle(uid: string, questionId: string): Promise<void> {
    try {
      const profile = await this.getUserProfile(uid);
      if (!profile) return;

      const stats = profile.stats || DEFAULT_STATS;
      const struggles = (stats.struggledQuestions || []).filter(s => s.questionId !== questionId);

      const updatedStats: UserStats = {
        ...stats,
        struggledQuestions: struggles
      };

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { stats: updatedStats }, { merge: true });
    } catch (error) {
      console.error("Error clearing struggle:", error);
    }
  }

  // ─── Admin Methods ───

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: UserProfile[] = [];
      querySnapshot.forEach((docSnap) => {
        users.push(docSnap.data() as UserProfile);
      });
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async setUserRole(uid: string, role: 'learner' | 'admin'): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role }, { merge: true });
    } catch (error) {
      console.error("Error setting user role:", error);
      throw error;
    }
  }

  async deleteUserProfile(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();

