import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { PlatformAnalytics } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Users,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
} from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <p>Failed to load analytics data.</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Learners',
      value: analytics.totalLearners,
      icon: Users,
      color: 'green',
    },
    {
      label: 'Avg Accuracy',
      value: `${analytics.averageAccuracy}%`,
      icon: Target,
      color: 'orange',
    },
    {
      label: 'Lessons Completed',
      value: analytics.totalLessonsCompleted,
      icon: BookOpen,
      color: 'blue',
    },
    {
      label: 'Total Points',
      value: analytics.totalPointsEarned.toLocaleString(),
      icon: Award,
      color: 'yellow',
    },
    {
      label: 'New Today',
      value: analytics.activeLearnersToday,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Admin Accounts',
      value: analytics.totalAdmins,
      icon: Clock,
      color: 'blue',
    },
  ];

  // Grade distribution for chart
  const maxGradeCount = Math.max(...Object.values(analytics.gradeDistribution), 1);

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and analytics</p>
        </header>

        {/* ─── Stat Cards ─── */}
        <div className="admin-stats-grid">
          {statCards.map((card, i) => (
            <div key={i} className={`admin-stat-card card-game`}>
              <div className={`admin-stat-icon icon-circle icon-circle-${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="admin-stat-info">
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Grade Distribution ─── */}
        <div className="admin-section-row">
          <div className="admin-panel card-game">
            <h3>Learners by Grade</h3>
            <div className="admin-grade-chart">
              {[1, 2, 3, 4, 5, 6, 7].map((grade) => {
                const count = analytics.gradeDistribution[grade] || 0;
                const pct = maxGradeCount > 0 ? (count / maxGradeCount) * 100 : 0;
                return (
                  <div key={grade} className="admin-grade-bar-row">
                    <span className="admin-grade-label">Grade {grade}</span>
                    <div className="admin-grade-bar-track">
                      <div
                        className="admin-grade-bar-fill"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="admin-grade-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Recent Signups ─── */}
          <div className="admin-panel card-game">
            <h3>Recent Signups</h3>
            <div className="admin-recent-list">
              {analytics.recentUsers.length === 0 ? (
                <p className="admin-empty">No users yet.</p>
              ) : (
                analytics.recentUsers.map((user, i) => (
                  <div key={i} className="admin-recent-item">
                    <div className="admin-recent-avatar">
                      {(user.displayName || 'U')[0].toUpperCase()}
                    </div>
                    <div className="admin-recent-info">
                      <div className="admin-recent-name">{user.displayName}</div>
                      <div className="admin-recent-meta">
                        Grade {user.grade || '?'} · {user.email}
                      </div>
                    </div>
                    <div className="admin-recent-date">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
