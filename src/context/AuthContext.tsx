import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthModalTab, AppTheme, UserPreferences } from '../types/auth';
import { firebaseAuthService } from '../services/firebaseAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  theme: AppTheme;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  isAccountSettingsOpen: boolean;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: AuthModalTab) => void;
  openAccountSettings: () => void;
  closeAccountSettings: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetCode: string }>;
  resetPasswordWithCode: (email: string, code: string, newPass: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (name: string, email: string, avatarUrl?: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<void>;
  enableTwoFactor: (secret: string, backupCodes: string[]) => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  clearToast: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const THEME_KEY = 'stratum_theme';

const DEFAULT_PREFERENCES: UserPreferences = {
  antiDriftAlerts: true,
  soundEffects: true,
  autoSaveDrafts: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('stratum_cached_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Listen to genuine Firebase Auth status changes
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange((fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        localStorage.setItem('stratum_cached_user', JSON.stringify(fbUser));
      } else {
        localStorage.removeItem('stratum_cached_user');
      }
    });

    return () => unsubscribe();
  }, []);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signin');
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Theme state: Default to 'light' mode unless explicitly set to 'dark' by user
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme class to root and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
      window.dispatchEvent(new CustomEvent('stratum_theme_changed', { detail: { theme } }));
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      showToast(`Switched to ${next === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'info');
      return next;
    });
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'info');
  };

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
  };

  const openAuthModal = (tab: AuthModalTab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAccountSettings = () => {
    setIsAccountSettingsOpen(true);
  };

  const closeAccountSettings = () => {
    setIsAccountSettingsOpen(false);
  };

  const signInWithGoogle = async () => {
    try {
      const googleUser = await firebaseAuthService.loginWithGoogle();
      setUser(googleUser);
      setIsAuthModalOpen(false);
      showToast(`Welcome, ${googleUser.name}! (Firebase Google Auth)`, 'success');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast(err.message || 'Google sign in failed. Please try email login.', 'error');
    }
  };

  const signInWithGitHub = async () => {
    showToast('Please sign in using Google or Email/Password.', 'info');
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const loggedInUser = await firebaseAuthService.loginWithEmail(email, password);
      setUser(loggedInUser);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      showToast(err.message || 'Incorrect email or password.', 'error');
      throw err;
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    try {
      const newUser = await firebaseAuthService.register(name, email, password);
      setUser(newUser);
      setIsAuthModalOpen(false);
      showToast(`Account created! Welcome to Stratum, ${newUser.name}.`, 'success');
    } catch (err: any) {
      console.error('Email Sign Up Error:', err);
      showToast(err.message || 'Failed to create account.', 'error');
      throw err;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await firebaseAuthService.requestPasswordReset(email);
      showToast('Password reset link sent to your email inbox.', 'info');
      return res;
    } catch (err: any) {
      showToast(err.message || 'Could not send reset email.', 'error');
      throw err;
    }
  };

  const resetPasswordWithCode = async (email: string, code: string, newPass: string) => {
    try {
      await firebaseAuthService.changePassword(newPass);
      showToast('Password updated successfully!');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Password update failed.', 'error');
      return false;
    }
  };

  const updateProfile = async (name: string, email: string, avatarUrl?: string) => {
    if (!user) return;
    try {
      await firebaseAuthService.updateProfile(name, email, avatarUrl);
      const updated: User = {
        ...user,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatarUrl: avatarUrl || user.avatarUrl,
      };
      setUser(updated);
      showToast('Profile updated successfully in Firestore');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentPassword) {
      return { success: false, error: 'Please enter your current password.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }
    try {
      await firebaseAuthService.changePassword(newPassword);
      showToast('Password updated successfully!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const enableTwoFactor = async (secret: string, backupCodes: string[]) => {
    if (!user) return;
    const updated: User = {
      ...user,
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      backupCodes,
    };
    setUser(updated);
    showToast('Two-factor authentication enabled successfully! 🛡️', 'success');
  };

  const disableTwoFactor = async () => {
    if (!user) return;
    const updated: User = {
      ...user,
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      backupCodes: undefined,
    };
    setUser(updated);
    showToast('Two-factor authentication disabled', 'info');
  };

  const deleteAccount = async () => {
    await firebaseAuthService.logout();
    setUser(null);
    setIsAccountSettingsOpen(false);
    showToast('You have signed out.', 'info');
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      preferences: {
        ...(user.preferences || DEFAULT_PREFERENCES),
        ...prefs,
      },
    };
    setUser(updated);
    await firebaseAuthService.updatePreferences(updated.preferences || DEFAULT_PREFERENCES);
    showToast('Preferences synchronized');
  };

  const signOut = async () => {
    await firebaseAuthService.logout();
    setUser(null);
    setIsAccountSettingsOpen(false);
    showToast('Signed out successfully', 'info');
  };

  const clearToast = () => setToastMessage(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        isAuthModalOpen,
        authModalTab,
        isAccountSettingsOpen,
        toastMessage,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        openAccountSettings,
        closeAccountSettings,
        signInWithGoogle,
        signInWithGitHub,
        signInWithEmail,
        signUpWithEmail,
        requestPasswordReset,
        resetPasswordWithCode,
        signOut,
        updateProfile,
        changePassword,
        deleteAccount,
        enableTwoFactor,
        disableTwoFactor,
        updatePreferences,
        toggleTheme,
        setTheme,
        clearToast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderContext');
  }
  return context;
};
