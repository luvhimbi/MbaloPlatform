import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import mascotHappy from '../assets/mascot-happy.webp'
import mascotPlayful from '../assets/mascot-playful.webp'
import './Landing.css'

function Landing() {
  return (
    <>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="hero-section" id="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center justify-content-lg-start">
                <span className="badge-game badge-teal">Premium Math Adventure</span>
                <span className="badge-game badge-orange">Grade 1-7</span>
              </div>

              <h1 className="hero-title">
                Master Math with Your <span className="text-fun">New Best Friend</span>!
              </h1>

              <p className="hero-subtitle">
                Mbalo turns the CAPS curriculum into a fun, dog-themed adventure. Join Tsumbo Masutha's vision of making every child a math hero!
              </p>

              <div className="d-flex gap-3 flex-wrap btn-group-hero justify-content-center justify-content-lg-start">
                <Link to="/onboarding" className="btn-game btn-game-primary" id="hero-cta-start" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Start Your Quest
                </Link>
                <Link to="/about" className="btn-game btn-game-outline" id="hero-cta-about" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                  Meet the Team
                </Link>
              </div>

              <div className="hero-stat-cards justify-content-center justify-content-lg-start mt-4">
                <div className="hero-stat-card">
                  <span className="stat-icon">✓</span>
                  <span>100% CAPS Aligned</span>
                </div>
                <div className="hero-stat-card">
                  <span className="stat-icon">★</span>
                  <span>Interactive Lessons</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-image-wrap text-center position-relative">
                <img src={mascotHappy} alt="Happy Dog Mascot" className="hero-mascot-img" />
                <div className="hero-floating-bubble">
                  "Ready to learn, human?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="features-section section-spacing" id="features">
        <div className="container">
          <div className="section-header">
            <span className="badge-game badge-pink section-badge">Core Features</span>
            <h2>Effective <span className="text-fun">Math</span> Learning</h2>
            <p>Everything your child needs to excel in primary school mathematics</p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-game card-game-teal h-100 wobble-hover" id="feature-lessons">
                <div className="feature-icon-wrap teal">A+</div>
                <h4>Structured Lessons</h4>
                <p>Clear, step-by-step lessons with guided hints for independent learning.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-game card-game-orange h-100 wobble-hover" id="feature-practice">
                <div className="feature-icon-wrap orange">123</div>
                <h4>Practice Mode</h4>
                <p>Short, replayable challenge rounds that build confidence through fun repetition.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-game card-game-pink h-100 wobble-hover" id="feature-tracking">
                <div className="feature-icon-wrap pink">✓</div>
                <h4>Progress Tracking</h4>
                <p>Parent dashboards show wins, weak spots, and what to practice next.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-game card-game-yellow h-100 wobble-hover" id="feature-at-home">
                <div className="feature-icon-wrap yellow">H</div>
                <h4>At-Home Study</h4>
                <p>Calm home learning mode with kid-friendly pacing and no distracting visuals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Adventures / Game Cards Section ─── */}
      <section className="adventures-section section-spacing" id="adventures">
        <div className="container">
          <div className="section-header">
            <span className="badge-game badge-orange section-badge">Topics</span>
            <h2>Learning <span className="text-energy">Modules</span></h2>
            <p>Explore our comprehensive curriculum across all key math topics</p>
          </div>

          <div className="row g-4">
            {/* Addition Island */}
            <div className="col-md-6 col-lg-3">
              <div className="adventure-card teal-theme" id="adventure-addition">
                <div className="adventure-card-header">
                  <div className="adventure-card-symbol">+</div>
                  <div>
                    <h5 className="adventure-title">Addition</h5>
                    <p className="adventure-desc">Mastering numbers up to 1000</p>
                  </div>
                </div>
                <div className="adventure-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge-game badge-teal" style={{ fontSize: '0.75rem' }}>24 Units</span>
                  </div>
                  <p className="small text-muted mb-0">From basic counting to large numbers.</p>
                </div>
              </div>
            </div>

            {/* Subtraction Safari */}
            <div className="col-md-6 col-lg-3">
              <div className="adventure-card orange-theme" id="adventure-subtraction">
                <div className="adventure-card-header">
                  <div className="adventure-card-symbol">−</div>
                  <div>
                    <h5 className="adventure-title">Subtraction</h5>
                    <p className="adventure-desc">Developing subtraction skills</p>
                  </div>
                </div>
                <div className="adventure-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge-game badge-orange" style={{ fontSize: '0.75rem' }}>18 Units</span>
                  </div>
                  <p className="small text-muted mb-0">Mastering the art of subtraction.</p>
                </div>
              </div>
            </div>

            {/* Multiplication Mountain */}
            <div className="col-md-6 col-lg-3">
              <div className="adventure-card pink-theme" id="adventure-multiplication">
                <div className="adventure-card-header">
                  <div className="adventure-card-symbol">×</div>
                  <div>
                    <h5 className="adventure-title">Multiplication</h5>
                    <p className="adventure-desc">Mastering times tables</p>
                  </div>
                </div>
                <div className="adventure-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge-game badge-pink" style={{ fontSize: '0.75rem' }}>24 Units</span>
                  </div>
                  <p className="small text-muted mb-0">Times tables and mental math.</p>
                </div>
              </div>
            </div>

            {/* Division */}
            <div className="col-md-6 col-lg-3">
              <div className="adventure-card yellow-theme" id="adventure-division">
                <div className="adventure-card-header">
                  <div className="adventure-card-symbol">÷</div>
                  <div>
                    <h5 className="adventure-title">Division</h5>
                    <p className="adventure-desc">Understanding sharing and division</p>
                  </div>
                </div>
                <div className="adventure-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge-game badge-yellow" style={{ fontSize: '0.75rem' }}>15 Units</span>
                  </div>
                  <p className="small text-muted mb-0">Introduction to sharing and division.</p>
                </div>
              </div>
            </div>

            {/* Word Problems */}
            <div className="col-md-6 col-lg-3">
              <div className="adventure-card blue-theme" id="adventure-word-problems">
                <div className="adventure-card-header">
                  <div className="adventure-card-symbol">?</div>
                  <div>
                    <h5 className="adventure-title">Word Problems</h5>
                    <p className="adventure-desc">Applying math to real life</p>
                  </div>
                </div>
                <div className="adventure-card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge-game badge-blue" style={{ fontSize: '0.75rem' }}>12 Units</span>
                  </div>
                  <p className="small text-muted mb-0">Solving tricky real-world puzzles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="how-section section-spacing" id="how">
        <div className="container">
          <div className="section-header">
            <span className="badge-game badge-green section-badge">Easy Peasy</span>
            <h2>How <span className="text-fun">Mbalo</span> Works</h2>
            <p>Three simple steps to start your math journey</p>
          </div>
          <div className="safe-note text-center mb-4">
            Built for young learners: simple screens, clear text, and parent-friendly guidance.
          </div>

          <div className="row align-items-start justify-content-center">
            {/* Step 1 */}
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number" style={{ backgroundColor: 'var(--mbalo-teal-light)', color: 'var(--mbalo-teal)', borderColor: 'var(--mbalo-teal)' }}>
                  1
                </div>
                <h4>Sign Up Free</h4>
                <p>Create your profile, pick an avatar, and choose your grade level</p>
              </div>
            </div>

            <div className="col-md-1 d-none d-md-block">
              <div className="step-connector">→</div>
            </div>

            {/* Step 2 */}
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number" style={{ backgroundColor: 'var(--mbalo-orange-light)', color: 'var(--mbalo-orange)', borderColor: 'var(--mbalo-orange)' }}>
                  2
                </div>
                <h4>Select a Module</h4>
                <p>Choose from addition, subtraction, multiplication, or division lessons</p>
              </div>
            </div>

            <div className="col-md-1 d-none d-md-block">
              <div className="step-connector">→</div>
            </div>

            {/* Step 3 */}
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number" style={{ backgroundColor: 'var(--mbalo-pink-light)', color: 'var(--mbalo-pink)', borderColor: 'var(--mbalo-pink)' }}>
                  3
                </div>
                <h4>Start Learning</h4>
                <p>Follow the lessons and complete exercises to master every topic.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta-section section-spacing" id="cta">
        <div className="container">
          <div className="cta-card card-game card-game-teal" style={{ background: 'var(--mbalo-teal)', border: '4px solid var(--mbalo-teal-dark)' }}>
            <img src={mascotPlayful} alt="Playful Dog Mascot" className="cta-mascot" loading="lazy" />
            <h2 className="text-white">Ready for a <span className="text-fun" style={{ color: 'var(--mbalo-yellow)' }}>Math Adventure</span>?</h2>
            <p className="text-white" style={{ maxWidth: '520px', margin: '0 auto var(--space-xl)', opacity: 0.9 }}>
              Join Tsumbo Masutha and thousands of students who are mastering math every day!
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/onboarding" className="btn-game btn-game-primary btn-lg" id="cta-start" style={{ backgroundColor: 'var(--mbalo-white)', color: 'var(--mbalo-teal)' }}>
                Get Started Free
              </Link>
            </div>

            <div className="d-flex gap-3 justify-content-center mt-5 flex-wrap">
              <span className="badge-game badge-green" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white' }}>No credit card needed</span>
              <span className="badge-game badge-teal" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white' }}>Safe & secure</span>
              <span className="badge-game badge-pink" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white' }}>CAPS aligned</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>

  )
}

export default Landing
