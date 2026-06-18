import AdminSidebar from './AdminSidebar';
import '../../pages/Dashboard.css';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content-wrapper">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
