import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Student, DayAttendance, ClassConfig } from '../types/attendance';
import { toGuNum, formatGujaratiDate } from '../utils/gujarati';

interface PrintRegisterProps {
  students: Student[];
  dayAttendance: DayAttendance | undefined;
  config: ClassConfig;
  dateStr: string;
  period: string;
  onBack: () => void;
}

export const PrintRegister: React.FC<PrintRegisterProps> = ({
  students,
  dayAttendance,
  config,
  dateStr,
  period,
  onBack,
}) => {
  const { fullGu } = formatGujaratiDate(dateStr);
  const records = dayAttendance?.records || {};

  const total = students.length;
  const presentCount = students.filter((s) => records[s.id] === 'present').length;
  const absentCount = students.filter((s) => records[s.id] === 'absent').length;
  const leaveCount = students.filter((s) => records[s.id] === 'leave').length;
  const pct = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0';

  const periodLabelMap: Record<string, string> = {
    'full-day': 'દૈનિક હાજરી (આખો દિવસ)',
    morning: 'સવાર સત્ર',
    afternoon: 'બપોર સત્ર',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Screen action toolbar (hidden on print) */}
      <div className="print:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછા જાઓ (Back)</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>પ્રિન્ટ કરો અથવા PDF સેવ કરો (Print / Save PDF)</span>
        </button>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Gujarat Primary School Official Header */}
        <div className="text-center pb-6 border-b-2 border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            ગુજરાત સરકાર · શિક્ષણ વિભાગ
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {config.schoolNameGu}
          </h1>
          <div className="text-sm font-semibold text-slate-700 mt-1">
            {config.schoolName}
          </div>
          <div className="text-base font-bold text-slate-800 mt-2 bg-slate-100 inline-block px-4 py-1 rounded-md">
            {config.standard} ({config.division}) - દૈનિક વિદ્યાર્થી હાજરી પત્રક
          </div>
        </div>

        {/* Sheet Metadata Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">તારીખ (Date):</span>
            <span className="font-bold text-slate-900">{fullGu}</span>
          </div>
          <div>
            <span className="text-slate-500 block">સત્ર (Session):</span>
            <span className="font-bold text-slate-900">{periodLabelMap[period] || period}</span>
          </div>
          <div>
            <span className="text-slate-500 block">શૈક્ષણિક વર્ષ:</span>
            <span className="font-bold text-slate-900">{config.academicYear}</span>
          </div>
          <div>
            <span className="text-slate-500 block">વર્ગ શિક્ષક:</span>
            <span className="font-bold text-slate-900">{config.teacherName}</span>
          </div>
        </div>

        {/* Statistical Summary Box */}
        <div className="my-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-5 text-center text-xs">
          <div>
            <div className="text-slate-500">કુલ વિદ્યાર્થીઓ</div>
            <div className="text-base font-black text-slate-900 tabular-nums">
              {toGuNum(total)} ({total})
            </div>
          </div>
          <div>
            <div className="text-slate-500">હાજર (Present)</div>
            <div className="text-base font-black text-emerald-700 tabular-nums">
              {toGuNum(presentCount)}
            </div>
          </div>
          <div>
            <div className="text-slate-500">ગેરહાજર (Absent)</div>
            <div className="text-base font-black text-rose-700 tabular-nums">
              {toGuNum(absentCount)}
            </div>
          </div>
          <div>
            <div className="text-slate-500">રજા (Leave)</div>
            <div className="text-base font-black text-amber-700 tabular-nums">
              {toGuNum(leaveCount)}
            </div>
          </div>
          <div>
            <div className="text-slate-500">હાજરી ટકાવારી</div>
            <div className="text-base font-black text-slate-900 tabular-nums">
              {toGuNum(pct)}%
            </div>
          </div>
        </div>

        {/* Attendance Register Table */}
        <table className="w-full text-left text-xs border border-slate-300 border-collapse mb-8">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
              <th className="p-2 border-r border-slate-300 w-12 text-center">રોલ નં.</th>
              <th className="p-2 border-r border-slate-300 w-20">જી.આર. નં.</th>
              <th className="p-2 border-r border-slate-300">વિદ્યાર્થીનું પૂરું નામ</th>
              <th className="p-2 border-r border-slate-300 w-24 text-center">જાતિ</th>
              <th className="p-2 border-r border-slate-300 w-28 text-center">હાજરી સ્થિતિ</th>
              <th className="p-2 w-32">નોંધ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.map((student) => {
              const status = records[student.id];
              const isPresent = status === 'present';
              const isAbsent = status === 'absent';
              const isLeave = status === 'leave';

              return (
                <tr
                  key={student.id}
                  className={isAbsent ? 'bg-rose-50/50' : ''}
                >
                  <td className="p-2 border-r border-slate-300 text-center font-bold tabular-nums">
                    {toGuNum(student.rollNo)}
                  </td>
                  <td className="p-2 border-r border-slate-300 tabular-nums">
                    {toGuNum(student.grNo)}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                    <div>{student.nameGu}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {student.nameEn}
                    </div>
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center">
                    {student.gender === 'male' ? 'કુમાર' : 'કન્યા'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold">
                    {isPresent && <span className="text-emerald-700">P (હાજર)</span>}
                    {isAbsent && <span className="text-rose-700">A (ગેરહાજર)</span>}
                    {isLeave && <span className="text-amber-700">L (રજા)</span>}
                    {!status && <span className="text-slate-400">-</span>}
                  </td>
                  <td className="p-2 text-slate-400 text-[10px]">
                    {isAbsent && 'સૂચના મોકલેલ'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Signatures Footer */}
        <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs">
          <div>
            <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
              વર્ગ શિક્ષકની સહી
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{config.teacherName}</div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
              તારીખ અને સિક્કો
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{fullGu}</div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
              આચાર્યશ્રીની સહી
            </div>
            <div className="text-[11px] text-slate-500 mt-1">શ્રી સરસ્વતી પ્રાથમિક શાળા</div>
          </div>
        </div>
      </div>
    </div>
  );
};
