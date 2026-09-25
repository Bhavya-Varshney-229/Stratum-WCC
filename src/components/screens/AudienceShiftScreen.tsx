import React, { useState } from 'react';
import {
  AudienceBrandShift,
  ProductUnderstanding,
  ProductIdea,
  CoreValueLock
} from '../../types/brand';
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  LayoutGrid,
  Columns3,
  Sliders,
  ChevronDown,
  ChevronUp,
  Tag,
  MessageSquare,
  Flame,
  ShieldCheck,
  GraduationCap,
  Building2,
  Briefcase,
  Users
} from 'lucide-react';

interface AudienceShiftScreenProps {
  product: ProductIdea;
  understanding: ProductUnderstanding;
  coreValueLock: CoreValueLock;
  selectedAudiences: string[];
  audienceShifts: Record<string, AudienceBrandShift>;
  onNext: () => void;
  onBack: () => void;
}

export const AudienceShiftScreen: React.FC<AudienceShiftScreenProps> = ({
  product,
  understanding,
  coreValueLock,
  selectedAudiences,
  audienceShifts,
  onNext,
  onBack,
}) => {
  const [activeAudienceId, setActiveAudienceId] = useState<string>(
    selectedAudiences[0] || 'students'
  );
  const [viewMode, setViewMode] = useState<'switcher' | 'comparison'>('switcher');
  const [showFullWhatChanged, setShowFullWhatChanged] = useState<boolean>(true);

  const activeShift = audienceShifts[activeAudienceId] || Object.values(audienceShifts)[0];

  const getAudienceIcon = (id: string) => {
    if (id.includes('student')) return GraduationCap;
    if (id.includes('parent')) return ShieldCheck;
    if (id.includes('institution') || id.includes('school')) return Building2;
    if (id.includes('enterprise')) return Briefcase;
    return Users;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 05</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">Intelligent Audience Shifter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          Adapted Brand Communications
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          The underlying product and core value remain strictly fixed, while messaging, tone, and positioning adapt to each audience.
        </p>
      </div>

      {/* 1. FIXED CORE ANCHOR BAR (The Constant) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 dark:bg-[#121212] text-white shadow-sm border border-neutral-800 dark:border-[#262626] space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 dark:border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 stroke-[2.5]" />
              THE NON-NEGOTIABLE ANCHOR (UNCHANGED ACROSS AUDIENCES)
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            Invariant Core
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              🔒 Constant Product
            </span>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {product.title || 'AI Student Financial Companion'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
              🔒 Locked Core Value Proposition
            </span>
            <p className="text-xs sm:text-sm font-semibold text-neutral-100 mt-0.5">
              “{coreValueLock.coreValue}”
            </p>
          </div>
        </div>
      </div>

      {/* 2. Mode Controls: Switcher vs Comparison */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-[#E8E2D5] dark:bg-[#252525] rounded-xl self-start shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('switcher')}
            className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'switcher'
                ? 'bg-[#FF6124] text-white shadow-xs font-semibold'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Audience Switcher (Deep Dive)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('comparison')}
            className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-[#FF6124] text-white shadow-xs font-semibold'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison Matrix</span>
          </button>
        </div>

        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          {selectedAudiences.length} Target Segments Loaded
        </span>
      </div>

      {/* VIEW MODE A: AUDIENCE SWITCHER */}
      {viewMode === 'switcher' && activeShift && (
        <div className="space-y-6">
          {/* Prominent Audience Switcher Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider block">
              Active Audience Filter:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAudiences.map((audId) => {
                const shift = audienceShifts[audId];
                if (!shift) return null;
                const isSelected = activeAudienceId === audId;
                const Icon = getAudienceIcon(audId);

                return (
                  <button
                    key={audId}
                    type="button"
                    onClick={() => setActiveAudienceId(audId)}
                    className={`px-4 py-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-white dark:bg-[#1f1f1f] border-[#FF6124] ring-2 ring-[#FF6124]/30'
                        : 'bg-[#FAF8F3] dark:bg-[#181818] border-[#E4DFD3] dark:border-[#2f2f2f] hover:bg-white dark:hover:bg-[#202020] text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF6124]' : 'text-neutral-500 dark:text-neutral-400'}`} />
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-neutral-950 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        {shift.audienceName}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {shift.toneOfVoice.split(',')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. “WHAT CHANGED?” TRANSPARENCY CARD */}
          <div className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#2a2a2a] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF6124]" />
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  What Changed for {activeShift.audienceName}?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFullWhatChanged(!showFullWhatChanged)}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>{showFullWhatChanged ? 'Collapse Rationale' : 'Expand Rationale'}</span>
                {showFullWhatChanged ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Why Adaptation Statement */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#FF6124] font-bold block">
                Strategic Rationale (Why AI Shifted Communication):
              </span>
              <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                {activeShift.whyAdaptation}
              </p>
            </div>

            {/* Shift Diff Matrix */}
            {showFullWhatChanged && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 animate-in fade-in duration-150">
                <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-semibold">
                    1. Tone Calibration
                  </span>
                  <div className="text-xs">
                    <span className="text-neutral-400 dark:text-neutral-500 line-through block text-[11px]">
                      {activeShift.whatChanged.tone.from}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold block">
                      → {activeShift.whatChanged.tone.to}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
                    {activeShift.whatChanged.tone.explanation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-semibold">
                    2. Messaging Focus
                  </span>
                  <div className="text-xs">
                    <span className="text-neutral-400 dark:text-neutral-500 line-through block text-[11px] truncate">
                      {activeShift.whatChanged.messaging.from}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold block truncate">
                      → {activeShift.whatChanged.messaging.to}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
                    {activeShift.whatChanged.messaging.explanation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-semibold">
                    3. Positioning Wedge
                  </span>
                  <div className="text-xs">
                    <span className="text-neutral-400 dark:text-neutral-500 line-through block text-[11px] truncate">
                      {activeShift.whatChanged.positioning.from}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold block truncate">
                      → {activeShift.whatChanged.positioning.to}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
                    {activeShift.whatChanged.positioning.explanation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-semibold">
                    4. Call to Action (CTA)
                  </span>
                  <div className="text-xs">
                    <span className="text-neutral-400 dark:text-neutral-500 line-through block text-[11px]">
                      {activeShift.whatChanged.cta.from}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold block">
                      → “{activeShift.whatChanged.cta.to}”
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
                    {activeShift.whatChanged.cta.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. THE LIVE ADAPTED BRAND SHOWCASE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1 & 2: Main Copy & Positioning */}
            <div className="md:col-span-2 space-y-4">
              {/* Tagline & Elevator Pitch */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Audience Specific Tagline
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] text-neutral-700 dark:text-neutral-300">
                    {activeShift.audienceName}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {activeShift.tagline}
                </h2>

                <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-[#2a2a2a]">
                  <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Positioning Statement
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                    {activeShift.positioning}
                  </p>
                </div>
              </div>

              {/* Live Ad / Hero Copy Mockup */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF6124]" />
                    Example Communication Mockup
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                    Front-Facing Touchpoint
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-3">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                    {activeShift.exampleHeadline}
                  </h3>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeShift.exampleMessage}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 rounded-lg bg-[#FF6124] text-white text-xs font-semibold shadow-xs">
                      {activeShift.callToAction}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Personality, Motivation & Visual Mood */}
            <div className="space-y-4">
              {/* Personality & Tone */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-3 shadow-xs">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
                  Tone of Voice
                </span>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {activeShift.toneOfVoice}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-[#2a2a2a]">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Personality Traits
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeShift.personality.traits.map((trait, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] text-neutral-800 dark:text-neutral-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Motivation & Friction */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-semibold">
                    Key Audience Motivation
                  </span>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">
                    {activeShift.keyMotivation}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-[#2a2a2a]">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-semibold">
                    Pain Point Emphasized
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {activeShift.painPointEmphasis}
                  </p>
                </div>
              </div>

              {/* Visual Accent */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-semibold">
                  Visual Accent & Mood
                </span>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg shadow-xs border border-neutral-200 dark:border-neutral-700"
                    style={{ backgroundColor: activeShift.visualDirection.accentHex }}
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                      {activeShift.visualDirection.paletteName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                      {activeShift.visualDirection.accentHex}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal pt-1">
                  {activeShift.visualDirection.mood}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE B: SIDE-BY-SIDE MATRIX COMPARISON */}
      {viewMode === 'comparison' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
              Multi-Audience Cross-Comparison
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300">
              Review how the exact same product is presented to each distinct market group side-by-side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedAudiences.map((audId) => {
              const shift = audienceShifts[audId];
              if (!shift) return null;
              const Icon = getAudienceIcon(audId);

              return (
                <div
                  key={audId}
                  className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] p-5 space-y-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-[#2a2a2a] pb-3">
                      <div className="p-1.5 rounded bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333]">
                        <Icon className="w-4 h-4 text-[#FF6124]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {shift.audienceName}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                          Tone: {shift.toneOfVoice.split(',')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                        Tagline
                      </span>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                        {shift.tagline}
                      </p>
                    </div>

                    {/* Main Need */}
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                        Core Motivation
                      </span>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                        {shift.keyMotivation}
                      </p>
                    </div>

                    {/* Personality */}
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                        Personality
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {shift.personality.traits.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded text-neutral-700 dark:text-neutral-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                        Tailored CTA
                      </span>
                      <span className="inline-block mt-1 px-3 py-1 rounded bg-[#FAF8F3] dark:bg-[#252525] text-neutral-900 dark:text-neutral-100 border border-[#E4DFD3] dark:border-[#333] text-xs font-semibold">
                        {shift.callToAction}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-[#2a2a2a] text-[11px] text-neutral-500 dark:text-neutral-400">
                    <strong className="text-neutral-700 dark:text-neutral-300">Why: </strong>
                    {shift.whyAdaptation.slice(0, 100)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Audiences</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
        >
          <span>Run Consistency & Drift Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
