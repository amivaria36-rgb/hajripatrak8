import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import { Student, DayAttendance, ClassConfig, AttendanceStatus } from '../types/attendance';
import { toGuNum, GUJARATI_MONTHS } from '../utils/gujarati';

interface MonthlyPatrakProps {
  students: Student[];
  allAttendance: Record<string, DayAttendance>;
  config: ClassConfig;
  onUpdateDayStatus: (dateStr: string, studentId: string, newStatus: AttendanceStatus) => void;
}

export const MonthlyPatrak: React.FC<MonthlyPatrakProps> = ({
  students,
  allAttendance,
  config,
  onUpdateDayStatus,
}) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const monthNameGu = GUJARATI_MONTHS[selectedMonth - 1];

  // Helper to format YYYY-MM-DD
  const getDateStr = (day: number) => {
    const mm = String(selectedMonth).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${selectedYear}-${mm}-${dd}`;
  };

  // Check if day is Sunday
  const isSunday = (day: number) => {
    const d = new Date(selectedYear, selectedMonth - 1, day);
    return d.getDay() === 0;
  };

  const exportMonthlyCSV = () => {
    const headers = ['Roll No', 'Name (Gujarati)', 'Name (English)', ...daysArray.map((d) => `Day ${d}`), 'Total Present', 'Total Absent', 'Present %'];
    const rows = students.map((s) => {
      let presCount = 0;
      let absCount = 0;
      const dayValues = daysArray.map((day) => {
        const dateStr = getDateStr(day);
        const dayRecord = allAttendance[`${dateStr}_full-day`] || allAttendance[`${dateStr}_morning`];
        const status = dayRecord?.records[s.id];
        if (status === 'present') {
          presCount++;
          return 'P';
        }
        if (status === 'absent') {
          absCount++;
          return 'A';
        }
        if (status === 'leave') return 'L';
        return isSunday(day) ? 'SUN' : '-';
      });

      const totalMarked = presCount + absCount;
      const pct = totalMarked > 0 ? ((presCount / totalMarked) * 100).toFixed(1) : '0';

      return [
        s.rollNo,
        `"${s.nameGu}"`,
        `"${s.nameEn}"`,
        ...dayValues,
        presCount,
        absCount,
        `${pct}%`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Std8_Monthly_Register_${monthNameGu}_${selectedYear}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Month Header and Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>માસિક હાજરી પત્રક (Monthly Register)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {config.schoolNameGu} · {config.standard} ({config.division}) · વર્ષ: {toGuNum(selectedYear)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1 py-0.5 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="અગાઉનો મહિનો"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[130px] text-center">
              {monthNameGu} {toGuNum(selectedYear)}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="આગામી મહિનો"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={exportMonthlyCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">CSV એક્સપોર્ટ</span>
          </button>
        </div>
      </div>

      {/* Register Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-[11px]">
              <th className="py-2.5 px-3 font-bold sticky left-0 bg-slate-100 z-10 border-r border-slate-200 w-12 text-center">
                રોલ
              </th>
              <th className="py-2.5 px-3 font-bold sticky left-12 bg-slate-100 z-10 border-r border-slate-200 min-w-[160px]">
                વિદ્યાર્થીનું નામ
              </th>
              {daysArray.map((day) => {
                const sun = isSunday(day);
                return (
                  <th
                    key={day}
                    className={`py-2 px-1 text-center font-bold min-w-[28px] border-r border-slate-200 tabular-nums ${
                      sun ? 'bg-rose-100/70 text-rose-800' : 'text-slate-700'
                    }`}
                  >
                    <div>{toGuNum(day)}</div>
                    <div className="text-[9px] font-normal opacity-70">
                      {sun ? 'રવિ' : ''}
                    </div>
                  </th>
                );
              })}
              <th className="py-2.5 px-2 font-bold text-center border-r border-slate-200 text-emerald-700 min-w-[45px]">
                હાજર (P)
              </th>
              <th className="py-2.5 px-2 font-bold text-center border-r border-slate-200 text-rose-700 min-w-[45px]">
                ગેરહાજર (A)
              </th>
              <th className="py-2.5 px-2 font-bold text-center text-slate-800 min-w-[50px]">
                ટકા %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.map((student) => {
              let totalP = 0;
              let totalA = 0;

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2 px-2 text-center font-bold text-slate-700 sticky left-0 bg-white border-r border-slate-200 tabular-nums">
                    {toGuNum(student.rollNo)}
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-900 sticky left-12 bg-white border-r border-slate-200 whitespace-nowrap">
                    <div>{student.nameGu}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {student.nameEn}
                    </div>
                  </td>
                  {daysArray.map((day) => {
                    const dateStr = getDateStr(day);
                    const sun = isSunday(day);
                    const dayRec =
                      allAttendance[`${dateStr}_full-day`] ||
                      allAttendance[`${dateStr}_morning`];
                    const status = dayRec?.records[student.id];

                    if (status === 'present') totalP++;
                    if (status === 'absent') totalA++;

                    return (
                      <td
                        key={day}
                        onClick={() => {
                          if (sun) return;
                          // Cycle status
                          const next: AttendanceStatus =
                            status === 'present'
                              ? 'absent'
                              : status === 'absent'
                              ? 'leave'
                              : 'present';
                          onUpdateDayStatus(dateStr, student.id, next);
                        }}
                        className={`py-1.5 px-1 text-center font-bold border-r border-slate-200 select-none cursor-pointer text-[11px] ${
                          sun
                            ? 'bg-rose-50/50 text-rose-400 cursor-not-allowed'
                            : status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : status === 'absent'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : status === 'leave'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'text-slate-300 hover:bg-slate-100'
                        }`}
                        title={`${student.nameGu} - ${day}/${selectedMonth}: ${status || 'ખાલી'}`}
                      >
                        {sun ? '—' : status === 'present' ? 'P' : status === 'absent' ? 'A' : status === 'leave' ? 'L' : '·'}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center font-bold text-emerald-700 border-r border-slate-200 tabular-nums bg-emerald-50/20">
                    {toGuNum(totalP)}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-rose-700 border-r border-slate-200 tabular-nums bg-rose-50/20">
                    {toGuNum(totalA)}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-slate-800 tabular-nums">
                    {totalP + totalA > 0
                      ? `${toGuNum(((totalP / (totalP + totalA)) * 100).toFixed(0))}%`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend & Instructions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">સંકેતો:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">P</span>
            <span>હાજર (Present)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-[10px]">A</span>
            <span>ગેરહાજર (Absent)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">L</span>
            <span>રજા (Leave)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-rose-50 text-rose-500 font-bold flex items-center justify-center text-[10px]">રવિ</span>
            <span>રવિવાર (Sunday)</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          * કોઈપણ તારીખના ખાના પર ક્લિક કરી હાજરી સીધી બદલી શકો છો.
        </p>
      </div>
    </div>
  );
};
