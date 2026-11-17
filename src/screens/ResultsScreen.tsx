import React from 'react';
import { Trophy, RotateCcw, Home, ShieldAlert } from 'lucide-react';
import { MatchOutcome } from '../types/prototype';

interface ResultsScreenProps {
  outcome: MatchOutcome;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  outcome,
  onPlayAgain,
  onBackHome,
}) => {
  const isWin = outcome.winner === 'player';

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8 text-center animate-fade-scale">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center border shadow-xl ${
            isWin
              ? 'bg-[#D4A243]/20 border-[#E6B95E] text-[#E6B95E]'
              : 'bg-[#C8322B]/15 border-[#F87171]/50 text-[#F87171]'
          }`}
        >
          {isWin ? <Trophy className="w-11 h-11" /> : <ShieldAlert className="w-11 h-11" />}
        </div>

        <div className="space-y-2 max-w-[290px]">
          <h1 className="font-display text-3xl font-extrabold text-[#F7F3E9]">
            {isWin ? 'مبروك! خلّصت بنكك' : 'انتهت الجولة'}
          </h1>
          <p className="text-sm leading-relaxed text-[#B5C7C1]">{outcome.reason}</p>
        </div>

        <div className="w-full rounded-3xl bg-[#103D33] border border-[#F7F3E9]/12 p-4 grid grid-cols-2 gap-3 text-right">
          <div className="rounded-2xl bg-[#08231D] p-3">
            <span className="block text-[11px] text-[#B5C7C1]">المتبقي في بنكك</span>
            <span className="mt-1 block font-display text-xl font-bold text-[#E6B95E] tabular-nums">
              {outcome.remainingPlayerBank}
            </span>
          </div>

          <div className="rounded-2xl bg-[#08231D] p-3">
            <span className="block text-[11px] text-[#B5C7C1]">بنك الخصم</span>
            <span className="mt-1 block font-display text-xl font-bold text-[#F7F3E9] tabular-nums">
              {outcome.remainingOpponentBank}
            </span>
          </div>

          <div className="rounded-2xl bg-[#08231D] p-3">
            <span className="block text-[11px] text-[#B5C7C1]">عدد الأدوار</span>
            <span className="mt-1 block font-display text-xl font-bold text-[#F7F3E9] tabular-nums">
              {outcome.turnsPlayed}
            </span>
          </div>

          <div className="rounded-2xl bg-[#08231D] p-3">
            <span className="block text-[11px] text-[#B5C7C1]">الحركات المنفذة</span>
            <span className="mt-1 block font-display text-xl font-bold text-[#F7F3E9] tabular-nums">
              {outcome.movesPlayed}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pb-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full min-h-[50px] rounded-2xl bg-[#D4A243] text-[#061814] font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-[#E6B95E] active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>العب مجدداً</span>
        </button>

        <button
          type="button"
          onClick={onBackHome}
          className="w-full min-h-[48px] rounded-2xl bg-[#103D33] border border-[#F7F3E9]/15 text-sm font-semibold text-[#F7F3E9] flex items-center justify-center gap-2 hover:bg-[#154B3F] transition-colors"
        >
          <Home className="w-4 h-4 text-[#D4A243]" />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
};
