import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import './LegalPages.css'

function PrivacyPolicy() {
  const { currentUser } = useAuth()
  return (
    <div className="legal-page">
      <Navbar />
      <main className="legal-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="legal-header">
                <h1>Privacy <span className="text-fun">Policy</span></h1>
                <p>How we protect our young math heroes' data</p>
              </div>

              {currentUser && (
                <div className="user-auth-badge mb-4 p-3 rounded-4" style={{ background: 'var(--mbalo-blue-light)', border: '2px solid var(--mbalo-blue)', color: 'var(--mbalo-blue-dark)', fontWeight: 800 }}>
                  🛡️ Hi {currentUser.displayName || 'Hero Learner'}! We're committed to keeping your specific progress and profile data safe.
                </div>
              )}

              <div className="legal-content-wrap">
                <div className="legal-content">
                  <span className="last-updated">Last Updated: May 1, 2026</span>
                  
                  <p>
                    At Mbalo, we are committed to protecting the privacy of our young learners and their parents. 
                    This Privacy Policy explains how we collect, use, and safeguard your personal information 
                    in accordance with international standards and local South African laws.
                  </p>

                  <h3>1. Information We Collect</h3>
                  <p>
                    We collect minimal information required to provide a personalized and effective learning experience:
                  </p>
                  <ul>
                    <li><strong>Parental Information:</strong> Name and email address to manage the account and send progress updates.</li>
                    <li><strong>Student Information:</strong> First name (or nickname) and grade level to tailor the curriculum.</li>
                    <li><strong>Learning Progress:</strong> Quiz scores, time spent on lessons, and milestones reached.</li>
                    <li><strong>Technical Data:</strong> Device type and app usage statistics to improve performance.</li>
                  </ul>

                  <h3>2. How We Use Your Information</h3>
                  <p>
                    We use the collected data strictly for educational and administrative purposes:
                  </p>
                  <ul>
                    <li>Generating detailed progress reports for parents.</li>
                    <li>Adapting the math curriculum to each child's individual learning pace.</li>
                    <li>Providing a safe, ad-free environment for children.</li>
                    <li>Improving our educational modules based on aggregated, non-identifiable usage patterns.</li>
                  </ul>

                  <h3>3. Data Security</h3>
                  <p>
                    Your data security is our top priority. We implement:
                  </p>
                  <ul>
                    <li>End-to-end encryption for all sensitive data transfers.</li>
                    <li>Secure storage on protected servers with restricted access.</li>
                    <li>Regular security audits to ensure your information remains safe.</li>
                  </ul>

                  <h3>4. Children's Privacy</h3>
                  <p>
                    Mbalo is designed with child safety at its core. We do not allow social features, 
                    external links, or third-party advertising. We never sell student or parent data 
                    to third parties for marketing purposes.
                  </p>

                  <h3>5. Your Rights</h3>
                  <p>
                    You have the right to access, update, or delete your data at any time through your 
                    account settings or by contacting our support team.
                  </p>

                  <h3>6. Contact Us</h3>
                  <p>
                    For any privacy-related inquiries, please contact Talifhani Luvhimbi's team at:
                    <br />
                    <strong>Email:</strong> privacy@mbalo.com
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

export default PrivacyPolicy
