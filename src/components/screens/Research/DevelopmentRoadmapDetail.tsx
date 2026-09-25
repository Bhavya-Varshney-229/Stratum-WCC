import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  CheckSquare,
  Square,
  Link2,
  Flag,
} from 'lucide-react';
import { DevelopmentRoadmapData, MilestoneCard, CardResearchStatus } from '../../../types/venture';

interface DevelopmentRoadmapDetailProps {
  data: DevelopmentRoadmapData;
  onUpdate: (updated: DevelopmentRoadmapData) => void;
  onBack: () => void;
  onApprove: () => void;
  onRefine: () => void;
}

export const DevelopmentRoadmapDetail: React.FC<DevelopmentRoadmapDetailProps> = ({
  data,
  onUpdate,
  onBack,
  onApprove,
  onRefine,
}) => {
  const handleStatusChange = (newStatus: CardResearchStatus) => {
    onUpdate({ ...data, status: newStatus });
  };

  const handleToggleDeliverable = (milestoneId: string, deliverableIndex: number) => {
    const updatedMilestones = data.milestones.map((m) => {
      if (m.id === milestoneId) {
        const deliverables = [...m.deliverables];
        deliverables[deliverableIndex] = {
          ...deliverables[deliverableIndex],
          completed: !deliverables[deliverableIndex].completed,
        };
        return { ...m, deliverables };
      }
      return m;
    });
    onUpdate({ ...data, milestones: updatedMilestones });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] hover:border-[#FF6124] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors cursor-pointer"
            title="Return to Research Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6124] font-bold">
                Research Module 06
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                Status: {data.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Development Roadmap & Milestone Timeline
            </h1>
          </div>
        </div>

        {/* 3 Mandated Actions: Explore, Refine, Approve */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange('Needs Testing')}
            className="px-3 py-1.5 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Explore Alternate Phases
          </button>

          <button
            type="button"
            onClick={onRefine}
            className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Refine Milestones</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleStatusChange('Approved');
              onApprove();
            }}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Roadmap</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
          Execution Roadmap Overview
        </span>
        <p className="text-sm font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Section 1: Visual Interactive Milestone Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          1. 12-Month Phased Milestone Timeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.milestones.map((m) => {
            const completedCount = m.deliverables.filter((d) => d.completed).length;
            const progress = Math.round((completedCount / m.deliverables.length) * 100);

            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#FF6124] uppercase tracking-wider">
                      {m.phase}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
                      {m.targetDuration}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                    {m.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-2 pb-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                      <span>Deliverables: {completedCount}/{m.deliverables.length}</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#E4DFD3] dark:bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FF6124] h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                      Deliverables Checklist:
                    </span>
                    <div className="space-y-1">
                      {m.deliverables.map((del, dIdx) => (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => handleToggleDeliverable(m.id, dIdx)}
                          className="w-full text-left flex items-start gap-2 p-1.5 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-[#202020] transition-colors cursor-pointer group text-xs text-[#1C1917] dark:text-[#F5F3EC]"
                        >
                          {del.completed ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF6124] shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`leading-tight ${
                              del.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : ''
                            }`}
                          >
                            {del.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dependencies */}
                <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-[10px] text-[#57534E] dark:text-[#A8A29E]">
                  <span className="font-bold">Dependencies: </span>
                  <span>{m.dependencies.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Critical Path Dependencies */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#FF6124]" />
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Critical Path & Inter-Phase Dependencies
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {data.keyDependencies.map((dep, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {dep.item}
                </span>
                <span className="text-neutral-400">depends on</span>
                <span className="font-semibold text-[#FF6124]">{dep.dependentOn}</span>
              </div>

              {dep.criticalPath && (
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 w-fit">
                  Critical Path
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
