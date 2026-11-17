import React from 'react';
import { Cpu, Users, ChevronLeft, Clock, Shield } from 'lucide-react';
import { ScreenId } from '../types/prototype';
import { MobileTopBar } from '../components/ui/MobileTopBar';
import { BottomTabBar } from '../components/ui/BottomTabBar';

interface ModeSelectScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="اختيار نمط اللعب" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-4">
        <p className="text-xs leading-relaxed text-[#B5C7C1]">
          اختر طريقة اللعب المناسبة لاستعراض التجربة التفاعلية على شاشة الآيفون:
        </p>

        <button
          type="button"
          onClick={() => onNavigate('ai-setup')}
          className="w-full p-5 rounded-3xl bg-[#103D33] border border-[#D4A243]/35 hover:border-[#E6B95E] text-right transition-colors space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-[#08231D] border border-[#D4A243]/30 flex items-center justify-center text-[#E6B95E]">
              <Cpu className="w-5 h-5" />
            </span>
            <ChevronLeft className="w-5 h-5 text-[#B5C7C1]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#F7F3E9]">
              اللعب ضد الكمبيوتر
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#B5C7C1]">
              مواجهة فردية مع خصم آلي يحاكي الأدوار والمؤقت، مثالية لاختبار لوحة اللعب وتفاعل البطاقات.
            </p>
          </div>
          <div className="pt-2 border-t border-[#F7F3E9]/10 flex items-center gap-3 text-[11px] text-[#B5C7C1]">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#D4A243]" />
              <span>3 مستويات</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4A243]" />
              <span>مؤقت قابل للتخصيص</span>
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('multiplayer-hub')}
          className="w-full p-5 rounded-3xl bg-[#103D33] border border-[#F7F3E9]/15 hover:border-[#D4A243]/50 text-right transition-colors space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-11 h-11 rounded-2xl bg-[#08231D] border border-[#D4A243]/30 flex items-center justify-center text-[#E6B95E]">
              <Users className="w-5 h-5" />
            </span>
            <ChevronLeft className="w-5 h-5 text-[#B5C7C1]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#F7F3E9]">
              اللعب الجماعي (نموذج تجريبي)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#B5C7C1]">
              استعرض شاشات إنشاء الغرف، الانضمام برمز، فتح وإغلاق الغرفة، وقائمة انتظار اللاعبين.
            </p>
          </div>
          <div className="pt-2 border-t border-[#F7F3E9]/10 flex items-center gap-3 text-[11px] text-[#B5C7C1]">
            <span>غرف خاصة وعامة</span>
            <span aria-hidden="true">·</span>
            <span>بيانات محاكاة للمعاينة</span>
          </div>
        </button>
      </div>

      <BottomTabBar currentScreen="mode-select" onNavigate={onNavigate} />
    </div>
  );
};
