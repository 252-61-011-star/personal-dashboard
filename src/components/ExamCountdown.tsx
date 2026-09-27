import React, { useState, useEffect } from 'react';
import type { ExamEvent, Course } from '../types';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';

interface ExamCountdownProps {
  courses: Course[];
  onAddExam: (exam: Omit<ExamEvent, 'id'>) => void;
  onDeleteExam: (courseId: string, examId: string) => void;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  courses,
  onAddExam,
  onDeleteExam,
}) => {
  const [now, setNow] = useState(Date.now());
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('Main Academic Building, DIU');
  const [room, setRoom] = useState('');
  const [weightage, setWeightage] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Collect all exams across courses
  const allExams: { exam: ExamEvent; course: Course }[] = [];
  courses.forEach((c) => {
    c.exams.forEach((e) => {
      allExams.push({ exam: e, course: c });
    });
  });

  // Sort by date ascending
  allExams.sort((a, b) => new Date(a.exam.date).getTime() - new Date(b.exam.date).getTime());

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !courseId) return;

    onAddExam({
      title: title.trim(),
      courseId,
      date,
      location: location.trim() || undefined,
      room: room.trim() || undefined,
      weightage: Number(weightage),
    });

    setTitle('');
    setDate('');
    setShowAddForm(false);
  };

  const getTimeRemaining = (examDateStr: string) => {
    const diff = new Date(examDateStr).getTime() - now;
    if (diff <= 0) {
      return { total: diff, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { total: diff, days, hours, minutes, seconds, isPast: false };
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent-rose/15 border border-accent-rose/30 text-accent-rose">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Exam & Midterm Radar</h3>
            <p className="text-xs text-slate-400">Real-time countdown to major academic checkpoints</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Exam</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-400 uppercase font-mono">Schedule Exam / Assessment</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-slate-500">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Exam Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Assessment, Quiz 2"
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Campus / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Academic Building, DIU"
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Date & Time</label>
              <input
                required
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Room / Hall</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. AB-402"
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

          <div className="flex justify-end pt-1">
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold">
              Schedule Exam
            </button>
          </div>
        </form>
      )}

      {/* Exam Grid Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {allExams.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
            No upcoming exams scheduled.
          </div>
        ) : (
          allExams.map(({ exam, course }) => {
            const timeLeft = getTimeRemaining(exam.date);
            const isUrgent = !timeLeft.isPast && timeLeft.days <= 3;
            const isApproaching = !timeLeft.isPast && timeLeft.days <= 7;

            const examDateObj = new Date(exam.date);
            const formattedDate = examDateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={exam.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-1"
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex items-start justify-between gap-2 pl-2">
                  <div>
                    <div className="flex items-center space-x-2">
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
                      {exam.weightage && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {exam.weightage}% weight
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1.5">{exam.title}</h4>
                    <p className="text-xs text-slate-400">{course.name}</p>
                  </div>

                  <button
                    onClick={() => onDeleteExam(course.id, exam.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Countdown Timer Display */}
                <div className="mt-3.5 pl-2">
                  {timeLeft.isPast ? (
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-500 text-xs font-mono font-semibold">
                      Completed / Past
                    </div>
                  ) : (
                    <div
                      className={`p-2.5 rounded-lg border font-mono flex items-center justify-between ${
                        isUrgent
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          : isApproaching
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-sm font-bold">{timeLeft.days}d</span>
                        <span className="text-xs">{timeLeft.hours}h</span>
                        <span className="text-xs">{timeLeft.minutes}m</span>
                        <span className="text-xs text-slate-500">{timeLeft.seconds}s</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {isUrgent ? 'Critical' : isApproaching ? 'Approaching' : 'Scheduled'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="mt-3 pl-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 border-t border-slate-800/60 pt-2">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{formattedDate}</span>
                  </span>

                  {exam.room && (
                    <span className="flex items-center space-x-1 text-accent-cyan font-mono">
                      <MapPin className="w-3 h-3" />
                      <span>{exam.room}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
