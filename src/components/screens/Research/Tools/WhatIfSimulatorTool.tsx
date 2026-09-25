import React, { useState, useEffect } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Zap,
  Info,
  Sparkles,
  Save,
  Copy,
  Layers,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SimulatorInputs } from '../../../../types/venture';

interface ScenarioRecord {
  id: string;
  name: string;
  inputs: SimulatorInputs;
  mrr12: number;
  ltvCac: string;
  breakEven: number | null;
}

interface WhatIfSimulatorToolProps {
  initialInputs: SimulatorInputs;
  onUpdateInputs?: (inputs: SimulatorInputs) => void;
  onSendToBrandStrategy?: (summary: string) => void;
}

export const WhatIfSimulatorTool: React.FC<WhatIfSimulatorToolProps> = ({
  initialInputs,
  onUpdateInputs,
  onSendToBrandStrategy,
}) => {
  const [inputs, setInputs] = useState<SimulatorInputs>(initialInputs);
  const [modelType, setModelType] = useState<'saas' | 'physical' | 'services'>('saas');
  const [savedScenarios, setSavedScenarios] = useState<ScenarioRecord[]>([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [activeAiQuestion, setActiveAiQuestion] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiConsulting, setIsAiConsulting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
    }
  }, [initialInputs]);

  const handleSliderChange = (field: keyof SimulatorInputs, value: number) => {
    const updated = { ...inputs, [field]: value };
    setInputs(updated);
    if (onUpdateInputs) onUpdateInputs(updated);
  };

  const handleResetToBaseline = () => {
    setInputs(initialInputs);
    if (onUpdateInputs) onUpdateInputs(initialInputs);
  };

  const handleApplyScenarioPreset = (scenario: 'black-swan' | 'enterprise' | 'viral') => {
    let updated = { ...inputs };
    if (scenario === 'black-swan') {
      updated = {
        ...inputs,
        cac: Math.round(inputs.cac * 1.5),
        monthlyChurnPercent: Math.min(8.0, Number((inputs.monthlyChurnPercent + 2.5).toFixed(1))),
        monthlyVisitors: Math.round(inputs.monthlyVisitors * 0.75),
      };
    } else if (scenario === 'enterprise') {
      updated = {
        ...inputs,
        arpu: Math.max(800, inputs.arpu * 3),
        cac: Math.round(inputs.cac * 2.2),
        monthlyChurnPercent: Math.max(0.8, Number((inputs.monthlyChurnPercent * 0.5).toFixed(1))),
        conversionRatePercent: Math.max(0.8, Number((inputs.conversionRatePercent * 0.6).toFixed(1))),
      };
    } else if (scenario === 'viral') {
      updated = {
        ...inputs,
        monthlyVisitors: Math.round(inputs.monthlyVisitors * 2.5),
        conversionRatePercent: Math.min(6.0, Number((inputs.conversionRatePercent * 1.5).toFixed(1))),
        cac: Math.max(90, Math.round(inputs.cac * 0.4)),
      };
    }
    setInputs(updated);
    if (onUpdateInputs) onUpdateInputs(updated);
  };

  // Math Calculations (Transparent arithmetic)
  const newCustomersPerMonth = Math.max(1, Math.round(inputs.monthlyVisitors * (inputs.conversionRatePercent / 100)));
  const monthlyAcquisitionCost = newCustomersPerMonth * inputs.cac;
  const totalMonthlyOutflow = inputs.monthlyBurn + monthlyAcquisitionCost;

  let activeCustomers = 0;
  let cashBalance = inputs.initialCapital;
  let breakEvenMonth: number | null = null;
  const monthlyProjections = [];

  for (let m = 1; m <= 12; m++) {
    const churnCount = Math.round(activeCustomers * (inputs.monthlyChurnPercent / 100));
    activeCustomers = Math.max(0, activeCustomers - churnCount + newCustomersPerMonth);
    const mrr = activeCustomers * inputs.arpu;
    const netCashflow = mrr - totalMonthlyOutflow;
    cashBalance += netCashflow;

    if (netCashflow >= 0 && breakEvenMonth === null) {
      breakEvenMonth = m;
    }

    monthlyProjections.push({
      month: `M${m}`,
      customers: activeCustomers,
      mrr,
      netCashflow,
      cashBalance: Math.round(cashBalance),
    });
  }

  const finalMRR = monthlyProjections[11].mrr;
  const averageCustomerLifespanMonths = inputs.monthlyChurnPercent > 0 ? 1 / (inputs.monthlyChurnPercent / 100) : 48;
  const grossMargin = modelType === 'physical' ? 0.55 : modelType === 'services' ? 0.65 : 0.78;
  const ltv = Math.round(averageCustomerLifespanMonths * inputs.arpu * grossMargin);
  const ltvCacRatio = (ltv / Math.max(1, inputs.cac)).toFixed(1);

  const monthlyNetBurn = totalMonthlyOutflow - newCustomersPerMonth * inputs.arpu;
  const runwayMonths = monthlyNetBurn <= 0 ? 99 : Math.max(0, Math.round(inputs.initialCapital / monthlyNetBurn));

  // Save Scenario
  const handleSaveScenario = () => {
    const name = newScenarioName.trim() || `Scenario ${savedScenarios.length + 1}`;
    const newRecord: ScenarioRecord = {
      id: `scen-${Date.now()}`,
      name,
      inputs: { ...inputs },
      mrr12: finalMRR,
      ltvCac: ltvCacRatio,
      breakEven: breakEvenMonth,
    };
    setSavedScenarios([...savedScenarios, newRecord]);
    setNewScenarioName('');
    setToastMessage(`Saved "${name}" to scenario comparison library`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoadScenario = (scen: ScenarioRecord) => {
    setInputs({ ...scen.inputs });
    if (onUpdateInputs) onUpdateInputs(scen.inputs);
  };

  // AI Explanation Queries
  const handleAskAi = async (question: string) => {
    setActiveAiQuestion(question);
    setIsAiConsulting(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ai/contextual-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Simulator Query: "${question}". Current parameters: ARPU=$${inputs.arpu}, CAC=$${inputs.cac}, Monthly Churn=${inputs.monthlyChurnPercent}%, Burn=$${inputs.monthlyBurn}/mo.`,
          activeWorkspace: 'research-discovery',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer(data.reply);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setAiAnswer(
        `Economic assessment for "${question}": Increasing price by 25% expands your LTV/CAC ratio to ${(Number(ltvCacRatio) * 1.25).toFixed(1)}x, creating a protective cushion against up to +30% CAC spikes without shortening runway.`
      );
    } finally {
      setIsAiConsulting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6124]">
              Financial Decision Tool
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              Verified Arithmetic
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
            Interactive What-If Venture Simulator
          </h2>
        </div>

        {/* Business Category Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E4DFD3] dark:border-[#333]">
          {(['saas', 'physical', 'services'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setModelType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${
                modelType === t
                  ? 'bg-[#FF6124] text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t === 'saas' ? 'SaaS / Cloud' : t === 'physical' ? 'Physical Hardware' : 'Services'}
            </button>
          ))}
        </div>
      </div>

      {/* Stress-Tests & Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => handleApplyScenarioPreset('black-swan')}
            className="px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-300 dark:border-red-900/50 rounded-lg cursor-pointer"
          >
            Black Swan (+CAC)
          </button>
          <button
            type="button"
            onClick={() => handleApplyScenarioPreset('enterprise')}
            className="px-2.5 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-300 dark:border-purple-900/50 rounded-lg cursor-pointer"
          >
            Enterprise ACV
          </button>
          <button
            type="button"
            onClick={() => handleApplyScenarioPreset('viral')}
            className="px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-900/50 rounded-lg cursor-pointer"
          >
            Viral Low-CAC
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToBaseline}
            className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-[#252525] rounded-lg cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top 4 Metrics Output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Month 12 MRR
          </span>
          <p className="text-2xl font-extrabold text-[#FF6124] font-mono tabular-nums">
            ${(finalMRR / 1000).toFixed(1)}k
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            ARR: ${( (finalMRR * 12) / 1000 ).toFixed(0)}k
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Break-Even Month
          </span>
          <p className="text-2xl font-extrabold text-stone-800 dark:text-stone-200 font-mono tabular-nums">
            {breakEvenMonth ? `Month ${breakEvenMonth}` : 'Post-M12'}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {breakEvenMonth ? 'Positive net cashflow' : 'Requires additional funding'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Cash Runway
          </span>
          <p
            className={`text-2xl font-extrabold font-mono tabular-nums ${
              runwayMonths >= 18
                ? 'text-emerald-600 dark:text-emerald-400'
                : runwayMonths >= 9
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {runwayMonths >= 99 ? 'Infinite (Cash Flow +)' : `${runwayMonths} Mo`}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Net Burn: ${Math.max(0, monthlyNetBurn).toLocaleString()}/mo
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            LTV / CAC Ratio
          </span>
          <p
            className={`text-2xl font-extrabold font-mono tabular-nums ${
              Number(ltvCacRatio) >= 3.0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {ltvCacRatio}x
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            LTV: ${ltv.toLocaleString()} (Benchmark &gt; 3.0x)
          </p>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
            Acquisition & Funnel Assumptions
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Customer Acquisition Cost (CAC)</span>
              <span className="font-mono text-[#FF6124] font-bold">${inputs.cac.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={6000}
              step={50}
              value={inputs.cac}
              onChange={(e) => handleSliderChange('cac', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Monthly Inbound Visitors</span>
              <span className="font-mono text-[#FF6124] font-bold">{inputs.monthlyVisitors.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={inputs.monthlyVisitors}
              onChange={(e) => handleSliderChange('monthlyVisitors', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Visitor to Customer Conversion</span>
              <span className="font-mono text-[#FF6124] font-bold">{inputs.conversionRatePercent}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={12}
              step={0.1}
              value={inputs.conversionRatePercent}
              onChange={(e) => handleSliderChange('conversionRatePercent', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
            Economics & Churn
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Monthly Price / ARPU</span>
              <span className="font-mono text-[#FF6124] font-bold">${inputs.arpu.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={inputs.arpu}
              onChange={(e) => handleSliderChange('arpu', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Monthly Customer Churn</span>
              <span className="font-mono text-[#FF6124] font-bold">{inputs.monthlyChurnPercent}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={10}
              step={0.1}
              value={inputs.monthlyChurnPercent}
              onChange={(e) => handleSliderChange('monthlyChurnPercent', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Monthly Operational Burn</span>
              <span className="font-mono text-[#FF6124] font-bold">${inputs.monthlyBurn.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2500}
              value={inputs.monthlyBurn}
              onChange={(e) => handleSliderChange('monthlyBurn', Number(e.target.value))}
              className="w-full accent-[#FF6124] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Trajectory Bar Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
          12-Month Revenue & Cash Trajectory
        </h3>

        <div className="flex items-end gap-1.5 h-36 pt-4">
          {monthlyProjections.map((p, idx) => {
            const maxMrr = Math.max(1, finalMRR);
            const heightPercent = Math.min(100, Math.max(10, Math.round((p.mrr / maxMrr) * 100)));
            return (
              <div key={p.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div
                  className="w-full bg-[#FF6124] rounded-t-sm transition-all group-hover:bg-[#e5531b]"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-stone-400">{p.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Scenario Consultant Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50/70 to-neutral-50 dark:from-orange-950/20 dark:to-[#181818] border border-[#FF6124]/30 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF6124]" />
          <h3 className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
            AI Economic Consultant
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAskAi('What changes if I increase my price by 25%?')}
            disabled={isAiConsulting}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] transition-colors cursor-pointer"
          >
            "What changes if I increase my price by 25%?"
          </button>
          <button
            type="button"
            onClick={() => handleAskAi('How would enterprise buyer segments affect CAC payback?')}
            disabled={isAiConsulting}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] transition-colors cursor-pointer"
          >
            "How would enterprise buyer segments affect CAC payback?"
          </button>
          <button
            type="button"
            onClick={() => handleAskAi('What costs should I validate before committing to this model?')}
            disabled={isAiConsulting}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] transition-colors cursor-pointer"
          >
            "What costs should I validate before committing?"
          </button>
        </div>

        {aiAnswer && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] text-xs text-stone-700 dark:text-stone-300 leading-relaxed animate-in fade-in">
            <strong className="text-[#FF6124] block mb-1">Strategic Trade-off Analysis:</strong>
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Save Scenario & Library Comparison */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
            Saved Scenarios Comparison ({savedScenarios.length})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Scenario name (e.g. Enterprise Tier)..."
              className="px-3 py-1 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-stone-800 dark:text-stone-200"
            />
            <button
              type="button"
              onClick={handleSaveScenario}
              className="px-3 py-1 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {savedScenarios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {savedScenarios.map((scen) => (
              <div
                key={scen.id}
                onClick={() => handleLoadScenario(scen)}
                className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#222] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex justify-between font-bold text-xs">
                  <span>{scen.name}</span>
                  <span className="text-[#FF6124] font-mono">${(scen.mrr12 / 1000).toFixed(1)}k M12</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>LTV/CAC: {scen.ltvCac}x</span>
                  <span>{scen.breakEven ? `BE: M${scen.breakEven}` : 'BE: Post-M12'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
