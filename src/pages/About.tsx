import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import mascot from '../assets/mascot.webp'
import mascotStudying from '../assets/mascot-studying.webp'
import mascotHappy from '../assets/mascot-happy.webp'
import mascotPlayful from '../assets/mascot-playful.webp'
import mascotSleeping from '../assets/mascot-sleeping.webp'
import './About.css'

function About() {
  return (
    <div className="about-page-container">
      <Navbar />
      
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="about-title">The Heart Behind <span className="text-fun">Mbalo</span></h1>
                <p className="about-subtitle">
                  More than just numbers—Mbalo is a journey of discovery, growth, and fun, built specifically for the next generation of learners.
                </p>
                <div className="developer-badge">
                  <span>Founder & Lead Developer: <strong>Talifhani Luvhimbi</strong></span>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <img src={mascotHappy} alt="Happy Mascot" className="about-hero-img" />
              </div>
            </div>
          </div>
        </section>

        {/* The Developer's Story */}
        <section className="about-story section-spacing">
          <div className="container">
            <div className="row align-items-center flex-row-reverse">
              <div className="col-lg-6">
                <div className="story-content">
                  <h2 className="section-title">The Story of <span className="text-energy">Talifhani Luvhimbi</span></h2>
                  <p>
                    Talifhani Luvhimbi founded Mbalo with a single vision: to make math accessible and enjoyable for every child in South Africa and beyond. Growing up, Talifhani realized that traditional education often missed the "spark" that keeps children engaged.
                  </p>
                  <p>
                    With a background in software engineering and a passion for education, Talifhani combined the mechanics of gamification with the rigor of the CAPS curriculum. The result is Mbalo—a platform that treats every math problem as a quest and every student as a hero.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <img src={mascotStudying} alt="Studying Mascot" className="story-mascot-img" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Mbalo? */}
        <section className="about-why section-spacing bg-white">
          <div className="container text-center">
            <h2 className="section-title mb-5">Why Choose <span className="text-fun">Mbalo</span>?</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="feature-card-game card-game-teal">
                  <div className="icon-circle-md color-teal mb-3">✓</div>
                  <h4>CAPS Aligned</h4>
                  <p>Our content is meticulously mapped to the official South African curriculum standards.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card-game card-game-orange">
                  <div className="icon-circle-md color-orange mb-3">★</div>
                  <h4>Safe & Secure</h4>
                  <p>A parent-safe environment with no ads, trackers, or unwanted distractions.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card-game card-game-yellow">
                  <div className="icon-circle-md color-yellow mb-3">♥</div>
                  <h4>Kid-Centric</h4>
                  <p>Designed for small hands and big imaginations, with clear text and intuitive UI.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mascot Gallery */}
        <section className="mascot-gallery section-spacing">
          <div className="container text-center">
            <h2 className="section-title mb-2">Meet Your <span className="text-fun">Study Buddy</span></h2>
            <p className="mb-5">Our mascot isn't just a guide—he's your companion through every lesson!</p>
            
            <div className="gallery-grid">
              <div className="gallery-item">
                <img src={mascotPlayful} alt="Playful Mascot" loading="lazy" />
                <span>Playful Explorer</span>
              </div>
              <div className="gallery-item">
                <img src={mascot} alt="Standard Mascot" loading="lazy" />
                <span>Ready for Adventure</span>
              </div>
              <div className="gallery-item">
                <img src={mascotSleeping} alt="Sleeping Mascot" loading="lazy" />
                <span>Dreaming of Numbers</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta section-spacing">
          <div className="container">
            <div className="cta-box card-game card-game-teal">
              <img src={mascotPlayful} alt="Playful Mascot" className="cta-mascot-small" loading="lazy" />
              <h2>Join the <span className="text-white">Adventure</span> Today</h2>
              <p className="text-white opacity-90 mb-4">Give your child the gift of math confidence with Mbalo.</p>
              <div className="d-flex justify-content-center">
                <Link to="/onboarding" className="btn-game btn-game-primary btn-lg">
                  Get Started for Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
