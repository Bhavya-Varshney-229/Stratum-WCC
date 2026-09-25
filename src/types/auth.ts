export type AuthProvider = 'google' | 'github' | 'email';

export type AppTheme = 'light' | 'dark';

export interface UserPreferences {
  antiDriftAlerts: boolean;
  soundEffects: boolean;
  autoSaveDrafts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  preferences?: UserPreferences;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
}

export type AuthModalTab = 'signin' | 'signup' | 'forgot';
