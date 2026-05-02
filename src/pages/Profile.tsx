import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import DashboardLayout from '../components/DashboardLayout'
import { 
  Loader2, Check, X, Calendar, Settings, 
  Moon, Sun, Shield, FileText, LogOut, Trash2, ChevronRight 
} from 'lucide-react'
import Swal from 'sweetalert2'
import './Profile.css'

function Profile() {
  const { currentUser } = useAuth()
  const user = currentUser
  const navigate = useNavigate()
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(currentUser?.displayName || '')
  const [isSavingName, setIsSavingName] = useState(false)
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('mbalo_theme') === 'dark' || document.body.classList.contains('dark-mode')
  })

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('mbalo_theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('mbalo_theme', 'light')
    }
  }, [isDarkMode])

  if (!user) return null

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.displayName) {
      setIsEditingName(false)
      return
    }
    setIsSavingName(true)
    try {
      await authService.updateUserName(user.uid, newName.trim())
      setIsEditingName(false)
      await Swal.fire({
        title: 'Name Updated!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        heightAuto: false,
        customClass: {
          popup: 'mbalo-swal-popup',
          title: 'mbalo-swal-title'
        }
      })
      window.location.reload()
    } catch (error) {
      console.error("Error updating name:", error)
      Swal.fire({
        title: 'Oops!',
        text: 'Failed to update name',
        icon: 'error',
        heightAuto: false
      })
    } finally {
      setIsSavingName(false)
    }
  }

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'var(--mbalo-teal)',
      cancelButtonColor: 'var(--mbalo-red)',
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title'
      }
    })

    if (result.isConfirmed) {
      await authService.logout()
      navigate('/login')
    }
  }

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account?',
      text: 'This action is permanent and cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Everything',
      cancelButtonText: 'No, Keep it',
      confirmButtonColor: 'var(--mbalo-red)',
      cancelButtonColor: 'var(--mbalo-teal)',
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title'
      }
    })

    if (result.isConfirmed) {
      try {
        await authService.deleteAccount(user.uid)
        await authService.logout()
        navigate('/')
        Swal.fire({
          title: 'Account Deleted',
          text: 'We are sorry to see you go!',
          icon: 'success',
          heightAuto: false
        })
      } catch (error) {
        console.error("Error deleting account:", error)
        Swal.fire({
          title: 'Error',
          text: 'To delete your account, please log out and log back in first for security.',
          icon: 'error',
          heightAuto: false
        })
      }
    }
  }

  const currentGrade = user.grade || 1

  return (
    <DashboardLayout showDecor={false}>
      <main className="profile-main">
        {/* Profile Card */}
        <div className="profile-horizontal-card">
          <div className="profile-horiz-avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="profile-horiz-info">
            {isEditingName ? (
              <div className="profile-name-edit">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  className="profile-name-input"
                  placeholder="Your Name"
                />
                <button onClick={handleSaveName} disabled={isSavingName} className="profile-action-btn success">
                  {isSavingName ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                </button>
                <button onClick={() => setIsEditingName(false)} disabled={isSavingName} className="profile-action-btn cancel">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <h1 className="profile-horiz-name">{user.displayName ? user.displayName.toUpperCase() : 'HERO LEARNER'}</h1>
            )}
            <p className="profile-horiz-email">{user.email?.toUpperCase()}</p>
            
            <div className="profile-horiz-badges">
              <div className="profile-badge badge-outline">
                <Calendar size={14} /> 
                JOINED {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : 'TODAY'}
              </div>
              <div className="profile-badge badge-yellow" onClick={() => navigate('/select-grade')} style={{cursor: 'pointer'}}>
                LEARNING: GRADE {currentGrade}
              </div>
            </div>
          </div>

          {!isEditingName && (
            <div className="profile-horiz-actions">
              <button 
                className="btn-dark-pill"
                onClick={() => {
                  setIsEditingName(true); 
                  setNewName(user.displayName || '');
                }}
              >
                EDIT PROFILE
              </button>
            </div>
          )}
        </div>

        {/* Settings Grid */}
        <div className="settings-container">
          <div className="settings-section card-game">
            <h2 className="settings-section-title">
              <Settings size={20} /> Appearance
            </h2>
            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">Dark Mode</p>
                <p className="settings-item-desc">Easier on the eyes in the wild</p>
              </div>
              <button 
                className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                <div className="toggle-slider"></div>
              </button>
            </div>
          </div>

          <div className="settings-section card-game">
            <h2 className="settings-section-title">
              <Shield size={20} /> Legal & Privacy
            </h2>
            <Link to="/privacy" className="settings-link-item">
              <div className="link-icon-bg"><FileText size={18} /></div>
              <span>Privacy Policy</span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/terms" className="settings-link-item">
              <div className="link-icon-bg"><FileText size={18} /></div>
              <span>Terms of Service</span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/popi-act" className="settings-link-item">
              <div className="link-icon-bg"><Shield size={18} /></div>
              <span>POPI Act Compliance</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="settings-section card-game account-section">
            <h2 className="settings-section-title">
              <LogOut size={20} /> Account Actions
            </h2>
            <button className="settings-btn signout-btn" onClick={handleSignOut}>
              <LogOut size={18} /> Sign Out
            </button>
            <button className="settings-btn delete-btn" onClick={handleDeleteAccount}>
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}

export default Profile
