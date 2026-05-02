import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BookOpen, TrendingUp, ChevronRight, Check, User, Mail, Lock, X } from 'lucide-react'
import mascot from '../../assets/mascot.webp'
import mascotHappy from '../../assets/mascot-happy.webp'
import mascotStudying from '../../assets/mascot-studying.webp'
import mascotPlayful from '../../assets/mascot-playful.webp'
import { authService } from '../../services/authService'
import './Onboarding.css'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    {
      type: 'info',
      icon: Sparkles,
      title: "Learn Math Through Play",
      description: "Dive into fun, interactive missions with your new best friend!",
      color: "teal",
      mascot: mascotPlayful
    },
    {
      type: 'info',
      icon: BookOpen,
      title: "Master the Curriculum",
      description: "All lessons are 100% CAPS aligned. Master everything from counting to patterns.",
      color: "orange",
      mascot: mascotStudying
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: "Track Your Journey",
      description: "Watch your progress soar! See exactly how much you're improving every day.",
      color: "yellow",
      mascot: mascotHappy
    },
    {
      type: 'input_name',
      icon: User,
      title: "What's your name?",
      description: "We'd love to know who we're going on an adventure with!",
      color: "teal",
      mascot: mascot
    },
    {
      type: 'input_email',
      icon: Mail,
      title: `Hi ${name || 'there'}!`,
      description: "Please provide your email address to save your progress.",
      color: "orange",
      mascot: mascotPlayful
    },
    {
      type: 'input_password',
      icon: Lock,
      title: `Last step, ${name || 'friend'}!`,
      description: "Create a password and agree to the rules of the adventure.",
      color: "pink",
      mascot: mascotHappy
    }
  ]

  const handleNext = async () => {
    setError(null)
    const currentType = steps[step].type;

    // Validate inputs before moving to next step
    if (currentType === 'input_name' && !name.trim()) return;
    
    if (currentType === 'input_email') {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.')
        return;
      }
      
      setIsRegistering(true);
      try {
        const exists = await authService.checkEmailExists(email);
        if (exists) {
          setError('This email is already registered. Please log in instead.');
          setIsRegistering(false);
          return;
        }
      } catch (err) {
        console.error("Email check failed", err);
      }
      setIsRegistering(false);
    }
    
    if (step < steps.length - 1) {
      setStep(step + 1)
    }
  }

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    
    setIsRegistering(true)
    setError(null)
    
    try {
      await authService.register(email, password, name, 1)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError('Failed to create account. Please try again.')
      }
      setIsRegistering(false)
    }
  }

  const handleSkipToReg = () => {
    setStep(3) // Skip directly to name input
  }

  const currentStepData = steps[step]

  // Allow enter key to proceed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === steps.length - 1) {
        handleRegister();
      } else {
        handleNext();
      }
    }
  }

  return (
    <div className="onboarding-container">
      {/* Background Shapes */}
      <div className={`onboarding-bg shape-top bg-${currentStepData.color}`}></div>
      <div className={`onboarding-bg shape-bottom bg-${currentStepData.color}`}></div>

      <div className="onboarding-header">
        <button className="close-btn" onClick={() => navigate('/')}>
          <X size={22} />
        </button>
        {step < 3 && (
          <button className="skip-btn" onClick={handleSkipToReg}>
            Skip
          </button>
        )}
      </div>

      <div className="onboarding-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="onboarding-slide"
          >
            {/* Display Icon or Mascot */}
            <div className={`icon-circle-large color-${currentStepData.color}`} style={{ margin: '0 auto var(--space-2xl)' }}>
              <img src={currentStepData.mascot || mascot} alt="Mbalo Mascot" className="mascot-img-large" />
            </div>
            
            <h1 className="onboarding-title">{currentStepData.title}</h1>
            <p className="onboarding-desc">{currentStepData.description}</p>

            {/* Error Message */}
            {error && (
              <div className="error-message" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginTop: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Interactive Inputs */}
            {currentStepData.type !== 'info' && (
              <div className="register-form" style={{ marginTop: 'var(--space-xl)', textAlign: 'left', width: '100%' }}>
                
                {currentStepData.type === 'input_name' && (
                  <div className="form-group-game">
                    <input 
                      type="text" 
                      className="form-input-game" 
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  </div>
                )}

                {currentStepData.type === 'input_email' && (
                  <div className="form-group-game">
                    <input 
                      type="email" 
                      className="form-input-game" 
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  </div>
                )}

                {currentStepData.type === 'input_password' && (
                  <>
                    <div className="form-group-game">
                      <input 
                        type="password" 
                        className="form-input-game" 
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    </div>
                    <div className="form-group-game mt-3">
                      <input 
                        type="password" 
                        className="form-input-game" 
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    
                    <div className="terms-agreement mt-4">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <span className="terms-text">
                          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>, <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/popi-act" target="_blank" rel="noopener noreferrer">POPI Act</a>.
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="onboarding-footer">
        <div className="progress-dots">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`dot ${i === step ? 'active' : ''} bg-${currentStepData.color}`} 
              style={{ opacity: i <= step ? 1 : 0.3 }}
            />
          ))}
        </div>

        <button 
          className={`btn-game btn-game-${currentStepData.color} btn-next`} 
          onClick={step === steps.length - 1 ? () => handleRegister() : handleNext}
          disabled={
            isRegistering ||
            (currentStepData.type === 'input_name' && !name.trim()) ||
            (currentStepData.type === 'input_email' && !email.trim()) ||
            (currentStepData.type === 'input_password' && (!password || !confirmPassword || !termsAccepted))
          }
        >
          {step === steps.length - 1 ? (
            <>{isRegistering ? 'Creating...' : 'Start Playing'} <Check size={20} /></>
          ) : (
            <>Next <ChevronRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
