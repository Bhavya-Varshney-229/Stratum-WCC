import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { TargetAudienceData, CustomerPersona, CardResearchStatus } from '../../../types/venture';
import { SourceLabelBadge } from './SourceLabelBadge';

interface TargetAudienceDetailProps {
  data: TargetAudienceData;
  onUpdate: (updated: TargetAudienceData) => void;
  onBack: () => void;
  onApprove: () => void;
  onRefine: () => void;
}

export const TargetAudienceDetail: React.FC<TargetAudienceDetailProps> = ({
  data,
  onUpdate,
  onBack,
  onApprove,
  onRefine,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(data.personas[0]?.id || '');
  const selectedPersona = data.personas.find((p) => p.id === selectedPersonaId) || data.personas[0];

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
                Research Module 01
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                Status: {data.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Target Audience & Persona Architecture
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
            Explore Variations
          </button>

          <button
            type="button"
            onClick={onRefine}
            className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Refine Personas</span>
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
            <span>Approve Audience</span>
          </button>
        </div>
      </div>

      {/* Overview Synthesis Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-1">
          Executive Synthesis
        </span>
        <p className="text-sm font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Section 1: Customer Segments Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            1. Commercial Customer Segments
          </h2>
          <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">
            3 Identified Beachheads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.segments.map((seg, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {seg.name}
                </span>
                <span className="text-xs font-mono font-bold text-[#FF6124]">
                  {seg.sharePercent}% Share
                </span>
              </div>

              <div className="w-full bg-[#E4DFD3] dark:bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF6124] h-full rounded-full"
                  style={{ width: `${seg.sharePercent}%` }}
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#57534E] dark:text-[#A8A29E]">
                  <span>TAM Contribution:</span>
                  <span className="font-mono font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
                    {seg.tamContribution}
                  </span>
                </div>
                <div className="flex justify-between text-[#57534E] dark:text-[#A8A29E]">
                  <span>Adoption Readiness:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {seg.readiness}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] border-t border-[#E4DFD3] dark:border-[#2a2a2a] pt-2 leading-relaxed">
                {seg.primaryNeed}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Deep Persona Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          2. Customer Persona Profiles
        </h2>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {data.personas.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedPersona.id === persona.id
                  ? 'bg-white dark:bg-[#222222] border-[#FF6124] text-[#FF6124] shadow-xs'
                  : 'bg-[#FAF8F3] dark:bg-[#1a1a1a] border-[#E4DFD3] dark:border-[#2a2a2a] text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#FF6124] text-white flex items-center justify-center text-[10px] font-bold">
                {persona.name.charAt(0)}
              </div>
              <span>{persona.name}</span>
              <span className="text-[10px] font-normal opacity-70">({persona.role.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Selected Persona Deep View */}
        {selectedPersona && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                    {selectedPersona.name}
                  </h3>
                  <SourceLabelBadge label={selectedPersona.sourceLabel} />
                </div>
                <p className="text-xs font-semibold text-[#FF6124]">
                  {selectedPersona.role}
                </p>
              </div>

              <div className="text-right sm:text-right text-xs text-[#57534E] dark:text-[#A8A29E]">
                <span>{selectedPersona.demographics}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Psychographic Driver
                </span>
                <p className="text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
                  {selectedPersona.psychographics}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Daily Operational Friction
                </span>
                <p className="text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
                  {selectedPersona.dailyFriction}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Budget & Purchasing Authority
                </span>
                <p className="text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
                  {selectedPersona.budgetAuthority}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Adoption Trigger
                </span>
                <p className="text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
                  {selectedPersona.adoptionTrigger}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Pain Points & Workarounds with Source Labels */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
          3. Verified Friction Points & Current Workarounds
        </h2>

        <div className="space-y-2.5">
          {data.painPoints.map((pt, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      pt.severity === 'Critical'
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {pt.severity}
                  </span>
                  <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    {pt.friction}
                  </span>
                </div>
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                  Current Workaround: {pt.currentWorkaround}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[9px] text-[#57534E] dark:text-[#A8A29E] block">
                    Opportunity
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FF6124]">
                    {pt.opportunityScore}/10
                  </span>
                </div>
                <SourceLabelBadge label={pt.sourceLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Behavior Comparisons & Willingness-to-Pay Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavior Comparisons Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Behavior Comparison Across Segments
          </h3>
          <div className="space-y-2 text-xs">
            {data.behaviorComparisons.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1.5"
              >
                <span className="font-bold text-[#FF6124] text-[11px]">{b.dimension}</span>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                  <div>
                    <span className="font-semibold block text-[#1C1917] dark:text-[#F5F3EC]">
                      Early Adopter:
                    </span>
                    <span>{b.earlyAdopter}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[#1C1917] dark:text-[#F5F3EC]">
                      Mainstream:
                    </span>
                    <span>{b.mainstream}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[#1C1917] dark:text-[#F5F3EC]">
                      Enterprise:
                    </span>
                    <span>{b.enterprise}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Willingness to Pay & Retention Charts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Willingness to Pay Distribution
          </h3>

          <div className="space-y-2.5">
            {data.charts.willingnessToPay.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1C1917] dark:text-[#F5F3EC]">{item.tier}</span>
                  <span className="font-mono text-[#FF6124]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#E4DFD3] dark:bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF6124] h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
            <h4 className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC] mb-2 uppercase">
              Projected Retention Potential (Cohort Rate)
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              {data.charts.retentionPotential.map((m, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]"
                >
                  <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] block">
                    {m.month}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {m.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
