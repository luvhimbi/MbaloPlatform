import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Lesson, QuizQuestion } from '../../../types/curriculum';
import QuestionEditor from './QuestionEditor';

interface LessonEditorProps {
  lesson: Lesson;
  onChange: (updated: Lesson) => void;
  onDelete: () => void;
}

export default function LessonEditor({ lesson, onChange, onDelete }: LessonEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof Lesson, value: any) => {
    onChange({ ...lesson, [field]: value });
  };

  const handleQuestionChange = (index: number, updatedQuestion: QuizQuestion) => {
    const newQuestions = [...lesson.questions];
    newQuestions[index] = updatedQuestion;
    onChange({ ...lesson, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: 'New Question',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
    };
    onChange({ ...lesson, questions: [...lesson.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...lesson.questions];
    newQuestions.splice(index, 1);
    onChange({ ...lesson, questions: newQuestions });
  };

  return (
    <div className="cb-lesson-card">
      <div className="cb-lesson-header" onClick={() => setExpanded(!expanded)}>
        <div className="cb-lesson-title">
          <span className="cb-drag-handle">≡</span>
          Lesson: {lesson.title || 'Untitled'}
        </div>
        <div className="cb-lesson-actions">
          <span className="cb-meta">{lesson.questions?.length || 0} Qs</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="btn-icon text-red"
            title="Delete Lesson"
          >
            <Trash2 size={16} />
          </button>
          <ChevronDown size={18} className={`cb-expand-icon ${expanded ? 'open' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="cb-lesson-body">
          <div className="cb-form-row">
            <div className="cb-form-group flex-2">
              <label>Lesson Title</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="cb-input"
              />
            </div>
            <div className="cb-form-group flex-1">
              <label>Points Value</label>
              <input
                type="number"
                value={lesson.pointsValue || 10}
                onChange={(e) => handleChange('pointsValue', parseInt(e.target.value))}
                className="cb-input"
              />
            </div>
          </div>

          <div className="cb-questions-list">
            <h4>Questions</h4>
            {lesson.questions?.map((q, i) => (
              <QuestionEditor
                key={q.id || i}
                question={q}
                onChange={(updated) => handleQuestionChange(i, updated)}
                onDelete={() => removeQuestion(i)}
              />
            ))}
            <button onClick={addQuestion} className="cb-btn-add">
              <Plus size={16} /> Add Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
