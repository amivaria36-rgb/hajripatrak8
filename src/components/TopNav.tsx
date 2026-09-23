import React from 'react';
import { Volume2, VolumeX, UserPlus, Grid, List, Calendar, Printer } from 'lucide-react';
import { ViewMode } from '../types/attendance';

interface TopNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAddStudent: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onSelectView,
  soundEnabled,
  onToggleSound,
  onAddStudent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectView('photo-grid');
            }}
            className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
              ૮
            </span>
            <span className="hidden sm:inline">ધોરણ ૮ ફોટો હાજરી પત્રક</span>
            <span className="sm:hidden">ધોરણ ૮ હાજરી</span>
          </a>
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectView('photo-grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'photo-grid'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>ફોટો ગ્રીડ</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('compact-list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'compact-list'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>યાદી મોડ</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('monthly-patrak')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'monthly-patrak'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>માસિક પત્રક</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('print-sheet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'print-sheet'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પ્રિન્ટ શીટ</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'અવાજ બંધ કરો' : 'અવાજ ચાલુ કરો'}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onAddStudent}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">નવો વિદ્યાર્થી ઉમેરો</span>
            <span className="md:hidden">ઉમેરો</span>
          </button>
        </div>
      </div>
    </header>
  );
};
