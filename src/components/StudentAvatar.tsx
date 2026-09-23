import React from 'react';
import { Student } from '../types/attendance';

interface StudentAvatarProps {
  student: Student;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BG_PALETTES = [
  { bg: '#E0F2FE', text: '#0369A1', collar: '#0284C7', tie: '#0369A1' }, // Azure
  { bg: '#FEF3C7', text: '#B45309', collar: '#F59E0B', tie: '#B45309' }, // Amber
  { bg: '#DCFCE7', text: '#15803D', collar: '#10B981', tie: '#047857' }, // Emerald
  { bg: '#F3E8FF', text: '#7E22CE', collar: '#A855F7', tie: '#6B21A8' }, // Purple
  { bg: '#FFE4E6', text: '#BE123C', collar: '#F43F5E', tie: '#9F1239' }, // Rose
  { bg: '#E2E8F0', text: '#334155', collar: '#64748B', tie: '#1E293B' }, // Slate
  { bg: '#CCFBF1', text: '#0F766E', collar: '#14B8A6', tie: '#115E59' }, // Teal
];

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'lg',
  className = '',
}) => {
  const palette = BG_PALETTES[student.avatarSeed % BG_PALETTES.length];
  const isFemale = student.gender === 'female';
  const hasGlasses = student.avatarSeed % 3 === 0;

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 md:w-28 md:h-28 text-base',
    xl: 'w-32 h-32 md:w-36 md:h-36 text-lg',
  }[size];

  if (student.photoUrl) {
    return (
      <div className={`relative overflow-hidden rounded-2xl shrink-0 ${sizeClasses} ${className} bg-slate-100 ring-2 ring-white/80 shadow-xs`}>
        <img
          src={student.photoUrl}
          alt={student.nameGu}
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback if custom URL fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Authentic stylized vector student portrait (Uniformed Indian School Student)
  return (
    <div
      className={`relative overflow-hidden rounded-2xl shrink-0 flex items-center justify-center select-none shadow-xs ring-2 ring-white/90 ${sizeClasses} ${className}`}
      style={{ backgroundColor: palette.bg }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform transition-transform duration-200 group-hover:scale-105"
      >
        {/* Uniform Shirt Shoulders */}
        <path
          d="M16 100 C18 78, 30 72, 50 72 C70 72, 82 78, 84 100 Z"
          fill="#FFFFFF"
        />
        {/* School Uniform Collar */}
        <path
          d="M32 72 L44 86 L50 75 L56 86 L68 72 Z"
          fill={palette.collar}
        />
        {/* School Tie / Placket */}
        <polygon points="47,75 53,75 51,96 49,96" fill={palette.tie} />

        {/* Neck */}
        <rect x="44" y="58" width="12" height="15" rx="3" fill="#F1C27D" />

        {/* Head / Face */}
        <ellipse cx="50" cy="46" rx="19" ry="21" fill="#F6D7B0" />

        {/* Ears */}
        <ellipse cx="30" cy="48" rx="3.5" ry="5.5" fill="#E8BD90" />
        <ellipse cx="70" cy="48" rx="3.5" ry="5.5" fill="#E8BD90" />

        {/* Eyes & Eyebrows */}
        <path d="M41 40 Q44 38 47 40" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M53 40 Q56 38 59 40" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="45" r="2.2" fill="#1F2937" />
        <circle cx="56" cy="45" r="2.2" fill="#1F2937" />
        <circle cx="44.8" cy="44.2" r="0.7" fill="#FFFFFF" />
        <circle cx="56.8" cy="44.2" r="0.7" fill="#FFFFFF" />

        {/* Nose */}
        <path d="M50 46 L49 51 L51 51" stroke="#D19C6E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Smile */}
        <path d="M44 54 Q50 59 56 54" stroke="#831843" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Optional Spectacles (Glasses) */}
        {hasGlasses && (
          <g stroke="#334155" strokeWidth="1.2" fill="none">
            <rect x="37" y="40" width="11" height="9" rx="3" />
            <rect x="52" y="40" width="11" height="9" rx="3" />
            <line x1="48" y1="44" x2="52" y2="44" />
            <line x1="37" y1="44" x2="31" y2="46" />
            <line x1="63" y1="44" x2="69" y2="46" />
          </g>
        )}

        {/* Hair Styles */}
        {isFemale ? (
          <g>
            {/* Girl Hair with braids / ribbons */}
            <path
              d="M29 48 C29 30, 36 21, 50 21 C64 21, 71 30, 71 48 C66 42, 60 41, 50 41 C40 41, 34 42, 29 48 Z"
              fill="#27272A"
            />
            {/* Side Braids / Ponytails */}
            <path d="M30 46 C24 55, 23 70, 26 78 C28 78, 30 76, 29 70 C28 62, 31 52, 32 46 Z" fill="#27272A" />
            <path d="M70 46 C76 55, 77 70, 74 78 C72 78, 70 76, 71 70 C72 62, 69 52, 68 46 Z" fill="#27272A" />
            {/* Red Ribbons */}
            <circle cx="26" cy="74" r="3" fill="#E11D48" />
            <circle cx="74" cy="74" r="3" fill="#E11D48" />
          </g>
        ) : (
          <g>
            {/* Boy Neat Side-Part Hair */}
            <path
              d="M30 44 C29 30, 37 21, 50 21 C63 21, 71 28, 71 42 C67 36, 58 35, 48 35 C38 35, 33 38, 30 44 Z"
              fill="#18181B"
            />
          </g>
        )}

        {/* School ID badge on chest */}
        <rect x="22" y="86" width="9" height="7" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="23.5" y="88" width="6" height="2" fill="#0284C7" />
      </svg>
    </div>
  );
};
