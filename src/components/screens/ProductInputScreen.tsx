import React, { useState } from 'react';
import { ProductIdea } from '../../types/brand';
import { PRESET_IDEAS } from '../../services/brandGenerator';
import { ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface ProductInputScreenProps {
  initialInput?: ProductIdea;
  onSubmit: (input: ProductIdea) => void;
}

export const ProductInputScreen: React.FC<ProductInputScreenProps> = ({
  initialInput,
  onSubmit,
}) => {
  const [ideaText, setIdeaText] = useState(
    initialInput?.rawIdea || 'I am building an AI-powered financial management app for students.'
  );
  const [targetAudience, setTargetAudience] = useState(
    initialInput?.targetAudience || 'College students, parents of students, and university student affairs'
  );
  const [problemSolved, setProblemSolved] = useState(
    initialInput?.problemSolved || 'Overdraft anxiety, fragmented budgeting, and lack of practical money skills'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    onSubmit({
      title: ideaText.slice(0, 45).trim() + (ideaText.length > 45 ? '...' : ''),
      rawIdea: ideaText.trim(),
      targetAudience: targetAudience.trim(),
      problemSolved: problemSolved.trim(),
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setIdeaText(preset.idea);
    if (preset.category.includes('Fintech')) {
      setTargetAudience('College students, parents, and university student affairs');
      setProblemSolved('Unexpected overdraft fees and unmanaged living expenses');
    } else if (preset.category.includes('Health')) {
      setTargetAudience('Undergraduates, busy professionals, and wellness teams');
      setProblemSolved('Afternoon fatigue and burnout from irregular sleep cycles');
    } else {
      setTargetAudience('Freelance designers, solo developers, and small agencies');
      setProblemSolved('Unclaimed write-offs and tax filing anxiety');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 01</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">The Product Anchor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          What is Your Product?
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Describe the single underlying product or startup. The core value of this product will be extracted and locked as your constant anchor.
        </p>
      </div>

      {/* Preset Idea Shortcuts */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          <Lightbulb className="w-3.5 h-3.5 text-[#FF6124]" />
          <span>Quick Benchmark Starters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg text-xs bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#EAE5D9] dark:hover:bg-[#303030] border border-[#E4DFD3] dark:border-[#333] text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer text-left font-medium"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="raw-idea" className="block text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
            1. Core Product or Startup Description <span className="text-[#FF6124]">*</span>
          </label>
          <textarea
            id="raw-idea"
            rows={4}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g., I am building an AI-powered financial management app for students..."
            required
            className="w-full p-4 rounded-xl border border-[#D7CFBF] dark:border-[#333] bg-white dark:bg-[#1c1c1c] text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124] text-sm leading-relaxed shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="audience-context" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              2. Known Target Groups (Optional)
            </label>
            <input
              id="audience-context"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Students, parents, universities"
              className="w-full p-3 rounded-lg border border-[#D7CFBF] dark:border-[#333] bg-white dark:bg-[#1c1c1c] text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="problem-solved" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              3. Core Problem Being Solved (Optional)
            </label>
            <input
              id="problem-solved"
              type="text"
              value={problemSolved}
              onChange={(e) => setProblemSolved(e.target.value)}
              placeholder="e.g. Overdraft fees and budgeting stress"
              className="w-full p-3 rounded-lg border border-[#D7CFBF] dark:border-[#333] bg-white dark:bg-[#1c1c1c] text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF6124]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Next: AI will extract your core problem, purpose, and core value proposition.
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#FF6124] hover:bg-[#e5531b] transition-all flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]"
          >
            <span>Analyze & Extract Core Value</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
