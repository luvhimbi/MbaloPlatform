import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Module, Lesson } from '../../../types/curriculum';
import LessonEditor from './LessonEditor';

interface ModuleEditorProps {
  module: Module;
  onChange: (updated: Module) => void;
  onDelete: () => void;
}

export default function ModuleEditor({ module, onChange, onDelete }: ModuleEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof Module, value: any) => {
    onChange({ ...module, [field]: value });
  };

  const handleLessonChange = (index: number, updatedLesson: Lesson) => {
    const newLessons = [...module.lessons];
    newLessons[index] = updatedLesson;
    onChange({ ...module, lessons: newLessons });
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      title: 'New Lesson',
      type: 'quiz',
      questions: [],
      isCompleted: false,
      pointsValue: 10,
    };
    onChange({ ...module, lessons: [...module.lessons, newLesson] });
  };

  const removeLesson = (index: number) => {
    const newLessons = [...module.lessons];
    newLessons.splice(index, 1);
    onChange({ ...module, lessons: newLessons });
  };

  return (
    <div className="cb-module-card">
      <div className="cb-module-header" onClick={() => setExpanded(!expanded)}>
        <div className="cb-module-title">
          <span className="cb-drag-handle">≡</span>
          Module: {module.title || 'Untitled'}
        </div>
        <div className="cb-module-actions">
          <span className="cb-meta">{module.lessons?.length || 0} Lessons</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="btn-icon text-red"
            title="Delete Module"
          >
            <Trash2 size={16} />
          </button>
          <ChevronDown size={18} className={`cb-expand-icon ${expanded ? 'open' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="cb-module-body">
          <div className="cb-form-row">
            <div className="cb-form-group flex-2">
              <label>Module Title</label>
              <input
                type="text"
                value={module.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="cb-input"
              />
            </div>
            <div className="cb-form-group flex-1">
              <label>Difficulty</label>
              <select
                value={module.difficulty || 'Beginner'}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="cb-input cb-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="cb-form-group">
            <label>Description</label>
            <textarea
              value={module.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="cb-input"
              rows={2}
            />
          </div>

          <div className="cb-form-group">
            <label>Learning Goal</label>
            <input
              type="text"
              value={module.learningGoal || ''}
              onChange={(e) => handleChange('learningGoal', e.target.value)}
              className="cb-input"
            />
          </div>

          <div className="cb-lessons-list">
            <h4>Lessons</h4>
            {module.lessons?.map((l, i) => (
              <LessonEditor
                key={l.id || i}
                lesson={l}
                onChange={(updated) => handleLessonChange(i, updated)}
                onDelete={() => removeLesson(i)}
              />
            ))}
            <button onClick={addLesson} className="cb-btn-add">
              <Plus size={16} /> Add Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
