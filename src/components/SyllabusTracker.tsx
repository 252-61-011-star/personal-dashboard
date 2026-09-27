import React, { useState } from 'react';
import type { Course, SyllabusTopic } from '../types';
import { 
  GraduationCap, 
  CheckCircle, 
  Circle, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronRight, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyllabusTrackerProps {
  courses: Course[];
  onToggleTopic: (courseId: string, moduleId: string, topicId: string) => void;
  onOpenTopicNotes: (topic: SyllabusTopic, courseCode: string, courseName: string) => void;
  onAddTopic: (courseId: string, moduleId: string, title: string, importance: SyllabusTopic['importance']) => void;
  onDeleteTopic: (courseId: string, moduleId: string, topicId: string) => void;
  onAddModule: (courseId: string, title: string) => void;
  onDeleteModule: (courseId: string, moduleId: string) => void;
  onOpenCourseModal: (course?: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  courses,
  onToggleTopic,
  onOpenTopicNotes,
  onAddTopic,
  onDeleteTopic,
  onAddModule,
  onDeleteModule,
  onOpenCourseModal,
  onDeleteCourse,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [collapsedModules, setCollapsedModules] = useState<{ [modId: string]: boolean }>({});
  
  // State for new module
  const [showNewModuleInput, setShowNewModuleInput] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // State for new topic per module
  const [activeNewTopicModId, setActiveNewTopicModId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicImportance, setNewTopicImportance] = useState<SyllabusTopic['importance']>('core');

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  if (!currentCourse) {
    return (
      <div className="p-12 text-center bg-slate-900/80 rounded-2xl border border-slate-800">
        <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-white font-semibold">No courses found</p>
        <button
          onClick={() => onOpenCourseModal()}
          className="mt-4 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
        >
          Add First Course
        </button>
      </div>
    );
  }

  // Course calculations
  const totalTopics = currentCourse.modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedTopics = currentCourse.modules.reduce(
    (acc, m) => acc + m.topics.filter((t) => t.completed).length,
    0
  );
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleModuleCollapse = (modId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleTopicCheck = (courseId: string, moduleId: string, topicId: string, currentCompleted: boolean) => {
    onToggleTopic(courseId, moduleId, topicId);
    if (!currentCompleted) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    onAddModule(currentCourse.id, newModuleTitle.trim());
    setNewModuleTitle('');
    setShowNewModuleInput(false);
  };

  const handleCreateTopic = (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    onAddTopic(currentCourse.id, moduleId, newTopicTitle.trim(), newTopicImportance);
    setNewTopicTitle('');
    setActiveNewTopicModId(null);
  };

  return (
    <div className="space-y-6">
      {/* Course Selection Horizontal Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center space-x-2.5">
          {courses.map((c) => {
            const isSelected = c.id === currentCourse.id;
            const cTotal = c.modules.reduce((acc, m) => acc + m.topics.length, 0);
            const cDone = c.modules.reduce((acc, m) => acc + m.topics.filter((t) => t.completed).length, 0);
            const cPercent = cTotal > 0 ? Math.round((cDone / cTotal) * 100) : 0;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition text-left whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 border-slate-700 shadow-lg shadow-black/40 ring-1'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  borderColor: isSelected ? c.color : undefined,
                  boxShadow: isSelected ? `0 0 16px -4px ${c.color}30` : undefined,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold font-mono text-white">{c.code}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {cPercent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{c.name}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onOpenCourseModal()}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-xs font-semibold whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Main Course Details Card */}
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800 p-6 sm:p-7 shadow-xl">
        {/* Course Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start space-x-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                backgroundColor: `${currentCourse.color}20`,
                borderColor: `${currentCourse.color}50`,
                borderWidth: '1px',
                color: currentCourse.color,
              }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <span
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: `${currentCourse.color}15`,
                    borderColor: `${currentCourse.color}40`,
                    color: currentCourse.color,
                  }}
                >
                  {currentCourse.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentCourse.credits} Credits
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Target: {currentCourse.targetGrade}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {currentCourse.name}
              </h2>
              {currentCourse.instructor && (
                <p className="text-xs text-slate-400 mt-0.5">{currentCourse.instructor}</p>
              )}
            </div>
          </div>

          {/* Right Progress Gauge & Course Actions */}
          <div className="flex items-center space-x-4 self-start md:self-auto">
            <div className="text-right">
              <div className="flex items-baseline justify-end space-x-1">
                <span className="text-2xl font-mono font-bold text-white">{progressPercent}%</span>
                <span className="text-xs text-slate-400">mastered</span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {completedTopics} of {totalTopics} topics complete
              </p>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onOpenCourseModal(currentCourse)}
                title="Edit Course"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete course "${currentCourse.name}"?`)) {
                    onDeleteCourse(currentCourse.id);
                  }
                }}
                title="Delete Course"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="my-5">
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: currentCourse.color,
                boxShadow: `0 0 12px ${currentCourse.color}80`,
              }}
            />
          </div>
        </div>

        {/* Modules & Topics Hierarchy */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-mono">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Syllabus Breakdown ({currentCourse.modules.length} Modules)</span>
            </h3>

            <button
              onClick={() => setShowNewModuleInput(true)}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          {showNewModuleInput && (
            <form onSubmit={handleCreateModule} className="p-3.5 rounded-xl bg-slate-950 border border-slate-700 flex items-center space-x-2">
              <input
                required
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Module Title (e.g. Module 5: Strategic Digital Campaigns)"
                className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowNewModuleInput(false)}
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Module List */}
          <div className="space-y-3.5">
            {currentCourse.modules.map((mod) => {
              const isCollapsed = Boolean(collapsedModules[mod.id]);
              const modTotal = mod.topics.length;
              const modDone = mod.topics.filter((t) => t.completed).length;
              const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

              return (
                <div
                  key={mod.id}
                  className="rounded-xl bg-slate-950/70 border border-slate-800/90 overflow-hidden transition"
                >
                  {/* Module Header Bar */}
                  <div className="p-3.5 sm:p-4 bg-slate-900/60 flex items-center justify-between gap-3 border-b border-slate-800/70">
                    <button
                      onClick={() => toggleModuleCollapse(mod.id)}
                      className="flex items-center space-x-2.5 text-left flex-1"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-400" />
                      )}
                      <div>
                        <span className="text-sm font-semibold text-white">
                          {mod.title}
                        </span>
                      </div>
                    </button>

                    {/* Module Progress & Actions */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {modDone}/{modTotal}
                        </span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${modPercent}%`,
                              backgroundColor: currentCourse.color,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete module "${mod.title}" and its topics?`)) {
                            onDeleteModule(currentCourse.id, mod.id);
                          }
                        }}
                        className="text-slate-600 hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Topic Checklist Items */}
                  {!isCollapsed && (
                    <div className="p-3 sm:p-4 space-y-2 divide-y divide-slate-800/50">
                      {mod.topics.map((topic) => {
                        const hasNotes = Boolean(topic.notes || (topic.keyFormulas && topic.keyFormulas.length > 0));

                        return (
                          <div
                            key={topic.id}
                            className={`pt-2 first:pt-0 flex items-start justify-between gap-3 group transition rounded-lg p-2 hover:bg-slate-900/50 ${
                              topic.completed ? 'opacity-65' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <button
                                onClick={() =>
                                  handleTopicCheck(
                                    currentCourse.id,
                                    mod.id,
                                    topic.id,
                                    topic.completed
                                  )
                                }
                                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition flex-shrink-0"
                              >
                                {topic.completed ? (
                                  <CheckCircle className="w-5 h-5 text-accent-emerald fill-emerald-500/10" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-500 hover:text-brand-400" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`text-sm font-medium ${
                                      topic.completed ? 'line-through text-slate-400' : 'text-slate-200'
                                    }`}
                                  >
                                    {topic.title}
                                  </span>

                                  {topic.importance === 'core' && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/15 text-brand-400 border border-brand-500/30">
                                      Core
                                    </span>
                                  )}
                                </div>

                                {topic.notes && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic font-sans">
                                    {topic.notes}
                                  </p>
                                )}

                                {topic.keyFormulas && topic.keyFormulas.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {topic.keyFormulas.map((f, i) => (
                                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-accent-cyan border border-slate-800">
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action icons */}
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() =>
                                  onOpenTopicNotes(
                                    topic,
                                    currentCourse.code,
                                    currentCourse.name
                                  )
                                }
                                title={hasNotes ? 'View/Edit Notes & Formulas' : 'Add Notes'}
                                className={`p-1.5 rounded-lg border text-xs transition flex items-center space-x-1 ${
                                  hasNotes
                                    ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span className="text-[10px] hidden sm:inline">{hasNotes ? 'Notes' : '+Note'}</span>
                              </button>

                              <button
                                onClick={() => onDeleteTopic(currentCourse.id, mod.id, topic.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 p-1 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Topic Inline per Module */}
                      {activeNewTopicModId === mod.id ? (
                        <form
                          onSubmit={(e) => handleCreateTopic(e, mod.id)}
                          className="pt-3 flex items-center space-x-2"
                        >
                          <input
                            required
                            type="text"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            placeholder="New topic title (e.g. Price Elasticity of Demand)..."
                            className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                          />
                          <select
                            value={newTopicImportance}
                            onChange={(e) => setNewTopicImportance(e.target.value as any)}
                            className="rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
                          >
                            <option value="core">Core</option>
                            <option value="important">Important</option>
                            <option value="supplementary">Supplementary</option>
                          </select>
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveNewTopicModId(null)}
                            className="text-xs text-slate-500 hover:text-slate-300 px-1"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setActiveNewTopicModId(mod.id)}
                          className="pt-2 text-xs text-slate-500 hover:text-brand-400 font-medium flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add topic to this module</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
