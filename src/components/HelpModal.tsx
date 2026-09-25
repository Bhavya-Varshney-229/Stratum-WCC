import React from 'react';
import { X, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="framework-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-[#E4DFD3]/50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
            <span>The Core Differentiator</span>
          </div>
          <h2 id="framework-title" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            One Product. One Core Value. Intelligently Adapted.
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Why Stratum is a synchronized brand intelligence system, not another generic brand name generator.
          </p>
        </div>

        {/* Visual Diagram Box */}
        <div className="p-4 rounded-xl bg-neutral-900 text-white font-mono text-[11px] leading-relaxed space-y-2 border border-neutral-800 shadow-inner">
          <div className="text-center text-[#FF6124] font-bold">ONE PRODUCT</div>
          <div className="text-center text-neutral-500">↓</div>
          <div className="text-center text-emerald-400 font-bold flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 inline stroke-[2.5]" />
            <span>CORE VALUE LOCKED</span>
          </div>
          <div className="text-center text-neutral-500">↓</div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-neutral-800">
            <div className="space-y-1">
              <span className="text-white font-bold block text-xs">STUDENTS</span>
              <span className="text-neutral-400 block text-[10px]">Friendly · Casual</span>
              <span className="text-[#FF6124] block font-semibold text-[10px]">Empowering Autonomy</span>
            </div>
            <div className="space-y-1 border-x border-neutral-800 px-1">
              <span className="text-white font-bold block text-xs">PARENTS</span>
              <span className="text-neutral-400 block text-[10px]">Trustworthy · Safe</span>
              <span className="text-emerald-400 block font-semibold text-[10px]">Habits & Security</span>
            </div>
            <div className="space-y-1">
              <span className="text-white font-bold block text-xs">INSTITUTIONS</span>
              <span className="text-neutral-400 block text-[10px]">Professional · Data</span>
              <span className="text-indigo-400 block font-semibold text-[10px]">Student Retention</span>
            </div>
          </div>
        </div>

        {/* 3 Core Rules */}
        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">1. The Unbreakable Core Value Anchor</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                Your core product purpose never mutates. It stays firmly anchored while your voice, angles, and triggers flex.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <CheckCircle2 className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">2. Intelligent Audience Calibration</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                Instead of making 3 disconnected companies, Stratum equips one brand to speak 3 native languages to 3 distinct stakeholders.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a]">
            <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              !
            </span>
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">3. Automated Value Drift Detection</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                If an audience adaptation drifts into altering the fundamental product promise, our anti-drift engine flags it immediately for correction.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
          >
            Got it, Let's Build
          </button>
        </div>
      </div>
    </div>
  );
};
