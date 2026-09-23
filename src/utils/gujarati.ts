import { Student, DayAttendance, ClassConfig } from '../types/attendance';

export const GUJARATI_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

export function toGuNum(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (d) => GUJARATI_DIGITS[parseInt(d, 10)]);
}

export const GUJARATI_DAYS = [
  'રવિવાર',
  'સોમવાર',
  'મંગળવાર',
  'બુધવાર',
  'ગુરુવાર',
  'શુક્રવાર',
  'શનિવાર',
];

export const GUJARATI_MONTHS = [
  'જાન્યુઆરી',
  'ફેબ્રુઆરી',
  'માર્ચ',
  'એપ્રિલ',
  'મે',
  'જૂન',
  'જુલાઈ',
  'ઑગસ્ટ',
  'સપ્ટેમ્બર',
  'ઑક્ટોબર',
  'નવેમ્બર',
  'ડિસેમ્બર',
];

export function formatGujaratiDate(dateStr: string): { fullGu: string; shortGu: string; dayName: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = GUJARATI_DAYS[dateObj.getDay()];
  const monthName = GUJARATI_MONTHS[month - 1];

  return {
    fullGu: `${dayOfWeek}, ${toGuNum(day)} ${monthName} ${toGuNum(year)}`,
    shortGu: `${toGuNum(day)}/${toGuNum(month)}/${toGuNum(year)}`,
    dayName: dayOfWeek,
  };
}

export function buildWhatsAppSummary(
  config: ClassConfig,
  dateStr: string,
  period: string,
  students: Student[],
  dayAttendance: DayAttendance | undefined
): string {
  const { fullGu } = formatGujaratiDate(dateStr);
  const records = dayAttendance?.records || {};

  const total = students.length;
  const presentStudents: Student[] = [];
  const absentStudents: Student[] = [];
  const leaveStudents: Student[] = [];

  students.forEach((s) => {
    const status = records[s.id] || 'unmarked';
    if (status === 'present') presentStudents.push(s);
    else if (status === 'absent') absentStudents.push(s);
    else if (status === 'leave') leaveStudents.push(s);
  });

  const periodLabelMap: Record<string, string> = {
    'full-day': 'આખો દિવસ (દૈનિક હાજરી)',
    morning: 'સવાર સત્ર (Morning)',
    afternoon: 'બપોર સત્ર (Afternoon)',
    ganit: 'ગણિત તાસ',
    vigyan: 'વિજ્ઞાન તાસ',
    gujarati: 'ગુજરાતી તાસ',
    english: 'અંગ્રેજી તાસ',
    ss: 'સામાજિક વિજ્ઞાન તાસ',
  };

  const periodLabel = periodLabelMap[period] || period;

  let msg = `📋 *${config.schoolNameGu || 'શ્રી પ્રાથમિક શાળા'}*\n`;
  msg += `🏫 *${config.standard} - ${config.division} | હાજરી પત્રક*\n`;
  msg += `📅 *તારીખ:* ${fullGu}\n`;
  msg += `⏰ *સત્ર/તાસ:* ${periodLabel}\n`;
  msg += `👨‍🏫 *વર્ગ શિક્ષક:* ${config.teacherName}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *હાજરી સારાંશ:*\n`;
  msg += `• કુલ સંખ્યા: *${toGuNum(total)}* (${total})\n`;
  msg += `• હાજર (P): *${toGuNum(presentStudents.length)}* (${presentStudents.length})\n`;
  msg += `• ગેરહાજર (A): *${toGuNum(absentStudents.length)}* (${absentStudents.length})\n`;
  if (leaveStudents.length > 0) {
    msg += `• રજા (L): *${toGuNum(leaveStudents.length)}* (${leaveStudents.length})\n`;
  }
  const pct = total > 0 ? ((presentStudents.length / total) * 100).toFixed(1) : '0';
  msg += `• ટકાવારી: *${toGuNum(pct)}%*\n`;

  if (absentStudents.length > 0) {
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `❌ *ગેરહાજર વિદ્યાર્થીઓ (${toGuNum(absentStudents.length)}):*\n`;
    absentStudents.forEach((s, idx) => {
      msg += `${toGuNum(idx + 1)}. રોલ નં. ${toGuNum(s.rollNo)} - ${s.nameGu} (${s.nameEn})\n`;
    });
  }

  if (leaveStudents.length > 0) {
    msg += `\n🟡 *રજા પર વિદ્યાર્થીઓ:*\n`;
    leaveStudents.forEach((s, idx) => {
      msg += `${toGuNum(idx + 1)}. રોલ નં. ${toGuNum(s.rollNo)} - ${s.nameGu}\n`;
    });
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_રિપોર્ટ જનરેટ: ${new Date().toLocaleTimeString('gu-IN')}_`;

  return msg;
}

export function exportAttendanceCSV(
  config: ClassConfig,
  dateStr: string,
  students: Student[],
  records: Record<string, string>
) {
  const headers = ['Roll No', 'GR No', 'Student Name (Gujarati)', 'Student Name (English)', 'Gender', 'Status', 'Date'];
  const rows = students.map((s) => {
    const status = records[s.id] || 'Unmarked';
    const statusLabel =
      status === 'present' ? 'હાજર (Present)' :
      status === 'absent' ? 'ગેરહાજર (Absent)' :
      status === 'leave' ? 'રજા (Leave)' : 'બાકી (Unmarked)';

    return [
      s.rollNo,
      s.grNo,
      `"${s.nameGu.replace(/"/g, '""')}"`,
      `"${s.nameEn.replace(/"/g, '""')}"`,
      s.gender === 'male' ? 'કુમાર (Boy)' : 'કન્યા (Girl)',
      `"${statusLabel}"`,
      dateStr,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Std8_Hajri_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
