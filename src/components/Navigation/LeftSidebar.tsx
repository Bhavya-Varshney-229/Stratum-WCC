import React, { useState, useEffect } from 'react';
import {
  Compass,
  Target,
  Palette,
  Rocket,
  FileCheck,
  Plus,
  History,
  FolderOpen,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { WorkspaceId, VentureProject } from '../../types/venture';

export type SidebarStyle = 'cream' | 'orange';

interface LeftSidebarProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  project: VentureProject | null;
  onNewProject: () => void;
  onOpenDecisionHistory: () => void;
  onGoToLanding: () => void;
  onGoToDashboard?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  sidebarStyle?: SidebarStyle;
  onChangeSidebarStyle?: (style: SidebarStyle) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  project,
  onNewProject,
  onOpenDecisionHistory,
  onGoToLanding,
  onGoToDashboard,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  sidebarStyle: controlledStyle,
  onChangeSidebarStyle,
}) => {
  // Local persistence if not controlled
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stratum_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [internalStyle, setInternalStyle] = useState<SidebarStyle>(() => {
    try {
      const s = localStorage.getItem('stratum_sidebar_style');
      return s === 'orange' ? 'orange' : 'cream';
    } catch {
      return 'cream';
    }
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const sidebarStyle = controlledStyle !== undefined ? controlledStyle : internalStyle;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      const next = !internalCollapsed;
      setInternalCollapsed(next);
      localStorage.setItem('stratum_sidebar_collapsed', String(next));
    }
  };

  const handleToggleStyle = () => {
    const next: SidebarStyle = sidebarStyle === 'cream' ? 'orange' : 'cream';
    if (onChangeSidebarStyle) {
      onChangeSidebarStyle(next);
    } else {
      setInternalStyle(next);
      localStorage.setItem('stratum_sidebar_style', next);
    }
  };

  // EXACTLY FIVE WORKSPACES
  const workspaces: {
    id: WorkspaceId;
    title: string;
    number: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    {
      id: 'research-discovery',
      title: 'Research & Discovery',
      number: '01',
      icon: Compass,
      description: '6-card intelligence & validation tools',
    },
    {
      id: 'brand-strategy',
      title: 'Brand Strategy',
      number: '02',
      icon: Target,
      description: 'Positioning, messaging & pricing',
    },
    {
      id: 'design-studio',
      title: 'Design Studio',
      number: '03',
      icon: Palette,
      description: '3 visual directions & brand assets',
    },
    {
      id: 'market-launch',
      title: 'Market & Launch',
      number: '04',
      icon: Rocket,
      description: 'Timeline, campaigns & readiness',
    },
    {
      id: 'complete-brand-kit',
      title: 'Complete Brand Kit',
      number: '05',
      icon: FileCheck,
      description: 'Report builder & unified export',
    },
  ];

  const reviewFlags = project?.downstreamReviewFlags || [];

  // Theme styling definitions
  const isOrange = sidebarStyle === 'orange';
  const sidebarBg = isOrange
    ? 'bg-[#E04D15] dark:bg-[#A8350B] text-white'
    : 'bg-[#FAF8F3] dark:bg-[#161616] text-[#1C1917] dark:text-[#F5F3EC]';
  const borderColor = isOrange
    ? 'border-[#C8400E] dark:border-[#872704]'
    : 'border-[#E4DFD3] dark:border-[#2a2a2a]';

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } ${sidebarBg} border-r ${borderColor} flex flex-col justify-between shrink-0 select-none z-30 transition-all duration-200 h-full relative`}
    >
      {/* Collapse Toggle Handle */}
      <button
        type="button"
        onClick={handleToggle}
        className={`absolute -right-3.5 top-6 z-40 p-1 rounded-full border shadow-sm transition-transform hover:scale-110 cursor-pointer ${
          isOrange
            ? 'bg-white text-[#FF6124] border-[#C8400E]'
            : 'bg-white dark:bg-[#202020] text-[#57534E] dark:text-[#A8A29E] border-[#E4DFD3] dark:border-[#333]'
        }`}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Section: Brand Identity */}
      <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
        <button
          type="button"
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 text-left group cursor-pointer overflow-hidden"
          title="Return to Public Homepage"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF6124] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-white/20">
            ST
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-sm tracking-tight ${isOrange ? 'text-white' : 'text-[#1C1917] dark:text-[#F5F3EC]'}`}>
                  STRATUM
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                  isOrange ? 'bg-black/20 text-white/90' : 'bg-[#E4DFD3] dark:bg-[#252525] text-[#57534E] dark:text-[#A8A29E]'
                }`}>
                  Studio
                </span>
              </div>
              <p className={`text-[10px] truncate ${isOrange ? 'text-white/80' : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
                Brand Intelligence
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Active Project Card (Expanded only) */}
      {!isCollapsed ? (
        <div className="px-3 pt-3">
          <div className={`p-2.5 rounded-xl border shadow-2xs transition-colors ${
            isOrange
              ? 'bg-black/15 border-white/20 text-white'
              : 'bg-white dark:bg-[#1e1e1e] border-[#E4DFD3] dark:border-[#2a2a2a]'
          }`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
              <span className={`font-bold ${isOrange ? 'text-orange-200' : 'text-[#FF6124]'}`}>
                {project?.projectType === 'rebrand' ? 'Rebrand' : 'New Brand'}
              </span>
              <span className={`font-semibold ${isOrange ? 'text-emerald-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
                Live
              </span>
            </div>
            <p className={`text-xs font-bold truncate ${isOrange ? 'text-white' : 'text-[#1C1917] dark:text-[#F5F3EC]'}`}>
              {project?.title || 'Active Project'}
            </p>
            <p className={`text-[10px] truncate mt-0.5 ${isOrange ? 'text-white/70' : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
              {project?.tagline || 'Autonomous enterprise software'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2 flex justify-center">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase ${
              isOrange ? 'bg-black/20 text-white' : 'bg-white dark:bg-[#202020] text-[#FF6124] border border-[#E4DFD3] dark:border-[#333]'
            }`}
            title={`Active: ${project?.title || 'Stratum Project'}`}
          >
            {project?.title ? project.title.slice(0, 2).toUpperCase() : 'PR'}
          </div>
        </div>
      )}

      {/* Navigation: Exactly 5 Workspaces */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isOrange ? 'text-white/70' : 'text-[#57534E] dark:text-[#A8A29E]'
          }`}>
            Workspaces (5)
          </div>
        )}

        {workspaces.map((ws) => {
          const Icon = ws.icon;
          const isActive = activeWorkspace === ws.id;
          const hasReviewFlag = reviewFlags.includes(ws.id);

          return (
            <button
              key={ws.id}
              type="button"
              onClick={() => onSelectWorkspace(ws.id)}
              title={isCollapsed ? `${ws.title} (${ws.number})` : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'items-start gap-3 px-3 py-2.5'} rounded-xl text-left transition-all cursor-pointer relative group ${
                isActive
                  ? isOrange
                    ? 'bg-white text-[#1C1917] font-bold shadow-md'
                    : 'bg-white dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333333] shadow-xs text-[#1C1917] dark:text-[#F5F3EC]'
                  : isOrange
                  ? 'text-white/85 hover:bg-white/15 hover:text-white'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-white/60 dark:hover:bg-[#1f1f1f] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md ${isOrange ? 'bg-[#FF6124]' : 'bg-[#FF6124]'}`} />
              )}

              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? isOrange
                      ? 'bg-[#FF6124] text-white shadow-xs'
                      : 'bg-[#FF6124] text-white shadow-2xs'
                    : isOrange
                    ? 'bg-black/20 text-white group-hover:bg-black/30'
                    : 'bg-[#E4DFD3]/60 dark:bg-[#282828] text-[#57534E] dark:text-[#A8A29E] group-hover:bg-[#E4DFD3]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold leading-tight truncate ${
                        isActive
                          ? isOrange
                            ? 'text-[#1C1917]'
                            : 'text-[#FF6124]'
                          : isOrange
                          ? 'text-white'
                          : 'text-[#1C1917] dark:text-[#F5F3EC]'
                      }`}
                    >
                      {ws.title}
                    </span>
                    <span className={`text-[10px] font-mono ${isOrange ? (isActive ? 'text-stone-500' : 'text-white/60') : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
                      {ws.number}
                    </span>
                  </div>
                  <p className={`text-[10px] truncate leading-normal ${isOrange ? (isActive ? 'text-stone-600' : 'text-white/70') : 'text-[#57534E] dark:text-[#A8A29E]'}`}>
                    {ws.description}
                  </p>

                  {hasReviewFlag && (
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold text-amber-900 bg-amber-200/90 dark:bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-900 w-fit">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span>Review Needed</span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Area: Sidebar Appearance Switch, Projects, Decision History & New Project */}
      <div className={`p-2.5 border-t ${borderColor} space-y-1.5 ${isOrange ? 'bg-black/15' : 'bg-[#FAF8F3]/90 dark:bg-[#161616]'}`}>
        {/* Style Switcher */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={handleToggleStyle}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
              isOrange
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                : 'border-[#E4DFD3] dark:border-[#2a2a2a] hover:bg-white dark:hover:bg-[#202020] text-[#57534E] dark:text-[#A8A29E]'
            }`}
            title="Toggle between Cream (Style A) and Orange (Style B) sidebar themes"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Sidebar Style</span>
            </div>
            <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
              isOrange ? 'bg-white text-[#FF6124]' : 'bg-[#FF6124] text-white'
            }`}>
              {isOrange ? 'Style B' : 'Style A'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleStyle}
            className={`w-full p-2 flex justify-center rounded-xl cursor-pointer ${
              isOrange ? 'text-white hover:bg-white/15' : 'text-[#57534E] hover:bg-white dark:hover:bg-[#222]'
            }`}
            title={`Sidebar Theme: ${isOrange ? 'Style B (Orange)' : 'Style A (Cream)'}`}
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'} rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isOrange
                ? 'text-white/85 hover:bg-white/15 hover:text-white'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-white dark:hover:bg-[#202020] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
            }`}
            title="My Projects Dashboard"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className={`w-3.5 h-3.5 ${isOrange ? 'text-white' : 'text-[#FF6124]'}`} />
              {!isCollapsed && <span>My Projects</span>}
            </div>
            {!isCollapsed && <span className={`text-[10px] font-mono ${isOrange ? 'text-white/60' : 'text-stone-400'}`}>All</span>}
          </button>
        )}

        <button
          type="button"
          onClick={onOpenDecisionHistory}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'} rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            isOrange
              ? 'text-white/85 hover:bg-white/15 hover:text-white'
              : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-white dark:hover:bg-[#202020] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
          }`}
          title="Decision History & Approvals"
        >
          <div className="flex items-center gap-2">
            <History className={`w-3.5 h-3.5 ${isOrange ? 'text-white' : 'text-[#FF6124]'}`} />
            {!isCollapsed && <span>Decision History</span>}
          </div>
          {!isCollapsed && project?.decisionHistory && project.decisionHistory.length > 0 && (
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              isOrange ? 'bg-white text-[#FF6124]' : 'bg-[#E4DFD3] dark:bg-[#2a2a2a] text-[#1C1917] dark:text-[#F5F3EC]'
            }`}>
              {project.decisionHistory.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onNewProject}
          className={`w-full flex items-center justify-center gap-1.5 ${isCollapsed ? 'p-2' : 'px-3 py-2.5'} rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isOrange
              ? 'bg-white text-[#FF6124] hover:bg-white/90'
              : 'text-white bg-[#FF6124] hover:bg-[#e5531b]'
          }`}
          title="New Project Brief"
        >
          <Plus className="w-3.5 h-3.5" />
          {!isCollapsed && <span>New Project</span>}
        </button>
      </div>
    </aside>
  );
};
