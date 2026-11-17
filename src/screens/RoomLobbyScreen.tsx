import React, { useState } from 'react';
import { Copy, Check, Lock, Unlock, UserPlus, UserMinus, Play } from 'lucide-react';
import { RoomConfig } from '../types/prototype';
import { AssetImage } from '../components/ui/AssetImage';
import { MobileTopBar } from '../components/ui/MobileTopBar';

interface RoomLobbyScreenProps {
  room: RoomConfig;
  onBack: () => void;
  onToggleLock: () => void;
  onToggleDemoOpponent: () => void;
  onToggleMyReady: () => void;
  onStartMatch: () => void;
  onLeaveRoom: () => void;
}

export const RoomLobbyScreen: React.FC<RoomLobbyScreenProps> = ({
  room,
  onBack,
  onToggleLock,
  onToggleDemoOpponent,
  onToggleMyReady,
  onStartMatch,
  onLeaveRoom,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(room.code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const hasOpponent = room.players.length >= 2;
  const allReady = room.players.every((p) => p.isReady);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="انتظار اللاعبين" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
        {/* Room Header Card */}
        <div className="rounded-3xl bg-[#103D33] border border-[#D4A243]/35 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#F7F3E9]">{room.name}</h3>
              <p className="text-xs text-[#B5C7C1] mt-0.5 tabular-nums">
                مؤقت الدور: {room.turnDurationSeconds} ثانية · {room.isPrivate ? 'غرفة خاصة' : 'غرفة عامة'}
              </p>
            </div>
            <span
              className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                room.isLocked ? 'text-[#F87171]' : 'text-[#10B981]'
              }`}
            >
              {room.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{room.isLocked ? 'مغلقة' : 'مفتوحة'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#08231D] border border-[#F7F3E9]/10">
            <div>
              <span className="block text-[11px] text-[#B5C7C1]">رمز الدعوة</span>
              <span dir="ltr" className="font-mono text-lg font-bold text-[#E6B95E] tabular-nums">
                {room.code}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="min-h-[40px] px-3 rounded-xl bg-[#103D33] border border-[#D4A243]/35 text-xs font-semibold text-[#F7F3E9] flex items-center gap-1.5 hover:border-[#E6B95E] whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#D4A243]" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرمز'}</span>
            </button>
          </div>

          {/* Interactive Room Open / Lock Toggle */}
          <button
            type="button"
            onClick={onToggleLock}
            className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-xs font-semibold text-[#F7F3E9] flex items-center justify-between hover:border-[#D4A243]/50 transition-colors"
          >
            <span>التحكم بحالة الغرفة (تجريبي)</span>
            <span className="text-[#E6B95E]">
              {room.isLocked ? 'اضغط لفتح الغرفة' : 'اضغط لإغلاق الغرفة'}
            </span>
          </button>
        </div>

        {/* Players Slots */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-display text-sm font-bold text-[#F7F3E9]">
              اللاعبون ({room.players.length}/2)
            </h4>
            <button
              type="button"
              onClick={onToggleDemoOpponent}
              className="min-h-[36px] px-2.5 rounded-lg bg-[#103D33] border border-[#F7F3E9]/12 text-[11px] font-semibold text-[#E6B95E] flex items-center gap-1.5 whitespace-nowrap"
            >
              {hasOpponent ? (
                <>
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>إزالة اللاعب التجريبي</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>إضافة منافس تجريبي</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2.5">
            {room.players.map((player) => (
              <div
                key={player.id}
                className="p-3.5 rounded-2xl bg-[#103D33] border border-[#F7F3E9]/12 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AssetImage
                    src={player.avatar}
                    alt={player.name}
                    className="w-11 h-11 rounded-xl object-cover border border-[#D4A243]/40 shrink-0"
                    fallbackLabel={player.name}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#F7F3E9] truncate">{player.name}</p>
                    <p className="text-[11px] text-[#B5C7C1]">
                      {player.isHost ? 'مضيف الغرفة' : 'منافس تجريبي'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold shrink-0 ${
                    player.isReady ? 'text-[#10B981]' : 'text-[#E6B95E]'
                  }`}
                >
                  {player.isReady ? 'جاهز' : 'في الانتظار'}
                </span>
              </div>
            ))}

            {!hasOpponent && (
              <div className="p-4 rounded-2xl border border-dashed border-[#F7F3E9]/20 bg-[#08231D]/60 text-center text-xs text-[#B5C7C1]">
                بانتظار انضمام اللاعب الثاني — يمكنك الضغط على «إضافة منافس تجريبي» أعلاه للمعاينة.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Controls */}
      <div className="shrink-0 p-4 border-t border-[#F7F3E9]/10 bg-[#071F19]/90 space-y-2 pb-safe">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onToggleMyReady}
            className="min-h-[48px] rounded-xl bg-[#103D33] border border-[#D4A243]/40 text-xs font-bold text-[#F7F3E9] hover:bg-[#154B3F] whitespace-nowrap"
          >
            تبديل جاهزيتي
          </button>

          <button
            type="button"
            onClick={onStartMatch}
            disabled={!hasOpponent || !allReady}
            className={`min-h-[48px] rounded-xl font-display font-bold text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              hasOpponent && allReady
                ? 'bg-[#D4A243] text-[#061814] hover:bg-[#E6B95E]'
                : 'bg-[#08231D] text-[#B5C7C1]/50 border border-[#F7F3E9]/10 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>بدء اللعب</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onLeaveRoom}
          className="w-full min-h-[40px] text-xs font-medium text-[#F87171] hover:underline"
        >
          مغادرة الغرفة
        </button>
      </div>
    </div>
  );
};
