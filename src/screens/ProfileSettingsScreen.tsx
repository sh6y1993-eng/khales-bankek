import React, { useEffect, useState } from 'react';
import {
  Volume2,
  Vibrate,
  Type,
  Clock,
  LogOut,
  Trash2,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  X,
  Trophy,
  Award,
  Settings,
  Swords,
} from 'lucide-react';
import { AppSettings, ScreenId, UserProfile } from '../types/prototype';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { BottomTabBar } from '../components/ui/BottomTabBar';

interface ProfileSettingsScreenProps {
  profile: UserProfile;
  settings: AppSettings;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateName: (newName: string) => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onOpenRules: () => void;
  onRequestLogout: () => void;
  onRequestDeleteAccount: () => void;
}

type ProfileSheet = null | 'edit-name' | 'achievements' | 'stats' | 'history' | 'appearance';

const TrophyMiniSvg: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="profTrophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="45%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <path
      d="M12 12H7.5c-1.5 0-2.5 1.3-2.5 3.2 0 4.2 2.8 8 7.8 9"
      fill="none"
      stroke="url(#profTrophyGold)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M36 12h4.5c1.5 0 2.5 1.3 2.5 3.2 0 4.2-2.8 8-7.8 9"
      fill="none"
      stroke="url(#profTrophyGold)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M12 8h24v11c0 7.2-5.4 12.5-12 12.5S12 26.2 12 19V8z"
      fill="url(#profTrophyGold)"
      stroke="#92400E"
      strokeWidth="1"
    />
    <rect x="10.5" y="6" width="27" height="3.5" rx="1.75" fill="#FEF08A" stroke="#D97706" strokeWidth="0.8" />
    <rect x="21.5" y="31" width="5" height="7" fill="url(#profTrophyGold)" />
    <rect x="14" y="38" width="20" height="4.5" rx="2" fill="#B45309" stroke="#FEF08A" strokeWidth="0.6" />
  </svg>
);

const GamepadMiniSvg: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="profPadWhite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    <path
      d="M13 15h22c4.5 0 8 3.8 8.6 9.5l1 7.2c.4 3-2 5.3-4.8 4.3l-5.6-3.2H13.8l-5.6 3.2C5.4 37 3 34.7 3.4 31.7l1-7.2C5 18.8 8.5 15 13 15z"
      fill="url(#profPadWhite)"
      stroke="#64748B"
      strokeWidth="1"
    />
    <path d="M14 20.5v7M10.5 24h7" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="32.5" cy="21.5" r="1.7" fill="#0F172A" />
    <circle cx="36" cy="24.5" r="1.7" fill="#0F172A" />
    <circle cx="29" cy="24.5" r="1.7" fill="#0F172A" />
    <circle cx="32.5" cy="27.5" r="1.7" fill="#0F172A" />
  </svg>
);

const WinRateBarsSvg: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="greenBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A3E635" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <rect x="8" y="25" width="8" height="15" rx="2.5" fill="url(#greenBarGrad)" stroke="#14532D" strokeWidth="0.8" />
    <rect x="20" y="17" width="8" height="23" rx="2.5" fill="url(#greenBarGrad)" stroke="#14532D" strokeWidth="0.8" />
    <rect x="32" y="9" width="8" height="31" rx="2.5" fill="url(#greenBarGrad)" stroke="#14532D" strokeWidth="0.8" />
  </svg>
);

const GoldMedalSvg: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="medalGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <rect x="11" y="4" width="18" height="7" rx="2" fill="url(#medalGold)" stroke="#92400E" strokeWidth="0.8" />
    <path d="M15 11h10l-2 5h-6l-2-5z" fill="#D97706" />
    <circle cx="20" cy="25.5" r="10.5" fill="url(#medalGold)" stroke="#92400E" strokeWidth="1" />
    <circle cx="20" cy="25.5" r="7.5" fill="#F59E0B" opacity="0.55" />
    <path
      d="M20 20.5l1.55 3.15 3.45.5-2.5 2.43.59 3.44L20 28.4l-3.09 1.62.59-3.44-2.5-2.43 3.45-.5L20 20.5z"
      fill="#FEF9C3"
    />
  </svg>
);

const StatsBarsWhiteSvg: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect x="7" y="21" width="5.5" height="12" rx="1.8" fill="#FFFFFF" />
    <rect x="15" y="10" width="5.5" height="23" rx="1.8" fill="#FFFFFF" />
    <rect x="23" y="16" width="5.5" height="17" rx="1.8" fill="#FFFFFF" />
    <rect x="31" y="24" width="4.5" height="9" rx="1.6" fill="#E2E8F0" />
  </svg>
);

const HistoryClockSvg: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path
      d="M20 8a12 12 0 1 1-10.7 6.6"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path d="M8.5 8.5v6.5h6.5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 13.5v7l4.5 3" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AppearanceJerseySvg: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path
      d="M14 8c1.5 2 3.5 3 6 3s4.5-1 6-3l6.5 4.2-3 6.2-3.5-1.5V32H14V16.9l-3.5 1.5-3-6.2L14 8z"
      fill="#FFFFFF"
      stroke="#CBD5E1"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d="M17.5 16.5l2.5 2.5 2.5-2.5" fill="none" stroke="#083344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  profile,
  settings,
  onBack,
  onNavigate,
  onUpdateName,
  onUpdateSettings,
  onOpenRules,
  onRequestLogout,
  onRequestDeleteAccount,
}) => {
  const [editingName, setEditingName] = useState(profile.name);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeSheet, setActiveSheet] = useState<ProfileSheet>(null);

  useEffect(() => {
    setEditingName(profile.name);
  }, [profile.name]);

  const playerLevel = profile.level;
  const totalWins = 83 + profile.demoWins;
  const totalMatches = 20 + profile.demoMatchesPlayed;
  const winRate = Math.min(96, Math.max(55, Math.round((totalWins / Math.max(1, totalMatches + 86)) * 100) + 1));
  const xpValue = profile.xp;
  const maxXp = profile.maxXp || 5000;
  const xpPercent = Math.min(100, Math.max(0, Math.round((xpValue / maxXp) * 100)));

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim().length >= 2) {
      onUpdateName(editingName.trim());
      setSavedNotice(true);
      setTimeout(() => {
        setSavedNotice(false);
        setActiveSheet(null);
      }, 900);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[radial-gradient(ellipse_at_top,#063D50_0%,#03222E_50%,#011118_100%)] select-none overflow-hidden">
      {/* Coastal Skyline Footer Atmosphere (Matching Reference Bottom Backdrop) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[56px] h-[128px] z-0 overflow-hidden opacity-75">
        <img
          src={DESIGN_ASSETS.splashBackdrop}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#021C27] via-[#021C27]/35 to-[#011118]/75" />
      </div>

      {/* Main Scrollable Profile Stage */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto iphone-scroll px-4 pt-2 pb-2 flex flex-col justify-between gap-2">
        {/* 1. TOP TITLE BAR */}
        <header className="shrink-0 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="رجوع"
            className="w-8 h-8 rounded-full bg-[#063242]/80 border border-[#38BDF8]/40 text-white flex items-center justify-center hover:bg-[#0B475C] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <h1 className="font-display text-[20px] font-black text-white tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.65)]">
            ملفي الشخصي
          </h1>

          <button
            type="button"
            onClick={() => setActiveSheet('appearance')}
            aria-label="الإعدادات"
            className="w-8 h-8 rounded-full bg-[#063242]/80 border border-[#38BDF8]/40 text-[#E2E8F0] flex items-center justify-center hover:bg-[#0B475C] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </header>

        {/* 2. AVATAR + EDIT BUTTON + NAME + LEVEL + XP BAR */}
        <section aria-label="هوية اللاعب" className="shrink-0 flex flex-col items-center text-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-full p-[2.5px] bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#B45309] shadow-[0_0_22px_rgba(250,204,21,0.32),0_8px_18px_rgba(0,0,0,0.55)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#052936]">
                <AssetImage
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover scale-[1.15]"
                  fallbackLabel={profile.name}
                />
              </div>
            </div>

            {/* Floating Edit Pencil Circle */}
            <button
              type="button"
              onClick={() => setActiveSheet('edit-name')}
              aria-label="تعديل الاسم"
              className="absolute -right-11 bottom-0.5 w-[36px] h-[36px] rounded-full bg-gradient-to-b from-[#137C96] to-[#063B4B] border-[1.5px] border-[#67E8F9]/75 text-white flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:brightness-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="mt-1.5 font-display text-[19px] font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] max-w-[260px] truncate">
            {profile.name}
          </h2>
          <p className="font-display text-[13px] font-extrabold text-[#E2E8F0] tabular-nums">
            المستوى {playerLevel}
          </p>

          {/* Golden XP Progress Bar */}
          <div className="w-full max-w-[290px] mt-1.5 space-y-1">
            <div
              dir="ltr"
              className="w-full h-[13px] rounded-full bg-[#02151D] border-[1.2px] border-[#38BDF8]/55 p-[1.5px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)]"
              role="progressbar"
              aria-label="تقدم الخبرة"
              aria-valuenow={xpPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                style={{ width: `${xpPercent}%` }}
                className="h-full rounded-full bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] shadow-[0_0_12px_rgba(250,204,21,0.5)] relative overflow-hidden transition-[width] duration-300"
              >
                <div className="h-[3px] mx-1 mt-[1px] rounded-full bg-white/55" />
              </div>
            </div>
            <p
              dir="ltr"
              className="font-mono text-[12px] font-extrabold text-white tabular-nums tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {xpValue.toLocaleString('en-US')} / 5,000
            </p>
          </div>
        </section>

        {/* 3. THREE KPI STAT CARDS (LTR ORDER MATCHING REFERENCE: فوز / لعب / معدل الفوز) */}
        <section aria-label="ملخص الأداء" dir="ltr" className="shrink-0 grid grid-cols-3 gap-2">
          {/* Left: فوز */}
          <button
            type="button"
            onClick={() => setActiveSheet('stats')}
            className="rounded-[16px] py-2 px-1.5 bg-gradient-to-b from-[#09475A]/95 via-[#052E3C]/95 to-[#021B24]/95 border-[1.5px] border-[#38BDF8]/55 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.4)] flex flex-col items-center justify-center gap-0.5 hover:brightness-110 active:scale-[0.97] transition-all"
          >
            <TrophyMiniSvg className="w-[30px] h-[30px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]" />
            <span className="font-mono text-[17px] font-black text-white leading-tight tabular-nums">
              {totalWins}
            </span>
            <span className="font-display text-[11px] font-bold text-[#CBD5E1] whitespace-nowrap">
              فوز
            </span>
          </button>

          {/* Center: لعب */}
          <button
            type="button"
            onClick={() => setActiveSheet('history')}
            className="rounded-[16px] py-2 px-1.5 bg-gradient-to-b from-[#09475A]/95 via-[#052E3C]/95 to-[#021B24]/95 border-[1.5px] border-[#38BDF8]/55 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.4)] flex flex-col items-center justify-center gap-0.5 hover:brightness-110 active:scale-[0.97] transition-all"
          >
            <GamepadMiniSvg className="w-[30px] h-[30px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]" />
            <span className="font-mono text-[17px] font-black text-white leading-tight tabular-nums">
              {totalMatches}
            </span>
            <span className="font-display text-[11px] font-bold text-[#CBD5E1] whitespace-nowrap">
              لعب
            </span>
          </button>

          {/* Right: معدل الفوز */}
          <button
            type="button"
            onClick={() => setActiveSheet('stats')}
            className="rounded-[16px] py-2 px-1.5 bg-gradient-to-b from-[#09475A]/95 via-[#052E3C]/95 to-[#021B24]/95 border-[1.5px] border-[#38BDF8]/55 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.4)] flex flex-col items-center justify-center gap-0.5 hover:brightness-110 active:scale-[0.97] transition-all"
          >
            <WinRateBarsSvg className="w-[30px] h-[30px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]" />
            <span className="font-mono text-[17px] font-black text-white leading-tight tabular-nums">
              {winRate}%
            </span>
            <span className="font-display text-[11px] font-bold text-[#CBD5E1] whitespace-nowrap">
              معدل الفوز
            </span>
          </button>
        </section>

        {/* 4. FOUR PILL NAVIGATION ROWS */}
        <section aria-label="أقسام الملف الشخصي" className="shrink-0 space-y-2 pb-1">
          {/* إنجازاتي */}
          <button
            type="button"
            onClick={() => setActiveSheet('achievements')}
            className="w-full min-h-[46px] px-4 rounded-full bg-gradient-to-b from-[#073A4A]/92 to-[#031F29]/95 border-[1.5px] border-[#38BDF8]/60 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.35)] flex items-center justify-between hover:brightness-110 active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="flex items-center gap-3">
              <GoldMedalSvg className="w-6 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
              <span className="font-display text-[15px] font-extrabold text-white">إنجازاتي</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/90 shrink-0" />
          </button>

          {/* إحصائياتي */}
          <button
            type="button"
            onClick={() => setActiveSheet('stats')}
            className="w-full min-h-[46px] px-4 rounded-full bg-gradient-to-b from-[#073A4A]/92 to-[#031F29]/95 border-[1.5px] border-[#38BDF8]/60 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.35)] flex items-center justify-between hover:brightness-110 active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="flex items-center gap-3">
              <StatsBarsWhiteSvg className="w-6 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
              <span className="font-display text-[15px] font-extrabold text-white">إحصائياتي</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/90 shrink-0" />
          </button>

          {/* سجل المباريات */}
          <button
            type="button"
            onClick={() => setActiveSheet('history')}
            className="w-full min-h-[46px] px-4 rounded-full bg-gradient-to-b from-[#073A4A]/92 to-[#031F29]/95 border-[1.5px] border-[#38BDF8]/60 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.35)] flex items-center justify-between hover:brightness-110 active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="flex items-center gap-3">
              <HistoryClockSvg className="w-6 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
              <span className="font-display text-[15px] font-extrabold text-white">سجل المباريات</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/90 shrink-0" />
          </button>

          {/* مظهر الحساب */}
          <button
            type="button"
            onClick={() => setActiveSheet('appearance')}
            className="w-full min-h-[46px] px-4 rounded-full bg-gradient-to-b from-[#073A4A]/92 to-[#031F29]/95 border-[1.5px] border-[#38BDF8]/60 shadow-[0_8px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(186,230,253,0.35)] flex items-center justify-between hover:brightness-110 active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="flex items-center gap-3">
              <AppearanceJerseySvg className="w-6 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
              <span className="font-display text-[15px] font-extrabold text-white">مظهر الحساب</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/90 shrink-0" />
          </button>
        </section>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="profile" onNavigate={onNavigate} />

      {/* INTERACTIVE PROFILE SHEETS */}
      {activeSheet && (
        <div
          className="absolute inset-0 z-40 flex items-end bg-black/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveSheet(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[80%] rounded-t-3xl bg-[#072530] border-t border-[#22D3EE]/40 p-5 space-y-4 shadow-2xl animate-sheet-up overflow-y-auto iphone-scroll"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-display text-base font-extrabold text-white">
                {activeSheet === 'edit-name'
                  ? 'تعديل اسم اللاعب'
                  : activeSheet === 'achievements'
                  ? 'إنجازاتي'
                  : activeSheet === 'stats'
                  ? 'إحصائياتي'
                  : activeSheet === 'history'
                  ? 'سجل المباريات'
                  : 'مظهر الحساب والإعدادات'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                aria-label="إغلاق"
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-[#CBD5E1] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeSheet === 'edit-name' && (
              <form onSubmit={handleSaveName} className="space-y-3">
                <p className="text-xs text-[#B5C7C1]">
                  {profile.isGuest ? 'حساب ضيف تجريبي' : profile.handle} · اختر الاسم الظاهر على الطاولة
                </p>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  aria-label="اسم اللاعب"
                  maxLength={24}
                  className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#041820] border border-[#38BDF8]/40 text-sm text-white focus:outline-none focus:border-[#FACC15]"
                />
                <button
                  type="submit"
                  className="w-full min-h-[46px] rounded-xl bg-[#FACC15] text-[#061814] text-sm font-black flex items-center justify-center gap-1.5"
                >
                  {savedNotice ? <Check className="w-4 h-4" /> : null}
                  <span>{savedNotice ? 'تم حفظ الاسم' : 'حفظ التغييرات'}</span>
                </button>
              </form>
            )}

            {activeSheet === 'achievements' && (
              <div className="space-y-2.5">
                {[
                  { title: 'قاهر البنك', desc: 'أفرغ بطاقات بنكك في أقل من 8 جولات', done: true },
                  { title: 'مهندس الأبواب', desc: 'رتّب 25 ورقة متتالية في الأبواب الخمسة', done: true },
                  { title: 'ملك الموسم الأول', desc: 'اجمع 100 انتصار في الموسم الأول', done: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Award className={`w-5 h-5 shrink-0 ${item.done ? 'text-[#FACC15]' : 'text-[#64748B]'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <p className="text-[11px] text-[#94A3B8]">{item.desc}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold shrink-0 ${
                        item.done ? 'text-[#34D399]' : 'text-[#94A3B8]'
                      }`}
                    >
                      {item.done ? 'مكتمل' : 'قيد التقدم'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeSheet === 'stats' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'إجمالي الانتصارات', value: `${totalWins}` },
                  { label: 'معدل الفوز', value: `${winRate}%` },
                  { label: 'المباريات الأخيرة', value: `${totalMatches}` },
                  { label: 'أطول سلسلة فوز', value: '7 جولات' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#041820] border border-white/10 p-3 text-center space-y-1"
                  >
                    <p className="font-mono text-lg font-black text-[#FACC15] tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-[#CBD5E1] font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSheet === 'history' && (
              <div className="space-y-2.5">
                {[
                  { vs: 'ضد الكمبيوتر · محترف', result: 'فوز', score: 'تفريغ البنك (0)' },
                  { vs: 'غرفة KH-740 · مجلس خلّص بنكك', result: 'فوز', score: 'تفريغ البنك (0)' },
                  { vs: 'ضد الكمبيوتر · متمرس', result: 'خسارة', score: 'بقيت بطاقتان' },
                ].map((match, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Swords className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{match.vs}</p>
                        <p className="text-[11px] text-[#94A3B8]">{match.score}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-extrabold shrink-0 ${
                        match.result === 'فوز' ? 'text-[#34D399]' : 'text-[#F87171]'
                      }`}
                    >
                      {match.result}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeSheet === 'appearance' && (
              <div className="space-y-4">
                {/* Quick Name Edit */}
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    aria-label="تعديل اسم اللاعب"
                    maxLength={24}
                    className="flex-1 min-h-[42px] px-3 rounded-xl bg-[#041820] border border-[#38BDF8]/35 text-xs text-white focus:outline-none focus:border-[#FACC15]"
                  />
                  <button
                    type="submit"
                    className="min-h-[42px] px-3.5 rounded-xl bg-[#FACC15] text-[#061814] text-xs font-extrabold flex items-center gap-1 whitespace-nowrap"
                  >
                    {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{savedNotice ? 'تم الحفظ' : 'تحديث'}</span>
                  </button>
                </form>

                {/* Board Style Toggle */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#CBD5E1]">نمط طاولة اللعب</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ boardStyle: 'table3d' })}
                      className={`min-h-[42px] rounded-xl border text-xs font-bold transition-colors ${
                        settings.boardStyle === 'table3d'
                          ? 'bg-[#FACC15] border-[#FACC15] text-[#061814]'
                          : 'bg-[#041820] border-white/15 text-white'
                      }`}
                    >
                      طاولة 3D (جديد)
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ boardStyle: 'classic' })}
                      className={`min-h-[42px] rounded-xl border text-xs font-bold transition-colors ${
                        settings.boardStyle === 'classic'
                          ? 'bg-[#FACC15] border-[#FACC15] text-[#061814]'
                          : 'bg-[#041820] border-white/15 text-white'
                      }`}
                    >
                      التصميم السابق
                    </button>
                  </div>
                </div>

                {/* Sensory & Accessibility Toggles */}
                <div className="rounded-2xl bg-[#041820] border border-white/10 divide-y divide-white/10">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                    className="w-full min-h-[50px] px-4 flex items-center justify-between text-right"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-white">
                      <Volume2 className="w-4 h-4 text-[#FACC15]" />
                      <span>المؤثرات الصوتية</span>
                    </span>
                    <span
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                        settings.soundEnabled ? 'bg-[#FACC15] justify-start' : 'bg-[#0B2B36] justify-end'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                    className="w-full min-h-[50px] px-4 flex items-center justify-between text-right"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-white">
                      <Vibrate className="w-4 h-4 text-[#FACC15]" />
                      <span>الاهتزاز اللمسي</span>
                    </span>
                    <span
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                        settings.hapticsEnabled ? 'bg-[#FACC15] justify-start' : 'bg-[#0B2B36] justify-end'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ largeCardText: !settings.largeCardText })}
                    className="w-full min-h-[50px] px-4 flex items-center justify-between text-right"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-white">
                      <Type className="w-4 h-4 text-[#FACC15]" />
                      <span>تكبير أرقام البطاقات</span>
                    </span>
                    <span
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                        settings.largeCardText ? 'bg-[#FACC15] justify-start' : 'bg-[#0B2B36] justify-end'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow" />
                    </span>
                  </button>
                </div>

                {/* Preferred Turn Timer */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#CBD5E1]">
                    <Clock className="w-4 h-4 text-[#FACC15]" />
                    <span>مدة الدور الافتراضية</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 30, 45].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => onUpdateSettings({ preferredTurnSeconds: sec })}
                        className={`min-h-[40px] rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                          settings.preferredTurnSeconds === sec
                            ? 'bg-[#FACC15] border-[#FACC15] text-[#061814]'
                            : 'bg-[#041820] border-white/15 text-white'
                        }`}
                      >
                        {sec} ثانية
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account & Rules Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSheet(null);
                      onOpenRules();
                    }}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-[#041820] border border-white/15 text-xs font-semibold text-white flex items-center gap-2.5"
                  >
                    <BookOpen className="w-4 h-4 text-[#FACC15]" />
                    <span>دليل قواعد اللعب والنموذج الأولي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSheet(null);
                      onRequestLogout();
                    }}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-[#041820] border border-white/15 text-xs font-semibold text-white flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4 text-[#FACC15]" />
                    <span>تسجيل الخروج</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSheet(null);
                      onRequestDeleteAccount();
                    }}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-[#C8322B]/15 border border-[#C8322B]/40 text-xs font-bold text-[#F87171] flex items-center gap-2.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف الحساب (معاينة متطلب App Store)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
