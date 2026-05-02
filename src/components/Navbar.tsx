import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import mascot from '../assets/mascot.webp'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg mbalo-navbar" id="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand mbalo-logo" id="logo">
          <img src={mascot} alt="Mbalo mascot" className="logo-img" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          Mbalo
        </Link>

        <button 
          className="navbar-toggler mobile-menu-toggle" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link to="/" className="nav-link-game" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link-game" onClick={() => setIsMenuOpen(false)}>About</Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <div className="nav-divider-vertical"></div>
            </li>
            
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link-game d-flex align-items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link to="/profile" className="btn-game btn-game-primary d-block text-center" onClick={() => setIsMenuOpen(false)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
                    My Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link-game" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link to="/onboarding" className="btn-game btn-game-primary d-block text-center" onClick={() => setIsMenuOpen(false)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
                    Join Free
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
