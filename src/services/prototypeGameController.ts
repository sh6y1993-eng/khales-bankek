import {
  AiDifficulty,
  CardSelectionSource,
  MatchOutcome,
  PlayingCardData,
  PrototypeBoardState,
  Rank,
  SampleRoom,
  Suit,
} from '../types/prototype';

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RANK_VALUES: Record<Rank, number> = {
  A: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
};

let cardSeq = 1;

export function createShuffledDeck(): PlayingCardData[] {
  const deck: PlayingCardData[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `card_${cardSeq++}_${suit}_${rank}`,
        suit,
        rank,
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'spades':
      return '♠';
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
  }
}

export function getSuitLabelAr(suit: Suit): string {
  switch (suit) {
    case 'spades':
      return 'السبيت';
    case 'hearts':
      return 'الهاص';
    case 'diamonds':
      return 'الديمن';
    case 'clubs':
      return 'الشيريا';
  }
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function getNextExpectedCenterRank(pile: PlayingCardData[]): Rank | null {
  if (pile.length === 0) return 'A';
  const topCard = pile[pile.length - 1];
  const currentVal = RANK_VALUES[topCard.rank];
  if (currentVal >= 13) return null;
  return RANKS[currentVal];
}

export function canPlayCardToCenter(
  card: PlayingCardData,
  pile: PlayingCardData[],
  pileIndex: number
): { valid: boolean; reason?: string; expectedRank: Rank | null } {
  const expectedRank = getNextExpectedCenterRank(pile);
  if (!expectedRank) {
    return {
      valid: false,
      expectedRank: null,
      reason: `الكومة ${pileIndex + 1} مكتملة من A إلى K`,
    };
  }
  if (card.rank !== expectedRank) {
    if (pile.length === 0) {
      return {
        valid: false,
        expectedRank,
        reason: `الترتيب مطلوب: الكومة ${pileIndex + 1} فارغة وتبدأ بالآس (A) فقط`,
      };
    }
    const topCard = pile[pile.length - 1];
    return {
      valid: false,
      expectedRank,
      reason: `الترتيب مطلوب: الكومة ${pileIndex + 1} تحتاج ${expectedRank} بعد ${topCard.rank}`,
    };
  }
  return { valid: true, expectedRank };
}

export function canMoveCardToDoor(
  card: PlayingCardData,
  source: CardSelectionSource,
  targetDoorCards: PlayingCardData[],
  targetDoorIndex: number
): { valid: boolean; reason?: string } {
  if (source.zone === 'bank') {
    return {
      valid: false,
      reason: 'كروت البنك تُلعب في الأكوام المركزية فقط بالترتيب التصاعدي (A → K)',
    };
  }
  if (source.zone === 'door' && source.doorIndex === targetDoorIndex) {
    return {
      valid: false,
      reason: 'البطاقة موجودة بالفعل في هذا الباب',
    };
  }
  if (targetDoorCards.length === 0) {
    return { valid: true };
  }

  const topDoor = targetDoorCards[targetDoorCards.length - 1];
  const expectedVal = RANK_VALUES[topDoor.rank] - 1;
  if (expectedVal < 1) {
    return {
      valid: false,
      reason: `الباب ${targetDoorIndex + 1} ينتهي بالآس (A) ولا يقبل بطاقة تحته`,
    };
  }

  const expectedRank = RANKS[expectedVal - 1];
  if (RANK_VALUES[card.rank] !== expectedVal) {
    return {
      valid: false,
      reason: `الترتيب مطلوب: الباب ${targetDoorIndex + 1} يحتاج ${expectedRank} تحت ${topDoor.rank} (ترتيب تنازلي)`,
    };
  }

  return { valid: true };
}

export function createInitialBoardState(options?: {
  matchLabel?: string;
  isAiMatch?: boolean;
  difficulty?: AiDifficulty;
  turnDurationSeconds?: number;
}): PrototypeBoardState {
  const pool = createShuffledDeck();

  const pullRank = (rank: Rank): PlayingCardData => {
    const idx = pool.findIndex((c) => c.rank === rank);
    if (idx !== -1) {
      return pool.splice(idx, 1)[0];
    }
    return pool.pop()!;
  };

  const pullMany = (count: number): PlayingCardData[] => {
    return pool.splice(0, count);
  };

  // Start center piles with valid ascending sequences so ordering rules are clear from turn 1
  const centerPiles: PlayingCardData[][] = [
    [pullRank('A')],
    [pullRank('A'), pullRank('2')],
    [],
    [],
  ];

  // Ensure top Bank card (last item) is '3' so player has an immediate legal Bank->Center move on pile 2
  const bankBase = pullMany(7);
  const topBank = pullRank('3');
  const playerBank = [...bankBase, topBank];

  // Ensure Doors start in strict descending order
  const playerDoors: PlayingCardData[][] = [
    [pullRank('8'), pullRank('7')],
    [pullRank('Q')],
    [pullRank('5'), pullRank('4')],
    [pullRank('9')],
    [pullRank('J')],
  ];

  // Ensure Player Hand starts with at least an Ace + playable sequence cards
  const playerHand: PlayingCardData[] = [
    pullRank('A'),
    pullRank('2'),
    pullRank('6'),
    ...pullMany(2),
  ];

  const opponentDoors: (PlayingCardData | null)[] = [
    pool.pop() ?? null,
    pool.pop() ?? null,
    null,
    pool.pop() ?? null,
    pool.pop() ?? null,
  ];

  const drawPile = pool;

  return {
    matchLabel: options?.matchLabel ?? 'مباراة تجريبية · ضد الكمبيوتر',
    isAiMatch: options?.isAiMatch ?? true,
    difficulty: options?.difficulty ?? 'skilled',
    turnOwner: 'player',
    turnSecondsLeft: options?.turnDurationSeconds ?? 30,
    turnDurationSeconds: options?.turnDurationSeconds ?? 30,
    turnNumber: 1,
    drawPile,
    centerPiles,
    playerHand,
    playerBank,
    playerDoors,
    opponentHandCount: 5,
    opponentBankCount: 8,
    opponentDoors,
    selected: null,
    statusMessage: 'دورك الآن — رتّب الأوراق تصاعدياً في الوسط (A → K) وتنازلياً في الأبواب',
    deckReshuffleCount: 0,
    movesPlayed: 0,
  };
}

export function selectCardInBoard(
  state: PrototypeBoardState,
  card: PlayingCardData,
  source: CardSelectionSource
): PrototypeBoardState {
  if (state.turnOwner !== 'player') {
    return {
      ...state,
      statusMessage: 'انتظر انتهاء دور الخصم أولاً',
    };
  }

  const isSame =
    state.selected?.card.id === card.id &&
    state.selected?.source.zone === source.zone &&
    (source.zone !== 'door' ||
      (state.selected.source.zone === 'door' &&
        state.selected.source.doorIndex === source.doorIndex));

  if (isSame) {
    return {
      ...state,
      selected: null,
      statusMessage: 'تم إلغاء تحديد البطاقة',
    };
  }

  const sourceLabel =
    source.zone === 'hand'
      ? 'اليد'
      : source.zone === 'bank'
      ? 'البنك'
      : `الباب ${source.doorIndex + 1}`;

  const sym = getSuitSymbol(card.suit);
  const hint =
    source.zone === 'bank'
      ? `اختر كومة مركزية تحتاج ${card.rank} بالترتيب`
      : 'اختر كومة مركزية (تصاعدي) أو باباً (تنازلي)';

  return {
    ...state,
    selected: { card, source },
    statusMessage: `تم تحديد ${card.rank}${sym} من ${sourceLabel} — ${hint}`,
  };
}

function removeCardFromSource(
  state: PrototypeBoardState,
  cardId: string,
  source: CardSelectionSource
): {
  playerHand: PlayingCardData[];
  playerBank: PlayingCardData[];
  playerDoors: PlayingCardData[][];
  removed: PlayingCardData | null;
} {
  const playerHand = [...state.playerHand];
  const playerBank = [...state.playerBank];
  const playerDoors = state.playerDoors.map((d) => [...d]);
  let removed: PlayingCardData | null = null;

  if (source.zone === 'hand') {
    const idx = playerHand.findIndex((c) => c.id === cardId);
    if (idx !== -1) {
      [removed] = playerHand.splice(idx, 1);
    }
  } else if (source.zone === 'bank') {
    const top = playerBank[playerBank.length - 1];
    if (top && top.id === cardId) {
      removed = playerBank.pop() ?? null;
    }
  } else if (source.zone === 'door') {
    const pile = playerDoors[source.doorIndex];
    const top = pile?.[pile.length - 1];
    if (top && top.id === cardId) {
      removed = pile.pop() ?? null;
    }
  }

  return { playerHand, playerBank, playerDoors, removed };
}

export function playSelectedToCenter(
  state: PrototypeBoardState,
  pileIndex: number
): PrototypeBoardState {
  if (state.turnOwner !== 'player' || !state.selected) return state;

  const { card, source } = state.selected;
  const targetPile = state.centerPiles[pileIndex] ?? [];
  const check = canPlayCardToCenter(card, targetPile, pileIndex);
  if (!check.valid) {
    return {
      ...state,
      statusMessage: check.reason ?? 'الترتيب غير صحيح لهذه الكومة',
    };
  }

  const { playerHand, playerBank, playerDoors, removed } = removeCardFromSource(
    state,
    card.id,
    source
  );
  if (!removed) return state;

  let drawPile = [...state.drawPile];
  let deckReshuffleCount = state.deckReshuffleCount;
  let completedPile = false;

  const centerPiles = state.centerPiles.map((p, idx) => {
    if (idx !== pileIndex) return [...p];
    const updated = [...p, removed];
    if (removed.rank === 'K') {
      completedPile = true;
      // Recycle completed A..K pile back into draw pile
      const recycled = [...updated];
      for (let i = recycled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [recycled[i], recycled[j]] = [recycled[j], recycled[i]];
      }
      drawPile = [...recycled, ...drawPile];
      deckReshuffleCount += 1;
      return [];
    }
    return updated;
  });

  const bankCleared = playerBank.length === 0;

  let statusMessage = `تم وضع ${removed.rank}${getSuitSymbol(removed.suit)} في الكومة المركزية ${pileIndex + 1}`;
  if (bankCleared) {
    statusMessage = 'تم تفريغ آخر بطاقة في البنك!';
  } else if (completedPile) {
    statusMessage = `اكتملت الكومة ${pileIndex + 1} حتى الملك (K) وفُتحت للآس (A) مجدداً!`;
  }

  return {
    ...state,
    drawPile,
    deckReshuffleCount,
    playerHand,
    playerBank,
    playerDoors,
    centerPiles,
    selected: null,
    movesPlayed: state.movesPlayed + 1,
    statusMessage,
  };
}

export function moveSelectedToDoor(
  state: PrototypeBoardState,
  targetDoorIndex: number
): PrototypeBoardState {
  if (state.turnOwner !== 'player' || !state.selected) return state;
  const { card, source } = state.selected;
  const targetDoorCards = state.playerDoors[targetDoorIndex] ?? [];

  const check = canMoveCardToDoor(card, source, targetDoorCards, targetDoorIndex);
  if (!check.valid) {
    return {
      ...state,
      statusMessage: check.reason ?? 'لا يمكن وضع هذه البطاقة في هذا الباب',
    };
  }

  const { playerHand, playerBank, playerDoors, removed } = removeCardFromSource(
    state,
    card.id,
    source
  );
  if (!removed) return state;

  playerDoors[targetDoorIndex] = [...playerDoors[targetDoorIndex], removed];

  return {
    ...state,
    playerHand,
    playerBank,
    playerDoors,
    selected: null,
    movesPlayed: state.movesPlayed + 1,
    statusMessage: `تم ترتيب ${removed.rank}${getSuitSymbol(removed.suit)} في الباب ${targetDoorIndex + 1}`,
  };
}

export function drawCardToHand(state: PrototypeBoardState): PrototypeBoardState {
  if (state.turnOwner !== 'player') return state;
  if (state.playerHand.length >= 7) {
    return {
      ...state,
      statusMessage: 'وصلت اليد إلى الحد التجريبي للعرض (7 بطاقات) — العب بطاقة أو رتّبها في باب',
    };
  }

  let drawPile = [...state.drawPile];
  let deckReshuffleCount = state.deckReshuffleCount;
  let extraNotice = '';

  if (drawPile.length === 0) {
    drawPile = createShuffledDeck();
    deckReshuffleCount += 1;
    extraNotice = ' (أُنشئت رزمة جديدة تلقائياً)';
  }

  const drawn = drawPile.pop();
  if (!drawn) return state;

  return {
    ...state,
    drawPile,
    playerHand: [...state.playerHand, drawn],
    deckReshuffleCount,
    movesPlayed: state.movesPlayed + 1,
    statusMessage: `سحبت ${drawn.rank}${getSuitSymbol(drawn.suit)} إلى يدك${extraNotice}`,
  };
}

export function sortPlayerHand(state: PrototypeBoardState): PrototypeBoardState {
  const rankOrder = new Map(RANKS.map((r, idx) => [r, idx]));
  const sorted = [...state.playerHand].sort((a, b) => {
    const rDiff = (rankOrder.get(a.rank) ?? 0) - (rankOrder.get(b.rank) ?? 0);
    if (rDiff !== 0) return rDiff;
    return a.suit.localeCompare(b.suit);
  });
  return {
    ...state,
    playerHand: sorted,
    statusMessage: 'تم ترتيب بطاقات اليد',
  };
}

export function endPlayerTurnManually(state: PrototypeBoardState): PrototypeBoardState {
  if (state.turnOwner !== 'player') return state;
  return {
    ...state,
    selected: null,
    turnOwner: 'opponent',
    turnSecondsLeft: state.turnDurationSeconds,
    statusMessage: 'انتهى دورك — الخصم يفكر في حركته...',
  };
}

export function simulateOpponentTurnStep(state: PrototypeBoardState): PrototypeBoardState {
  let drawPile = [...state.drawPile];
  if (drawPile.length === 0) {
    drawPile = createShuffledDeck();
  }

  // Pick a center pile and play the exact next ascending rank so AI also respects card order
  const candidatePiles = state.centerPiles
    .map((pile, idx) => ({ idx, expectedRank: getNextExpectedCenterRank(pile) }))
    .filter((entry): entry is { idx: number; expectedRank: Rank } => entry.expectedRank !== null);

  const chosen =
    candidatePiles[Math.floor(Math.random() * candidatePiles.length)] ?? {
      idx: 0,
      expectedRank: 'A' as Rank,
    };

  const matchIdx = drawPile.findIndex((c) => c.rank === chosen.expectedRank);
  const playedCard: PlayingCardData =
    matchIdx !== -1
      ? drawPile.splice(matchIdx, 1)[0]
      : {
          id: `sim_${Date.now()}_${chosen.expectedRank}`,
          suit: SUITS[Math.floor(Math.random() * SUITS.length)],
          rank: chosen.expectedRank,
        };

  const centerPiles = state.centerPiles.map((p, idx) => {
    if (idx !== chosen.idx) return [...p];
    const updated = [...p, playedCard];
    if (playedCard.rank === 'K') {
      drawPile = [...updated, ...drawPile];
      return [];
    }
    return updated;
  });

  const reduceBank = state.opponentBankCount > 1 && Math.random() > 0.35;
  const opponentBankCount = reduceBank ? state.opponentBankCount - 1 : state.opponentBankCount;

  return {
    ...state,
    drawPile,
    centerPiles,
    opponentBankCount,
    turnOwner: 'player',
    turnNumber: state.turnNumber + 1,
    turnSecondsLeft: state.turnDurationSeconds,
    statusMessage: `لعب الخصم ${playedCard.rank}${getSuitSymbol(playedCard.suit)} بالترتيب في الكومة ${chosen.idx + 1} · دورك الآن`,
  };
}

export function buildMatchOutcome(
  state: PrototypeBoardState,
  winner: 'player' | 'opponent',
  reason: string
): MatchOutcome {
  return {
    winner,
    reason,
    remainingPlayerBank: winner === 'player' ? 0 : state.playerBank.length,
    remainingOpponentBank: winner === 'opponent' ? 0 : state.opponentBankCount,
    turnsPlayed: state.turnNumber,
    movesPlayed: state.movesPlayed,
  };
}

export const SAMPLE_MULTIPLAYER_ROOMS: SampleRoom[] = [
  {
    code: 'KH-482',
    name: 'مجلس الرياض السريع',
    hostName: 'فيصل العتيبي',
    playersCount: 1,
    maxPlayers: 2,
    turnDurationSeconds: 30,
    isLocked: false,
  },
  {
    code: 'KH-915',
    name: 'تحدي المهرة',
    hostName: 'نورة القحطاني',
    playersCount: 1,
    maxPlayers: 2,
    turnDurationSeconds: 15,
    isLocked: false,
  },
  {
    code: 'KH-307',
    name: 'طاولة خاصة للأصدقاء',
    hostName: 'سعد الدوسري',
    playersCount: 2,
    maxPlayers: 2,
    turnDurationSeconds: 45,
    isLocked: true,
  },
];
