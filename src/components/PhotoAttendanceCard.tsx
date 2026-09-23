import React from 'react';
import { Check, X, Clock, Camera, Phone, Edit2, Trash2 } from 'lucide-react';
import { Student, AttendanceStatus } from '../types/attendance';
import { StudentAvatar } from './StudentAvatar';
import { toGuNum } from '../utils/gujarati';

interface PhotoAttendanceCardProps {
  student: Student;
  status: AttendanceStatus;
  onToggleStatus: (studentId: string) => void;
  onSetStatus: (studentId: string, status: AttendanceStatus) => void;
  onOpenPhotoCapture: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
}

export const PhotoAttendanceCard: React.FC<PhotoAttendanceCardProps> = ({
  student,
  status,
  onToggleStatus,
  onSetStatus,
  onOpenPhotoCapture,
  onEditStudent,
  onDeleteStudent,
}) => {
  const isPresent = status === 'present';
  const isAbsent = status === 'absent';
  const isLeave = status === 'leave';
  const isUnmarked = status === 'unmarked';

  // State-specific border, background, and badge styles
  const cardBorderClass = isPresent
    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
    : isAbsent
    ? 'border-rose-400 bg-rose-50/40 shadow-xs ring-2 ring-rose-500/20'
    : isLeave
    ? 'border-amber-400 bg-amber-50/40 shadow-xs ring-2 ring-amber-500/20'
    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs';

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden ${cardBorderClass}`}
    >
      {/* Top Bar on Card: Roll No & Camera / Edit */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center font-bold text-xs bg-slate-900 text-white rounded-lg px-2 py-0.5 tabular-nums">
            {toGuNum(student.rollNo)}
          </span>
          <span className="text-[11px] font-medium text-slate-500 tabular-nums">
            Roll {student.rollNo}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {student.parentPhone && (
            <a
              href={`tel:${student.parentPhone}`}
              title={`Call Guardian: ${student.parentPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            title="વિદ્યાર્થીની વિગત સુધારો (Edit Details)"
            onClick={(e) => {
              e.stopPropagation();
              onEditStudent(student);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="ફોટો લો / અપલોડ કરો (Snap Photo)"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhotoCapture(student);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          {onDeleteStudent && (
            <button
              type="button"
              title="વિદ્યાર્થીને કાઢી નાખો (Delete Student)"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStudent(student);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Clickable Photo Stage: Clicking here triggers attendance */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggleStatus(student.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleStatus(student.id);
          }
        }}
        className="flex-1 flex flex-col items-center px-3 py-2 cursor-pointer select-none active:scale-[0.98] transition-transform text-center"
      >
        {/* Photo Container with Status Indicator Stamp */}
        <div className="relative mb-2">
          <StudentAvatar student={student} size="lg" />

          {/* Floating Action Badge on Photo */}
          <div className="absolute -bottom-1.5 -right-1.5">
            {isPresent && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white ring-2 ring-white shadow-xs">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
            {isAbsent && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white ring-2 ring-white shadow-xs">
                <X className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
            {isLeave && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white ring-2 ring-white shadow-xs">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
            {isUnmarked && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-600 ring-2 ring-white text-[10px] font-bold">
                ?
              </span>
            )}
          </div>
        </div>

        {/* Student Name */}
        <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1 mb-0.5">
          {student.nameGu}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          {student.nameEn}
        </p>
        <span className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
          GR: {toGuNum(student.grNo)}
        </span>

        {/* Status Text Indicator */}
        <div className="mt-2 text-xs font-semibold">
          {isPresent && (
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
              હાજર (P)
            </span>
          )}
          {isAbsent && (
            <span className="text-rose-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
              ગેરહાજર (A)
            </span>
          )}
          {isLeave && (
            <span className="text-amber-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              રજા (L)
            </span>
          )}
          {isUnmarked && (
            <span className="text-slate-400 font-normal">
              ક્લિક કરો (Click)
            </span>
          )}
        </div>
      </div>

      {/* Card Direct Status Action Buttons */}
      <div className="grid grid-cols-3 border-t border-slate-200/80 bg-white divide-x divide-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSetStatus(student.id, 'present');
          }}
          className={`py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
            isPresent
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
          title="હાજર માર્ક કરો (Present)"
        >
          <Check className="w-3.5 h-3.5" />
          <span>P</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSetStatus(student.id, 'absent');
          }}
          className={`py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
            isAbsent
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-rose-700 hover:bg-rose-50'
          }`}
          title="ગેરહાજર માર્ક કરો (Absent)"
        >
          <X className="w-3.5 h-3.5" />
          <span>A</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSetStatus(student.id, 'leave');
          }}
          className={`py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
            isLeave
              ? 'bg-amber-500 text-white font-semibold'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
          title="રજા માર્ક કરો (Leave)"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>L</span>
        </button>
      </div>
    </div>
  );
};
