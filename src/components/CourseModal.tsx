import React, { useState, useEffect } from 'react';
import type { Course } from '../types';
import { GraduationCap, X, Save, Palette } from 'lucide-react';

interface CourseModalProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => void;
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState(3.0);
  const [color, setColor] = useState('#3b82f6');
  const [targetGrade, setTargetGrade] = useState('A+');

  useEffect(() => {
    if (course) {
      setCode(course.code);
      setName(course.name);
      setInstructor(course.instructor || '');
      setCredits(course.credits || 3.0);
      setColor(course.color || '#3b82f6');
      setTargetGrade(course.targetGrade || 'A+');
    } else {
      setCode('');
      setName('');
      setInstructor('');
      setCredits(3.0);
      setColor('#3b82f6');
      setTargetGrade('A+');
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    onSave({
      code: code.trim(),
      name: name.trim(),
      instructor: instructor.trim() || undefined,
      credits: Number(credits),
      color,
      targetGrade,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {course ? 'Edit Course Details' : 'Add New Course'}
              </h3>
              <p className="text-xs text-slate-400">Course info, credits & target grade</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Code</label>
              <input
                required
                type="text"
                placeholder="e.g. MKT 101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Course Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Principles of Marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Instructor / Department</label>
            <input
              type="text"
              placeholder="e.g. Dept of Marketing, DIU"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Credit Hours</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="6"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Grade</label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="A+">A+ (4.00)</option>
                <option value="A">A (3.75)</option>
                <option value="A-">A- (3.50)</option>
                <option value="B+">B+ (3.25)</option>
                <option value="B">B (3.00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-brand-400" />
              <span>Theme Accent Color</span>
            </label>
            <div className="flex items-center space-x-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{course ? 'Update Course' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
