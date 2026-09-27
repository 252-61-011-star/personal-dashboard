import React, { useState } from 'react';
import type { BookLog } from '../types';
import { Headphones, Book, Plus, Trash2 } from 'lucide-react';

interface ReadingLogProps {
  books: BookLog[];
  onAddBook: (book: Omit<BookLog, 'id'>) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDeleteBook: (id: string) => void;
}

export const ReadingLog: React.FC<ReadingLogProps> = ({
  books,
  onAddBook,
  onUpdateProgress,
  onDeleteBook,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState<BookLog['type']>('audiobook');
  const [progress, setProgress] = useState(0);
  const [keyTakeaway, setKeyTakeaway] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onAddBook({
      title: title.trim(),
      author: author.trim(),
      type,
      progress: Number(progress),
      status: Number(progress) >= 100 ? 'completed' : 'reading',
      keyTakeaway: keyTakeaway.trim() || undefined,
      rating: 5,
    });

    setTitle('');
    setAuthor('');
    setProgress(0);
    setKeyTakeaway('');
    setShowAddForm(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent-violet/15 border border-accent-violet/30 text-accent-violet">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Audiobooks & Knowledge Vault</h3>
            <p className="text-xs text-slate-400">Deep reading, audio immersion & mental model syntheses</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Title</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-400 uppercase font-mono">Log Book or Audiobook</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-slate-500">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Name of the Wind"
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Author</label>
              <input
                required
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Patrick Rothfuss, Naval Ravikant"
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Medium</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              >
                <option value="audiobook">Audiobook</option>
                <option value="book">Physical / E-Book</option>
                <option value="paper">Academic Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Key Takeaway / Quote</label>
            <input
              type="text"
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              placeholder="Core mental model or unforgettable line..."
              className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              Save Title
            </button>
          </div>
        </form>
      )}

      {/* Book Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {books.map((b) => {
          const isCompleted = b.progress >= 100;

          return (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {b.type === 'audiobook' ? (
                      <Headphones className="w-4 h-4 text-accent-violet" />
                    ) : (
                      <Book className="w-4 h-4 text-brand-400" />
                    )}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {b.type}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteBook(b.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white mt-2">{b.title}</h4>
                <p className="text-xs text-slate-400">{b.author}</p>

                {b.keyTakeaway && (
                  <p className="text-xs text-slate-300 italic mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    "{b.keyTakeaway}"
                  </p>
                )}
              </div>

              {/* Progress Slider */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>{isCompleted ? 'Finished' : 'Progress'}</span>
                  <span className="font-bold text-white">{b.progress}%</span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={b.progress}
                  onChange={(e) => onUpdateProgress(b.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
