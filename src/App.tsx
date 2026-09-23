import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Share2,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  Users,
  Check,
  Smartphone,
} from 'lucide-react';
import {
  Student,
  DayAttendance,
  ClassConfig,
  AttendanceStatus,
  ViewMode,
} from './types/attendance';
import {
  getStoredStudents,
  saveStudents,
  getStoredAttendance,
  saveDayAttendance,
  getStoredConfig,
  saveConfig,
  getSoundSetting,
  setSoundSetting,
  getClickModeSetting,
  setClickModeSetting,
  INITIAL_STUDENTS,
} from './utils/storage';
import { playAttendanceSound } from './utils/audio';
import {
  toGuNum,
  formatGujaratiDate,
  exportAttendanceCSV,
} from './utils/gujarati';
import { TopNav } from './components/TopNav';
import { PhotoAttendanceCard } from './components/PhotoAttendanceCard';
import { CompactListView } from './components/CompactListView';
import { MonthlyPatrak } from './components/MonthlyPatrak';
import { PrintRegister } from './components/PrintRegister';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { StudentModal } from './components/StudentModal';
import { AbsenteeSummaryModal } from './components/AbsenteeSummaryModal';
import { ClassSettingsModal } from './components/ClassSettingsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [allAttendance, setAllAttendance] = useState<Record<string, DayAttendance>>(() =>
    getStoredAttendance()
  );
  const [config, setConfig] = useState<ClassConfig>(() => getStoredConfig());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getSoundSetting());
  const [clickMode, setClickMode] = useState<'toggle' | 'present_only'>(() =>
    getClickModeSetting()
  );

  const [currentView, setCurrentView] = useState<ViewMode>('photo-grid');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('full-day');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  // Modals state
  const [photoStudent, setPhotoStudent] = useState<Student | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAbsenteeModalOpen, setIsAbsenteeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Current Day Record Key
  const currentKey = `${selectedDate}_${selectedPeriod}`;
  const currentDayAttendance = allAttendance[currentKey];
  const currentRecords = useMemo(
    () => currentDayAttendance?.records || {},
    [currentDayAttendance]
  );

  // Sync state changes to storage
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      setSoundSetting(next);
      return next;
    });
  };

  const toggleClickMode = () => {
    setClickMode((prev) => {
      const next = prev === 'toggle' ? 'present_only' : 'toggle';
      setClickModeSetting(next);
      return next;
    });
  };

  // Helper to update attendance record for current day
  const updateRecords = useCallback(
    (newRecords: Record<string, AttendanceStatus>) => {
      const updatedDay: DayAttendance = {
        date: selectedDate,
        period: selectedPeriod,
        records: newRecords,
        timestamp: Date.now(),
      };
      setAllAttendance((prev) => {
        const next = { ...prev, [currentKey]: updatedDay };
        saveDayAttendance(updatedDay);
        return next;
      });
    },
    [currentKey, selectedDate, selectedPeriod]
  );

  // Primary Photo Click Handler
  const handleToggleStudentStatus = useCallback(
    (studentId: string) => {
      const currentStatus = currentRecords[studentId] || 'unmarked';
      let nextStatus: AttendanceStatus;

      if (clickMode === 'present_only') {
        // In "Present Only" rapid mode: click toggles between present and unmarked
        nextStatus = currentStatus === 'present' ? 'unmarked' : 'present';
      } else {
        // In "Cycle Toggle" mode: unmarked -> present -> absent -> leave -> unmarked
        if (currentStatus === 'unmarked') nextStatus = 'present';
        else if (currentStatus === 'present') nextStatus = 'absent';
        else if (currentStatus === 'absent') nextStatus = 'leave';
        else nextStatus = 'unmarked';
      }

      playAttendanceSound(
        nextStatus === 'unmarked' ? 'reset' : nextStatus,
        soundEnabled
      );

      const nextRecords = { ...currentRecords, [studentId]: nextStatus };
      updateRecords(nextRecords);
    },
    [clickMode, currentRecords, soundEnabled, updateRecords]
  );

  // Direct set status
  const handleSetStudentStatus = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      playAttendanceSound(status, soundEnabled);
      const nextRecords = { ...currentRecords, [studentId]: status };
      updateRecords(nextRecords);
    },
    [currentRecords, soundEnabled, updateRecords]
  );

  // Bulk Actions
  const handleMarkAll = (status: AttendanceStatus) => {
    playAttendanceSound(status, soundEnabled);
    const newRecords: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newRecords[s.id] = status;
    });
    updateRecords(newRecords);
  };

  const handleClearAll = () => {
    playAttendanceSound('reset', soundEnabled);
    updateRecords({});
  };

  // Change date (prev / next / today)
  const changeDateByDays = (delta: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + delta);
    const ny = dateObj.getFullYear();
    const nm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nd = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${ny}-${nm}-${nd}`);
  };

  // Stats calculation
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let unmarked = 0;

    students.forEach((s) => {
      const st = currentRecords[s.id];
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'leave') leave++;
      else unmarked++;
    });

    const total = students.length;
    const marked = present + absent + leave;
    const pct = marked > 0 ? ((present / total) * 100).toFixed(1) : '0';

    return { total, present, absent, leave, unmarked, pct };
  }, [students, currentRecords]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNameGu = s.nameGu.toLowerCase().includes(q);
        const matchesNameEn = s.nameEn.toLowerCase().includes(q);
        const matchesRoll = String(s.rollNo).includes(q) || toGuNum(s.rollNo).includes(q);
        const matchesGr = s.grNo.toLowerCase().includes(q);
        if (!matchesNameGu && !matchesNameEn && !matchesRoll && !matchesGr) {
          return false;
        }
      }

      // Gender filter
      if (genderFilter !== 'all' && s.gender !== genderFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const st = currentRecords[s.id] || 'unmarked';
        if (st !== statusFilter) return false;
      }

      return true;
    });
  }, [students, searchQuery, genderFilter, statusFilter, currentRecords]);

  // Student photo save handler
  const handleSaveStudentPhoto = (studentId: string, photoUrl?: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, photoUrl } : s))
    );
  };

  // Student create / edit handler
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === updatedStudent.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedStudent;
        return copy.sort((a, b) => a.rollNo - b.rollNo);
      }
      return [...prev, updatedStudent].sort((a, b) => a.rollNo - b.rollNo);
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleResetRoster = () => {
    setStudents(INITIAL_STUDENTS);
  };

  const handleUpdateMonthlyDay = (
    dateStr: string,
    studentId: string,
    newStatus: AttendanceStatus
  ) => {
    const key = `${dateStr}_full-day`;
    const existing = allAttendance[key] || {
      date: dateStr,
      period: 'full-day',
      records: {},
      timestamp: Date.now(),
    };
    const updatedRecords = { ...existing.records, [studentId]: newStatus };
    const updatedDay: DayAttendance = {
      ...existing,
      records: updatedRecords,
      timestamp: Date.now(),
    };
    setAllAttendance((prev) => {
      const next = { ...prev, [key]: updatedDay };
      saveDayAttendance(updatedDay);
      return next;
    });
  };

  const { fullGu } = formatGujaratiDate(selectedDate);
  const isToday = selectedDate === getTodayString();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <TopNav
        currentView={currentView}
        onSelectView={setCurrentView}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onAddStudent={() => {
          setEditingStudent(null);
          setIsStudentModalOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 flex-1 space-y-6">
        {/* If Print Sheet view is active, render print layout directly */}
        {currentView === 'print-sheet' ? (
          <PrintRegister
            students={students}
            dayAttendance={currentDayAttendance}
            config={config}
            dateStr={selectedDate}
            period={selectedPeriod}
            onBack={() => setCurrentView('photo-grid')}
          />
        ) : currentView === 'monthly-patrak' ? (
          <MonthlyPatrak
            students={students}
            allAttendance={allAttendance}
            config={config}
            onUpdateDayStatus={handleUpdateMonthlyDay}
          />
        ) : (
          /* Normal Daily Attendance Flow (Photo Grid or Compact List) */
          <>
            {/* Class Hero Header & Session Ribbon */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  ૮
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {config.schoolNameGu}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="શાળા/વર્ગ વિગત બદલો"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {config.standard} ({config.division})
                    </span>
                    <span>·</span>
                    <span>{config.teacherName}</span>
                    <span>·</span>
                    <span>વર્ષ: {config.academicYear}</span>
                  </div>
                </div>
              </div>

              {/* Date Selector with quick arrows */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => changeDateByDays(-1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                    title="ગઈકાલ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 px-3">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                      className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => changeDateByDays(1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                    title="આવતીકાલ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {!isToday && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(getTodayString())}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                  >
                    આજે (Today)
                  </button>
                )}

                {/* Session / Taas Selector */}
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                >
                  <option value="full-day">આખો દિવસ (દૈનિક)</option>
                  <option value="morning">સવાર સત્ર</option>
                  <option value="afternoon">બપોર સત્ર</option>
                  <option value="ganit">ગણિત તાસ</option>
                  <option value="vigyan">વિજ્ઞાન તાસ</option>
                  <option value="gujarati">ગુજરાતી તાસ</option>
                  <option value="english">અંગ્રેજી તાસ</option>
                  <option value="ss">સામાજિક વિજ્ઞાન</option>
                </select>
              </div>
            </div>

            {/* Live Stats Bar (Clean 60-30-10 palette) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">કુલ વિદ્યાર્થી</span>
                  <span className="text-xl font-black text-slate-900 tabular-nums">
                    {toGuNum(stats.total)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 block">હાજર (P)</span>
                  <span className="text-xl font-black text-emerald-700 tabular-nums">
                    {toGuNum(stats.present)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-rose-700 block">ગેરહાજર (A)</span>
                  <span className="text-xl font-black text-rose-700 tabular-nums">
                    {toGuNum(stats.absent)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-700 block">રજા (Leave)</span>
                  <span className="text-xl font-black text-amber-700 tabular-nums">
                    {toGuNum(stats.leave)}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-500">હાજરી ટકા</span>
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {toGuNum(stats.pct)}%
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Bulk Operations & Click Mode Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Left: Bulk Mark Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>બધા હાજર (Mark All Present)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>બધા ગેરહાજર</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ખાલી કરો (Clear)</span>
                </button>
              </div>

              {/* Center/Right: Click behavior toggle & absentee report */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Click Behavior Toggle */}
                <button
                  type="button"
                  onClick={toggleClickMode}
                  title="ફોટો પર ક્લિક કરવાથી શું થાય તે બદલો"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                    clickMode === 'toggle'
                      ? 'border-slate-200 bg-slate-50 text-slate-700'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {clickMode === 'toggle'
                      ? 'મોડ: ટૅપ સાઇકલ (P / A / L)'
                      : 'મોડ: વન-ટૅપ હાજર (Rapid P)'}
                  </span>
                </button>

                {/* Absentee Report / WhatsApp copy */}
                <button
                  type="button"
                  onClick={() => setIsAbsenteeModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>ગેરહાજર રિપોર્ટ ({toGuNum(stats.absent)})</span>
                </button>

                {/* CSV Download */}
                <button
                  type="button"
                  onClick={() =>
                    exportAttendanceCSV(config, selectedDate, students, currentRecords)
                  }
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  title="CSV ડાઉનલોડ કરો"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="નામ, રોલ નંબર અથવા GR નંબરથી શોધો..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  બધા ({toGuNum(students.length)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('present')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  હાજર ({toGuNum(stats.present)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('absent')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === 'absent'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ગેરહાજર ({toGuNum(stats.absent)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('leave')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === 'leave'
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  રજા ({toGuNum(stats.leave)})
                </button>
              </div>

              {/* Gender Segmented Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setGenderFilter('all')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    genderFilter === 'all'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  કુલ
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('male')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    genderFilter === 'male'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  કુમાર
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('female')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    genderFilter === 'female'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  કન્યા
                </button>
              </div>
            </div>

            {/* Instruction Callout for Photo-Click Attendance */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>ફોટો ક્લિક હાજરી:</strong> વિદ્યાર્થીના ફોટો પર ક્લિક કરવાથી હાજરી તરત જ માર્ક થઈ જશે! કેમેરા આઇકોનથી વિદ્યાર્થીનો અસલ ફોટો પણ લઈ શકાય છે.
                </span>
              </div>
              <span className="hidden md:inline font-bold tabular-nums">
                તારીખ: {fullGu}
              </span>
            </div>

            {/* Students Display Area */}
            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">કોઈ વિદ્યાર્થી મળ્યા નથી</h3>
                <p className="text-xs text-slate-500 mt-1">
                  શોધ શબ્દ અથવા ફિલ્ટર બદલીને ફરી પ્રયાસ કરો.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setGenderFilter('all');
                  }}
                  className="mt-3 px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  બધા ફિલ્ટર હટાવો
                </button>
              </div>
            ) : currentView === 'photo-grid' ? (
              /* Photo Grid: 2 cols on mobile, 3-4 cols on tablet, 5-6 cols on desktop */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredStudents.map((student) => (
                  <PhotoAttendanceCard
                    key={student.id}
                    student={student}
                    status={currentRecords[student.id] || 'unmarked'}
                    onToggleStatus={handleToggleStudentStatus}
                    onSetStatus={handleSetStudentStatus}
                    onOpenPhotoCapture={(s) => {
                      setPhotoStudent(s);
                      setIsPhotoModalOpen(true);
                    }}
                    onEditStudent={(s) => {
                      setEditingStudent(s);
                      setIsStudentModalOpen(true);
                    }}
                    onDeleteStudent={(s) => {
                      setDeletingStudent(s);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Compact List View */
              <CompactListView
                students={filteredStudents}
                records={currentRecords}
                onSetStatus={handleSetStudentStatus}
                onOpenPhotoCapture={(s) => {
                  setPhotoStudent(s);
                  setIsPhotoModalOpen(true);
                }}
                onEditStudent={(s) => {
                  setEditingStudent(s);
                  setIsStudentModalOpen(true);
                }}
                onDeleteStudent={(s) => {
                  setDeletingStudent(s);
                  setIsDeleteModalOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <CameraCaptureModal
        student={photoStudent}
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoStudent(null);
        }}
        onSavePhoto={handleSaveStudentPhoto}
      />

      <StudentModal
        isOpen={isStudentModalOpen}
        student={editingStudent}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        onDelete={handleDeleteStudent}
        nextRollNo={
          students.length > 0 ? Math.max(...students.map((s) => s.rollNo)) + 1 : 1
        }
      />

      <AbsenteeSummaryModal
        isOpen={isAbsenteeModalOpen}
        onClose={() => setIsAbsenteeModalOpen(false)}
        students={students}
        dayAttendance={currentDayAttendance}
        config={config}
        dateStr={selectedDate}
        period={selectedPeriod}
      />

      <ClassSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onResetStudents={handleResetRoster}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={deletingStudent}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingStudent(null);
        }}
        onConfirm={(studentId) => {
          handleDeleteStudent(studentId);
        }}
      />
    </div>
  );
}
