import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'
import mascot from '../assets/mascot.webp'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'That doesn\'t look like a valid email'
    }
    if (!password) {
      newErrors.password = 'Please enter your password'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})
    try {
      await authService.login(email, password)
      // Navigation is handled by the useEffect watching currentUser
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrors({ general: 'Invalid email or password.' })
      } else {
        setErrors({ general: 'An error occurred during sign in. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="login-page-container">
      <Navbar />

      <main className="login-main" id="login-page">
        <div className="login-center-wrapper">
          {/* Mascot Guide */}
          <div className="mascot-guide-container login-mascot-guide">
            <div className="speech-bubble">
              Welcome back! Ready for some math adventures?
            </div>
            <img src={mascot} alt="Mbalo mascot" className="mascot-guide-img" />
          </div>

          {/* Header */}
          <div className="login-form-header">
            <p>Sign in to your account to continue learning</p>
          </div>

          {/* Login Form Section (No longer a card) */}
          <div className="login-form-area" id="login-form-area">
            <form onSubmit={handleSubmit} noValidate>
              {errors.general && (
                <div className="error-message" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
                  {errors.general}
                </div>
              )}
              {/* Email */}
              <div className="form-group-game">
                <label className="form-label-game" htmlFor="login-email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="login-email"
                  className={`form-input-game ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  autoComplete="email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="form-error-msg" id="email-error">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="form-group-game">
                <label className="form-label-game" htmlFor="login-password">
                  Password
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    className={`form-input-game ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="password-toggle"
                    tabIndex={-1}
                    style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--mbalo-teal)' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <div className="form-error-msg" id="password-error">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="form-helpers">
                <label className="remember-check" id="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" data-testid="forgot-password" className="forgot-link" id="forgot-password">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-game btn-game-primary w-100 justify-content-center"
                id="login-submit"
                disabled={isLoading}
                style={{ fontSize: '1.1rem', padding: '16px' }}
              >
                {isLoading ? (
                  <>Signing in...</>
                ) : (
                  <>Sign In</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="btn-google"
              onClick={async () => {
                setIsLoading(true)
                try {
                  await authService.loginWithGoogle()
                } catch (error: any) {
                  if (error.message === 'auth/user-not-found') {
                    setErrors({ general: 'You don\'t have an account yet. Please sign up first.' })
                  } else {
                    setErrors({ general: 'Google sign-in failed. Please try again.' })
                  }
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Removed quick access mock section as requested */}

            {/* Sign up prompt removed for simplified version */}
          </div>


        </div>
      </main>

      <Footer minimal={true} />
    </div>
  )
}

export default Login
