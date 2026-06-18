import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../../services/authService';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import './AdminSidebar.css';

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Log Out?',
      text: 'Are you sure you want to sign out of the admin panel?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
    });

    if (result.isConfirmed) {
      try {
        await authService.logout();
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Curriculum', path: '/admin/curriculum' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <Shield size={28} />
          </div>
          <div>
            <div className="admin-sidebar-title">Mbalo</div>
            <div className="admin-sidebar-subtitle">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div
            className="admin-sidebar-link back-link"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={20} />
            <span>Learner View</span>
          </div>
          <div className="admin-sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="admin-mobile-nav">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`admin-mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </>
  );
}

export default AdminSidebar;
