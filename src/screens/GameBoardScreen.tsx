import React, { useEffect, useRef, useState } from 'react';
import {
  Pause,
  BookOpen,
  Clock,
  ArrowUpDown,
  Layers,
  Vault,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  LayoutGrid,
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

interface GameBoardScreenProps {
  board: PrototypeBoardState;
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
  onSwitchToTable3D: () => void;
}

export const GameBoardScreen: React.FC<GameBoardScreenProps> = ({
  board,
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
  onSwitchToTable3D,
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
  const timerPercent = Math.max(
    0,
    Math.min(100, (board.turnSecondsLeft / board.turnDurationSeconds) * 100)
  );
  const topBankCard = board.playerBank[board.playerBank.length - 1] ?? null;

  const maxCardsAcrossDoors = Math.max(
    1,
    ...board.playerDoors.map((d) => d.length)
  );
  const handMetrics = computeHandCardMetrics(board.playerHand.length, boardWidth);

  const isCardSelected = (cardId: string, zone: CardSelectionSource['zone'], doorIdx?: number) => {
    if (!board.selected) return false;
    if (board.selected.card.id !== cardId || board.selected.source.zone !== zone) return false;
    if (zone === 'door' && board.selected.source.zone === 'door') {
      return board.selected.source.doorIndex === doorIdx;
    }
    return true;
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative select-none">
      {/* Top Match HUD */}
      <header className="shrink-0 px-3 pt-1.5 pb-1.5 bg-[#071F19]/90 border-b border-[#D4A243]/20 flex items-center justify-between gap-1.5 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="قائمة المباراة"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-[#103D33] border border-[#F7F3E9]/12 text-[#F7F3E9] hover:border-[#D4A243]/50"
          >
            <Pause className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onSwitchToTable3D}
            className="min-h-[38px] px-2 rounded-xl bg-[#103D33] border border-[#D4A243]/45 text-[11px] font-bold text-[#E6B95E] flex items-center gap-1 hover:bg-[#154B3F] whitespace-nowrap"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>طاولة 3D</span>
          </button>
        </div>

        <div className="flex-1 max-w-[165px] rounded-xl bg-[#08231D] border border-[#F7F3E9]/12 px-2 py-1">
          <div className="flex items-center justify-between gap-1.5 text-[11px] font-bold">
            <span className={isPlayerTurn ? 'text-[#10B981]' : 'text-[#E6B95E]'}>
              {isPlayerTurn ? 'دورك' : 'الخصم'}
            </span>
            <span className="flex items-center gap-1 font-mono tabular-nums text-[#F7F3E9]">
              <Clock className="w-3 h-3 text-[#D4A243]" />
              <span>{board.turnSecondsLeft}ث</span>
            </span>
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-[#103D33] overflow-hidden">
            <div
              style={{ width: `${timerPercent}%` }}
              className={`h-full transition-all duration-300 ${
                board.turnSecondsLeft <= 7
                  ? 'bg-[#C8322B]'
                  : isPlayerTurn
                  ? 'bg-[#10B981]'
                  : 'bg-[#D4A243]'
              }`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRules}
          aria-label="دليل الطاولة"
          className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-[#103D33] border border-[#F7F3E9]/12 text-[#E6B95E] hover:border-[#D4A243]/50"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </header>

      {/* Dropdown Match Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-3 left-3 z-40 rounded-2xl bg-[#103D33] border border-[#D4A243]/40 p-3 shadow-2xl space-y-2 animate-fade-scale">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F7F3E9]/10">
            <span className="font-display text-xs font-bold text-[#F7F3E9]">
              خيارات معاينة اللوحة
            </span>
            <span className="text-[11px] text-[#B5C7C1]">{board.matchLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onSimulateOutcome('player');
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#08231D] border border-[#10B981]/40 text-xs font-bold text-[#10B981] flex items-center justify-center gap-1.5"
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
              className="min-h-[42px] px-2.5 rounded-xl bg-[#08231D] border border-[#C8322B]/40 text-xs font-bold text-[#F87171] flex items-center justify-center gap-1.5"
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
              className="min-h-[42px] px-2.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/12 text-xs font-semibold text-[#F7F3E9] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4A243]" />
              <span>توزيع جديد</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onRequestExit();
              }}
              className="min-h-[42px] px-2.5 rounded-xl bg-[#C8322B]/20 border border-[#C8322B]/40 text-xs font-bold text-[#F87171]"
            >
              إنهاء والخروج
            </button>
          </div>
        </div>
      )}

      {/* Main Felt Board Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-between px-3 py-2 overflow-y-auto iphone-scroll gap-2">
        {/* 1. OPPONENT ZONE */}
        <section
          aria-label="منطقة الخصم"
          className={`shrink-0 rounded-2xl px-2.5 py-1.5 border transition-colors ${
            !isPlayerTurn
              ? 'bg-[#103D33]/90 border-[#D4A243]/60'
              : 'bg-[#08231D]/75 border-[#F7F3E9]/10'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AssetImage
                src={DESIGN_ASSETS.avatarOpponent}
                alt="الخصم"
                className="w-8 h-8 rounded-xl object-cover border border-[#D4A243]/40 shrink-0"
                fallbackLabel="الخصم"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#F7F3E9] truncate">
                  {board.isAiMatch ? 'المنافس الآلي' : 'الخصم'}
                </p>
                <p className="text-[11px] text-[#B5C7C1] tabular-nums">
                  بنك الخصم: {board.opponentBankCount} · بيده: {board.opponentHandCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 pl-1 shrink-0">
              {Array.from({ length: Math.min(board.opponentHandCount, 4) }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-6 rounded border border-[#D4A243]/40 overflow-hidden bg-[#0A2A22] shadow"
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

          {/* Opponent 5 Mini Doors */}
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {board.opponentDoors.map((card, idx) => (
              <div
                key={idx}
                className="h-6 rounded-md bg-[#061814]/75 border border-[#F7F3E9]/10 flex items-center justify-center text-[10px] font-display font-bold tabular-nums"
              >
                {card ? (
                  <span
                    className={
                      card.suit === 'hearts' || card.suit === 'diamonds'
                        ? 'text-[#F87171]'
                        : 'text-[#F7F3E9]'
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
                  <span className="text-[#B5C7C1]/40 text-[9px]">باب {idx + 1}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. COMPACT DRAW & PLAYER BANK DOCK */}
        <section
          aria-label="السحب وبنكك"
          className="shrink-0 grid grid-cols-2 gap-2.5"
        >
          <button
            type="button"
            onClick={isPlayerTurn ? onDrawCard : undefined}
            disabled={!isPlayerTurn}
            className="min-h-[64px] px-3 py-1.5 rounded-2xl bg-[#071F19]/85 border border-[#F7F3E9]/12 hover:border-[#D4A243]/45 flex items-center justify-between gap-2 text-right transition-colors disabled:opacity-60"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-14 rounded-lg overflow-hidden border border-[#D4A243]/45 shrink-0">
                <AssetImage
                  src={DESIGN_ASSETS.cardBack}
                  alt="كومة السحب"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-[#B5C7C1]">كومة السحب</span>
                <span className="block font-mono text-sm font-bold text-[#E6B95E] tabular-nums">
                  {board.drawPile.length} ورقة
                </span>
              </div>
            </div>
          </button>

          <div className="min-h-[64px] px-3 py-1.5 rounded-2xl vault-recess border border-[#D4A243]/60 flex items-center justify-between gap-2 text-right">
            <div className="flex items-center gap-2.5 min-w-0">
              {topBankCard ? (
                <PlayingCard
                  card={topBankCard}
                  size="mini"
                  largeText={largeCardText}
                  selected={isCardSelected(topBankCard.id, 'bank')}
                  onClick={
                    isPlayerTurn ? () => onSelectCard(topBankCard, { zone: 'bank' }) : undefined
                  }
                  disabled={!isPlayerTurn}
                  className="shrink-0"
                />
              ) : (
                <div className="w-[42px] h-[58px] rounded-lg border border-[#10B981]/50 bg-[#10B981]/15 flex items-center justify-center text-[#10B981] shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <span className="flex items-center gap-1 text-xs font-bold text-[#E6B95E] whitespace-nowrap">
                  <Vault className="w-3.5 h-3.5 shrink-0" />
                  <span>بنكك</span>
                </span>
                <span className="block font-mono text-sm font-bold text-[#F7F3E9] tabular-nums">
                  {board.playerBank.length} متبقي
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. EXPANDED CENTER PILES ARENA */}
        <section
          aria-label="الأكوام المركزية"
          className="flex-[1.35] min-h-[144px] rounded-3xl bg-[radial-gradient(circle_at_center,rgba(23,92,75,0.68)_0%,rgba(11,46,38,0.35)_100%)] border border-[#D4A243]/35 px-3 py-3 flex flex-col justify-center shadow-inner"
        >
          <div className="flex items-center justify-between mb-2.5 text-[11px]">
            <span className="font-display font-bold text-[#F7F3E9] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E6B95E]" />
              <span>الأكوام المركزية</span>
            </span>
            <span className="text-[#E6B95E] font-medium tabular-nums">
              {hasSelected ? 'اضغط على أي كومة للعب الورقة' : `دور ${board.turnNumber}`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 justify-items-center items-center">
            {board.centerPiles.map((pile, idx) => {
              const topCard = pile[pile.length - 1] ?? null;
              const isValidCenterTarget =
                hasSelected &&
                isPlayerTurn &&
                canPlayCardToCenter(board.selected!.card, pile, idx).valid;
              return (
                <PlayingCard
                  key={idx}
                  card={topCard}
                  size="lg"
                  largeText={largeCardText}
                  playableHighlight={isValidCenterTarget}
                  onClick={hasSelected && isPlayerTurn ? () => onPlayToCenter(idx) : undefined}
                  emptyLabel={`كومة ${idx + 1} · A`}
                  badgeText={pile.length > 1 ? `${pile.length}` : undefined}
                />
              );
            })}
          </div>
        </section>

        {/* 4. FIVE PLAY DOORS WITH PROGRAMMATIC AUTO-SIZING */}
        <section aria-label="الأبواب الخمسة" className="shrink-0 space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="font-display font-bold text-[#F7F3E9]">الأبواب الخمسة</span>
            <span className="text-[#B5C7C1]">
              {hasSelected ? 'اضغط على باب لنقل الورقة' : 'اضغط لتحديد أعلى بطاقة'}
            </span>
          </div>

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
                  <span className="text-[10px] text-[#B5C7C1]">باب {doorIdx + 1}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. SPACED NON-OVERLAPPING PLAYER HAND & ACTION BAR */}
        <section
          aria-label="بطاقات يدك وأزرار اللعب"
          className={`shrink-0 rounded-2xl border px-2.5 pt-2 pb-2 transition-colors ${
            isPlayerTurn
              ? 'bg-[#103D33] border-[#D4A243]/45'
              : 'bg-[#08231D]/80 border-[#F7F3E9]/10'
          }`}
        >
          <p className="text-[11px] font-medium text-[#E6B95E] truncate mb-1.5 text-center">
            {board.statusMessage}
          </p>

          <div className="flex items-end justify-center min-h-[88px] overflow-x-auto pb-1">
            {board.playerHand.length === 0 ? (
              <button
                type="button"
                onClick={onDrawCard}
                disabled={!isPlayerTurn}
                className="min-h-[48px] px-4 rounded-xl border border-dashed border-[#D4A243]/50 text-xs font-semibold text-[#E6B95E]"
              >
                يدك فارغة — اضغط لسحب بطاقة
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

          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onDrawCard}
              disabled={!isPlayerTurn}
              className="min-h-[44px] px-2 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-xs font-bold text-[#F7F3E9] hover:border-[#D4A243]/50 disabled:opacity-45 whitespace-nowrap"
            >
              سحب ورقة
            </button>

            <button
              type="button"
              onClick={onSortHand}
              className="min-h-[44px] px-2 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-xs font-bold text-[#F7F3E9] hover:border-[#D4A243]/50 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D4A243]" />
              <span>ترتيب</span>
            </button>

            <button
              type="button"
              onClick={onEndTurn}
              disabled={!isPlayerTurn}
              className="min-h-[44px] px-2 rounded-xl bg-[#D4A243] text-[#061814] text-xs font-extrabold hover:bg-[#E6B95E] disabled:opacity-45 whitespace-nowrap"
            >
              إنهاء الدور
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
