import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Play, 
  Lock,
  ChevronRight,
  ChevronLeft,
  Book,
  Star,
  Plus,
  Minus,
  Hash,
  Egg
} from 'lucide-react';
import type { Module } from '../types/curriculum';
import mascot from '../assets/mascot.webp';
import './CourseMap.css';

interface CourseMapProps {
  chapterNumber: number;
  chapterTitle: string;
  modules: Module[];
  onStartLesson: (lessonId: string) => void;
  totalChapters?: number;
  currentIndex?: number;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  completedLessonIds?: string[];
  prevChapterTitle?: string;
  nextChapterTitle?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  book: Book,
  star: Star,
  plus: Plus,
  minus: Minus,
  hash: Hash,
  egg: Egg,
};

const CourseMap: React.FC<CourseMapProps> = ({ 
  chapterNumber, 
  chapterTitle, 
  modules, 
  onStartLesson,
  totalChapters = 1,
  currentIndex = 0,
  onNextChapter,
  onPrevChapter,
  completedLessonIds = [],
  prevChapterTitle,
  nextChapterTitle
}) => {
  if (!modules.length) return null;

  // Find the first module with uncompleted lessons
  const activeModuleIndex = modules.findIndex(m => m.lessons.some(l => !completedLessonIds.includes(l.id)));
  const theActiveModuleIndex = activeModuleIndex === -1 ? modules.length : activeModuleIndex;

  // Calculate total progress for the chapter
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = modules.reduce((acc, m) => 
    acc + (m.lessons?.filter(l => completedLessonIds.includes(l.id)).length || 0), 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="course-map">
      <header className="chapter-header">
        <div className="chapter-header-left">
          <div className="chapter-icon-box">
            <Book size={24} strokeWidth={2.5} />
          </div>
          <div className="chapter-info">
            <span className="chapter-label">CHAPTER {chapterNumber}</span>
            <h2 className="chapter-title">{chapterTitle.toUpperCase()}</h2>
          </div>
        </div>
        <div className="chapter-progress">
          <svg className="progress-ring" width="60" height="60">
            <circle className="progress-ring__bg" cx="30" cy="30" r="24" />
            <circle 
              className="progress-ring__fill" 
              cx="30" cy="30" r="24" 
              style={{ strokeDasharray: `${2 * Math.PI * 24}`, strokeDashoffset: `${2 * Math.PI * 24 * (1 - progressPercent / 100)}` }}
            />
          </svg>
          <span className="progress-text">{progressPercent}%</span>
        </div>
      </header>

      {/* All modules and lessons in one continuous trail */}
      <div className="lessons-list">
        {modules.map((module, moduleIndex) => {
          const isModuleLocked = moduleIndex > theActiveModuleIndex;

          return (module.lessons || []).map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isNextToPlay = moduleIndex === theActiveModuleIndex && !isCompleted && 
                              (idx === 0 || completedLessonIds.includes(module.lessons[idx - 1].id));
            const isLocked = isModuleLocked || (!isCompleted && !isNextToPlay);

            // Check if this is the very last lesson of the very last module
            const isVeryLast = moduleIndex === modules.length - 1 && idx === (module.lessons?.length || 0) - 1;

            return (
              <React.Fragment key={lesson.id}>
                {/* Show module title before the first lesson of each module */}
                {idx === 0 && (
                  <div className="module-divider">
                    <div className="node-column">
                      <div className="vertical-connector" style={{ height: '16px' }} />
                      <div className="module-divider-dot" />
                      <div className="vertical-connector" style={{ height: '16px' }} />
                    </div>
                    <div className="module-divider-info">
                      <span className="module-divider-label">MODULE {module.unit || moduleIndex + 1}</span>
                      <span className="module-divider-title">{module.title}</span>
                    </div>
                  </div>
                )}

                <div className={`lesson-row ${isLocked ? 'is-locked' : ''}`}>
                  <div className="node-column">
                    <div className={`status-node ${isCompleted ? 'is-completed' : isNextToPlay ? 'is-active' : 'is-locked'}`}>
                      {isCompleted ? (
                        <Check size={20} strokeWidth={3} />
                      ) : isNextToPlay ? (
                        <img src={mascot} alt="Safari Dog Guide" className="node-mascot" />
                      ) : (
                        <Lock size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    {!isVeryLast && <div className="vertical-connector" />}
                  </div>

                  <button
                    className={`lesson-card ${isNextToPlay ? 'is-active' : ''}`}
                    onClick={() => !isLocked && onStartLesson(lesson.id)}
                    disabled={isLocked}
                  >
                    <div className="lesson-card-content">
                      <h4 className="lesson-card-title">{lesson.title.toUpperCase()}</h4>
                      <span className="lesson-card-status">
                        {isCompleted ? 'REVIEW' : isNextToPlay ? 'START MISSION' : 'LOCKED'}
                      </span>
                    </div>
                    {!isLocked && <ChevronRight size={20} className="card-arrow" />}
                  </button>
                </div>
              </React.Fragment>
            );
          });
        })}
      </div>

      {/* Chapter Navigation */}
      {totalChapters > 1 && (
        <div className="chapter-navigation">
          <button 
            className="chapter-nav-btn" 
            onClick={onPrevChapter}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
            <div className="nav-btn-content">
              <span className="nav-label">PREV</span>
              {prevChapterTitle && <span className="nav-title">{prevChapterTitle}</span>}
            </div>
          </button>

          <button 
            className="chapter-nav-btn" 
            onClick={onNextChapter}
            disabled={currentIndex === totalChapters - 1}
          >
            <div className="nav-btn-content align-right">
              <span className="nav-label">NEXT</span>
              {nextChapterTitle && <span className="nav-title">{nextChapterTitle}</span>}
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseMap;
