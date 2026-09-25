import React, { useState } from 'react';
import {
  Crosshair,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Layers,
  Filter,
} from 'lucide-react';
import { CompetitiveAnalysisData, CardResearchStatus, VentureProject } from '../../../types/venture';
import { SourceLabelBadge } from './SourceLabelBadge';
import { ResearchRefinementModal, ImprovementSuggestion } from './ResearchRefinementModal';

interface CompetitiveAnalysisDetailProps {
  data: CompetitiveAnalysisData;
  onUpdate: (updated: CompetitiveAnalysisData) => void;
  onBack: () => void;
  onApprove: () => void;
  onRefine: () => void;
  project?: VentureProject;
  onLogDecision?: (title: string, description: string, actionType: 'approve' | 'refine' | 'edit', affectsDownstream?: any[]) => void;
}

// Concrete attribute matrices
const featureComparisonMatrix = [
  { feature: 'Sub-Second Peak Shaving Telemetry', us: true, gridpoint: false, honeywell: false, siemens: false },
  { feature: 'Zero-Hardware Pure Cloud Gateway', us: true, gridpoint: false, honeywell: false, siemens: false },
  { feature: 'Transparent Payback Guarantee (<9 Mo)', us: true, gridpoint: false, honeywell: false, siemens: false },
  { feature: 'Legacy Modbus/BACnet Open API Adapter', us: true, gridpoint: true, honeywell: true, siemens: true },
  { feature: 'Self-Serve Pilot Deployment in 48h', us: true, gridpoint: false, honeywell: false, siemens: false },
  { feature: 'Global Field Maintenance Fleet', us: false, gridpoint: true, honeywell: true, siemens: true },
];

export const CompetitiveAnalysisDetail: React.FC<CompetitiveAnalysisDetailProps> = ({
  data,
  onUpdate,
  onBack,
  onApprove,
  onRefine,
  project,
  onLogDecision,
}) => {
  const [selectedCompIds, setSelectedCompIds] = useState<string[]>(
    data.competitors.slice(0, 3).map((c) => c.id)
  );
  const [activeTab, setActiveTab] = useState<'cards' | 'matrix' | 'radar'>('cards');
  const [isRefinementOpen, setIsRefinementOpen] = useState(false);

  const handleStatusChange = (newStatus: CardResearchStatus) => {
    onUpdate({ ...data, status: newStatus });
  };

  const handleToggleCompetitor = (id: string) => {
    if (selectedCompIds.includes(id)) {
      if (selectedCompIds.length > 1) {
        setSelectedCompIds(selectedCompIds.filter((cid) => cid !== id));
      }
    } else {
      setSelectedCompIds([...selectedCompIds, id]);
    }
  };

  const handleAcceptRefinement = (sug: ImprovementSuggestion) => {
    if (onLogDecision) {
      onLogDecision(
        `Applied Research Refinement: ${sug.category}`,
        sug.suggestedChange,
        'refine',
        sug.affectedSections
      );
    }
  };

  const selectedCompetitors = data.competitors.filter((c) => selectedCompIds.includes(c.id));

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
                Research Module 04
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                Status: {data.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Competitive Analysis & Positioning Radar
            </h1>
          </div>
        </div>

        {/* 3 Mandated Actions + Suggest Improvements */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRefinementOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6124] to-[#e5531b] hover:opacity-95 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggest Improvements</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('Needs Testing')}
            className="px-3 py-1.5 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Explore Rivals
          </button>

          <button
            type="button"
            onClick={() => {
              handleStatusChange('Approved');
              onApprove();
            }}
            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Positioning</span>
          </button>
        </div>
      </div>

      {/* Synthesis Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
          Competitive Landscape Executive Summary
        </span>
        <p className="text-sm font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Interactive Competitor Comparison Arena */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6124]">
                Interactive Arena
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Live Comparison
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mt-0.5">
              Side-by-Side Competitive Attributes & Matrices
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#FAF8F3] dark:bg-[#202020] rounded-xl border border-[#E4DFD3] dark:border-[#333]">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-white dark:bg-[#2a2a2a] text-[#FF6124] shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Profiles
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-[#2a2a2a] text-[#FF6124] shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Feature Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-white dark:bg-[#2a2a2a] text-[#FF6124] shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Positioning Map
            </button>
          </div>
        </div>

        {/* Competitor Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-semibold mr-1">Compare:</span>
          {data.competitors.map((c) => {
            const isSelected = selectedCompIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleToggleCompetitor(c.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF6124] text-white shadow-2xs font-bold'
                    : 'bg-[#FAF8F3] dark:bg-[#202020] text-stone-600 dark:text-stone-400 border border-[#E4DFD3] dark:border-[#333]'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] opacity-80">({c.category})</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Competitor Profile Cards */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {selectedCompetitors.map((comp) => (
              <div
                key={comp.id}
                className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                      {comp.name}
                    </span>
                    <SourceLabelBadge label={comp.sourceLabel} />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#222] border border-[#E4DFD3] dark:border-[#333]">
                      {comp.category} Rival
                    </span>
                    <span>Share: {comp.marketShare}</span>
                  </div>

                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] italic">
                    Pricing: {comp.pricingModel}
                  </p>

                  {/* Strengths */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
                      Core Strengths
                    </span>
                    <ul className="text-[11px] text-[#57534E] dark:text-[#A8A29E] space-y-0.5 list-disc list-inside">
                      {comp.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Vulnerabilities */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 block">
                      Vulnerabilities
                    </span>
                    <ul className="text-[11px] text-[#57534E] dark:text-[#A8A29E] space-y-0.5 list-disc list-inside">
                      {comp.vulnerabilities.map((vuln, idx) => (
                        <li key={idx}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Our Differentiation Angle */}
                <div className="pt-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] bg-orange-50/50 dark:bg-orange-950/20 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#FF6124] block">
                    Our Defensible Wedge
                  </span>
                  <p className="text-[11px] font-semibold text-[#1C1917] dark:text-[#F5F3EC] mt-0.5">
                    {comp.differentiationAngle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Feature Matrix */}
        {activeTab === 'matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="pb-3">Capability / Differentiator</th>
                  <th className="pb-3 text-[#FF6124] font-extrabold">{project?.title || 'Our Venture'}</th>
                  <th className="pb-3">GridPoint</th>
                  <th className="pb-3">Honeywell Forge</th>
                  <th className="pb-3">Siemens Desigo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DFD3] dark:divide-[#2a2a2a]">
                {featureComparisonMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-2.5 font-bold text-stone-800 dark:text-stone-200">{row.feature}</td>
                    <td className="py-2.5">
                      {row.us ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-stone-400" />
                      )}
                    </td>
                    <td className="py-2.5">
                      {row.gridpoint ? <Check className="w-4 h-4 text-stone-600" /> : <X className="w-4 h-4 text-stone-400" />}
                    </td>
                    <td className="py-2.5">
                      {row.honeywell ? <Check className="w-4 h-4 text-stone-600" /> : <X className="w-4 h-4 text-stone-400" />}
                    </td>
                    <td className="py-2.5">
                      {row.siemens ? <Check className="w-4 h-4 text-stone-600" /> : <X className="w-4 h-4 text-stone-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Positioning 2D Map */}
        {activeTab === 'radar' && (
          <div className="space-y-3">
            <div className="relative h-64 w-full bg-[#FAF8F3] dark:bg-[#151515] rounded-xl p-4 border border-[#E4DFD3] dark:border-[#2a2a2a]">
              {/* Axes */}
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-stone-300 dark:bg-stone-700" />
              <div className="absolute top-1/2 left-4 right-4 h-px bg-stone-300 dark:bg-stone-700" />

              {/* Axis labels */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-stone-500">
                High Autonomy / Sub-Second Telemetry
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Manual / Human-Dispatched Rule Logic
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-stone-500">
                High Hardware Lock-in
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Zero-Hardware API-First
              </span>

              {/* Plots */}
              {/* Our venture */}
              <div className="absolute top-[22%] right-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-[#FF6124] ring-4 ring-[#FF6124]/20 animate-pulse" />
                <span className="text-[10px] font-extrabold text-[#FF6124] mt-1 bg-white dark:bg-[#202020] px-1.5 py-0.5 rounded shadow-xs">
                  {project?.title || 'Our Venture'} (Target Wedge)
                </span>
              </div>

              {/* GridPoint */}
              <div className="absolute bottom-[28%] left-[26%] flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-600" />
                <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300 mt-1">
                  GridPoint (Incumbent)
                </span>
              </div>

              {/* Honeywell Forge */}
              <div className="absolute top-[38%] left-[30%] flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-500" />
                <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300 mt-1">
                  Honeywell Forge
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic">
              Empirical Positioning: Our solution occupies the unserved top-right quadrant combining autonomous sub-second execution with zero proprietary hardware lock-in.
            </p>
          </div>
        )}
      </div>

      {/* Refinement Modal */}
      {project && (
        <ResearchRefinementModal
          isOpen={isRefinementOpen}
          onClose={() => setIsRefinementOpen(false)}
          cardId="competitive-analysis"
          cardTitle="Competitive Analysis"
          project={project}
          onAcceptSuggestion={handleAcceptRefinement}
          onRejectSuggestion={() => {}}
        />
      )}
    </div>
  );
};
