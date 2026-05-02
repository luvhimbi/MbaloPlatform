import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { curriculumService } from '../services/curriculumService'
import type { Chapter, GradeCurriculum, Module, Mission } from '../types/curriculum'
import DashboardLayout from '../components/DashboardLayout'
import { ChevronDown } from 'lucide-react'
import Swal from 'sweetalert2'
import mascotStudying from '../assets/mascot-studying.webp'
import CourseMap from '../components/CourseMap'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const user = currentUser // Alias for existing code
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingChapter, setIsLoadingChapter] = useState(true)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)


  useEffect(() => {
    let isMounted = true;

    async function loadCurriculum() {
      if (!user) return;
      const grade = user.grade || 1;
      
      // Only show loading if we don't have this grade cached
      if (!curriculumService.isGradeCached(grade)) {
        setIsLoadingChapter(true);
      }

      try {
        const curriculum = await curriculumService.getCurriculumByGrade(grade);
        
        if (!isMounted) return;
        
        const fetchedChapters = curriculum?.chapters || [];
        setChapters(fetchedChapters);

        // Find the first chapter with uncompleted lessons using real user stats
        const completedIds = user.stats?.completedLessonIds || [];
        const firstIncompleteIdx = fetchedChapters.findIndex(c => 
          c.modules.some(m => m.lessons.some(l => !completedIds.includes(l.id)))
        );
        
        setActiveChapterIndex(firstIncompleteIdx === -1 ? 0 : firstIncompleteIdx);
      } catch (error) {
        console.error("Failed to load curriculum:", error);
      } finally {
        if (isMounted) setIsLoadingChapter(false);
      }
    }

    loadCurriculum();
    return () => { isMounted = false };
  }, [user?.grade, user?.uid]);

  const handleUploadCurriculum = async () => {
    setIsUploading(true);
    try {
      await curriculumService.uploadCurriculum();
      Swal.fire({
        title: 'Success!',
        text: 'Curriculum data uploaded to Firestore successfully!',
        icon: 'success',
        heightAuto: false
      });
      // reload all chapters
      const grade = user?.grade || 1;
      const curriculum = await curriculumService.getCurriculumByGrade(grade);
      setChapters(curriculum?.chapters || []);
    } catch(error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload data. Ensure you have proper permissions in firestore.rules.',
        icon: 'error',
        heightAuto: false
      });
    } finally {
      setIsUploading(false);
    }
  }




  const handleStartLesson = (lessonId: string) => {
    navigate(`/quiz/${lessonId}`);
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="welcome-section" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="grade-selector-btn" 
              onClick={() => navigate('/select-grade')}
            >
              <span className="grade-text">Grade {user.grade || 1}</span>
              <ChevronDown size={20} />
            </button>

            {/* TEMP UPLOAD BUTTON */}
            <button 
              onClick={handleUploadCurriculum} 
              disabled={isUploading}
              className="btn-dark-pill"
              style={{ padding: '8px 16px', fontSize: '0.75rem' }}
            >
              {isUploading ? 'UPLOADING...' : 'UPLOAD DATA TO DB'}
            </button>
          </div>
        </header>

        <div className="dashboard-content-single">
          {isLoadingChapter ? (
            <div className="pulse" style={{ textAlign: 'center', padding: '40px' }}>Loading your adventure map...</div>
          ) : chapters.length > 0 ? (
            <CourseMap 
              chapterNumber={activeChapterIndex + 1}
              chapterTitle={chapters[activeChapterIndex].title}
              modules={chapters[activeChapterIndex].modules} 
              onStartLesson={handleStartLesson} 
              totalChapters={chapters.length}
              currentIndex={activeChapterIndex}
              onNextChapter={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
              onPrevChapter={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
              completedLessonIds={user.stats?.completedLessonIds || []}
              prevChapterTitle={activeChapterIndex > 0 ? chapters[activeChapterIndex - 1].title : undefined}
              nextChapterTitle={activeChapterIndex < chapters.length - 1 ? chapters[activeChapterIndex + 1].title : undefined}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No map found for this grade.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '10px'}}>Click the UPLOAD DATA button above to seed the database.</p>
            </div>
          )}
        </div>
      </main>

    </DashboardLayout>
  )
}

export default Dashboard
