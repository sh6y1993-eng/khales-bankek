export const DESIGN_ASSETS = {
  emblem: '/src/assets/images/khalas_emblem_1794926850416.jpg',
  splashBackdrop: '/src/assets/images/khalas_splash_bg_1794929733552.jpg',
  cardBack: '/src/assets/images/card_back_pattern_1794926852294.jpg',
  avatarPlayer: '/src/assets/images/avatar_player_1794926853140.jpg',
  avatarOpponent: '/src/assets/images/avatar_opponent_1794926852888.jpg',
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
