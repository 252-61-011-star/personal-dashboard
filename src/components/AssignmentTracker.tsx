import React, { useState } from 'react';
import type { Assignment, Course } from '../types';
import { 
  FileCheck2, 
  Calendar, 
  Plus, 
  Trash2 
} from 'lucide-react';

interface AssignmentTrackerProps {
  assignments: Assignment[];
  courses: Course[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateStatus: (id: string, status: Assignment['status']) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentTracker: React.FC<AssignmentTrackerProps> = ({
  assignments,
  courses,
  onAddAssignment,
  onUpdateStatus,
  onDeleteAssignment,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [weightage, setWeightage] = useState(15);
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || !courseId) return;

    onAddAssignment({
      title: title.trim(),
      courseId,
      dueDate,
      weightage: Number(weightage),
      status: 'not_started',
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setDueDate('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Assignments & Term Papers</h3>
            <p className="text-xs text-slate-400">Coursework pipeline and submission manager</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Assignment</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-400 uppercase font-mono">Create Coursework Task</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-slate-500">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Assignment Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Marketing Plan Presentation"
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Due Date & Time</label>
              <input
                required
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Weightage (%)</label>
              <input
                type="number"
                value={weightage}
                onChange={(e) => setWeightage(Number(e.target.value))}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Notes / Instructions</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. APA formatting, max 10 slides, submit on DIU portal..."
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              Save Assignment
            </button>
          </div>
        </form>
      )}

      {/* Assignment List */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[400px] pr-1">
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">No pending assignments.</div>
        ) : (
          assignments.map((asg) => {
            const course = courses.find((c) => c.id === asg.courseId);
            const isDueSoon = asg.dueDate && asg.dueDate.split('T')[0] <= todayStr && asg.status !== 'submitted';

            const formattedDue = new Date(asg.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={asg.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {course && (
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${course.color}15`,
                          borderColor: `${course.color}35`,
                          color: course.color,
                        }}
                      >
                        {course.code}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-white truncate">{asg.title}</span>
                  </div>

                  {asg.notes && (
                    <p className="text-xs text-slate-400 mt-1">{asg.notes}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                    <span className={`flex items-center space-x-1 ${isDueSoon ? 'text-rose-400 font-bold' : ''}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDue}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-bold">{asg.weightage}% weight</span>
                  </div>
                </div>

                {/* Status Switcher & Delete */}
                <div className="flex items-center space-x-2.5 self-start sm:self-center">
                  <select
                    value={asg.status}
                    onChange={(e) => onUpdateStatus(asg.id, e.target.value as any)}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                  </select>

                  <button
                    onClick={() => onDeleteAssignment(asg.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
