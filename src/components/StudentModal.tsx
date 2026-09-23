import React, { useState, useEffect } from 'react';
import { X, Check, UserPlus, UserCheck, Trash2 } from 'lucide-react';
import { Student, Gender } from '../types/attendance';

interface StudentModalProps {
  isOpen: boolean;
  student: Student | null; // null for new student
  onClose: () => void;
  onSave: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  nextRollNo: number;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave,
  onDelete,
  nextRollNo,
}) => {
  const [rollNo, setRollNo] = useState<number>(nextRollNo);
  const [nameGu, setNameGu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [grNo, setGrNo] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [parentPhone, setParentPhone] = useState('');

  useEffect(() => {
    if (student) {
      setRollNo(student.rollNo);
      setNameGu(student.nameGu);
      setNameEn(student.nameEn);
      setGrNo(student.grNo);
      setGender(student.gender);
      setParentPhone(student.parentPhone || '');
    } else {
      setRollNo(nextRollNo);
      setNameGu('');
      setNameEn('');
      setGrNo(String(4800 + nextRollNo));
      setGender('male');
      setParentPhone('');
    }
  }, [student, nextRollNo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGu.trim()) return;

    const updatedStudent: Student = {
      id: student?.id || `std-${Date.now()}`,
      rollNo: Number(rollNo) || 1,
      nameGu: nameGu.trim(),
      nameEn: nameEn.trim() || nameGu.trim(),
      grNo: grNo.trim() || '---',
      gender,
      avatarSeed: student?.avatarSeed || Math.floor(Math.random() * 20),
      photoUrl: student?.photoUrl,
      parentPhone: parentPhone.trim() || undefined,
    };

    onSave(updatedStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              {student ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {student ? 'વિદ્યાર્થી માહિતી સુધારો' : 'નવો વિદ્યાર્થી ઉમેરો (Add Student)'}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                રોલ નંબર (Roll No) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={200}
                value={rollNo}
                onChange={(e) => setRollNo(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                જી.આર. નં. (GR No)
              </label>
              <input
                type="text"
                value={grNo}
                onChange={(e) => setGrNo(e.target.value)}
                placeholder="उदा. 4825"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              વિદ્યાર્થીનું પૂરું નામ (ગુજરાતીમાં) *
            </label>
            <input
              type="text"
              required
              value={nameGu}
              onChange={(e) => setNameGu(e.target.value)}
              placeholder="દા.ત. પટેલ આરવ અમિતભાઈ"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              નામ અંગ્રેજીમાં (Name in English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Aarav A. Patel"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                જાતિ (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="male">કુમાર (Boy / Male)</option>
                <option value="female">કન્યા (Girl / Female)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વાલીનો મોબાઈલ (Phone)
              </label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="9825000000"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {student && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`શું તમે '${student.nameGu}' ને દૂર કરવા માંગો છો?`)) {
                    onDelete(student.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>કાઢી નાખો</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                <span>સાચવો (Save)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
