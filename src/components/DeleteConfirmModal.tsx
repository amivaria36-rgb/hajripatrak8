import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Student } from '../types/attendance';
import { toGuNum } from '../utils/gujarati';
import { StudentAvatar } from './StudentAvatar';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onConfirm: (studentId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  student,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-rose-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h3 className="font-bold text-slate-900 text-base mb-1">
            વિદ્યાર્થીને યાદીમાંથી કાઢી નાખો?
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            શું તમે ખરેખર નીચેના વિદ્યાર્થીનું નામ અને રેકોર્ડ ડિલીટ કરવા માંગો છો?
          </p>

          {/* Student preview card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 text-left mb-4">
            <StudentAvatar student={student} size="md" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-sm truncate">
                {student.nameGu}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {student.nameEn}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                રોલ નં: {toGuNum(student.rollNo)} · GR: {toGuNum(student.grNo)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-left mb-5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>આ ક્રિયા પછી વિદ્યાર્થીની હાજરી વિગતો પણ દૂર થઈ જશે.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              રદ કરો (Cancel)
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(student.id);
                onClose();
              }}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>હા, કાઢી નાખો (Delete)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
