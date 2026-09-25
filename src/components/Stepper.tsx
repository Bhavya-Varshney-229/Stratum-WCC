import React from 'react';
import { WorkflowStep } from '../types/brand';
import { Check, Lock } from 'lucide-react';

interface StepperProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  isCoreValueLocked?: boolean;
  onSelectStep: (step: WorkflowStep) => void;
}

interface StepMeta {
  id: WorkflowStep;
  number: string;
  label: string;
  shortDesc: string;
  isLockStep?: boolean;
}

const STEPS: StepMeta[] = [
  { id: 'product', number: '01', label: 'Product', shortDesc: 'Core Idea' },
  { id: 'understand', number: '02', label: 'Understand', shortDesc: 'Problem & Promise' },
  { id: 'lock-value', number: '03', label: 'Lock Core', shortDesc: 'Unbreakable Anchor', isLockStep: true },
  { id: 'select-audiences', number: '04', label: 'Audiences', shortDesc: 'Select 2–4 Targets' },
  { id: 'audience-shift', number: '05', label: 'Brand Shift', shortDesc: 'Adapted Messaging' },
  { id: 'consistency-check', number: '06', label: 'Integrity Check', shortDesc: 'Zero Value Drift' },
  { id: 'deliver', number: '07', label: 'Brand Kit', shortDesc: 'Final Launch Kit' },
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  completedSteps,
  isCoreValueLocked,
  onSelectStep,
}) => {
  if (currentStep === 'landing' || currentStep === 'dashboard' || currentStep === 'settings') {
    return null;
  }

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-[#F1EEE4] dark:bg-[#151515] border-b border-[#E4DFD3] dark:border-[#2a2a2a] py-3 px-4 sm:px-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Mobile View: Compact stage progression */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
              Stage {currentIndex + 1} of {STEPS.length}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {STEPS[currentIndex]?.label}: {STEPS[currentIndex]?.shortDesc}
            </span>
          </div>
          <div className="w-24 bg-[#E4DFD3] dark:bg-[#2a2a2a] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#FF6124] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop View: Horizontal progression with lock icon emphasis */}
        <nav aria-label="Audience Shifter Progress" className="hidden md:flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isUnlocked = isCompleted || isCurrent;
            const isLockActive = step.isLockStep && isCoreValueLocked;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => onSelectStep(step.id)}
                  className={`group flex items-center gap-2 text-left transition-all ${
                    isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step status circle */}
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all ${
                      isLockActive
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300 dark:ring-emerald-700'
                        : isCurrent
                        ? 'bg-[#FF6124] text-white shadow-xs ring-2 ring-[#FF6124]/30'
                        : isCompleted
                        ? 'bg-[#292524] dark:bg-[#333] text-white'
                        : 'bg-[#E4DFD3] dark:bg-[#252525] text-neutral-600 dark:text-neutral-400 group-hover:bg-[#D7CFBF] dark:group-hover:bg-[#303030]'
                    }`}
                  >
                    {isLockActive ? (
                      <Lock className="w-3 h-3 stroke-[2.5]" />
                    ) : isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      step.number
                    )}
                  </span>

                  {/* Step metadata */}
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold leading-tight flex items-center gap-1 ${
                        isCurrent
                          ? 'text-neutral-950 dark:text-neutral-50 font-bold'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {step.label}
                      {step.isLockStep && isCoreValueLocked && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">🔒</span>
                      )}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      {step.shortDesc}
                    </span>
                  </div>
                </button>

                {/* Progress bar line connecting to next step */}
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 h-px bg-[#E4DFD3] dark:bg-[#2a2a2a] overflow-hidden" aria-hidden="true">
                    <div
                      className={`h-full transition-all duration-300 ${
                        completedSteps.includes(STEPS[idx + 1].id) || currentStep === STEPS[idx + 1].id
                          ? 'bg-[#FF6124]'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
