import React, { useState } from 'react';
import { Lock, Globe, Clock, Eye } from 'lucide-react';
import { MobileTopBar } from '../components/ui/MobileTopBar';

interface CreateRoomScreenProps {
  defaultTurnSeconds: number;
  onBack: () => void;
  onCreateRoom: (payload: {
    name: string;
    isPrivate: boolean;
    turnDurationSeconds: number;
    allowSpectators: boolean;
  }) => void;
}

export const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({
  defaultTurnSeconds,
  onBack,
  onCreateRoom,
}) => {
  const [name, setName] = useState('مجلس خلّص بنكك');
  const [isPrivate, setIsPrivate] = useState(true);
  const [turnDurationSeconds, setTurnDurationSeconds] = useState(defaultTurnSeconds);
  const [allowSpectators, setAllowSpectators] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom({
      name: name.trim() || 'غرفة جديدة',
      isPrivate,
      turnDurationSeconds,
      allowSpectators,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="إنشاء غرفة" onBack={onBack} />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="room-name" className="block text-xs font-semibold text-[#F7F3E9]">
              اسم الغرفة
            </label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={28}
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-sm text-[#F7F3E9] focus:outline-none focus:border-[#D4A243]"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-[#F7F3E9]">الخصوصية</span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`min-h-[66px] p-3 rounded-2xl border flex flex-col items-start justify-between text-right transition-colors ${
                  isPrivate
                    ? 'bg-[#154B3F] border-[#D4A243] text-[#F7F3E9]'
                    : 'bg-[#08231D] border-[#F7F3E9]/12 text-[#B5C7C1]'
                }`}
              >
                <Lock className="w-4 h-4 text-[#E6B95E]" />
                <span className="text-xs font-bold">خاصة برمز دعوة</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`min-h-[66px] p-3 rounded-2xl border flex flex-col items-start justify-between text-right transition-colors ${
                  !isPrivate
                    ? 'bg-[#154B3F] border-[#D4A243] text-[#F7F3E9]'
                    : 'bg-[#08231D] border-[#F7F3E9]/12 text-[#B5C7C1]'
                }`}
              >
                <Globe className="w-4 h-4 text-[#E6B95E]" />
                <span className="text-xs font-bold">عامة في القائمة</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F3E9]">
              <Clock className="w-4 h-4 text-[#D4A243]" />
              <span>مدة الدور</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 45].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setTurnDurationSeconds(sec)}
                  className={`min-h-[46px] rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                    turnDurationSeconds === sec
                      ? 'bg-[#D4A243] border-[#D4A243] text-[#061814]'
                      : 'bg-[#08231D] border-[#F7F3E9]/12 text-[#F7F3E9]'
                  }`}
                >
                  {sec} ثانية
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAllowSpectators((v) => !v)}
            className="w-full min-h-[54px] px-4 rounded-2xl bg-[#103D33] border border-[#F7F3E9]/10 flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#D4A243]" />
              <span className="text-xs font-semibold text-[#F7F3E9]">
                السماح بالمشاهدة (تجريبي)
              </span>
            </div>
            <span
              className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                allowSpectators ? 'bg-[#D4A243] justify-start' : 'bg-[#08231D] justify-end'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#FDFBF7] shadow" />
            </span>
          </button>
        </div>

        <div className="shrink-0 p-4 border-t border-[#F7F3E9]/10 bg-[#071F19]/90 pb-safe">
          <button
            type="submit"
            className="w-full min-h-[50px] rounded-2xl bg-[#D4A243] text-[#061814] font-display font-bold text-base hover:bg-[#E6B95E] active:scale-[0.98] transition-all"
          >
            إنشاء وفتح الغرفة
          </button>
        </div>
      </form>
    </div>
  );
};
