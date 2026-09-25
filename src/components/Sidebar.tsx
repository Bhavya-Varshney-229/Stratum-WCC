import React from 'react';
import {
  FolderKanban,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  X,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WorkflowStep } from '../types/brand';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentStep: WorkflowStep;
  onNavigate: (step: WorkflowStep) => void;
  isOpen?: boolean;
  onClose?: () => void;
  projectCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onNavigate,
  isOpen = true,
  onClose,
  projectCount = 0,
}) => {
  const { user, isAuthenticated, signOut, theme, toggleTheme } = useAuth();

  const handleNav = (step: WorkflowStep) => {
    onNavigate(step);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    signOut();
    if (onClose) onClose();
    onNavigate('landing');
  };

  return (
    <aside
      className={`w-64 bg-white dark:bg-[#181818] border-r border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none shadow-xs`}
    >
      {/* Top Header Section */}
      <div className="p-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <span className="w-8 h-8 bg-[#FF6124] rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-xs">
              NB
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  NO BUGS
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] text-neutral-600 dark:text-neutral-300 font-semibold">
                  Studio
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Audience Shifter</p>
            </div>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Navigation
        </div>

        {/* Option 1: Dashboard */}
        <button
          type="button"
          onClick={() => handleNav('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'dashboard'
              ? 'bg-[#FF6124] text-white shadow-xs'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#FAF8F3] dark:hover:bg-[#222222] hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </div>
          {projectCount > 0 && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold tabular-nums ${
                currentStep === 'dashboard'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EAE5D9] dark:bg-[#2e2e2e] text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {projectCount}
            </span>
          )}
        </button>

        {/* Option 2: Settings */}
        <button
          type="button"
          onClick={() => handleNav('settings')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'settings'
              ? 'bg-[#FF6124] text-white shadow-xs'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#FAF8F3] dark:hover:bg-[#222222] hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 ${
              currentStep === 'settings' ? 'text-white' : 'text-neutral-400'
            }`}
          />
        </button>

        {/* Quick Action: New Brand Shift */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleNav('product')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border border-[#FF6124]/30 bg-[#FF6124]/10 dark:bg-[#FF6124]/15 hover:bg-[#FF6124]/20 text-[#FF6124] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Brand Shift</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Theme Switcher */}
        <div className="pt-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] mt-3">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Appearance
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-[#FAF8F3] dark:hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#FF6124]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] text-neutral-500 dark:text-neutral-400">
              Toggle
            </span>
          </button>
        </div>
      </div>

      {/* Towards the end of the sidebar: User profile & Signed out button */}
      <div className="p-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3]/80 dark:bg-[#151515]">
        {isAuthenticated && user ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 px-2 py-1">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FF6124] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Prominent Signed Out Action button towards end of sidebar */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200/70 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-800 transition-all cursor-pointer shadow-2xs group"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Signed Out</span>
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 px-1">
              <span>Status:</span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Signed Out</span>
            </div>
            <button
              type="button"
              onClick={() => handleNav('landing')}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Sign In to Account
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
