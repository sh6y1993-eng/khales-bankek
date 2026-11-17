import React from 'react';
import { PlayingCardData } from '../../types/prototype';
import { getSuitLabelAr, getSuitSymbol, isRedSuit } from '../../services/prototypeGameController';
import { DESIGN_ASSETS } from '../../theme/designTokens';
import { AssetImage } from './AssetImage';

interface PlayingCardProps {
  card?: PlayingCardData | null;
  faceDown?: boolean;
  selected?: boolean;
  playableHighlight?: boolean;
  size?: 'mini' | 'xs' | 'door' | 'sm' | 'md' | 'lg';
  customDimensions?: { width: number; height: number; compactText?: boolean };
  largeText?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  nonInteractive?: boolean;
  badgeText?: string;
  emptyLabel?: string;
  className?: string;
}

const SIZE_CLASSES: Record<'mini' | 'xs' | 'door' | 'sm' | 'md' | 'lg', string> = {
  mini: 'w-[42px] h-[58px] rounded-lg',
  xs: 'w-11 h-16 rounded-lg',
  door: 'w-full max-w-[60px] h-[78px] rounded-xl',
  sm: 'w-14 h-20 rounded-xl',
  md: 'w-[62px] h-[88px] rounded-xl',
  lg: 'w-[70px] h-[98px] rounded-2xl',
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  faceDown = false,
  selected = false,
  playableHighlight = false,
  size = 'md',
  customDimensions,
  largeText = false,
  onClick,
  disabled = false,
  nonInteractive = false,
  badgeText,
  emptyLabel,
  className = '',
}) => {
  const sizeCls = customDimensions ? 'rounded-xl' : SIZE_CLASSES[size];
  const inlineSizeStyle: React.CSSProperties | undefined = customDimensions
    ? { width: `${customDimensions.width}px`, height: `${customDimensions.height}px` }
    : undefined;

  if (!card && !faceDown) {
    const emptyClasses = `${sizeCls} relative flex flex-col items-center justify-center border border-dashed transition-colors min-h-[44px] ${
      playableHighlight
        ? 'border-[#D4A243] bg-[#D4A243]/18 text-[#E6B95E] cursor-pointer hover:bg-[#D4A243]/28'
        : 'border-[#F7F3E9]/22 bg-[#071F19]/45 text-[#B5C7C1]/75'
    } ${className}`;

    if (nonInteractive) {
      return (
        <div style={inlineSizeStyle} className={emptyClasses}>
          <span className="text-[11px] font-medium px-1 text-center leading-tight">
            {emptyLabel ?? 'فارغ'}
          </span>
        </div>
      );
    }

    return (
      <button
        type="button"
        style={inlineSizeStyle}
        onClick={onClick}
        disabled={disabled || !onClick}
        className={emptyClasses}
      >
        <span className="text-[11px] font-medium px-1 text-center leading-tight">
          {emptyLabel ?? 'فارغ'}
        </span>
      </button>
    );
  }

  if (faceDown) {
    return (
      <button
        type="button"
        style={inlineSizeStyle}
        onClick={onClick}
        disabled={disabled || !onClick}
        aria-label={badgeText ? `بطاقة مقلوبة (${badgeText})` : 'بطاقة مقلوبة'}
        className={`${sizeCls} relative overflow-hidden border border-[#D4A243]/45 bg-[#0A2A22] shadow-md select-none transition-transform duration-150 ${
          onClick && !disabled ? 'cursor-pointer hover:border-[#E6B95E] active:scale-95' : 'cursor-default'
        } ${className}`}
      >
        <AssetImage
          src={DESIGN_ASSETS.cardBack}
          alt="ظهر بطاقة خلّص بنكك"
          className="w-full h-full object-cover"
          fallbackLabel="خلّص بنكك"
        />
        {badgeText && (
          <span className="absolute bottom-0.5 inset-x-0.5 mx-auto w-fit px-1 py-0.5 rounded bg-[#061814]/90 border border-[#D4A243]/45 text-[9px] font-mono font-bold text-[#E6B95E] tabular-nums">
            {badgeText}
          </span>
        )}
      </button>
    );
  }

  const red = card ? isRedSuit(card.suit) : false;
  const suitSymbol = card ? getSuitSymbol(card.suit) : '';
  const suitNameAr = card ? getSuitLabelAr(card.suit) : '';
  const inkColor = red ? 'text-[#C8322B]' : 'text-[#17211E]';

  const isCompact = customDimensions?.compactText || size === 'mini';

  const rankSize = isCompact
    ? largeText
      ? 'text-sm'
      : 'text-xs'
    : size === 'xs'
    ? 'text-xs'
    : size === 'door' || size === 'sm'
    ? largeText
      ? 'text-base'
      : 'text-sm'
    : size === 'md'
    ? largeText
      ? 'text-lg'
      : 'text-base'
    : largeText
    ? 'text-xl'
    : 'text-lg';

  const centerSuitSize = isCompact
    ? 'text-lg'
    : size === 'xs'
    ? 'text-lg'
    : size === 'door' || size === 'sm'
    ? 'text-xl'
    : size === 'md'
    ? 'text-[26px]'
    : 'text-3xl';

  const cardInner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-[inherit] border border-[#D4A243]/20"
      />
      <div className={`relative z-10 flex items-center justify-between px-1.5 pt-1 leading-none ${inkColor}`}>
        <span className={`font-display font-extrabold tabular-nums ${rankSize}`}>
          {card?.rank}
        </span>
        <span className={isCompact || size === 'xs' ? 'text-[10px]' : 'text-xs'} aria-hidden="true">
          {suitSymbol}
        </span>
      </div>
      <div className={`relative z-10 flex items-center justify-center leading-none ${inkColor}`}>
        <span className={centerSuitSize} aria-hidden="true">
          {suitSymbol}
        </span>
      </div>
      <div
        className={`relative z-10 flex items-center justify-between px-1.5 pb-1 leading-none rotate-180 ${inkColor}`}
        aria-hidden="true"
      >
        <span className={`font-display font-extrabold tabular-nums ${rankSize}`}>
          {card?.rank}
        </span>
        <span className={isCompact || size === 'xs' ? 'text-[10px]' : 'text-xs'}>{suitSymbol}</span>
      </div>
      {badgeText && (
        <span className="absolute -top-2 -left-1.5 z-30 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-md bg-[#0B2E26] border border-[#D4A243] text-[10px] font-mono font-bold text-[#E6B95E] tabular-nums shadow">
          {badgeText}
        </span>
      )}
    </>
  );

  const cardClasses = `${sizeCls} relative flex flex-col justify-between bg-[#FDFBF7] select-none text-right shadow-[0_6px_14px_rgba(0,0,0,0.34)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6B95E] ${
    selected
      ? '-translate-y-2.5 scale-[1.04] ring-2 ring-[#E6B95E] shadow-[0_12px_22px_rgba(212,162,67,0.35)] z-20'
      : playableHighlight
      ? 'ring-2 ring-[#10B981]/85 shadow-[0_0_16px_rgba(16,185,129,0.28)]'
      : 'border border-[#D4A243]/35'
  } ${onClick && !disabled ? 'cursor-pointer active:scale-95' : 'cursor-default'} ${className}`;

  if (nonInteractive) {
    return (
      <div style={inlineSizeStyle} className={cardClasses}>
        {cardInner}
      </div>
    );
  }

  return (
    <button
      type="button"
      style={inlineSizeStyle}
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={card ? `${card.rank} ${suitNameAr}` : 'بطاقة'}
      aria-pressed={selected}
      className={cardClasses}
    >
      {cardInner}
    </button>
  );
};
