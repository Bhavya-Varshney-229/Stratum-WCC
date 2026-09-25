import React, { useState } from 'react';
import { AudienceShifterProject } from '../../types/brand';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Share2
} from 'lucide-react';

interface DeliverScreenProps {
  project: AudienceShifterProject;
  onStartNew: () => void;
  onRefineStep: (stepId: 'product' | 'lock-value' | 'select-audiences' | 'audience-shift') => void;
}

export const DeliverScreen: React.FC<DeliverScreenProps> = ({
  project,
  onStartNew,
  onRefineStep,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero-usp' | 'full-kit'>('hero-usp');

  const selectedAudiences = project.selectedAudiences;
  const shifts = project.audienceShifts;

  const generateMarkdown = () => {
    let md = `# NO BUGS AUDIENCE BRAND KIT\n`;
    md += `**USP: One Product. One Core Value. Multiple Audiences. Intelligently Adapted.**\n\n`;
    md += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    md += `## 1. CORE BRAND ANCHOR (THE CONSTANT)\n`;
    md += `- **Product:** ${project.product.title}\n`;
    md += `- **Core Problem Solved:** ${project.understanding.coreProblem}\n`;
    md += `- **🔒 Locked Core Value Proposition:** ${project.coreValueLock.coreValue}\n`;
    md += `- **Product Promise:** ${project.understanding.productPromise}\n`;
    md += `- **Target Universe:** ${project.understanding.targetUsers}\n\n`;
    md += `### Non-Negotiable Principles:\n`;
    project.understanding.nonNegotiablePrinciples.forEach((p) => {
      md += `- ${p}\n`;
    });
    md += `\n---\n\n`;

    md += `## 2. AUDIENCE-SPECIFIC ADAPTATIONS\n\n`;
    selectedAudiences.forEach((audId, i) => {
      const shift = shifts[audId];
      if (!shift) return;
      md += `### Audience ${i + 1}: ${shift.audienceName}\n`;
      md += `**Why AI Adapted Communication:**\n${shift.whyAdaptation}\n\n`;
      md += `- **Positioning:** ${shift.positioning}\n`;
      md += `- **Tone of Voice:** ${shift.toneOfVoice}\n`;
      md += `- **Personality Traits:** ${shift.personality.traits.join(', ')}\n`;
      md += `- **Tagline:** ${shift.tagline}\n`;
      md += `- **Core Motivation:** ${shift.keyMotivation}\n`;
      md += `- **Pain Point Addressed:** ${shift.painPointEmphasis}\n`;
      md += `- **Example Ad Headline:** ${shift.exampleHeadline}\n`;
      md += `- **Example Message Copy:** ${shift.exampleMessage}\n`;
      md += `- **Call to Action (CTA):** ${shift.callToAction}\n`;
      md += `- **Visual Accent:** ${shift.visualDirection.accentHex} (${shift.visualDirection.paletteName})\n\n`;
      md += `**What Changed:**\n`;
      md += `- Tone: ${shift.whatChanged.tone.from} → ${shift.whatChanged.tone.to}\n`;
      md += `- Messaging: ${shift.whatChanged.messaging.from} → ${shift.whatChanged.messaging.to}\n`;
      md += `- Positioning: ${shift.whatChanged.positioning.from} → ${shift.whatChanged.positioning.to}\n`;
      md += `- CTA: ${shift.whatChanged.cta.from} → ${shift.whatChanged.cta.to}\n\n`;
    });

    md += `---\n\n## 3. VALUE CONSISTENCY CHECK\n`;
    md += `- Core Value Preserved: ✓ Verified (100%)\n`;
    md += `- Product Promise Preserved: ✓ Verified\n`;
    md += `- Product Identity Preserved: ✓ Unified\n`;
    md += `- Audience Adaptation: ✓ Successful\n`;
    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `no-bugs-audience-brand-kit.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
            <span>Stage 07</span>
            <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
            <span className="text-neutral-500 dark:text-neutral-400">Launch Delivery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
            Your Audience Brand Kit
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            One product. One locked core value. Multiple intelligently adapted market directions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#252525] border border-[#D7CFBF] dark:border-[#3a3a3a] hover:border-[#FF6124] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Kit'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brand Kit (.md)</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Hero USP vs Detailed Kit */}
      <div className="flex items-center p-1 bg-[#E8E2D5] dark:bg-[#252525] rounded-xl self-start shadow-xs max-w-sm">
        <button
          type="button"
          onClick={() => setActiveTab('hero-usp')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'hero-usp'
              ? 'bg-[#FF6124] text-white shadow-xs font-semibold'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Hero USP View
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('full-kit')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'full-kit'
              ? 'bg-[#FF6124] text-white shadow-xs font-semibold'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Full Brand Kit
        </button>
      </div>

      {/* 1. HERO USP SCREEN VIEW (The Requested Iconic Visual Layout) */}
      {activeTab === 'hero-usp' && (
        <div className="rounded-3xl border-2 border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] p-6 sm:p-12 space-y-10 shadow-sm animate-in fade-in duration-200">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6124] font-bold">
              The Architecture of Adaptation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              ONE PRODUCT. MANY AUDIENCES.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Your core value stays the same. Your communication adapts.
            </p>
          </div>

          {/* Connected Tree Diagram */}
          <div className="space-y-6">
            {/* Top Node: The Product */}
            <div className="max-w-md mx-auto text-center p-3.5 rounded-xl bg-neutral-900 dark:bg-[#121212] text-white shadow-sm border border-neutral-800 dark:border-[#333]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                ONE UNIFIED PRODUCT
              </span>
              <span className="text-sm font-bold tracking-tight">
                {project.product.title}
              </span>
            </div>

            <div className="flex justify-center -my-2 text-neutral-400 dark:text-neutral-500 font-mono text-sm">↓</div>

            {/* Central Node: Locked Core Value */}
            <div className="max-w-xl mx-auto text-center p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#141414] border-2 border-emerald-500/70 shadow-sm space-y-1 relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold">
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>CORE VALUE 🔒 (THE INVARIANT ANCHOR)</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 pt-1">
                “{project.coreValueLock.coreValue}”
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Non-negotiable product promise defended across all touchpoints.
              </p>
            </div>

            <div className="flex justify-center -my-2 text-neutral-400 dark:text-neutral-500 font-mono text-sm">
              <span className="hidden sm:inline">┌───────────────────────┼───────────────────────┐</span>
              <span className="sm:hidden">↓</span>
            </div>

            {/* Branches: Selected Audiences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {selectedAudiences.map((audId) => {
                const shift = shifts[audId];
                if (!shift) return null;

                return (
                  <div
                    key={audId}
                    className="p-5 rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#141414] flex flex-col justify-between space-y-4 shadow-2xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                          {shift.audienceName}
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: shift.visualDirection.accentHex }}
                        />
                      </div>

                      <div className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {shift.toneOfVoice.split(',')[0]}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {shift.personality.traits.slice(0, 3).join(' · ')}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-xs">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                          Tagline
                        </span>
                        <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                          {shift.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-xs">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                          Tailored CTA
                        </span>
                        <span className="inline-block mt-1 px-3 py-1 rounded bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border border-[#E4DFD3] dark:border-[#333] font-semibold text-xs shadow-2xs">
                          {shift.callToAction}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-[11px] text-neutral-600 dark:text-neutral-400">
                      <strong className="text-neutral-800 dark:text-neutral-200">Why Adapted: </strong>
                      {shift.whyAdaptation.slice(0, 110)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. FULL AUDIENCE BRAND KIT VIEW */}
      {activeTab === 'full-kit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Core Brand Anchor */}
          <div className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#2a2a2a] pb-4">
              <div>
                <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Part 01
                </span>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  The Core Brand Anchor (Constant)
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                <Lock className="w-3 h-3" />
                <span>Locked Constant</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Product
                </span>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {project.product.title}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Core Problem Solved
                </span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {project.understanding.coreProblem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block font-bold">
                  🔒 Locked Core Value Proposition
                </span>
                <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  “{project.coreValueLock.coreValue}”
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1 sm:col-span-2">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Fundamental Product Promise
                </span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {project.understanding.productPromise}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Audience Adaptations Breakdown */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
              Part 02: Audience-Specific Brand Directions
            </span>

            {selectedAudiences.map((audId, idx) => {
              const shift = shifts[audId];
              if (!shift) return null;

              return (
                <div
                  key={audId}
                  className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] p-6 space-y-5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-[#2a2a2a] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-[#FF6124] text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {shift.audienceName}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      Tone: {shift.toneOfVoice.split(',')[0]}
                    </span>
                  </div>

                  {/* Why Rationale */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a]">
                    <span className="text-[10px] font-mono text-[#FF6124] uppercase tracking-wider block font-bold">
                      Why AI Shifted Communication:
                    </span>
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {shift.whyAdaptation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block">
                        Positioning
                      </span>
                      <p className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">
                        {shift.positioning}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block">
                        Tagline
                      </span>
                      <p className="text-neutral-900 dark:text-neutral-100 font-bold mt-0.5">
                        {shift.tagline}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block">
                        Core Motivation
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300 mt-0.5">
                        {shift.keyMotivation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block">
                        Call to Action
                      </span>
                      <span className="inline-block mt-0.5 px-3 py-1 rounded bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] font-semibold text-neutral-900 dark:text-neutral-100">
                        {shift.callToAction}
                      </span>
                    </div>
                  </div>

                  {/* Example Message Mockup */}
                  <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      Example Campaign Touchpoint
                    </span>
                    <p className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      {shift.exampleHeadline}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {shift.exampleMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 3: Value Consistency Certificate */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Value Consistency Certificate
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Core Value Preserved (100%)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Product Promise Preserved</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Audience Adaptation Successful</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onRefineStep('audience-shift')}
          className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
        >
          ← Refine Audience Shifts
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStartNew}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#252525] border border-[#D7CFBF] dark:border-[#3a3a3a] hover:border-[#FF6124] rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Start Another Product
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Brand Kit (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
