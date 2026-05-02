import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { authService } from '../services/authService'
import {
  PawPrint,
  Bird,
  Bone,
  Settings,
  LogOut,
  X,
  Footprints,
  Target
} from 'lucide-react'
import './Sidebar.css'

import mascotSad from '../assets/mascot-sad.webp'
import mascot from '../assets/mascot.webp'


interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Wait, friend!',
      text: "The dog will be so sad and lonely while you're away!",
      imageUrl: mascotSad,
      imageWidth: 120,
      imageHeight: 120,
      imageAlt: 'Sleeping Mbalo Mascot',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out',
      cancelButtonText: 'No, I\'ll stay!',
      reverseButtons: true,
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    })

    if (result.isConfirmed) {
      try {
        await authService.logout()
        navigate('/login')
      } catch (error) {
        console.error("Error logging out:", error)
      }
    }
  }

  const menuItems = [
    { icon: PawPrint, label: 'Dashboard', path: '/dashboard', active: window.location.pathname === '/dashboard' },
    { icon: Target, label: 'Practice', path: '/practice', active: window.location.pathname === '/practice' },
    { icon: Bone, label: 'My Progress', path: '/progress', active: window.location.pathname === '/progress' },
    { icon: Settings, label: 'Settings', path: '/profile', active: window.location.pathname === '/profile' },
  ]

  return (
    <>
      <aside className={`mbalo-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <img src={mascot} alt="Mbalo mascot" className="sidebar-logo-img" />
          <div className="sidebar-title">Mbalo</div>
          {onClose && (
            <button className="mobile-close" onClick={onClose}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-link ${item.active ? 'active' : ''}`}
              onClick={() => item.path !== '#' && navigate(item.path)}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={22} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="mobile-bottom-nav">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`mobile-nav-item ${item.active ? 'active' : ''}`}
            onClick={() => item.path !== '#' && navigate(item.path)}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
