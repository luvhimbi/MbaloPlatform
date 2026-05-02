import { useEffect, useState } from 'react'
import type { GradeCurriculum } from '../types/curriculum'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { curriculumService } from '../services/curriculumService'
import Sidebar from '../components/Sidebar'
import { Clock, Target, Award, BarChart3, BookOpen, AlertCircle, Play } from 'lucide-react'
import mascotImg from '../assets/mascot-happy.webp'
import './Progress.css'

function Progress() {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  const [curriculum, setCurriculum] = useState<GradeCurriculum | null>(null)

  useEffect(() => {
    let isMounted = true;
    if (!loading && !currentUser) {
      navigate('/login')
    } else if (currentUser) {
      curriculumService.getCurriculumByGrade(currentUser.grade || 1).then(data => {
        if (isMounted) setCurriculum(data);
      });
    }
    return () => { isMounted = false; }
  }, [currentUser, loading, navigate])

  if (loading || !currentUser) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content-wrapper">
          <main className="progress-main" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <div className="pulse">Loading analytics...</div>
          </main>
        </div>
      </div>
    )
  }

  const stats = currentUser.stats

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content-wrapper">
        <main className="progress-main">
          <header className="progress-header">
            <h1 className="pop-in">Your Math Adventure</h1>
          </header>

          <div className="mascot-insight card-game card-game-white mb-5">
            <div className="mascot-guide-container">
              <div className="speech-bubble reflective-text">
                {stats?.lessonsCompleted === 0 
                  ? "Hi explorer! Our safari map is waiting. Let's find your first math treasure together!"
                  : `Incredible! You've conquered ${stats?.lessonsCompleted} missions. You're becoming a true Safari Math Legend!`
                }
              </div>
              <img src={mascotImg} alt="Safari Mascot" className="mascot-guide-img" style={{ width: '140px' }} />
            </div>
          </div>

          <div className="daily-adventure-goal card-game card-game-orange mb-5">
            <div className="goal-header">
              <div className="goal-title-group">
                <h3>Today's Adventure</h3>
                <p>Complete 3 missions to find the Golden Compass!</p>
              </div>
              <div className="goal-status">
                <span className="goal-count">{Math.min(stats?.lessonsCompleted || 0, 3)} / 3</span>
              </div>
            </div>
            <div className="xp-bar-track goal-track">
              <div className="xp-bar-fill xp-bar-fill-orange" style={{ width: `${Math.min(((stats?.lessonsCompleted || 0) / 3) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="stats-overview-grid">
            <div className="stat-overview-card card-game card-game-teal">
              <div className="icon-circle icon-circle-teal">
                <BookOpen size={28} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats?.lessonsCompleted || 0}</span>
                <span className="stat-label">Missions Done</span>
              </div>
            </div>
            <div className="stat-overview-card card-game card-game-orange">
              <div className="icon-circle icon-circle-orange">
                <Clock size={28} />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {(stats?.totalTimeSpent || 0) >= 3600 
                    ? `${Math.floor((stats?.totalTimeSpent || 0) / 3600)}h`
                    : `${Math.floor((stats?.totalTimeSpent || 0) / 60)}m`
                  }
                </span>
                <span className="stat-label">Adventure Time</span>
              </div>
            </div>
            <div className="stat-overview-card card-game card-game-yellow">
              <div className="icon-circle icon-circle-yellow">
                <Target size={28} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats?.accuracy || 0}%</span>
                <span className="stat-label">Best Accuracy</span>
              </div>
            </div>
            <div className="stat-overview-card card-game card-game-white rank-badge-card">
              <div className="icon-circle icon-circle-pink pulse">
                <Award size={32} />
              </div>
              <div className="stat-content">
                <span className="stat-value reflective-rank">
                  {stats?.lessonsCompleted && stats.lessonsCompleted > 20 ? "Math Legend" : 
                   stats?.lessonsCompleted && stats.lessonsCompleted > 10 ? "Safari Hero" : "Junior Explorer"}
                </span>
                <span className="stat-label">Your Safari Rank</span>
              </div>
            </div>
          </div>

          {stats?.struggledQuestions && stats.struggledQuestions.length > 0 && (
            <div className="personalized-practice-alert card-game card-game-white mb-5 pop-in">
              <div className="practice-alert-content">
                <div className="alert-icon-group">
                  <div className="icon-circle icon-circle-orange pulse">
                    <AlertCircle size={28} />
                  </div>
                  <div className="alert-text">
                    <h3>Personalized Safari Practice</h3>
                    <p>You have {stats.struggledQuestions.length} tricky problems to conquer. Let's practice them!</p>
                  </div>
                </div>
                <button 
                  className="btn-game btn-game-orange"
                  onClick={() => navigate('/practice')}
                >
                  <Play size={20} fill="currentColor" />
                  Start Practice
                </button>
              </div>
            </div>
          )}

          <div className="analytics-full-width">
            <section className="module-mastery-section card-game card-game-white">
              <div className="section-header">
                <BarChart3 size={20} />
                <h3>Module Mastery</h3>
              </div>
              <div className="mastery-grid">
                {curriculum?.chapters.flatMap(chapter => chapter.modules).map((mod) => {
                  const moduleLessons = mod.lessons;
                  const completedInModule = moduleLessons.filter(lesson => 
                    stats?.completedLessonIds?.includes(lesson.id)
                  ).length;
                  
                  const progress = moduleLessons.length > 0 
                    ? Math.round((completedInModule / moduleLessons.length) * 100)
                    : 0;

                  const isFirstModule = curriculum.chapters[0].modules[0].id === mod.id;
                  if (progress === 0 && !isFirstModule) return null;
                  
                  return (
                    <div key={mod.id} className="mastery-card card-game card-game-teal">
                      <div className="mastery-card-header">
                        <div className="icon-circle icon-circle-teal mastery-icon">
                          {/* Use fallback icon if mod.icon is missing */}
                          {mod.icon === 'star' ? <Award size={24} /> : <BookOpen size={24} />}
                        </div>
                        <div className="mastery-title-group">
                          <span className="mastery-module-name">{mod.title}</span>
                          <span className="mastery-learning-goal">{mod.learningGoal}</span>
                        </div>
                        <span className="mastery-percentage">{progress}%</span>
                      </div>
                      
                      <div className="xp-bar-track">
                        <div className="xp-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      
                      <div className="mastery-action-box">
                        <span className="mastery-status-text">
                          {progress === 100 
                            ? "✨ All Missions Mastered!" 
                            : `🚀 ${completedInModule} of ${moduleLessons.length} lessons done`}
                        </span>
                        <button 
                          className={`btn-game btn-game-sm ${progress === 100 ? 'btn-game-outline' : 'btn-game-primary'}`}
                          onClick={() => navigate('/dashboard')}
                        >
                          {progress === 100 ? 'Review' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Progress
