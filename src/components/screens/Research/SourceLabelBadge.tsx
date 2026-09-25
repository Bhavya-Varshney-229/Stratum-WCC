import React from 'react';
import { SourceLabel } from '../../../types/venture';
import { ShieldCheck, User, Sparkles, AlertCircle } from 'lucide-react';

interface SourceLabelBadgeProps {
  label: SourceLabel;
  className?: string;
}

export const SourceLabelBadge: React.FC<SourceLabelBadgeProps> = ({ label, className = '' }) => {
  switch (label) {
    case 'Verified Source':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/60 ${className}`}
          title="Verified through industry benchmark or primary documentation"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Verified Source</span>
        </span>
      );
    case 'User Provided':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/80 dark:border-blue-800/60 ${className}`}
          title="Directly supplied by founder/operator during onboarding"
        >
          <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>User Provided</span>
        </span>
      );
    case 'AI Hypothesis':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/80 dark:border-purple-800/60 ${className}`}
          title="Synthesized by AI inference model; requires operational confirmation"
        >
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>AI Hypothesis</span>
        </span>
      );
    case 'Needs Testing':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/60 ${className}`}
          title="Unresolved claim flagged for pre-market testing"
        >
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Needs Testing</span>
        </span>
      );
    default:
      return null;
  }
};
