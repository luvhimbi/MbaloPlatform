import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import './LegalPages.css'

function TermsOfService() {
  const { currentUser } = useAuth()
  return (
    <div className="legal-page">
      <Navbar />
      <main className="legal-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="legal-header">
                <h1>Terms of <span className="text-fun">Service</span></h1>
                <p>The rules of our math safari adventure</p>
              </div>

              {currentUser && (
                <div className="user-auth-badge mb-4 p-3 rounded-4" style={{ background: 'var(--mbalo-orange-light)', border: '2px solid var(--mbalo-orange)', color: 'var(--mbalo-orange-dark)', fontWeight: 800 }}>
                  📜 Welcome {currentUser.displayName || 'Hero Learner'}! By using your account, you agree to these safari rules.
                </div>
              )}

              <div className="legal-content-wrap">
                <div className="legal-content">
                  <span className="last-updated">Last Updated: May 1, 2026</span>
                  
                  <p>
                    Welcome to Mbalo! By using our platform, you agree to these terms. 
                    Please read them carefully, as they form a legal agreement between you and Mbalo.
                  </p>

                  <h3>1. Use of the Platform</h3>
                  <p>
                    Mbalo is an educational platform designed for children in grades 1-7. 
                    Accounts must be created and managed by a parent or legal guardian.
                  </p>
                  <ul>
                    <li>You agree to provide accurate and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>You agree to supervise your child's use of the platform.</li>
                  </ul>

                  <h3>2. Intellectual Property</h3>
                  <p>
                    All content on Mbalo, including math lessons, graphics, mascot designs, and animations, 
                    is the intellectual property of Mbalo and its founder, Tsumbo Masutha.
                  </p>
                  <ul>
                    <li>You may not copy, modify, or distribute any part of the platform without our permission.</li>
                    <li>The platform is for personal, non-commercial use only.</li>
                  </ul>

                  <h3>3. Prohibited Conduct</h3>
                  <p>
                    Users agree not to:
                  </p>
                  <ul>
                    <li>Attempt to gain unauthorized access to our systems or other user accounts.</li>
                    <li>Use the platform for any purpose other than intended educational use.</li>
                    <li>Reverse engineer or attempt to extract the source code of the platform.</li>
                  </ul>

                  <h3>4. Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate your account if you violate these terms 
                    or if we believe your actions may harm the platform or its users.
                  </p>

                  <h3>5. Limitation of Liability</h3>
                  <p>
                    While we strive for 100% accuracy in our educational content, Mbalo is provided "as is" 
                    without warranties of any kind. We are not liable for any indirect or consequential 
                    damages arising from your use of the platform.
                  </p>

                  <h3>6. Governing Law</h3>
                  <p>
                    These terms are governed by the laws of the Republic of South Africa.
                  </p>

                  <h3>7. Contact Us</h3>
                  <p>
                    For any questions regarding these terms, please contact:
                    <br />
                    <strong>Email:</strong> legal@mbalo.com
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

export default TermsOfService
