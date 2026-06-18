import AdminLayout from '../../components/admin/AdminLayout';
import { Settings as SettingsIcon, Database, Shield, AlertTriangle } from 'lucide-react';
import './AdminSettings.css';

function AdminSettings() {
  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1>Platform Settings</h1>
          <p>Global configuration and admin tools</p>
        </header>

        <div className="admin-settings-grid">
          
          <div className="admin-panel card-game">
            <div className="admin-settings-header">
              <Database className="admin-settings-icon text-blue" />
              <h3>Database Config</h3>
            </div>
            <p className="admin-settings-desc">
              Mbalo currently uses Firebase Firestore for all user and curriculum data. 
              To manage raw data, indexes, or rules, use the Firebase Console.
            </p>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-game btn-game-outline"
            >
              Open Firebase Console
            </a>
          </div>

          <div className="admin-panel card-game">
            <div className="admin-settings-header">
              <Shield className="admin-settings-icon text-green" />
              <h3>Security & Roles</h3>
            </div>
            <p className="admin-settings-desc">
              Only users with the <code>role: 'admin'</code> field on their Firestore profile 
              can access this panel. Ensure your <code>firestore.rules</code> restrict write 
              access to the curriculum collection to admins only.
            </p>
            <div className="safe-note">
              Admin roles can be assigned from the Users tab.
            </div>
          </div>

          <div className="admin-panel card-game admin-danger-zone">
            <div className="admin-settings-header">
              <AlertTriangle className="admin-settings-icon text-red" />
              <h3 className="text-red">Danger Zone</h3>
            </div>
            <p className="admin-settings-desc">
              Features like bulk-deleting inactive users or wiping platform stats 
              are not currently enabled in the UI to prevent accidental data loss.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
