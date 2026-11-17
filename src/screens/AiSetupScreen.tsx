import React, { useState } from 'react';
import { Play, Clock, Gauge } from 'lucide-react';
import { AiDifficulty } from '../types/prototype';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { MobileTopBar } from '../components/ui/MobileTopBar';

interface AiSetupScreenProps {
  defaultTurnSeconds: number;
  onBack: () => void;
  onStartMatch: (difficulty: AiDifficulty, turnSeconds: number) => void;
}

const DIFFICULTIES: { id: AiDifficulty; title: string; desc: string }[] = [
  { id: 'beginner', title: 'مبتدئ', desc: 'إيقاع هادئ مناسب لتجربة ترتيب الأبواب' },
  { id: 'skilled', title: 'متمرس', desc: 'توازن بين اللعب في المركز وتنظيم الأبواب' },
  { id: 'pro', title: 'محترف', desc: 'استجابة سريعة وتنافس مباشر على تفريغ البنك' },
];

export const AiSetupScreen: React.FC<AiSetupScreenProps> = ({
  defaultTurnSeconds,
  onBack,
  onStartMatch,
}) => {
  const [difficulty, setDifficulty] = useState<AiDifficulty>('skilled');
  const [turnSeconds, setTurnSeconds] = useState<number>(defaultTurnSeconds);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="إعداد اللعب ضد الكمبيوتر" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
        {/* Opponent Preview */}
        <div className="rounded-2xl bg-[#103D33] border border-[#F7F3E9]/12 p-4 flex items-center gap-3.5">
          <AssetImage
            src={DESIGN_ASSETS.avatarOpponent}
            alt="الخصم الآلي"
            className="w-14 h-14 rounded-2xl object-cover border border-[#D4A243]/40 shrink-0"
            fallbackLabel="الخصم"
          />
          <div>
            <p className="text-sm font-bold text-[#F7F3E9]">المنافس الآلي — حكيم</p>
            <p className="text-xs text-[#B5C7C1] mt-0.5">
              محاكاة خصم تلقائي لتجربة تدفق الأدوار والمؤقت على اللوحة
            </p>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F3E9]">
            <Gauge className="w-4 h-4 text-[#D4A243]" />
            <span>مستوى الصعوبة</span>
          </div>
          <div className="space-y-2">
            {DIFFICULTIES.map((item) => {
              const active = difficulty === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`w-full min-h-[58px] px-4 py-3 rounded-2xl border text-right transition-colors ${
                    active
                      ? 'bg-[#154B3F] border-[#D4A243] text-[#F7F3E9]'
                      : 'bg-[#08231D] border-[#F7F3E9]/10 text-[#B5C7C1] hover:border-[#F7F3E9]/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-[#F7F3E9]">
                      {item.title}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        active ? 'text-[#E6B95E]' : 'text-[#B5C7C1]/60'
                      }`}
                    >
                      {active ? 'مختار' : 'اختيار'}
                    </span>
                  </div>
                  <p className="text-xs text-[#B5C7C1] mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Turn Timer */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F3E9]">
            <Clock className="w-4 h-4 text-[#D4A243]" />
            <span>مؤقت الدور</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 45].map((sec) => {
              const active = turnSeconds === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setTurnSeconds(sec)}
                  className={`min-h-[46px] rounded-xl border text-xs font-bold tabular-nums transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#D4A243] border-[#D4A243] text-[#061814]'
                      : 'bg-[#08231D] border-[#F7F3E9]/12 text-[#F7F3E9] hover:border-[#D4A243]/40'
                  }`}
                >
                  {sec} ثانية
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 p-4 border-t border-[#F7F3E9]/10 bg-[#071F19]/90 pb-safe">
        <button
          type="button"
          onClick={() => onStartMatch(difficulty, turnSeconds)}
          className="w-full min-h-[50px] rounded-2xl bg-[#D4A243] text-[#061814] font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-[#E6B95E] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>ابدأ المباراة</span>
        </button>
      </div>
    </div>
  );
};
