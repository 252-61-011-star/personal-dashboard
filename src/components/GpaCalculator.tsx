import React, { useState } from 'react';
import type { Course } from '../types';
import { DIU_GRADE_SCALE } from '../data/initialData';
import { Award, Target, Info } from 'lucide-react';

interface GpaCalculatorProps {
  courses: Course[];
  targetCgpa: number;
  onUpdateCourseGrade: (courseId: string, achievedGrade: string) => void;
  onUpdateTargetCgpa?: (newTarget: number) => void;
}

export const GpaCalculator: React.FC<GpaCalculatorProps> = ({
  courses,
  targetCgpa,
  onUpdateCourseGrade,
}) => {
  const [showScaleModal, setShowScaleModal] = useState(false);

  // Compute SGPA
  const getGradePoint = (gradeLetter?: string): number => {
    const match = DIU_GRADE_SCALE.find((g) => g.grade === gradeLetter);
    return match ? match.gpa : 4.00;
  };

  let totalCredits = 0;
  let totalGradePoints = 0;

  courses.forEach((c) => {
    const credits = c.credits || 3.0;
    const gp = getGradePoint(c.achievedGrade || c.targetGrade || 'A+');
    totalCredits += credits;
    totalGradePoints += credits * gp;
  });

  const projectedSgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 4.00;
  const sgpaFormatted = projectedSgpa.toFixed(2);
  const isTargetAchieved = projectedSgpa >= targetCgpa;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Semester GPA & CGPA Engine</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                DIU 4.00 Scale
              </span>
            </h3>
            <p className="text-xs text-slate-400">Real-time credit-weighted grade point calculations</p>
          </div>
        </div>

        <button
          onClick={() => setShowScaleModal(true)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 self-end sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Grading Matrix</span>
        </button>
      </div>

      {/* Primary Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Projected SGPA
          </span>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">{sgpaFormatted}</span>
            <span className="text-xs text-slate-500 font-mono">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Based on {courses.length} enrolled courses ({totalCredits} Total Credits)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Target CGPA Goal
            </span>
            <Target className="w-4 h-4 text-brand-400" />
          </div>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-brand-400">{targetCgpa.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-mono">Goal</span>
          </div>
          <p className={`text-[11px] font-semibold ${isTargetAchieved ? 'text-accent-emerald' : 'text-amber-400'}`}>
            {isTargetAchieved ? '✓ On track to achieve Target Goal' : 'Needs attention in core courses'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Quality Points
          </span>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-accent-cyan">{totalGradePoints.toFixed(1)}</span>
            <span className="text-xs text-slate-500 font-mono">QPts</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Total Grade Points earned across {totalCredits} credit hours
          </p>
        </div>
      </div>

      {/* Interactive Course Grade Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          Course Grade Simulators & Actuals
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Credits</th>
                <th className="py-2.5 px-3">Target Grade</th>
                <th className="py-2.5 px-3">Expected / Achieved</th>
                <th className="py-2.5 px-3 text-right">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {courses.map((c) => {
                const currentGrade = c.achievedGrade || c.targetGrade || 'A+';
                const gp = getGradePoint(currentGrade);

                return (
                  <tr key={c.id} className="hover:bg-slate-950/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] border"
                          style={{
                            backgroundColor: `${c.color}15`,
                            borderColor: `${c.color}40`,
                            color: c.color,
                          }}
                        >
                          {c.code}
                        </span>
                        <span className="font-medium text-white truncate max-w-[200px]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{c.credits} Cr</td>
                    <td className="py-3 px-3 font-mono font-semibold text-brand-400">{c.targetGrade}</td>
                    <td className="py-3 px-3">
                      <select
                        value={currentGrade}
                        onChange={(e) => onUpdateCourseGrade(c.id, e.target.value)}
                        className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                      >
                        {DIU_GRADE_SCALE.map((g) => (
                          <option key={g.grade} value={g.grade}>
                            {g.grade} ({g.gpa.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {(c.credits * gp).toFixed(2)} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIU Grade Scale Reference Modal */}
      {showScaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Award className="w-5 h-5 text-brand-400" />
              <span>Daffodil International University (DIU) Grading Standard</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Standard 4.00 Grade Point Average distribution.
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {DIU_GRADE_SCALE.map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-brand-400 w-8">{g.grade}</span>
                    <span className="text-slate-400">{g.marks}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{g.gpa.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowScaleModal(false)}
                className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
