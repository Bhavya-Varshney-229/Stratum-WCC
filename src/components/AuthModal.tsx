import React, { useState } from 'react';
import {
  X,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    requestPasswordReset,
    resetPasswordWithCode,
  } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password reset states
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedDemoCode, setGeneratedDemoCode] = useState<string | null>(null);

  // Status states
  const [isLoading, setIsLoading] = useState<'google' | 'github' | 'email' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleResetForm = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setResetStep('request');
    setGeneratedDemoCode(null);
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading('google');
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect with Google. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      setIsLoading('github');
      setErrorMessage(null);
      await signInWithGitHub();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect with GitHub. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Forgot Password Flow
    if (authModalTab === 'forgot') {
      if (resetStep === 'request') {
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }
        setIsLoading('email');
        try {
          const res = await requestPasswordReset(email);
          setResetStep('verify');
          setGeneratedDemoCode(res.resetCode);
          setSuccessMessage(`Reset code generated! For your convenience in this environment, your code is: ${res.resetCode}`);
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to request reset. Verify the email or register.');
        } finally {
          setIsLoading(null);
        }
        return;
      } else {
        // Step 2: verify and update
        if (!resetCode.trim()) {
          setErrorMessage('Please enter the 6-digit verification code.');
          return;
        }
        if (newPassword.length < 6) {
          setErrorMessage('New password must be at least 6 characters.');
          return;
        }
        setIsLoading('email');
        try {
          await resetPasswordWithCode(email, resetCode, newPassword);
          setSuccessMessage('Password reset successfully! You can now sign in.');
          setTimeout(() => {
            setAuthModalTab('signin');
            handleResetForm();
          }, 1200);
        } catch (err: any) {
          setErrorMessage(err.message || 'Invalid or expired code.');
        } finally {
          setIsLoading(null);
        }
        return;
      }
    }

    // 2. Email Validation
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // 3. Sign Up Flow
    if (authModalTab === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must agree to the Terms of Service to continue.');
        return;
      }

      try {
        setIsLoading('email');
        await signUpWithEmail(name, email, password);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed. An account may already exist with this email.');
      } finally {
        setIsLoading(null);
      }
    } else {
      // 4. Sign In Flow
      try {
        setIsLoading('email');
        await signInWithEmail(email, password);
      } catch (err: any) {
        setErrorMessage(err.message || 'Invalid email or password. Please verify your credentials.');
      } finally {
        setIsLoading(null);
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('founder@stratum.ai');
    setPassword('stratum2026');
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2f2f2f] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#202020] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF6124] rounded-lg flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-xs">
              ST
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-[#1C1917] dark:text-[#FAF8F3] leading-tight font-sans">
                {authModalTab === 'signin' && 'Sign In to Stratum'}
                {authModalTab === 'signup' && 'Create Your Stratum Account'}
                {authModalTab === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-[12px] text-[#57534E] dark:text-[#A8A29E]">
                {authModalTab === 'signin' && 'Access all your brand workspaces and research data.'}
                {authModalTab === 'signup' && 'Start building market-validated brands with AI.'}
                {authModalTab === 'forgot' && 'Enter your email to verify and reset your credentials.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-[#F1EEE4] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Sign Up) */}
        {authModalTab !== 'forgot' && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-[#EAE5D9] dark:bg-[#252525] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setAuthModalTab('signin');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'signin'
                    ? 'bg-white dark:bg-[#151515] text-[#1C1917] dark:text-white shadow-xs font-bold'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setAuthModalTab('signup');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'signup'
                    ? 'bg-white dark:bg-[#151515] text-[#1C1917] dark:text-white shadow-xs font-bold'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Social Auth Buttons */}
          {authModalTab !== 'forgot' && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading !== null}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E4DFD3] dark:border-[#333] bg-white dark:bg-[#222] hover:bg-stone-50 dark:hover:bg-[#292929] active:bg-stone-100 text-[#1C1917] dark:text-stone-100 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
              >
                {isLoading === 'google' ? (
                  <span className="w-4 h-4 border-2 border-stone-400 border-t-[#FF6124] rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGitHubAuth}
                disabled={isLoading !== null}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E4DFD3] dark:border-[#333] bg-white dark:bg-[#222] hover:bg-stone-50 dark:hover:bg-[#292929] active:bg-stone-100 text-[#1C1917] dark:text-stone-100 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
              >
                {isLoading === 'github' ? (
                  <span className="w-4 h-4 border-2 border-stone-400 border-t-[#FF6124] rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                )}
                <span>Continue with GitHub</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E4DFD3] dark:border-[#2f2f2f]" />
                <span className="shrink-0 mx-3 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                  or with email
                </span>
                <div className="flex-grow border-t border-[#E4DFD3] dark:border-[#2f2f2f]" />
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Sign Up: Name field */}
            {authModalTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                />
              </div>
            </div>

            {/* Forgot password step 2: verification code and new password */}
            {authModalTab === 'forgot' && resetStep === 'verify' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124] tracking-widest font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Password field for signin / signup */}
            {authModalTab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                    Password
                  </label>
                  {authModalTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResetForm();
                        setAuthModalTab('forgot');
                      }}
                      className="text-[11px] text-[#FF6124] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password for signup */}
            {authModalTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs text-[#1C1917] dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                </div>
              </div>
            )}

            {/* Terms checkbox for signup */}
            {authModalTab === 'signup' && (
              <label className="flex items-start gap-2.5 pt-1 text-xs text-[#57534E] dark:text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-[#FF6124] focus:ring-[#FF6124]"
                />
                <span className="text-[11px] leading-snug">
                  I agree to the Stratum Terms of Service and acknowledge the data privacy protocols.
                </span>
              </label>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading !== null}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF6124] hover:bg-[#E5531B] active:bg-[#CC4815] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading === 'email' ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalTab === 'signin' && 'Sign In to Workspace'}
                    {authModalTab === 'signup' && 'Create Free Account'}
                    {authModalTab === 'forgot' && (resetStep === 'request' ? 'Send Reset Code' : 'Save New Password')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          {authModalTab === 'signin' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2 px-3 text-[11px] font-semibold text-[#FF6124] bg-[#FF6124]/10 hover:bg-[#FF6124]/15 rounded-xl border border-[#FF6124]/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
                <span>Fill Demo Credentials (founder@stratum.ai)</span>
              </button>
            </div>
          )}

          {/* Back to sign in for forgot tab */}
          {authModalTab === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setAuthModalTab('signin');
                }}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
