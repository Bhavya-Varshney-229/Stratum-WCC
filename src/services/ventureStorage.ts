import {
  VentureProject,
  WorkspaceId,
  DecisionLogEntry,
  ProjectType,
  WorkspaceStatus,
} from '../types/venture';
import { generateVentureProject } from './ventureGenerator';
import { authService } from './authService';

const ALL_PROJECTS_KEY = 'stratum_multi_projects_v2';
const ACTIVE_PROJECT_ID_KEY = 'stratum_active_venture_id_v2';

// Meaningful Progress Calculation based on actual workflow states
export function calculateProjectProgress(project: VentureProject): number {
  let score = 0;
  let totalWeights = 0;

  // 1. Research & Discovery (Weight: 35)
  totalWeights += 35;
  const cards = [
    project.researchDiscovery.targetAudience.status,
    project.researchDiscovery.marketOpportunity.status,
    project.researchDiscovery.productFeasibility.status,
    project.researchDiscovery.competitiveAnalysis.status,
    project.researchDiscovery.risksDrawbacks.status,
    project.researchDiscovery.developmentRoadmap.status,
  ];
  const approvedCards = cards.filter((s) => s === 'Approved').length;
  const verifiedCards = cards.filter((s) => s === 'Verified' || s === 'Approved').length;
  score += ((approvedCards * 1.0 + (verifiedCards - approvedCards) * 0.7) / cards.length) * 35;

  // 2. Brand Strategy (Weight: 25)
  totalWeights += 25;
  const strategyScore = project.brandStrategy.consistencyChecker.overallAlignmentScore || 80;
  const selectedMsg = project.brandStrategy.messagingAlternatives.some((a) => a.isSelected);
  const selectedPricing = project.brandStrategy.pricingModels.some((p) => p.isRecommended);
  score += ((strategyScore / 100) * 0.6 + (selectedMsg ? 0.2 : 0) + (selectedPricing ? 0.2 : 0)) * 25;

  // 3. Design Studio (Weight: 15)
  totalWeights += 15;
  const hasDirection = !!project.designStudio.activeDirectionId;
  score += (hasDirection ? 1.0 : 0.2) * 15;

  // 4. Market & Launch Readiness (Weight: 15)
  totalWeights += 15;
  const readiness = project.marketLaunch.readinessChecker || [];
  const completedChecks = readiness.filter((r) => r.isComplete).length;
  const readinessRatio = readiness.length > 0 ? completedChecks / readiness.length : 0.3;
  score += readinessRatio * 15;

  // 5. Complete Brand Kit (Weight: 10)
  totalWeights += 10;
  const hasKit = project.brandKit.sections.filter((s) => s.included).length >= 4;
  score += (hasKit ? 1.0 : 0.3) * 10;

  return Math.min(100, Math.max(5, Math.round(score)));
}

// Get all projects saved across the browser
function getAllRawProjects(): VentureProject[] {
  try {
    const raw = localStorage.getItem(ALL_PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAllRawProjects(projects: VentureProject[]) {
  try {
    localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save raw projects', e);
  }
}

// Ensure demo projects exist for the user
export function ensureInitialProjectsForUser(userId: string): VentureProject[] {
  const all = getAllRawProjects();
  let userProjects = all.filter((p) => p.ownerId === userId);

  if (userProjects.length === 0) {
    // Seed an initial new brand project and a sample rebrand project
    const defaultNew = generateVentureProject(
      'Autonomous solar microgrid orchestrator for decentralized commercial power networks',
      {
        industry: 'Clean Energy & Infrastructure',
        customerType: 'Commercial Real Estate & Industrial Parks',
        unfairAdvantage: 'Proprietary predictive tariff-dispatch algorithm',
        businessModel: 'B2B SaaS + Performance Share',
        launchStage: 'Early Prototype / MVP',
      },
      undefined,
      'new_brand',
      userId
    );

    const defaultRebrand = generateVentureProject(
      'Modernizing heritage precision cold-brew coffee brand into modular urban robotic kiosks',
      {
        industry: 'Smart Retail & FoodTech',
        customerType: 'Tech Campuses & Premium Transit Hubs',
        unfairAdvantage: 'Patented ultra-compact cryogenic extraction module',
        businessModel: 'Hardware Lease + High Margin Per-Cup Direct Sales',
        launchStage: 'Field Testing / Beta',
      },
      undefined,
      'rebrand',
      userId
    );

    all.push(defaultNew, defaultRebrand);
    saveAllRawProjects(all);
    userProjects = [defaultNew, defaultRebrand];
  }

  return userProjects;
}

export interface PresetIdea {
  title: string;
  category: string;
  rawIdea: string;
  answers: {
    industry: string;
    customerType: string;
    unfairAdvantage: string;
    businessModel: string;
    launchStage: string;
  };
}

export const PRESET_IDEAS: PresetIdea[] = [
  {
    title: 'Aura Grid (Decentralized Clean Power)',
    category: 'Clean Energy & Infrastructure',
    rawIdea: 'Autonomous solar microgrid orchestrator for decentralized commercial power networks with dynamic spot-pricing battery discharge.',
    answers: {
      industry: 'Clean Energy & Infrastructure',
      customerType: 'Commercial Real Estate & Industrial Parks',
      unfairAdvantage: 'Proprietary predictive tariff-dispatch algorithm',
      businessModel: 'B2B SaaS + Performance Share',
      launchStage: 'Early Prototype / MVP',
    },
  },
  {
    title: 'Kinetix Roasters (Robotic Kiosks)',
    category: 'Smart Retail & FoodTech',
    rawIdea: 'Precision automated robotic cold-brew coffee kiosks for high-density tech campuses and transit hubs with personalized taste profiling.',
    answers: {
      industry: 'Smart Retail & FoodTech',
      customerType: 'Tech Campuses & Premium Transit Hubs',
      unfairAdvantage: 'Patented ultra-compact cryogenic extraction module',
      businessModel: 'Hardware Lease + High Margin Per-Cup Direct Sales',
      launchStage: 'Field Testing / Beta',
    },
  },
  {
    title: 'Veritas Compliance (Fintech Copilot)',
    category: 'Regulatory Tech & Finance',
    rawIdea: 'Autonomous continuous regulatory compliance copilot converting evolving multi-jurisdiction fintech directives into executable code rules.',
    answers: {
      industry: 'Regulatory Tech & Finance',
      customerType: 'Cross-Border Fintech & Neobanks',
      unfairAdvantage: 'Deterministic semantic parser mapped to 14 central bank frameworks',
      businessModel: 'Enterprise SaaS Tiered by Transaction Volume',
      launchStage: 'Production Ready',
    },
  },
];

// Get user-accessible projects only
export function getProjectsForUser(userId?: string): VentureProject[] {
  const currentUserId = userId || authService.getCurrentUser()?.id;
  if (!currentUserId) {
    // If not logged in, return temporary local projects or public demo project
    const all = getAllRawProjects();
    return all.filter((p) => !p.ownerId || p.ownerId === 'usr_demo_founder_01');
  }

  return ensureInitialProjectsForUser(currentUserId);
}

// Get user-accessible projects only (alias for getProjectsForUser)
export function getStoredProjects(userId?: string): VentureProject[] {
  return getProjectsForUser(userId);
}

// Get active project
export function getActiveProject(userId?: string): VentureProject | null {
  const userProjects = getProjectsForUser(userId);
  if (userProjects.length === 0) return null;

  const activeId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
  if (activeId) {
    const found = userProjects.find((p) => p.id === activeId);
    if (found) return found;
  }

  return userProjects[0];
}

// Set active project ID
export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
  } catch {}
}

// Save or update project
export function saveProject(project: VentureProject): void {
  const all = getAllRawProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const updatedProject: VentureProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    all[index] = updatedProject;
  } else {
    all.unshift(updatedProject);
  }

  saveAllRawProjects(all);
  setActiveProjectId(project.id);
}

// Create new blank project
export function createNewProject(
  projectType: ProjectType,
  title: string,
  rawIdea: string,
  userId?: string
): VentureProject {
  const ownerId = userId || authService.getCurrentUser()?.id || 'usr_guest';
  const newProject = generateVentureProject(
    rawIdea,
    {
      industry: 'General Enterprise & Innovation',
      customerType: 'Target Commercial Buyers',
      unfairAdvantage: 'Proprietary technology and operational efficiency',
      businessModel: 'B2B Commercial Subscription',
      launchStage: 'Early Prototype',
    },
    undefined,
    projectType,
    ownerId
  );

  if (title.trim()) {
    newProject.title = title.trim();
  }

  saveProject(newProject);
  return newProject;
}

// Duplicate project
export function duplicateProject(projectId: string, userId?: string): VentureProject {
  const all = getAllRawProjects();
  const source = all.find((p) => p.id === projectId);
  if (!source) throw new Error('Project not found');

  const duplicated: VentureProject = {
    ...JSON.parse(JSON.stringify(source)),
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: `${source.title} (Copy)`,
    ownerId: userId || source.ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    decisionHistory: [
      {
        id: `dec_${Date.now()}`,
        timestamp: new Date().toISOString(),
        workspace: 'onboarding',
        title: 'Project Duplicated',
        description: `Created independent copy from ${source.title}.`,
        actionType: 'create',
        affectsDownstreamWorkspaces: [],
      },
    ],
  };

  saveProject(duplicated);
  return duplicated;
}

// Rename project
export function renameProject(projectId: string, newTitle: string): void {
  const all = getAllRawProjects();
  const index = all.findIndex((p) => p.id === projectId);
  if (index >= 0) {
    all[index].title = newTitle.trim();
    all[index].updatedAt = new Date().toISOString();
    saveAllRawProjects(all);
  }
}

// Archive / Unarchive project
export function toggleArchiveProject(projectId: string): VentureProject | null {
  const all = getAllRawProjects();
  const index = all.findIndex((p) => p.id === projectId);
  if (index >= 0) {
    all[index].isArchived = !all[index].isArchived;
    all[index].updatedAt = new Date().toISOString();
    saveAllRawProjects(all);
    return all[index];
  }
  return null;
}

// Delete project
export function deleteProject(projectId: string): void {
  const all = getAllRawProjects();
  const filtered = all.filter((p) => p.id !== projectId);
  saveAllRawProjects(filtered);

  const activeId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
  if (activeId === projectId) {
    localStorage.removeItem(ACTIVE_PROJECT_ID_KEY);
  }
}

// Log a decision
export function logDecision(
  project: VentureProject,
  workspace: WorkspaceId | 'onboarding',
  title: string,
  description: string,
  actionType: 'approve' | 'refine' | 'edit' | 'create',
  affectsDownstream: WorkspaceId[] = []
): VentureProject {
  const newEntry: DecisionLogEntry = {
    id: `dec_${Date.now()}`,
    timestamp: new Date().toISOString(),
    workspace,
    title,
    description,
    actionType,
    affectsDownstreamWorkspaces: affectsDownstream,
  };

  const existingFlags = new Set(project.downstreamReviewFlags || []);
  affectsDownstream.forEach((ws) => existingFlags.add(ws));

  // Update corresponding workspace status
  const statuses = { ...(project.workspaceStatuses || {}) };
  if (workspace !== 'onboarding') {
    if (actionType === 'approve') {
      statuses[workspace] = 'Approved';
    } else if (actionType === 'refine' || actionType === 'edit') {
      statuses[workspace] = 'In Progress';
    }
  }

  // If downstream workspaces were affected, set them to Needs Revision
  affectsDownstream.forEach((ws) => {
    statuses[ws] = 'Needs Revision';
  });

  const updatedProject: VentureProject = {
    ...project,
    workspaceStatuses: statuses as any,
    decisionHistory: [newEntry, ...(project.decisionHistory || [])],
    downstreamReviewFlags: Array.from(existingFlags),
    updatedAt: new Date().toISOString(),
  };

  saveProject(updatedProject);
  return updatedProject;
}

// Dismiss downstream review flag
export function dismissDownstreamFlag(project: VentureProject, workspace: WorkspaceId): VentureProject {
  const flags = (project.downstreamReviewFlags || []).filter((w) => w !== workspace);
  const statuses = { ...(project.workspaceStatuses || {}) };
  if (statuses[workspace] === 'Needs Revision') {
    statuses[workspace] = 'In Progress';
  }

  const updatedProject: VentureProject = {
    ...project,
    workspaceStatuses: statuses as any,
    downstreamReviewFlags: flags,
  };
  saveProject(updatedProject);
  return updatedProject;
}
