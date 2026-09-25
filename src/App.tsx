import React, { useState, useEffect } from 'react';
import {
  WorkspaceId,
  VentureProject,
  QuestionnaireAnswers,
  IdeaUnderstanding,
  ProjectType,
  DynamicQuestion,
} from './types/venture';
import {
  getActiveProject,
  getStoredProjects,
  saveProject,
  logDecision,
  dismissDownstreamFlag,
  setActiveProjectId,
} from './services/ventureStorage';
import { firestoreVentureService } from './services/firestoreVentureService';
import { generateVentureProject } from './services/ventureGenerator';
import { useAuth } from './context/AuthContext';

// Navigation & Shell Components
import { LeftSidebar } from './components/Navigation/LeftSidebar';
import { TopBar } from './components/Navigation/TopBar';
import { ContextualAiAssistant } from './components/ContextualAiAssistant';
import { DecisionHistoryDrawer } from './components/DecisionHistoryDrawer';
import { AuthModal } from './components/AuthModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { Toast } from './components/Toast';
import { MouseTrail } from './components/MouseTrail';

// Screens
import { PublicLandingScreen } from './components/screens/PublicLandingScreen';
import { ProjectDashboardScreen } from './components/screens/ProjectDashboardScreen';
import { CustomizableQuestionnaireScreen } from './components/screens/CustomizableQuestionnaireScreen';
import { ResearchDiscoveryScreen } from './components/screens/ResearchDiscoveryScreen';
import { BrandStrategyScreen } from './components/screens/BrandStrategyScreen';
import { DesignStudioScreen } from './components/screens/DesignStudioScreen';
import { MarketLaunchScreen } from './components/screens/MarketLaunchScreen';
import { BrandKitScreen } from './components/screens/BrandKitScreen';

export type AppView = 'landing' | 'dashboard' | 'onboarding' | 'workspace';

export default function App() {
  const { user, theme, toggleTheme } = useAuth();
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('research-discovery');
  const [project, setProject] = useState<VentureProject | null>(() => getActiveProject());
  const [savedProjects, setSavedProjects] = useState<VentureProject[]>(() => getStoredProjects());
  const [onboardingType, setOnboardingType] = useState<ProjectType>('new_brand');

  // Drawers
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isDecisionHistoryOpen, setIsDecisionHistoryOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User auth state transitions: navigate to 'dashboard' on login, 'landing' on logout
  const prevUserRef = React.useRef<string | null>(user?.id || null);
  useEffect(() => {
    if (!prevUserRef.current && user?.id) {
      // User just logged in
      setActiveView('dashboard');
    } else if (prevUserRef.current && !user?.id) {
      // User just logged out
      setActiveView('landing');
    }
    prevUserRef.current = user?.id || null;
  }, [user?.id]);

  // Real-time Firestore sync on user change
  useEffect(() => {
    if (!user?.id) {
      firestoreVentureService.getProjectsForUser('').then((list) => {
        setSavedProjects(list);
        if (!project && list.length > 0) {
          setProject(list[0]);
        }
      });
      return;
    }

    const unsubscribe = firestoreVentureService.subscribeToUserProjects(
      user.id,
      (list) => {
        setSavedProjects(list);
        setProject((current) => {
          if (!current || current.ownerId !== user.id) {
            const activeId = localStorage.getItem('stratum_active_venture_id_v2');
            const found = list.find((p) => p.id === activeId);
            return found || list[0] || null;
          }
          const updatedCurrent = list.find((p) => p.id === current.id);
          return updatedCurrent || current;
        });
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  // Project Title Update
  const handleUpdateProjectTitle = async (newTitle: string) => {
    if (!project) return;
    const updated = { ...project, title: newTitle.trim(), updatedAt: new Date().toISOString() };
    setProject(updated);
    await firestoreVentureService.saveProject(updated);
  };

  // Create & Initialize New Project from Customizable Questionnaire
  const handleConfirmAndProceed = async (
    rawIdea: string,
    answers: QuestionnaireAnswers,
    customUnderstanding?: Partial<IdeaUnderstanding>,
    projectType: ProjectType = 'new_brand',
    dynamicQuestions?: DynamicQuestion[],
    dynamicAnswers?: Record<string, string>
  ) => {
    const newProject = generateVentureProject(
      rawIdea,
      answers,
      customUnderstanding,
      projectType,
      user?.id
    );

    if (dynamicQuestions) {
      newProject.dynamicQuestions = dynamicQuestions;
    }
    if (dynamicAnswers) {
      newProject.dynamicAnswers = dynamicAnswers;
    }

    await firestoreVentureService.saveProject(newProject);
    firestoreVentureService.setActiveProjectId(newProject.id);
    setProject(newProject);
    setActiveWorkspace('research-discovery');
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Project & Switch Workspace
  const handleOpenProject = (selected: VentureProject, targetWorkspace?: WorkspaceId) => {
    firestoreVentureService.setActiveProjectId(selected.id);
    setProject(selected);
    if (targetWorkspace) {
      setActiveWorkspace(targetWorkspace);
    }
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch Workspace inside Shell
  const handleSelectWorkspace = (wsId: WorkspaceId) => {
    setActiveWorkspace(wsId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update Project state with Firestore persistence
  const handleUpdateProject = async (updated: VentureProject) => {
    setProject(updated);
    await firestoreVentureService.saveProject(updated);
  };

  // Decision Logging with Downstream Flags & Firestore persistence
  const handleLogDecision = async (
    title: string,
    description: string,
    actionType: 'approve' | 'refine' | 'edit',
    affectsDownstream: WorkspaceId[] = []
  ) => {
    if (!project) return;
    const updated = await firestoreVentureService.logDecision(
      project,
      activeWorkspace,
      title,
      description,
      actionType,
      affectsDownstream
    );
    setProject(updated);
  };

  // Dismiss Downstream Flag with Firestore persistence
  const handleDismissReviewFlag = async (wsId: WorkspaceId) => {
    if (!project) return;
    const updated = await firestoreVentureService.dismissDownstreamFlag(project, wsId);
    setProject(updated);
  };

  // Start Onboarding Flow for New Brand or Rebrand
  const handleStartOnboarding = (type: ProjectType) => {
    setOnboardingType(type);
    setActiveView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F1EEE4] dark:bg-[#121212] flex flex-col font-sans text-[#1C1917] dark:text-[#F5F3EC] selection:bg-[#FF6124] selection:text-white transition-colors duration-200">
      {/* Interactive Subtle Mouse Trail Effect */}
      <MouseTrail />

      {/* VIEW 1: PUBLIC HOMEPAGE */}
      {activeView === 'landing' && (
        <PublicLandingScreen
          onStartJourney={handleStartOnboarding}
          onGoToDashboard={() => setActiveView('dashboard')}
          onGoToWorkspace={() => setActiveView('workspace')}
          activeProject={project}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* VIEW 2: MULTI-PROJECT MANAGEMENT DASHBOARD */}
      {activeView === 'dashboard' && (
        <ProjectDashboardScreen
          onOpenProject={handleOpenProject}
          onNewBrand={() => handleStartOnboarding('new_brand')}
          onNewRebrand={() => handleStartOnboarding('rebrand')}
          onGoToHome={() => setActiveView('landing')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* VIEW 3: CUSTOMIZABLE QUESTIONNAIRE & AI UNDERSTANDING FLOW */}
      {activeView === 'onboarding' && (
        <CustomizableQuestionnaireScreen
          initialProjectType={onboardingType}
          onConfirmAndProceed={handleConfirmAndProceed}
          onBackToHome={() => setActiveView('landing')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* VIEW 4: APPLICATION SHELL (EXACTLY 5 WORKSPACES) */}
      {activeView === 'workspace' && (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar displaying active project, progress, autosave status, and theme controls */}
          <TopBar
            project={project}
            savedProjects={savedProjects}
            onSelectProject={(selected) => handleOpenProject(selected)}
            activeWorkspace={activeWorkspace}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenDecisionHistory={() => setIsDecisionHistoryOpen(true)}
            isAiAssistantOpen={isAiAssistantOpen}
            onToggleAiAssistant={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onUpdateProjectTitle={handleUpdateProjectTitle}
            onGoToDashboard={() => setActiveView('dashboard')}
            onGoToHome={() => setActiveView('landing')}
          />

          <div className="flex-1 flex min-h-0">
            {/* Desktop Persistent Left Sidebar containing EXACTLY FIVE workspaces */}
            <div className="hidden md:block">
              <LeftSidebar
                activeWorkspace={activeWorkspace}
                onSelectWorkspace={handleSelectWorkspace}
                project={project}
                onNewProject={() => handleStartOnboarding('new_brand')}
                onOpenDecisionHistory={() => setIsDecisionHistoryOpen(true)}
                onGoToLanding={() => setActiveView('landing')}
                onGoToDashboard={() => setActiveView('dashboard')}
              />
            </div>

            {/* Mobile Drawer Sidebar */}
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 flex md:hidden">
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FAF8F3] dark:bg-[#181818] z-50 shadow-2xl animate-in slide-in-from-left duration-200">
                  <LeftSidebar
                    activeWorkspace={activeWorkspace}
                    onSelectWorkspace={handleSelectWorkspace}
                    project={project}
                    onNewProject={() => {
                      setIsMobileSidebarOpen(false);
                      handleStartOnboarding('new_brand');
                    }}
                    onOpenDecisionHistory={() => {
                      setIsMobileSidebarOpen(false);
                      setIsDecisionHistoryOpen(true);
                    }}
                    onGoToLanding={() => {
                      setIsMobileSidebarOpen(false);
                      setActiveView('landing');
                    }}
                    onGoToDashboard={() => {
                      setIsMobileSidebarOpen(false);
                      setActiveView('dashboard');
                    }}
                  />
                </div>
              </div>
            )}

            {/* Large Central Workspace Area */}
            <main className="flex-1 min-w-0 overflow-y-auto bg-[#F1EEE4] dark:bg-[#121212] transition-colors">
              {project && (
                <>
                  {activeWorkspace === 'research-discovery' && (
                    <ResearchDiscoveryScreen
                      project={project}
                      onUpdateProject={handleUpdateProject}
                      onLogDecision={handleLogDecision}
                      onNavigateWorkspace={handleSelectWorkspace}
                    />
                  )}

                  {activeWorkspace === 'brand-strategy' && (
                    <BrandStrategyScreen
                      project={project}
                      onUpdateProject={handleUpdateProject}
                      onLogDecision={handleLogDecision}
                      onNavigateWorkspace={handleSelectWorkspace}
                    />
                  )}

                  {activeWorkspace === 'design-studio' && (
                    <DesignStudioScreen
                      project={project}
                      onUpdateProject={handleUpdateProject}
                      onLogDecision={handleLogDecision}
                      onNavigateWorkspace={handleSelectWorkspace}
                    />
                  )}

                  {activeWorkspace === 'market-launch' && (
                    <MarketLaunchScreen
                      project={project}
                      onUpdateProject={handleUpdateProject}
                      onLogDecision={handleLogDecision}
                      onNavigateWorkspace={handleSelectWorkspace}
                    />
                  )}

                  {activeWorkspace === 'complete-brand-kit' && (
                    <BrandKitScreen
                      project={project}
                      onUpdateProject={handleUpdateProject}
                      onLogDecision={handleLogDecision}
                    />
                  )}
                </>
              )}
            </main>
          </div>

          {/* Collapsible Contextual AI Assistant Panel (Drawer) */}
          <ContextualAiAssistant
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            activeWorkspace={activeWorkspace}
            project={project}
            onApplySuggestion={(sug) => {
              handleLogDecision(
                'Applied Contextual AI Recommendation',
                `Applied: "${sug}"`,
                'refine'
              );
              setIsAiAssistantOpen(false);
            }}
          />

          {/* Decision History Panel (Drawer) */}
          <DecisionHistoryDrawer
            isOpen={isDecisionHistoryOpen}
            onClose={() => setIsDecisionHistoryOpen(false)}
            project={project}
            onDismissReviewFlag={handleDismissReviewFlag}
            onJumpToWorkspace={handleSelectWorkspace}
          />
        </div>
      )}

      {/* Global Modals & Notifications */}
      <AuthModal />
      <AccountSettingsModal />
      <Toast />
    </div>
  );
}
