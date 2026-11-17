import React from 'react';
import { Smartphone, Volume2, VolumeX, Vibrate, Layers } from 'lucide-react';
import { ALL_SCREENS, AppSettings, IPhoneViewportId, ScreenId } from '../../types/prototype';
import { DESIGN_ASSETS, IPHONE_VIEWPORTS } from '../../theme/designTokens';
import { AssetImage } from './AssetImage';

interface IPhoneShellProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  viewport: IPhoneViewportId;
  onViewportChange: (viewport: IPhoneViewportId) => void;
  settings: AppSettings;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onChangeBoardStyle: (style: 'table3d' | 'classic') => void;
  children: React.ReactNode;
}

export const IPhoneShell: React.FC<IPhoneShellProps> = ({
  currentScreen,
  onNavigate,
  viewport,
  onViewportChange,
  settings,
  onToggleSound,
  onToggleHaptics,
  onChangeBoardStyle,
  children,
}) => {
  const activeDevice = IPHONE_VIEWPORTS[viewport];
  const deviceCssVars = {
    '--iphone-w': `${activeDevice.width}px`,
    '--iphone-h': `${Math.min(activeDevice.height, 860)}px`,
  } as React.CSSProperties;

  return (
    <div className="min-h-[100dvh] w-full bg-[#061814] text-[#F7F3E9] flex flex-col lg:flex-row">
      {/* Desktop Inspector Sidebar (hidden on mobile < lg) */}
      <aside className="hidden lg:flex w-[360px] shrink-0 border-l border-[#D4A243]/15 bg-[#071F19] flex-col justify-between p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-[#F7F3E9]/10">
            <AssetImage
              src={DESIGN_ASSETS.emblem}
              alt="شعار خلّص بنكك"
              className="w-12 h-12 rounded-2xl object-cover border border-[#D4A243]/40 shrink-0"
              fallbackLabel="شعار"
            />
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold text-[#F7F3E9] leading-tight">
                خلّص بنكك
              </p>
              <p className="text-xs text-[#B5C7C1] mt-0.5">
                نموذج أولي تفاعلي لتصميم iPhone · معاينة واجهات
              </p>
            </div>
          </div>

          {/* Board Design Style Switcher */}
          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#F7F3E9]">تصميم لوحة اللعب</span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#061814] border border-[#F7F3E9]/10">
              <button
                type="button"
                onClick={() => onChangeBoardStyle('table3d')}
                className={`min-h-[38px] px-2 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                  settings.boardStyle === 'table3d'
                    ? 'bg-[#D4A243] text-[#061814] font-bold'
                    : 'text-[#B5C7C1] hover:text-[#F7F3E9]'
                }`}
              >
                طاولة 3D (جديد)
              </button>
              <button
                type="button"
                onClick={() => onChangeBoardStyle('classic')}
                className={`min-h-[38px] px-2 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                  settings.boardStyle === 'classic'
                    ? 'bg-[#D4A243] text-[#061814] font-bold'
                    : 'text-[#B5C7C1] hover:text-[#F7F3E9]'
                }`}
              >
                التصميم السابق
              </button>
            </div>
          </div>

          {/* iPhone Size Switcher */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#B5C7C1]">
              <span className="font-medium text-[#F7F3E9] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#D4A243]" />
                <span>مقاس شاشة الآيفون</span>
              </span>
              <span className="font-mono tabular-nums text-[11px]">
                {activeDevice.dimensions}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#061814] border border-[#F7F3E9]/10">
              {(Object.keys(IPHONE_VIEWPORTS) as IPhoneViewportId[]).map((id) => {
                const dev = IPHONE_VIEWPORTS[id];
                const active = viewport === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onViewportChange(id)}
                    className={`min-h-[38px] px-2 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#D4A243] text-[#061814] font-bold'
                        : 'text-[#B5C7C1] hover:text-[#F7F3E9]'
                    }`}
                  >
                    {dev.label.replace('iPhone ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Sensory Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className={`min-h-[42px] px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                settings.soundEnabled
                  ? 'bg-[#103D33] border-[#D4A243]/40 text-[#F7F3E9]'
                  : 'bg-[#061814] border-[#F7F3E9]/10 text-[#B5C7C1]'
              }`}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#D4A243]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span>{settings.soundEnabled ? 'الصوت مفعل' : 'الصوت مكتوم'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleHaptics}
              className={`min-h-[42px] px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                settings.hapticsEnabled
                  ? 'bg-[#103D33] border-[#D4A243]/40 text-[#F7F3E9]'
                  : 'bg-[#061814] border-[#F7F3E9]/10 text-[#B5C7C1]'
              }`}
            >
              <Vibrate className={`w-4 h-4 ${settings.hapticsEnabled ? 'text-[#D4A243]' : ''}`} />
              <span>{settings.hapticsEnabled ? 'الاهتزاز مفعل' : 'الاهتزاز متوقف'}</span>
            </button>
          </div>

          {/* 12 Screens Navigator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F7F3E9] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D4A243]" />
                <span>شاشات النموذج الأولي (12 شاشة)</span>
              </span>
            </div>
            <div className="space-y-1 max-h-[380px] overflow-y-auto iphone-scroll pl-1">
              {ALL_SCREENS.map((item) => {
                const active = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-right transition-colors border ${
                      active
                        ? 'bg-[#103D33] border-[#D4A243]/50 text-[#F7F3E9]'
                        : 'bg-transparent border-transparent text-[#B5C7C1] hover:bg-[#0B2E26] hover:text-[#F7F3E9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums ${
                          active
                            ? 'bg-[#D4A243] text-[#061814]'
                            : 'bg-[#061814] text-[#B5C7C1] border border-[#F7F3E9]/10'
                        }`}
                      >
                        {item.order}
                      </span>
                      <span className="text-xs font-semibold truncate">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-[#B5C7C1]/80 shrink-0">{item.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#F7F3E9]/10 text-[11px] leading-relaxed text-[#B5C7C1]">
          هذا العرض مخصص لمعاينة التصميم والتفاعل فقط تمهيداً لبناء التطبيق الأصلي لاحقاً باستخدام Flutter وDart. جميع البيانات والغرف والخصوم تجريبية.
        </div>
      </aside>

      {/* Single-Mount Responsive Stage: full-bleed on mobile, realistic iPhone frame on desktop */}
      <main className="flex-1 flex flex-col lg:items-center lg:justify-center lg:p-6 lg:bg-[radial-gradient(circle_at_center,#0D372E_0%,#061814_75%)] overflow-auto">
        <div
          style={deviceCssVars}
          className="relative flex flex-col w-full h-[100dvh] lg:w-[var(--iphone-w)] lg:h-[var(--iphone-h)] lg:rounded-[44px] lg:border-[8px] lg:border-[#182924] lg:shadow-[0_30px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(212,162,67,0.25)] overflow-hidden felt-surface transition-all duration-200"
        >
          {/* iOS Top Status Bar + Safe Area (Desktop preview frame) */}
          <div
            dir="ltr"
            className="hidden lg:flex shrink-0 h-11 px-6 items-center justify-between text-[11px] font-mono font-semibold text-[#F7F3E9]/90 select-none z-40"
          >
            <span className="tabular-nums">9:41</span>
            {activeDevice.hasDynamicIsland ? (
              <div className="w-24 h-6 rounded-full bg-black border border-white/10" aria-hidden="true" />
            ) : (
              <div className="w-16 h-1.5 rounded-full bg-white/15" aria-hidden="true" />
            )}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="inline-block w-3.5 h-2.5 border border-[#F7F3E9]/80 rounded-[2px] p-[1px]">
                <span className="block w-full h-full bg-[#10B981] rounded-[1px]" />
              </span>
            </div>
          </div>

          {/* Single-mounted Active Screen Viewport */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            {children}
          </div>

          {/* iOS Home Indicator (Desktop preview frame) */}
          <div className="hidden lg:flex shrink-0 h-5 items-center justify-center bg-transparent pointer-events-none z-40">
            <div className="w-28 h-1 rounded-full bg-[#F7F3E9]/35" />
          </div>
        </div>
      </main>
    </div>
  );
};
