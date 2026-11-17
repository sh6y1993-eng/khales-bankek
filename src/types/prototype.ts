export type ScreenId =
  | 'splash'
  | 'auth'
  | 'home'
  | 'mode-select'
  | 'ai-setup'
  | 'multiplayer-hub'
  | 'create-room'
  | 'join-room'
  | 'room-lobby'
  | 'game-board'
  | 'results'
  | 'profile';

export type IPhoneViewportId = 'se' | 'standard' | 'promax';

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';

export interface PlayingCardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type CardSelectionSource =
  | { zone: 'hand' }
  | { zone: 'bank' }
  | { zone: 'door'; doorIndex: number };

export interface SelectedCardRef {
  card: PlayingCardData;
  source: CardSelectionSource;
}

export type AiDifficulty = 'beginner' | 'skilled' | 'pro';

export type TurnOwner = 'player' | 'opponent';

export interface PrototypeBoardState {
  matchLabel: string;
  isAiMatch: boolean;
  difficulty: AiDifficulty;
  turnOwner: TurnOwner;
  turnSecondsLeft: number;
  turnDurationSeconds: number;
  turnNumber: number;
  drawPile: PlayingCardData[];
  centerPiles: PlayingCardData[][];
  playerHand: PlayingCardData[];
  playerBank: PlayingCardData[];
  playerDoors: PlayingCardData[][];
  opponentHandCount: number;
  opponentBankCount: number;
  opponentDoors: (PlayingCardData | null)[];
  selected: SelectedCardRef | null;
  statusMessage: string;
  deckReshuffleCount: number;
  movesPlayed: number;
  hasMovedHandToDoorThisTurn: boolean;
}

export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  avatar: string;
}

export interface RoomConfig {
  code: string;
  name: string;
  isLocked: boolean;
  isPrivate: boolean;
  turnDurationSeconds: number;
  allowSpectators: boolean;
  players: RoomPlayer[];
}

export interface SampleRoom {
  code: string;
  name: string;
  hostName: string;
  playersCount: number;
  maxPlayers: number;
  turnDurationSeconds: number;
  isLocked: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  isGuest: boolean;
  avatar: string;
  demoMatchesPlayed: number;
  demoWins: number;
  level: number;
  coins: number;
  xp: number;
  maxXp: number;
  notificationsCount: number;
}

export type BoardStyle = 'table3d' | 'classic';

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  preferredTurnSeconds: number;
  largeCardText: boolean;
  boardStyle: BoardStyle;
}

export interface MatchOutcome {
  winner: 'player' | 'opponent';
  reason: string;
  remainingPlayerBank: number;
  remainingOpponentBank: number;
  turnsPlayed: number;
  movesPlayed: number;
}

export interface ScreenMeta {
  id: ScreenId;
  order: number;
  title: string;
  subtitle: string;
}

export const ALL_SCREENS: ScreenMeta[] = [
  { id: 'splash', order: 1, title: 'شاشة البداية', subtitle: 'الهوية والافتتاحية' },
  { id: 'auth', order: 2, title: 'تسجيل الدخول والحساب', subtitle: 'دخول تجريبي / ضيف' },
  { id: 'home', order: 3, title: 'الشاشة الرئيسية', subtitle: 'مركز الانطلاق' },
  { id: 'mode-select', order: 4, title: 'اختيار نمط اللعب', subtitle: 'فردي أم جماعي' },
  { id: 'ai-setup', order: 5, title: 'اللعب ضد الكمبيوتر', subtitle: 'المستوى والمؤقت' },
  { id: 'multiplayer-hub', order: 6, title: 'اللعب الجماعي', subtitle: 'الغرف المتاحة' },
  { id: 'create-room', order: 7, title: 'إنشاء غرفة', subtitle: 'تخصيص الجلسة' },
  { id: 'join-room', order: 8, title: 'الانضمام إلى غرفة', subtitle: 'إدخال رمز الغرفة' },
  { id: 'room-lobby', order: 9, title: 'انتظار اللاعبين', subtitle: 'فتح وإغلاق الغرفة' },
  { id: 'game-board', order: 10, title: 'لوحة اللعب', subtitle: 'التجربة التفاعلية الأساسية' },
  { id: 'results', order: 11, title: 'الفوز والخسارة', subtitle: 'ملخص انتهاء الجولة' },
  { id: 'profile', order: 12, title: 'الملف الشخصي والإعدادات', subtitle: 'التفضيلات والحساب' },
];
