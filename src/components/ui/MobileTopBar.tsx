import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MobileTopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  onBack,
  rightAction,
}) => {
  return (
    <header className="shrink-0 h-[52px] px-4 flex items-center justify-between border-b border-[#F7F3E9]/10 bg-[#071F19]/80 backdrop-blur-md z-20">
      <div className="w-11 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="رجوع"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-[#F7F3E9] hover:bg-[#103D33] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <h2 className="font-display text-base font-bold text-[#F7F3E9] truncate px-2">
        {title}
      </h2>

      <div className="w-11 flex items-center justify-end">{rightAction}</div>
    </header>
  );
};
