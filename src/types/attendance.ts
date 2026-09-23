export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'unmarked';

export type Gender = 'male' | 'female';

export interface Student {
  id: string;
  rollNo: number;
  nameGu: string;
  nameEn: string;
  grNo: string;
  gender: Gender;
  avatarSeed: number; // For unique SVG avatar styling
  photoUrl?: string; // Base64 data URL or custom image
  parentPhone?: string;
}

export interface DayAttendance {
  date: string; // YYYY-MM-DD
  period: string; // 'full-day' | 'morning' | 'afternoon' | 'ganit' | 'vigyan' etc.
  records: Record<string, AttendanceStatus>; // studentId -> status
  notes?: string;
  timestamp: number;
}

export interface ClassConfig {
  schoolName: string;
  schoolNameGu: string;
  standard: string; // 'ધોરણ ૮' / 'Std 8'
  division: string; // 'વર્ગ A'
  teacherName: string;
  academicYear: string;
}

export type ViewMode = 'photo-grid' | 'compact-list' | 'monthly-patrak' | 'print-sheet';
