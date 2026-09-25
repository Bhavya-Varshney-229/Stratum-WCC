import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Edit3,
  HelpCircle,
  Compass,
  Target,
  Palette,
  Rocket,
  FileCheck,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { QuestionnaireAnswers, IdeaUnderstanding, VentureProject } from '../../types/venture';
import { PRESET_IDEAS } from '../../services/ventureStorage';

interface LandingCreationScreenProps {
  onConfirmAndProceed: (rawIdea: string, answers: QuestionnaireAnswers, customUnderstanding?: Partial<IdeaUnderstanding>) => void;
  onOpenProject?: (project: VentureProject) => void;
  savedProjects?: VentureProject[];
}

type OnboardingPhase = 'hero-idea' | 'questionnaire' | 'understanding';

export const LandingCreationScreen: React.FC<LandingCreationScreenProps> = ({
  onConfirmAndProceed,
  onOpenProject,
  savedProjects = [],
}) => {
  const [phase, setPhase] = useState<OnboardingPhase>('hero-idea');
  const [rawIdea, setRawIdea] = useState('');
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    industry: 'Clean Energy & Infrastructure',
    customerType: 'Commercial Real Estate & Industrial Parks',
    unfairAdvantage: 'Proprietary predictive tariff-dispatch algorithm',
    businessModel: 'B2B SaaS + Performance Share',
    launchStage: 'Early Prototype / MVP',
  });

  const [understanding, setUnderstanding] = useState<IdeaUnderstanding | null>(null);
  const [isEditingUnderstanding, setIsEditingUnderstanding] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Quick preset loader
  const handleSelectPreset = (preset: (typeof PRESET_IDEAS)[0]) => {
    setRawIdea(preset.rawIdea);
    setAnswers(preset.answers);
  };

  const handleStartBuilding = () => {
    if (!rawIdea.trim()) return;
    setPhase('questionnaire');
  };

  const handleQuestionnaireSubmit = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      // Generate understanding draft
      const draft: IdeaUnderstanding = {
        projectName: 'Stratum Venture',
        projectType: 'new_brand',
        businessCategory: answers.industry,
        businessDescription: rawIdea,
        productOrService: 'Autonomous Intelligence Platform',
        problemBeingSolved: `Customers currently lose significant operating margin and waste hours of labor due to fragmented, manual monitoring and legacy vendor friction.`,
        coreValue: `Autonomous intelligence engine addressing operational inefficiencies in ${answers.industry} for ${answers.customerType}.`,
        potentialCustomers: `${answers.customerType} seeking quantifiable payback and rapid sub-48-hour implementation without specialized engineering overhead.`,
        differentiation: answers.unfairAdvantage || 'Sub-second real-time optimization loop with verifiable audit defensibility.',
        businessGoals: `${answers.businessModel} structured for high gross margins (75%+) and negative net revenue churn.`,
        constraints: [
          'Implementation must operate within existing infrastructure',
          'Audit compliance verification within 30 days',
        ],
        importantAssumptions: [
          'Customer willingness to connect telemetry feeds without a 90-day sandbox pilot',
          'Payback horizon under 9 months is sufficient to bypass competitive bidding committees',
        ],
        unresolvedQuestions: [
          'Optimal contract pricing tier and expansion velocity',
        ],
        corePremise: `Autonomous intelligence engine addressing operational inefficiencies in ${answers.industry} for ${answers.customerType}.`,
        primaryProblem: `Customers currently lose significant operating margin and waste hours of labor due to fragmented, manual monitoring and legacy vendor friction.`,
        targetAudienceSummary: `${answers.customerType} seeking quantifiable payback and rapid sub-48-hour implementation without specialized engineering overhead.`,
        unfairAdvantage: answers.unfairAdvantage || 'Sub-second real-time optimization loop with verifiable audit defensibility.',
        businessModelSummary: `${answers.businessModel} structured for high gross margins (75%+) and negative net revenue churn.`,
        unresolvedAssumptions: [
          'Customer willingness to connect telemetry feeds without a 90-day sandbox pilot',
          'Payback horizon under 9 months is sufficient to bypass competitive bidding committees',
          'Unit economics resilience under a 20% hardware or cloud compute cost surge',
        ],
        suggestedFocusAreas: [
          'Conduct 15 customer discovery interviews on willingness-to-pay',
          'Validate technical latency bounds in low-bandwidth field environments',
          'Establish defensible IP moat around the core dispatch logic',
        ],
      };
      setUnderstanding(draft);
      setPhase('understanding');
    }, 600);
  };

  const handleConfirmUnderstanding = () => {
    if (!understanding) return;
    onConfirmAndProceed(rawIdea, answers, understanding);
  };

  const handleClarifyDeepen = () => {
    if (!understanding) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setUnderstanding({
        ...understanding,
        corePremise: `${understanding.corePremise} Enhanced with sub-100ms edge telemetry validation and zero-trust cryptographic audit trails.`,
        primaryProblem: `${understanding.primaryProblem} Verified 34% baseline waste observed across standard 12-month commercial benchmark studies.`,
        unresolvedAssumptions: [
          ...understanding.unresolvedAssumptions,
          'Legal compliance requirements in secondary regional expansion territories',
        ],
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F1EEE4] dark:bg-[#121212] text-[#1C1917] dark:text-[#F5F3EC] flex flex-col justify-between selection:bg-[#FF6124] selection:text-white transition-colors duration-200">
      {/* Top Simple Nav */}
      <header className="px-6 py-5 border-b border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF6124] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
            ST
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
              STRATUM
            </span>
            <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E] ml-2">
              Venture Intelligence Platform
            </span>
          </div>
        </div>

        {savedProjects.length > 0 && onOpenProject && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#57534E] dark:text-[#A8A29E] hidden sm:inline">
              Resume active:
            </span>
            <button
              type="button"
              onClick={() => onOpenProject(savedProjects[0])}
              className="px-3 py-1.5 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl hover:border-[#FF6124] transition-all cursor-pointer shadow-2xs truncate max-w-[200px]"
            >
              {savedProjects[0].title}
            </button>
          </div>
        )}
      </header>

      {/* Main Form Flow */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex flex-col justify-center">
        {/* PHASE 1: Hero & Idea Input */}
        {phase === 'hero-idea' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Editorial Headline */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] text-xs font-semibold text-[#FF6124] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Five Integrated Venture Workspaces</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F3EC] leading-[1.15]">
                Architecture for <br className="hidden sm:inline" />
                <span className="text-[#FF6124]">Ambitious Ventures.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
                Transform rough startup hypotheses into verified target research, defensible brand
                strategy, visual direction, and an actionable 20-week market launch blueprint.
              </p>
            </div>

            {/* Idea Input Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-5">
              <div>
                <label
                  htmlFor="raw-idea-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-2"
                >
                  Enter Your Startup Idea or Venture Premise
                </label>
                <textarea
                  id="raw-idea-input"
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  rows={3}
                  placeholder="e.g. Autonomous solar microgrid orchestrator for decentralized commercial power networks..."
                  className="w-full p-4 text-sm bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-[#1C1917] dark:text-[#F5F3EC] placeholder-[#57534E]/60 focus:outline-none focus:border-[#FF6124] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                  Next: 4 personalized questions to calibrate research & strategy.
                </p>

                <button
                  type="button"
                  onClick={handleStartBuilding}
                  disabled={!rawIdea.trim()}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] disabled:opacity-40 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
                >
                  <span>Start Building</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Quick-Start Inspiration Prompts */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Or explore an engineered venture archetype:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_IDEAS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3.5 rounded-xl bg-white/70 dark:bg-[#1a1a1a] hover:bg-white dark:hover:bg-[#222222] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FF6124] font-bold mb-1">
                      <Zap className="w-3 h-3" />
                      <span>{preset.answers.industry.split('&')[0]}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] line-clamp-2 leading-snug">
                      {preset.rawIdea}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: Personalized 5-Question Questionnaire */}
        {phase === 'questionnaire' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setPhase('hero-idea')}
                className="text-xs font-bold text-[#FF6124] hover:underline cursor-pointer mb-2 block"
              >
                ← Edit Venture Idea
              </button>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                Calibrate Venture Parameters
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                Answer 5 questions to shape your customer segments, pricing models, and risk analysis.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-6">
              {/* Q1: Industry & Domain */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                  1. Target Industry & Macro Domain
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Clean Energy & Infrastructure',
                    'Smart Retail & FoodTech',
                    'FinTech & Regulatory Intelligence',
                    'Enterprise B2B SaaS & DevTools',
                  ].map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setAnswers({ ...answers, industry: ind })}
                      className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        answers.industry === ind
                          ? 'border-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124]'
                          : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] text-[#1C1917] dark:text-[#F5F3EC] hover:border-neutral-400'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Primary Customer Archetype */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                  2. Primary Customer Archetype
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Commercial Real Estate & Industrial Parks',
                    'High-Growth B2B Enterprises ($20M+ ARR)',
                    'Tech Campuses & Premium Transit Hubs',
                    'SMBs & Autonomous Operator Teams',
                  ].map((cust) => (
                    <button
                      key={cust}
                      type="button"
                      onClick={() => setAnswers({ ...answers, customerType: cust })}
                      className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        answers.customerType === cust
                          ? 'border-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124]'
                          : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] text-[#1C1917] dark:text-[#F5F3EC] hover:border-neutral-400'
                      }`}
                    >
                      {cust}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Core Unfair Advantage */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                  3. Core Unfair Advantage / Technical Moat
                </label>
                <input
                  type="text"
                  value={answers.unfairAdvantage}
                  onChange={(e) => setAnswers({ ...answers, unfairAdvantage: e.target.value })}
                  placeholder="e.g. Sub-second predictive dispatch solver, zero hardware modification needed"
                  className="w-full p-3 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-[#1C1917] dark:text-[#F5F3EC] focus:outline-none focus:border-[#FF6124]"
                />
              </div>

              {/* Q4: Business Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                  4. Preferred Monetization Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'B2B SaaS + Performance Share',
                    'Hardware Lease + High Margin Consumables',
                    'Tiered Enterprise Annual License',
                  ].map((bm) => (
                    <button
                      key={bm}
                      type="button"
                      onClick={() => setAnswers({ ...answers, businessModel: bm })}
                      className={`p-2.5 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        answers.businessModel === bm
                          ? 'border-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124]'
                          : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] text-[#1C1917] dark:text-[#F5F3EC] hover:border-neutral-400'
                      }`}
                    >
                      {bm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Stage of Launch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                  5. Current Venture Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Concept / Hypothesis', 'Early Prototype / MVP', 'Field Testing / Beta', 'Live Commercial Revenue'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAnswers({ ...answers, launchStage: st })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        answers.launchStage === st
                          ? 'border-[#FF6124] bg-[#FF6124] text-white'
                          : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] text-[#1C1917] dark:text-[#F5F3EC]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPhase('hero-idea')}
                  className="px-4 py-2 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleQuestionnaireSubmit}
                  disabled={isSynthesizing}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {isSynthesizing ? (
                    <span>Synthesizing Parameters...</span>
                  ) : (
                    <>
                      <span>Generate AI Understanding</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: Editable AI-Generated Understanding of the Idea */}
        {phase === 'understanding' && understanding && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                  AI Synthesized Venture Premise
                </span>
                <span className="text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                  Ready for Confirmation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                Review Structured Idea Understanding
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                Verify the extracted core problem, unfair advantage, and critical assumptions before entering Research & Discovery.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-5">
              {/* Core Premise */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Core Premise & Architecture
                </label>
                {isEditingUnderstanding ? (
                  <textarea
                    rows={2}
                    value={understanding.corePremise}
                    onChange={(e) => setUnderstanding({ ...understanding, corePremise: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#FF6124] rounded-lg text-[#1C1917] dark:text-[#F5F3EC]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e]">
                    {understanding.corePremise}
                  </p>
                )}
              </div>

              {/* Primary Problem & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                    Primary Problem Solved
                  </label>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.primaryProblem}
                      onChange={(e) => setUnderstanding({ ...understanding, primaryProblem: e.target.value })}
                      className="w-full p-2.5 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#FF6124] rounded-lg text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e] leading-relaxed">
                      {understanding.primaryProblem}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                    Target Customer & Adoption Trigger
                  </label>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.targetAudienceSummary}
                      onChange={(e) => setUnderstanding({ ...understanding, targetAudienceSummary: e.target.value })}
                      className="w-full p-2.5 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#FF6124] rounded-lg text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e] leading-relaxed">
                      {understanding.targetAudienceSummary}
                    </p>
                  )}
                </div>
              </div>

              {/* Unresolved Assumptions */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Unresolved Assumptions Flagged for Research Validation
                </label>
                <div className="space-y-1.5">
                  {understanding.unresolvedAssumptions.map((assump, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] text-xs text-[#1C1917] dark:text-[#F5F3EC] flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        !
                      </span>
                      <span className="leading-snug">{assump}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Confirm, Edit, Clarify */}
              <div className="pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingUnderstanding(!isEditingUnderstanding)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] hover:border-neutral-400 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FF6124]" />
                    <span>{isEditingUnderstanding ? 'Done Editing' : 'Edit Premises'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClarifyDeepen}
                    disabled={isSynthesizing}
                    className="px-3.5 py-2 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isSynthesizing ? 'Clarifying...' : 'Clarify & Deepen'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmUnderstanding}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Navigate to Research</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Editorial Badges */}
      <footer className="border-t border-[#E4DFD3] dark:border-[#2a2a2a] py-6 px-6 max-w-7xl mx-auto w-full text-center text-xs text-[#57534E] dark:text-[#A8A29E]">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span>01. Research & Discovery</span>
          <span>·</span>
          <span>02. Brand Strategy</span>
          <span>·</span>
          <span>03. Design Studio</span>
          <span>·</span>
          <span>04. Market & Launch</span>
          <span>·</span>
          <span>05. Complete Brand Kit</span>
        </div>
      </footer>
    </div>
  );
};
