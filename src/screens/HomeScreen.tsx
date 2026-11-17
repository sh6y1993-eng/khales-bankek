import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Trophy, Users } from 'lucide-react';
import { ScreenId, UserProfile } from '../types/prototype';
import { DESIGN_ASSETS, HOME_SCREEN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { BottomTabBar } from '../components/ui/BottomTabBar';
import { TransparentAssetIcon } from '../components/ui/TransparentAssetIcon';

interface HomeScreenProps {
  profile: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onQuickStartAi: () => void;
  onOpenRules: () => void;
  onClaimMissionReward?: (rewardCoins: number, rewardXp: number) => void;
  onClearNotifications?: () => void;
  onSwitchAccount?: (accountName: string, isGuest: boolean) => void;
}

type HomeOverlay = null | 'notifications' | 'missions' | 'shop' | 'ranking';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onQuickStartAi,
  onOpenRules,
  onClaimMissionReward,
  onClearNotifications,
  onSwitchAccount,
}) => {
  const [overlay, setOverlay] = useState<HomeOverlay>(null);
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);

  // Real Dynamic Player Data (Section 2: never hardcode or add demoWins to level)
  const playerName = profile.name;
  const playerLevel = profile.level;
  const playerCoins = profile.coins;
  const unreadCount = profile.notificationsCount;
  const xpProgress = Math.min(
    100,
    Math.max(0, Math.round((profile.xp / Math.max(1, profile.maxXp)) * 100))
  );

  const isDefaultReferenceAvatar =
    profile.avatar === HOME_SCREEN_ASSETS.profileAvatar;

  const dailyMissions = [
    { id: 'm1', title: 'فُز في جولة ضد الكمبيوتر', reward: 500, xp: 250, progress: '1/1' },
    { id: 'm2', title: 'رتّب 5 أوراق في الأبواب', reward: 350, xp: 150, progress: '5/5' },
    { id: 'm3', title: 'أكمل كومة مركزية حتى الملك (K)', reward: 800, xp: 400, progress: '0/1' },
  ];

  const handleClaimMission = (id: string, rewardCoins: number, rewardXp: number) => {
    if (claimedMissions.includes(id)) return;
    setClaimedMissions((prev) => [...prev, id]);
    if (onClaimMissionReward) {
      onClaimMissionReward(rewardCoins, rewardXp);
    }
  };

  const handleOpenNotifications = () => {
    if (onClearNotifications) {
      onClearNotifications();
    }
    setOverlay('notifications');
  };

  return (
    <div
      style={{ backgroundImage: `url('${DESIGN_ASSETS.homeBackground}')` }}
      className="flex-1 flex flex-col min-h-0 relative bg-[#021924] bg-cover bg-center bg-no-repeat select-none overflow-hidden"
    >
      {/* Main Stage matching master reference spacing */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto iphone-scroll px-3.5 pt-2.5 pb-2 flex flex-col justify-between gap-3">
        {/* 1. HEADER (MATCHING MASTER REFERENCE & USING ASSETS 01, 02-REF, 03, 04, 05) */}
        <header dir="ltr" className="shrink-0 flex items-center gap-2.5">
          {/* 01_profile_avatar.png — Preserves original cyan glowing ring, lighting & proportions */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="الملف الشخصي"
            className="shrink-0 w-[74px] h-[74px] rounded-full relative flex items-center justify-center active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9] drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]"
          >
            {isDefaultReferenceAvatar ? (
              <img
                src={HOME_SCREEN_ASSETS.profileAvatar}
                alt={playerName}
                draggable={false}
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full rounded-full p-[2.5px] bg-gradient-to-b from-[#FFFFFF] via-[#38BDF8] to-[#0284C7]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#052936]">
                  <AssetImage
                    src={profile.avatar}
                    alt={playerName}
                    className="w-full h-full object-cover"
                    fallbackLabel={playerName}
                  />
                </div>
              </div>
            )}
          </button>

          {/* Right Column: Dynamic Player Name & Level + Coin Balance + Bell on top, XP Bar below */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-1.5">
              {/* 02_player_name_and_level.png visual reference -> Dynamic Name & Level */}
              <div className="min-w-0 flex-1 flex flex-col items-start leading-tight pl-0.5">
                <h1
                  dir="rtl"
                  className="max-w-full font-display text-[21px] font-black text-white truncate leading-[1.15] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {playerName}
                </h1>
                <p
                  dir="rtl"
                  className="font-display text-[14.5px] font-extrabold text-white tabular-nums mt-0.5 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                >
                  المستوى {playerLevel}
                </p>
              </div>

              {/* 03_coin_balance.png + 04_notifications_bell.png */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 03_coin_balance.png — Authentic 3D Gold Coin + Cyan Capsule + Dynamic Coin Text */}
                <button
                  type="button"
                  onClick={() => setOverlay('shop')}
                  aria-label={`رصيد العملات ${playerCoins.toLocaleString('en-US')}`}
                  className="relative h-[36px] pl-1.5 pr-3 rounded-full bg-gradient-to-b from-[#042F3D] via-[#02202B] to-[#01151D] border-[1.6px] border-[#26AACA]/85 shadow-[inset_0_1px_1px_rgba(186,230,253,0.45),0_4px_10px_rgba(0,0,0,0.55)] flex items-center gap-1.5 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9] overflow-hidden"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-5 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E0F2FE] to-transparent opacity-90"
                  />
                  {/* Exact 3D Gold Coin extracted from 03_coin_balance_004641c3.png (x:33..95, y:16..78) */}
                  <div className="relative w-[25px] h-[25px] rounded-full overflow-hidden shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
                    <img
                      src={HOME_SCREEN_ASSETS.coinBalance}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      style={{
                        position: 'absolute',
                        width: `${(271 / 62) * 100}%`,
                        height: `${(90 / 62) * 100}%`,
                        left: `${-(33 / 62) * 100}%`,
                        top: `${-(16 / 62) * 100}%`,
                        maxWidth: 'none',
                      }}
                      className="select-none pointer-events-none"
                    />
                  </div>
                  <span className="relative z-10 font-mono text-[15.5px] font-black text-white tabular-nums tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
                    {playerCoins.toLocaleString('en-US')}
                  </span>
                </button>

                {/* 04_notifications_bell.png — True-Alpha 3D Bell + Dynamic Notification Badge */}
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  aria-label={`الإشعارات (${unreadCount})`}
                  className="relative w-[40px] h-[40px] flex items-center justify-center rounded-xl active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
                >
                  <TransparentAssetIcon
                    src={HOME_SCREEN_ASSETS.notificationsBell}
                    cropX={32}
                    cropY={35}
                    cropW={82}
                    cropH={87}
                    mode="bell"
                    style={{ width: '31px', height: '33px' }}
                    className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.75)]"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 right-0 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-b from-[#FF3B30] via-[#E11D48] to-[#B91C1C] border border-[#FECACA]/75 text-white text-[11.5px] font-mono font-black flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 05_experience_progress_bar.png + Independent Bottom Center Golden-Orange Glow */}
            <div className="relative w-full pt-0.5 pb-1">
              <div
                className="relative z-10 w-full h-[16px] rounded-full bg-[#001821] border-[1.5px] border-[#1989A3]/85 p-[1.5px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] overflow-hidden"
                role="progressbar"
                aria-label="شريط الخبرة"
                aria-valuenow={xpProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  style={{ width: `${xpProgress}%` }}
                  className="h-full rounded-full bg-gradient-to-b from-[#FCF37D] via-[#FEDC2E] to-[#F59101] shadow-[0_0_12px_rgba(250,204,21,0.65)] relative overflow-hidden transition-[width] duration-300"
                >
                  <div className="relative z-10 h-[3.5px] mx-1.5 mt-[1px] rounded-full bg-white/70" />
                </div>
              </div>

              {/* Independent Golden-Orange Glow Beneath Center of XP Bar (Section 3.5) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-[1px] left-[18%] right-[32%] h-[3px] bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent opacity-85 blur-[0.5px] z-20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-[14%] right-[28%] h-[4px] bg-gradient-to-r from-transparent via-[#FDE047] to-transparent opacity-95 blur-[0.5px] z-20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[5px] left-[8%] right-[22%] h-[12px] bg-[radial-gradient(ellipse_at_center,rgba(254,240,138,0.85)_0%,rgba(245,158,11,0.55)_42%,rgba(234,88,12,0.18)_70%,transparent_90%)] blur-[2.5px] z-0"
              />
            </div>
          </div>
        </header>

        {/* 2. SEASON ONE HERO BANNER (06_season_one_banner.png — UNCHANGED ORIGINAL ASSET) */}
        <section aria-label="الموسم الأول" className="shrink-0">
          <button
            type="button"
            onClick={onQuickStartAi}
            aria-label="الموسم الأول — جوائز حصرية ومكافآت رائعة — اضغط للعب"
            className="group relative w-full aspect-[2.01/1] rounded-[22px] overflow-hidden border-[2px] border-[#BAE6FD]/90 bg-[#0C4057] shadow-[0_12px_26px_rgba(0,0,0,0.6),0_0_16px_rgba(56,189,248,0.22)] active:scale-[0.985] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <img
              src={HOME_SCREEN_ASSETS.seasonOneBanner}
              alt="الموسم الأول — جوائز حصرية ومكافآت رائعة"
              draggable={false}
              className="w-full h-full object-cover scale-[1.03] group-hover:scale-[1.045] transition-transform duration-300 pointer-events-none select-none"
            />
          </button>
        </section>

        {/* 3. FOUR MAIN CARDS (TRUE-ALPHA 3D ICONS FROM ASSETS 07, 08, 09, 10 — ZERO DARK RECTANGLE BEHIND ICONS) */}
        <section
          aria-label="الأقسام الرئيسية"
          dir="ltr"
          className="flex-1 min-h-[212px] max-h-[252px] grid grid-cols-2 grid-rows-2 gap-3"
        >
          {/* Top-Left: البطولات (08_tournaments_card.png) */}
          <button
            type="button"
            onClick={() => onNavigate('mode-select')}
            className="relative h-full rounded-[22px] px-3 py-2 overflow-hidden bg-gradient-to-b from-[#01757F] via-[#01515A] to-[#012D35] border-[1.8px] border-[#38BDF8]/85 shadow-[0_10px_22px_rgba(0,0,0,0.55),inset_0_1.5px_1px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center gap-1.5 hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="absolute inset-x-6 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent opacity-95 pointer-events-none" />
            <div className="absolute inset-x-3 top-0 h-10 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.3),transparent_72%)] pointer-events-none" />
            <TransparentAssetIcon
              src={HOME_SCREEN_ASSETS.tournamentsCard}
              cropX={104}
              cropY={46}
              cropW={190}
              cropH={126}
              mode="gold"
              className="h-[62px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.55)]"
            />
            <span className="relative z-10 font-display text-[19px] font-black text-white leading-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              البطولات
            </span>
          </button>

          {/* Top-Right: المهام اليومية (07_daily_tasks_card.png) */}
          <button
            type="button"
            onClick={() => setOverlay('missions')}
            className="relative h-full rounded-[22px] px-3 py-2 overflow-hidden bg-gradient-to-b from-[#017191] via-[#025A74] to-[#012D3A] border-[1.8px] border-[#38BDF8]/85 shadow-[0_10px_22px_rgba(0,0,0,0.55),inset_0_1.5px_1px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center gap-1.5 hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="absolute inset-x-6 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#E0F2FE] to-transparent opacity-90 pointer-events-none" />
            <div className="absolute inset-x-3 top-0 h-9 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.32),transparent_70%)] pointer-events-none" />
            <TransparentAssetIcon
              src={HOME_SCREEN_ASSETS.dailyTasksCard}
              cropX={150}
              cropY={44}
              cropW={136}
              cropH={123}
              mode="calendar"
              className="h-[62px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.55)]"
            />
            <span className="relative z-10 font-display text-[19px] font-black text-white leading-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              المهام اليومية
            </span>
          </button>

          {/* Bottom-Left: المتجر (09_store_card.png) */}
          <button
            type="button"
            onClick={() => setOverlay('shop')}
            className="relative h-full rounded-[22px] px-3 py-2 overflow-hidden bg-gradient-to-b from-[#015C6C] via-[#023B48] to-[#002B36] border-[1.8px] border-[#38BDF8]/80 shadow-[0_10px_22px_rgba(0,0,0,0.55),inset_0_1.5px_1px_rgba(253,186,116,0.6)] flex flex-col items-center justify-center gap-1.5 hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            <div className="absolute inset-x-2 top-0 h-[3px] bg-gradient-to-r from-[#7DD3FC] via-[#FDBA74] to-[#FB923C] opacity-95 pointer-events-none" />
            <div className="absolute inset-x-3 top-0 h-10 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.34),transparent_72%)] pointer-events-none" />
            <TransparentAssetIcon
              src={HOME_SCREEN_ASSETS.storeCard}
              cropX={126}
              cropY={56}
              cropW={170}
              cropH={117}
              mode="store-card"
              className="h-[60px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.55)]"
            />
            <span className="relative z-10 font-display text-[19px] font-black text-white leading-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              المتجر
            </span>
          </button>

          {/* Bottom-Right: الأصدقاء (10_friends_card.png) */}
          <button
            type="button"
            onClick={() => onNavigate('multiplayer-hub')}
            className="relative h-full rounded-[22px] px-3 py-2 overflow-hidden bg-gradient-to-b from-[#017769] via-[#02625A] to-[#013130] border-[1.8px] border-[#34D399]/85 shadow-[0_10px_22px_rgba(0,0,0,0.55),inset_0_1.5px_1px_rgba(167,243,208,0.6)] flex flex-col items-center justify-center gap-1.5 hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34D399]"
          >
            <div className="absolute inset-x-6 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#A7F3D0] to-transparent opacity-90 pointer-events-none" />
            <div className="absolute inset-x-3 top-0 h-9 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.32),transparent_70%)] pointer-events-none" />
            <TransparentAssetIcon
              src={HOME_SCREEN_ASSETS.friendsCard}
              cropX={142}
              cropY={58}
              cropW={166}
              cropH={102}
              mode="friends"
              className="h-[56px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.55)]"
            />
            <span className="relative z-10 font-display text-[19px] font-black text-white leading-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              الأصدقاء
            </span>
          </button>
        </section>
      </div>

      {/* 4. BOTTOM NAVIGATION BAR (ASSETS 11, 12, 13, 14, 15, 16) */}
      <div className="relative z-10 shrink-0">
        <BottomTabBar
          currentScreen="home"
          onNavigate={onNavigate}
          onOpenRanking={() => setOverlay('ranking')}
          onOpenShop={() => setOverlay('shop')}
        />
      </div>

      {/* Interactive Home Sheets (Missions / Shop / Notifications / Ranking) */}
      {overlay && (
        <div
          className="absolute inset-0 z-40 flex items-end bg-black/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOverlay(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[78%] rounded-t-3xl bg-[#072530] border-t border-[#22D3EE]/40 p-5 space-y-4 shadow-2xl animate-sheet-up overflow-y-auto iphone-scroll"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h2 className="font-display text-base font-extrabold text-white">
                {overlay === 'missions'
                  ? 'المهام اليومية'
                  : overlay === 'shop'
                  ? 'المتجر'
                  : overlay === 'ranking'
                  ? 'ترتيب اللاعبين والحسابات'
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
                        <p className="text-[11px] text-[#FACC15] font-mono mt-0.5 tabular-nums">
                          +{m.reward} ★ · +{m.xp} XP · التقدم {m.progress}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={claimed}
                        onClick={() => handleClaimMission(m.id, m.reward, m.xp)}
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

            {overlay === 'ranking' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {[
                    { rank: 1, name: 'فيصل العتيبي', pts: '31,200', lvl: 16 },
                    { rank: 2, name: playerName, pts: playerCoins.toLocaleString('en-US'), lvl: playerLevel },
                    { rank: 3, name: 'سلطان المري', pts: '14,850', lvl: 7 },
                  ].map((row) => (
                    <div
                      key={row.rank}
                      className="rounded-2xl bg-[#041820] border border-white/10 p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-[#FACC15]" />
                        <span className="text-xs font-bold text-white">
                          #{row.rank} · {row.name} (مستوى {row.lvl})
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#FACC15] tabular-nums">
                        {row.pts}
                      </span>
                    </div>
                  ))}
                </div>

                {onSwitchAccount && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <p className="text-xs font-bold text-[#CBD5E1] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>تبديل الحساب لاختبار البيانات المستقلة:</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchAccount('أحمد', false);
                          setOverlay(null);
                        }}
                        className={`min-h-[40px] rounded-xl border text-xs font-bold ${
                          playerName === 'أحمد'
                            ? 'bg-[#FACC15] border-[#FACC15] text-[#061814]'
                            : 'bg-[#041820] border-white/15 text-white'
                        }`}
                      >
                        حساب 1: أحمد (م12)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchAccount('سلطان المري', false);
                          setOverlay(null);
                        }}
                        className={`min-h-[40px] rounded-xl border text-xs font-bold ${
                          playerName === 'سلطان المري'
                            ? 'bg-[#FACC15] border-[#FACC15] text-[#061814]'
                            : 'bg-[#041820] border-white/15 text-white'
                        }`}
                      >
                        حساب 2: سلطان (م7)
                      </button>
                    </div>
                  </div>
                )}
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
    </div>
  );
};
