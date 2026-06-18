import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Chapter, Module } from '../../../types/curriculum';
import ModuleEditor from './ModuleEditor';

interface ChapterEditorProps {
  chapter: Chapter;
  onChange: (updated: Chapter) => void;
  onDelete: () => void;
}

export default function ChapterEditor({ chapter, onChange, onDelete }: ChapterEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof Chapter, value: any) => {
    onChange({ ...chapter, [field]: value });
  };

  const handleModuleChange = (index: number, updatedModule: Module) => {
    const newModules = [...chapter.modules];
    newModules[index] = updatedModule;
    onChange({ ...chapter, modules: newModules });
  };

  const addModule = () => {
    const newModule: Module = {
      id: crypto.randomUUID(),
      title: 'New Module',
      description: '',
      learningGoal: '',
      difficulty: 'Beginner',
      unit: chapter.modules.length + 1,
      lessons: [],
      status: 'available',
    };
    onChange({ ...chapter, modules: [...chapter.modules, newModule] });
  };

  const removeModule = (index: number) => {
    const newModules = [...chapter.modules];
    newModules.splice(index, 1);
    onChange({ ...chapter, modules: newModules });
  };

  return (
    <div className="cb-chapter-card">
      <div className="cb-chapter-header" onClick={() => setExpanded(!expanded)}>
        <div className="cb-chapter-title">
          <span className="cb-drag-handle">≡</span>
          Chapter: {chapter.title || 'Untitled'}
        </div>
        <div className="cb-chapter-actions">
          <span className="cb-meta">{chapter.modules?.length || 0} Modules</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="btn-icon text-red"
            title="Delete Chapter"
          >
            <Trash2 size={16} />
          </button>
          <ChevronDown size={20} className={`cb-expand-icon ${expanded ? 'open' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="cb-chapter-body">
          <div className="cb-form-group">
            <label>Chapter Title</label>
            <input
              type="text"
              value={chapter.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="cb-input cb-title-input"
            />
          </div>

          <div className="cb-modules-list">
            <h4>Modules</h4>
            {chapter.modules?.map((m, i) => (
              <ModuleEditor
                key={m.id || i}
                module={m}
                onChange={(updated) => handleModuleChange(i, updated)}
                onDelete={() => removeModule(i)}
              />
            ))}
            <button onClick={addModule} className="cb-btn-add">
              <Plus size={16} /> Add Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
