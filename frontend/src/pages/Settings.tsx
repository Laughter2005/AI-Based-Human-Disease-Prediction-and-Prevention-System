import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Trash2,
  Save,
  KeyRound,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export function Settings() {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [language, setLanguage] = useState<'en' | 'ny'>(
    user?.preferred_language ?? 'en'
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  /* ---------- Profile ---------- */
  async function saveProfile() {
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({
        full_name: fullName,
        preferred_language: language,
      });
      setUser(updated);
      toast.success(t('settings.profile.success'));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('settings.profile.error'));
    } finally {
      setSavingProfile(false);
    }
  }

  /* ---------- Email ---------- */
  async function saveEmail() {
    if (!newEmail || !emailPassword) {
      toast.error(t('settings.email.fill_all'));
      return;
    }
    setSavingEmail(true);
    try {
      const updated = await authService.changeEmail({
        new_email: newEmail,
        password: emailPassword,
      });
      setUser(updated);
      setNewEmail('');
      setEmailPassword('');
      toast.success(t('settings.email.success'));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('settings.email.error'));
    } finally {
      setSavingEmail(false);
    }
  }

  /* ---------- Password ---------- */
  async function savePassword() {
    if (!currentPassword || !newPassword) {
      toast.error(t('settings.password.fill_all'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('settings.password.mismatch'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('settings.password.too_short'));
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('settings.password.success'));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('settings.password.error'));
    } finally {
      setSavingPassword(false);
    }
  }

  /* ---------- Avatar ---------- */
  function handleAvatarPick() {
    fileRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('settings.avatar.error_type'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('settings.avatar.error_size'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (user) setUser({ ...user, avatar_url: dataUrl });
      toast.success(t('settings.avatar.preview_note'));
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    if (user) setUser({ ...user, avatar_url: null });
    toast.success(t('settings.avatar.removed'));
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('settings.eyebrow')}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('settings.title')}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-zinc-400">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {/* ============ Avatar ============ */}
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  {t('settings.avatar.label')}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                  {t('settings.avatar.title')}
                </h2>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="h-20 w-20 border border-slate-200 object-cover dark:border-zinc-800"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center bg-primary-600 font-display text-2xl font-bold text-white">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAvatarPick}
                      leftIcon={<Camera className="h-4 w-4" />}
                    >
                      {t('settings.avatar.upload')}
                    </Button>
                    {user.avatar_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeAvatar}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                      >
                        {t('settings.avatar.remove')}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
                  {t('settings.avatar.hint')}
                </p>
              </div>
            </section>

            {/* ============ Profile ============ */}
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {t('settings.profile.label')}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                      {t('settings.profile.title')}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-5">
                  <TextInput
                    label={t('settings.profile.name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('settings.profile.name_placeholder')}
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                      {t('settings.profile.language')}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'en' | 'ny')}
                      className="input"
                    >
                      <option value="en">{t('settings.profile.language_en')}</option>
                      <option value="ny">{t('settings.profile.language_ny')}</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={saveProfile}
                      loading={savingProfile}
                      leftIcon={!savingProfile && <Save className="h-4 w-4" />}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {t('settings.profile.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ============ Email ============ */}
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {t('settings.email.label')}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                      {t('settings.email.title')}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6 border-l-4 border-primary-600 bg-slate-50 p-4 dark:bg-zinc-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                    {t('settings.email.current')}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-5">
                  <TextInput
                    label={t('settings.email.new')}
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={t('settings.email.new_placeholder')}
                  />
                  <PasswordInput
                    label={t('settings.email.password')}
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder={t('settings.email.password_placeholder')}
                  />
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={saveEmail}
                      loading={savingEmail}
                      leftIcon={!savingEmail && <Save className="h-4 w-4" />}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {t('settings.email.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ============ Password ============ */}
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {t('settings.password.label')}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                      {t('settings.password.title')}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-5">
                  <PasswordInput
                    label={t('settings.password.current')}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t('settings.password.current_placeholder')}
                  />
                  <PasswordInput
                    label={t('settings.password.new')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('settings.password.new_placeholder')}
                  />
                  <PasswordInput
                    label={t('settings.password.confirm')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('settings.password.confirm_placeholder')}
                  />
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={savePassword}
                      loading={savingPassword}
                      leftIcon={!savingPassword && <Save className="h-4 w-4" />}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {t('settings.password.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}