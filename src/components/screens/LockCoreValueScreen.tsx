import React, { useState } from 'react';
import { CoreValueLock } from '../../types/brand';
import { ArrowRight, ArrowLeft, Lock, Unlock, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface LockCoreValueScreenProps {
  lockState: CoreValueLock;
  onLockToggle: (newCoreValue: string, isLocked: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LockCoreValueScreen: React.FC<LockCoreValueScreenProps> = ({
  lockState,
  onLockToggle,
  onNext,
  onBack,
}) => {
  const [coreValueInput, setCoreValueInput] = useState(lockState.coreValue);
  const [isLocked, setIsLocked] = useState(lockState.isLocked);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleConfirmLock = () => {
    setIsLocked(true);
    setShowCelebration(true);
    onLockToggle(coreValueInput.trim(), true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const handleUnlock = () => {
    setIsLocked(false);
    onLockToggle(coreValueInput.trim(), false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 03</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">The Unbreakable Anchor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          Lock Your Core Value
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          This single value proposition will be safeguarded as an invariant constant. As we adapt your brand across audiences, this never changes.
        </p>
      </div>

      {/* Main Lock Card */}
      <div
        className={`rounded-2xl border-2 transition-all p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-sm ${
          isLocked
            ? 'bg-white dark:bg-[#1a1a1a] border-emerald-600/60 dark:border-emerald-500/50 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-[#1a1a1a] border-[#E4DFD3] dark:border-[#2a2a2a]'
        }`}
      >
        {/* Top Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-[#2a2a2a] pb-4">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold tracking-wide">
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>CORE VALUE LOCKED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold tracking-wide">
                <Unlock className="w-3.5 h-3.5 stroke-[2]" />
                <span>PENDING CONFIRMATION</span>
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            Anchor Invariant Engine
          </span>
        </div>

        {/* Core Value Input / Display */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Core Value Proposition
          </label>
          <textarea
            rows={3}
            disabled={isLocked}
            value={coreValueInput}
            onChange={(e) => setCoreValueInput(e.target.value)}
            placeholder="Help students understand and manage their money easily."
            className={`w-full p-4 rounded-xl text-base sm:text-lg font-bold leading-snug transition-colors focus:outline-none ${
              isLocked
                ? 'bg-[#FAF8F3] dark:bg-[#141414] text-neutral-900 dark:text-neutral-50 border border-emerald-300 dark:border-emerald-800 cursor-not-allowed'
                : 'bg-white dark:bg-[#141414] text-neutral-900 dark:text-neutral-50 border-2 border-[#D7CFBF] dark:border-[#333] focus:border-[#FF6124] focus:ring-2 focus:ring-[#FF6124]/20'
            }`}
          />
          {!isLocked && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Refine your wording if needed before locking. Once locked, the AI shifts tone and positioning around this exact promise.
            </p>
          )}
        </div>

        {/* Lock / Unlock Interactive Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {isLocked ? 'Protected Against Value Drift' : 'Ready to be Locked'}
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              “This remains constant while your brand adapts to different audiences.”
            </p>
          </div>

          <div className="shrink-0">
            {isLocked ? (
              <button
                type="button"
                onClick={handleUnlock}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#EAE5D9] dark:hover:bg-[#303030] border border-[#E4DFD3] dark:border-[#333] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock to Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmLock}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Lock Core Value</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Confirmation Banner */}
        {showCelebration && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span className="font-semibold">
              Core Value Successfully Locked! Now select target audiences to adapt your communication.
            </span>
          </div>
        )}
      </div>

      {/* Explanation of the Rule */}
      <div className="p-5 rounded-xl bg-[#FAF8F3] dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 text-xs">
        <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
          Why We Lock the Core Value
        </span>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Generic AI tools hallucinate 5 totally separate companies with 5 different products. NO BUGS anchors to your singular core value so that your brand retains 100% integrity whether you are pitching college freshmen, protective parents, or institutional administrators.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Understand</span>
        </button>

        <button
          type="button"
          disabled={!isLocked}
          onClick={onNext}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            isLocked
              ? 'text-white bg-[#FF6124] hover:bg-[#e5531b] shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]'
              : 'text-neutral-400 dark:text-neutral-500 bg-neutral-200 dark:bg-neutral-800 cursor-not-allowed'
          }`}
        >
          <span>Continue to Select Audiences</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
