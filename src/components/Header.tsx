import React, { useState, useRef, useEffect } from 'react';
import { WorkflowStep } from '../types/brand';
import {
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Lock,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  FolderKanban,
  Settings,
  Sun,
  Moon,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentStep: WorkflowStep;
  isCoreLocked?: boolean;
  onNavigate: (step: WorkflowStep) => void;
  onReset: () => void;
  onOpenHelp: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  isCoreLocked,
  onNavigate,
  onReset,
  onOpenHelp,
  onToggleSidebar,
  isSidebarOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, signOut, openAuthModal, theme, toggleTheme } = useAuth();
  const isWorkflowActive =
    currentStep !== 'landing' &&
    currentStep !== 'product' &&
    currentStep !== 'dashboard' &&
    currentStep !== 'settings';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentStep !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F1EEE4]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isSidebarOpen
                  ? 'border-[#FF6124] text-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20'
                  : 'border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-white/70 dark:bg-[#1a1a1a]/70'
              }`}
              title="Toggle Sidebar Navigation"
              aria-label="Toggle Sidebar Navigation"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          {/* Brand identity */}
          <button
            onClick={() => {
              onNavigate('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124] rounded py-1 cursor-pointer flex items-center gap-2.5"
          >
            <span className="w-7 h-7 bg-[#FF6124] rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-xs">
              NB
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  NO BUGS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E4DFD3] dark:bg-[#252525] text-neutral-700 dark:text-neutral-300 font-semibold">
                  Audience Shifter
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-neutral-500 dark:text-neutral-400 leading-none">
                One Product · One Core Value · Multiple Audiences
              </p>
            </div>
          </button>
        </div>

        {/* Global Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-semibold text-neutral-600 dark:text-neutral-400"
        >
          <button
            type="button"
            onClick={handleDashboardClick}
            className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentStep === 'dashboard'
                ? 'text-[#FF6124] font-bold'
                : 'hover:text-neutral-950 dark:hover:text-neutral-100'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            {!isAuthenticated && (
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">🔒</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('benchmarks')}
            className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer py-1"
          >
            Benchmarks
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about-us')}
            className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer py-1"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('faq')}
            className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer py-1"
          >
            FAQ
          </button>
        </nav>

        {/* Core Value Lock Status Indicator */}
        {isCoreLocked && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-300 shadow-2xs">
            <Lock className="w-3 h-3 stroke-[2.5] text-emerald-700 dark:text-emerald-400" />
            <span>Core Value Locked</span>
          </div>
        )}

        {/* Actions Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124] cursor-pointer"
            title="How the Audience Shifter works"
            aria-label="How the Audience Shifter works"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">The Concept</span>
          </button>

          {isWorkflowActive && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124] cursor-pointer"
              title="Start a new product adaptation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Product</span>
            </button>
          )}

          {/* Auth State: Logged Out */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="hidden sm:flex px-3.5 py-1.5 text-xs font-bold text-neutral-900 dark:text-white border border-[#D8D2C5] dark:border-[#333] bg-white dark:bg-[#1e1e1e] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* Auth State: Logged In User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-[#EAE5D9] dark:hover:bg-[#252525] transition-colors border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-2xs cursor-pointer"
                aria-expanded={userDropdownOpen}
                aria-label="User profile menu"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#FF6124] text-white flex items-center justify-center text-[10px] font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate hidden sm:inline">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-[#262626]">
                    <p className="font-bold text-neutral-900 dark:text-neutral-50 truncate">{user?.name}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="capitalize">{user?.provider} Connected</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F3] dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 flex items-center gap-2 cursor-pointer"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-[#FF6124]" />
                      <span>Founder Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('settings');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F3] dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>Settings & Security</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('product');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F3] dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
                      <span>Shift a Product</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-neutral-100 dark:border-[#262626]">
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F3] dark:hover:bg-[#252525] text-neutral-700 dark:text-neutral-300 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                        <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Toggle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'landing' && (
            <button
              onClick={() => onNavigate('product')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124] cursor-pointer"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-[#EAE5D9] dark:hover:bg-[#252525] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F3] dark:bg-[#161616] border-b border-[#E4DFD3] dark:border-[#2a2a2a] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleDashboardClick();
              }}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center justify-between text-[#FF6124] font-bold"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span>Founder Dashboard</span>
              </div>
              {!isAuthenticated && <span className="text-xs">🔒</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('settings');
              }}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Security</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('benchmarks')}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors"
            >
              Benchmarks
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about-us')}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors"
            >
              FAQ
            </button>

            <button
              type="button"
              onClick={() => toggleTheme()}
              className="text-left py-1.5 px-2 hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span className="text-xs text-[#FF6124] font-bold">Switch</span>
            </button>
          </div>

          {/* Mobile Auth options */}
          <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="py-2 px-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#252525] border border-[#D8D2C5] dark:border-[#3a3a3a] rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="py-2 px-3 text-xs font-bold text-white bg-[#FF6124] rounded-lg text-center"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#FF6124] text-white flex items-center justify-center text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">{user?.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
