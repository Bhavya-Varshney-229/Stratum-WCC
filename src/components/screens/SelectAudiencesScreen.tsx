import React, { useState } from 'react';
import { AudienceOption } from '../../types/brand';
import { AVAILABLE_AUDIENCES } from '../../services/brandGenerator';
import { ArrowRight, ArrowLeft, Check, Plus, Users, GraduationCap, ShieldCheck, Building2, Briefcase, UserCheck, Sparkles, Store, TrendingUp } from 'lucide-react';

interface SelectAudiencesScreenProps {
  selectedAudiences: string[];
  lockedCoreValue: string;
  onUpdateAudiences: (audienceIds: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SelectAudiencesScreen: React.FC<SelectAudiencesScreenProps> = ({
  selectedAudiences,
  lockedCoreValue,
  onUpdateAudiences,
  onNext,
  onBack,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedAudiences.length >= 2 ? selectedAudiences : ['students', 'parents', 'institutions']
  );
  const [customAudienceText, setCustomAudienceText] = useState('');
  const [customList, setCustomList] = useState<AudienceOption[]>([]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        return; // require at least 2
      }
      const updated = selectedIds.filter((item) => item !== id);
      setSelectedIds(updated);
      onUpdateAudiences(updated);
    } else {
      if (selectedIds.length >= 4) {
        return; // max 4 to avoid cognitive overload
      }
      const updated = [...selectedIds, id];
      setSelectedIds(updated);
      onUpdateAudiences(updated);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customAudienceText.trim();
    if (!clean) return;

    const newId = `custom-${Date.now()}`;
    const newOption: AudienceOption = {
      id: newId,
      name: clean,
      shortLabel: clean.slice(0, 15),
      category: 'Custom Segment',
      description: `Tailored audience direction specifically for ${clean}.`,
      avatarIcon: 'Users'
    };

    setCustomList([...customList, newOption]);
    setCustomAudienceText('');
    if (selectedIds.length < 4) {
      const updated = [...selectedIds, newId];
      setSelectedIds(updated);
      onUpdateAudiences(updated);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-[#FF6124]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'Store':
        return <Store className="w-4 h-4 text-orange-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-teal-600" />;
      default:
        return <Users className="w-4 h-4 text-neutral-600" />;
    }
  };

  const allAvailable = [...AVAILABLE_AUDIENCES, ...customList];
  const isValidCount = selectedIds.length >= 2 && selectedIds.length <= 4;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6124] uppercase tracking-wider">
          <span>Stage 04</span>
          <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">Audience Selection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
          Choose 2 to 4 Target Audiences
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Select the distinct stakeholder groups that need to buy into your product. NO BUGS will generate specialized brand adaptations for each.
        </p>
      </div>

      {/* Locked Core Value Pin Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-emerald-300 dark:border-emerald-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold tracking-wider">
            🔒 LOCKED CORE
          </span>
          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            “{lockedCoreValue}”
          </span>
        </div>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline">
          Held Constant
        </span>
      </div>

      {/* Counter & Instructions */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
          Target Segments ({selectedIds.length} of 4 Selected)
        </span>
        <span className={`text-xs font-medium ${isValidCount ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
          {selectedIds.length < 2
            ? 'Select at least 2 audiences'
            : selectedIds.length === 4
            ? 'Maximum 4 selected'
            : 'Ready to adapt'}
        </span>
      </div>

      {/* Grid of Audiences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allAvailable.map((aud) => {
          const isSelected = selectedIds.includes(aud.id);
          const isDisabled = !isSelected && selectedIds.length >= 4;

          return (
            <button
              key={aud.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleToggle(aud.id)}
              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'border-[#FF6124] bg-white dark:bg-[#1c1c1c] ring-2 ring-[#FF6124]/30 shadow-xs'
                  : isDisabled
                  ? 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3]/50 dark:bg-[#151515]/50 opacity-50 cursor-not-allowed'
                  : 'border-[#E4DFD3] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] hover:border-[#D7CFBF] dark:hover:border-[#404040] shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333]">
                    {renderIcon(aud.avatarIcon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {aud.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400">
                      {aud.category}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#FF6124] text-white shadow-2xs'
                      : 'border border-[#D7CFBF] dark:border-[#3a3a3a] bg-white dark:bg-[#252525]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {aud.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Add Custom Audience Form */}
      <form onSubmit={handleAddCustom} className="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-2 shadow-xs">
        <label htmlFor="custom-aud" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
          Add a Custom Target Audience
        </label>
        <div className="flex gap-2">
          <input
            id="custom-aud"
            type="text"
            value={customAudienceText}
            onChange={(e) => setCustomAudienceText(e.target.value)}
            placeholder="e.g., High School Guidance Counselors, Medical Fellows..."
            className="flex-1 p-2.5 rounded-lg border border-[#D7CFBF] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#141414] text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FF6124]"
          />
          <button
            type="submit"
            disabled={!customAudienceText.trim() || selectedIds.length >= 4}
            className="px-4 py-2.5 rounded-lg bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#EAE5D9] dark:hover:bg-[#303030] text-neutral-900 dark:text-neutral-100 border border-[#E4DFD3] dark:border-[#333] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Audience</span>
          </button>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#EAE5D9] dark:hover:bg-[#252525] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Core Value</span>
        </button>

        <button
          type="button"
          disabled={!isValidCount}
          onClick={onNext}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            isValidCount
              ? 'text-white bg-[#FF6124] hover:bg-[#e5531b] shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6124]'
              : 'text-neutral-400 dark:text-neutral-500 bg-neutral-200 dark:bg-neutral-800 cursor-not-allowed'
          }`}
        >
          <span>Shift Brand for {selectedIds.length} Audiences</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
