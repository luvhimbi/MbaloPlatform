import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import mascot from '../assets/mascot-studying.webp'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await authService.resetPassword(email)
      setIsSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <Navbar />
      
      <main className="forgot-main">
        <div className="forgot-container">
          {/* Mascot Section */}
          <div className="mascot-section">
            <div className="speech-bubble">
              {isSent 
                ? "Check your inbox! I sent you a special link." 
                : "Don't worry, everyone forgets sometimes! I can help."}
            </div>
            <img src={mascot} alt="Studying mascot" className="forgot-mascot-img" />
          </div>

          <div className="forgot-form-area">
            {!isSent ? (
              <>
                <div className="text-center mb-4">
                  <h2 className="forgot-title">Forgot <span className="text-fun">Password?</span></h2>
                  <p className="text-muted">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert-game alert-danger mb-4">
                      {error}
                    </div>
                  )}

                  <div className="form-group-game">
                    <label className="form-label-game">Email Address</label>
                    <input
                      type="email"
                      className="form-input-game"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-game btn-game-primary w-100 py-3 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="success-icon mb-4">✓</div>
                <h2 className="forgot-title mb-3">Email Sent!</h2>
                <p className="text-muted mb-4">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions.
                </p>
                <button 
                  className="btn-game btn-game-outline w-100 py-3"
                  onClick={() => setIsSent(false)}
                >
                  Try another email
                </button>
              </div>
            )}

            <div className="text-center mt-4 pt-2 border-top">
              <Link to="/login" className="back-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer minimal />
    </div>
  )
}

export default ForgotPassword
