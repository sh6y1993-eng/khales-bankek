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

export function isDescendingCenterPile(pileIndex: number): boolean {
  // Piles 0 and 1 start with A and go ascending (A -> K)
  // Piles 2 and 3 start with K and go descending (K -> A)
  return pileIndex >= 2;
}

export function getNextExpectedCenterRank(
  pile: PlayingCardData[],
  pileIndex = 0
): Rank | null {
  const isDescending = isDescendingCenterPile(pileIndex);
  if (pile.length === 0) {
    return isDescending ? 'K' : 'A';
  }
  const topCard = pile[pile.length - 1];
  const currentVal = RANK_VALUES[topCard.rank];
  if (isDescending) {
    if (currentVal <= 1) return null;
    return RANKS[currentVal - 2];
  }
  if (currentVal >= 13) return null;
  return RANKS[currentVal];
}

export function canPlayCardToCenter(
  card: PlayingCardData,
  pile: PlayingCardData[],
  pileIndex: number
): { valid: boolean; reason?: string; expectedRank: Rank | null } {
  const isDescending = isDescendingCenterPile(pileIndex);
  const pileLabel = isDescending
    ? `الكومة ${pileIndex + 1} التنازلية (K → A)`
    : `الكومة ${pileIndex + 1} التصاعدية (A → K)`;
  const expectedRank = getNextExpectedCenterRank(pile, pileIndex);
  if (!expectedRank) {
    return {
      valid: false,
      expectedRank: null,
      reason: `${pileLabel} مكتملة`,
    };
  }
  if (card.rank !== expectedRank) {
    if (pile.length === 0) {
      return {
        valid: false,
        expectedRank,
        reason: `الترتيب مطلوب: ${pileLabel} تبدأ ببطاقة (${expectedRank}) فقط`,
      };
    }
    const topCard = pile[pile.length - 1];
    return {
      valid: false,
      expectedRank,
      reason: `الترتيب مطلوب: ${pileLabel} تحتاج ${expectedRank} فوق ${topCard.rank}`,
    };
  }
  return { valid: true, expectedRank };
}

export function canMoveCardToDoor(
  _card: PlayingCardData,
  source: CardSelectionSource,
  _targetDoorCards: PlayingCardData[],
  targetDoorIndex: number
): { valid: boolean; reason?: string } {
  if (source.zone === 'bank') {
    return {
      valid: false,
      reason: 'أوراق البنك تُلعب في كومات اللعب الأربع بالوسط فقط (تصاعدياً A→K أو تنازلياً K→A)',
    };
  }
  if (source.zone === 'door' && source.doorIndex === targetDoorIndex) {
    return {
      valid: false,
      reason: 'البطاقة موجودة بالفعل في هذا الباب',
    };
  }
  // Doors accept any card freely without ascending/descending rank restriction
  return { valid: true };
}

export function createInitialBoardState(options?: {
  matchLabel?: string;
  isAiMatch?: boolean;
  difficulty?: AiDifficulty;
  turnDurationSeconds?: number;
}): PrototypeBoardState {
  // Use 2 shuffled decks so all 4 center piles (2 starting at A, 2 starting at K), banks, hands, and doors have full rank coverage
  const pool = [...createShuffledDeck(), ...createShuffledDeck()];

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

  // 4 Center Play Piles — NONE empty at game start:
  // Piles 0 & 1: Two piles starting with 'A' (Ascending: A -> 2 -> 3 -> ... -> K)
  // Piles 2 & 3: Two piles starting with 'K' (Descending: K -> Q -> J -> ... -> A)
  const centerPiles: PlayingCardData[][] = [
    [pullRank('A')],
    [pullRank('A')],
    [pullRank('K')],
    [pullRank('K')],
  ];

  // Top Bank card is '2' so player has an immediate legal Bank->Center move onto either 'A' pile (or 'Q' onto 'K')
  const bankBase = pullMany(9);
  const topBank = pullRank('2');
  const playerBank = [...bankBase, topBank];

  // All 5 Player Doors populated at start
  const playerDoors: PlayingCardData[][] = [
    [pullRank('7')],
    [pullRank('Q')],
    [pullRank('4')],
    [pullRank('9')],
    [pullRank('J')],
  ];

  // Player Hand starts with 5 cards including playable ascending ('2', '3') & descending ('Q', 'J') cards
  const playerHand: PlayingCardData[] = [
    pullRank('2'),
    pullRank('Q'),
    pullRank('3'),
    pullRank('J'),
    pullRank('6'),
  ];

  // All 5 Opponent Doors populated at start
  const opponentDoors: (PlayingCardData | null)[] = [
    pool.pop() ?? null,
    pool.pop() ?? null,
    pool.pop() ?? null,
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
    opponentBankCount: 10,
    opponentDoors,
    selected: null,
    statusMessage: 'دورك الآن — كومتان تبدآن بـ (A ↑ K) وكومتان تبدآن بـ (K ↓ A)، والأبواب حرة',
    deckReshuffleCount: 0,
    movesPlayed: 0,
    hasMovedHandToDoorThisTurn: false,
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
      ? `اختر كومة لعب تقبل ${card.rank} (تصاعدياً A→K أو تنازلياً K→A)`
      : 'اختر كومة لعب بالوسط (تصاعدي/تنازلي) أو ضعها على أي باب';

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
  const isDescending = isDescendingCenterPile(pileIndex);
  const completingRank: Rank = isDescending ? 'A' : 'K';

  const centerPiles = state.centerPiles.map((p, idx) => {
    if (idx !== pileIndex) return [...p];
    const updated = [...p, removed];
    if (removed.rank === completingRank) {
      completedPile = true;
      // Recycle completed pile back into draw pile and keep starting card (A or K) so pile is never empty
      const starterRank: Rank = isDescending ? 'K' : 'A';
      const recycled = [...updated];
      for (let i = recycled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [recycled[i], recycled[j]] = [recycled[j], recycled[i]];
      }
      const starterIdx = recycled.findIndex((c) => c.rank === starterRank);
      const starterCard =
        starterIdx !== -1 ? recycled.splice(starterIdx, 1)[0] : recycled.pop()!;
      drawPile = [...recycled, ...drawPile];
      deckReshuffleCount += 1;
      return [starterCard];
    }
    return updated;
  });

  const bankCleared = playerBank.length === 0;
  const pileLabel = isDescending
    ? `الكومة ${pileIndex + 1} التنازلية (K→A)`
    : `الكومة ${pileIndex + 1} التصاعدية (A→K)`;

  let statusMessage = `تم وضع ${removed.rank}${getSuitSymbol(removed.suit)} في ${pileLabel}`;
  if (bankCleared) {
    statusMessage = 'تم تفريغ آخر بطاقة في البنك!';
  } else if (completedPile) {
    statusMessage = isDescending
      ? `اكتملت ${pileLabel} حتى الآس (A) وبدأت من الملك (K) مجدداً!`
      : `اكتملت ${pileLabel} حتى الملك (K) وبدأت من الآس (A) مجدداً!`;
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
  const movedHandToDoor = state.hasMovedHandToDoorThisTurn || source.zone === 'hand';

  return {
    ...state,
    playerHand,
    playerBank,
    playerDoors,
    selected: null,
    movesPlayed: state.movesPlayed + 1,
    hasMovedHandToDoorThisTurn: movedHandToDoor,
    statusMessage: `تم وضع ${removed.rank}${getSuitSymbol(removed.suit)} في الباب ${targetDoorIndex + 1}`,
  };
}

export function drawCardToHand(state: PrototypeBoardState): PrototypeBoardState {
  if (state.turnOwner !== 'player') return state;
  if (state.playerHand.length >= 7) {
    return {
      ...state,
      statusMessage: 'وصلت اليد إلى الحد التجريبي للعرض (7 بطاقات) — العب بطاقة أو ضعها في باب',
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

export function canEndPlayerTurn(state: PrototypeBoardState): {
  allowed: boolean;
  reason?: string;
} {
  if (state.turnOwner !== 'player') {
    return { allowed: false, reason: 'الدور الآن للخصم' };
  }
  if (!state.hasMovedHandToDoorThisTurn && state.playerHand.length > 0) {
    return {
      allowed: false,
      reason: 'لا يطوف دورك قبل نقل ورقة واحدة على الأقل من يدك إلى أحد الأبواب',
    };
  }
  return { allowed: true };
}

function autoMoveOneHandCardToDoor(state: PrototypeBoardState): {
  nextState: PrototypeBoardState;
  movedCard: PlayingCardData | null;
  doorIndex: number | null;
} {
  if (state.playerHand.length === 0) {
    return { nextState: state, movedCard: null, doorIndex: null };
  }

  // Pick the door with the fewest cards (or empty door first) and place a card from hand
  let chosenDoorIndex = 0;
  let minLen = Infinity;
  state.playerDoors.forEach((d, idx) => {
    if (d.length < minLen) {
      minLen = d.length;
      chosenDoorIndex = idx;
    }
  });

  const playerHand = [...state.playerHand];
  const [movedCard] = playerHand.splice(0, 1);
  if (!movedCard) {
    return { nextState: state, movedCard: null, doorIndex: null };
  }

  const playerDoors = state.playerDoors.map((d, idx) =>
    idx === chosenDoorIndex ? [...d, movedCard] : [...d]
  );

  return {
    movedCard,
    doorIndex: chosenDoorIndex,
    nextState: {
      ...state,
      playerHand,
      playerDoors,
      selected: null,
      movesPlayed: state.movesPlayed + 1,
      hasMovedHandToDoorThisTurn: true,
    },
  };
}

export function endPlayerTurnManually(state: PrototypeBoardState): PrototypeBoardState {
  if (state.turnOwner !== 'player') return state;
  const check = canEndPlayerTurn(state);
  if (!check.allowed) {
    return {
      ...state,
      statusMessage:
        check.reason ?? 'لا يطوف دورك قبل نقل ورقة من يدك إلى أحد الأبواب',
    };
  }
  return {
    ...state,
    selected: null,
    turnOwner: 'opponent',
    turnSecondsLeft: state.turnDurationSeconds,
    statusMessage: 'انتهى دورك — الخصم يفكر في حركته...',
  };
}

export function autoPassPlayerTurnOnTimeout(state: PrototypeBoardState): PrototypeBoardState {
  if (state.turnOwner !== 'player') return state;

  if (!state.hasMovedHandToDoorThisTurn && state.playerHand.length > 0) {
    const { nextState, movedCard, doorIndex } = autoMoveOneHandCardToDoor(state);
    if (movedCard && doorIndex !== null) {
      return {
        ...nextState,
        selected: null,
        turnOwner: 'opponent',
        turnSecondsLeft: nextState.turnDurationSeconds,
        statusMessage: `انتهى الوقت — وضع الكمبيوتر تلقائياً ${movedCard.rank}${getSuitSymbol(movedCard.suit)} في الباب ${doorIndex + 1} وانتقل الدور للخصم`,
      };
    }
  }

  return {
    ...state,
    selected: null,
    turnOwner: 'opponent',
    turnSecondsLeft: state.turnDurationSeconds,
    statusMessage: 'انتهى وقت دورك — انتقل الدور إلى الخصم',
  };
}

export function simulateOpponentTurnStep(state: PrototypeBoardState): PrototypeBoardState {
  let drawPile = [...state.drawPile];
  let deckReshuffleCount = state.deckReshuffleCount;

  if (drawPile.length === 0) {
    drawPile = createShuffledDeck();
    deckReshuffleCount += 1;
  }

  // Pick one of the 4 center piles and play the exact next rank (Ascending on 0,1 and Descending on 2,3)
  const candidatePiles = state.centerPiles
    .map((pile, idx) => ({ idx, expectedRank: getNextExpectedCenterRank(pile, idx) }))
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
    const isDescending = isDescendingCenterPile(idx);
    const completingRank: Rank = isDescending ? 'A' : 'K';
    if (playedCard.rank === completingRank) {
      const starterRank: Rank = isDescending ? 'K' : 'A';
      const recycled = [...updated];
      const starterIdx = recycled.findIndex((c) => c.rank === starterRank);
      const starterCard =
        starterIdx !== -1 ? recycled.splice(starterIdx, 1)[0] : recycled.pop()!;
      drawPile = [...recycled, ...drawPile];
      deckReshuffleCount += 1;
      return [starterCard];
    }
    return updated;
  });

  const reduceBank = state.opponentBankCount > 1 && Math.random() > 0.35;
  const opponentBankCount = reduceBank ? state.opponentBankCount - 1 : state.opponentBankCount;

  // Replenish player hand from drawPile up to 5 cards whenever turn returns to player
  const playerHand = [...state.playerHand];
  let replenishedCount = 0;
  while (playerHand.length < 5) {
    if (drawPile.length === 0) {
      drawPile = createShuffledDeck();
      deckReshuffleCount += 1;
    }
    const nextCard = drawPile.pop();
    if (!nextCard) break;
    playerHand.push(nextCard);
    replenishedCount += 1;
  }

  const replenishNote =
    replenishedCount > 0 ? ` · تم سحب ${replenishedCount} لإكمال يدك إلى 5 أوراق` : '';
  const pileLabel = isDescendingCenterPile(chosen.idx)
    ? `الكومة ${chosen.idx + 1} (تنازلية)`
    : `الكومة ${chosen.idx + 1} (تصاعدية)`;

  return {
    ...state,
    drawPile,
    deckReshuffleCount,
    centerPiles,
    playerHand,
    opponentBankCount,
    turnOwner: 'player',
    turnNumber: state.turnNumber + 1,
    turnSecondsLeft: state.turnDurationSeconds,
    hasMovedHandToDoorThisTurn: false,
    statusMessage: `لعب الخصم ${playedCard.rank}${getSuitSymbol(playedCard.suit)} في ${pileLabel} · دورك الآن${replenishNote}`,
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
