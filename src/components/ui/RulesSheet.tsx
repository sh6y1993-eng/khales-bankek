import React from 'react';
import { X, Layers, Vault, ShieldCheck } from 'lucide-react';

interface RulesSheetProps {
  open: boolean;
  onClose: () => void;
}

export const RulesSheet: React.FC<RulesSheetProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-sheet-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[82%] flex flex-col rounded-t-3xl bg-[#103D33] border-t border-[#D4A243]/35 shadow-2xl animate-sheet-up"
      >
        <div className="pt-3 pb-2 px-5 flex flex-col items-center border-b border-[#F7F3E9]/10">
          <div className="w-10 h-1 rounded-full bg-[#F7F3E9]/25 mb-3" />
          <div className="w-full flex items-center justify-between">
            <h3 id="rules-sheet-title" className="font-display text-lg font-bold text-[#F7F3E9]">
              دليل تجربة «خلّص بنكك»
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق الدليل"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-[#B5C7C1] hover:text-[#F7F3E9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto iphone-scroll p-5 space-y-4 text-right">
          <div className="rounded-2xl bg-[#08231D] border border-[#D4A243]/25 p-4">
            <div className="flex items-center gap-2 text-[#E6B95E] font-display font-bold text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>قواعد ترتيب الأوراق</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#B5C7C1]">
              تطبّق الطاولة قواعد الترتيب المتسلسل: الأكوام المركزية تُبنى تصاعدياً من الآس (A) حتى الملك (K)، والأبواب تُرتّب تنازلياً (من الأكبر إلى الأصغر).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#D4A243]/15 text-[#E6B95E] flex items-center justify-center shrink-0">
                <Vault className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[#F7F3E9]">كروت «بنكك»</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-[#B5C7C1]">
                  تُلعب بطاقة البنك بالترتيب التصاعدي الصحيح على الأكوام المركزية فقط (لا توضع عشوائياً ولا تُنقل إلى الأبواب). تفريغ البنك بالكامل يحسم الجولة لصالحك.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#D4A243]/15 text-[#E6B95E] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[#F7F3E9]">الأكوام المركزية والأبواب الخمسة</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-[#B5C7C1]">
                  تبدأ كل كومة مركزية بالآس (A) وتتصاعد حتى الملك (K). أمّا الأبواب الخمسة فترتّب فيها بطاقات اليد أو الأبواب تنازلياً (مثل 6 تحت 7)، ويقبل الباب الفارغ أي بطاقة من اليد أو من باب آخر.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#F7F3E9]/10 pb-safe">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-xl bg-[#D4A243] text-[#061814] font-bold text-sm hover:bg-[#E6B95E] transition-colors"
          >
            فهمت — العودة للطاولة
          </button>
        </div>
      </div>
    </div>
  );
};
