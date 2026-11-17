import React, { useState } from 'react';
import {
  Volume2,
  Vibrate,
  Type,
  Clock,
  LogOut,
  Trash2,
  BookOpen,
  Check,
} from 'lucide-react';
import { AppSettings, ScreenId, UserProfile } from '../types/prototype';
import { AssetImage } from '../components/ui/AssetImage';
import { MobileTopBar } from '../components/ui/MobileTopBar';
import { BottomTabBar } from '../components/ui/BottomTabBar';

interface ProfileSettingsScreenProps {
  profile: UserProfile;
  settings: AppSettings;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateName: (newName: string) => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onOpenRules: () => void;
  onRequestLogout: () => void;
  onRequestDeleteAccount: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  profile,
  settings,
  onBack,
  onNavigate,
  onUpdateName,
  onUpdateSettings,
  onOpenRules,
  onRequestLogout,
  onRequestDeleteAccount,
}) => {
  const [editingName, setEditingName] = useState(profile.name);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim().length >= 2) {
      onUpdateName(editingName.trim());
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 1800);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MobileTopBar title="الملف الشخصي والإعدادات" onBack={onBack} />

      <div className="flex-1 overflow-y-auto iphone-scroll px-5 py-5 space-y-5">
        {/* Profile Header */}
        <div className="rounded-3xl bg-[#103D33] border border-[#D4A243]/30 p-4 space-y-3">
          <div className="flex items-center gap-3.5">
            <AssetImage
              src={profile.avatar}
              alt={profile.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#D4A243]/45 shrink-0"
              fallbackLabel={profile.name}
            />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-[#F7F3E9] truncate">
                {profile.name}
              </h3>
              <p className="text-xs text-[#B5C7C1] tabular-nums">
                {profile.isGuest ? 'حساب ضيف تجريبي' : profile.handle} · {profile.demoMatchesPlayed} جولات
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="flex items-center gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              aria-label="تعديل اسم اللاعب"
              maxLength={24}
              className="flex-1 min-h-[42px] px-3 rounded-xl bg-[#08231D] border border-[#F7F3E9]/15 text-xs text-[#F7F3E9] focus:outline-none focus:border-[#D4A243]"
            />
            <button
              type="submit"
              className="min-h-[42px] px-3.5 rounded-xl bg-[#D4A243] text-[#061814] text-xs font-bold flex items-center gap-1 whitespace-nowrap"
            >
              {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{savedNotice ? 'تم الحفظ' : 'تحديث'}</span>
            </button>
          </form>
        </div>

        {/* Sensory & Accessibility Preferences */}
        <section className="space-y-2">
          <h4 className="font-display text-sm font-bold text-[#F7F3E9]">تفضيلات اللعب</h4>
          <div className="rounded-2xl bg-[#103D33]/80 border border-[#F7F3E9]/10 divide-y divide-[#F7F3E9]/10">
            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className="w-full min-h-[54px] px-4 flex items-center justify-between text-right"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#F7F3E9]">
                <Volume2 className="w-4 h-4 text-[#D4A243]" />
                <span>المؤثرات الصوتية</span>
              </span>
              <span
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.soundEnabled ? 'bg-[#D4A243] justify-start' : 'bg-[#08231D] justify-end'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#FDFBF7] shadow" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
              className="w-full min-h-[54px] px-4 flex items-center justify-between text-right"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#F7F3E9]">
                <Vibrate className="w-4 h-4 text-[#D4A243]" />
                <span>الاهتزاز اللمسي (Haptics)</span>
              </span>
              <span
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.hapticsEnabled ? 'bg-[#D4A243] justify-start' : 'bg-[#08231D] justify-end'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#FDFBF7] shadow" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ largeCardText: !settings.largeCardText })}
              className="w-full min-h-[54px] px-4 flex items-center justify-between text-right"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#F7F3E9]">
                <Type className="w-4 h-4 text-[#D4A243]" />
                <span>تكبير أرقام البطاقات</span>
              </span>
              <span
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.largeCardText ? 'bg-[#D4A243] justify-start' : 'bg-[#08231D] justify-end'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#FDFBF7] shadow" />
              </span>
            </button>
          </div>
        </section>

        {/* Preferred Turn Timer */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F3E9]">
            <Clock className="w-4 h-4 text-[#D4A243]" />
            <span>مدة الدور الافتراضية</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 45].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => onUpdateSettings({ preferredTurnSeconds: sec })}
                className={`min-h-[44px] rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                  settings.preferredTurnSeconds === sec
                    ? 'bg-[#D4A243] border-[#D4A243] text-[#061814]'
                    : 'bg-[#08231D] border-[#F7F3E9]/12 text-[#F7F3E9]'
                }`}
              >
                {sec} ثانية
              </button>
            ))}
          </div>
        </section>

        {/* Help & Account Actions */}
        <section className="space-y-2 pb-2">
          <button
            type="button"
            onClick={onOpenRules}
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#103D33] border border-[#F7F3E9]/12 text-xs font-semibold text-[#F7F3E9] flex items-center gap-2.5"
          >
            <BookOpen className="w-4 h-4 text-[#D4A243]" />
            <span>دليل النموذج الأولي وتفاصيل البنية</span>
          </button>

          <button
            type="button"
            onClick={onRequestLogout}
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#103D33] border border-[#F7F3E9]/12 text-xs font-semibold text-[#F7F3E9] flex items-center gap-2.5"
          >
            <LogOut className="w-4 h-4 text-[#E6B95E]" />
            <span>تسجيل الخروج من الجلسة التجريبية</span>
          </button>

          <button
            type="button"
            onClick={onRequestDeleteAccount}
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#C8322B]/12 border border-[#C8322B]/35 text-xs font-bold text-[#F87171] flex items-center gap-2.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف الحساب (معاينة متطلب App Store)</span>
          </button>
        </section>
      </div>

      <BottomTabBar currentScreen="profile" onNavigate={onNavigate} />
    </div>
  );
};
