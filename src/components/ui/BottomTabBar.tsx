import React from 'react';
import { Home, Trophy, Layers, Users, User } from 'lucide-react';
import { ScreenId } from '../../types/prototype';

interface BottomTabBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const TABS: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'mode-select', label: 'اللعب', icon: Trophy },
  { id: 'game-board', label: 'الطاولة', icon: Layers },
  { id: 'multiplayer-hub', label: 'الغرف', icon: Users },
  { id: 'profile', label: 'حسابي', icon: User },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="shrink-0 w-full px-3 pb-safe pb-2.5 pt-2 bg-gradient-to-t from-[#020E14] via-[#020E14]/90 to-transparent z-30"
    >
      <div className="rounded-[28px] bg-[#041B24]/95 border-[1.5px] border-[#38BDF8]/35 px-1.5 py-1 shadow-[0_12px_28px_rgba(0,0,0,0.65)] grid grid-cols-5 items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'mode-select' && currentScreen === 'ai-setup') ||
            (tab.id === 'multiplayer-hub' &&
              (currentScreen === 'create-room' ||
                currentScreen === 'join-room' ||
                currentScreen === 'room-lobby'));

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9] ${
                isActive
                  ? '-my-2 min-h-[62px] rounded-[22px] bg-gradient-to-b from-[#14B8A6]/85 via-[#0E7490]/95 to-[#063E52] border-[1.5px] border-[#A5F3FC]/80 px-1 py-1.5 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : 'min-h-[50px] rounded-2xl px-1 py-1 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive
                    ? 'text-[#FACC15] fill-[#FACC15] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                    : 'text-white'
                }`}
              />
              <span
                className={`mt-1 text-[10px] font-display font-extrabold leading-none whitespace-nowrap ${
                  isActive ? 'text-[#FDE047]' : 'text-[#E2E8F0]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
