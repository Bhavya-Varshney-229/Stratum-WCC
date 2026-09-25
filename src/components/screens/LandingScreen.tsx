import React, { useState } from 'react';
import { ProductIdea } from '../../types/brand';
import { PRESET_IDEAS } from '../../services/brandGenerator';
import {
  ArrowRight,
  Lock,
  ChevronRight,
  ShieldCheck,
  Users,
  Briefcase,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Compass,
  Target,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingScreenProps {
  onStart: () => void;
  onSelectPreset: (preset: ProductIdea) => void;
  onGoToDashboard?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStart,
  onSelectPreset,
  onGoToDashboard,
}) => {
  const { isAuthenticated, user, openAuthModal, signInWithGoogle, signInWithGitHub } = useAuth();
  const [activeDemoAudience, setActiveDemoAudience] = useState<'students' | 'parents' | 'institutions'>('students');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const demoAudiences = {
    students: {
      label: 'College Students',
      icon: Users,
      tone: 'Friendly & Casual',
      tagline: '“Money doesn’t have to be a mystery.”',
      pitch: 'Track your rent, split groceries with roommates, and never stress about $35 overdraft fees while you study.',
      cta: 'Start Managing Money Free',
      accentColor: 'text-[#FF6124]',
      badgeBg: 'bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] border-[#FF6124]/20'
    },
    parents: {
      label: 'Parents & Guardians',
      icon: ShieldCheck,
      tone: 'Trustworthy & Reassuring',
      tagline: '“Give your college student lifelong financial confidence.”',
      pitch: 'Provide safe allowance rails and gentle guidance without intrusive surveillance or surprise phone calls.',
      cta: 'Help Your Child Build Better Financial Habits',
      accentColor: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70'
    },
    institutions: {
      label: 'Universities & Higher-Ed',
      icon: Briefcase,
      tone: 'Professional & Data-driven',
      tagline: '“Empower student retention through financial literacy.”',
      pitch: 'Deploy verified financial guidance campus-wide. Real-time cohort data identifies student stress before dropouts occur.',
      cta: 'Request Campus Partnership Brief',
      accentColor: 'text-indigo-700 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/70'
    }
  };

  const activeDemo = demoAudiences[activeDemoAudience];

  const faqs = [
    {
      question: 'What makes NO BUGS different from standard AI brand generators?',
      answer:
        'Standard AI tools simply generate multiple disconnected, random brands or generic logos. NO BUGS is an Audience Shifter: it takes your singular product and extracts ONE immutable Core Value Proposition (which is locked). It then maps how that exact same core promise expresses itself to completely different stakeholders—calibrating vocabulary, tone, value drivers, and visual cues without ever altering what your product actually is.'
    },
    {
      question: 'What is a "Locked Core Value" and why is it non-negotiable?',
      answer:
        'A Locked Core Value is the irreducible essence of why your product exists (e.g., "Help students understand and manage their money easily"). In traditional marketing, companies often invent separate, conflicting promises for investors, consumers, and partners, resulting in a fractured brand identity. In NO BUGS, the core value is explicitly locked: every audience angle must branch directly from this single anchor.'
    },
    {
      question: 'How does the Anti-Drift Engine prevent message dilution?',
      answer:
        'During generation, our consistency engine continuously verifies each audience’s tagline, messaging, and positioning against your locked core value. It scores alignment on a 100-point scale, flags any hallucinated feature additions or contradictory promises, and verifies that the underlying product remains 100% faithful across all segments.'
    },
    {
      question: 'Can I define custom target audiences or use this for B2B enterprise sales?',
      answer:
        'Yes. While NO BUGS suggests high-converting primary, secondary, and tertiary audiences based on your product concept, you can adjust and customize audience archetypes (such as IT Security Officers, End Users, CFOs, or Procurement Teams) to test how your single product communicates across intricate enterprise buying committees.'
    },
    {
      question: 'What deliverables are included in the final export?',
      answer:
        'You receive a comprehensive Multi-Audience Strategy Kit containing: Executive Summary, Locked Core Anchor, Segmented Value Matrices (taglines, resonance hooks, tone guidelines, color palettes, typography, and tailored CTAs for each audience), Anti-Drift Consistency Audit, and an Implementation Playbook. You can export everything as Markdown or JSON.'
    },
    {
      question: 'Does NO BUGS change my actual product features?',
      answer:
        'Never. NO BUGS operates on communication, positioning, and stakeholder psychology. Your product features, codebase, and core utility remain identical. NO BUGS simply solves the multi-stakeholder communication puzzle: showing how the same capabilities solve the specific anxieties of each audience.'
    },
    {
      question: 'Who is NO BUGS built for?',
      answer:
        'NO BUGS is built for startup founders, product marketers (PMMs), growth strategists, agency leaders, and product managers who need to sell a single technical or consumer solution to multi-faceted buyer journeys (e.g., users vs. decision-makers vs. channel partners).'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Statement & USP Anchor */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 space-y-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] dark:bg-[#222] border border-[#D7CFBF] dark:border-[#333] text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <span className="w-2 h-2 rounded-full bg-[#FF6124] animate-pulse" />
          <span>The AI-Powered Audience Shifter</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.12]">
          ONE PRODUCT.{' '}
          <span className="text-[#FF6124] block sm:inline">ONE CORE VALUE.</span>
          <br className="hidden sm:inline" />
          {' '}MULTIPLE AUDIENCES.
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Stop generating random logos or conflicting company personas. NO BUGS locks your product’s{' '}
          <strong className="text-neutral-900 dark:text-white font-semibold">uncompromising core value</strong>, then intelligently adapts positioning, tone, and messaging for every stakeholder.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
          >
            <span>Start</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-[#EAE5D9]/70 dark:bg-[#1f1f1f] hover:bg-[#EAE5D9] dark:hover:bg-[#282828] border border-[#D7CFBF] dark:border-[#333] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>See How It Works</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Social Connect Strip */}
        {!isAuthenticated ? (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Or connect your workspace:</span>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#D8D2C5] dark:border-[#333] hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-800 dark:text-neutral-200 font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Connect with Google</span>
            </button>

            <button
              type="button"
              onClick={signInWithGitHub}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-[#252525] hover:bg-neutral-800 dark:hover:bg-[#303030] text-white font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer border border-transparent dark:border-[#383838]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Connect with GitHub</span>
            </button>
          </div>
        ) : (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Logged in as <strong className="text-neutral-900 dark:text-white">{user?.name}</strong></span>
            </div>
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="px-3 py-1 rounded-lg bg-[#FF6124]/15 hover:bg-[#FF6124]/25 text-[#FF6124] font-bold border border-[#FF6124]/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Proof & Metrics Strip */}
        <div className="pt-8 border-t border-[#E4DFD3] dark:border-[#2a2a2a] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-white/70 dark:bg-[#1c1c1c] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-50 block tracking-tight">100%</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Core Value Integrity</span>
          </div>
          <div className="p-3 bg-white/70 dark:bg-[#1c1c1c] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <span className="text-xl sm:text-2xl font-black text-[#FF6124] block tracking-tight">3+ Segments</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Simultaneous Stakeholders</span>
          </div>
          <div className="p-3 bg-white/70 dark:bg-[#1c1c1c] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-50 block tracking-tight">0% Drift</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">No Hallucinated Features</span>
          </div>
          <div className="p-3 bg-white/70 dark:bg-[#1c1c1c] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">Instant</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Markdown & JSON Kits</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Interactive Architecture Diagram (The Core Differentiator) */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#181818] p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
            <div>
              <span className="text-xs font-semibold text-[#FF6124] uppercase tracking-wider block">
                The Fundamental Differentiator
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-0.5">
                How the Same Product Communicates to Different Stakeholders
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#222] px-2.5 py-1 rounded-md border border-[#E4DFD3] dark:border-[#333] self-start">
              Live Concept Architecture
            </span>
          </div>

          {/* Visual Architecture Tree */}
          <div className="space-y-6">
            {/* Level 1: One Product */}
            <div className="max-w-md mx-auto text-center p-3.5 rounded-xl bg-neutral-900 dark:bg-[#121212] border border-neutral-800 dark:border-neutral-700 text-white shadow-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block tracking-wider font-semibold">
                The Product (Constant)
              </span>
              <span className="text-sm font-bold tracking-tight text-neutral-100">
                AI Student Financial Management App
              </span>
            </div>

            <div className="flex justify-center -my-2 text-neutral-400 dark:text-neutral-500 font-mono text-sm">↓</div>

            {/* Level 2: Locked Core Value */}
            <div className="max-w-lg mx-auto text-center p-4 rounded-xl bg-white dark:bg-[#1f1f1f] border-2 border-emerald-600/70 dark:border-emerald-500/70 shadow-sm space-y-1 relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold">
                <Lock className="w-3 h-3 stroke-[2.5]" />
                <span>CORE VALUE 🔒 (NON-NEGOTIABLE ANCHOR)</span>
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                “Help students understand and manage their money easily.”
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                This stays completely identical across every single audience.
              </p>
            </div>

            <div className="flex justify-center -my-2 text-neutral-400 dark:text-neutral-500 font-mono text-sm">↓</div>

            {/* Level 3: Three Audiences Tree */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['students', 'parents', 'institutions'] as const).map((key) => {
                const aud = demoAudiences[key];
                const isSelected = activeDemoAudience === key;
                const Icon = aud.icon;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveDemoAudience(key)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#FF6124] bg-white dark:bg-[#222222] ring-2 ring-[#FF6124]/30 shadow-sm'
                        : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-white/70 dark:bg-[#1b1b1b] hover:bg-white dark:hover:bg-[#222222] hover:border-[#D7CFBF] dark:hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                        {aud.label}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${aud.badgeBg}`}>
                        {aud.tone}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {aud.tagline}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
                      <span>Click to inspect shift</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-[#FF6124]' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Level 4: Live Adaptive Output Preview for Selected Audience */}
            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-4 shadow-xs animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Adapted Communication For:
                  </span>
                  <span className="text-xs font-bold text-[#FF6124]">
                    {activeDemo.label}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  Tone: {activeDemo.tone}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Audience Tagline
                  </span>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    {activeDemo.tagline}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Resonant Value Angle
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeDemo.pitch}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    Tailored Call to Action:
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold self-start sm:self-auto">
                    {activeDemo.cta}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Comparison: Generic AI vs. NO BUGS Audience Shifter */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF6124] font-semibold">
            Strategic Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Why Audience Shifting Beats Generic AI Branding
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            A brand is not a logo roulette. It is a coherent promise adapted for different minds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generic AI Generators */}
          <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Traditional AI Brand Generators</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Generates 5 disconnected company identities that dilute focus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Hallucinates new product features for each audience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Creates split personalities between B2C users and B2B buyers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Leaves teams confused on what their product actually promises.</span>
              </li>
            </ul>
          </div>

          {/* NO BUGS Audience Shifter */}
          <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">NO BUGS Audience Shifter</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Locks ONE immutable core value anchor that never changes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Adapts tone, terminology, and visual cues to match audience psychology.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Real-time Anti-Drift Engine audits for 100% brand consistency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Delivers cohesive, export-ready brand kits ready for go-to-market.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Preset Starters for Rapid Testing */}
      <section id="benchmarks" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6124] font-semibold">
              Live Benchmarks
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Ready-to-Test Product Ideas
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Click any benchmark idea below to observe how the locked core value shifts across audiences.
            </p>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            3 Tested Multi-Stakeholder Verticals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_IDEAS.map((preset, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] flex flex-col justify-between space-y-4 shadow-xs hover:border-[#FF6124]/60 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#FF6124] uppercase tracking-wider font-semibold">
                    {preset.category}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">3 Audiences</span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {preset.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                  {preset.idea}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelectPreset({
                    title: preset.title,
                    rawIdea: preset.idea,
                    industry: preset.category
                  })
                }
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-neutral-900 dark:text-neutral-100 bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#FF6124] dark:hover:bg-[#FF6124] hover:text-white dark:hover:text-white border border-[#E4DFD3] dark:border-[#333] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Test This Idea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT US SECTION */}
      <section id="about-us" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#181818] p-8 sm:p-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6124] font-semibold">
              About Us · The Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
              One Unwavering Soul. Infinite Expressive Nuance.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We built NO BUGS because we witnessed hundreds of great products fail at the exact same hurdle: talking to multiple stakeholders. When pitching users, they sounded fun. When pitching buyers, they sounded corporate. When pitching partners, they sounded like a different company altogether.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">The Invariant Anchor</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Great brands do not chameleon their essence. A company’s core purpose must remain identical whether speaking to an intern, a CFO, or an institutional registrar. We lock that essence first.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Audience Semantics</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Each audience lives with different daily anxieties, metrics of success, and vocabularies. Our engine translates the locked core value into the exact emotional register that sparks immediate resonance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">The Anti-Drift Guardrail</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Most AI tools invent wild features as they try to please everyone. Our algorithmic consistency validator guarantees that every tag, headline, and color is bound to your locked foundation.
              </p>
            </div>
          </div>

          {/* Founder Quote Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 italic">
                “Your product has one reason to exist. Your audience has a dozen reasons to care. NO BUGS is the bridge between the two.”
              </p>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono block">
                The NO BUGS Brand Intelligence Collective
              </span>
            </div>
            <button
              type="button"
              onClick={onStart}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF6124] font-semibold">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
            Everything you need to know about the Audience Shifter framework, locked core values, and anti-drift validation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F3]/70 dark:hover:bg-[#252525] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#FF6124] text-white border-transparent' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-[#F1EEE4] dark:border-[#2a2a2a] animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-neutral-900 dark:bg-[#161616] border border-transparent dark:border-[#2a2a2a] text-white text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6124]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6124] font-semibold">
              Ready to Launch
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-50">
              One Product. Multiple Audiences. Intelligently Adapted.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-300 leading-relaxed">
              Input your idea once. Lock your foundational promise. Generate audience-calibrated brand systems in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              type="button"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Start</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-neutral-900 dark:text-white bg-white dark:bg-[#252525] hover:bg-neutral-100 dark:hover:bg-[#2f2f2f] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-transparent dark:border-[#383838]"
              >
                <span>Create Free Account</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 8. Proper Website Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-neutral-500 dark:text-neutral-400 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[#FF6124] rounded-md flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-xs">
                NB
              </span>
              <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                NO BUGS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EAE5D9] dark:bg-[#262626] text-neutral-700 dark:text-neutral-300 font-semibold border border-[#D7CFBF] dark:border-[#333]">
                Audience Shifter
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              The AI-powered brand intelligence system that helps you communicate the same product across different target audiences while preserving your locked core value proposition.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider font-mono">
              Explore
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('benchmarks')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Benchmark Ideas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('about-us')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              {!isAuthenticated ? (
                <>
                  <li className="pt-1 border-t border-[#E4DFD3]/60 dark:border-[#2a2a2a]">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="text-[#FF6124] font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signup')}
                      className="text-neutral-800 dark:text-neutral-200 font-semibold hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          {/* Framework Principles */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider font-mono">
              Framework
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Locked Core Value</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Target className="w-3 h-3 text-[#FF6124]" />
                <span>Audience Shift Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Zero Drift Audit</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
                <span>Unified Delivery Kit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} NO BUGS Brand Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with Deterministic Anti-Drift Guardrails</span>
            <span>·</span>
            <span>Theme #FF6124 & Obsidian Dark</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
