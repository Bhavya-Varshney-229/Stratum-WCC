import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Layout,
  Layers,
  Box,
  Share2,
  Smartphone,
  Compass,
} from 'lucide-react';
import {
  VentureProject,
  BrandDirection,
  DesignStudioData,
  ColorSwatch,
} from '../../types/venture';

interface DesignStudioScreenProps {
  project: VentureProject;
  onUpdateProject: (updated: VentureProject) => void;
  onLogDecision: (
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit',
    affectsDownstream?: ('market-launch' | 'complete-brand-kit')[]
  ) => void;
  onNavigateWorkspace: (wsId: any) => void;
}

type DesignStudioMode = 'compare-all' | 'deep-inspector' | 'mix-and-match';

export const DesignStudioScreen: React.FC<DesignStudioScreenProps> = ({
  project,
  onUpdateProject,
  onLogDecision,
  onNavigateWorkspace,
}) => {
  const [viewMode, setViewMode] = useState<DesignStudioMode>('compare-all');
  const [activeDirectionId, setActiveDirectionId] = useState<BrandDirection['id']>(
    project.designStudio.activeDirectionId || 'direction-a'
  );
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [generatedVisual, setGeneratedVisual] = useState<{ assetUrl: string; title: string } | null>(null);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  const design = project.designStudio;
  const directions = design.directions;
  const activeDirection = directions.find((d) => d.id === activeDirectionId) || directions[0];

  const handleGenerateVisual = async (assetType: string = 'logo_concept') => {
    setIsGeneratingVisual(true);
    try {
      const res = await fetch('/api/ai/generate-brand-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: project.title,
          category: assetType,
          vibe: activeDirection.vibe,
          prompt: `High-fidelity brand asset for ${project.title}: ${activeDirection.tagline}`,
          palette: activeDirection.colorPalette.map((s) => s.hex),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedVisual({
          assetUrl: data.assetUrl,
          title: data.title,
        });
        onLogDecision(
          'Generated Custom Brand Visual Asset',
          `Created visual asset specimen (${assetType}) for ${activeDirection.title}.`,
          'create',
          ['complete-brand-kit']
        );
      }
    } catch (e) {
      console.warn('Failed to generate visual asset', e);
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleSelectActiveDirection = (id: BrandDirection['id']) => {
    setActiveDirectionId(id);
    const updatedDesign: DesignStudioData = {
      ...design,
      activeDirectionId: id,
    };
    onUpdateProject({ ...project, designStudio: updatedDesign });
    const selectedDir = directions.find((d) => d.id === id);
    onLogDecision(
      'Selected Active Brand Direction',
      `Locked "${selectedDir?.title}" as primary visual identity anchor.`,
      'approve',
      ['market-launch', 'complete-brand-kit']
    );
  };

  const handleUpdateCombination = (
    key: keyof DesignStudioData['customCombinations'],
    directionId: BrandDirection['id']
  ) => {
    const updatedCustom = {
      ...design.customCombinations,
      [key]: directionId,
    };
    const updatedDesign: DesignStudioData = {
      ...design,
      customCombinations: updatedCustom,
    };
    onUpdateProject({ ...project, designStudio: updatedDesign });
    onLogDecision(
      'Updated Design Token Combination',
      `Assigned ${key} to ${directionId}.`,
      'edit',
      ['complete-brand-kit']
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6124] font-bold">
            Workspace 03
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
            Design Studio & Visual Identity Systems
          </h1>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
            Three distinct, fully articulated brand design directions. Compare side-by-side, inspect
            design tokens, or mix & match component elements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateWorkspace('market-launch')}
          className="px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span>Proceed to Market & Launch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1">
          {[
            { id: 'compare-all', label: 'Side-by-Side Comparison', icon: Layout },
            { id: 'deep-inspector', label: 'Deep Visual Inspector', icon: Eye },
            { id: 'mix-and-match', label: 'Mix & Match Combiner', icon: SlidersHorizontal },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id as DesignStudioMode)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6124] text-white shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF8F3] dark:hover:bg-[#222] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pr-2 text-xs font-mono">
          <span className="text-[#57534E] dark:text-[#A8A29E]">Active Direction:</span>
          <span className="font-bold text-[#FF6124]">
            {activeDirection.title.split(':')[0]}
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: Side-by-Side Comparison Grid (3 Directions) */}
      {viewMode === 'compare-all' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {directions.map((dir) => {
            const isSelected = activeDirectionId === dir.id;

            return (
              <div
                key={dir.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? 'bg-white dark:bg-[#1e1e1e] border-[#FF6124] ring-2 ring-[#FF6124]/30 shadow-md'
                    : 'bg-white dark:bg-[#181818] border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-neutral-400 shadow-xs'
                }`}
              >
                <div className="space-y-5">
                  {/* Direction Title Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4DFD3] dark:border-[#2a2a2a]">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#222] border border-[#E4DFD3] dark:border-[#333] font-bold text-[#FF6124]">
                        {dir.vibe}
                      </span>
                      <h3 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mt-1.5">
                        {dir.title}
                      </h3>
                      <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                        {dir.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Logo Concept Mark Preview */}
                  <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center text-2xl font-bold text-[#FF6124] shadow-xs shrink-0">
                      {dir.logoConceptBrief.iconSymbol}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-[#57534E] dark:text-[#A8A29E] block">
                        Logo Visual Brief
                      </span>
                      <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] line-clamp-2 leading-snug">
                        {dir.logoConceptBrief.markDescription}
                      </p>
                    </div>
                  </div>

                  {/* Color Palette Swatches */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                      Color Palette Swatches
                    </span>
                    <div className="grid grid-cols-6 gap-1.5">
                      {dir.colorPalette.map((swatch, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleCopyHex(swatch.hex)}
                          className="group relative flex flex-col items-center cursor-pointer"
                          title={`Click to copy: ${swatch.name} (${swatch.hex})`}
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-black/10 dark:border-white/10 shadow-2xs group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E] truncate mt-1">
                            {swatch.hex}
                          </span>
                        </button>
                      ))}
                    </div>
                    {copiedHex && (
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block text-center">
                        Copied {copiedHex} to clipboard!
                      </span>
                    )}
                  </div>

                  {/* Typography Previews */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                      Typography Pairings
                    </span>
                    <div>
                      <span className="text-[9px] font-mono text-[#FF6124] block">
                        Display: {dir.typographyPreview.displayFace}
                      </span>
                      <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] leading-tight">
                        {dir.typographyPreview.displaySample}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E] block">
                        Body: {dir.typographyPreview.bodyFace}
                      </span>
                      <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-snug">
                        {dir.typographyPreview.bodySample}
                      </p>
                    </div>
                  </div>

                  {/* Moodboard Visual Cards */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                      Curated Moodboard Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dir.moodboardKeywords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] text-[#1C1917] dark:text-[#F5F3EC]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social & UI Tokens Preview */}
                  <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] text-xs space-y-1">
                    <span className="text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E] block">
                      UI Tokens: {dir.uiUxConcepts.cornerRounding} · {dir.uiUxConcepts.shadowStyle}
                    </span>
                    <span className="text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E] block">
                      Packaging: {dir.packagingConcept.materials}
                    </span>
                  </div>
                </div>

                {/* Bottom Lock / Select Action */}
                <div className="pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
                  <button
                    type="button"
                    onClick={() => handleSelectActiveDirection(dir.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#FF6124] text-white shadow-xs'
                        : 'bg-[#FAF8F3] dark:bg-[#252525] hover:bg-[#FF6124] hover:text-white text-[#1C1917] dark:text-[#F5F3EC] border border-[#E4DFD3] dark:border-[#333]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Active Direction Selected</span>
                      </>
                    ) : (
                      <span>Select as Active Direction</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: Deep Visual Inspector (Detailed Single Direction View) */}
      {viewMode === 'deep-inspector' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Direction Selector Tabs */}
          <div className="flex gap-2">
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDirectionId(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDirectionId === d.id
                    ? 'bg-[#FF6124] text-white shadow-xs'
                    : 'bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] text-[#57534E] dark:text-[#A8A29E]'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          {/* Deep Inspector Content */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DFD3] dark:border-[#2a2a2a]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FF6124] font-bold">
                  {activeDirection.vibe}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                  {activeDirection.title}
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                  {activeDirection.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectActiveDirection(activeDirection.id)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
              >
                Set as Active Direction
              </button>
            </div>

            {/* Suggested Names */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Suggested Brand Names & Domain Formats
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeDirection.suggestedNames.map((name, nIdx) => (
                  <div
                    key={nIdx}
                    className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                        {name.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#FF6124] font-bold">
                        {name.isAvailableDomainIdea}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {name.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagery & Art Direction Notes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Imagery & Photography Art Direction
              </span>
              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#FF6124] block mb-0.5">Art Style:</span>
                  <p className="text-[#1C1917] dark:text-[#F5F3EC]">
                    {activeDirection.imageryDirection.artStyle}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#FF6124] block mb-0.5">Lighting & Texture:</span>
                  <p className="text-[#57534E] dark:text-[#A8A29E]">
                    {activeDirection.imageryDirection.lightingAndTone}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#FF6124] block mb-1">Photographer Directives:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#57534E] dark:text-[#A8A29E]">
                    {activeDirection.imageryDirection.guidelines.map((g, gIdx) => (
                      <li key={gIdx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Packaging & Social Mockup Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2 text-xs">
                <span className="font-bold text-[#FF6124] uppercase text-[10px] block">
                  Packaging Specification Concept
                </span>
                <p className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {activeDirection.packagingConcept.style}
                </p>
                <p className="text-[#57534E] dark:text-[#A8A29E]">
                  Materials: {activeDirection.packagingConcept.materials}
                </p>
                <p className="text-[#57534E] dark:text-[#A8A29E]">
                  Tactile: {activeDirection.packagingConcept.tactileFinish}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2 text-xs">
                <span className="font-bold text-[#FF6124] uppercase text-[10px] block">
                  Website Hero Template Architecture
                </span>
                <p className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  {activeDirection.websiteTemplateInspiration.layoutType}
                </p>
                <p className="text-[#57534E] dark:text-[#A8A29E]">
                  Hero: {activeDirection.websiteTemplateInspiration.heroStructure}
                </p>
                <p className="text-[#57534E] dark:text-[#A8A29E]">
                  Header: {activeDirection.websiteTemplateInspiration.navStyle}
                </p>
              </div>
            </div>

            {/* AI Visual Concept Asset Specimen */}
            <div className="p-5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6124] block">
                    AI Visual Asset Generator
                  </span>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                    Synthesize custom brand marks, moodboards, and packaging visuals tailored to {activeDirection.title}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateVisual('logo_concept')}
                    disabled={isGeneratingVisual}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingVisual ? 'Generating...' : 'Generate Brand Mark'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateVisual('moodboard')}
                    disabled={isGeneratingVisual}
                    className="px-3 py-1.5 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Moodboard
                  </button>
                </div>
              </div>

              {generatedVisual && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">{generatedVisual.title}</span>
                    <a
                      href={generatedVisual.assetUrl}
                      download={`${project.title.toLowerCase().replace(/\s+/g, '_')}_specimen.svg`}
                      className="text-[#FF6124] font-bold hover:underline"
                    >
                      Download Asset
                    </a>
                  </div>
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center bg-[#FAF8F3] dark:bg-[#121212]">
                    <img
                      src={generatedVisual.assetUrl}
                      alt={generatedVisual.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Mix & Match Combiner */}
      {viewMode === 'mix-and-match' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
              Mix & Match Identity Elements
            </h2>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
              Combine color swatches from Direction A with typography from Direction B and logo concepts from Direction C.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Color Palette Selector */}
            <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Select Color Palette
              </span>
              <select
                value={design.customCombinations.selectedPaletteDirection}
                onChange={(e) => handleUpdateCombination('selectedPaletteDirection', e.target.value as any)}
                className="w-full p-2.5 bg-white dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs font-semibold"
              >
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} (Palette)
                  </option>
                ))}
              </select>
            </div>

            {/* Typography Selector */}
            <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Select Typography Hierarchy
              </span>
              <select
                value={design.customCombinations.selectedTypographyDirection}
                onChange={(e) => handleUpdateCombination('selectedTypographyDirection', e.target.value as any)}
                className="w-full p-2.5 bg-white dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs font-semibold"
              >
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} (Fonts)
                  </option>
                ))}
              </select>
            </div>

            {/* Logo Brief Selector */}
            <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Select Logo Mark Direction
              </span>
              <select
                value={design.customCombinations.selectedLogoDirection}
                onChange={(e) => handleUpdateCombination('selectedLogoDirection', e.target.value as any)}
                className="w-full p-2.5 bg-white dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs font-semibold"
              >
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} (Mark)
                  </option>
                ))}
              </select>
            </div>

            {/* Imagery Style Selector */}
            <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] block">
                Select Imagery & Moodboard Direction
              </span>
              <select
                value={design.customCombinations.selectedImageryDirection}
                onChange={(e) => handleUpdateCombination('selectedImageryDirection', e.target.value as any)}
                className="w-full p-2.5 bg-white dark:bg-[#161616] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-xs font-semibold"
              >
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} (Imagery)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
