import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Copy,
  Printer,
  Check,
  Edit3,
  Layers,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';
import { VentureProject, BrandKitSectionToggle } from '../../types/venture';

interface BrandKitScreenProps {
  project: VentureProject;
  onUpdateProject: (updated: VentureProject) => void;
  onLogDecision: (
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit'
  ) => void;
}

export const BrandKitScreen: React.FC<BrandKitScreenProps> = ({
  project,
  onUpdateProject,
  onLogDecision,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isPolishingSummary, setIsPolishingSummary] = useState(false);

  const brandKit = project.brandKit;
  const sections = brandKit.sections;

  const handleToggleSection = (id: string) => {
    const updatedSections = sections.map((s) =>
      s.id === id ? { ...s, included: !s.included } : s
    );
    const updatedProject = {
      ...project,
      brandKit: {
        ...brandKit,
        sections: updatedSections,
      },
    };
    onUpdateProject(updatedProject);
  };

  const handleUpdateSummary = (newSummary: string) => {
    const updatedProject = {
      ...project,
      brandKit: {
        ...brandKit,
        executiveSummary: newSummary,
      },
    };
    onUpdateProject(updatedProject);
  };

  const handleAiPolishSummary = async () => {
    if (isPolishingSummary) return;
    setIsPolishingSummary(true);

    try {
      const res = await fetch('/api/ai/polish-executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSummary: brandKit.executiveSummary,
          projectTitle: project.title,
          corePremise: project.understanding.corePremise,
          unfairAdvantage: project.understanding.unfairAdvantage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.polishedSummary) {
          handleUpdateSummary(data.polishedSummary);
          onLogDecision(
            'Polished Executive Summary with AI',
            'Synthesized entire brand intelligence dossier into board-ready prospectus language.',
            'refine'
          );
        }
      }
    } catch (e) {
      console.warn('Polish summary error', e);
    } finally {
      setIsPolishingSummary(false);
    }
  };

  // Compile Comprehensive Markdown Report
  const generateMarkdownReport = (): string => {
    let md = `# ${project.title} — Venture Intelligence & Brand Dossier\n\n`;
    md += `*Tagline*: ${project.tagline}\n`;
    md += `*Generated*: ${new Date().toLocaleDateString()}\n\n`;
    md += `## Executive Summary\n${brandKit.executiveSummary}\n\n`;

    if (sections.find((s) => s.id === 'sec-1')?.included) {
      md += `### Core Venture Premise & Value Invariant\n`;
      md += `**Premise**: ${project.understanding.corePremise}\n`;
      md += `**Primary Problem**: ${project.understanding.primaryProblem}\n`;
      md += `**Unfair Advantage**: ${project.understanding.unfairAdvantage}\n\n`;
    }

    if (sections.find((s) => s.id === 'sec-2')?.included) {
      md += `### Market Opportunity & Macro Economics\n`;
      md += `- **TAM**: ${project.researchDiscovery.marketOpportunity.tam}\n`;
      md += `- **SAM**: ${project.researchDiscovery.marketOpportunity.sam}\n`;
      md += `- **SOM (36-mo)**: ${project.researchDiscovery.marketOpportunity.som}\n`;
      md += `- **CAGR**: +${project.researchDiscovery.marketOpportunity.cagrPercent}%\n\n`;
    }

    if (sections.find((s) => s.id === 'sec-3')?.included) {
      md += `### Customer Personas & Segments\n`;
      project.researchDiscovery.targetAudience.personas.forEach((p) => {
        md += `#### ${p.name} (${p.role})\n`;
        md += `- **Daily Friction**: ${p.dailyFriction}\n`;
        md += `- **Adoption Trigger**: ${p.adoptionTrigger}\n`;
        md += `- **Budget Authority**: ${p.budgetAuthority}\n\n`;
      });
    }

    if (sections.find((s) => s.id === 'sec-4')?.included) {
      md += `### Brand Strategy & Audience Positioning\n`;
      md += `**Locked Core Value**: ${project.brandStrategy.approvedCoreValue}\n\n`;
      project.brandStrategy.audiencePositionings.forEach((pos) => {
        md += `#### ${pos.personaName} (${pos.segmentTag})\n`;
        md += `- **Headline**: "${pos.tailoredHeadline}"\n`;
        md += `- **Value Proposition**: ${pos.tailoredValueProposition}\n`;
        md += `- **Primary CTA**: ${pos.callToAction}\n\n`;
      });
    }

    if (sections.find((s) => s.id === 'sec-5')?.included) {
      md += `### Visual Identity & Design Tokens\n`;
      const activeDir = project.designStudio.directions.find(
        (d) => d.id === project.designStudio.activeDirectionId
      );
      if (activeDir) {
        md += `**Direction**: ${activeDir.title} (${activeDir.vibe})\n`;
        md += `**Display Font**: ${activeDir.typographyPreview.displayFace}\n`;
        md += `**Body Font**: ${activeDir.typographyPreview.bodyFace}\n`;
        md += `**Palette Swatches**:\n`;
        activeDir.colorPalette.forEach((sw) => {
          md += `- ${sw.name}: \`${sw.hex}\` (${sw.usage})\n`;
        });
        md += `\n`;
      }
    }

    if (sections.find((s) => s.id === 'sec-6')?.included) {
      md += `### Launch Blueprint & Campaign Budgets\n`;
      project.marketLaunch.campaigns.forEach((camp) => {
        md += `- **${camp.name}** (${camp.phase}): Budget ${camp.budgetAllocated} | Channel: ${camp.primaryChannel} | Target KPI: ${camp.targetKpi}\n`;
      });
      md += `\n`;
    }

    // Competitive Landscape
    md += `### Competitive Landscape & Strategic Wedges\n`;
    (project.researchDiscovery.competitiveAnalysis.competitors || []).forEach((c) => {
      md += `- **${c.name}** (${c.category}, Share: ${c.marketShare}): Wedge: ${c.differentiationAngle}\n`;
    });
    md += `\n`;

    // Empirical Sources & Citations
    const citations = project.researchDiscovery.marketOpportunity.sourceCitations || [];
    if (citations.length > 0) {
      md += `### Empirical Sources & Verified Citations\n`;
      citations.forEach((src) => {
        md += `- [Credibility: ${src.credibility}] **${src.institution}**: "${src.metric}" (${src.note})\n`;
      });
      md += `\n`;
    }

    // Decision History & Approvals Log
    const decisions = project.decisionHistory || [];
    if (decisions.length > 0) {
      md += `### Decision History & Approvals Log\n`;
      decisions.slice(0, 10).forEach((d) => {
        md += `- [${new Date(d.timestamp).toLocaleDateString()}] **${d.title}** (${d.actionType.toUpperCase()} in ${d.workspace}): ${d.description}\n`;
      });
      md += `\n`;
    }

    md += `---\n*Compiled via Stratum Venture Intelligence Studio*\n`;
    return md;
  };

  // Export handlers
  const handleExportMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_brand_kit.md`;
    link.click();
    URL.revokeObjectURL(url);
    onLogDecision('Exported Markdown Dossier', 'Downloaded complete markdown brief.', 'edit');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
    onLogDecision('Exported JSON Project Data', 'Downloaded full structured JSON archive.', 'edit');
  };

  const handleCopyClipboard = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeDirection =
    project.designStudio.directions.find((d) => d.id === project.designStudio.activeDirectionId) ||
    project.designStudio.directions[0];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6124] font-bold">
            Workspace 05
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
            Complete Brand Kit & Report Builder
          </h1>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
            Consolidate approved empirical research, tailored positioning, visual identity tokens, and
            the 20-week launch blueprint into a unified executive dossier.
          </p>
        </div>

        {/* Working Export Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="px-3.5 py-2 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Copy entire formatted dossier to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#FF6124]" />
                <span>Copy Brief</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Download as Markdown file"
          >
            <Download className="w-3.5 h-3.5 text-[#FF6124]" />
            <span>Export Markdown</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] bg-white dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Download full JSON state"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Section Configurator & Live Dossier Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Builder Configurator */}
        <div className="space-y-5">
          {/* Section Selection Toggles */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
              Included Dossier Sections
            </h3>
            <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
              Toggle sections to customize your exported presentation.
            </p>

            <div className="space-y-2 pt-1">
              {sections.map((sec) => (
                <label
                  key={sec.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF8F3] dark:hover:bg-[#222] transition-colors cursor-pointer border border-transparent hover:border-[#E4DFD3] dark:hover:border-[#2a2a2a]"
                >
                  <input
                    type="checkbox"
                    checked={sec.included}
                    onChange={() => handleToggleSection(sec.id)}
                    className="mt-0.5 accent-[#FF6124] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                      {sec.title}
                    </span>
                    <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] leading-tight block">
                      {sec.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Editable Executive Notes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wide">
                Custom Dossier Notes
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiPolishSummary}
                  disabled={isPolishingSummary}
                  className="text-xs text-[#FF6124] hover:bg-[#FF6124]/10 px-2 py-0.5 rounded font-semibold cursor-pointer flex items-center gap-1 border border-[#FF6124]/30 disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${isPolishingSummary ? 'animate-spin' : ''}`} />
                  <span>{isPolishingSummary ? 'Polishing...' : 'AI Polish'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSummary(!isEditingSummary)}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold cursor-pointer"
                >
                  {isEditingSummary ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            {isEditingSummary ? (
              <textarea
                rows={4}
                value={brandKit.executiveSummary}
                onChange={(e) => handleUpdateSummary(e.target.value)}
                className="w-full p-3 text-xs bg-[#FAF8F3] dark:bg-[#202020] border border-[#FF6124] rounded-xl text-[#1C1917] dark:text-[#F5F3EC] focus:outline-none"
              />
            ) : (
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] bg-[#FAF8F3] dark:bg-[#202020] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e] leading-relaxed">
                {brandKit.executiveSummary}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Live Printable Dossier Preview (2 Cols wide) */}
        <div className="lg:col-span-2 p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-sm space-y-8 select-text">
          {/* Dossier Cover Title Block */}
          <div className="border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6124] font-extrabold">
                STRATUM VENTURE INTELLIGENCE DOSSIER
              </span>
              <span className="text-xs font-mono text-[#57534E] dark:text-[#A8A29E]">
                {brandKit.lastGenerated}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC] tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
              {project.tagline}
            </p>
          </div>

          {/* Section 1: Executive Summary */}
          {sections.find((s) => s.id === 'sec-1')?.included && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                01. Executive Summary & Core Invariant
              </h3>
              <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F3EC] leading-relaxed">
                {brandKit.executiveSummary}
              </p>

              <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
                  Locked Core Value:
                </span>
                <p className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  "{project.understanding.corePremise}"
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Market Opportunity */}
          {sections.find((s) => s.id === 'sec-2')?.included && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                02. Market Opportunity & Macro Economics
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
                  <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] block">TAM</span>
                  <span className="font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                    {project.researchDiscovery.marketOpportunity.tam}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
                  <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] block">SAM</span>
                  <span className="font-extrabold text-[#FF6124]">
                    {project.researchDiscovery.marketOpportunity.sam}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e]">
                  <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E] block">SOM</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    {project.researchDiscovery.marketOpportunity.som}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Personas */}
          {sections.find((s) => s.id === 'sec-3')?.included && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                03. Target Customer Archetypes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {project.researchDiscovery.targetAudience.personas.map((persona) => (
                  <div
                    key={persona.id}
                    className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1"
                  >
                    <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                      {persona.name} — {persona.role}
                    </span>
                    <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                      Friction: {persona.dailyFriction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Brand Strategy */}
          {sections.find((s) => s.id === 'sec-4')?.included && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                04. Multi-Audience Positioning Anchors
              </h3>
              <div className="space-y-2 text-xs">
                {project.brandStrategy.audiencePositionings.map((pos, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                        {pos.personaName} ({pos.segmentTag})
                      </span>
                      <span className="text-[10px] font-mono text-[#FF6124]">
                        CTA: {pos.callToAction}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#FF6124]">
                      "{pos.tailoredHeadline}"
                    </p>
                    <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {pos.tailoredValueProposition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Visual Identity */}
          {sections.find((s) => s.id === 'sec-5')?.included && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                05. Visual Identity & Design Tokens
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                    Approved Visual Direction: {activeDirection.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                    {activeDirection.vibe}
                  </span>
                </div>

                {/* Swatches */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeDirection.colorPalette.map((swatch, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[11px] font-mono">
                      <div
                        className="w-3.5 h-3.5 rounded border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Launch Milestones */}
          {sections.find((s) => s.id === 'sec-6')?.included && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                06. 20-Week Phased Launch Milestones
              </h3>
              <div className="space-y-2 text-xs">
                {project.marketLaunch.launchTimeline.map((ph, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block">
                        {ph.phaseName}
                      </span>
                      <span className="text-[10px] text-[#57534E] dark:text-[#A8A29E]">
                        {ph.focus}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#FF6124]">
                      {ph.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 7: Empirical Sources & Citations */}
          {project.researchDiscovery.marketOpportunity.sourceCitations?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                07. Verified Empirical Citations & Benchmarks
              </h3>
              <div className="space-y-2 text-xs">
                {project.researchDiscovery.marketOpportunity.sourceCitations.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] space-y-1"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">{src.institution}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{src.credibility} Credibility</span>
                    </div>
                    <p className="text-[11px] font-medium text-[#1C1917] dark:text-[#F5F3EC]">{src.metric}</p>
                    <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] italic">"{src.note}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Decision Audit Trail */}
          {project.decisionHistory?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a]">
              <h3 className="text-xs font-bold text-[#FF6124] uppercase tracking-wider">
                08. Decision History & Version Log
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {project.decisionHistory.slice(0, 6).map((dec) => (
                  <div
                    key={dec.id}
                    className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] flex items-center justify-between text-[11px]"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">{dec.title}</span>
                      <span className="text-[#57534E] dark:text-[#A8A29E] block text-[10px] truncate">{dec.description}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FF6124]/10 text-[#FF6124] shrink-0">
                      {dec.actionType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
