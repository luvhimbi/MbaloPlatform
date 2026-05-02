import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import './LegalPages.css'

function POPIAct() {
  const { currentUser } = useAuth()
  return (
    <div className="legal-page">
      <Navbar />
      <main className="legal-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="legal-header">
                <h1>POPI <span className="text-fun">Act</span></h1>
                <p>Protection of Personal Information in South Africa</p>
              </div>

              {currentUser && (
                <div className="user-auth-badge mb-4 p-3 rounded-4" style={{ background: 'var(--mbalo-teal-light)', border: '2px solid var(--mbalo-teal)', color: 'var(--mbalo-teal-dark)', fontWeight: 800 }}>
                  🛡️ Hello {currentUser.displayName || 'Hero Learner'}! You are viewing this as a registered member. Your data is protected under POPIA guidelines.
                </div>
              )}

              <div className="legal-content-wrap">
                <div className="legal-content">
                  <span className="last-updated">Last Updated: May 1, 2026</span>
                  
                  <p>
                    Mbalo is fully committed to the Protection of Personal Information Act (POPIA) of South Africa. 
                    We respect your right to privacy and take the protection of your personal information seriously.
                  </p>

                  <h3>1. Our Commitment to POPIA</h3>
                  <p>
                    In accordance with POPIA, Mbalo ensures that all personal information is processed:
                  </p>
                  <ul>
                    <li>Lawfully and transparently.</li>
                    <li>For a specific, explicitly defined, and lawful purpose.</li>
                    <li>Only to the extent that it is adequate, relevant, and not excessive.</li>
                    <li>Accurately and kept up to date where necessary.</li>
                  </ul>

                  <h3>2. Information Officer</h3>
                  <p>
                    Our Information Officer oversees our compliance with POPIA. You can contact them 
                    regarding any questions or concerns about how your data is handled.
                  </p>
                  <p>
                    <strong>Information Officer:</strong> Tsumbo Masutha
                    <br />
                    <strong>Email:</strong> compliance@mbalo.com
                  </p>

                  <h3>3. Data Subject Participation</h3>
                  <p>
                    Under POPIA, you have the following rights regarding your personal information:
                  </p>
                  <ul>
                    <li>The right to be notified that your personal information is being collected.</li>
                    <li>The right to request access to the information we hold about you.</li>
                    <li>The right to request the correction, destruction, or deletion of your information.</li>
                    <li>The right to object to the processing of your personal information.</li>
                  </ul>

                  <h3>4. Security Safeguards</h3>
                  <p>
                    We implement appropriate technical and organizational measures to prevent loss of, 
                    damage to, or unauthorized destruction of personal information and unlawful access 
                    to or processing of personal information.
                  </p>

                  <h3>5. Cross-Border Data Transfers</h3>
                  <p>
                    If your information is transferred outside of South Africa, we ensure that the recipient 
                    is subject to a law or agreement that provides an adequate level of protection 
                    substantially similar to the conditions for the lawful processing of personal information 
                    as per POPIA.
                  </p>

                  <h3>6. Complaints</h3>
                  <p>
                    If you believe your rights under POPIA have been infringed, you have the right 
                    to lodge a complaint with the Information Regulator:
                    <br />
                    <strong>Website:</strong> https://inforegulator.org.za/
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default POPIAct
