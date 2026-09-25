import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { VentureProject, ProjectType, WorkspaceId, DecisionLogEntry } from '../types/venture';
import { generateVentureProject } from './ventureGenerator';

const PROJECTS_COLLECTION = 'projects';
const ACTIVE_PROJECT_ID_KEY = 'stratum_active_venture_id_v2';

// Meaningful Progress Calculation based on actual workflow states
export function calculateProjectProgress(project: VentureProject): number {
  if (!project || !project.researchDiscovery) return 10;
  let score = 0;

  // 1. Research & Discovery (Weight: 35)
  const cards = [
    project.researchDiscovery.targetAudience?.status,
    project.researchDiscovery.marketOpportunity?.status,
    project.researchDiscovery.productFeasibility?.status,
    project.researchDiscovery.competitiveAnalysis?.status,
    project.researchDiscovery.risksDrawbacks?.status,
    project.researchDiscovery.developmentRoadmap?.status,
  ];
  const approvedCards = cards.filter((s) => s === 'Approved').length;
  const verifiedCards = cards.filter((s) => s === 'Verified' || s === 'Approved').length;
  score += ((approvedCards * 1.0 + (verifiedCards - approvedCards) * 0.7) / cards.length) * 35;

  // 2. Brand Strategy (Weight: 25)
  if (project.brandStrategy) {
    const strategyScore = project.brandStrategy.consistencyChecker?.overallAlignmentScore || 80;
    const selectedMsg = project.brandStrategy.messagingAlternatives?.some((a) => a.isSelected);
    const selectedPricing = project.brandStrategy.pricingModels?.some((p) => p.isRecommended);
    score += ((strategyScore / 100) * 0.6 + (selectedMsg ? 0.2 : 0) + (selectedPricing ? 0.2 : 0)) * 25;
  }

  // 3. Design Studio (Weight: 15)
  if (project.designStudio) {
    const hasDirection = !!project.designStudio.activeDirectionId;
    score += (hasDirection ? 1.0 : 0.2) * 15;
  }

  // 4. Market & Launch Readiness (Weight: 15)
  if (project.marketLaunch) {
    const readiness = project.marketLaunch.readinessChecker || [];
    const completedChecks = readiness.filter((r) => r.isComplete).length;
    const readinessRatio = readiness.length > 0 ? completedChecks / readiness.length : 0.3;
    score += readinessRatio * 15;
  }

  // 5. Complete Brand Kit (Weight: 10)
  if (project.brandKit) {
    const hasKit = (project.brandKit.sections || []).filter((s) => s.included).length >= 4;
    score += (hasKit ? 1.0 : 0.3) * 10;
  }

  return Math.min(100, Math.max(5, Math.round(score)));
}

// Local Storage Fallback Cache (for offline resilience and instant initialization)
function getLocalProjects(): VentureProject[] {
  try {
    const raw = localStorage.getItem('stratum_multi_projects_v2');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: VentureProject[]) {
  try {
    localStorage.setItem('stratum_multi_projects_v2', JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to cache projects locally:', e);
  }
}

export const firestoreVentureService = {
  // Subscribe to real-time project updates for the authenticated user
  subscribeToUserProjects(
    userId: string,
    onProjectsUpdated: (projects: VentureProject[]) => void,
    onError?: (error: Error) => void
  ) {
    if (!userId) {
      onProjectsUpdated([]);
      return () => {};
    }

    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('ownerId', '==', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const projects: VentureProject[] = [];
        snapshot.forEach((docSnap) => {
          projects.push(docSnap.data() as VentureProject);
        });

        // Sort by updatedAt descending
        projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        // Cache locally for offline availability
        if (projects.length > 0) {
          saveLocalProjects(projects);
        }

        onProjectsUpdated(projects);
      },
      (error) => {
        console.warn('Firestore subscription warning, using local cache:', error);
        const local = getLocalProjects().filter((p) => p.ownerId === userId);
        onProjectsUpdated(local);
        if (onError) onError(error);
      }
    );
  },

  // Fetch all projects for a specific user from Firestore
  async getProjectsForUser(userId: string): Promise<VentureProject[]> {
    if (!userId) {
      return getLocalProjects().filter((p) => !p.ownerId || p.ownerId === 'usr_demo_founder_01');
    }

    try {
      const q = query(
        collection(db, PROJECTS_COLLECTION),
        where('ownerId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const projects: VentureProject[] = [];
      snapshot.forEach((docSnap) => {
        projects.push(docSnap.data() as VentureProject);
      });

      if (projects.length > 0) {
        projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        saveLocalProjects(projects);
        return projects;
      }
    } catch (err) {
      console.warn('Could not fetch projects from Firestore, falling back to local storage:', err);
    }

    // If Firestore has no projects or fails, check local cache
    const cached = getLocalProjects().filter((p) => p.ownerId === userId);
    if (cached.length > 0) {
      return cached;
    }

    // Seed default starter projects for new users
    return await this.seedInitialProjects(userId);
  },

  // Seed default initial projects for a user into Firestore
  async seedInitialProjects(userId: string): Promise<VentureProject[]> {
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

    const initial = [defaultNew, defaultRebrand];

    for (const proj of initial) {
      try {
        await this.saveProject(proj);
      } catch (err) {
        console.warn('Could not seed project to Firestore:', err);
      }
    }

    const allCached = getLocalProjects();
    saveLocalProjects([...initial, ...allCached.filter((p) => p.ownerId !== userId)]);
    return initial;
  },

  // Save or update a project in Firestore with local cache mirroring
  async saveProject(project: VentureProject): Promise<void> {
    const updated: VentureProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    // Update local cache immediately for zero-latency UX
    const cached = getLocalProjects();
    const idx = cached.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      cached[idx] = updated;
    } else {
      cached.unshift(updated);
    }
    saveLocalProjects(cached);
    this.setActiveProjectId(project.id);

    // Persist to Firestore if user is authenticated and is owner
    const currentUid = auth.currentUser?.uid;
    if (currentUid && project.ownerId === currentUid) {
      try {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        await setDoc(projectRef, updated, { merge: true });
      } catch (err) {
        console.error('Failed to sync project to Firestore:', err);
      }
    }
  },

  // Create a new blank project
  async createNewProject(
    projectType: ProjectType,
    title: string,
    rawIdea: string,
    userId?: string
  ): Promise<VentureProject> {
    const ownerId = userId || auth.currentUser?.uid || 'usr_guest';
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

    await this.saveProject(newProject);
    return newProject;
  },

  // Duplicate an existing project
  async duplicateProject(projectId: string, userId?: string): Promise<VentureProject> {
    const currentUid = userId || auth.currentUser?.uid;
    const all = await this.getProjectsForUser(currentUid || '');
    const source = all.find((p) => p.id === projectId);
    if (!source) throw new Error('Project not found to duplicate');

    const duplicated: VentureProject = {
      ...JSON.parse(JSON.stringify(source)),
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${source.title} (Copy)`,
      ownerId: currentUid || source.ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      decisionHistory: [
        {
          id: `dec_${Date.now()}`,
          timestamp: new Date().toISOString(),
          workspace: 'onboarding',
          title: 'Project Duplicated',
          description: `Created independent duplicate from ${source.title}.`,
          actionType: 'create',
          affectsDownstreamWorkspaces: [],
        },
      ],
    };

    await this.saveProject(duplicated);
    return duplicated;
  },

  // Rename a project
  async renameProject(projectId: string, newTitle: string): Promise<void> {
    const currentUid = auth.currentUser?.uid;
    const all = await this.getProjectsForUser(currentUid || '');
    const proj = all.find((p) => p.id === projectId);
    if (proj) {
      proj.title = newTitle.trim();
      await this.saveProject(proj);
    }
  },

  // Archive or unarchive a project
  async toggleArchiveProject(projectId: string): Promise<VentureProject | null> {
    const currentUid = auth.currentUser?.uid;
    const all = await this.getProjectsForUser(currentUid || '');
    const proj = all.find((p) => p.id === projectId);
    if (proj) {
      proj.isArchived = !proj.isArchived;
      await this.saveProject(proj);
      return proj;
    }
    return null;
  },

  // Delete a project from Firestore and local cache
  async deleteProject(projectId: string): Promise<void> {
    // Delete from local cache
    const cached = getLocalProjects().filter((p) => p.id !== projectId);
    saveLocalProjects(cached);

    // Delete from Firestore
    try {
      const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
      await deleteDoc(projectRef);
    } catch (err) {
      console.warn('Could not delete project from Firestore:', err);
    }

    // Clear active project pointer if deleting active
    const activeId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
    if (activeId === projectId) {
      localStorage.removeItem(ACTIVE_PROJECT_ID_KEY);
    }
  },

  // Get active project ID
  getActiveProjectId(): string | null {
    return localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
  },

  // Set active project ID
  setActiveProjectId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
    } catch {}
  },

  // Log a decision with downstream workspace review flags
  async logDecision(
    project: VentureProject,
    workspace: WorkspaceId | 'onboarding',
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit' | 'create',
    affectsDownstream: WorkspaceId[] = []
  ): Promise<VentureProject> {
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

    // Downstream affected workspaces flag Needs Revision
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

    await this.saveProject(updatedProject);
    return updatedProject;
  },

  // Dismiss a downstream flag
  async dismissDownstreamFlag(project: VentureProject, workspace: WorkspaceId): Promise<VentureProject> {
    const flags = (project.downstreamReviewFlags || []).filter((w) => w !== workspace);
    const statuses = { ...(project.workspaceStatuses || {}) };
    if (statuses[workspace] === 'Needs Revision') {
      statuses[workspace] = 'In Progress';
    }

    const updatedProject: VentureProject = {
      ...project,
      workspaceStatuses: statuses as any,
      downstreamReviewFlags: flags,
      updatedAt: new Date().toISOString(),
    };

    await this.saveProject(updatedProject);
    return updatedProject;
  },
};
