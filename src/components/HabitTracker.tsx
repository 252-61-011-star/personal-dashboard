import React, { useState } from 'react';
import type { Habit } from '../types';
import { Flame, Plus, Trash2, Check } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Academics');
  const [targetPerWeek, setTargetPerWeek] = useState(7);

  // Generate the last 7 days (including today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit({
      name: name.trim(),
      category: category.trim(),
      targetPerWeek,
    });
    setName('');
    setShowAddForm(false);
  };

  const computeStreak = (habit: Habit): number => {
    let streak = 0;
    const checkDate = new Date();
    
    // If today is completed, start from today, else start from yesterday
    const today = checkDate.toISOString().split('T')[0];
    if (habit.history[today]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.history[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent-amber/15 border border-accent-amber/30 text-accent-amber">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Daily Focus & Habits</h3>
            <p className="text-xs text-slate-400">Consistency creates compounding leverage</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Habit</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="my-4 p-4 rounded-xl bg-slate-950/80 border border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-400 uppercase font-mono">New Habit Tracking</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-slate-500">Cancel</button>
          </div>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit title (e.g. Deep Reading 30m, Morning Review)"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">Target Days/Week</label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habit List */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {habits.map((habit) => {
          const streak = computeStreak(habit);

          return (
            <div
              key={habit.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-700 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white truncate">{habit.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {habit.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center space-x-1 text-accent-amber font-mono font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{streak} day streak</span>
                  </span>
                  <span>•</span>
                  <span>Target: {habit.targetPerWeek}d/wk</span>
                </div>
              </div>

              {/* 7-Day History Bubbles */}
              <div className="flex items-center space-x-2 self-start sm:self-center">
                <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  {last7Days.map((dateStr) => {
                    const isDone = Boolean(habit.history[dateStr]);
                    const isToday = dateStr === todayStr;
                    const dateObj = new Date(dateStr);
                    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });

                    return (
                      <button
                        key={dateStr}
                        onClick={() => onToggleHabitDate(habit.id, dateStr)}
                        title={`${dateStr}: ${isDone ? 'Completed' : 'Missed'} (Click to toggle)`}
                        className={`w-6 h-6 rounded-md flex flex-col items-center justify-center transition text-[9px] font-bold ${
                          isDone
                            ? 'bg-accent-emerald text-slate-950 shadow-sm shadow-emerald-500/20'
                            : isToday
                            ? 'bg-slate-800 text-slate-400 border border-dashed border-slate-600 hover:border-emerald-500'
                            : 'bg-slate-950 text-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : dayLabel}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
