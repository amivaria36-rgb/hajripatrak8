import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Phone } from 'lucide-react';
import { Student, DayAttendance, ClassConfig } from '../types/attendance';
import { toGuNum, buildWhatsAppSummary, formatGujaratiDate } from '../utils/gujarati';

interface AbsenteeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  dayAttendance: DayAttendance | undefined;
  config: ClassConfig;
  dateStr: string;
  period: string;
}

export const AbsenteeSummaryModal: React.FC<AbsenteeSummaryModalProps> = ({
  isOpen,
  onClose,
  students,
  dayAttendance,
  config,
  dateStr,
  period,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const records = dayAttendance?.records || {};
  const absentStudents = students.filter((s) => records[s.id] === 'absent');
  const leaveStudents = students.filter((s) => records[s.id] === 'leave');
  const presentCount = students.filter((s) => records[s.id] === 'present').length;
  const unmarkedCount = students.filter((s) => !records[s.id] || records[s.id] === 'unmarked').length;

  const handleCopyWhatsApp = () => {
    const text = buildWhatsAppSummary(config, dateStr, period, students, dayAttendance);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsAppShare = () => {
    const text = buildWhatsAppSummary(config, dateStr, period, students, dayAttendance);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const { fullGu } = formatGujaratiDate(dateStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              ગેરહાજર વિદ્યાર્થી યાદી (Absentee Report)
            </h3>
            <p className="text-xs text-slate-500">{fullGu}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-4 border-b border-slate-100 text-center py-2.5 bg-slate-50 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">કુલ</span>
            <span className="font-bold text-slate-800 text-sm tabular-nums">
              {toGuNum(students.length)}
            </span>
          </div>
          <div>
            <span className="text-emerald-600 block text-[10px]">હાજર</span>
            <span className="font-bold text-emerald-700 text-sm tabular-nums">
              {toGuNum(presentCount)}
            </span>
          </div>
          <div>
            <span className="text-rose-600 block text-[10px]">ગેરહાજર</span>
            <span className="font-bold text-rose-700 text-sm tabular-nums">
              {toGuNum(absentStudents.length)}
            </span>
          </div>
          <div>
            <span className="text-amber-600 block text-[10px]">રજા</span>
            <span className="font-bold text-amber-700 text-sm tabular-nums">
              {toGuNum(leaveStudents.length)}
            </span>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {absentStudents.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                વાહ! આજે કોઈ ગેરહાજર નથી
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                બધા વિદ્યાર્થીઓ શાળામાં હાજર છે (100% હાજરી).
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                ગેરહાજર વિદ્યાર્થીઓ ({absentStudents.length}):
              </h4>
              <div className="divide-y divide-slate-100 border border-rose-200 rounded-xl overflow-hidden bg-rose-50/20">
                {absentStudents.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3 flex items-center justify-between hover:bg-rose-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center tabular-nums">
                        {toGuNum(idx + 1)}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <span>{s.nameGu}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            (રોલ: {toGuNum(s.rollNo)})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {s.nameEn} · GR: {toGuNum(s.grNo)}
                        </div>
                      </div>
                    </div>

                    {s.parentPhone ? (
                      <a
                        href={`tel:${s.parentPhone}`}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>કોલ કરો</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">ફોન નંબર નથી</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {leaveStudents.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                રજા પર વિદ્યાર્થીઓ ({leaveStudents.length}):
              </h4>
              <div className="divide-y divide-slate-100 border border-amber-200 rounded-xl overflow-hidden bg-amber-50/20">
                {leaveStudents.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center tabular-nums">
                        {toGuNum(idx + 1)}
                      </span>
                      <span className="font-medium text-slate-900 text-sm">
                        {s.nameGu}
                      </span>
                      <span className="text-xs text-slate-400">
                        (રોલ: {toGuNum(s.rollNo)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unmarkedCount > 0 && (
            <p className="text-xs text-slate-400 italic text-center">
              નોંધ: હજુ {toGuNum(unmarkedCount)} વિદ્યાર્થીઓની હાજરી બાકી છે.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'કોપી થઈ ગયું!' : 'મેસેજ કોપી કરો'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenWhatsAppShare}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp માં મોકલો</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
