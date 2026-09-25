import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  updatePassword as fbUpdatePassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, googleAuthProvider, db } from './firebase';
import { User, UserPreferences } from '../types/auth';

const DEFAULT_PREFERENCES: UserPreferences = {
  antiDriftAlerts: true,
  soundEffects: true,
  autoSaveDrafts: true,
};

// Map Firebase User to Stratum User Model
export async function mapFirebaseUserToStratumUser(fbUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, 'users', fbUser.uid);
  let userSnap = null;
  try {
    userSnap = await getDoc(userRef);
  } catch (err) {
    console.warn('Could not read user profile from Firestore:', err);
  }

  const firestoreData = userSnap?.exists() ? userSnap.data() : null;

  const stratumUser: User = {
    id: fbUser.uid,
    name: fbUser.displayName || firestoreData?.name || fbUser.email?.split('@')[0] || 'Venture Founder',
    email: fbUser.email || firestoreData?.email || '',
    avatarUrl: fbUser.photoURL || firestoreData?.avatarUrl,
    provider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    preferences: firestoreData?.preferences || DEFAULT_PREFERENCES,
  };

  // Sync to Firestore if record does not exist
  if (!firestoreData && fbUser.email) {
    try {
      await setDoc(userRef, {
        id: stratumUser.id,
        name: stratumUser.name,
        email: stratumUser.email,
        avatarUrl: stratumUser.avatarUrl || '',
        provider: stratumUser.provider,
        createdAt: stratumUser.createdAt,
        preferences: stratumUser.preferences,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (saveErr) {
      console.warn('Could not initialize user profile in Firestore:', saveErr);
    }
  }

  return stratumUser;
}

export const firebaseAuthService = {
  // Listen for Firebase Auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const user = await mapFirebaseUserToStratumUser(fbUser);
          callback(user);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Get current user synchronously if cached
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Email & Password Registration
  async register(name: string, email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name.trim()) {
      await fbUpdateProfile(cred.user, { displayName: name.trim() });
    }
    const userRef = doc(db, 'users', cred.user.uid);
    const stratumUser: User = {
      id: cred.user.uid,
      name: name.trim() || email.split('@')[0],
      email: cred.user.email || email,
      provider: 'email',
      createdAt: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES,
    };

    try {
      await setDoc(userRef, {
        ...stratumUser,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore set user error:', err);
    }

    return stratumUser;
  },

  // Email & Password Login
  async loginWithEmail(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return await mapFirebaseUserToStratumUser(cred.user);
  },

  // Google Login Popup
  async loginWithGoogle(): Promise<User> {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    return await mapFirebaseUserToStratumUser(cred.user);
  },

  // Password Reset Email
  async requestPasswordReset(email: string): Promise<{ success: boolean; resetCode: string }> {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, resetCode: 'SENT_TO_EMAIL' };
  },

  // Update Profile Name / Avatar
  async updateProfile(name: string, email: string, avatarUrl?: string): Promise<void> {
    const cur = auth.currentUser;
    if (!cur) throw new Error('Not authenticated');

    await fbUpdateProfile(cur, {
      displayName: name.trim(),
      photoURL: avatarUrl || cur.photoURL,
    });

    const userRef = doc(db, 'users', cur.uid);
    await updateDoc(userRef, {
      name: name.trim(),
      avatarUrl: avatarUrl || cur.photoURL || '',
      updatedAt: new Date().toISOString(),
    });
  },

  // Change Password
  async changePassword(newPass: string): Promise<void> {
    const cur = auth.currentUser;
    if (!cur) throw new Error('Not authenticated');
    await fbUpdatePassword(cur, newPass);
  },

  // Update Preferences in Firestore
  async updatePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const cur = auth.currentUser;
    if (!cur) return;
    const userRef = doc(db, 'users', cur.uid);
    await updateDoc(userRef, {
      preferences: prefs,
      updatedAt: new Date().toISOString(),
    });
  },

  // Logout
  async logout(): Promise<void> {
    await fbSignOut(auth);
  },
};
