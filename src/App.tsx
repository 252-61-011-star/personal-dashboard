import { useState, useEffect } from 'react';
import type { 
  DashboardState, 
  TodoItem, 
  Habit, 
  Course, 
  Assignment, 
  ExamEvent, 
  Quote, 
  BookLog, 
  SyllabusTopic 
} from './types';
import { loadState, saveState, downloadBackupFile } from './services/storage';
import { Navbar } from './components/Navbar';
import { QuoteCard } from './components/QuoteCard';
import { DailyTodos } from './components/DailyTodos';
import { HabitTracker } from './components/HabitTracker';
import { SyllabusTracker } from './components/SyllabusTracker';
import { ExamCountdown } from './components/ExamCountdown';
import { GpaCalculator } from './components/GpaCalculator';
import { AssignmentTracker } from './components/AssignmentTracker';
import { ReadingLog } from './components/ReadingLog';
import { CloudSettingsModal } from './components/CloudSettingsModal';
import { CourseModal } from './components/CourseModal';
import { TopicNotesModal } from './components/TopicNotesModal';
import { 
  GraduationCap, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Target
} from 'lucide-react';

export function App() {
  const [state, setState] = useState<DashboardState>(() => loadState());
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals state
  const [showCloudSettings, setShowCloudSettings] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Topic Notes modal state
  const [activeTopicNote, setActiveTopicNote] = useState<{
    topic: SyllabusTopic;
    courseCode: string;
    courseName: string;
  } | null>(null);

  // Auto-persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Handler: Add Quote
  const handleAddQuote = (newQuoteData: Omit<Quote, 'id'>) => {
    const newQuote: Quote = {
      ...newQuoteData,
      id: `q-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      quotes: [newQuote, ...prev.quotes],
    }));
  };

  // Handler: Add Todo
  const handleAddTodo = (todoData: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const newTodo: TodoItem = {
      ...todoData,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      todos: [newTodo, ...prev.todos],
    }));
  };

  // Handler: Toggle Todo
  const handleToggleTodo = (id: string) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }),
    }));
  };

  // Handler: Delete Todo
  const handleDeleteTodo = (id: string) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
  };

  // Handler: Toggle Habit date
  const handleToggleHabitDate = (habitId: string, dateStr: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === habitId) {
          const history = { ...h.history };
          if (history[dateStr]) {
            delete history[dateStr];
          } else {
            history[dateStr] = true;
          }
          return { ...h, history };
        }
        return h;
      }),
    }));
  };

  // Handler: Add Habit
  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'history'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      history: {},
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  // Handler: Delete Habit
  const handleDeleteHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  };

  // Handler: Toggle Syllabus Topic
  const handleToggleTopic = (courseId: string, moduleId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map((m) => {
            if (m.id !== moduleId) return m;
            return {
              ...m,
              topics: m.topics.map((t) => {
                if (t.id !== topicId) return t;
                return { ...t, completed: !t.completed };
              }),
            };
          }),
        };
      }),
    }));
  };

  // Handler: Save Topic Notes
  const handleSaveTopicNotes = (topicId: string, notes: string, formulas: string[]) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => ({
        ...c,
        modules: c.modules.map((m) => ({
          ...m,
          topics: m.topics.map((t) => {
            if (t.id !== topicId) return t;
            return { ...t, notes, keyFormulas: formulas };
          }),
        })),
      })),
    }));
  };

  // Handler: Add Topic to Module
  const handleAddTopic = (
    courseId: string,
    moduleId: string,
    title: string,
    importance: SyllabusTopic['importance']
  ) => {
    const newTopic: SyllabusTopic = {
      id: `top-${Date.now()}`,
      title,
      completed: false,
      importance,
    };
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map((m) => {
            if (m.id !== moduleId) return m;
            return { ...m, topics: [...m.topics, newTopic] };
          }),
        };
      }),
    }));
  };

  // Handler: Delete Topic
  const handleDeleteTopic = (courseId: string, moduleId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map((m) => {
            if (m.id !== moduleId) return m;
            return { ...m, topics: m.topics.filter((t) => t.id !== topicId) };
          }),
        };
      }),
    }));
  };

  // Handler: Add Module
  const handleAddModule = (courseId: string, title: string) => {
    const newModule = {
      id: `mod-${Date.now()}`,
      title,
      topics: [],
    };
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return { ...c, modules: [...c.modules, newModule] };
      }),
    }));
  };

  // Handler: Delete Module
  const handleDeleteModule = (courseId: string, moduleId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return { ...c, modules: c.modules.filter((m) => m.id !== moduleId) };
      }),
    }));
  };

  // Handler: Save Course (New or Edit)
  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (editingCourse) {
      // Edit existing
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => (c.id === editingCourse.id ? { ...c, ...courseData } : c)),
      }));
    } else {
      // Create new
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        code: courseData.code || 'NEW 101',
        name: courseData.name || 'New Course',
        instructor: courseData.instructor,
        credits: courseData.credits || 3.0,
        color: courseData.color || '#3b82f6',
        targetGrade: courseData.targetGrade || 'A+',
        achievedGrade: courseData.targetGrade || 'A+',
        modules: [],
        exams: [],
      };
      setState((prev) => ({
        ...prev,
        courses: [...prev.courses, newCourse],
      }));
    }
    setEditingCourse(null);
  };

  // Handler: Delete Course
  const handleDeleteCourse = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== courseId),
      todos: prev.todos.filter((t) => t.courseId !== courseId),
      assignments: prev.assignments.filter((a) => a.courseId !== courseId),
    }));
  };

  // Handler: Add Exam
  const handleAddExam = (examData: Omit<ExamEvent, 'id'>) => {
    const newExam: ExamEvent = {
      ...examData,
      id: `exam-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== examData.courseId) return c;
        return { ...c, exams: [...c.exams, newExam] };
      }),
    }));
  };

  // Handler: Delete Exam
  const handleDeleteExam = (courseId: string, examId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return { ...c, exams: c.exams.filter((e) => e.id !== examId) };
      }),
    }));
  };

  // Handler: Course Grade Update
  const handleUpdateCourseGrade = (courseId: string, achievedGrade: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === courseId ? { ...c, achievedGrade } : c)),
    }));
  };

  // Handler: Add Assignment
  const handleAddAssignment = (asgData: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      assignments: [...prev.assignments, newAsg],
    }));
  };

  // Handler: Update Assignment Status
  const handleUpdateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  };

  // Handler: Delete Assignment
  const handleDeleteAssignment = (id: string) => {
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
  };

  // Handler: Add Book
  const handleAddBook = (bookData: Omit<BookLog, 'id'>) => {
    const newBook: BookLog = {
      ...bookData,
      id: `book-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      books: [newBook, ...prev.books],
    }));
  };

  // Handler: Update Book Progress
  const handleUpdateBookProgress = (id: string, progress: number) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === id ? { ...b, progress, status: progress >= 100 ? 'completed' : 'reading' } : b)),
    }));
  };

  // Handler: Delete Book
  const handleDeleteBook = (id: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
    }));
  };

  // Handler: Profile update
  const handleUpdateProfile = (name: string, semester: string, targetCgpa: number) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, name, semester, targetCgpa },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Navbar
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCloudSettings={() => setShowCloudSettings(true)}
        onDownloadBackup={() => downloadBackupFile(state)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Wisdom / Motivation Quote Box */}
            <QuoteCard
              quotes={state.quotes}
              onAddQuote={handleAddQuote}
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('syllabus')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-brand-500/50 cursor-pointer transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">Syllabus Mastered</span>
                  <GraduationCap className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="my-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                    {Math.round(
                      (state.courses.reduce((acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.topics.filter(t => t.completed).length, 0), 0) /
                        (state.courses.reduce((acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.topics.length, 0), 0) || 1)) *
                        100
                    )}%
                  </span>
                  <span className="text-xs text-slate-400">covered</span>
                </div>
                <span className="text-[11px] text-brand-400 font-medium flex items-center space-x-1">
                  <span>View courses</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('tasks')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 cursor-pointer transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">Today's Tasks</span>
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald group-hover:scale-110 transition-transform" />
                </div>
                <div className="my-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                    {state.todos.filter(t => !t.completed).length}
                  </span>
                  <span className="text-xs text-slate-400">pending</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <span>Execute action items</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('academics')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 cursor-pointer transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">Target CGPA</span>
                  <Target className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform" />
                </div>
                <div className="my-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-brand-400">
                    {state.profile.targetCgpa.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 4.00</span>
                </div>
                <span className="text-[11px] text-accent-cyan font-medium flex items-center space-x-1">
                  <span>Simulate grades</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('tasks')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/50 cursor-pointer transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">Active Habits</span>
                  <Flame className="w-4 h-4 text-accent-amber group-hover:scale-110 transition-transform" />
                </div>
                <div className="my-2 flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                    {state.habits.length}
                  </span>
                  <span className="text-xs text-slate-400">routines</span>
                </div>
                <span className="text-[11px] text-amber-400 font-medium flex items-center space-x-1">
                  <span>Track consistency</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* 2-Column Action & Academic Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Daily Action Tasks */}
              <div className="space-y-8">
                <DailyTodos
                  todos={state.todos}
                  courses={state.courses}
                  onAddTodo={handleAddTodo}
                  onToggleTodo={handleToggleTodo}
                  onDeleteTodo={handleDeleteTodo}
                />

                <HabitTracker
                  habits={state.habits}
                  onToggleHabitDate={handleToggleHabitDate}
                  onAddHabit={handleAddHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              </div>

              {/* Right Column: Deadlines, Exams & Coursework */}
              <div className="space-y-8">
                <ExamCountdown
                  courses={state.courses}
                  onAddExam={handleAddExam}
                  onDeleteExam={handleDeleteExam}
                />

                <AssignmentTracker
                  assignments={state.assignments}
                  courses={state.courses}
                  onAddAssignment={handleAddAssignment}
                  onUpdateStatus={handleUpdateAssignmentStatus}
                  onDeleteAssignment={handleDeleteAssignment}
                />
              </div>
            </div>

            {/* Course Syllabus Overview Horizontal Cards */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Course Syllabus Progress</h3>
                    <p className="text-xs text-slate-400">Enrolled courses for {state.profile.semester}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('syllabus')}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
                >
                  <span>Open Full Syllabus Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {state.courses.map((c) => {
                  const total = c.modules.reduce((acc, m) => acc + m.topics.length, 0);
                  const done = c.modules.reduce((acc, m) => acc + m.topics.filter(t => t.completed).length, 0);
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveTab('syllabus')}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${c.color}15`,
                            borderColor: `${c.color}35`,
                            color: c.color,
                          }}
                        >
                          {c.code}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">{pct}%</span>
                      </div>

                      <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-300 transition">
                        {c.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{c.credits} Credits • {c.modules.length} Modules</p>

                      <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: c.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYLLABUS TRACKER */}
        {activeTab === 'syllabus' && (
          <SyllabusTracker
            courses={state.courses}
            onToggleTopic={handleToggleTopic}
            onOpenTopicNotes={(topic, courseCode, courseName) => {
              setActiveTopicNote({ topic, courseCode, courseName });
            }}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
            onAddModule={handleAddModule}
            onDeleteModule={handleDeleteModule}
            onOpenCourseModal={(course) => {
              setEditingCourse(course || null);
              setShowCourseModal(true);
            }}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {/* TAB 3: TODOS & HABITS */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DailyTodos
              todos={state.todos}
              courses={state.courses}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />

            <HabitTracker
              habits={state.habits}
              onToggleHabitDate={handleToggleHabitDate}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </div>
        )}

        {/* TAB 4: ACADEMICS & GPA & DEADLINES */}
        {activeTab === 'academics' && (
          <div className="space-y-8">
            <GpaCalculator
              courses={state.courses}
              targetCgpa={state.profile.targetCgpa}
              onUpdateCourseGrade={handleUpdateCourseGrade}
              onUpdateTargetCgpa={(targetCgpa) => {
                setState((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, targetCgpa },
                }));
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExamCountdown
                courses={state.courses}
                onAddExam={handleAddExam}
                onDeleteExam={handleDeleteExam}
              />

              <AssignmentTracker
                assignments={state.assignments}
                courses={state.courses}
                onAddAssignment={handleAddAssignment}
                onUpdateStatus={handleUpdateAssignmentStatus}
                onDeleteAssignment={handleDeleteAssignment}
              />
            </div>
          </div>
        )}

        {/* TAB 5: READING & MINDSET */}
        {activeTab === 'reading' && (
          <div className="space-y-8">
            <QuoteCard
              quotes={state.quotes}
              onAddQuote={handleAddQuote}
            />

            <ReadingLog
              books={state.books}
              onAddBook={handleAddBook}
              onUpdateProgress={handleUpdateBookProgress}
              onDeleteBook={handleDeleteBook}
            />
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <CloudSettingsModal
        isOpen={showCloudSettings}
        onClose={() => setShowCloudSettings(false)}
        state={state}
        onUpdateState={(newState) => setState(newState)}
        onUpdateProfile={handleUpdateProfile}
      />

      <CourseModal
        course={editingCourse}
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
      />

      {activeTopicNote && (
        <TopicNotesModal
          topic={activeTopicNote.topic}
          courseCode={activeTopicNote.courseCode}
          courseName={activeTopicNote.courseName}
          onSave={handleSaveTopicNotes}
          onClose={() => setActiveTopicNote(null)}
        />
      )}
    </div>
  );
}

export default App;
