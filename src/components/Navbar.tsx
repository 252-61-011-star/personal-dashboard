import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Cloud, 
  Download, 
  Settings, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Layers 
} from 'lucide-react';
import type { DashboardState } from '../types';
import { getSupabaseConfig } from '../services/supabase';

interface NavbarProps {
  state: DashboardState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCloudSettings: () => void;
  onDownloadBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  activeTab,
  setActiveTab,
  onOpenCloudSettings,
  onDownloadBackup,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isConfigured } = getSupabaseConfig();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute stats
  const totalTopics = state.courses.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.topics.length, 0),
    0
  );
  const completedTopics = state.courses.reduce(
    (acc, c) =>
      acc +
      c.modules.reduce(
        (mAcc, m) => mAcc + m.topics.filter((t) => t.completed).length,
        0
      ),
    0
  );
  const overallSyllabusPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTodosToday = state.todos.filter(
    (t) => !t.completed && (!t.dueDate || t.dueDate <= todayStr)
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'syllabus', label: 'Course Syllabus', icon: GraduationCap, badge: `${overallSyllabusPercent}%` },
    { id: 'tasks', label: 'Todos & Habits', icon: CheckCircle2, badge: pendingTodosToday > 0 ? `${pendingTodosToday}` : undefined },
    { id: 'academics', label: 'GPA & Deadlines', icon: Layers },
    { id: 'reading', label: 'Reading & Mindset', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                  Nexus Command
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20 font-semibold">
                  v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {state.profile.name} • <span className="text-slate-300">{state.profile.semester}</span>
              </p>
            </div>
          </div>

          {/* Center Stat Highlights (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-medium">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <GraduationCap className="w-4 h-4 text-brand-400" />
              <span className="text-slate-400">Syllabus:</span>
              <span className="text-white font-semibold font-mono">{completedTopics}/{totalTopics} ({overallSyllabusPercent}%)</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              <span className="text-slate-400">Due Today:</span>
              <span className="text-white font-semibold font-mono">{pendingTodosToday} remaining</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <Calendar className="w-4 h-4 text-accent-cyan" />
              <span className="text-slate-300 font-mono">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-brand-400 font-mono font-semibold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenCloudSettings}
              title={isConfigured ? 'Cloud Sync Active (Supabase)' : 'Connect Supabase Cloud'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isConfigured
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-current" />
              <span className="hidden sm:inline">{isConfigured ? 'Cloud Sync' : 'Offline / Local'}</span>
            </button>

            <button
              onClick={onDownloadBackup}
              title="Download Data Backup (.json)"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCloudSettings}
              title="Dashboard Settings"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
