import { useState, useEffect } from 'react';
import { Save, Plus, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { curriculumService } from '../../../services/curriculumService';
import type { GradeCurriculum, Chapter } from '../../../types/curriculum';
import ChapterEditor from './ChapterEditor';
import './CurriculumBuilder.css';

interface CurriculumBuilderProps {
  grade: number;
  onBack: () => void;
}

export default function CurriculumBuilder({ grade, onBack }: CurriculumBuilderProps) {
  const [curriculum, setCurriculum] = useState<GradeCurriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await curriculumService.getCurriculumByGrade(grade);
        if (data) {
          setCurriculum(data);
        } else {
          // Initialize empty if doesn't exist
          setCurriculum({
            grade,
            chapters: [],
          });
        }
      } catch (error) {
        console.error('Failed to load curriculum', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [grade]);

  const handleSave = async () => {
    if (!curriculum) return;
    setSaving(true);
    try {
      await curriculumService.saveCurriculumByGrade(grade, curriculum);
      Swal.fire({
        title: 'Saved!',
        text: `Curriculum for Grade ${grade} has been updated.`,
        icon: 'success',
        heightAuto: false,
        customClass: { popup: 'mbalo-swal-popup', title: 'mbalo-swal-title' },
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Save Failed',
        text: 'Failed to save to Firestore. Check console for details.',
        icon: 'error',
        heightAuto: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChapterChange = (index: number, updatedChapter: Chapter) => {
    if (!curriculum) return;
    const newChapters = [...curriculum.chapters];
    newChapters[index] = updatedChapter;
    setCurriculum({ ...curriculum, chapters: newChapters });
  };

  const addChapter = () => {
    if (!curriculum) return;
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      modules: [],
    };
    setCurriculum({ ...curriculum, chapters: [...curriculum.chapters, newChapter] });
  };

  const removeChapter = (index: number) => {
    if (!curriculum) return;
    const newChapters = [...curriculum.chapters];
    newChapters.splice(index, 1);
    setCurriculum({ ...curriculum, chapters: newChapters });
  };

  if (loading) {
    return (
      <div className="cb-container">
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Loading Builder for Grade {grade}...</p>
        </div>
      </div>
    );
  }

  if (!curriculum) return null;

  return (
    <div className="cb-container">
      <div className="cb-toolbar">
        <button onClick={onBack} className="cb-btn-outline">
          <ArrowLeft size={16} /> Back to Overview
        </button>
        <div className="cb-grade-badge">Grade {grade} Builder</div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-game btn-game-teal"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Curriculum'}
        </button>
      </div>

      <div className="cb-main-editor card-game">
        <div className="cb-chapters-list">
          {curriculum.chapters.map((chapter, i) => (
            <ChapterEditor
              key={chapter.id || i}
              chapter={chapter}
              onChange={(updated) => handleChapterChange(i, updated)}
              onDelete={() => removeChapter(i)}
            />
          ))}
          <button onClick={addChapter} className="cb-btn-add-large">
            <Plus size={20} /> Add New Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
