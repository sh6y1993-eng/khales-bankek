import React from 'react';
import { ScreenId } from '../../types/prototype';
import { HOME_SCREEN_ASSETS } from '../../theme/designTokens';
import { IconAlphaMode, TransparentAssetIcon } from './TransparentAssetIcon';

interface BottomTabBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenRanking?: () => void;
  onOpenShop?: () => void;
}

interface NavIconSpec {
  src: string;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  dispW: number;
  dispH: number;
  mode: IconAlphaMode;
}

interface TabItem {
  id: string;
  label: string;
  iconSpec: NavIconSpec;
  isActive: boolean;
  onSelect: () => void;
}

const NAV_ICON_SPECS: Record<'profile' | 'ranking' | 'store' | 'games' | 'home', NavIconSpec> = {
  profile: {
    src: HOME_SCREEN_ASSETS.navProfile,
    cropX: 26,
    cropY: 65,
    cropW: 70,
    cropH: 80,
    dispW: 29,
    dispH: 33,
    mode: 'white-nav',
  },
  ranking: {
    src: HOME_SCREEN_ASSETS.navRanking,
    cropX: 31,
    cropY: 65,
    cropW: 88,
    cropH: 78,
    dispW: 36,
    dispH: 32,
    mode: 'white-nav',
  },
  store: {
    src: HOME_SCREEN_ASSETS.navStore,
    cropX: 26,
    cropY: 62,
    cropW: 92,
    cropH: 90,
    dispW: 35,
    dispH: 34,
    mode: 'store-nav',
  },
  games: {
    src: HOME_SCREEN_ASSETS.navGames,
    cropX: 29,
    cropY: 65,
    cropW: 88,
    cropH: 78,
    dispW: 36,
    dispH: 32,
    mode: 'white-nav',
  },
  home: {
    src: HOME_SCREEN_ASSETS.navHomeActive,
    cropX: 30,
    cropY: 82,
    cropW: 98,
    cropH: 84,
    dispW: 37,
    dispH: 32,
    mode: 'gold',
  },
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenRanking,
  onOpenShop,
}) => {
  const isHomeDock = Boolean(onOpenRanking || onOpenShop);

  const tabs: TabItem[] = isHomeDock
    ? [
        {
          id: 'profile',
          label: 'الملف',
          iconSpec: NAV_ICON_SPECS.profile,
          isActive: currentScreen === 'profile',
          onSelect: () => onNavigate('profile'),
        },
        {
          id: 'ranking',
          label: 'الترتيب',
          iconSpec: NAV_ICON_SPECS.ranking,
          isActive: false,
          onSelect: () => (onOpenRanking ? onOpenRanking() : onNavigate('home')),
        },
        {
          id: 'shop',
          label: 'المتجر',
          iconSpec: NAV_ICON_SPECS.store,
          isActive: false,
          onSelect: () => (onOpenShop ? onOpenShop() : onNavigate('home')),
        },
        {
          id: 'mode-select',
          label: 'اللعب',
          iconSpec: NAV_ICON_SPECS.games,
          isActive: currentScreen === 'mode-select' || currentScreen === 'ai-setup',
          onSelect: () => onNavigate('mode-select'),
        },
        {
          id: 'home',
          label: 'الرئيسية',
          iconSpec: NAV_ICON_SPECS.home,
          isActive: currentScreen === 'home',
          onSelect: () => onNavigate('home'),
        },
      ]
    : [
        {
          id: 'profile',
          label: 'الملف',
          iconSpec: NAV_ICON_SPECS.profile,
          isActive: currentScreen === 'profile',
          onSelect: () => onNavigate('profile'),
        },
        {
          id: 'multiplayer-hub',
          label: 'الترتيب',
          iconSpec: NAV_ICON_SPECS.ranking,
          isActive:
            currentScreen === 'multiplayer-hub' ||
            currentScreen === 'create-room' ||
            currentScreen === 'join-room' ||
            currentScreen === 'room-lobby',
          onSelect: () => onNavigate('multiplayer-hub'),
        },
        {
          id: 'game-board',
          label: 'المتجر',
          iconSpec: NAV_ICON_SPECS.store,
          isActive: currentScreen === 'game-board',
          onSelect: () => onNavigate('game-board'),
        },
        {
          id: 'mode-select',
          label: 'اللعب',
          iconSpec: NAV_ICON_SPECS.games,
          isActive: currentScreen === 'mode-select' || currentScreen === 'ai-setup',
          onSelect: () => onNavigate('mode-select'),
        },
        {
          id: 'home',
          label: 'الرئيسية',
          iconSpec: NAV_ICON_SPECS.home,
          isActive: currentScreen === 'home',
          onSelect: () => onNavigate('home'),
        },
      ];

  return (
    <nav
      aria-label="التنقل الرئيسي"
      dir="ltr"
      className="shrink-0 w-full px-3 pb-safe pb-2.5 pt-1.5 bg-transparent relative z-30"
    >
      {/* Single clean dark-navy navigation bar matching 11_bottom_navigation_background.png without duplicate icon ghosting */}
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#001A24] via-[#001F28] to-[#011820] border-[1.6px] border-[#11859E]/90 px-1.5 py-1 shadow-[0_14px_30px_rgba(0,0,0,0.82),inset_0_1px_1px_rgba(125,211,252,0.35)]">
        {/* 5 Navigation Items (LTR grid: الملف | الترتيب | المتجر | اللعب | الرئيسية) */}
        <div className="relative z-10 grid grid-cols-5 items-center gap-0.5">
          {tabs.map((tab) => {
            const spec = tab.iconSpec;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onSelect}
                aria-current={tab.isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9] ${
                  tab.isActive
                    ? '-my-[3px] min-h-[68px] rounded-[24px] bg-gradient-to-b from-[#02848E] via-[#015B63] to-[#01393E] border-[2px] border-[#7DD3FC] px-1 py-1 shadow-[0_6px_18px_rgba(34,211,238,0.38),inset_0_2px_4px_rgba(255,255,255,0.65)]'
                    : 'min-h-[60px] rounded-[20px] px-1 py-1 hover:bg-white/5 active:scale-95 border border-transparent'
                }`}
              >
                {/* Top specular highlight on active capsule matching 16_nav_home_active.png */}
                {tab.isActive && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                  />
                )}

                <div className="relative z-10 flex items-center justify-center h-[35px]">
                  <TransparentAssetIcon
                    src={spec.src}
                    cropX={spec.cropX}
                    cropY={spec.cropY}
                    cropW={spec.cropW}
                    cropH={spec.cropH}
                    mode={spec.mode}
                    style={{ width: `${spec.dispW}px`, height: `${spec.dispH}px` }}
                    className="drop-shadow-[0_3px_4px_rgba(0,0,0,0.75)]"
                  />
                </div>

                <span
                  className={`relative z-10 mt-0.5 text-[13px] font-display font-black leading-none whitespace-nowrap drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] ${
                    tab.isActive ? 'text-[#FACC15]' : 'text-white'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Soft Centered Cyan Glow underneath the Bottom Navigation Bar (Section 6.4) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[3px] inset-x-8 h-[4px] bg-gradient-to-r from-transparent via-[#67E8F9] to-transparent opacity-95 blur-[0.5px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[10px] inset-x-12 h-[14px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.65)_0%,rgba(14,165,233,0.28)_45%,transparent_78%)] blur-[3px]"
        />
      </div>
    </nav>
  );
};
