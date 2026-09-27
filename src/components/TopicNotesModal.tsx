import React, { useState, useEffect } from 'react';
import type { SyllabusTopic } from '../types';
import { BookOpen, Save, X, Plus, Trash2 } from 'lucide-react';

interface TopicNotesModalProps {
  topic: SyllabusTopic | null;
  courseCode: string;
  courseName: string;
  onSave: (topicId: string, notes: string, formulas: string[]) => void;
  onClose: () => void;
}

export const TopicNotesModal: React.FC<TopicNotesModalProps> = ({
  topic,
  courseCode,
  courseName,
  onSave,
  onClose,
}) => {
  const [notes, setNotes] = useState('');
  const [formulas, setFormulas] = useState<string[]>([]);
  const [newFormula, setNewFormula] = useState('');

  useEffect(() => {
    if (topic) {
      setNotes(topic.notes || '');
      setFormulas(topic.keyFormulas || []);
    }
  }, [topic]);

  if (!topic) return null;

  const handleAddFormula = () => {
    if (!newFormula.trim()) return;
    setFormulas([...formulas, newFormula.trim()]);
    setNewFormula('');
  };

  const handleRemoveFormula = (idx: number) => {
    setFormulas(formulas.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(topic.id, notes, formulas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-400 border border-slate-700">
                  {courseCode}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">{courseName}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{topic.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Notes & Core Concepts */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Core Concepts & Study Notes</span>
              <span className="text-[11px] text-slate-500 font-normal">Markdown / Plain text</span>
            </label>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record key definitions, frameworks (e.g. STP, 4Ps, Marginal Utility), slide references or exam focus areas..."
              className="w-full rounded-xl bg-slate-950 border border-slate-700/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-sans leading-relaxed"
            />
          </div>

          {/* Key Formulas / Frameworks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Formulas & High-Yield Frameworks
            </label>
            
            {formulas.length > 0 && (
              <div className="space-y-2 mb-3">
                {formulas.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-accent-cyan"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFormula(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFormula();
                  }
                }}
                placeholder="Add formula (e.g. PED = (%ΔQ / %ΔP) or MC = dTC/dQ)"
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddFormula}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
