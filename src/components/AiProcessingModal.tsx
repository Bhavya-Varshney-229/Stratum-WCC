import React, { useEffect, useState } from 'react';
import { Check, CircleDot, Circle } from 'lucide-react';

export interface ProgressItem {
  id: string;
  label: string;
}

interface AiProcessingModalProps {
  title?: string;
  subtitle?: string;
  steps: ProgressItem[];
  currentStepIndex: number;
  isOpen: boolean;
}

export const AiProcessingModal: React.FC<AiProcessingModalProps> = ({
  title = 'Structuring Brand Intelligence...',
  subtitle = 'Preserving strategic context and analyzing market angles.',
  steps,
  currentStepIndex,
  isOpen,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-neutral-200 dark:border-[#2f2f2f] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
            <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
              {seconds}s
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Minimal Stepped AI Progress State */}
        <div className="space-y-3 py-1">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs transition-colors duration-200 ${
                  isCurrent
                    ? 'text-neutral-900 dark:text-white font-semibold'
                    : isFinished
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isFinished ? (
                    <span className="w-4 h-4 rounded-full bg-[#FF6124] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                  ) : isCurrent ? (
                    <CircleDot className="w-4 h-4 text-[#FF6124] animate-pulse" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
                  )}
                </div>
                <span className="flex-1">{step.label}</span>
                {isFinished && (
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">
                    Done
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[11px] text-[#FF6124] animate-pulse font-semibold">
                    Synthesizing...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Subtle Bottom Note */}
        <div className="pt-3 border-t border-neutral-100 dark:border-[#2a2a2a] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>NO BUGS deliberate reasoning engine</span>
          <span className="tabular-nums font-mono font-semibold text-neutral-700 dark:text-neutral-300">
            {Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100))}%
          </span>
        </div>
      </div>
    </div>
  );
};
