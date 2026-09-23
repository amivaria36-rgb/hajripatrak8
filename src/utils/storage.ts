import { Student, DayAttendance, ClassConfig } from '../types/attendance';

export const DEFAULT_CONFIG: ClassConfig = {
  schoolName: 'Shri Saraswati Primary School',
  schoolNameGu: 'શ્રી સરસ્વતી પ્રાથમિક શાળા',
  standard: 'ધોરણ ૮',
  division: 'વર્ગ A',
  teacherName: 'મહેતા સર (P. R. Mehta)',
  academicYear: '૨૦૨૬-૨૭',
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-01', rollNo: 1, nameGu: 'પટેલ આરવ અમિતભાઈ', nameEn: 'Aarav A. Patel', grNo: '4821', gender: 'male', avatarSeed: 1, parentPhone: '9825012345' },
  { id: 'std-02', rollNo: 2, nameGu: 'શાહ દિયા સંજયભાઈ', nameEn: 'Diya S. Shah', grNo: '4822', gender: 'female', avatarSeed: 2, parentPhone: '9825012346' },
  { id: 'std-03', rollNo: 3, nameGu: 'જોશી વિવાન પરેશભાઈ', nameEn: 'Vivan P. Joshi', grNo: '4823', gender: 'male', avatarSeed: 3, parentPhone: '9825012347' },
  { id: 'std-04', rollNo: 4, nameGu: 'રાઠોડ અનન્યા હસમુખભાઈ', nameEn: 'Ananya H. Rathod', grNo: '4824', gender: 'female', avatarSeed: 4, parentPhone: '9825012348' },
  { id: 'std-05', rollNo: 5, nameGu: 'વાઘેલા રુદ્ર દિલીપભાઈ', nameEn: 'Rudra D. Vaghela', grNo: '4825', gender: 'male', avatarSeed: 5, parentPhone: '9825012349' },
  { id: 'std-06', rollNo: 6, nameGu: 'સોલંકી પ્રિયા મહેશભાઈ', nameEn: 'Priya M. Solanki', grNo: '4826', gender: 'female', avatarSeed: 6, parentPhone: '9825012350' },
  { id: 'std-07', rollNo: 7, nameGu: 'મકવાણા કબીર વિનોદભાઈ', nameEn: 'Kabir V. Makwana', grNo: '4827', gender: 'male', avatarSeed: 7, parentPhone: '9825012351' },
  { id: 'std-08', rollNo: 8, nameGu: 'ચૌહાણ ઇશા નરેશભાઈ', nameEn: 'Isha N. Chauhan', grNo: '4828', gender: 'female', avatarSeed: 8, parentPhone: '9825012352' },
  { id: 'std-09', rollNo: 9, nameGu: 'પંડ્યા ધૈર્ય જીતેન્દ્રભાઈ', nameEn: 'Dhairya J. Pandya', grNo: '4829', gender: 'male', avatarSeed: 9, parentPhone: '9825012353' },
  { id: 'std-10', rollNo: 10, nameGu: 'દેસાઈ કાવ્યા રાજેશભાઈ', nameEn: 'Kavya R. Desai', grNo: '4830', gender: 'female', avatarSeed: 10, parentPhone: '9825012354' },
  { id: 'std-11', rollNo: 11, nameGu: 'પરમાર યુવરાજ સુરેશભાઈ', nameEn: 'Yuvraj S. Parmar', grNo: '4831', gender: 'male', avatarSeed: 11, parentPhone: '9825012355' },
  { id: 'std-12', rollNo: 12, nameGu: 'બારોટ જાનવી વિપુલભાઈ', nameEn: 'Janvi V. Barot', grNo: '4832', gender: 'female', avatarSeed: 12, parentPhone: '9825012356' },
  { id: 'std-13', rollNo: 13, nameGu: 'ગોહિલ ઓમ કનુભાઈ', nameEn: 'Om K. Gohil', grNo: '4833', gender: 'male', avatarSeed: 13, parentPhone: '9825012357' },
  { id: 'std-14', rollNo: 14, nameGu: 'દરજી તનિષ્કા પંકજભાઈ', nameEn: 'Tanishka P. Darji', grNo: '4834', gender: 'female', avatarSeed: 14, parentPhone: '9825012358' },
  { id: 'std-15', rollNo: 15, nameGu: 'ઠાકોર નીલ દિનેશભાઈ', nameEn: 'Neel D. Thakor', grNo: '4835', gender: 'male', avatarSeed: 15, parentPhone: '9825012359' },
  { id: 'std-16', rollNo: 16, nameGu: 'પ્રજાપતિ પ્રાચી રમેશભાઈ', nameEn: 'Prachi R. Prajapati', grNo: '4836', gender: 'female', avatarSeed: 16, parentPhone: '9825012360' },
  { id: 'std-17', rollNo: 17, nameGu: 'મેહતા મનન ભાવિનભાઈ', nameEn: 'Manan B. Mehta', grNo: '4837', gender: 'male', avatarSeed: 17, parentPhone: '9825012361' },
  { id: 'std-18', rollNo: 18, nameGu: 'ઝાલા ખુશી જયેશભાઈ', nameEn: 'Khushi J. Jhala', grNo: '4838', gender: 'female', avatarSeed: 18, parentPhone: '9825012362' },
  { id: 'std-19', rollNo: 19, nameGu: 'ચાવડા આદિત્ય પ્રવીણભાઈ', nameEn: 'Aditya P. Chavda', grNo: '4839', gender: 'male', avatarSeed: 19, parentPhone: '9825012363' },
  { id: 'std-20', rollNo: 20, nameGu: 'સોની માનસી અશોકભાઈ', nameEn: 'Mansi A. Soni', grNo: '4840', gender: 'female', avatarSeed: 20, parentPhone: '9825012364' },
  { id: 'std-21', rollNo: 21, nameGu: 'ત્રિવેદી કૃષ પ્રશાંતભાઈ', nameEn: 'Krish P. Trivedi', grNo: '4841', gender: 'male', avatarSeed: 21, parentPhone: '9825012365' },
  { id: 'std-22', rollNo: 22, nameGu: 'વ્યાસ રિયા મનોજભાઈ', nameEn: 'Riya M. Vyas', grNo: '4842', gender: 'female', avatarSeed: 22, parentPhone: '9825012366' },
  { id: 'std-23', rollNo: 23, nameGu: 'રાવલ દર્શિલ કેતનભાઈ', nameEn: 'Darshil K. Raval', grNo: '4843', gender: 'male', avatarSeed: 23, parentPhone: '9825012367' },
  { id: 'std-24', rollNo: 24, nameGu: 'પટેલ શ્રેયા નીતિનભાઈ', nameEn: 'Shreya N. Patel', grNo: '4844', gender: 'female', avatarSeed: 24, parentPhone: '9825012368' },
  { id: 'std-25', rollNo: 25, nameGu: 'પંચાલ દેવ કિશોરભાઈ', nameEn: 'Dev K. Panchal', grNo: '4845', gender: 'male', avatarSeed: 25, parentPhone: '9825012369' },
  { id: 'std-26', rollNo: 26, nameGu: 'મિસ્ત્રી સાક્ષી જગદીશભાઈ', nameEn: 'Sakshi J. Mistry', grNo: '4846', gender: 'female', avatarSeed: 26, parentPhone: '9825012370' },
  { id: 'std-27', rollNo: 27, nameGu: 'ડાભી હર્ષ ભરતભાઈ', nameEn: 'Harsh B. Dabhi', grNo: '4847', gender: 'male', avatarSeed: 27, parentPhone: '9825012371' },
  { id: 'std-28', rollNo: 28, nameGu: 'શાહ નિસર્ગ ભૂપેન્દ્રભાઈ', nameEn: 'Nisarg B. Shah', grNo: '4848', gender: 'male', avatarSeed: 28, parentPhone: '9825012372' },
];

const STUDENTS_KEY = 'std8_hajri_students_v1';
const ATTENDANCE_KEY = 'std8_hajri_attendance_v1';
const CONFIG_KEY = 'std8_hajri_config_v1';
const SOUND_KEY = 'std8_hajri_sound_enabled';
const CLICK_MODE_KEY = 'std8_hajri_click_mode'; // 'toggle' | 'present_only'

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]) {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students', err);
  }
}

export function getStoredAttendance(): Record<string, DayAttendance> {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveDayAttendance(dayAttendance: DayAttendance) {
  try {
    const all = getStoredAttendance();
    const key = `${dayAttendance.date}_${dayAttendance.period}`;
    all[key] = dayAttendance;
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save attendance', err);
  }
}

export function getStoredConfig(): ClassConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(cfg: ClassConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save config', err);
  }
}

export function getSoundSetting(): boolean {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function setSoundSetting(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // Ignore
  }
}

export function getClickModeSetting(): 'toggle' | 'present_only' {
  try {
    const val = localStorage.getItem(CLICK_MODE_KEY);
    return val === 'present_only' ? 'present_only' : 'toggle';
  } catch {
    return 'toggle';
  }
}

export function setClickModeSetting(mode: 'toggle' | 'present_only') {
  try {
    localStorage.setItem(CLICK_MODE_KEY, mode);
  } catch {
    // Ignore
  }
}
