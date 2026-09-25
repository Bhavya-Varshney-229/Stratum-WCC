import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Cpu,
  Crosshair,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  Sliders,
  Network,
  Database,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  VentureProject,
  ResearchCardId,
  ResearchToolId,
  CardResearchStatus,
} from '../../types/venture';
import { TargetAudienceDetail } from './Research/TargetAudienceDetail';
import { MarketOpportunityDetail } from './Research/MarketOpportunityDetail';
import { ProductFeasibilityDetail } from './Research/ProductFeasibilityDetail';
import { CompetitiveAnalysisDetail } from './Research/CompetitiveAnalysisDetail';
import { RisksDrawbacksDetail } from './Research/RisksDrawbacksDetail';
import { DevelopmentRoadmapDetail } from './Research/DevelopmentRoadmapDetail';

import { BrainstormCanvasTool } from './Research/Tools/BrainstormCanvasTool';
import { WhatIfSimulatorTool } from './Research/Tools/WhatIfSimulatorTool';
import { CompetitorTrackerTool } from './Research/Tools/CompetitorTrackerTool';
import { CustomerValidationTool } from './Research/Tools/CustomerValidationTool';

interface ResearchDiscoveryScreenProps {
  project: VentureProject;
  onUpdateProject: (updated: VentureProject) => void;
  onLogDecision: (
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit',
    affectsDownstream?: ('brand-strategy' | 'design-studio' | 'market-launch' | 'complete-brand-kit')[]
  ) => void;
  onNavigateWorkspace: (wsId: any) => void;
}

export const ResearchDiscoveryScreen: React.FC<ResearchDiscoveryScreenProps> = ({
  project,
  onUpdateProject,
  onLogDecision,
  onNavigateWorkspace,
}) => {
  const [activeDetailCard, setActiveDetailCard] = useState<ResearchCardId | null>(null);
  const [activeTool, setActiveTool] = useState<ResearchToolId | null>(null);

  const { researchDiscovery } = project;

  // The 6 mandated cards configuration
  const sixCards: {
    id: ResearchCardId;
    number: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    preview: string;
    status: CardResearchStatus;
    metricTag: string;
  }[] = [
    {
      id: 'target-audience',
      number: '01',
      title: 'Target Audience',
      icon: Users,
      preview: researchDiscovery.targetAudience.summary,
      status: researchDiscovery.targetAudience.status,
      metricTag: `${researchDiscovery.targetAudience.personas.length} Personas · ${researchDiscovery.targetAudience.segments[0].sharePercent}% Primary`,
    },
    {
      id: 'market-opportunity',
      number: '02',
      title: 'Market Opportunity',
      icon: TrendingUp,
      preview: researchDiscovery.marketOpportunity.summary,
      status: researchDiscovery.marketOpportunity.status,
      metricTag: `TAM ${researchDiscovery.marketOpportunity.tam} · CAGR +${researchDiscovery.marketOpportunity.cagrPercent}%`,
    },
    {
      id: 'product-feasibility',
      number: '03',
      title: 'Product Feasibility',
      icon: Cpu,
      preview: researchDiscovery.productFeasibility.summary,
      status: researchDiscovery.productFeasibility.status,
      metricTag: `${researchDiscovery.productFeasibility.technicalConsiderations.length} Arch Paths · Benchmarks Active`,
    },
    {
      id: 'competitive-analysis',
      number: '04',
      title: 'Competitive Analysis',
      icon: Crosshair,
      preview: researchDiscovery.competitiveAnalysis.summary,
      status: researchDiscovery.competitiveAnalysis.status,
      metricTag: `${researchDiscovery.competitiveAnalysis.competitors.length} Rivals Tracked · 2D Radar Ready`,
    },
    {
      id: 'risks-drawbacks',
      number: '05',
      title: 'Risks & Drawbacks',
      icon: AlertTriangle,
      preview: researchDiscovery.risksDrawbacks.summary,
      status: researchDiscovery.risksDrawbacks.status,
      metricTag: `${researchDiscovery.risksDrawbacks.risks.length} Risk Vectors · Mitigation Mapped`,
    },
    {
      id: 'development-roadmap',
      number: '06',
      title: 'Development Roadmap',
      icon: Calendar,
      preview: researchDiscovery.developmentRoadmap.summary,
      status: researchDiscovery.developmentRoadmap.status,
      metricTag: `4 Phases · ${researchDiscovery.developmentRoadmap.milestones.length} Milestones Scheduled`,
    },
  ];

  // Helper for updating specific card data
  const handleApproveCard = (cardTitle: string, affectsDownstream: any[] = ['brand-strategy']) => {
    onLogDecision(
      `Approved: ${cardTitle}`,
      `Verified empirical metrics and finalized research baseline for ${cardTitle}.`,
      'approve',
      affectsDownstream
    );
  };

  const handleRefineCard = (cardTitle: string) => {
    onLogDecision(
      `Refined: ${cardTitle}`,
      `Refined hypotheses and validated empirical assumptions for ${cardTitle}.`,
      'refine',
      ['brand-strategy']
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* If a dedicated detailed analysis screen is open */}
      {activeDetailCard === 'target-audience' && (
        <TargetAudienceDetail
          data={researchDiscovery.targetAudience}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, targetAudience: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Target Audience', ['brand-strategy'])}
          onRefine={() => handleRefineCard('Target Audience')}
        />
      )}

      {activeDetailCard === 'market-opportunity' && (
        <MarketOpportunityDetail
          data={researchDiscovery.marketOpportunity}
          project={project}
          onLogDecision={onLogDecision}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, marketOpportunity: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Market Opportunity', ['brand-strategy'])}
          onRefine={() => handleRefineCard('Market Opportunity')}
        />
      )}

      {activeDetailCard === 'product-feasibility' && (
        <ProductFeasibilityDetail
          data={researchDiscovery.productFeasibility}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, productFeasibility: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Product Feasibility', ['market-launch'])}
          onRefine={() => handleRefineCard('Product Feasibility')}
        />
      )}

      {activeDetailCard === 'competitive-analysis' && (
        <CompetitiveAnalysisDetail
          data={researchDiscovery.competitiveAnalysis}
          project={project}
          onLogDecision={onLogDecision}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, competitiveAnalysis: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Competitive Analysis', ['brand-strategy'])}
          onRefine={() => handleRefineCard('Competitive Analysis')}
        />
      )}

      {activeDetailCard === 'risks-drawbacks' && (
        <RisksDrawbacksDetail
          data={researchDiscovery.risksDrawbacks}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, risksDrawbacks: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Risks & Drawbacks', ['market-launch'])}
          onRefine={() => handleRefineCard('Risks & Drawbacks')}
        />
      )}

      {activeDetailCard === 'development-roadmap' && (
        <DevelopmentRoadmapDetail
          data={researchDiscovery.developmentRoadmap}
          onUpdate={(updated) =>
            onUpdateProject({
              ...project,
              researchDiscovery: { ...researchDiscovery, developmentRoadmap: updated },
            })
          }
          onBack={() => setActiveDetailCard(null)}
          onApprove={() => handleApproveCard('Development Roadmap', ['market-launch'])}
          onRefine={() => handleRefineCard('Development Roadmap')}
        />
      )}

      {/* If one of the 4 Research Tools is open */}
      {activeTool === 'canvas' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            className="text-xs font-bold text-[#FF6124] hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Return to Six-Card Dashboard
          </button>
          <BrainstormCanvasTool
            initialNodes={researchDiscovery.brainstormNodes}
            onUpdateNodes={(nodes) =>
              onUpdateProject({
                ...project,
                researchDiscovery: { ...researchDiscovery, brainstormNodes: nodes },
              })
            }
          />
        </div>
      )}

      {activeTool === 'what-if' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            className="text-xs font-bold text-[#FF6124] hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Return to Six-Card Dashboard
          </button>
          <WhatIfSimulatorTool
            initialInputs={researchDiscovery.simulatorInputs}
            onUpdateInputs={(inputs) =>
              onUpdateProject({
                ...project,
                researchDiscovery: { ...researchDiscovery, simulatorInputs: inputs },
              })
            }
          />
        </div>
      )}

      {activeTool === 'competitors' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            className="text-xs font-bold text-[#FF6124] hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Return to Six-Card Dashboard
          </button>
          <CompetitorTrackerTool
            initialCompetitors={researchDiscovery.competitiveAnalysis.competitors}
            onUpdateCompetitors={(comps) =>
              onUpdateProject({
                ...project,
                researchDiscovery: {
                  ...researchDiscovery,
                  competitiveAnalysis: {
                    ...researchDiscovery.competitiveAnalysis,
                    competitors: comps,
                  },
                },
              })
            }
          />
        </div>
      )}

      {activeTool === 'validation' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            className="text-xs font-bold text-[#FF6124] hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Return to Six-Card Dashboard
          </button>
          <CustomerValidationTool
            initialResponses={researchDiscovery.surveyResponses}
            onUpdateResponses={(resps) =>
              onUpdateProject({
                ...project,
                researchDiscovery: { ...researchDiscovery, surveyResponses: resps },
              })
            }
          />
        </div>
      )}

      {/* Primary View: Six-Card Dashboard & Research Tools Launcher */}
      {!activeDetailCard && !activeTool && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Description */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6124] font-bold">
                Workspace 01
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
                Research & Discovery Intelligence
              </h1>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
                Six dedicated analytical domains synthesizing empirical customer demand, TAM volume,
                technical feasibility, competitor moats, and risk mitigation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateWorkspace('brand-strategy')}
                className="px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Proceed to Brand Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* THE SIX MANDATED CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sixCards.map((card) => {
              const Icon = card.icon;

              const statusColorMap: Record<CardResearchStatus, string> = {
                'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
                'Verified': 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
                'In Progress': 'bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
                'AI Hypothesis': 'bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
                'Needs Testing': 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
              };

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveDetailCard(card.id)}
                  className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Number + Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center text-[#FF6124] group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E] font-bold">
                            CARD {card.number}
                          </span>
                          <h3 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC] leading-tight">
                            {card.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md border font-bold ${
                          statusColorMap[card.status]
                        }`}
                      >
                        {card.status}
                      </span>
                    </div>

                    {/* Short Insight Preview */}
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] line-clamp-3 leading-relaxed">
                      {card.preview}
                    </p>
                  </div>

                  {/* Bottom Action & Metric Indicator */}
                  <div className="pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a] mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E] font-semibold truncate max-w-[170px]">
                      {card.metricTag}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDetailCard(card.id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF6124] group-hover:bg-[#FF6124] group-hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* THE FOUR INTEGRATED RESEARCH TOOLS */}
          <div className="space-y-4 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
                  Integrated Interactive Research Tools
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                  Four dedicated interactive tools for continuous scenario modeling and empirical validation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tool 1: AI Brainstorming Canvas */}
              <button
                type="button"
                onClick={() => setActiveTool('canvas')}
                className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center">
                    <Network className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    AI Brainstorming Canvas
                  </h4>
                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                    Interactive connected idea nodes and visual hypothesis mapping.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#FF6124] mt-3 block group-hover:underline">
                  Launch Canvas →
                </span>
              </button>

              {/* Tool 2: What-If Simulator */}
              <button
                type="button"
                onClick={() => setActiveTool('what-if')}
                className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    What-If Simulator
                  </h4>
                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                    Transparent sliders and live 12-month pro-forma runway calculations.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#FF6124] mt-3 block group-hover:underline">
                  Launch Simulator →
                </span>
              </button>

              {/* Tool 3: Competitor Tracker */}
              <button
                type="button"
                onClick={() => setActiveTool('competitors')}
                className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    Competitor Intelligence Tracker
                  </h4>
                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                    Track saved profiles, pricing models, and feature parity.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#FF6124] mt-3 block group-hover:underline">
                  Open Tracker →
                </span>
              </button>

              {/* Tool 4: Customer Validation Studio */}
              <button
                type="button"
                onClick={() => setActiveTool('validation')}
                className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    Customer Validation Studio
                  </h4>
                  <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                    Discovery interviews, CSV import, NPS analysis, and quotes.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#FF6124] mt-3 block group-hover:underline">
                  Open Studio →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
