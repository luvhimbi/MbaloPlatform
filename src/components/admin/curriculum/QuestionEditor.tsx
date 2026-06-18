import { Trash2, Plus, X } from 'lucide-react';
import type { QuizQuestion } from '../../../types/curriculum';

interface QuestionEditorProps {
  question: QuizQuestion;
  onChange: (updated: QuizQuestion) => void;
  onDelete: () => void;
}

const QUESTION_TYPES = [
  'multiple-choice',
  'true-false',
  'emoji-count',
  'sequence',
  'drag-match',
  'long-division',
  'number-line',
  'pattern-grid',
  'sum-composition',
] as const;

export default function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  const handleChange = (field: keyof QuizQuestion, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    onChange({ ...question, options: [...(question.options || []), ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    onChange({ ...question, options: newOptions });
  };

  // Drag Match Handlers
  const handleMatchPairChange = (index: number, side: 'left' | 'right', value: string) => {
    const newPairs = [...(question.matchPairs || [])];
    newPairs[index] = { ...newPairs[index], [side]: value };
    onChange({ ...question, matchPairs: newPairs });
  };

  const addMatchPair = () => {
    onChange({ ...question, matchPairs: [...(question.matchPairs || []), { left: '', right: '' }] });
  };

  const removeMatchPair = (index: number) => {
    const newPairs = [...(question.matchPairs || [])];
    newPairs.splice(index, 1);
    onChange({ ...question, matchPairs: newPairs });
  };

  return (
    <div className="cb-question-editor">
      <div className="cb-question-header">
        <select
          value={question.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="cb-input cb-select"
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace('-', ' ')}
            </option>
          ))}
        </select>
        <button onClick={onDelete} className="btn-icon text-red" title="Delete Question">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="cb-form-group">
        <label>Question Text</label>
        <input
          type="text"
          value={question.question || ''}
          onChange={(e) => handleChange('question', e.target.value)}
          className="cb-input"
          placeholder="Enter question text..."
        />
      </div>

      {/* Options array (common for multiple choice, etc) */}
      {(question.type === 'multiple-choice' || question.type === 'true-false') && (
        <div className="cb-form-group">
          <label>Options</label>
          <div className="cb-options-list">
            {question.options?.map((opt, i) => (
              <div key={i} className="cb-option-row">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  className="cb-input"
                  placeholder={`Option ${i + 1}`}
                />
                <button onClick={() => removeOption(i)} className="btn-icon text-red">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addOption} className="cb-btn-small">
            <Plus size={14} /> Add Option
          </button>
        </div>
      )}

      {/* Correct Answer */}
      <div className="cb-form-group">
        <label>Correct Answer</label>
        <input
          type="text"
          value={question.correctAnswer || ''}
          onChange={(e) => handleChange('correctAnswer', e.target.value)}
          className="cb-input"
          placeholder="Exact match required"
        />
      </div>

      {/* Dynamic Fields based on Type */}

      {question.type === 'emoji-count' && (
        <div className="cb-dynamic-fields">
          <div className="cb-form-group">
            <label>Emoji (e.g., 🍎)</label>
            <input
              type="text"
              value={question.emoji || ''}
              onChange={(e) => handleChange('emoji', e.target.value)}
              className="cb-input"
            />
          </div>
          <div className="cb-form-group">
            <label>Emoji Count</label>
            <input
              type="number"
              value={question.emojiCount || 0}
              onChange={(e) => handleChange('emojiCount', parseInt(e.target.value))}
              className="cb-input"
            />
          </div>
        </div>
      )}

      {question.type === 'long-division' && (
        <div className="cb-dynamic-fields">
          <div className="cb-form-group">
            <label>Dividend (inside)</label>
            <input
              type="number"
              value={question.dividend || 0}
              onChange={(e) => handleChange('dividend', parseInt(e.target.value))}
              className="cb-input"
            />
          </div>
          <div className="cb-form-group">
            <label>Divisor (outside)</label>
            <input
              type="number"
              value={question.divisor || 0}
              onChange={(e) => handleChange('divisor', parseInt(e.target.value))}
              className="cb-input"
            />
          </div>
        </div>
      )}

      {question.type === 'drag-match' && (
        <div className="cb-form-group">
          <label>Match Pairs</label>
          <div className="cb-options-list">
            {question.matchPairs?.map((pair, i) => (
              <div key={i} className="cb-option-row">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) => handleMatchPairChange(i, 'left', e.target.value)}
                  className="cb-input"
                  placeholder="Left side"
                />
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => handleMatchPairChange(i, 'right', e.target.value)}
                  className="cb-input"
                  placeholder="Right side"
                />
                <button onClick={() => removeMatchPair(i)} className="btn-icon text-red">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addMatchPair} className="cb-btn-small">
            <Plus size={14} /> Add Pair
          </button>
        </div>
      )}

      {question.type === 'number-line' && (
        <div className="cb-dynamic-fields">
          <div className="cb-form-group">
            <label>Min</label>
            <input
              type="number"
              value={question.numberLineConfig?.min || 0}
              onChange={(e) => handleChange('numberLineConfig', { ...question.numberLineConfig, min: parseInt(e.target.value) })}
              className="cb-input"
            />
          </div>
          <div className="cb-form-group">
            <label>Max</label>
            <input
              type="number"
              value={question.numberLineConfig?.max || 10}
              onChange={(e) => handleChange('numberLineConfig', { ...question.numberLineConfig, max: parseInt(e.target.value) })}
              className="cb-input"
            />
          </div>
          <div className="cb-form-group">
            <label>Step</label>
            <input
              type="number"
              value={question.numberLineConfig?.step || 1}
              onChange={(e) => handleChange('numberLineConfig', { ...question.numberLineConfig, step: parseInt(e.target.value) })}
              className="cb-input"
            />
          </div>
        </div>
      )}

      {/* Explanation & Hint */}
      <div className="cb-form-group">
        <label>Hint (optional)</label>
        <input
          type="text"
          value={question.hint || ''}
          onChange={(e) => handleChange('hint', e.target.value)}
          className="cb-input"
          placeholder="E.g., Try counting them grouped by 2s."
        />
      </div>
      <div className="cb-form-group">
        <label>Explanation (optional)</label>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
          className="cb-input"
          rows={2}
          placeholder="Shown after answering correctly..."
        />
      </div>
    </div>
  );
}
