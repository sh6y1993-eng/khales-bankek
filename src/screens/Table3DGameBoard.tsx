import React, { useEffect, useRef, useState } from 'react';
import {
  Pause,
  BookOpen,
  Clock,
  ArrowUpDown,
  Vault,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Lock,
} from 'lucide-react';
import {
  CardSelectionSource,
  PlayingCardData,
  PrototypeBoardState,
} from '../types/prototype';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { PlayingCard } from '../components/ui/PlayingCard';
import {
  computeDoorCardMetrics,
  computeHandCardMetrics,
} from '../utils/cardLayoutMath';
import {
  canMoveCardToDoor,
  canPlayCardToCenter,
} from '../services/prototypeGameController';

interface Table3DGameBoardProps {
  board: PrototypeBoardState;
  playerName: string;
  playerAvatar: string;
  largeCardText: boolean;
  onSelectCard: (card: PlayingCardData, source: CardSelectionSource) => void;
  onPlayToCenter: (pileIndex: number) => void;
  onMoveToDoor: (doorIndex: number) => void;
  onDrawCard: () => void;
  onSortHand: () => void;
  onEndTurn: () => void;
  onResetBoard: () => void;
  onRequestExit: () => void;
  onOpenRules: () => void;
  onSimulateOutcome: (winner: 'player' | 'opponent') => void;
  onSwitchToClassic: () => void;
}

export const Table3DGameBoard: React.FC<Table3DGameBoardProps> = ({
  board,
  playerName,
  playerAvatar,
  largeCardText,
  onSelectCard,
  onPlayToCenter,
  onMoveToDoor,
  onDrawCard,
  onSortHand,
  onEndTurn,
  onResetBoard,
  onRequestExit,
  onOpenRules,
  onSimulateOutcome,
  onSwitchToClassic,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(393);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setBoardWidth(el.clientWidth || 393);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setBoardWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isPlayerTurn = board.turnOwner === 'player';
  const hasSelected = board.selected !== null;
  const topBankCard = board.playerBank[board.playerBank.length - 1] ?? null;

  const maxCardsAcrossDoors = Math.max(
    1,
    ...board.playerDoors.map((d) => d.length)
  );
  // Hand now spans full width (minus optional avatar on wide Pro Max) since Bank moved onto the table
  const handAvailableWidth = Math.max(280, boardWidth - (boardWidth >= 420 ? 88 : 28));
  const handMetrics = computeHandCardMetrics(board.playerHand.length, handAvailableWidth);

  const isCardSelected = (cardId: string, zone: CardSelectionSource['zone'], doorIdx?: number) => {
    if (!board.selected) return false;
    if (board.selected.card.id !== cardId || board.selected.source.zone !== zone) return false;
    if (zone === 'door' && board.selected.source.zone === 'door') {
      return board.selected.source.doorIndex === doorIdx;
    }
    return true;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col min-h-0 relative select-none diwaniya-tiles overflow-hidden"
    >
      {/* Top Corners HUD */}
      <header className="shrink-0 px-2.5 pt-2 pb-1 flex items-start justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="قائمة المباراة"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-[#081A28]/85 border border-white/15 text-white hover:border-[#E6B95E]"
          >
            <Pause className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            aria-label="دليل الطاولة"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-[#081A28]/85 border border-white/15 text-[#E6B95E] hover:border-[#E6B95E]"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onSwitchToClassic}
            className="min-h-[38px] px-2.5 rounded-xl bg-[#081A28]/90 border border-[#E6B95E]/55 text-[11px] font-bold text-[#F7F3E9] flex items-center gap-1 hover:bg-[#0E2B42] transition-colors whitespace-nowrap"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#E6B95E]" />
            <span>التصميم السابق</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#081A28]/90 border border-white/15 px-2.5 py-1 min-w-[122px]">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold tabular-nums">
            <span className="text-[#38BDF8]">{board.playerBank.length}</span>
            <span className="flex items-center gap-1 font-mono text-white">
              <Clock className="w-3 h-3 text-[#E6B95E]" />
              <span>{board.turnSecondsLeft}</span>
            </span>
            <span className="text-[#FB923C]">{board.opponentBankCount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-semibold">
            <span className={isPlayerTurn ? 'text-[#34D399]' : 'text-[#FBBF24]'}>
              {isPlayerTurn ? 'دورك' : 'دور الخصم'}
            </span>
            <span className="text-white/70 tabular-nums">دور {board.turnNumber}</span>
          </div>
        </div>
      </header>

      {/* Dropdown Match Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-3 left-3 z-40 rounded-2xl bg-[#0B2234] border border-[#E6B95E]/45 p-3 shadow-2xl space-y-2 animate-fade-scale">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="font-display text-xs font-bold text-white">خيارات معاينة الطاولة</span>
            <span className="text-[11px] text-white/70">{board.matchLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onSimulateOutcome('player');
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#081A28] border border-[#10B981]/50 text-xs font-bold text-[#34D399] flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>معاينة الفوز</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onSimulateOutcome('opponent');
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#081A28] border border-[#C8322B]/50 text-xs font-bold text-[#F87171] flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>معاينة الخسارة</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetBoard();
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#081A28] border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#E6B95E]" />
              <span>توزيع جديد</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onRequestExit();
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#C8322B]/25 border border-[#C8322B]/50 text-xs font-bold text-[#FCA5A5]"
            >
              إنهاء والخروج
            </button>
          </div>
        </div>
      )}

      {/* Main Perspective Table Stage */}
      <div className="flex-1 min-h-0 flex flex-col justify-between px-3 pb-2 pt-0.5 overflow-y-auto iphone-scroll gap-2">
        {/* 1. OPPONENT SEAT AT TOP */}
        <section aria-label="الخصم" className="shrink-0 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 shadow-md ${
                  !isPlayerTurn ? 'border-[#FBBF24]' : 'border-[#081A28]'
                }`}
              >
                <AssetImage
                  src={DESIGN_ASSETS.avatarOpponent}
                  alt="الخصم"
                  className="w-full h-full object-cover"
                  fallbackLabel="الخصم"
                />
              </div>
              <span className="-mt-1.5 px-2 py-0.5 rounded bg-[#081A28] text-[10px] font-bold text-white shadow">
                {board.isAiMatch ? 'حكيم الآلي' : 'الخصم'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(board.opponentHandCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-6 rounded border border-white/55 overflow-hidden bg-[#1D6396] shadow"
                >
                  <AssetImage
                    src={DESIGN_ASSETS.cardBack}
                    alt="ورقة خصم"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Opponent 5 Doors */}
          <div className="mt-1 w-full max-w-[330px] grid grid-cols-5 gap-1.5">
            {board.opponentDoors.map((card, idx) => (
              <div
                key={idx}
                className="h-5 rounded bg-[#081A28]/80 border border-white/15 flex items-center justify-center text-[10px] font-display font-bold tabular-nums"
              >
                {card ? (
                  <span
                    className={
                      card.suit === 'hearts' || card.suit === 'diamonds'
                        ? 'text-[#FCA5A5]'
                        : 'text-white'
                    }
                  >
                    {card.rank}
                    {card.suit === 'hearts'
                      ? '♥'
                      : card.suit === 'diamonds'
                      ? '♦'
                      : card.suit === 'spades'
                      ? '♠'
                      : '♣'}
                  </span>
                ) : (
                  <span className="text-white/35 text-[9px]">باب {idx + 1}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. EXPANDED CENTER TABLETOP ARENA: DRAW (RIGHT) + 2x2 CENTER PILES + PLAYER BANK (LEFT) */}
        <section
          aria-label="الأكوام المركزية"
          className="flex-[1.35] min-h-[196px] flex items-center justify-center py-1"
        >
          <div className="w-full h-full min-h-[188px] rounded-2xl table-slab-3d px-3 py-3.5 flex items-center justify-between gap-3 relative">
            {/* Right Edge: Draw Pile */}
            <button
              type="button"
              onClick={isPlayerTurn ? onDrawCard : undefined}
              disabled={!isPlayerTurn}
              className="shrink-0 flex flex-col items-center gap-1.5 min-w-[52px] group"
            >
              <div className="w-[46px] h-[66px] rounded-xl overflow-hidden border border-[#E6B95E]/70 shadow-lg group-active:scale-95 transition-transform">
                <AssetImage
                  src={DESIGN_ASSETS.cardBack}
                  alt="كومة السحب"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-white/95 tabular-nums">
                سحب ({board.drawPile.length})
              </span>
            </button>

            {/* Dead Center: 4 Center Piles (2 starting with A ascending, 2 starting with K descending) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-2.5 justify-items-center">
                {board.centerPiles.map((pile, idx) => {
                  const topCard = pile[pile.length - 1] ?? null;
                  const isDescending = idx >= 2;
                  const isValidCenterTarget =
                    hasSelected &&
                    isPlayerTurn &&
                    canPlayCardToCenter(board.selected!.card, pile, idx).valid;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-0.5">
                      <PlayingCard
                        card={topCard}
                        size="sm"
                        largeText={largeCardText}
                        playableHighlight={isValidCenterTarget}
                        onClick={hasSelected && isPlayerTurn ? () => onPlayToCenter(idx) : undefined}
                        emptyLabel={isDescending ? `كومة ${idx + 1} · K` : `كومة ${idx + 1} · A`}
                        badgeText={pile.length > 1 ? `${pile.length}` : undefined}
                      />
                      <span className="text-[9px] font-bold text-white/80 tabular-nums whitespace-nowrap">
                        {isDescending ? 'تنازلي K↓A' : 'تصاعدي A↑K'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left Edge: Player Bank Vault (Replaces Discard Pile) */}
            <div
              aria-label="بنكك"
              className="shrink-0 flex flex-col items-center gap-1.5 min-w-[56px] rounded-2xl bg-[#081A28]/75 border border-[#E6B95E]/70 px-1.5 py-2 shadow-lg"
            >
              {topBankCard ? (
                <PlayingCard
                  card={topBankCard}
                  size="xs"
                  largeText={largeCardText}
                  selected={isCardSelected(topBankCard.id, 'bank')}
                  onClick={
                    isPlayerTurn ? () => onSelectCard(topBankCard, { zone: 'bank' }) : undefined
                  }
                  disabled={!isPlayerTurn}
                />
              ) : (
                <div className="w-11 h-16 rounded-lg border border-[#10B981]/60 bg-[#10B981]/20 flex items-center justify-center text-[#34D399]">
                  <Trophy className="w-5 h-5" />
                </div>
              )}
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#E6B95E] tabular-nums whitespace-nowrap">
                <Vault className="w-3 h-3 shrink-0" />
                <span>بنكك ({board.playerBank.length})</span>
              </span>
            </div>
          </div>
        </section>

        {/* 3. FIVE PLAY DOORS WITH PROGRAMMATIC AUTO-SIZING */}
        <section aria-label="الأبواب الخمسة" className="shrink-0 pt-1">
          <div className="grid grid-cols-5 gap-2 justify-items-center items-end">
            {board.playerDoors.map((doorCards, doorIdx) => {
              const topDoorCard = doorCards[doorCards.length - 1] ?? null;
              const isSelectedHere = topDoorCard
                ? isCardSelected(topDoorCard.id, 'door', doorIdx)
                : false;

              const metrics = computeDoorCardMetrics(
                board.playerDoors.length,
                doorCards.length,
                maxCardsAcrossDoors,
                boardWidth
              );
              const extraLayers = Math.max(0, metrics.maxVisibleLayers - 1);

              return (
                <div key={doorIdx} className="w-full flex flex-col items-center gap-1">
                  <div
                    style={{
                      width: `${metrics.cardWidthPx}px`,
                      height: `${metrics.cardHeightPx + extraLayers * metrics.cascadeOffsetPx}px`,
                    }}
                    className="relative flex items-end justify-center"
                  >
                    {Array.from({ length: extraLayers }).map((_, layerIdx) => (
                      <div
                        key={layerIdx}
                        style={{
                          width: `${metrics.cardWidthPx}px`,
                          height: `${metrics.cardHeightPx}px`,
                          bottom: `${(extraLayers - layerIdx) * metrics.cascadeOffsetPx}px`,
                        }}
                        aria-hidden="true"
                        className="absolute rounded-xl bg-[#EAE5D9] border border-[#D4A243]/40 shadow-sm"
                      />
                    ))}

                    <PlayingCard
                      card={topDoorCard}
                      customDimensions={{
                        width: metrics.cardWidthPx,
                        height: metrics.cardHeightPx,
                        compactText: metrics.compactText,
                      }}
                      largeText={largeCardText}
                      selected={isSelectedHere}
                      playableHighlight={
                        hasSelected &&
                        isPlayerTurn &&
                        !isSelectedHere &&
                        canMoveCardToDoor(
                          board.selected!.card,
                          board.selected!.source,
                          doorCards,
                          doorIdx
                        ).valid
                      }
                      onClick={() => {
                        if (!isPlayerTurn) return;
                        if (hasSelected && !isSelectedHere) {
                          onMoveToDoor(doorIdx);
                        } else if (topDoorCard) {
                          onSelectCard(topDoorCard, { zone: 'door', doorIndex: doorIdx });
                        }
                      }}
                      emptyLabel={`باب ${doorIdx + 1}`}
                      badgeText={doorCards.length > 1 ? `×${doorCards.length}` : undefined}
                      className="relative z-10"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/95 drop-shadow">
                    باب {doorIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. BOTTOM PLAYER SEAT: FULL-WIDTH SPACED HAND + ACTIONS */}
        <section
          aria-label="بطاقات يدك وأزرار اللعب"
          className="shrink-0 space-y-2 pt-0.5"
        >
          <p className="text-[11px] font-semibold text-[#FDE68A] truncate text-center drop-shadow">
            {board.statusMessage}
          </p>

          <div className="flex items-end justify-center gap-2.5">
            <div className="flex-1 flex items-end justify-center min-h-[86px] pt-2 overflow-x-auto">
              {board.playerHand.length === 0 ? (
                <button
                  type="button"
                  onClick={onDrawCard}
                  disabled={!isPlayerTurn}
                  className="min-h-[44px] px-4 rounded-xl bg-[#081A28]/85 border border-dashed border-[#E6B95E]/60 text-xs font-semibold text-[#FDE68A]"
                >
                  يدك فارغة — اضغط لسحب ورقة
                </button>
              ) : (
                <div
                  style={{ gap: `${handMetrics.gapPx}px` }}
                  className="flex items-end justify-center"
                >
                  {board.playerHand.map((card) => (
                    <PlayingCard
                      key={card.id}
                      card={card}
                      customDimensions={{
                        width: handMetrics.cardWidthPx,
                        height: handMetrics.cardHeightPx,
                        compactText: handMetrics.compactText,
                      }}
                      largeText={largeCardText}
                      selected={isCardSelected(card.id, 'hand')}
                      onClick={
                        isPlayerTurn ? () => onSelectCard(card, { zone: 'hand' }) : undefined
                      }
                      disabled={!isPlayerTurn}
                      className="shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {boardWidth >= 420 && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#081A28] shadow">
                  <AssetImage
                    src={playerAvatar}
                    alt={playerName}
                    className="w-full h-full object-cover"
                    fallbackLabel={playerName}
                  />
                </div>
                <span className="-mt-1 px-1.5 py-0.5 rounded bg-[#081A28] text-[9px] font-bold text-white max-w-[58px] truncate">
                  {playerName}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onDrawCard}
              disabled={!isPlayerTurn}
              className="min-h-[42px] px-2 rounded-xl bg-[#081A28]/90 border border-white/15 text-xs font-bold text-white hover:border-[#E6B95E] disabled:opacity-45 whitespace-nowrap"
            >
              سحب ورقة
            </button>

            <button
              type="button"
              onClick={onSortHand}
              className="min-h-[42px] px-2 rounded-xl bg-[#081A28]/90 border border-white/15 text-xs font-bold text-white hover:border-[#E6B95E] flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#E6B95E]" />
              <span>ترتيب</span>
            </button>

            <button
              type="button"
              onClick={onEndTurn}
              disabled={!isPlayerTurn}
              className={`min-h-[42px] px-2 rounded-xl text-xs font-extrabold disabled:opacity-45 flex items-center justify-center gap-1 whitespace-nowrap transition-colors ${
                board.hasMovedHandToDoorThisTurn || board.playerHand.length === 0
                  ? 'bg-[#D4A243] text-[#061814] hover:bg-[#E6B95E]'
                  : 'bg-[#081A28]/90 border border-[#D4A243]/55 text-[#FDE68A]'
              }`}
            >
              {!board.hasMovedHandToDoorThisTurn && board.playerHand.length > 0 ? (
                <Lock className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
              ) : null}
              <span>إنهاء الدور</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
