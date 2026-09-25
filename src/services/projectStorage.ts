import { AudienceShifterProject, ProductIdea } from '../types/brand';
import { createAudienceShifterProject } from './brandGenerator';

const STORAGE_KEY = 'nobugs_saved_projects';

// 3 High-Fidelity Pre-seeded Projects so users immediately see their previous work
export const SAMPLE_PROJECTS: AudienceShifterProject[] = [
  {
    ...createAudienceShifterProject({
      title: 'CampusLedger: Student Financial Autonomy',
      rawIdea: 'Automated micro-budgeting and emergency stipend tracker for college students that syncs with campus meal plans, financial aid disbursements, and parent-approved emergency funds.',
      industry: 'Fintech / EdTech',
      targetAudience: 'College Undergrads & Higher-Ed Administrators',
      problemSolved: 'Financial anxiety and unpredicted expenses causing unexpected mid-semester college dropouts.'
    }),
    id: 'proj-campusledger-01',
    title: 'CampusLedger: Student Financial Autonomy',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    coreValueLock: {
      coreValue: 'Radical Financial Autonomy & Stress-Free Budgeting for Undergrads',
      isLocked: true,
      lockedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      originalExtractedValue: 'Radical Financial Autonomy & Stress-Free Budgeting for Undergrads'
    },
    selectedAudiences: ['students', 'parents', 'institutions']
  },
  {
    ...createAudienceShifterProject({
      title: 'DevPulse: Engineering Health & Flow State',
      rawIdea: 'Non-invasive developer telemetry tool that detects cognitive overload, flaky test fatigue, and PR review bottlenecks before engineers burn out.',
      industry: 'Developer Tools / B2B SaaS',
      targetAudience: 'Software Engineers & Engineering Leaders',
      problemSolved: 'Invisible developer burnout and chronic context switching degrading software shipping velocity.'
    }),
    id: 'proj-devpulse-02',
    title: 'DevPulse: Engineering Health & Flow State',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    coreValueLock: {
      coreValue: 'Protecting Developer Cognitive Flow and Eradicating Invisible Engineering Burnout',
      isLocked: true,
      lockedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      originalExtractedValue: 'Protecting Developer Cognitive Flow and Eradicating Invisible Engineering Burnout'
    },
    selectedAudiences: ['professionals', 'enterprise', 'smallbiz']
  },
  {
    ...createAudienceShifterProject({
      title: 'TerraTrace: Real-Time Scope-3 Supply Chain ESG',
      rawIdea: 'Automated carbon accounting platform that ingests ERP freight invoices and supplier customs filings to produce auditable scope-3 emissions records.',
      industry: 'Climate Tech / Enterprise',
      targetAudience: 'Sustainability Directors & Procurement Officers',
      problemSolved: 'Inaccurate greenwashing liabilities and manual quarterly supplier ESG audits.'
    }),
    id: 'proj-terratrace-03',
    title: 'TerraTrace: Scope-3 Supply Chain Intelligence',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
    coreValueLock: {
      coreValue: 'Verifiable, Frictionless Scope-3 Carbon Provenance for Modern Supply Chains',
      isLocked: true,
      lockedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      originalExtractedValue: 'Verifiable, Frictionless Scope-3 Carbon Provenance for Modern Supply Chains'
    },
    selectedAudiences: ['enterprise', 'smallbiz', 'investors']
  }
];

export function getSavedProjects(): AudienceShifterProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial benchmarks
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_PROJECTS;
  } catch {
    return SAMPLE_PROJECTS;
  }
}

export function saveProjectToStorage(project: AudienceShifterProject): void {
  try {
    const existing = getSavedProjects();
    const index = existing.findIndex((p) => p.id === project.id);
    let updated: AudienceShifterProject[];

    const projectToSave: AudienceShifterProject = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      updated = [...existing];
      updated[index] = projectToSave;
    } else {
      updated = [projectToSave, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save project to storage', err);
  }
}

export function deleteProjectFromStorage(id: string): AudienceShifterProject[] {
  try {
    const existing = getSavedProjects();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
}

export function duplicateProjectInStorage(id: string): AudienceShifterProject | null {
  try {
    const existing = getSavedProjects();
    const target = existing.find((p) => p.id === id);
    if (!target) return null;

    const cloned: AudienceShifterProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj-${Date.now()}`,
      title: `${target.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };

    const updated = [cloned, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return cloned;
  } catch {
    return null;
  }
}
