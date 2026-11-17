import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'إلغاء',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-[310px] rounded-2xl bg-[#103D33] border border-[#D4A243]/30 p-5 shadow-2xl text-right animate-fade-scale">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {destructive && (
              <span className="w-9 h-9 rounded-xl bg-[#C8322B]/20 border border-[#C8322B]/40 flex items-center justify-center text-[#F87171] shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
            )}
            <h3 id="confirm-modal-title" className="font-display text-base font-bold text-[#F7F3E9]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="إغلاق"
            className="min-h-[40px] min-w-[40px] -m-2 flex items-center justify-center rounded-xl text-[#B5C7C1] hover:text-[#F7F3E9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#B5C7C1]">{message}</p>

        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[44px] rounded-xl border border-[#F7F3E9]/15 bg-[#08231D] text-sm font-medium text-[#F7F3E9] hover:bg-[#0B2E26] transition-colors whitespace-nowrap"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 min-h-[44px] rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              destructive
                ? 'bg-[#C8322B] text-white hover:bg-[#B22923]'
                : 'bg-[#D4A243] text-[#061814] hover:bg-[#E6B95E]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
