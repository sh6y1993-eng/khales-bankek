export interface DoorCardLayoutMetrics {
  cardWidthPx: number;
  cardHeightPx: number;
  cascadeOffsetPx: number;
  maxVisibleLayers: number;
  compactText: boolean;
}

export interface HandCardLayoutMetrics {
  cardWidthPx: number;
  cardHeightPx: number;
  gapPx: number;
  compactText: boolean;
}

/**
 * Computes responsive card dimensions and stack cascade spacing for each door
 * based on the total number of doors (e.g. 5) and the card count inside each door,
 * preventing vertical overflow or element clipping on compact iPhone screens.
 */
export function computeDoorCardMetrics(
  totalDoors: number,
  cardsInDoor: number,
  maxCardsAcrossDoors: number,
  viewportWidthPx = 393
): DoorCardLayoutMetrics {
  const horizontalPadding = 24;
  const gapPx = 8;
  const availableWidth = Math.max(300, viewportWidthPx - horizontalPadding);
  const slotWidth = Math.floor((availableWidth - gapPx * (totalDoors - 1)) / totalDoors);

  // Base door card width clamped safely for 5 doors side-by-side
  let cardWidthPx = Math.min(62, Math.max(48, slotWidth - 2));
  let cardHeightPx = Math.round(cardWidthPx * 1.32);

  // Automatically scale down card height & tighten cascade when a door accumulates many cards
  if (cardsInDoor >= 5 || maxCardsAcrossDoors >= 5) {
    cardWidthPx = Math.max(46, cardWidthPx - 6);
    cardHeightPx = Math.round(cardWidthPx * 1.24);
  } else if (cardsInDoor >= 3 || maxCardsAcrossDoors >= 3) {
    cardWidthPx = Math.max(48, cardWidthPx - 3);
    cardHeightPx = Math.round(cardWidthPx * 1.28);
  }

  const maxVisibleLayers = Math.min(cardsInDoor, 3);
  const cascadeOffsetPx =
    cardsInDoor <= 1 ? 0 : cardsInDoor === 2 ? 7 : cardsInDoor === 3 ? 6 : 5;

  return {
    cardWidthPx,
    cardHeightPx,
    cascadeOffsetPx,
    maxVisibleLayers,
    compactText: cardWidthPx <= 50,
  };
}

/**
 * Computes non-overlapping, spaced card sizes for the player's hand
 * based on the number of cards currently held.
 */
export function computeHandCardMetrics(
  handLength: number,
  viewportWidthPx = 393
): HandCardLayoutMetrics {
  const safeWidth = Math.max(320, viewportWidthPx - 28);
  const count = Math.max(1, handLength);

  // Guarantee positive spacing so cards never overlap each other
  const gapPx = count <= 4 ? 10 : count === 5 ? 7 : 5;
  const totalGap = gapPx * (count - 1);
  const rawCardWidth = Math.floor((safeWidth - totalGap) / count);

  const cardWidthPx = Math.min(66, Math.max(44, rawCardWidth));
  const cardHeightPx = Math.round(cardWidthPx * 1.38);

  return {
    cardWidthPx,
    cardHeightPx,
    gapPx,
    compactText: cardWidthPx < 52,
  };
}
