import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  History,
  Menu,
  PanelRight,
  TrendingUp,
  Edit2,
  Check,
  X,
  ChevronDown,
  FolderOpen,
  Home,
  User as UserIcon,
  LogOut,
  Settings,
  Download,
} from 'lucide-react';
import { VentureProject, WorkspaceId } from '../../types/venture';
import { calculateProjectProgress } from '../../services/ventureStorage';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  project: VentureProject | null;
  savedProjects?: VentureProject[];
  onSelectProject?: (project: VentureProject) => void;
  activeWorkspace: WorkspaceId;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenDecisionHistory: () => void;
  isAiAssistantOpen: boolean;
  onToggleAiAssistant: () => void;
  onToggleMobileSidebar: () => void;
  onUpdateProjectTitle: (newTitle: string) => void;
  onGoToDashboard?: () => void;
  onGoToHome?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  savedProjects = [],
  onSelectProject,
  activeWorkspace,
  theme,
  onToggleTheme,
  onOpenDecisionHistory,
  isAiAssistantOpen,
  onToggleAiAssistant,
  onToggleMobileSidebar,
  onUpdateProjectTitle,
  onGoToDashboard,
  onGoToHome,
}) => {
  const { user, isAuthenticated, openAuthModal, openAccountSettings, signOut, showToast } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project?.title || '');
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportProjectJson = () => {
    if (!project) return;
    try {
      setIsExporting(true);
      const dataStr = JSON.stringify(project, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeTitle = (project.title || 'stratum-project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `${safeTitle || 'project'}-backup-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Project JSON exported successfully', 'success');
    } catch (err) {
      console.error('Failed to export project JSON:', err);
      showToast('Failed to export project JSON', 'error');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateProjectTitle(editedTitle.trim());
      setIsEditingTitle(false);
    }
  };

  const progressPercent = project ? calculateProjectProgress(project) : 35;

  const workspaceNames: Record<WorkspaceId, string> = {
    'research-discovery': '01. Research & Discovery',
    'brand-strategy': '02. Brand Strategy',
    'design-studio': '03. Design Studio',
    'market-launch': '04. Market & Launch',
    'complete-brand-kit': '05. Complete Brand Kit',
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F3]/95 dark:bg-[#161616]/95 backdrop-blur-md border-b border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-full">
        {/* Left: Mobile Toggle + Project Selector / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] hover:bg-[#E4DFD3]/40 dark:hover:bg-[#252525] cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Project Switcher Dropdown */}
          <div className="relative">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="px-2 py-1 text-xs font-bold bg-white dark:bg-[#202020] border border-[#FF6124] rounded-lg text-[#1C1917] dark:text-[#F5F3EC] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                  className="flex items-center gap-2 text-left p-1.5 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC] truncate max-w-[180px] sm:max-w-[260px]">
                    {project?.title || 'Stratum Project'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform" />
                </button>

                <span
                  className={`hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                    project?.projectType === 'rebrand'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'bg-[#FF6124]/10 text-[#FF6124] border border-[#FF6124]/20'
                  }`}
                >
                  {project?.projectType === 'rebrand' ? 'Rebrand' : 'New Brand'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setEditedTitle(project?.title || '');
                    setIsEditingTitle(true);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                  title="Rename Project"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Switch Project Popup */}
            {isProjectMenuOpen && (
              <div
                onClick={() => setIsProjectMenuOpen(false)}
                className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#333] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Switch Active Project
                </div>
                {savedProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (onSelectProject) onSelectProject(p);
                      setIsProjectMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      p.id === project?.id
                        ? 'bg-[#FF6124]/10 text-[#FF6124] font-bold'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {calculateProjectProgress(p)}%
                    </span>
                  </button>
                ))}

                <div className="border-t border-[#E4DFD3] dark:border-[#333] my-1" />

                {project && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProjectMenuOpen(false);
                      handleExportProjectJson();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF6124]" />
                    <span>Export Project JSON</span>
                  </button>
                )}

                {onGoToDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProjectMenuOpen(false);
                      onGoToDashboard();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-[#FF6124] hover:bg-[#FF6124]/5 flex items-center gap-2"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Manage All Projects</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <span className="hidden lg:inline text-neutral-300 dark:text-neutral-700">/</span>

          <span className="hidden lg:inline text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] truncate">
            {workspaceNames[activeWorkspace]}
          </span>
        </div>

        {/* Center: Overall Progress Indicator */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#1e1e1e]/70 border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
            <TrendingUp className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Readiness:</span>
            <span className="font-mono font-bold text-[#FF6124] tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-20 h-1.5 bg-[#E4DFD3] dark:bg-[#2e2e2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6124] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Zone: Autosave Status, Theme Switch, Decision History, Contextual AI & User Menu */}
        <div className="flex items-center gap-2">
          {/* Autosave Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Autosaved</span>
          </div>

          {/* Theme Controls Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] hover:bg-[#E4DFD3]/40 dark:hover:bg-[#252525] rounded-xl transition-colors cursor-pointer border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white/60 dark:bg-[#1a1a1a]/60 shadow-2xs"
            title={theme === 'dark' ? 'Current Theme: Dark (Click for Light)' : 'Current Theme: Light (Click for Dark)'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#57534E]" />
            )}
          </button>

          {/* Export Project JSON Button */}
          {project && (
            <button
              type="button"
              onClick={handleExportProjectJson}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white/70 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#252525] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124]/40 rounded-xl transition-colors cursor-pointer shadow-2xs group"
              title="Export current project data as a JSON file backup"
              aria-label="Export project JSON"
            >
              <Download className={`w-3.5 h-3.5 text-[#FF6124] transition-transform group-hover:-translate-y-0.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export JSON'}</span>
            </button>
          )}

          {/* Decision History Panel Trigger */}
          <button
            type="button"
            onClick={onOpenDecisionHistory}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white/70 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#252525] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Open Decision History & Approvals"
          >
            <History className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Decisions</span>
            {project?.decisionHistory && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#E4DFD3] dark:bg-[#2a2a2a] text-[#1C1917] dark:text-[#F5F3EC] font-bold">
                {project.decisionHistory.length}
              </span>
            )}
          </button>

          {/* Contextual AI Assistant Button */}
          <button
            type="button"
            onClick={onToggleAiAssistant}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs border ${
              isAiAssistantOpen
                ? 'bg-[#FF6124] text-white border-[#FF6124] shadow-xs'
                : 'bg-white dark:bg-[#1e1e1e] text-[#1C1917] dark:text-[#F5F3EC] border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124]/50'
            }`}
            title="Toggle Contextual AI Assistant"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiAssistantOpen ? 'text-white' : 'text-[#FF6124]'}`} />
            <span className="hidden md:inline">AI Copilot</span>
            <PanelRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* User Account / Navigation Menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Account Menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#E4DFD3]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#FF6124] text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  onClick={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#333] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in text-xs"
                >
                  <div className="px-2.5 py-1.5 border-b border-[#E4DFD3] dark:border-[#333] mb-1">
                    <p className="font-bold text-[#1C1917] dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                  </div>

                  {onGoToDashboard && (
                    <button
                      type="button"
                      onClick={onGoToDashboard}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-stone-800 text-[#1C1917] dark:text-stone-200 flex items-center gap-2 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#FF6124]" />
                      <span>Projects Dashboard</span>
                    </button>
                  )}

                  {onGoToHome && (
                    <button
                      type="button"
                      onClick={onGoToHome}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-stone-800 text-[#1C1917] dark:text-stone-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5 text-stone-500" />
                      <span>Public Homepage</span>
                    </button>
                  )}

                  {project && (
                    <button
                      type="button"
                      onClick={handleExportProjectJson}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-stone-800 text-[#1C1917] dark:text-stone-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FF6124]" />
                      <span>Export Project (JSON)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={openAccountSettings}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-stone-800 text-[#1C1917] dark:text-stone-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-500" />
                    <span>Account Settings</span>
                  </button>

                  <div className="border-t border-[#E4DFD3] dark:border-[#333] my-1" />

                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="py-1.5 px-3 text-xs font-bold text-[#FF6124] bg-[#FF6124]/10 hover:bg-[#FF6124]/15 rounded-xl border border-[#FF6124]/20 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
