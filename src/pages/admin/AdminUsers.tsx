import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../types/user';
import AdminLayout from '../../components/admin/AdminLayout';
import Swal from 'sweetalert2';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Star,
  BookOpen,
  Target,
  Clock,
} from 'lucide-react';
import './AdminUsers.css';

function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [sortField, setSortField] = useState<'name' | 'grade' | 'lessons' | 'accuracy' | 'joined'>('joined');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePromote = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'learner' : 'admin';
    const action = newRole === 'admin' ? 'promote' : 'demote';

    const result = await Swal.fire({
      title: `${action === 'promote' ? 'Promote' : 'Demote'} User?`,
      text: `${action === 'promote' ? 'Grant' : 'Remove'} admin access for ${user.displayName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title',
      },
    });

    if (result.isConfirmed) {
      try {
        await authService.setUserRole(user.uid, newRole);
        await loadUsers();
        Swal.fire({
          title: 'Done!',
          text: `${user.displayName} is now a ${newRole}.`,
          icon: 'success',
          heightAuto: false,
          customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update role.',
          icon: 'error',
          heightAuto: false,
        });
      }
    }
  };

  const handleDelete = async (user: UserProfile) => {
    if (user.uid === currentUser?.uid) {
      Swal.fire({
        title: 'Not Allowed',
        text: "You can't delete your own account from here.",
        icon: 'error',
        heightAuto: false,
        customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete User?',
      text: `This will permanently remove ${user.displayName}'s profile data. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      heightAuto: false,
      customClass: {
        popup: 'mbalo-swal-popup',
        title: 'mbalo-swal-title',
      },
    });

    if (result.isConfirmed) {
      try {
        await authService.deleteUserProfile(user.uid);
        await loadUsers();
        Swal.fire({
          title: 'Deleted',
          text: 'User profile removed.',
          icon: 'success',
          heightAuto: false,
          customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete user.',
          icon: 'error',
          heightAuto: false,
        });
      }
    }
  };

  // Filter & sort
  let filtered = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === null || u.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'name':
        cmp = (a.displayName || '').localeCompare(b.displayName || '');
        break;
      case 'grade':
        cmp = (a.grade || 0) - (b.grade || 0);
        break;
      case 'lessons':
        cmp = (a.stats?.lessonsCompleted || 0) - (b.stats?.lessonsCompleted || 0);
        break;
      case 'accuracy':
        cmp = (a.stats?.accuracy || 0) - (b.stats?.accuracy || 0);
        break;
      case 'joined':
        cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        break;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <h1>User Management</h1>
          <p>{users.length} registered users</p>
        </header>

        {/* ─── Toolbar ─── */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="admin-user-search"
            />
          </div>
          <div className="admin-filter-group">
            <select
              value={gradeFilter ?? ''}
              onChange={(e) => setGradeFilter(e.target.value ? Number(e.target.value) : null)}
              className="admin-filter-select"
              id="admin-grade-filter"
            >
              <option value="">All Grades</option>
              {[1, 2, 3, 4, 5, 6, 7].map((g) => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Table ─── */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="admin-table-wrap card-game">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Name <SortIcon field="name" />
                  </th>
                  <th className="hide-mobile">Email</th>
                  <th onClick={() => handleSort('grade')} className="sortable">
                    Grade <SortIcon field="grade" />
                  </th>
                  <th onClick={() => handleSort('lessons')} className="sortable hide-mobile">
                    Lessons <SortIcon field="lessons" />
                  </th>
                  <th onClick={() => handleSort('accuracy')} className="sortable hide-mobile">
                    Accuracy <SortIcon field="accuracy" />
                  </th>
                  <th className="hide-mobile">Role</th>
                  <th onClick={() => handleSort('joined')} className="sortable hide-mobile">
                    Joined <SortIcon field="joined" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-empty">No users match your filters.</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <>
                      <tr
                        key={user.uid}
                        className={`admin-user-row ${expandedUid === user.uid ? 'expanded' : ''}`}
                        onClick={() => setExpandedUid(expandedUid === user.uid ? null : user.uid)}
                      >
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-user-avatar">
                              {(user.displayName || 'U')[0].toUpperCase()}
                            </div>
                            <span className="admin-user-name">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="hide-mobile admin-user-email">{user.email}</td>
                        <td>
                          <span className="badge-game badge-blue">{user.grade || '?'}</span>
                        </td>
                        <td className="hide-mobile">{user.stats?.lessonsCompleted || 0}</td>
                        <td className="hide-mobile">{user.stats?.accuracy || 0}%</td>
                        <td className="hide-mobile">
                          <span className={`badge-game ${user.role === 'admin' ? 'badge-orange' : 'badge-green'}`}>
                            {user.role === 'admin' ? 'Admin' : 'Learner'}
                          </span>
                        </td>
                        <td className="hide-mobile">{new Date(user.joinedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="admin-action-btn promote"
                              onClick={() => handlePromote(user)}
                              title={user.role === 'admin' ? 'Demote to Learner' : 'Promote to Admin'}
                            >
                              {user.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                            </button>
                            <button
                              className="admin-action-btn delete"
                              onClick={() => handleDelete(user)}
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedUid === user.uid && (
                        <tr key={`${user.uid}-detail`} className="admin-detail-row">
                          <td colSpan={8}>
                            <div className="admin-user-detail">
                              <div className="admin-detail-stats">
                                <div className="admin-detail-stat">
                                  <BookOpen size={18} />
                                  <span>{user.stats?.lessonsCompleted || 0} lessons</span>
                                </div>
                                <div className="admin-detail-stat">
                                  <Target size={18} />
                                  <span>{user.stats?.accuracy || 0}% accuracy</span>
                                </div>
                                <div className="admin-detail-stat">
                                  <Star size={18} />
                                  <span>{user.stats?.totalPoints || 0} points</span>
                                </div>
                                <div className="admin-detail-stat">
                                  <Clock size={18} />
                                  <span>{user.stats?.timeSpent || 0} min spent</span>
                                </div>
                              </div>
                              {user.stats?.milestones && user.stats.milestones.length > 0 && (
                                <div className="admin-detail-milestones">
                                  <strong>Milestones:</strong>
                                  <div className="admin-milestone-tags">
                                    {user.stats.milestones.map((m, i) => (
                                      <span key={i} className="badge-game badge-yellow">{m}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {user.stats?.struggledQuestions && user.stats.struggledQuestions.length > 0 && (
                                <div className="admin-detail-struggles">
                                  <strong>Struggles:</strong> {user.stats.struggledQuestions.length} question(s)
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
