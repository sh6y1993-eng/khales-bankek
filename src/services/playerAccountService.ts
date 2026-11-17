import { UserProfile } from '../types/prototype';
import { HOME_SCREEN_ASSETS, DESIGN_ASSETS } from '../theme/designTokens';

export interface PlayerAccountsMap {
  [accountId: string]: UserProfile;
}

const STORAGE_KEY = 'khalas_bankak_accounts_v2';
const ACTIVE_ACCOUNT_KEY = 'khalas_bankak_active_account_v2';

export const INITIAL_PLAYER_ACCOUNTS: PlayerAccountsMap = {
  ahmed: {
    name: 'أحمد',
    handle: '@ahmed_kw',
    isGuest: false,
    avatar: HOME_SCREEN_ASSETS.profileAvatar,
    demoMatchesPlayed: 24,
    demoWins: 19,
    level: 12,
    coins: 25400,
    xp: 3200,
    maxXp: 5000,
    notificationsCount: 3,
  },
  sultan: {
    name: 'سلطان المري',
    handle: '@sultan_pro',
    isGuest: false,
    avatar: HOME_SCREEN_ASSETS.profileAvatar,
    demoMatchesPlayed: 12,
    demoWins: 8,
    level: 7,
    coins: 14850,
    xp: 1900,
    maxXp: 5000,
    notificationsCount: 1,
  },
  guest: {
    name: 'ضيف خلّص بنكك',
    handle: '@guest_player',
    isGuest: true,
    avatar: HOME_SCREEN_ASSETS.profileAvatar,
    demoMatchesPlayed: 1,
    demoWins: 0,
    level: 1,
    coins: 2500,
    xp: 600,
    maxXp: 5000,
    notificationsCount: 2,
  },
};

export function createAccountKeyFromName(name: string, isGuest: boolean): string {
  if (isGuest) return 'guest';
  const trimmed = name.trim();
  if (trimmed === 'أحمد' || trimmed.toLowerCase() === 'ahmed') return 'ahmed';
  if (trimmed === 'سلطان المري' || trimmed.includes('سلطان')) return 'sultan';
  return `user_${trimmed.replace(/\s+/g, '_').toLowerCase()}`;
}

export function loadAccountsStore(): {
  accounts: PlayerAccountsMap;
  activeId: string;
} {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const savedActive = window.localStorage.getItem(ACTIVE_ACCOUNT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlayerAccountsMap;
        if (parsed && typeof parsed === 'object' && parsed.ahmed && parsed.sultan) {
          const activeId = savedActive && parsed[savedActive] ? savedActive : 'ahmed';
          return { accounts: parsed, activeId };
        }
      }
    }
  } catch {
    // Fallback to in-memory initial accounts if localStorage is restricted
  }
  return {
    accounts: {
      ahmed: { ...INITIAL_PLAYER_ACCOUNTS.ahmed },
      sultan: { ...INITIAL_PLAYER_ACCOUNTS.sultan },
      guest: { ...INITIAL_PLAYER_ACCOUNTS.guest },
    },
    activeId: 'ahmed',
  };
}

export function saveAccountsStore(accounts: PlayerAccountsMap, activeId: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
      window.localStorage.setItem(ACTIVE_ACCOUNT_KEY, activeId);
    }
  } catch {
    // Ignore storage quota errors in sandboxed iframes
  }
}

export function resolveOrCreateAccount(
  accounts: PlayerAccountsMap,
  name: string,
  isGuest: boolean
): { nextAccounts: PlayerAccountsMap; accountId: string; profile: UserProfile } {
  const accountId = createAccountKeyFromName(name, isGuest);
  if (accounts[accountId]) {
    const existing = {
      ...accounts[accountId],
      name: name.trim() || accounts[accountId].name,
      isGuest,
    };
    const nextAccounts = { ...accounts, [accountId]: existing };
    return { nextAccounts, accountId, profile: existing };
  }

  const freshProfile: UserProfile = {
    name: name.trim() || 'لاعب جديد',
    handle: isGuest ? '@guest_player' : `@${accountId}`,
    isGuest,
    avatar: HOME_SCREEN_ASSETS.profileAvatar,
    demoMatchesPlayed: 0,
    demoWins: 0,
    level: 1,
    coins: 3000,
    xp: 500,
    maxXp: 5000,
    notificationsCount: 1,
  };
  const nextAccounts = { ...accounts, [accountId]: freshProfile };
  return { nextAccounts, accountId, profile: freshProfile };
}

export function applyProgressionRewardToProfile(
  profile: UserProfile,
  addedCoins: number,
  addedXp: number,
  matchesDelta = 0,
  winsDelta = 0
): UserProfile {
  let nextXp = profile.xp + addedXp;
  let nextLevel = profile.level;
  const maxXp = profile.maxXp || 5000;

  while (nextXp >= maxXp) {
    nextXp -= maxXp;
    nextLevel += 1;
  }

  return {
    ...profile,
    coins: Math.max(0, profile.coins + addedCoins),
    xp: Math.max(0, nextXp),
    level: nextLevel,
    demoMatchesPlayed: profile.demoMatchesPlayed + matchesDelta,
    demoWins: profile.demoWins + winsDelta,
  };
}
