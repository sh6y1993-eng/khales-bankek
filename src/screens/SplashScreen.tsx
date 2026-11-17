import React, { useEffect, useState } from 'react';
import { LogIn, UserCheck } from 'lucide-react';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';

interface SplashScreenProps {
  onContinue: () => void;
  onSkipToHome: () => void;
}

interface FanAceCardProps {
  suit: '♥' | '♦' | '♣';
  isRed: boolean;
  className?: string;
}

const FanAceCard: React.FC<FanAceCardProps> = ({ suit, isRed, className = '' }) => {
  const colorCls = isRed ? 'text-[#C8322B]' : 'text-[#17211E]';
  return (
    <div
      className={`rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#F4EFE3] border border-[#D9C79E] flex flex-col justify-between p-1.5 relative select-none ${colorCls} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-[8px] border border-[#D4A243]/30"
      />
      {/* Top Corner Index */}
      <div className="relative z-10 leading-none text-left">
        <span className="block font-display font-black text-[12px] leading-none">A</span>
        <span className="block text-[10px] leading-none mt-0.5">{suit}</span>
      </div>

      {/* Center Suit Pip */}
      <div className="relative z-10 flex items-center justify-center leading-none">
        <span className="text-[24px] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
          {suit}
        </span>
      </div>

      {/* Mirrored Bottom Corner Index */}
      <div className="relative z-10 leading-none text-left rotate-180">
        <span className="block font-display font-black text-[12px] leading-none">A</span>
        <span className="block text-[10px] leading-none mt-0.5">{suit}</span>
      </div>
    </div>
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinue,
  onSkipToHome,
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingLabel, setLoadingLabel] = useState('جاري تحميل الأصول والبطاقات...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    const assetUrls = Object.values(DESIGN_ASSETS);
    const totalTasks = assetUrls.length + 1; // all images + document fonts
    let completedTasks = 0;
    let targetProgress = 0;
    let currentDisplay = 0;

    const updateTarget = (nextLabel?: string) => {
      completedTasks = Math.min(totalTasks, completedTasks + 1);
      targetProgress = Math.round((completedTasks / totalTasks) * 100);
      if (nextLabel && !cancelled) {
        setLoadingLabel(nextLabel);
      }
    };

    // 1. Real preload of all game image assets
    assetUrls.forEach((src, index) => {
      const img = new Image();
      const finishImg = () => {
        if (cancelled) return;
        const stepLabel =
          index === assetUrls.length - 1
            ? 'جاري تجهيز الطاولة والأوراق...'
            : 'جاري تحميل الأصول والبطاقات...';
        updateTarget(stepLabel);
      };
      img.onload = finishImg;
      img.onerror = finishImg;
      img.src = src;
    });

    // 2. Real font readiness check
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (!cancelled) updateTarget('جاري تهيئة الخطوط العربية...');
        })
        .catch(() => {
          if (!cancelled) updateTarget();
        });
    } else {
      updateTarget();
    }

    // Safety fallback if any external font stalls on slow network
    const safetyTimer = window.setTimeout(() => {
      if (!cancelled) {
        targetProgress = 100;
      }
    }, 2800);

    // Smoothly animate displayed percentage toward real loaded ratio
    const tick = () => {
      if (cancelled) return;
      if (currentDisplay < targetProgress) {
        const diff = targetProgress - currentDisplay;
        const step = Math.max(1.2, diff * 0.14);
        currentDisplay = Math.min(targetProgress, currentDisplay + step);
        const rounded = Math.round(currentDisplay);
        setProgress(rounded);
        if (rounded >= 100) {
          setLoadingLabel('تم تجهيز الطاولة بنجاح');
          setIsReady(true);
          return;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden select-none animate-fade-scale">
      {/* Full-bleed Kuwait coastal twilight artwork */}
      <div className="absolute inset-0 z-0">
        <AssetImage
          src={DESIGN_ASSETS.splashBackdrop}
          alt="خلفية شاشة تحميل خلّص بنكك"
          className="w-full h-full object-cover object-center"
          fallbackLabel="خلّص بنكك"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#03131A]/95 via-[#041B24]/75 to-transparent"
        />
      </div>

      {/* Top Spacer clearing Kuwait Flag & Palm Fronds */}
      <div className="relative z-10 h-12 shrink-0" />

      {/* Center Hero: 3 Real Fanned Ace Cards + Golden Crown + 3D "خلص بنكك" Emblem */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 -mt-6">
        <div
          aria-hidden="true"
          className="absolute w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.34)_0%,rgba(250,204,21,0)_68%)] pointer-events-none"
        />

        {/* Three Real Fanned Aces (A♥, A♦, A♣) */}
        <div
          aria-hidden="true"
          className="relative flex items-end justify-center h-[84px] w-[178px] -mb-4 z-10"
        >
          <FanAceCard
            suit="♥"
            isRed
            className="w-[54px] h-[76px] -rotate-[17deg] translate-x-2.5 translate-y-2 shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
          />
          <FanAceCard
            suit="♦"
            isRed
            className="w-[58px] h-[82px] -translate-y-1 z-10 shadow-[0_14px_26px_rgba(0,0,0,0.55)]"
          />
          <FanAceCard
            suit="♣"
            isRed={false}
            className="w-[54px] h-[76px] rotate-[17deg] -translate-x-2.5 translate-y-2 shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Golden Crown overlapping cards & title badge */}
        <div aria-hidden="true" className="relative z-30 -mb-3.5 drop-shadow-[0_6px_10px_rgba(0,0,0,0.55)]">
          <svg width="88" height="44" viewBox="0 0 88 44" fill="none">
            <defs>
              <linearGradient id="crownGold" x1="0" y1="0" x2="88" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <path
              d="M12 36L6 13L27 24L44 7L61 24L82 13L76 36H12Z"
              fill="url(#crownGold)"
              stroke="#78350F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <rect x="11" y="34" width="66" height="6" rx="3" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
            <circle cx="6" cy="11" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="1.8" />
            <circle cx="44" cy="5.5" r="4.5" fill="#FEF08A" stroke="#78350F" strokeWidth="1.8" />
            <circle cx="82" cy="11" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="1.8" />
          </svg>
        </div>

        {/* 3D Gold-rimmed Emblem Plaque: "خلص بنكك" */}
        <div className="relative z-20 rounded-[30px] bg-gradient-to-b from-[#0C2E39] to-[#061A22] border-[3px] border-[#F6C453] px-7 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.65),inset_0_2px_6px_rgba(255,255,255,0.14)]">
          <h1 className="font-display text-center leading-[1.06] tracking-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.75)]">
            <span className="block text-[36px] font-black text-white">خلص</span>
            <span className="block text-[36px] font-black bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] bg-clip-text text-transparent">
              بنكك
            </span>
          </h1>
        </div>
      </div>

      {/* Bottom Real Loading Progress & Account / Guest Options */}
      <div className="relative z-10 px-6 pb-5 pt-2 space-y-3 text-center">
        <div className="space-y-1.5">
          <p className="font-display text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            {loadingLabel}
          </p>

          {/* Glossy Gold Pill Progress Track */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="تقدم تحميل اللعبة"
            className="w-full h-3.5 rounded-full bg-[#041418]/90 border-[1.5px] border-[#F6C453] p-[2px] shadow-[0_6px_16px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#D97706] via-[#FACC15] to-[#FEF08A] shadow-[0_0_10px_rgba(250,204,21,0.75)] transition-[width] duration-75 ease-linear"
            />
          </div>

          <p className="font-mono text-xs font-extrabold text-white tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            {progress}%
          </p>
        </div>

        <div
          className={`space-y-2 transition-all duration-300 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-55 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={onContinue}
            disabled={!isReady}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] text-[#061814] font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(234,179,8,0.38)] hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap disabled:cursor-wait"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>إنشاء حساب / تسجيل دخول</span>
          </button>

          <button
            type="button"
            onClick={onSkipToHome}
            disabled={!isReady}
            className="w-full min-h-[44px] rounded-2xl bg-[#07212B]/88 border border-[#F6C453]/55 text-[#F7F3E9] font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0B303E] active:scale-[0.98] transition-all whitespace-nowrap disabled:cursor-wait"
          >
            <UserCheck className="w-4 h-4 text-[#FACC15] shrink-0" />
            <span>متابعة كضيف</span>
          </button>
        </div>
      </div>
    </div>
  );
};
