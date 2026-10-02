import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, Trash2, Save, KeyRound, Mail, User as UserIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export function Settings() {
  const { user, setUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [language, setLanguage] = useState<'en' | 'ny'>(user?.preferred_language ?? 'en');
  const [savingProfile, setSavingProfile] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({
        full_name: fullName,
        preferred_language: language,
      });
      setUser(updated);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveEmail() {
    if (!newEmail || !emailPassword) {
      toast.error('Enter new email and your password');
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
      toast.success('Email updated');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Update failed');
    } finally {
      setSavingEmail(false);
    }
  }

  async function savePassword() {
    if (!currentPassword || !newPassword) {
      toast.error('Fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
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
      toast.success('Password changed');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Update failed');
    } finally {
      setSavingPassword(false);
    }
  }

  function handleAvatarPick() {
    fileRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2 MB');
      return;
    }

    // Local preview only — backend upload endpoint not built yet
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (user) setUser({ ...user, avatar_url: dataUrl });
      toast.success('Avatar updated (preview only — upload endpoint coming soon)');
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    if (user) setUser({ ...user, avatar_url: null });
    toast.success('Avatar removed');
  }

  if (!user) return null;

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
          Account settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Manage your profile, email, and password.
        </p>

        {/* Avatar */}
        <Card className="mt-8">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
            Profile picture
          </h2>
          <div className="mt-4 flex items-center gap-5">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="h-20 w-20 rounded object-cover ring-2 ring-slate-200 dark:ring-zinc-700"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded bg-primary-500 font-display text-2xl font-bold text-white">
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
              <Button variant="secondary" size="sm" onClick={handleAvatarPick} leftIcon={<Camera className="h-4 w-4" />}>
                Upload image
              </Button>
              {user.avatar_url && (
                <Button variant="ghost" size="sm" onClick={removeAvatar} leftIcon={<Trash2 className="h-4 w-4" />}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
            JPG, PNG, or GIF. Max 2 MB.
          </p>
        </Card>

        {/* Profile */}
        <Card className="mt-6">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Personal info
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <TextInput
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Banda"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Preferred language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ny')}
                className="input"
              >
                <option value="en">English</option>
                <option value="ny">Chichewa</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button
                variant="gradient"
                onClick={saveProfile}
                loading={savingProfile}
                leftIcon={!savingProfile && <Save className="h-4 w-4" />}
              >
                Save profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Email */}
        <Card className="mt-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Email address
            </h2>
          </div>

          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400">
            Current: <span className="font-medium text-slate-800 dark:text-zinc-200">{user.email}</span>
          </p>

          <div className="mt-5 space-y-4">
            <TextInput
              label="New email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@example.com"
            />
            <PasswordInput
              label="Confirm with your password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="flex justify-end">
              <Button
                variant="gradient"
                onClick={saveEmail}
                loading={savingEmail}
                leftIcon={!savingEmail && <Save className="h-4 w-4" />}
              >
                Update email
              </Button>
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="mt-6">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Change password
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <PasswordInput
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <PasswordInput
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <PasswordInput
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
            <div className="flex justify-end">
              <Button
                variant="gradient"
                onClick={savePassword}
                loading={savingPassword}
                leftIcon={!savingPassword && <Save className="h-4 w-4" />}
              >
                Change password
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}