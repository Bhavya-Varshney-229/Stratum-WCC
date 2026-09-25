import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { RisksDrawbacksData, RiskItem, CardResearchStatus } from '../../../types/venture';
import { SourceLabelBadge } from './SourceLabelBadge';

interface RisksDrawbacksDetailProps {
  data: RisksDrawbacksData;
  onUpdate: (updated: RisksDrawbacksData) => void;
  onBack: () => void;
  onApprove: () => void;
  onRefine: () => void;
}

export const RisksDrawbacksDetail: React.FC<RisksDrawbacksDetailProps> = ({
  data,
  onUpdate,
  onBack,
  onApprove,
  onRefine,
}) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string>(data.risks[0]?.id || '');
  const selectedRisk = data.risks.find((r) => r.id === selectedRiskId) || data.risks[0];

  const handleStatusChange = (newStatus: CardResearchStatus) => {
    onUpdate({ ...data, status: newStatus });
  };

  const handleToggleRiskStatus = (riskId: string) => {
    const updatedRisks = data.risks.map((r) => {
      if (r.id === riskId) {
        const nextStatus: RiskItem['status'] =
          r.status === 'Open' ? 'In Progress' : r.status === 'In Progress' ? 'Mitigated' : 'Open';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    onUpdate({ ...data, risks: updatedRisks });
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
                Research Module 05
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                Status: {data.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Venture Risks, Drawbacks & Mitigation Matrix
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
            Explore Edge Cases
          </button>

          <button
            type="button"
            onClick={onRefine}
            className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Refine Mitigations</span>
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
            <span>Approve Risk Plan</span>
          </button>
        </div>
      </div>

      {/* Synthesis Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
          Risk Management Executive Summary
        </span>
        <p className="text-sm font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Section 1: Interactive Risk Matrix (Probability vs Severity) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            1. Interactive Risk Matrix (Probability vs. Severity)
          </h2>
          <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">
            Click any cell to highlight active risk item
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive 5x5 Grid */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
            <div className="flex justify-between text-xs text-[#57534E] dark:text-[#A8A29E] font-bold">
              <span>Severity →</span>
              <span>1: Minor ... 5: Catastrophic</span>
            </div>

            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((prob) => (
                <div key={prob} className="flex items-center gap-1.5">
                  <span className="w-6 text-[10px] font-mono font-bold text-[#57534E] dark:text-[#A8A29E] shrink-0 text-right pr-1">
                    P{prob}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {[1, 2, 3, 4, 5].map((sev) => {
                      const risksInCell = data.risks.filter(
                        (r) => r.probability === prob && r.severity === sev
                      );
                      const isHighRisk = prob * sev >= 15;
                      const isMedRisk = prob * sev >= 8 && prob * sev < 15;

                      return (
                        <div
                          key={sev}
                          className={`h-11 rounded-lg border transition-all flex items-center justify-center p-1 text-center relative cursor-pointer ${
                            risksInCell.length > 0
                              ? isHighRisk
                                ? 'bg-red-500/20 border-red-500/60 text-red-900 dark:text-red-200'
                                : isMedRisk
                                ? 'bg-amber-500/20 border-amber-500/60 text-amber-900 dark:text-amber-200'
                                : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
                              : 'bg-[#FAF8F3] dark:bg-[#202020] border-[#E4DFD3]/60 dark:border-[#2e2e2e]'
                          }`}
                          onClick={() => {
                            if (risksInCell[0]) setSelectedRiskId(risksInCell[0].id);
                          }}
                        >
                          {risksInCell.length > 0 && (
                            <span className="font-mono text-[10px] font-extrabold">
                              {risksInCell.length} item
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-[#57534E] dark:text-[#A8A29E] font-mono pt-1 pl-7">
              <span>S1</span>
              <span>S2</span>
              <span>S3</span>
              <span>S4</span>
              <span>S5</span>
            </div>
          </div>

          {/* Selected Risk Focused Detail View */}
          {selectedRisk && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#222] border border-[#E4DFD3] dark:border-[#333] font-semibold text-[#FF6124]">
                      {selectedRisk.category}
                    </span>
                    <SourceLabelBadge label={selectedRisk.sourceLabel} />
                  </div>
                  <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] mt-1">
                    {selectedRisk.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleRiskStatus(selectedRisk.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                    selectedRisk.status === 'Mitigated'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : selectedRisk.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
                  }`}
                  title="Click to advance status"
                >
                  Status: {selectedRisk.status} ↻
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
                    Documented Evidence & Observations
                  </span>
                  <p className="text-[#1C1917] dark:text-[#F5F3EC] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e] leading-relaxed">
                    {selectedRisk.evidenceLog}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6124] block mb-1">
                    Actionable Mitigation Strategy
                  </span>
                  <p className="text-[#1C1917] dark:text-[#F5F3EC] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e] leading-relaxed">
                    {selectedRisk.mitigationAction}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#57534E] dark:text-[#A8A29E]">
                  <span>Probability: {selectedRisk.probability}/5</span>
                  <span>Severity: {selectedRisk.severity}/5</span>
                  <span className="font-bold text-[#FF6124]">
                    Risk Score: {selectedRisk.probability * selectedRisk.severity}/25
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Full Risks Directory & Unresolved Assumptions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          2. Complete Risk Registry & Invalidation Tests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.risks.map((risk) => (
            <div
              key={risk.id}
              onClick={() => setSelectedRiskId(risk.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedRiskId === risk.id
                  ? 'border-[#FF6124] bg-white dark:bg-[#222222] shadow-xs'
                  : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#181818] hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {risk.title}
                </span>
                <SourceLabelBadge label={risk.sourceLabel} />
              </div>
              <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2 leading-relaxed">
                Mitigation: {risk.mitigationAction}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E] pt-1 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
                <span>Category: {risk.category}</span>
                <span className="font-bold text-[#FF6124]">
                  Severity {risk.severity} · Prob {risk.probability}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unresolved Assumptions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Unresolved Assumptions Flagged for Invalidation
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          {data.unresolvedAssumptions.map((u, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {u.assumption}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  {u.dangerLevel} Danger
                </span>
              </div>
              <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                Test to Invalidate: {u.testToInvalidate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
