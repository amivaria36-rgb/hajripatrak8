import React, { useState } from 'react';
import { X, Check, Settings, RotateCcw } from 'lucide-react';
import { ClassConfig } from '../types/attendance';

interface ClassSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClassConfig;
  onSaveConfig: (config: ClassConfig) => void;
  onResetStudents: () => void;
}

export const ClassSettingsModal: React.FC<ClassSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetStudents,
}) => {
  const [schoolNameGu, setSchoolNameGu] = useState(config.schoolNameGu);
  const [schoolName, setSchoolName] = useState(config.schoolName);
  const [standard, setStandard] = useState(config.standard);
  const [division, setDivision] = useState(config.division);
  const [teacherName, setTeacherName] = useState(config.teacherName);
  const [academicYear, setAcademicYear] = useState(config.academicYear);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      schoolNameGu,
      schoolName,
      standard,
      division,
      teacherName,
      academicYear,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              વર્ગ અને શાળા સેટિંગ્સ (Class Settings)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              શાળાનું નામ (ગુજરાતીમાં)
            </label>
            <input
              type="text"
              value={schoolNameGu}
              onChange={(e) => setSchoolNameGu(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              શાળાનું નામ (English)
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ધોરણ (Standard)
              </label>
              <input
                type="text"
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વર્ગ / વર્ગખંડ (Division)
              </label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વર્ગ શિક્ષક (Teacher)
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                શૈક્ષણિક વર્ષ (Year)
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('શું તમે ડિફોલ્ટ ૨૮ વિદ્યાર્થીઓની યાદી રીસેટ કરવા માંગો છો?')) {
                  onResetStudents();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>વિદ્યાર્થીઓની મૂળ યાદી ફરીથી લાવો (Reset default roster)</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>સેવ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
