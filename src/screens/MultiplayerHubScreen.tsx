import React from 'react';
import { PlusCircle, KeyRound, Lock, Unlock, Users } from 'lucide-react';
import { SampleRoom, ScreenId } from '../types/prototype';
import { MobileTopBar } from '../components/ui/MobileTopBar';
import { BottomTabBar } from '../components/ui/BottomTabBar';

interface MultiplayerHubScreenProps {
  rooms: SampleRoom[];
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectSampleRoom: (room: SampleRoom) => void;
}

export const MultiplayerHubScreen: React.FC<MultiplayerHubScreenProps> = ({
  rooms,
  onBack,
  onNavigate,
  onSelectSampleRoom,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="اللعب الجماعي" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
        {/* Transparent Demo Notice */}
        <div className="rounded-2xl bg-[#08231D] border border-[#D4A243]/25 px-4 py-3 text-xs leading-relaxed text-[#B5C7C1]">
          <span className="font-bold text-[#E6B95E]">معاينة اللعب الجماعي: </span>
          الغرف المعروضة أدناه بيانات تجريبية لاختبار تدفق الشاشات دون اتصال فعلي بخادم Firebase.
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('create-room')}
            className="min-h-[84px] p-3.5 rounded-2xl bg-[#D4A243] text-[#061814] flex flex-col justify-between text-right hover:bg-[#E6B95E] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-display text-sm font-extrabold whitespace-nowrap">
              إنشاء غرفة
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('join-room')}
            className="min-h-[84px] p-3.5 rounded-2xl bg-[#103D33] border border-[#D4A243]/40 text-[#F7F3E9] flex flex-col justify-between text-right hover:bg-[#154B3F] active:scale-[0.98] transition-all"
          >
            <KeyRound className="w-5 h-5 text-[#E6B95E]" />
            <span className="font-display text-sm font-bold whitespace-nowrap">
              انضمام برمز
            </span>
          </button>
        </div>

        {/* Sample Rooms List */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-display text-sm font-bold text-[#F7F3E9]">
              غرف تجريبية متاحة
            </h3>
            <span className="text-[#B5C7C1] tabular-nums">{rooms.length} غرف</span>
          </div>

          <div className="space-y-2.5">
            {rooms.map((room) => (
              <button
                key={room.code}
                type="button"
                onClick={() => onSelectSampleRoom(room)}
                className="w-full p-4 rounded-2xl bg-[#103D33] border border-[#F7F3E9]/10 hover:border-[#D4A243]/45 text-right transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-[#F7F3E9] truncate">
                    {room.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#E6B95E] tabular-nums shrink-0">
                    {room.code}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#B5C7C1]">
                  <span>
                    المضيف: {room.hostName} · {room.turnDurationSeconds}ث
                  </span>
                  <span className="flex items-center gap-1.5 tabular-nums shrink-0">
                    {room.isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#F87171]" />
                        <span className="text-[#F87171]">مغلقة</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">مفتوحة</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {room.playersCount}/{room.maxPlayers}
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <BottomTabBar currentScreen="multiplayer-hub" onNavigate={onNavigate} />
    </div>
  );
};
