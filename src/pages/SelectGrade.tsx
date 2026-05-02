import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import DashboardLayout from '../components/DashboardLayout'
import { BookOpen, Egg, Rabbit, Bird, Fish, TreePine, Mountain, Crown, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'
import mascotCheering from '../assets/mascot-cheering.webp'
import './SelectGrade.css'

const GRADE_ICONS = [Egg, Rabbit, Bird, Fish, TreePine, Mountain, Crown]
const GRADE_LABELS = ['Hatchling', 'Explorer', 'Flyer', 'Swimmer', 'Ranger', 'Climber', 'Champion']

function SelectGrade() {
  const { currentUser } = useAuth()
  const user = currentUser
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)

  if (!user) return null
  
  const currentGrade = user.grade || 1

  const handleSelect = async (grade: number) => {
    if (grade === currentGrade) {
      navigate(-1)
      return
    }

    setIsUpdating(true)
    try {
      await authService.updateUserGrade(user.uid, grade)
      await Swal.fire({
        title: 'Grade Updated!',
        text: `You are now on Grade ${grade} adventure!`,
        imageUrl: mascotCheering,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Cheering Safari Dog',
        confirmButtonText: 'Let\'s go!',
        heightAuto: false,
        customClass: {
          popup: 'mbalo-swal-popup',
          title: 'mbalo-swal-title',
          confirmButton: 'swal2-confirm'
        }
      })
      navigate('/dashboard')
    } catch (error) {
      console.error("Error switching grade:", error)
      Swal.fire({
        title: 'Oops!',
        text: 'Failed to update grade. Please try again.',
        icon: 'error',
        confirmButtonColor: '#FF4D4D',
        heightAuto: false
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DashboardLayout showDecor={false}>
      <main className="select-grade-main">
        <header className="select-grade-header pop-in">
          <h1>Pick your Safari Level!</h1>
          <p>Choose the right grade for your math missions</p>
        </header>

        <div className="select-grade-actions slide-up">
           <button className="btn-dark-pill" onClick={() => navigate(-1)} disabled={isUpdating} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', fontSize: '1rem'}}>
             {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={20} />} 
             Keep Current Level
           </button>
        </div>

        <div className="select-grade-cards-grid stagger-in">
          {[1, 2, 3, 4, 5, 6, 7].map((g) => {
            const Icon = GRADE_ICONS[g - 1]
            return (
              <button
                key={g}
                className={`select-grade-card ${currentGrade === g ? 'active' : ''}`}
                onClick={() => handleSelect(g)}
                disabled={isUpdating}
              >
                <div className="grade-card-icon-box">
                  <Icon size={32} className="select-grade-icon" />
                </div>
                <div className="grade-card-info">
                  <span className="select-grade-number">Grade {g}</span>
                  <span className="select-grade-sublabel">{GRADE_LABELS[g - 1]}</span>
                </div>
                {currentGrade === g && <span className="select-current-badge">Current</span>}
              </button>
            )
          })}
        </div>
      </main>
    </DashboardLayout>
  )
}

export default SelectGrade
