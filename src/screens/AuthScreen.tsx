import React, { useState } from 'react';
import { Eye, EyeOff, UserCheck } from 'lucide-react';
import { DESIGN_ASSETS } from '../theme/designTokens';
import { AssetImage } from '../components/ui/AssetImage';
import { MobileTopBar } from '../components/ui/MobileTopBar';

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: (name: string, isGuest: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack, onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('سلطان المري');
  const [email, setEmail] = useState('player@khalasbankak.demo');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'register' && name.trim().length < 2) {
      setErrorMsg('يرجى إدخال اسم لاعب لا يقل عن حرفين');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صحيح للتجربة');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setErrorMsg('');
    onAuthSuccess(tab === 'register' ? name.trim() : name.trim() || 'لاعب خلّص بنكك', false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="الحساب والدخول" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <AssetImage
            src={DESIGN_ASSETS.emblem}
            alt="خلّص بنكك"
            className="w-12 h-12 rounded-2xl object-cover border border-[#D4A243]/35 shrink-0"
            fallbackLabel="شعار"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-[#F7F3E9]">
              {tab === 'login' ? 'مرحباً بعودتك' : 'أنشئ حسابك الجديد'}
            </h1>
            <p className="text-xs text-[#B5C7C1]">
              محاكاة تسجيل الدخول للعرض فقط · لا يتصل بقاعدة بيانات
            </p>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#08231D] border border-[#F7F3E9]/10">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              tab === 'login'
                ? 'bg-[#D4A243] text-[#061814]'
                : 'text-[#B5C7C1] hover:text-[#F7F3E9]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              tab === 'register'
                ? 'bg-[#D4A243] text-[#061814]'
                : 'text-[#B5C7C1] hover:text-[#F7F3E9]'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="block text-xs font-medium text-[#B5C7C1]">
                اسم اللاعب
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سلطان المري"
                className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-sm text-[#F7F3E9] placeholder:text-[#B5C7C1]/50 focus:outline-none focus:border-[#D4A243]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="block text-xs font-medium text-[#B5C7C1]">
              البريد الإلكتروني
            </label>
            <input
              id="auth-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-sm text-left text-[#F7F3E9] focus:outline-none focus:border-[#D4A243]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="block text-xs font-medium text-[#B5C7C1]">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[46px] pl-11 pr-3.5 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-sm text-left text-[#F7F3E9] focus:outline-none focus:border-[#D4A243]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute left-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#B5C7C1] hover:text-[#F7F3E9]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#F87171] bg-[#C8322B]/15 border border-[#C8322B]/35 rounded-xl px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-[#D4A243] text-[#061814] font-display font-bold text-sm hover:bg-[#E6B95E] active:scale-[0.99] transition-all whitespace-nowrap"
          >
            {tab === 'login' ? 'دخول تجريبي' : 'إنشاء الحساب والدخول'}
          </button>
        </form>

        <div className="relative py-1 flex items-center justify-center">
          <div className="w-full h-px bg-[#F7F3E9]/10" />
          <span className="px-3 text-[11px] text-[#B5C7C1] bg-[#0B2E26] whitespace-nowrap">
            أو جرّب فوراً
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onAuthSuccess('حساب Apple تجريبي', false)}
            className="w-full min-h-[46px] rounded-xl bg-[#FDFBF7] text-[#061814] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors whitespace-nowrap"
          >
            <span>المتابعة عبر Apple (محاكاة)</span>
          </button>

          <button
            type="button"
            onClick={() => onAuthSuccess('ضيف الطاولة', true)}
            className="w-full min-h-[46px] rounded-xl bg-[#103D33] border border-[#D4A243]/30 text-[#F7F3E9] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#154B3F] transition-colors whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4 text-[#D4A243]" />
            <span>الدخول كضيف بدون تسجيل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
