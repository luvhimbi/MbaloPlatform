import { Link } from 'react-router-dom'
import mascot from '../assets/mascot.webp'

interface FooterProps {
  minimal?: boolean
}

function Footer({ minimal = false }: FooterProps) {
  return (
    <footer className="mbalo-footer" id="footer">
      <div className="container">
        {!minimal && (
          <div className="row g-4 mb-5 align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <div className="footer-logo justify-content-center justify-content-lg-start">
                <img src={mascot} alt="Mbalo mascot" style={{ width: '32px', height: '32px', objectFit: 'contain', marginRight: '10px' }} />
                Mbalo
              </div>
              <p className="footer-desc mx-auto mx-lg-0 mt-3" style={{ maxWidth: '400px', fontSize: '1.1rem' }}>
                Making maths fun for every young learner in South Africa and beyond. Learn, play, and grow!
              </p>
              <div className="footer-social mt-4 justify-content-center justify-content-lg-start">
                <a href="#" className="footer-social-btn" aria-label="Facebook">f</a>
                <a href="#" className="footer-social-btn" aria-label="Instagram">in</a>
                <a href="#" className="footer-social-btn" aria-label="Twitter">X</a>
                <a href="#" className="footer-social-btn" aria-label="YouTube">yt</a>
              </div>
            </div>

            <div className="col-lg-6 text-center text-lg-end mt-5 mt-lg-0">
              <h5 className="footer-heading mb-4" style={{ fontSize: '1.25rem', color: 'var(--mbalo-text)' }}>Math Adventures</h5>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-end gap-2">
                <a href="#adventures" className="badge-game badge-teal text-decoration-none px-3 py-2">Addition</a>
                <a href="#adventures" className="badge-game badge-orange text-decoration-none px-3 py-2">Subtraction</a>
                <a href="#adventures" className="badge-game badge-pink text-decoration-none px-3 py-2">Multiplication</a>
                <a href="#adventures" className="badge-game badge-yellow text-decoration-none px-3 py-2">Division</a>
                <a href="#adventures" className="badge-game badge-blue text-decoration-none px-3 py-2">Word Problems</a>
              </div>
            </div>
          </div>
        )}

        <div className={`footer-bottom text-center ${minimal ? 'pt-0 border-0 mt-0' : ''}`}>
          <p className="mb-2">© 2026 Mbalo. Made with love for young math champions everywhere.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/privacy" className="footer-link-small" style={{ fontSize: '0.85rem', color: 'var(--mbalo-text-light)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" className="footer-link-small" style={{ fontSize: '0.85rem', color: 'var(--mbalo-text-light)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/popi-act" className="footer-link-small" style={{ fontSize: '0.85rem', color: 'var(--mbalo-text-light)', textDecoration: 'none' }}>POPI Act</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
