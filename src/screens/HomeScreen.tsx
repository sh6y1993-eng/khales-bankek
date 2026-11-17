import React, { useState } from 'react';
import { Bell, X, CheckCircle2, Sparkles } from 'lucide-react';
import { ScreenId, UserProfile } from '../types/prototype';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { BottomTabBar } from '../components/ui/BottomTabBar';

interface HomeScreenProps {
  profile: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onQuickStartAi: () => void;
  onOpenRules: () => void;
}

type HomeOverlay = null | 'notifications' | 'missions' | 'shop';

interface BannerAceCardProps {
  suit: '♠' | '♥' | '♦' | '♣';
  isRed: boolean;
  className?: string;
}

const BannerAceCard: React.FC<BannerAceCardProps> = ({ suit, isRed, className = '' }) => (
  <div
    className={`w-[46px] h-[64px] rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#F3EDE0] border border-[#D9C79E] shadow-[0_8px_18px_rgba(0,0,0,0.45)] flex flex-col justify-between p-1 relative select-none ${
      isRed ? 'text-[#C8322B]' : 'text-[#17211E]'
    } ${className}`}
  >
    <div className="leading-none text-left">
      <span className="block font-display font-black text-[11px] leading-none">A</span>
      <span className="block text-[9px] leading-none">{suit}</span>
    </div>
    <div className="flex items-center justify-center leading-none">
      <span className="text-[18px] leading-none">{suit}</span>
    </div>
  </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onQuickStartAi,
  onOpenRules,
}) => {
  const [coins, setCoins] = useState(25400);
  const [unreadCount, setUnreadCount] = useState(3);
  const [overlay, setOverlay] = useState<HomeOverlay>(null);
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);

  const level = 12 + profile.demoWins;
  const xpPercent = Math.min(95, 62 + profile.demoMatchesPlayed * 4);

  const dailyMissions = [
    { id: 'm1', title: 'فُز في جولة ضد الكمبيوتر', reward: 500, progress: '1/1' },
    { id: 'm2', title: 'رتّب 5 أوراق في الأبواب', reward: 350, progress: '5/5' },
    { id: 'm3', title: 'أكمل كومة مركزية حتى الملك (K)', reward: 800, progress: '0/1' },
  ];

  const handleClaimMission = (id: string, reward: number) => {
    if (claimedMissions.includes(id)) return;
    setClaimedMissions((prev) => [...prev, id]);
    setCoins((c) => c + reward);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[radial-gradient(ellipse_at_top,#073848_0%,#031A24_52%,#020E14_100%)]">
      {/* Top Player Header */}
      <header className="shrink-0 px-4 pt-3 pb-2 flex items-center gap-3">
        {/* Circular Avatar */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="الملف الشخصي"
          className="w-[60px] h-[60px] rounded-full p-[2.5px] bg-gradient-to-b from-[#E0F2FE] via-[#7DD3FC] to-[#0284C7] shadow-[0_6px_16px_rgba(0,0,0,0.45)] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
        >
          <AssetImage
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full rounded-full object-cover"
            fallbackLabel={profile.name}
          />
        </button>

        {/* Name + Coins + Bell on Top Row, Level + Wide Golden XP Bar Below */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-base font-black text-white truncate leading-tight">
                {profile.name}
              </p>
              <p className="text-xs font-bold text-[#CBD5E1] tabular-nums leading-tight mt-0.5">
                المستوى {level}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Coins Pill */}
              <div
                aria-label="رصيد العملات"
                className="min-h-[34px] rounded-full bg-[#03161E]/95 border border-[#22D3EE]/45 px-2.5 py-1 flex items-center gap-1.5 shadow-inner"
              >
                <span
                  aria-hidden="true"
                  className="w-5 h-5 rounded-full bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#B45309] border border-[#FEF9C3]/80 flex items-center justify-center text-[10px] font-black text-[#78350F] shadow"
                >
                  ★
                </span>
                <span className="font-mono text-xs font-extrabold text-white tabular-nums">
                  {coins.toLocaleString('en-US')}
                </span>
              </div>

              {/* Bell */}
              <button
                type="button"
                onClick={() => {
                  setUnreadCount(0);
                  setOverlay('notifications');
                }}
                aria-label="الإشعارات"
                className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-white hover:bg-white/5 transition-colors"
              >
                <Bell className="w-6 h-6 fill-white text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-mono font-extrabold flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Wide Glossy Golden XP Bar */}
          <div className="h-3 w-full rounded-full bg-[#03131A] border border-[#22D3EE]/40 p-[1.5px] overflow-hidden shadow-inner">
            <div
              style={{ width: `${xpPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#D97706] via-[#FACC15] to-[#FEF08A] shadow-[0_0_8px_rgba(250,204,21,0.5)]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto iphone-scroll px-4 py-2 flex flex-col justify-center gap-3.5">
        {/* Hero Season Banner ("الموسم الأول") */}
        <section
          aria-label="الموسم الأول"
          onClick={onQuickStartAi}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onQuickStartAi();
            }
          }}
          className="relative rounded-[26px] border-2 border-[#7DD3FC]/70 shadow-[0_14px_30px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden min-h-[196px] flex flex-col justify-end px-4 pt-4 pb-3.5 cursor-pointer group active:scale-[0.99] transition-transform"
        >
          {/* Kuwait Skyline Artwork + Radiant Sunburst Glow */}
          <AssetImage
            src={DESIGN_ASSETS.splashBackdrop}
            alt="خلفية الموسم الأول"
            className="absolute inset-0 w-full h-full object-cover object-[center_45%] scale-105 group-hover:scale-110 transition-transform duration-500"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.45)_0%,rgba(6,40,56,0.62)_58%,rgba(2,20,28,0.92)_100%)]"
          />

          {/* 4 Large Fanned Ace Cards */}
          <div
            aria-hidden="true"
            className="relative z-10 flex items-end justify-center -mb-3.5"
          >
            <BannerAceCard suit="♠" isRed={false} className="-rotate-[16deg] translate-x-3 translate-y-2" />
            <BannerAceCard suit="♥" isRed className="-rotate-[5deg] translate-x-1" />
            <BannerAceCard suit="♦" isRed className="rotate-[5deg] -translate-x-1" />
            <BannerAceCard suit="♣" isRed={false} className="rotate-[16deg] -translate-x-3 translate-y-2" />
          </div>

          {/* Tilted Crimson & Gold Oval Ribbon */}
          <div className="relative z-20 mx-auto w-[84%] max-w-[265px] -rotate-[4deg] rounded-full bg-gradient-to-b from-[#991B1B] via-[#7F1D1D] to-[#450A0A] border-[2.5px] border-[#FACC15] px-5 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.65)] text-center">
            <h1 className="font-display text-[26px] font-black leading-none bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              الموسم الأول
            </h1>
          </div>

          {/* Subtitle + Large Gold Trophy */}
          <div className="relative z-20 mt-3 flex items-center justify-between gap-2">
            <p className="font-display text-sm font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] pr-1">
              جوائز حصرية ومكافآت رائعة
            </p>
            <div aria-hidden="true" className="shrink-0 drop-shadow-[0_4px_10px_rgba(250,204,21,0.45)] -mb-1">
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="bannerTrophy" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
                <path d="M14 9H34V20C34 25.5 29.5 30 24 30C18.5 30 14 25.5 14 20V9Z" fill="url(#bannerTrophy)" stroke="#78350F" strokeWidth="1.5" />
                <path d="M14 12H8.5C8.5 18 11 22 14 22" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M34 12H39.5C39.5 18 37 22 34 22" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
                <rect x="21" y="30" width="6" height="7" fill="#D97706" />
                <rect x="15" y="37" width="18" height="5" rx="2.5" fill="#FACC15" stroke="#78350F" strokeWidth="1.3" />
              </svg>
            </div>
          </div>
        </section>

        {/* 2x2 Compact Glossy Feature Tiles */}
        <section aria-label="الأقسام الرئيسية" className="grid grid-cols-2 gap-3 shrink-0">
          {/* Top-Right: المهام اليومية */}
          <button
            type="button"
            onClick={() => setOverlay('missions')}
            className="h-[104px] rounded-[20px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.28)_0%,rgba(4,34,44,0.96)_72%)] border-[1.5px] border-[#22D3EE]/60 hover:border-[#67E8F9] shadow-[inset_0_1px_1px_rgba(165,243,252,0.45),0_8px_20px_rgba(0,0,0,0.45)] p-2.5 flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
              <rect x="7" y="10" width="34" height="31" rx="7" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
              <path d="M7 17C7 13.134 10.134 10 14 10H34C37.866 10 41 13.134 41 17V20H7V17Z" fill="#EF4444" />
              <rect x="15" y="6" width="4" height="8" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.2" />
              <rect x="29" y="6" width="4" height="8" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.2" />
              <path d="M18 30L22.5 34.5L31 25.5" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-[15px] font-extrabold text-white drop-shadow">المهام اليومية</span>
          </button>

          {/* Top-Left: البطولات */}
          <button
            type="button"
            onClick={() => onNavigate('mode-select')}
            className="h-[104px] rounded-[20px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.28)_0%,rgba(4,34,44,0.96)_72%)] border-[1.5px] border-[#22D3EE]/60 hover:border-[#67E8F9] shadow-[inset_0_1px_1px_rgba(165,243,252,0.45),0_8px_20px_rgba(0,0,0,0.45)] p-2.5 flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="drop-shadow-[0_4px_10px_rgba(250,204,21,0.35)]">
              <defs>
                <linearGradient id="homeTrophyTile" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>
              <path d="M14 10H34V20C34 25.5 29.5 30 24 30C18.5 30 14 25.5 14 20V10Z" fill="url(#homeTrophyTile)" stroke="#78350F" strokeWidth="1.5" />
              <path d="M14 13H9C9 18.5 11 22 14 22" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M34 13H39C39 18.5 37 22 34 22" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
              <rect x="21" y="30" width="6" height="6.5" fill="#D97706" />
              <rect x="15" y="36.5" width="18" height="4.5" rx="2.2" fill="#FACC15" stroke="#78350F" strokeWidth="1.2" />
            </svg>
            <span className="font-display text-[15px] font-extrabold text-white drop-shadow">البطولات</span>
          </button>

          {/* Bottom-Right: الأصدقاء */}
          <button
            type="button"
            onClick={() => onNavigate('multiplayer-hub')}
            className="h-[104px] rounded-[20px] bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.32)_0%,rgba(4,40,35,0.96)_72%)] border-[1.5px] border-[#34D399]/65 hover:border-[#6EE7B7] shadow-[inset_0_1px_1px_rgba(167,243,208,0.45),0_8px_20px_rgba(0,0,0,0.45)] p-2.5 flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <svg width="52" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="drop-shadow-[0_4px_10px_rgba(56,189,248,0.4)]">
              <circle cx="14" cy="18" r="5" fill="#67E8F9" />
              <path d="M6 35C6 29.5 9.5 26 14 26C18.5 26 22 29.5 22 35H6Z" fill="#22D3EE" />
              <circle cx="34" cy="18" r="5" fill="#67E8F9" />
              <path d="M26 35C26 29.5 29.5 26 34 26C38.5 26 42 29.5 42 35H26Z" fill="#22D3EE" />
              <circle cx="24" cy="15" r="6" fill="#E0F2FE" />
              <path d="M13 38C13 31 18 26.5 24 26.5C30 26.5 35 31 35 38H13Z" fill="#38BDF8" stroke="#083344" strokeWidth="1.2" />
            </svg>
            <span className="font-display text-[15px] font-extrabold text-white drop-shadow">الأصدقاء</span>
          </button>

          {/* Bottom-Left: المتجر */}
          <button
            type="button"
            onClick={() => setOverlay('shop')}
            className="h-[104px] rounded-[20px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.28)_0%,rgba(4,34,44,0.96)_72%)] border-[1.5px] border-[#22D3EE]/60 hover:border-[#67E8F9] shadow-[inset_0_1px_1px_rgba(165,243,252,0.45),0_8px_20px_rgba(0,0,0,0.45)] p-2.5 flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
              <rect x="9" y="21" width="30" height="19" rx="3" fill="#FDBA74" stroke="#7C2D12" strokeWidth="1.4" />
              <rect x="19" y="27" width="10" height="13" rx="1.5" fill="#7C2D12" />
              <path d="M6 21L10.5 9.5H37.5L42 21H6Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.4" />
              <path d="M15.5 9.5L14.5 21H20.5L21 9.5H15.5Z" fill="#FFFBEB" />
              <path d="M27 9.5L27.5 21H33.5L32.5 9.5H27Z" fill="#FFFBEB" />
            </svg>
            <span className="font-display text-[15px] font-extrabold text-white drop-shadow">المتجر</span>
          </button>
        </section>
      </div>

      {/* Interactive Home Overlays (Missions / Shop / Notifications) */}
      {overlay && (
        <div
          className="absolute inset-0 z-40 flex items-end bg-black/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOverlay(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[75%] rounded-t-3xl bg-[#072530] border-t border-[#22D3EE]/40 p-5 space-y-4 shadow-2xl animate-sheet-up overflow-y-auto iphone-scroll"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h2 className="font-display text-base font-extrabold text-white">
                {overlay === 'missions'
                  ? 'المهام اليومية'
                  : overlay === 'shop'
                  ? 'متجر خلّص بنكك (معاينة)'
                  : 'الإشعارات'}
              </h2>
              <button
                type="button"
                onClick={() => setOverlay(null)}
                aria-label="إغلاق"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#CBD5E1] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {overlay === 'missions' && (
              <div className="space-y-2.5">
                {dailyMissions.map((m) => {
                  const claimed = claimedMissions.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white">{m.title}</p>
                        <p className="text-[11px] text-[#FACC15] font-mono mt-0.5">
                          +{m.reward} ★ · التقدم {m.progress}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={claimed}
                        onClick={() => handleClaimMission(m.id, m.reward)}
                        className="min-h-[38px] px-3 rounded-xl bg-[#FACC15] text-[#061814] text-xs font-extrabold disabled:bg-[#10B981]/20 disabled:text-[#34D399]"
                      >
                        {claimed ? 'تم الاستلام' : 'استلام'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {overlay === 'shop' && (
              <div className="space-y-2.5">
                {[
                  { name: 'طقم أوراق الديوانية الذهبي', price: '4,500 ★' },
                  { name: 'خلفية طاولة أبراج الكويت', price: '8,000 ★' },
                  { name: 'حزمة 10,000 عملة تجريبية', price: 'عرض الموسم' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#FACC15] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">{item.name}</p>
                        <p className="text-[11px] text-[#38BDF8]">{item.price}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOverlay(null)}
                      className="min-h-[36px] px-3 rounded-xl bg-[#0B3948] border border-[#22D3EE]/40 text-xs font-bold text-white"
                    >
                      معاينة
                    </button>
                  </div>
                ))}
              </div>
            )}

            {overlay === 'notifications' && (
              <div className="space-y-2.5">
                {[
                  'انطلق الموسم الأول بمكافآت وجوائز حصرية!',
                  'لديك مهمتان يوميتان جاهزتان للاستلام.',
                  'دليل قواعد ترتيب الأوراق محدّث وجاهز للمراجعة.',
                ].map((note, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                    <p className="text-xs text-white leading-relaxed">{note}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOverlay(null);
                    onOpenRules();
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-[#0B3948] border border-[#22D3EE]/40 text-xs font-bold text-[#FACC15]"
                >
                  فتح دليل قواعد اللعب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomTabBar currentScreen="home" onNavigate={onNavigate} />
    </div>
  );
};
