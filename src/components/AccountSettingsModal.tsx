import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Bell,
  Save,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountSettingsModal: React.FC = () => {
  const {
    user,
    isAccountSettingsOpen,
    closeAccountSettings,
    updateProfile,
    changePassword,
    deleteAccount,
    enableTwoFactor,
    disableTwoFactor,
    updatePreferences,
    signOut,
    showToast,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2FA state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Status
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isAccountSettingsOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!name.trim()) {
      setStatusMessage({ text: 'Name cannot be empty', type: 'error' });
      return;
    }
    await updateProfile(name, email, avatarUrl);
    setStatusMessage({ text: 'Profile updated successfully!', type: 'success' });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (newPassword !== confirmPassword) {
      setStatusMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setStatusMessage({ text: 'Password successfully changed!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatusMessage({ text: res.error || 'Failed to update password.', type: 'error' });
    }
  };

  const handleConfirm2FA = async () => {
    if (twoFactorCode.length < 6) {
      setStatusMessage({ text: 'Enter a valid 6-digit authenticator code.', type: 'error' });
      return;
    }
    await enableTwoFactor('STRATUM_SECURE_TOTP_KEY', ['ST-9912', 'ST-4401', 'ST-7733']);
    setShow2FASetup(false);
    setStatusMessage({ text: 'Two-factor authentication is now active.', type: 'success' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2f2f2f] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#202020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#E4DFD3]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FF6124] text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-[#1C1917] dark:text-[#FAF8F3] leading-tight">
                Account & Workspace Settings
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAccountSettings}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-[#F1EEE4] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E4DFD3] dark:border-[#2a2a2a] bg-stone-50/60 dark:bg-[#181818] px-5">
          <button
            onClick={() => {
              setActiveTab('profile');
              setStatusMessage(null);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#FF6124] text-[#FF6124]'
                : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#1C1917]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => {
              setActiveTab('security');
              setStatusMessage(null);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#FF6124] text-[#FF6124]'
                : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#1C1917]'
            }`}
          >
            Security & Login
          </button>
          <button
            onClick={() => {
              setActiveTab('preferences');
              setStatusMessage(null);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#FF6124] text-[#FF6124]'
                : 'border-transparent text-[#57534E] dark:text-stone-400 hover:text-[#1C1917]'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <form onSubmit={handleChangePassword} className="space-y-3 p-4 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2f2f2f] rounded-xl">
                <h3 className="text-xs font-bold text-[#1C1917] dark:text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>Update Password</span>
                </h3>
                <div>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-[#151515] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    placeholder="New Password (6+ chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-[#151515] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-[#151515] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Change Password
                </button>
              </form>

              {/* 2FA */}
              <div className="p-4 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2f2f2f] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF6124]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1917] dark:text-white">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-[11px] text-[#57534E] dark:text-stone-400">
                        {user.twoFactorEnabled
                          ? 'Active — Your account is safeguarded with multi-factor tokens'
                          : 'Disabled — Add an extra layer of security'}
                      </p>
                    </div>
                  </div>
                  {user.twoFactorEnabled ? (
                    <button
                      type="button"
                      onClick={disableTwoFactor}
                      className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-semibold cursor-pointer"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShow2FASetup(true)}
                      className="px-3 py-1.5 text-xs text-[#FF6124] bg-[#FF6124]/10 hover:bg-[#FF6124]/20 rounded-lg font-bold cursor-pointer"
                    >
                      Enable 2FA
                    </button>
                  )}
                </div>

                {show2FASetup && !user.twoFactorEnabled && (
                  <div className="p-3 bg-[#FAF8F3] dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#333] rounded-xl space-y-2 animate-in fade-in">
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Scan with Google Authenticator or 1Password, then enter the code:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="123456"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-[#222] border border-[#E4DFD3] rounded-lg text-xs font-mono tracking-widest w-32"
                      />
                      <button
                        type="button"
                        onClick={handleConfirm2FA}
                        className="px-3 py-2 bg-[#FF6124] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Verify & Enable
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow2FASetup(false)}
                        className="px-2 py-2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2f2f2f] rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-[#1C1917] dark:text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>Workspace Intelligence Preferences</span>
                </h3>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      Anti-Drift Guardrails
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Alert when messaging or design diverges from approved core value.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.preferences?.antiDriftAlerts ?? true}
                    onChange={(e) => updatePreferences({ antiDriftAlerts: e.target.checked })}
                    className="rounded border-stone-300 text-[#FF6124] focus:ring-[#FF6124]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      Auto-Save Decisions
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Automatically persist approved research cards and design choices.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.preferences?.autoSaveDrafts ?? true}
                    onChange={(e) => updatePreferences({ autoSaveDrafts: e.target.checked })}
                    className="rounded border-stone-300 text-[#FF6124] focus:ring-[#FF6124]"
                  />
                </label>
              </div>

              {/* Sign Out & Delete Account */}
              <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-red-900 dark:text-red-300">Session Controls</h4>
                    <p className="text-[11px] text-red-700 dark:text-red-400">Sign out or purge local account data</p>
                  </div>
                  <button
                    type="button"
                    onClick={signOut}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-100 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete account and all projects</span>
                  </button>
                ) : (
                  <div className="p-3 bg-red-100 dark:bg-red-950/60 rounded-lg space-y-2">
                    <p className="text-xs font-semibold text-red-900 dark:text-red-200">
                      Are you sure? This will delete your profile and all saved brand ventures.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={deleteAccount}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 text-stone-600 hover:text-stone-900 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
