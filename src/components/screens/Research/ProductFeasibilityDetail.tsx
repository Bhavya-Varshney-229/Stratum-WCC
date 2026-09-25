import React from 'react';
import {
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Layers,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react';
import { ProductFeasibilityData, CardResearchStatus } from '../../../types/venture';
import { SourceLabelBadge } from './SourceLabelBadge';

interface ProductFeasibilityDetailProps {
  data: ProductFeasibilityData;
  onUpdate: (updated: ProductFeasibilityData) => void;
  onBack: () => void;
  onApprove: () => void;
  onRefine: () => void;
}

export const ProductFeasibilityDetail: React.FC<ProductFeasibilityDetailProps> = ({
  data,
  onUpdate,
  onBack,
  onApprove,
  onRefine,
}) => {
  const handleStatusChange = (newStatus: CardResearchStatus) => {
    onUpdate({ ...data, status: newStatus });
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
                Research Module 03
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                Status: {data.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Product Feasibility & Technical Architecture
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
            Explore Tech Stacks
          </button>

          <button
            type="button"
            onClick={onRefine}
            className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Refine Architecture</span>
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
            <span>Approve Feasibility</span>
          </button>
        </div>
      </div>

      {/* Synthesis Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
          Technical Feasibility Overview
        </span>
        <p className="text-sm font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Section 1: Technical Considerations & Recommended Stacks */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          1. Technical Architecture & Ingestion Paths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.technicalConsiderations.map((tc, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      tc.complexity === 'High'
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {tc.complexity} Complexity
                  </span>
                  <SourceLabelBadge label={tc.sourceLabel} />
                </div>
                <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {tc.domain}
                </h3>
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] mt-1 leading-relaxed">
                  {tc.architecturePath}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
                <span className="text-[9px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] font-bold block">
                  Recommended Stack:
                </span>
                <span className="text-xs font-mono font-semibold text-[#FF6124] block mt-0.5">
                  {tc.stackRecommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Cost Assumptions & Burn Projections */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          2. Operating Cost Assumptions & Unit Economics
        </h2>

        <div className="space-y-2.5">
          {data.costAssumptions.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {c.category}
                </span>
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">{c.notes}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Unit Cost:
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
                    {c.unitCost}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Monthly Burn:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#FF6124] px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
                    {c.monthlyBurnEstimate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Testing Requirements & Benchmarks */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          3. Technical Validation Benchmarks
        </h2>

        <div className="space-y-2.5">
          {data.testingRequirements.map((tr, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {tr.testName}
                </span>
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">{tr.objective}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Target Benchmark:
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {tr.targetBenchmark}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    tr.status === 'Passed'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : tr.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-[#282828] dark:text-neutral-400'
                  }`}
                >
                  {tr.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Feasibility Matrix (Complexity vs Impact) & Unresolved Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feasibility Matrix */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Feature Feasibility Matrix
          </h3>

          <div className="space-y-2 text-xs">
            {data.feasibilityMatrix.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block truncate">
                    {item.feature}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                    <span>Complexity: {item.technicalComplexity}/10</span>
                    <span>·</span>
                    <span>Impact: {item.userImpact}/10</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                    item.priority === 'MVP'
                      ? 'bg-[#FF6124] text-white'
                      : 'bg-neutral-200 dark:bg-[#333] text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Unresolved Product Claims */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
              Unresolved Product Claims to Validate
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {data.unresolvedProductClaims.map((claim, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] text-xs">
                    {claim.claim}
                  </span>
                  <SourceLabelBadge label={claim.sourceLabel} />
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Risk If False: {claim.riskIfFalse}
                </p>
                <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
                  Validation: {claim.validationMethod}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
