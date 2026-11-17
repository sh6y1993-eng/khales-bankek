import React, { useState } from 'react';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { SampleRoom } from '../types/prototype';
import { MobileTopBar } from '../components/ui/MobileTopBar';

interface JoinRoomScreenProps {
  sampleRooms: SampleRoom[];
  onBack: () => void;
  onJoinByCode: (code: string) => string | null;
}

export const JoinRoomScreen: React.FC<JoinRoomScreenProps> = ({
  sampleRooms,
  onBack,
  onJoinByCode,
}) => {
  const [code, setCode] = useState('KH-482');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (cleaned.length < 4) {
      setError('أدخل رمز الغرفة كاملاً (مثال: KH-482)');
      return;
    }
    const errMsg = onJoinByCode(cleaned);
    if (errMsg) {
      setError(errMsg);
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="الانضمام إلى غرفة" onBack={onBack} />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between px-5 py-6">
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#103D33] border border-[#F7F3E9]/12 p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#08231D] border border-[#D4A243]/30 flex items-center justify-center text-[#E6B95E] shrink-0">
              <KeyRound className="w-5 h-5" />
            </span>
            <p className="text-xs leading-relaxed text-[#B5C7C1]">
              أدخل رمز الغرفة المشارك معك من المضيف للانضمام إلى قائمة انتظار اللاعبين.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="join-room-code" className="block text-xs font-semibold text-[#F7F3E9]">
              رمز الغرفة
            </label>
            <input
              id="join-room-code"
              type="text"
              dir="ltr"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="KH-482"
              maxLength={8}
              className="w-full min-h-[54px] px-4 rounded-2xl bg-[#08231D] border border-[#D4A243]/40 text-center font-mono text-xl font-bold tracking-widest text-[#E6B95E] focus:outline-none focus:border-[#E6B95E]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-[#C8322B]/15 border border-[#C8322B]/40 px-3.5 py-2.5 text-xs text-[#F87171]">
              {error}
            </div>
          )}

          {/* Quick sample codes for testing */}
          <div className="space-y-2">
            <p className="text-xs text-[#B5C7C1]">رموز سريعة لتجربة المعاينة:</p>
            <div className="flex flex-wrap gap-2">
              {sampleRooms.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    setCode(r.code);
                    setError(null);
                  }}
                  className="min-h-[38px] px-3 rounded-xl bg-[#103D33] border border-[#F7F3E9]/12 text-xs text-[#F7F3E9] hover:border-[#D4A243]/50 font-mono tabular-nums"
                >
                  {r.code} {r.isLocked ? '(مغلقة)' : '(مفتوحة)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[50px] rounded-2xl bg-[#D4A243] text-[#061814] font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-[#E6B95E] active:scale-[0.98] transition-all"
        >
          <span>انضمام إلى الغرفة</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
