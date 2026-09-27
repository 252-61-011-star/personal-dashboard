import React, { useState } from 'react';
import type { Quote as QuoteType } from '../types';
import { Sparkles, RefreshCw, Copy, Check, Plus, Quote as QuoteIcon } from 'lucide-react';

interface QuoteCardProps {
  quotes: QuoteType[];
  onAddQuote: (newQuote: Omit<QuoteType, 'id'>) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quotes,
  onAddQuote,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<QuoteType['category']>('Analytical Thinking');

  const filteredQuotes = selectedCategory === 'All'
    ? quotes
    : quotes.filter((q) => q.category === selectedCategory);

  const activeQuote = filteredQuotes[currentIndex % (filteredQuotes.length || 1)] || quotes[0];

  const handleNext = () => {
    if (filteredQuotes.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
    }
  };

  const handleCopy = () => {
    if (!activeQuote) return;
    navigator.clipboard.writeText(`"${activeQuote.text}" — ${activeQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newAuthor.trim()) return;
    onAddQuote({
      text: newText.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      isFavorite: true,
    });
    setNewText('');
    setNewAuthor('');
    setShowAddModal(false);
  };

  const categories = ['All', 'Mental Models', 'Analytical Thinking', 'Marketing Wisdom', 'Focus & Depth', 'Growth & Resilience'];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 p-6 sm:p-7 shadow-xl">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none" />

      {/* Top Header & Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Mindset & Wisdom Crucible
            </h3>
            <p className="text-xs text-slate-400">First-principles fuel for sharp thinking & execution</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            title="Copy Quote"
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1 px-2.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleNext}
            title="Next Insight (Shuffle)"
            className="p-1.5 rounded-lg bg-brand-600/90 hover:bg-brand-500 text-white transition shadow-sm border border-brand-400/30 text-xs flex items-center space-x-1.5 px-3 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-once" />
            <span className="text-[11px]">New Insight</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            title="Add Custom Quote"
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quote Display Area */}
      {activeQuote ? (
        <div className="relative py-2 px-1">
          <QuoteIcon className="absolute -top-3 -left-2 w-8 h-8 text-brand-500/15 pointer-events-none" />
          <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed tracking-wide relative z-10 pl-6 border-l-2 border-brand-500/50">
            "{activeQuote.text}"
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pl-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-brand-400 tracking-wide">
                — {activeQuote.author}
              </span>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {activeQuote.category}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No quotes found for this filter.</p>
      )}

      {/* Category Pills */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
            className={`text-[11px] px-2.5 py-1 rounded-md transition font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modal to Add Custom Quote */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Add Wisdom / Motivational Quote</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Add timeless insights to prime your daily mindset.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quote Text
                </label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. What I cannot create, I do not understand..."
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Author / Thinker
                </label>
                <input
                  required
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Richard Feynman, Naval Ravikant, Marcus Aurelius"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Analytical Thinking">Analytical Thinking</option>
                  <option value="Mental Models">Mental Models</option>
                  <option value="Marketing Wisdom">Marketing Wisdom</option>
                  <option value="Focus & Depth">Focus & Depth</option>
                  <option value="Growth & Resilience">Growth & Resilience</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
