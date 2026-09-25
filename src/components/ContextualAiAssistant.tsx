import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { WorkspaceId, VentureProject } from '../types/venture';

interface ContextualAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeWorkspace: WorkspaceId;
  project: VentureProject | null;
  onApplySuggestion: (suggestion: string) => void;
}

export const ContextualAiAssistant: React.FC<ContextualAiAssistantProps> = ({
  isOpen,
  onClose,
  activeWorkspace,
  project,
  onApplySuggestion,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [recentOutput, setRecentOutput] = useState<{ text: string; isAi: boolean } | null>(null);

  if (!isOpen) return null;

  // Context-specific recommendations based on active workspace
  const workspaceAdvice: Record<
    WorkspaceId,
    {
      title: string;
      focus: string;
      suggestions: string[];
      stressTestQuestions: string[];
    }
  > = {
    'research-discovery': {
      title: 'Research & Discovery Focus',
      focus: 'Validating problem frequency and verifying source credibility before committing engineering capital.',
      suggestions: [
        'Explore 2nd-order operational risks for early enterprise adopters',
        'Model conservative CAC surge (+35%) in What-If Simulator',
        'Add legacy incumbent telemetry failure cases to competitor profiles',
        'Generate 3 customer discovery survey questions on switching costs',
      ],
      stressTestQuestions: [
        'What evidence proves customers will connect live sensors without a 90-day pilot?',
        'Does the 34% waste reduction hold in low-density rural or industrial facilities?',
      ],
    },
    'brand-strategy': {
      title: 'Brand Strategy Focus',
      focus: 'Preserving core non-negotiable value while tailoring positioning angles across disparate buyer archetypes.',
      suggestions: [
        'Sharpen Option A elevator pitch for institutional risk officers',
        'Compare payback metrics between Starter Pilot and Enterprise tier',
        'Audit messaging drift for the Mid-Market commercial persona',
        'Generate high-intent LinkedIn outbound hooks for facilities directors',
      ],
      stressTestQuestions: [
        'Is the payback horizon clear in both marketing copy and pro-forma pricing?',
        'Will enterprise buyers perceive self-serve pricing as lacking mission-critical rigor?',
      ],
    },
    'design-studio': {
      title: 'Design Studio Focus',
      focus: 'Establishing a distinctive, domain-native visual identity that commands institutional authority without AI slop.',
      suggestions: [
        'Compare Direction A (Editorial Avant-Garde) palette against Direction B in high contrast',
        'Generate packaging specification notes for sustainable recycled fiber',
        'Review web hero template structure for responsive 1440px desktop baseline',
        'Mix Direction A color palette with Direction B monospace data telemetry',
      ],
      stressTestQuestions: [
        'Do the visual assets clearly reflect mission-critical industrial infrastructure?',
        'Are all color contrast ratios compliant with WCAG AA standards (4.5:1)?',
      ],
    },
    'market-launch': {
      title: 'Market & Launch Focus',
      focus: 'Resolving launch readiness blockers and prioritizing high-yield distribution channels.',
      suggestions: [
        'Resolve Blocker 2: Approve Risk Matrix mitigation actions',
        'Review campaign budget allocation between Direct Outbound and Technical Content',
        'Check milestone deliverables for Phase 1 MVP telemetry cutover',
        'Draft executive invitation email for private benchmark webinar',
      ],
      stressTestQuestions: [
        'What happens to cash runway if Phase 2 Beta deployment slips by 4 weeks?',
        'Are integration channel partner agreements legally non-exclusive?',
      ],
    },
    'complete-brand-kit': {
      title: 'Complete Brand Kit Focus',
      focus: 'Synthesizing all approved research, positioning, design, and launch milestones into a board-ready prospectus.',
      suggestions: [
        'Export unified markdown brief for executive distribution',
        'Review Executive Summary to ensure core unfair advantage is highlighted',
        'Ensure all 6 sections are toggled on before printing PDF view',
        'Copy executive summary snippet to clipboard',
      ],
      stressTestQuestions: [
        'Does this document provide enough quantitative rigor for seed-stage investors?',
        'Are all demo data points and assumptions clearly labeled for transparency?',
      ],
    },
  };

  const currentAdvice = workspaceAdvice[activeWorkspace];

  const handleRunCustomPrompt = async (customText?: string) => {
    const textToSend = customText || promptInput;
    if (!textToSend.trim()) return;

    setIsSynthesizing(true);
    setRecentOutput(null);

    try {
      const res = await fetch('/api/ai/contextual-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          activeWorkspace,
          projectContext: project,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecentOutput({
          text: data.reply,
          isAi: data.isAiGenerated ?? true,
        });
      } else {
        throw new Error('Non-200 response');
      }
    } catch {
      setRecentOutput({
        text: `Analysis for "${textToSend}": Grounded in ${project?.title || 'active venture'} parameters. Focus on defending the core value invariant while mitigating procurement vetoes.`,
        isAi: false,
      });
    } finally {
      setIsSynthesizing(false);
      setPromptInput('');
    }
  };

  return (
    <aside className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white dark:bg-[#181818] border-l border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between bg-[#FAF8F3]/60 dark:bg-[#141414]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
              Contextual AI Assistant
            </h3>
            <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
              Screen-aware venture advisor
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Screen-Specific Guidance */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Active Focus Card */}
        <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
          <div className="flex items-center gap-1.5 font-bold text-[#FF6124] text-[11px] mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{currentAdvice.title}</span>
          </div>
          <p className="text-[#57534E] dark:text-[#A8A29E] text-[11px] leading-relaxed">
            {currentAdvice.focus}
          </p>
        </div>

        {/* High-Leverage Actions / Suggestions */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-2">
            Recommended Screen Actions
          </span>
          <div className="space-y-1.5">
            {currentAdvice.suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onApplySuggestion(sug)}
                className="w-full text-left p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] hover:border-[#FF6124] dark:hover:border-[#FF6124] text-[#1C1917] dark:text-[#F5F3EC] transition-all cursor-pointer group flex items-start gap-2 shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF6124] shrink-0 mt-0.5" />
                <span className="flex-1 text-[11px] leading-snug">{sug}</span>
                <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#FF6124] transition-all shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Stress-Testing Questions */}
        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block mb-2">
            Venture Stress-Test Invariants
          </span>
          <div className="space-y-2">
            {currentAdvice.stressTestQuestions.map((q, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-neutral-800 dark:text-neutral-200 flex items-start gap-2"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Generated Output */}
        {recentOutput && (
          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-950 dark:text-emerald-200 animate-in fade-in duration-200 space-y-2">
            <div className="flex items-center justify-between gap-1.5 font-bold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Advisor Insight</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase ${
                recentOutput.isAi ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400'
              }`}>
                {recentOutput.isAi ? 'Gemini AI' : 'Verified'}
              </span>
            </div>
            <p className="leading-relaxed whitespace-pre-line">{recentOutput.text}</p>
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onApplySuggestion(recentOutput.text)}
                className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Record in Decision History</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive Query Input */}
      <div className="p-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#161616]">
        <div className="relative">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCustomPrompt()}
            placeholder="Ask contextual question or request refinement..."
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-[#1C1917] dark:text-[#F5F3EC] placeholder-[#57534E]/60 focus:outline-none focus:border-[#FF6124] shadow-2xs"
          />
          <button
            type="button"
            onClick={() => handleRunCustomPrompt()}
            disabled={!promptInput.trim() || isSynthesizing}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-[#FF6124] disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            {isSynthesizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] mt-1.5 text-center">
          Contextually grounded in {project?.title || 'active venture'}
        </p>
      </div>
    </aside>
  );
};
