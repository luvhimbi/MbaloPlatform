import { useEffect, useState } from 'react';
import { adminService, type GradeContentStats } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import Swal from 'sweetalert2';
import {
  Upload,
  BookOpen,
  Layers,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import CurriculumBuilder from '../../components/admin/curriculum/CurriculumBuilder';
import './AdminCurriculum.css';

function AdminCurriculum() {
  const [stats, setStats] = useState<GradeContentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedGrade, setExpandedGrade] = useState<number | null>(null);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await adminService.getCurriculumStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load curriculum stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (grade: number) => {
    setIsUploading(true);
    try {
      await adminService.uploadCurriculumForGrade(grade);
      await loadStats();
      Swal.fire({
        title: 'Success!',
        text: `Curriculum data for Grade ${grade} uploaded successfully.`,
        icon: 'success',
        heightAuto: false,
        customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Upload Failed',
        text: 'Make sure you have admin permissions in Firestore.',
        icon: 'error',
        heightAuto: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    try {
      // The current curriculumService.uploadCurriculum actually uploads all grades from JSON.
      await adminService.uploadCurriculumForGrade(0); // 0 acts as a wildcard here since underlying service uploads all
      await loadStats();
      Swal.fire({
        title: 'Success!',
        text: 'All curriculum data seeded to database.',
        icon: 'success',
        heightAuto: false,
        customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Upload Failed',
        text: 'Make sure you have admin permissions in Firestore.',
        icon: 'error',
        heightAuto: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackToOverview = () => {
    setEditingGrade(null);
    loadStats(); // reload to reflect any saved changes
  };

  if (editingGrade !== null) {
    return (
      <AdminLayout>
        <CurriculumBuilder grade={editingGrade} onBack={handleBackToOverview} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div className="admin-header-row">
            <div>
              <h1>Curriculum Manager</h1>
              <p>Manage learning content and sync database</p>
            </div>
            <button
              className="btn-game btn-game-teal"
              onClick={handleUploadAll}
              disabled={isUploading}
            >
              <Upload size={18} />
              {isUploading ? 'Syncing...' : 'Sync All JSON to DB'}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <p>Loading curriculum...</p>
          </div>
        ) : (
          <div className="admin-curriculum-list">
            {stats.map((gradeStat) => (
              <div
                key={gradeStat.grade}
                className={`admin-grade-card card-game ${expandedGrade === gradeStat.grade ? 'expanded' : ''}`}
              >
                <div
                  className="admin-grade-header"
                  onClick={() => setExpandedGrade(expandedGrade === gradeStat.grade ? null : gradeStat.grade)}
                >
                  <div className="admin-grade-title-col">
                    <div className="admin-grade-badge">
                      <span>Grade</span>
                      <strong>{gradeStat.grade}</strong>
                    </div>
                    <div className="admin-grade-status">
                      {gradeStat.hasRealContent ? (
                        <span className="admin-status-text success">
                          <CheckCircle2 size={16} /> Content Available
                        </span>
                      ) : (
                        <span className="admin-status-text warning">
                          <AlertCircle size={16} /> Placeholder Only
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="admin-grade-stats-row">
                    <div className="admin-grade-stat-pill">
                      <BookOpen size={16} /> {gradeStat.chapters} Chapters
                    </div>
                    <div className="admin-grade-stat-pill hide-mobile">
                      <Layers size={16} /> {gradeStat.modules} Modules
                    </div>
                    <div className="admin-grade-stat-pill hide-mobile">
                      <FileQuestion size={16} /> {gradeStat.lessons} Lessons
                    </div>
                    <div className="admin-grade-expand-icon">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {expandedGrade === gradeStat.grade && (
                  <div className="admin-grade-body">
                    <div className="admin-grade-details">
                      <div className="admin-detail-grid">
                        <div className="admin-detail-box">
                          <span className="admin-detail-val">{gradeStat.chapters}</span>
                          <span className="admin-detail-lbl">Chapters</span>
                        </div>
                        <div className="admin-detail-box">
                          <span className="admin-detail-val">{gradeStat.modules}</span>
                          <span className="admin-detail-lbl">Modules</span>
                        </div>
                        <div className="admin-detail-box">
                          <span className="admin-detail-val">{gradeStat.lessons}</span>
                          <span className="admin-detail-lbl">Lessons</span>
                        </div>
                        <div className="admin-detail-box">
                          <span className="admin-detail-val">{gradeStat.questions}</span>
                          <span className="admin-detail-lbl">Questions</span>
                        </div>
                      </div>

                      <div className="admin-grade-actions">
                        <button
                          className="btn-game btn-game-teal"
                          onClick={() => setEditingGrade(gradeStat.grade)}
                        >
                          <Edit3 size={16} />
                          Edit Curriculum for Grade {gradeStat.grade}
                        </button>
                        <button
                          className="btn-game btn-game-outline"
                          onClick={() => handleUpload(gradeStat.grade)}
                          disabled={isUploading}
                        >
                          <Upload size={16} />
                          Re-sync from JSON
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCurriculum;
