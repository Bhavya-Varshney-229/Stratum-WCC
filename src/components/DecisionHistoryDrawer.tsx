import React from 'react';
import {
  History,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Compass,
  Target,
  Palette,
  Rocket,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { VentureProject, WorkspaceId, DecisionLogEntry } from '../types/venture';

interface DecisionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: VentureProject | null;
  onDismissReviewFlag: (workspace: WorkspaceId) => void;
  onJumpToWorkspace: (workspace: WorkspaceId) => void;
}

export const DecisionHistoryDrawer: React.FC<DecisionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onDismissReviewFlag,
  onJumpToWorkspace,
}) => {
  if (!isOpen) return null;

  const history = project?.decisionHistory || [];
  const reviewFlags = project?.downstreamReviewFlags || [];

  const workspaceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'research-discovery': Compass,
    'brand-strategy': Target,
    'design-studio': Palette,
    'market-launch': Rocket,
    'complete-brand-kit': FileCheck,
    'onboarding': Sparkles,
  };

  const workspaceNameMap: Record<WorkspaceId, string> = {
    'research-discovery': 'Research & Discovery',
    'brand-strategy': 'Brand Strategy',
    'design-studio': 'Design Studio',
    'market-launch': 'Market & Launch',
    'complete-brand-kit': 'Complete Brand Kit',
  };

  return (
    <aside className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white dark:bg-[#181818] border-l border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between bg-[#FAF8F3]/60 dark:bg-[#141414]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
              Decision History & Audit
            </h3>
            <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
              Chronological log of approvals & changes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Downstream Review Warnings (if any) */}
        {reviewFlags.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Downstream Review Flagged</span>
            </div>
            <p className="text-[11px] text-amber-900 dark:text-amber-200 mb-2 leading-relaxed">
              An upstream decision was modified. The following workspaces may have outdated assumptions:
            </p>

            <div className="space-y-1.5">
              {reviewFlags.map((ws) => (
                <div
                  key={ws}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/80 dark:bg-[#202020] border border-amber-200/80 dark:border-amber-900/60 text-[11px]"
                >
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {workspaceNameMap[ws]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToWorkspace(ws);
                        onClose();
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-[#FF6124] hover:bg-[#FF6124]/10 cursor-pointer"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismissReviewFlag(ws)}
                      className="px-1.5 py-0.5 rounded text-[10px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                      title="Mark as reviewed"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Timeline */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-3">
            Recorded Decisions & Milestones ({history.length})
          </span>

          {history.length === 0 ? (
            <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] italic py-4 text-center">
              No decisions recorded yet. Approvals in any workspace will appear here.
            </p>
          ) : (
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4DFD3] dark:before:bg-[#2a2a2a]">
              {history.map((entry) => {
                const Icon = workspaceIconMap[entry.workspace] || Clock;

                return (
                  <div key={entry.id} className="relative pl-8 group">
                    {/* Circle icon */}
                    <div className="absolute left-1.5 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#1e1e1e] border-2 border-[#FF6124] flex items-center justify-center text-[10px] text-[#FF6124] shadow-2xs">
                      <Icon className="w-2.5 h-2.5" />
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3]/60 dark:bg-[#202020] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] text-xs">
                          {entry.title}
                        </span>
                        <span className="text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E] shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                        {entry.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-neutral-200/60 dark:bg-[#2c2c2c] text-[#57534E] dark:text-[#A8A29E]">
                          {entry.actionType}
                        </span>

                        {entry.affectsDownstreamWorkspaces?.length > 0 && (
                          <span className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold">
                            Affects: {entry.affectsDownstreamWorkspaces.length} workspace(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#161616] text-center">
        <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
          Persisted locally. Changes to upstream assumptions notify downstream reviews.
        </p>
      </div>
    </aside>
  );
};
