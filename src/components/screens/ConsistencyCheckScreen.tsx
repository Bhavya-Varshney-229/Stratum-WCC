import React, { useState } from 'react';
import {
  ConsistencyVerification,
  ProductUnderstanding,
  CoreValueLock,
  AudienceBrandShift
} from '../../types/brand';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

interface ConsistencyCheckScreenProps {
  understanding: ProductUnderstanding;
  coreValueLock: CoreValueLock;
  consistency: ConsistencyVerification;
  audienceShifts: Record<string, AudienceBrandShift>;
  onToggleSimulateDrift: () => void;
  isDriftSimulated: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const ConsistencyCheckScreen: React.FC<ConsistencyCheckScreenProps> = ({
  understanding,
  coreValueLock,
  consistency,
  audienceShifts,
  onToggleSimulateDrift,
  isDriftSimulated,
  onNext,
  onBack,
}) => {
  const [fixedNotice, setFixedNotice] = useState(false);

  const handleFixDrift = () => {
    if (isDriftSimulated) {
      onToggleSimulateDrift(); // restore to clean
      setFixedNotice(true);
      setTimeout(() => setFixedNotice(false), 2500);
    }
  };

  const checks = [
    {
      label: 'Core Problem Preserved',
      desc: 'The fundamental pain point remains intact across all versions.',
      passed: consistency.coreProblemPreserved,
    },
    {
      label: 'Locked Core Value Preserved',
      desc: `“${coreValueLock.coreValue}” is defended as the universal truth.`,
      passed: consistency.coreValuePreserved,
    },
    {
      label: 'Product Promise Preserved',
      desc: 'No audience variant promises features outside the product scope.',
      passed: consistency.productPromisePreserved,
    },
    {
      label: 'Product Identity Preserved',
      desc: 'Remains recognizably ONE unified company, not 3 separate startups.',
      passed: consistency.productIdentityPreserved,
    },
    {
      label: 'Audience Messaging Adapted',
      desc: 'Each audience receives genuinely tailored benefits and vocabulary.',
      passed: consistency.audienceMessagingAdapted,
    },
    {
      label: 'Tone Adapted Appropriately',
      desc: 'Formality and cadence mirror the recipient expectations.',
      passed: consistency.toneAdaptedAppropriately,
    },
    {
      label: 'Positioning Adapted Appropriately',
      desc: 'Category wedges are differentiated without breaking foundational promises.',
      passed: consistency.positioningAdaptedAppropriately,
    },
  ];

  const hasDrift = consistency.valueDriftAlerts.some((a) => a.hasDrift);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 06</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">Core Value Protection Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          Consistency & Anti-Drift Check
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          NO BUGS runs automated consistency checks to guarantee that tailored audience messaging never dilutes your original product promise.
        </p>
      </div>

      {/* Interactive Drift Demonstration Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#FF6124]" />
            Test the AI Anti-Drift Engine:
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Simulate what happens when an audience variation drifts from the core promise.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSimulateDrift}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            isDriftSimulated
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800'
              : 'bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#EAE5D9] dark:hover:bg-[#303030] text-neutral-800 dark:text-neutral-200 border border-[#E4DFD3] dark:border-[#333]'
          }`}
        >
          {isDriftSimulated ? '✓ Clear Simulated Drift' : '⚠ Simulate Value Drift'}
        </button>
      </div>

      {/* VALUE DRIFT ALERT BOX (If Drift Detected) */}
      {hasDrift && (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-600 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 stroke-[2.5]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              Value Drift Detected
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
            “The Enterprise version has changed the original product promise into an algorithmic corporate treasury optimization desk instead of simply adapting its communication.”
          </p>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/90 border border-amber-200 dark:border-amber-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block">
              Suggested AI Remediation:
            </span>
            <p className="text-xs text-neutral-800 dark:text-neutral-200">
              Re-anchor the Enterprise messaging to campus student employment wellness and parental reimbursement rails, preserving the core promise of student financial empowerment.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={handleFixDrift}
              className="px-4 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-align with Core Value Anchor</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notice if Remediation Clicked */}
      {fixedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span className="font-semibold">
            Enterprise messaging re-anchored to locked core value! 100% Consistency Restored.
          </span>
        </div>
      )}

      {/* 7 Verification Checks Grid */}
      <div className="rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#2a2a2a] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Audit Matrix (7 Dimensions)
            </span>
          </div>
          <span
            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              consistency.overallScore === 100
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
            }`}
          >
            Integrity Score: {consistency.overallScore}%
          </span>
        </div>

        <div className="space-y-3">
          {checks.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a]"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                  {item.label}
                </span>
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                  {item.desc}
                </span>
              </div>

              <div className="shrink-0 mt-0.5">
                {item.passed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                    <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                    <span>Preserved</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/80">
                    <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                    <span>Drift Alert</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Brand Shifts</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
        >
          <span>Generate Final Audience Brand Kit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
