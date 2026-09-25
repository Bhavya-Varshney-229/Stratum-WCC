import React from 'react';
import {
  Rocket,
  CheckCircle2,
  Calendar,
  DollarSign,
  Share2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import {
  VentureProject,
  MarketLaunchData,
  LaunchReadinessItem,
  WorkspaceId,
} from '../../types/venture';

interface MarketLaunchScreenProps {
  project: VentureProject;
  onUpdateProject: (updated: VentureProject) => void;
  onLogDecision: (
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit',
    affectsDownstream?: ('complete-brand-kit')[]
  ) => void;
  onNavigateWorkspace: (wsId: WorkspaceId) => void;
}

export const MarketLaunchScreen: React.FC<MarketLaunchScreenProps> = ({
  project,
  onUpdateProject,
  onLogDecision,
  onNavigateWorkspace,
}) => {
  const launch = project.marketLaunch;

  const handleToggleReadinessItem = (id: string) => {
    const updatedChecklist = launch.readinessChecker.map((item) => {
      if (item.id === id) {
        return { ...item, isComplete: !item.isComplete };
      }
      return item;
    });

    const updatedLaunch: MarketLaunchData = {
      ...launch,
      readinessChecker: updatedChecklist,
    };

    onUpdateProject({ ...project, marketLaunch: updatedLaunch });
    onLogDecision(
      'Updated Launch Readiness Item',
      `Toggled status on "${launch.readinessChecker.find((c) => c.id === id)?.title}".`,
      'edit',
      ['complete-brand-kit']
    );
  };

  const completedCount = launch.readinessChecker.filter((r) => r.isComplete).length;
  const totalCount = launch.readinessChecker.length;
  const readinessPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6124] font-bold">
            Workspace 04
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
            Market & Launch Execution Blueprint
          </h1>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
            Multi-phase launch roadmap, campaign budgeting, distribution architecture, and unified
            readiness verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateWorkspace('complete-brand-kit')}
          className="px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span>Build Complete Brand Kit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MANDATED LAUNCH READINESS CHECKER (WITH WORKSPACE LINKS) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DFD3] dark:border-[#2a2a2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
                Launch Readiness Checker
              </h2>
              <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
                Actionable audit checklist with direct jump links back to originating workspaces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] block">
                Readiness Score:
              </span>
              <span className="font-mono text-sm font-extrabold text-[#FF6124]">
                {completedCount} / {totalCount} ({readinessPercent}%)
              </span>
            </div>
            <div className="w-20 bg-[#E4DFD3] dark:bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF6124] h-full rounded-full transition-all"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Readiness Items List with direct Jump Links */}
        <div className="space-y-2.5">
          {launch.readinessChecker.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                item.isComplete
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60'
                  : 'bg-[#FAF8F3] dark:bg-[#202020] border-[#E4DFD3] dark:border-[#2e2e2e]'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleReadinessItem(item.id)}
                  className="mt-0.5 cursor-pointer text-[#1C1917] dark:text-[#F5F3EC]"
                >
                  {item.isComplete ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        item.isComplete
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-[#1C1917] dark:text-[#F5F3EC]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                        item.severity === 'Blocker'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                    {item.actionPrompt}
                  </p>
                </div>
              </div>

              {/* Direct Workspace Jump Link */}
              <button
                type="button"
                onClick={() => onNavigateWorkspace(item.targetWorkspace)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF6124] hover:bg-[#FF6124]/10 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                title={`Jump to ${item.targetWorkspace}`}
              >
                <span>Jump to Workspace</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: Phased Launch Timeline */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          1. 20-Week Phased Launch Timeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {launch.launchTimeline.map((phase, pIdx) => (
            <div
              key={pIdx}
              className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#FF6124] uppercase">
                    Phase 0{pIdx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
                    {phase.duration}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F3EC] leading-tight">
                  {phase.phaseName}
                </h3>

                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  Focus: {phase.focus}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                    Core Milestones:
                  </span>
                  <ul className="text-[11px] space-y-1 text-[#1C1917] dark:text-[#F5F3EC] list-disc list-inside">
                    {phase.milestones.map((m, mIdx) => (
                      <li key={mIdx} className="leading-snug">{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Campaign Cards with Budgets */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          2. Launch Campaign Cards & Deliverables
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {launch.campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] font-bold text-[#FF6124]">
                    {camp.phase}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      camp.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-[#252525] dark:text-neutral-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                  {camp.name}
                </h3>

                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                  Channel: {camp.primaryChannel}
                </p>

                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#FF6124] block">
                    Deliverable:
                  </span>
                  <p className="text-[#1C1917] dark:text-[#F5F3EC] leading-snug">
                    {camp.deliverable}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Target KPI:
                  </span>
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    {camp.targetKpi}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Budget:
                  </span>
                  <span className="font-bold text-[#FF6124]">
                    {camp.budgetAllocated}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Distribution Planning & Budget Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Planning */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Distribution Channels & Projected Acquisition Mix
          </h3>

          <div className="space-y-3">
            {launch.distributionChannels.map((dist, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    {dist.channel}
                  </span>
                  <span className="font-mono font-bold text-[#FF6124]">
                    {dist.projectedAcquisitionPercent}% Mix
                  </span>
                </div>

                <div className="w-full bg-[#E4DFD3] dark:bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF6124] h-full rounded-full"
                    style={{ width: `${dist.projectedAcquisitionPercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                  Strategy: {dist.strategy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Allocation Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Pre-Launch Capital Budget Allocation ($20,000 Total)
          </h3>

          <div className="space-y-3">
            {launch.budgetBreakdown.map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1C1917] dark:text-[#F5F3EC]">{b.category}</span>
                  <span className="font-mono text-[#FF6124]">
                    {b.percentage}% ({b.amountFormatted})
                  </span>
                </div>
                <div className="w-full bg-[#E4DFD3] dark:bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF6124] h-full rounded-full"
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
