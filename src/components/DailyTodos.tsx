import React, { useState } from 'react';
import type { TodoItem, Course, Priority } from '../types';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  BookOpen, 
  Tag, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyTodosProps {
  todos: TodoItem[];
  courses: Course[];
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export const DailyTodos: React.FC<DailyTodosProps> = ({
  todos,
  courses,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const [filter, setFilter] = useState<'today' | 'pending' | 'high' | 'all' | 'completed'>('today');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TodoItem['category']>('study');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseId, setCourseId] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggle = (id: string, currentCompleted: boolean) => {
    onToggleTodo(id);
    if (!currentCompleted) {
      // Fire confetti burst
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#3b82f6', '#10b981', '#06b6d4', '#f59e0b'],
      });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      completed: false,
      dueDate: dueDate || undefined,
      courseId: courseId || undefined,
    });

    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  // Filtering
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'today') {
      return !todo.completed && (!todo.dueDate || todo.dueDate <= todayStr);
    }
    if (filter === 'pending') {
      return !todo.completed;
    }
    if (filter === 'high') {
      return !todo.completed && todo.priority === 'high';
    }
    if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const completedTodayCount = todos.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(todayStr)
  ).length;

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-500/15 text-red-400 border border-red-500/30">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-700/50 text-slate-400 border border-slate-600">Low</span>;
    }
  };

  const getCategoryIcon = (cat: TodoItem['category']) => {
    switch (cat) {
      case 'study': return <BookOpen className="w-3.5 h-3.5 text-brand-400" />;
      case 'assignment': return <AlertCircle className="w-3.5 h-3.5 text-accent-cyan" />;
      case 'exam': return <Calendar className="w-3.5 h-3.5 text-accent-rose" />;
      case 'habit': return <Flame className="w-3.5 h-3.5 text-accent-emerald" />;
      default: return <Tag className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent-emerald/15 border border-accent-emerald/30 text-accent-emerald">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Daily Action Command</span>
              {completedTodayCount > 0 && (
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {completedTodayCount} done today
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">High-leverage tasks scheduled for execution</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 py-3 overflow-x-auto no-scrollbar border-b border-slate-800/60 text-xs">
        {[
          { id: 'today', label: 'Due Today' },
          { id: 'pending', label: 'All Pending' },
          { id: 'high', label: 'High Priority' },
          { id: 'completed', label: 'Completed' },
          { id: 'all', label: 'All' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
              filter === tab.id
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Task Inline Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="my-4 p-4 rounded-xl bg-slate-950/80 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider font-mono">
              Quick Task Creation
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Close
            </button>
          </div>

          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs tackling next? (e.g. Master Elasticity Formulas)"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional context / chapter numbers / notes..."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              >
                <option value="study">Study</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam Prep</option>
                <option value="habit">Habit/Routine</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              >
                <option value="">General / None</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[420px] pr-1 mt-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Clean slate!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {filter === 'today' ? 'All scheduled items for today completed.' : 'No tasks match the active filter.'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const course = courses.find((c) => c.id === todo.courseId);
            const isOverdue = todo.dueDate && todo.dueDate < todayStr && !todo.completed;

            return (
              <div
                key={todo.id}
                className={`py-3 px-2 flex items-start justify-between gap-3 group transition rounded-lg hover:bg-slate-800/40 ${
                  todo.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleToggle(todo.id, todo.completed)}
                    className="mt-0.5 text-slate-400 hover:text-accent-emerald transition flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckSquare className="w-5 h-5 text-accent-emerald" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-brand-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug break-words ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {todo.title}
                    </p>

                    {todo.description && (
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {todo.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getPriorityBadge(todo.priority)}

                      <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                        {getCategoryIcon(todo.category)}
                        <span className="capitalize">{todo.category}</span>
                      </span>

                      {course && (
                        <span
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${course.color}15`,
                            borderColor: `${course.color}40`,
                            color: course.color,
                          }}
                        >
                          {course.code}
                        </span>
                      )}

                      {todo.dueDate && (
                        <span
                          className={`text-[11px] font-mono flex items-center space-x-1 ${
                            isOverdue
                              ? 'text-rose-400 font-semibold'
                              : todo.dueDate === todayStr
                              ? 'text-brand-400 font-semibold'
                              : 'text-slate-400'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>
                            {todo.dueDate === todayStr ? 'Today' : todo.dueDate}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  title="Delete task"
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
