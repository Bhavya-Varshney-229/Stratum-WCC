import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  Check,
  AlertCircle,
  Sparkles,
  Sliders,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  Smartphone,
  Copy,
  Download,
  QrCode,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WorkflowStep } from '../../types/brand';

interface SettingsScreenProps {
  onNavigate: (step: WorkflowStep) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const {
    user,
    isAuthenticated,
    theme,
    setTheme,
    signOut,
    changePassword,
    deleteAccount,
    enableTwoFactor,
    disableTwoFactor,
    openAuthModal,
    showToast,
  } = useAuth();

  // 1. Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 2. 2FA State
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSecret] = useState('JBSWY3DPEHPK3PXP');
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>([]);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  // 3. Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 4. Logout Confirm State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-neutral-200 dark:bg-neutral-800' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSubmittingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSubmittingPassword(false);

    if (res.success) {
      setPasswordStatus({
        type: 'success',
        text: 'Password updated successfully! Your account credentials have been secured.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({
        type: 'error',
        text: res.error || 'Failed to update password. Please check your credentials.',
      });
    }
  };

  // 2FA Handlers
  const handleStart2FASetup = () => {
    setIsSettingUp2FA(true);
    // Generate 6 sample recovery backup codes
    const codes = Array.from({ length: 6 }, () =>
      Math.floor(10000000 + Math.random() * 90000000)
        .toString()
        .replace(/(\d{4})(\d{4})/, '$1-$2')
    );
    setGeneratedBackupCodes(codes);
  };

  const handleVerify2FACode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      showToast('Please enter the full 6-digit code', 'error');
      return;
    }

    setIsVerifying2FA(true);
    await enableTwoFactor(twoFactorSecret, generatedBackupCodes);
    setIsVerifying2FA(false);
    setIsSettingUp2FA(false);
    setShowBackupCodesModal(true);
    setTwoFactorCode('');
  };

  const handleDisable2FA = async () => {
    await disableTwoFactor();
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(twoFactorSecret);
    showToast('Secret key copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const content = `NO BUGS Two-Factor Authentication Recovery Codes\nAccount: ${user?.email}\nGenerated: ${new Date().toLocaleString()}\n\nKeep these codes in a safe place. Each code can only be used once.\n\n${(user?.backupCodes || generatedBackupCodes).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nobugs-2fa-backup-codes.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup codes downloaded');
  };

  // Account Deletion Handlers
  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error');
      return;
    }

    setIsDeletingAccount(true);
    await deleteAccount();
    setIsDeletingAccount(false);
    setShowDeleteModal(false);
    onNavigate('landing');
  };

  const handleSignOutClick = () => {
    signOut();
    setShowLogoutConfirm(false);
    onNavigate('landing');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124]">
            <Sliders className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            Account & Security Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your theme, password credentials, two-factor authentication, and account lifecycle.
        </p>
      </div>

      {/* 1. Theme Configuration (Dark / Light Mode) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#FF6124]" />
            ) : (
              <Sun className="w-4 h-4 text-[#FF6124]" />
            )}
            <span>Interface Theme</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Switch between Light and Dark mode. Changes take effect across all workspace screens immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              theme === 'light'
                ? 'border-[#FF6124] bg-white shadow-md ring-2 ring-[#FF6124]/20'
                : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] hover:border-neutral-400 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme (Warm Paper)</span>
              </div>
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-[#FF6124] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Warm editorial paper aesthetic (#F1EEE4) with crisp high-contrast typography.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-[#F1EEE4] border border-[#E4DFD3] space-y-1.5 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6124]" />
                <div className="h-2 w-16 bg-neutral-300 rounded" />
              </div>
              <div className="h-2 w-full bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              theme === 'dark'
                ? 'border-[#FF6124] bg-[#1a1a1a] shadow-md ring-2 ring-[#FF6124]/20'
                : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] hover:border-neutral-400 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <Moon className="w-4 h-4 text-[#FF6124]" />
                <span>Dark Theme (Obsidian Studio)</span>
              </div>
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-[#FF6124] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Low-glare dark studio aesthetic (#121212) with neon orange highlights for focus.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-[#121212] border border-[#2a2a2a] space-y-1.5 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6124]" />
                <div className="h-2 w-16 bg-neutral-700 rounded" />
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Change Password Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FF6124]" />
            <span>Change Password</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Update your account password to protect access to your brand models and workspace.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-4">
          {user?.provider === 'google' || user?.provider === 'github' ? (
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Signed in via {user.provider === 'google' ? 'Google OAuth' : 'GitHub OAuth'}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Your primary authentication is securely verified by your provider. You may also set an optional master password below to enable direct email sign-in.
                </p>
              </div>
            </div>
          ) : null}

          {passwordStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                passwordStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}
            >
              {passwordStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{passwordStatus.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D8D2C5] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#121212] text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6124] focus:ring-1 focus:ring-[#FF6124] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 cursor-pointer"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D8D2C5] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#121212] text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6124] focus:ring-1 focus:ring-[#FF6124] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 cursor-pointer"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {newPassword && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500 dark:text-neutral-400">Password strength:</span>
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D8D2C5] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#121212] text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6124] focus:ring-1 focus:ring-[#FF6124] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] active:bg-[#d64a15] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isSubmittingPassword ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 3. Two-Factor Authentication (2FA) Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#FF6124]" />
            <span>Two-Factor Authentication (2FA)</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Add an extra layer of security to your NO BUGS account using time-based one-time passcodes (TOTP).
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-5">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#262626]">
            <div className="flex items-center gap-3">
              {user?.twoFactorEnabled ? (
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    2FA Status:
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      user?.twoFactorEnabled
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}
                  >
                    {user?.twoFactorEnabled ? 'Enabled & Active 🛡️' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {user?.twoFactorEnabled
                    ? 'Your account is secured with authenticator verification.'
                    : 'Requires an authenticator code in addition to your credentials.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user?.twoFactorEnabled ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowBackupCodesModal(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D8D2C5] dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    View Backup Codes
                  </button>
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
                  >
                    Disable 2FA
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStart2FASetup}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-colors cursor-pointer shadow-xs"
                >
                  Set Up 2FA
                </button>
              )}
            </div>
          </div>

          {/* Interactive 2FA Setup Flow */}
          {isSettingUp2FA && (
            <div className="p-5 rounded-xl border border-[#FF6124]/30 bg-[#FF6124]/5 dark:bg-[#FF6124]/10 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#FF6124]" />
                  <span>Scan QR Code with Authenticator App</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSettingUp2FA(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Visual QR Code Box */}
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#121212] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] text-center space-y-2">
                  {/* Generated SVG QR Code pattern */}
                  <div className="w-36 h-36 bg-neutral-900 dark:bg-white p-3 rounded-lg flex items-center justify-center">
                    <svg className="w-full h-full text-white dark:text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" />
                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" />
                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" />
                      <rect x="35" y="10" width="8" height="8" />
                      <rect x="48" y="10" width="8" height="8" />
                      <rect x="35" y="25" width="8" height="8" />
                      <rect x="55" y="25" width="8" height="8" />
                      <rect x="40" y="40" width="20" height="20" />
                      <rect x="15" y="45" width="8" height="8" />
                      <rect x="75" y="45" width="8" height="8" />
                      <rect x="40" y="70" width="10" height="10" />
                      <rect x="60" y="70" width="10" height="10" />
                      <rect x="80" y="70" width="10" height="10" />
                      <rect x="70" y="85" width="15" height="10" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Google Authenticator / 1Password / Authy
                  </span>
                </div>

                {/* Secret Key & Verification Form */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Can't scan? Enter secret manually:
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-[#121212] font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
                        {twoFactorSecret}
                      </code>
                      <button
                        type="button"
                        onClick={copySecretToClipboard}
                        className="p-2 rounded-lg border border-[#D8D2C5] dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 cursor-pointer"
                        title="Copy Secret Key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleVerify2FACode} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Enter 6-Digit Authenticator Code:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        className="w-full text-center text-lg tracking-widest font-mono font-bold py-2 rounded-xl border border-[#D8D2C5] dark:border-[#333] bg-white dark:bg-[#121212] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6124] focus:ring-1 focus:ring-[#FF6124]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying2FA || twoFactorCode.length < 6}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying2FA ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Enable 2FA</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Danger Zone: Delete Account & Sign Out */}
      <section className="space-y-4 pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Irreversible actions regarding your account profile and stored audience projects.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4">
          {/* Sign Out Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-100 dark:border-red-950/50">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Log Out of Account
              </h3>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Concludes your current active session on this device.
              </p>
            </div>

            {showLogoutConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 dark:text-red-300 font-semibold">Confirm?</span>
                <button
                  type="button"
                  onClick={handleSignOutClick}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Sign Out
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100/60 dark:hover:bg-red-950/40 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>

          {/* Delete Account Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <h3 className="text-xs font-bold text-red-700 dark:text-red-400">
                Delete Account & Purge Data
              </h3>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 max-w-md">
                Permanently deletes your user credentials, profile session, and all saved audience shift projects from this workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-red-200 dark:border-red-900/60 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-50">
                Delete Account Permanently?
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This action <strong>cannot be undone</strong>. This will permanently delete your account, session, and all previously saved NO BUGS brand projects.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                Type <strong className="text-red-600 font-mono">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20 text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#252525] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                onClick={handleDeleteAccountConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {isDeletingAccount ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete My Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Backup Codes Modal */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-emerald-300 dark:border-emerald-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-50 leading-tight">
                  2FA Backup Recovery Codes
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Save these codes now. You will need them if you lose access to your authenticator.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 text-center">
              {(user?.backupCodes || generatedBackupCodes).map((code, idx) => (
                <div key={idx} className="p-1.5 bg-white dark:bg-[#1c1c1c] rounded border border-neutral-200 dark:border-neutral-800">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={downloadBackupCodes}
                className="px-3.5 py-2 rounded-xl border border-[#D8D2C5] dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#252525] text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBackupCodesModal(false)}
                className="px-4 py-2 rounded-xl bg-[#FF6124] hover:bg-[#e5531b] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
