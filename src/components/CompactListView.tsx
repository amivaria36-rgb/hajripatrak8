import React from 'react';
import { Check, X, Clock, Camera, Edit2, Trash2 } from 'lucide-react';
import { Student, AttendanceStatus } from '../types/attendance';
import { StudentAvatar } from './StudentAvatar';
import { toGuNum } from '../utils/gujarati';

interface CompactListViewProps {
  students: Student[];
  records: Record<string, AttendanceStatus>;
  onSetStatus: (studentId: string, status: AttendanceStatus) => void;
  onOpenPhotoCapture: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
}

export const CompactListView: React.FC<CompactListViewProps> = ({
  students,
  records,
  onSetStatus,
  onOpenPhotoCapture,
  onEditStudent,
  onDeleteStudent,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="divide-y divide-slate-100">
        {students.map((student) => {
          const status = records[student.id] || 'unmarked';
          const isPresent = status === 'present';
          const isAbsent = status === 'absent';
          const isLeave = status === 'leave';

          return (
            <div
              key={student.id}
              className={`p-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 transition-colors ${
                isPresent
                  ? 'bg-emerald-50/20'
                  : isAbsent
                  ? 'bg-rose-50/20'
                  : isLeave
                  ? 'bg-amber-50/20'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                  {toGuNum(student.rollNo)}
                </span>

                <div
                  className="relative cursor-pointer group"
                  onClick={() => onOpenPhotoCapture(student)}
                  title="ફોટો બદલો"
                >
                  <StudentAvatar student={student} size="sm" />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {student.nameGu}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onEditStudent(student)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                      title="વિગત સુધારો"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {onDeleteStudent && (
                      <button
                        type="button"
                        onClick={() => onDeleteStudent(student)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                        title="વિદ્યાર્થીને કાઢી નાખો"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {student.nameEn} · GR: {toGuNum(student.grNo)}
                  </p>
                </div>
              </div>

              {/* Right: Fast Status Toggle Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onSetStatus(student.id, 'present')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    isPresent
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>હાજર (P)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSetStatus(student.id, 'absent')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    isAbsent
                      ? 'bg-rose-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                  }`}
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ગેરહાજર (A)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSetStatus(student.id, 'leave')}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    isLeave
                      ? 'bg-amber-500 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                  title="રજા (Leave)"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">રજા (L)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
