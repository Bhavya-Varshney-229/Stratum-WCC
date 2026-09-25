import React, { useState } from 'react';
import { ProductUnderstanding } from '../../types/brand';
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface UnderstandScreenProps {
  understanding: ProductUnderstanding;
  onUpdate: (updated: ProductUnderstanding) => void;
  onNext: () => void;
  onBack: () => void;
}

export const UnderstandScreen: React.FC<UnderstandScreenProps> = ({
  understanding,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [data, setData] = useState<ProductUnderstanding>(understanding);

  const handleChange = (field: keyof ProductUnderstanding, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onUpdate(updated);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 02</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">AI Deep Understanding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          Deconstructing Your Product
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          The AI has synthesized your product down to its core components. Review and calibrate before locking the central value anchor.
        </p>
      </div>

      <div className="space-y-5">
        {/* Core Value Highlight Banner */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border-2 border-[#FF6124]/40 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF6124] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Extracted Core Value Proposition
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-[#FAF8F3] dark:bg-[#252525] px-2 py-0.5 rounded border border-[#E4DFD3] dark:border-[#333]">
              To Be Locked in Next Step
            </span>
          </div>
          <textarea
            rows={2}
            value={data.coreValue}
            onChange={(e) => handleChange('coreValue', e.target.value)}
            className="w-full text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 bg-transparent border-b border-[#E4DFD3] dark:border-[#2a2a2a] focus:border-[#FF6124] focus:outline-none py-1"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            This core promise must remain consistent regardless of how many audiences you target.
          </p>
        </div>

        {/* Core Problem & Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
              1. The Core Problem Solved
            </span>
            <textarea
              rows={3}
              value={data.coreProblem}
              onChange={(e) => handleChange('coreProblem', e.target.value)}
              className="w-full text-xs text-neutral-700 dark:text-neutral-300 bg-[#FAF8F3] dark:bg-[#151515] p-2.5 rounded-lg border border-[#E4DFD3] dark:border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#FF6124] leading-relaxed"
            />
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
              2. Fundamental Product Purpose
            </span>
            <textarea
              rows={3}
              value={data.productPurpose}
              onChange={(e) => handleChange('productPurpose', e.target.value)}
              className="w-full text-xs text-neutral-700 dark:text-neutral-300 bg-[#FAF8F3] dark:bg-[#151515] p-2.5 rounded-lg border border-[#E4DFD3] dark:border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#FF6124] leading-relaxed"
            />
          </div>
        </div>

        {/* Product Promise & Target Users */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
              3. The Fundamental Product Promise
            </span>
            <textarea
              rows={3}
              value={data.productPromise}
              onChange={(e) => handleChange('productPromise', e.target.value)}
              className="w-full text-xs text-neutral-700 dark:text-neutral-300 bg-[#FAF8F3] dark:bg-[#151515] p-2.5 rounded-lg border border-[#E4DFD3] dark:border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#FF6124] leading-relaxed"
            />
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block">
              4. Target User Universe
            </span>
            <textarea
              rows={3}
              value={data.targetUsers}
              onChange={(e) => handleChange('targetUsers', e.target.value)}
              className="w-full text-xs text-neutral-700 dark:text-neutral-300 bg-[#FAF8F3] dark:bg-[#151515] p-2.5 rounded-lg border border-[#E4DFD3] dark:border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#FF6124] leading-relaxed"
            />
          </div>
        </div>

        {/* Non-Negotiable Principles */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Non-Negotiable Brand Principles (Constants)
            </span>
          </div>
          <div className="space-y-2">
            {data.nonNegotiablePrinciples.map((principle, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FAF8F3] dark:bg-[#151515] border border-[#E4DFD3] dark:border-[#2a2a2a] text-xs text-neutral-800 dark:text-neutral-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{principle}</span>
              </div>
            ))}
          </div>
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
          <span>Back to Product</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
        >
          <span>Proceed to Lock Core Value</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
