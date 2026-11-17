export const HOME_SCREEN_ASSETS = {
  masterReference: '/assets/aistudio/Arabic_Mobile_Game_Home_Screen_5ed2019d.png',
  background: '/assets/aistudio/Glowing_Teal_Wave_Gradient_bd56e806.png',
  profileAvatar: '/assets/aistudio/01_profile_avatar_06a9d2b3.png',
  playerNameAndLevelRef: '/assets/aistudio/02_player_name_and_level_a65a6016.png',
  coinBalance: '/assets/aistudio/03_coin_balance_004641c3.png',
  notificationsBell: '/assets/aistudio/04_notifications_bell_b919005e.png',
  experienceProgressBar: '/assets/aistudio/05_experience_progress_bar_d965c409.png',
  seasonOneBanner: '/assets/aistudio/06_season_one_banner_5a786683.png',
  dailyTasksCard: '/assets/aistudio/07_daily_tasks_card_8df14ba1.png',
  tournamentsCard: '/assets/aistudio/08_tournaments_card_924a15a0.png',
  storeCard: '/assets/aistudio/09_store_card_e81b17f6.png',
  friendsCard: '/assets/aistudio/10_friends_card_e510c10f.png',
  bottomNavBackground: '/assets/aistudio/11_bottom_navigation_background_cfb11ac0.png',
  navProfile: '/assets/aistudio/12_nav_profile_25128473.png',
  navRanking: '/assets/aistudio/13_nav_ranking_456c84c9.png',
  navStore: '/assets/aistudio/14_nav_store_59b3b102.png',
  navGames: '/assets/aistudio/15_nav_games_e3ca1252.png',
  navHomeActive: '/assets/aistudio/16_nav_home_active_435c9798.png',
} as const;

export const DESIGN_ASSETS = {
  emblem: '/src/assets/images/khalas_emblem_1794926850416.jpg',
  splashBackdrop: '/src/assets/images/khalas_splash_bg_1794929733552.jpg',
  homeBackground: HOME_SCREEN_ASSETS.background,
  cardBack: '/src/assets/images/card_back_pattern_1794926852294.jpg',
  avatarPlayer: '/src/assets/images/avatar_player_1794926853140.jpg',
  avatarOpponent: '/src/assets/images/avatar_opponent_1794926852888.jpg',
  ...HOME_SCREEN_ASSETS,
} as const;

export const COLOR_TOKENS = {
  // 60% Dominant Neutral Canvas (Majlis Deep Emerald)
  canvasDeep: '#061814',
  tableFelt: '#0B2E26',
  vaultRecess: '#08231D',

  // 30% Structural Surfaces & Cards
  surfacePanel: '#103D33',
  surfaceElevated: '#154B3F',
  cardIvory: '#FDFBF7',
  cardInk: '#1A1D1B',
  suitRed: '#C8322B',
  textPrimary: '#F7F3E9',
  textSecondary: '#B5C7C1',

  // 10% Focal Accent (Burnished Gold)
  goldPrimary: '#D4A243',
  goldHighlight: '#E6B95E',
  emeraldActive: '#10B981',
} as const;

export const IPHONE_VIEWPORTS = {
  se: {
    id: 'se' as const,
    label: 'iPhone SE',
    dimensions: '375 × 667',
    width: 375,
    height: 667,
    hasDynamicIsland: false,
  },
  standard: {
    id: 'standard' as const,
    label: 'iPhone 16',
    dimensions: '393 × 852',
    width: 393,
    height: 852,
    hasDynamicIsland: true,
  },
  promax: {
    id: 'promax' as const,
    label: 'iPhone 16 Pro Max',
    dimensions: '430 × 932',
    width: 430,
    height: 932,
    hasDynamicIsland: true,
  },
};
