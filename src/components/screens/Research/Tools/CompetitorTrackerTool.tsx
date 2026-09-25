import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  BarChart3,
  Layers,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { CompetitorProfile } from '../../../../types/venture';
import { SourceLabelBadge } from '../SourceLabelBadge';

interface CompetitorTrackerToolProps {
  initialCompetitors: CompetitorProfile[];
  onUpdateCompetitors?: (competitors: CompetitorProfile[]) => void;
}

export const CompetitorTrackerTool: React.FC<CompetitorTrackerToolProps> = ({
  initialCompetitors,
  onUpdateCompetitors,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>(initialCompetitors);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Direct' | 'Indirect' | 'Legacy'>('All');
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'comparison' | 'gaps'>('directory');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    initialCompetitors.slice(0, 2).map((c) => c.id)
  );

  useEffect(() => {
    if (initialCompetitors) {
      setCompetitors(initialCompetitors);
    }
  }, [initialCompetitors]);

  // New competitor form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Direct' | 'Indirect' | 'Legacy'>('Direct');
  const [newShare, setNewShare] = useState('12%');
  const [newPricing, setNewPricing] = useState('$199/month');
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');
  const [newAngle, setNewAngle] = useState('');

  const filteredCompetitors = competitors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.differentiationAngle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAddCompetitor = () => {
    if (!newName.trim()) return;
    const newComp: CompetitorProfile = {
      id: `comp-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      marketShare: newShare,
      pricingModel: newPricing,
      strengths: newStrength ? [newStrength] : ['Established brand recognition'],
      vulnerabilities: newWeakness ? [newWeakness] : ['Slow release cadence'],
      differentiationAngle: newAngle || 'Modern cloud-native execution with sub-second latency.',
      sourceLabel: 'User Provided',
    };

    const updated = [...competitors, newComp];
    setCompetitors(updated);
    if (onUpdateCompetitors) onUpdateCompetitors(updated);

    // Reset form
    setNewName('');
    setNewStrength('');
    setNewWeakness('');
    setNewAngle('');
    setIsAddingCompetitor(false);
  };

  const handleDeleteCompetitor = (id: string) => {
    const updated = competitors.filter((c) => c.id !== id);
    setCompetitors(updated);
    if (onUpdateCompetitors) onUpdateCompetitors(updated);
  };

  const toggleComparisonSelection = (id: string) => {
    if (selectedForComparison.includes(id)) {
      if (selectedForComparison.length > 1) {
        setSelectedForComparison(selectedForComparison.filter((cid) => cid !== id));
      }
    } else {
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const comparedList = competitors.filter((c) => selectedForComparison.includes(c.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6124]">
              Intelligence Dashboard
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              Verified Profiles
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
            Competitor Intelligence & Watchlist
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#1e1e1e] rounded-xl border border-[#E4DFD3] dark:border-[#333]">
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'directory' ? 'bg-[#FF6124] text-white font-bold' : 'text-stone-500'
              }`}
            >
              Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'comparison' ? 'bg-[#FF6124] text-white font-bold' : 'text-stone-500'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'gaps' ? 'bg-[#FF6124] text-white font-bold' : 'text-stone-500'
              }`}
            >
              Market Gaps
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingCompetitor(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Competitor</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracked competitors or defensible angles..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-[#1C1917] dark:text-[#F5F3EC] focus:outline-none focus:border-[#FF6124]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#FAF8F3] dark:bg-[#202020] rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e]">
          {(['All', 'Direct', 'Indirect', 'Legacy'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white dark:bg-[#2c2c2c] text-[#FF6124] shadow-2xs font-bold'
                  : 'text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add Competitor Modal */}
      {isAddingCompetitor && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[#FF6124] shadow-md space-y-4 animate-in fade-in duration-150">
          <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            Track New Competitor Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-stone-500 block mb-1">Company Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Enel X"
                className="w-full p-2 bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-stone-800 dark:text-stone-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 block mb-1">Rival Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2 bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-stone-800 dark:text-stone-200"
              >
                <option value="Direct">Direct</option>
                <option value="Indirect">Indirect</option>
                <option value="Legacy">Legacy Incumbent</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 block mb-1">Pricing Model</label>
              <input
                type="text"
                value={newPricing}
                onChange={(e) => setNewPricing(e.target.value)}
                className="w-full p-2 bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-stone-800 dark:text-stone-200"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-stone-500 block mb-1">
                Our Defensible Wedge / Unfair Advantage Against Them
              </label>
              <input
                type="text"
                value={newAngle}
                onChange={(e) => setNewAngle(e.target.value)}
                placeholder="e.g. Pure cloud API deployment in 48h vs 120-day hardware backlog"
                className="w-full p-2 bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCompetitor(false)}
              className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCompetitor}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl cursor-pointer"
            >
              Save Competitor
            </button>
          </div>
        </div>
      )}

      {/* View 1: Competitor Directory */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitors.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                    {comp.name}
                  </span>
                  <SourceLabelBadge label={comp.sourceLabel} />
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    {comp.category}
                  </span>
                  <span>Share: {comp.marketShare}</span>
                </div>

                <p className="text-[11px] text-stone-500 italic">
                  Pricing: {comp.pricingModel}
                </p>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                    Strengths
                  </span>
                  <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5 list-disc list-inside">
                    {comp.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 block">
                    Vulnerabilities
                  </span>
                  <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5 list-disc list-inside">
                    {comp.vulnerabilities.map((vuln, idx) => (
                      <li key={idx}>{vuln}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleComparisonSelection(comp.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    selectedForComparison.includes(comp.id)
                      ? 'bg-[#FF6124] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {selectedForComparison.includes(comp.id) ? 'Selected for Arena' : '+ Compare'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCompetitor(comp.id)}
                  className="text-stone-400 hover:text-red-600 text-xs p-1"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Side-by-Side Comparison */}
      {activeTab === 'comparison' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
            Side-by-Side Matrix ({comparedList.length} Selected)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] text-[10px] font-bold uppercase text-stone-500">
                  <th className="pb-3">Attribute</th>
                  {comparedList.map((c) => (
                    <th key={c.id} className="pb-3 text-stone-900 dark:text-stone-100 font-extrabold">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DFD3] dark:divide-[#2a2a2a]">
                <tr>
                  <td className="py-2.5 font-bold text-stone-500">Category</td>
                  {comparedList.map((c) => (
                    <td key={c.id} className="py-2.5">{c.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-stone-500">Pricing Model</td>
                  {comparedList.map((c) => (
                    <td key={c.id} className="py-2.5 font-mono">{c.pricingModel}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-stone-500">Market Share</td>
                  {comparedList.map((c) => (
                    <td key={c.id} className="py-2.5 font-mono">{c.marketShare}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-stone-500">Our Counter-Wedge</td>
                  {comparedList.map((c) => (
                    <td key={c.id} className="py-2.5 text-[#FF6124] font-semibold">{c.differentiationAngle}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Market Gaps */}
      {activeTab === 'gaps' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#FF6124] block">
              Gap 1: 90-Day Hardware Installation Delay
            </span>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              Every legacy incumbent relies on on-site electricians to install physical Modbus meters. Our cloud API gateway eliminates field dispatches entirely.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
              Gap 2: Lack of Verified Payback Guarantee
            </span>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              Incumbents demand multi-year upfront capital expenditure. Our performance-share structure guarantees net positive cashflow in month one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
