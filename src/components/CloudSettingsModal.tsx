import React, { useState } from 'react';
import type { DashboardState } from '../types';
import { 
  Cloud, 
  Database, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  RefreshCw, 
  User 
} from 'lucide-react';
import { SUPABASE_SETUP_SQL, getSupabaseConfig, initSupabase } from '../services/supabase';
import { syncToCloud, fetchFromCloud, downloadBackupFile, importStateFromJson } from '../services/storage';

interface CloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: DashboardState;
  onUpdateState: (newState: DashboardState) => void;
  onUpdateProfile: (name: string, semester: string, targetCgpa: number) => void;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  onUpdateProfile,
}) => {
  const config = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.url);
  const [supabaseKey, setSupabaseKey] = useState(config.key);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Profile fields
  const [name, setName] = useState(state.profile.name);
  const [semester, setSemester] = useState(state.profile.semester);
  const [targetCgpa, setTargetCgpa] = useState(state.profile.targetCgpa);

  if (!isOpen) return null;

  const handleSaveCredentials = () => {
    localStorage.setItem('hermes_sb_url', supabaseUrl.trim());
    localStorage.setItem('hermes_sb_key', supabaseKey.trim());
    initSupabase(supabaseUrl.trim(), supabaseKey.trim());
    setSyncStatus('Credentials saved successfully in browser memory.');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Uploading state to Supabase Postgres...');
    const res = await syncToCloud(state);
    setIsSyncing(false);
    setSyncStatus(res.message);
  };

  const handleCloudPull = async () => {
    setIsSyncing(true);
    setSyncStatus('Retrieving latest dashboard data from Cloud...');
    const res = await fetchFromCloud();
    setIsSyncing(false);
    if (res.success && res.data) {
      onUpdateState(res.data);
      setSyncStatus('Remote cloud state loaded successfully!');
    } else {
      setSyncStatus(`Pull failed: ${res.message}`);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importStateFromJson(content);
        onUpdateState(imported);
        alert('Dashboard backup restored successfully!');
        onClose();
      } catch (err: any) {
        alert(`Failed to import backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, semester, Number(targetCgpa));
    setSyncStatus('Profile updated!');
    setTimeout(() => setSyncStatus(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cloud Database & Storage Control</h3>
              <p className="text-xs text-slate-400">Sync with Supabase, export backups, manage profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Profile Section */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-brand-400 font-bold font-mono uppercase">
              <User className="w-4 h-4" />
              <span>Student Profile</span>
            </div>

            <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Semester / Term</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target CGPA</label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="4.0"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(Number(e.target.value))}
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* Supabase Cloud Connection */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-accent-emerald font-bold font-mono uppercase">
                <Database className="w-4 h-4" />
                <span>Supabase Cloud Integration</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono font-bold ${config.isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {config.isConfigured ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Connect your free Supabase cloud database to access your syllabus, tasks, and grades across your laptop and phone seamlessly.
            </p>

            <div className="space-y-2.5">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Supabase Public Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSaveCredentials}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700"
              >
                Save Credentials
              </button>

              <button
                onClick={handleCloudSync}
                disabled={isSyncing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync to Cloud</span>
              </button>

              <button
                onClick={handleCloudPull}
                disabled={isSyncing}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700"
              >
                Pull from Cloud
              </button>

              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 flex items-center space-x-1 ml-auto"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Table Script'}</span>
              </button>
            </div>

            {syncStatus && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-brand-300 font-mono text-[11px]">
                {syncStatus}
              </div>
            )}
          </div>

          {/* Local Backups / JSON Export & Import */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-300 font-bold font-mono uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Offline JSON Backups & Portability</span>
            </div>

            <p className="text-slate-400">
              Download your complete dashboard state anytime. Zero risk of data loss.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => downloadBackupFile(state)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center space-x-2 border border-slate-700"
              >
                <Download className="w-4 h-4 text-brand-400" />
                <span>Export Data (.json)</span>
              </button>

              <label className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center space-x-2 border border-slate-700 cursor-pointer">
                <Upload className="w-4 h-4 text-accent-cyan" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
