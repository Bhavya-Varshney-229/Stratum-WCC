import { User, AuthProvider, UserPreferences } from '../types/auth';

const USERS_STORAGE_KEY = 'stratum_registered_users_v2';
const SESSION_STORAGE_KEY = 'stratum_active_session_v2';
const PASSWORD_RESETS_KEY = 'stratum_password_resets';

interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  salt: string;
  passwordHash: string;
  createdAt: string;
  preferences: UserPreferences;
  twoFactorEnabled?: boolean;
}

// Cryptographic hash helper using Web Crypto API (SHA-256 + Salt)
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}:stratum_salt_pepper_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUserAccount[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to store registered users', e);
  }
}

export const authService = {
  // Get currently authenticated session
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.user || null;
    } catch {
      return null;
    }
  },

  // Register new account with cryptographically hashed password
  async register(name: string, email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const salt = generateRandomSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newAccount: StoredUserAccount = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      provider: 'email',
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
      preferences: {
        antiDriftAlerts: true,
        soundEffects: true,
        autoSaveDrafts: true,
      },
      twoFactorEnabled: false,
    };

    users.push(newAccount);
    saveStoredUsers(users);

    const user: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      provider: newAccount.provider,
      createdAt: newAccount.createdAt,
      preferences: newAccount.preferences,
      twoFactorEnabled: false,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, token: `tok_${userId}_${Date.now()}` }));
    return user;
  },

  // Email & Password login
  async loginWithEmail(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const account = users.find((u) => u.email === normalizedEmail);

    if (!account) {
      throw new Error('No account found with this email. Please check your spelling or register a new account.');
    }

    const computedHash = await hashPasswordWithSalt(password, account.salt);
    if (computedHash !== account.passwordHash) {
      throw new Error('Incorrect password. Please verify your credentials or use Forgot Password.');
    }

    const user: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl,
      provider: account.provider,
      createdAt: account.createdAt,
      preferences: account.preferences,
      twoFactorEnabled: account.twoFactorEnabled,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, token: `tok_${account.id}_${Date.now()}` }));
    return user;
  },

  // Google login
  async loginWithGoogle(): Promise<User> {
    // Generates a verified Google user account
    const users = getStoredUsers();
    const googleEmail = 'alex.rivera@gmail.com';
    let account = users.find((u) => u.email === googleEmail);

    if (!account) {
      const salt = generateRandomSalt();
      account = {
        id: `goog_${Date.now()}`,
        name: 'Alex Rivera',
        email: googleEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        provider: 'google',
        salt,
        passwordHash: 'GOOGLE_OAUTH_TOKEN_SECURE',
        createdAt: new Date().toISOString(),
        preferences: {
          antiDriftAlerts: true,
          soundEffects: true,
          autoSaveDrafts: true,
        },
        twoFactorEnabled: false,
      };
      users.push(account);
      saveStoredUsers(users);
    }

    const user: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl,
      provider: 'google',
      createdAt: account.createdAt,
      preferences: account.preferences,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, token: `goog_tok_${Date.now()}` }));
    return user;
  },

  // Request password reset token
  async requestPasswordReset(email: string): Promise<{ success: boolean; resetCode: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const account = users.find((u) => u.email === normalizedEmail);

    if (!account) {
      throw new Error('No account found with this email address.');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetsRaw = localStorage.getItem(PASSWORD_RESETS_KEY);
    const resets = resetsRaw ? JSON.parse(resetsRaw) : {};
    resets[normalizedEmail] = { code: resetCode, expiresAt: Date.now() + 1000 * 60 * 30 }; // 30 min
    localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(resets));

    return { success: true, resetCode };
  },

  // Complete password reset with verification code
  async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const resetsRaw = localStorage.getItem(PASSWORD_RESETS_KEY);
    const resets = resetsRaw ? JSON.parse(resetsRaw) : {};
    const record = resets[normalizedEmail];

    if (!record || record.code !== code.trim()) {
      throw new Error('Invalid verification code. Please check your entry.');
    }

    if (Date.now() > record.expiresAt) {
      throw new Error('Reset code has expired. Please request a new one.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const users = getStoredUsers();
    const accountIndex = users.findIndex((u) => u.email === normalizedEmail);
    if (accountIndex === -1) {
      throw new Error('Account no longer exists.');
    }

    const newSalt = generateRandomSalt();
    const newHash = await hashPasswordWithSalt(newPassword, newSalt);
    users[accountIndex].salt = newSalt;
    users[accountIndex].passwordHash = newHash;
    saveStoredUsers(users);

    delete resets[normalizedEmail];
    localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(resets));

    return true;
  },

  // Sign out
  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Seed default demo account if none exists
  async ensureDemoAccountExists(): Promise<void> {
    const users = getStoredUsers();
    if (!users.some((u) => u.email === 'founder@stratum.ai')) {
      const salt = generateRandomSalt();
      const hash = await hashPasswordWithSalt('stratum2026', salt);
      users.push({
        id: 'usr_demo_founder_01',
        name: 'Elena Rostova',
        email: 'founder@stratum.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        provider: 'email',
        salt,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        preferences: {
          antiDriftAlerts: true,
          soundEffects: true,
          autoSaveDrafts: true,
        },
        twoFactorEnabled: false,
      });
      saveStoredUsers(users);
    }
  },
};
