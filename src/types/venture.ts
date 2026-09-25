export type WorkspaceId =
  | 'research-discovery'
  | 'brand-strategy'
  | 'design-studio'
  | 'market-launch'
  | 'complete-brand-kit';

export type MainView = 'landing' | 'questionnaire' | 'idea-understanding' | 'workspace';

export type SourceLabel = 'Verified Source' | 'User Provided' | 'AI Hypothesis' | 'Needs Testing';

export type CardResearchStatus = 'In Progress' | 'Needs Testing' | 'AI Hypothesis' | 'Verified' | 'Approved';

// Questionnaire
export interface QuestionnaireQuestion {
  id: string;
  question: string;
  category: string;
  description: string;
  options: { label: string; value: string; hint?: string }[];
}

export interface QuestionnaireAnswers {
  industry: string;
  customerType: string;
  unfairAdvantage: string;
  businessModel: string;
  launchStage: string;
}

// Idea Understanding
export type ProjectType = 'new_brand' | 'rebrand';

export type WorkspaceStatus = 'Not Started' | 'In Progress' | 'Ready for Review' | 'Approved' | 'Needs Revision';

export interface DynamicQuestion {
  id: string;
  title: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  category?: string;
}

export interface RebrandDetails {
  currentIdentity: string;
  currentCustomers: string;
  reasonsForRebranding: string;
  desiredChanges: string;
  elementsToPreserve: string;
}

export interface IdeaUnderstanding {
  projectName?: string;
  projectType: ProjectType;
  businessCategory: string;
  businessDescription: string;
  productOrService: string;
  problemBeingSolved: string;
  coreValue: string;
  potentialCustomers: string;
  differentiation: string;
  businessGoals: string;
  constraints: string[];
  importantAssumptions: string[];
  unresolvedQuestions: string[];
  rebrandDetails?: RebrandDetails;

  // Backward compatibility fields
  corePremise: string;
  primaryProblem: string;
  targetAudienceSummary: string;
  unfairAdvantage: string;
  businessModelSummary: string;
  unresolvedAssumptions: string[];
  suggestedFocusAreas: string[];
}

// ==========================================
// 1. Research & Discovery Types
// ==========================================

export type ResearchCardId =
  | 'target-audience'
  | 'market-opportunity'
  | 'product-feasibility'
  | 'competitive-analysis'
  | 'risks-drawbacks'
  | 'development-roadmap';

export type ResearchToolId =
  | 'canvas'
  | 'what-if'
  | 'competitors'
  | 'validation';

export interface CustomerPersona {
  id: string;
  name: string;
  role: string;
  avatarSeed: string;
  demographics: string;
  psychographics: string;
  dailyFriction: string;
  budgetAuthority: string;
  adoptionTrigger: string;
  sourceLabel: SourceLabel;
}

export interface TargetAudienceData {
  summary: string;
  status: CardResearchStatus;
  segments: {
    name: string;
    sharePercent: number;
    tamContribution: string;
    readiness: 'High' | 'Medium' | 'Low';
    primaryNeed: string;
  }[];
  personas: CustomerPersona[];
  painPoints: {
    friction: string;
    severity: 'Critical' | 'Moderate' | 'Low';
    currentWorkaround: string;
    opportunityScore: number;
    sourceLabel: SourceLabel;
  }[];
  behaviorComparisons: {
    dimension: string;
    earlyAdopter: string;
    mainstream: string;
    enterprise: string;
  }[];
  charts: {
    willingnessToPay: { tier: string; percentage: number }[];
    retentionPotential: { month: string; rate: number }[];
  };
}

export interface MarketOpportunityData {
  summary: string;
  status: CardResearchStatus;
  tam: string;
  sam: string;
  som: string;
  cagrPercent: number;
  timeframe: string;
  trends: {
    title: string;
    impact: 'Tailwind' | 'Headwind' | 'Catalyst';
    description: string;
    source: string;
    sourceLabel: SourceLabel;
  }[];
  barriersToEntry: {
    barrier: string;
    defenseStrategy: string;
    defensibilityScore: number; // 1-10
  }[];
  sourceCitations: {
    institution: string;
    metric: string;
    credibility: 'High' | 'Medium' | 'Illustrative Demo';
    sourceLabel: SourceLabel;
    note: string;
  }[];
  uncertaintyAnalysis: {
    variable: string;
    varianceRange: string;
    sensitivityLevel: 'High' | 'Medium' | 'Low';
    comment: string;
  }[];
}

export interface ProductFeasibilityData {
  summary: string;
  status: CardResearchStatus;
  technicalConsiderations: {
    domain: string;
    complexity: 'High' | 'Medium' | 'Low';
    architecturePath: string;
    stackRecommendation: string;
    sourceLabel: SourceLabel;
  }[];
  costAssumptions: {
    category: string;
    monthlyBurnEstimate: string;
    unitCost: string;
    notes: string;
  }[];
  testingRequirements: {
    testName: string;
    objective: string;
    targetBenchmark: string;
    status: 'Pending' | 'In Progress' | 'Passed';
  }[];
  feasibilityMatrix: {
    feature: string;
    technicalComplexity: number; // 1-10
    userImpact: number; // 1-10
    priority: 'MVP' | 'V1' | 'Backlog';
  }[];
  unresolvedProductClaims: {
    claim: string;
    riskIfFalse: string;
    validationMethod: string;
    sourceLabel: SourceLabel;
  }[];
}

export interface CompetitorProfile {
  id: string;
  name: string;
  category: 'Direct' | 'Indirect' | 'Legacy';
  marketShare: string;
  pricingModel: string;
  strengths: string[];
  vulnerabilities: string[];
  differentiationAngle: string;
  sourceLabel: SourceLabel;
}

export interface CompetitiveAnalysisData {
  summary: string;
  status: CardResearchStatus;
  competitors: CompetitorProfile[];
  comparisonMatrix: {
    feature: string;
    ourProduct: boolean | string;
    competitorA: boolean | string;
    competitorB: boolean | string;
    competitorC: boolean | string;
  }[];
  positioningCoordinates: {
    competitorName: string;
    xValue: number; // e.g. Ease of use (0 to 100)
    yValue: number; // e.g. Depth / Automation (0 to 100)
    isUs?: boolean;
  }[];
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Market' | 'Technical' | 'Financial' | 'Regulatory' | 'Operational';
  probability: number; // 1-5
  severity: number; // 1-5
  evidenceLog: string;
  mitigationAction: string;
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Monitoring';
  sourceLabel: SourceLabel;
}

export interface RisksDrawbacksData {
  summary: string;
  status: CardResearchStatus;
  risks: RiskItem[];
  unresolvedAssumptions: {
    assumption: string;
    dangerLevel: 'Critical' | 'High' | 'Moderate';
    testToInvalidate: string;
  }[];
}

export interface MilestoneCard {
  id: string;
  phase: 'Phase 1: Proof & MVP' | 'Phase 2: Closed Beta' | 'Phase 3: Public Launch' | 'Phase 4: Scale';
  title: string;
  targetDuration: string;
  dependencies: string[];
  deliverables: { text: string; completed: boolean }[];
  status: 'Ready' | 'In Progress' | 'Planned';
}

export interface DevelopmentRoadmapData {
  summary: string;
  status: CardResearchStatus;
  milestones: MilestoneCard[];
  keyDependencies: {
    item: string;
    dependentOn: string;
    criticalPath: boolean;
  }[];
}

// Research Tools
export interface CanvasNode {
  id: string;
  title: string;
  description: string;
  category: 'Core' | 'Product' | 'Market' | 'Feature' | 'Distribution';
  x: number;
  y: number;
  connectedTo: string[]; // array of node IDs
}

export interface SimulatorInputs {
  cac: number; // Customer acquisition cost ($)
  monthlyChurnPercent: number; // Churn %
  arpu: number; // Average revenue per user / mo ($)
  conversionRatePercent: number; // Visitors to paying customers %
  monthlyBurn: number; // Monthly team & infra burn ($)
  initialCapital: number; // Starting runway capital ($)
  monthlyVisitors: number; // Monthly traffic volume
}

export interface SurveyResponse {
  id: string;
  respondentRole: string;
  npsScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  topRequestedFeature: string;
  userQuote: string;
  willingnessToPay: string;
}

// ==========================================
// 2. Brand Strategy Types
// ==========================================

export interface AudiencePositioningCard {
  personaName: string;
  segmentTag: string;
  coreValueAnchor: string;
  tailoredHeadline: string;
  tailoredValueProposition: string;
  primaryProofPoint: string;
  keyObjection: string;
  rebuttal: string;
  callToAction: string;
}

export interface MessagingAlternative {
  id: string;
  label: string;
  tone: string;
  headline: string;
  subheadline: string;
  elevatorPitch: string;
  bestForAudience: string;
  isSelected: boolean;
}

export interface MarketingChannelComparison {
  channel: string;
  cacEstimate: string;
  ltvEstimate: string;
  channelFitScore: number; // 1-10
  organicVsPaid: 'Organic' | 'Paid' | 'Hybrid';
  pros: string;
  cons: string;
}

export interface PricingTierModel {
  name: string;
  pricePerMonth: string;
  targetUser: string;
  features: string[];
  isRecommended?: boolean;
  marginEstimate: string;
}

export interface ConsistencyCheckAlert {
  id: string;
  severity: 'Warning' | 'Passed' | 'Review';
  message: string;
  affectedElement: string;
  remedyAction: string;
}

export interface BrandStrategyData {
  approvedCoreValue: string;
  audiencePositionings: AudiencePositioningCard[];
  messagingAlternatives: MessagingAlternative[];
  channelComparisons: MarketingChannelComparison[];
  pricingModels: PricingTierModel[];
  strategicScenarios: {
    name: string;
    hypothesis: string;
    downsideRisk: string;
    upsidePotential: string;
    strategyAdjustment: string;
  }[];
  consistencyChecker: {
    overallAlignmentScore: number; // 0-100
    alerts: ConsistencyCheckAlert[];
    lastAudited: string;
  };
}

// ==========================================
// 3. Design Studio Types
// ==========================================

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: 'Primary' | 'Surface' | 'Background' | 'Accent' | 'Text';
}

export interface BrandDirection {
  id: 'direction-a' | 'direction-b' | 'direction-c';
  title: string;
  tagline: string;
  vibe: string;
  suggestedNames: { name: string; rationale: string; isAvailableDomainIdea: string }[];
  logoConceptBrief: {
    markDescription: string;
    iconSymbol: string;
    constructionNotes: string;
  };
  colorPalette: ColorSwatch[];
  typographyPreview: {
    displayFace: string;
    displaySample: string;
    bodyFace: string;
    bodySample: string;
    monoFace: string;
    monoSample: string;
  };
  moodboardKeywords: string[];
  imageryDirection: {
    artStyle: string;
    lightingAndTone: string;
    guidelines: string[];
    samplePrompt: string;
  };
  packagingConcept: {
    style: string;
    materials: string;
    tactileFinish: string;
    notes: string;
  };
  socialDesignDirection: {
    platform: string;
    cardStyle: string;
    templateSummary: string;
  }[];
  uiUxConcepts: {
    cornerRounding: string;
    shadowStyle: string;
    elevationLevel: string;
    buttonTokens: string;
  };
  websiteTemplateInspiration: {
    layoutType: string;
    heroStructure: string;
    navStyle: string;
  };
}

export interface DesignStudioData {
  activeDirectionId: 'direction-a' | 'direction-b' | 'direction-c';
  directions: BrandDirection[];
  customCombinations: {
    selectedPaletteDirection: 'direction-a' | 'direction-b' | 'direction-c';
    selectedTypographyDirection: 'direction-a' | 'direction-b' | 'direction-c';
    selectedLogoDirection: 'direction-a' | 'direction-b' | 'direction-c';
    selectedImageryDirection: 'direction-a' | 'direction-b' | 'direction-c';
  };
}

// ==========================================
// 4. Market & Launch Types
// ==========================================

export interface LaunchCampaignCard {
  id: string;
  name: string;
  phase: string;
  primaryChannel: string;
  budgetAllocated: string;
  targetKpi: string;
  deliverable: string;
  status: 'Planned' | 'In Progress' | 'Complete';
}

export interface LaunchReadinessItem {
  id: string;
  title: string;
  targetWorkspace: WorkspaceId;
  targetSection: string;
  isComplete: boolean;
  severity: 'Blocker' | 'Important' | 'Optional';
  actionPrompt: string;
}

export interface MarketLaunchData {
  launchTimeline: {
    phaseName: string;
    duration: string;
    focus: string;
    milestones: string[];
  }[];
  campaigns: LaunchCampaignCard[];
  distributionChannels: {
    channel: string;
    strategy: string;
    priority: 'Core' | 'Secondary' | 'Experimental';
    projectedAcquisitionPercent: number;
  }[];
  budgetBreakdown: {
    category: string;
    percentage: number;
    amountFormatted: string;
  }[];
  readinessChecker: LaunchReadinessItem[];
}

// ==========================================
// 5. Complete Brand Kit Types
// ==========================================

export interface BrandKitSectionToggle {
  id: string;
  title: string;
  included: boolean;
  description: string;
}

export interface CompleteBrandKitData {
  executiveSummary: string;
  sections: BrandKitSectionToggle[];
  customNotes: string;
  lastGenerated: string;
}

// ==========================================
// Global Decision History & Venture Project
// ==========================================

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  workspace: WorkspaceId | 'onboarding';
  title: string;
  description: string;
  actionType: 'approve' | 'refine' | 'edit' | 'create';
  affectsDownstreamWorkspaces: WorkspaceId[];
}

export interface VentureProject {
  id: string;
  ownerId?: string;
  projectType: ProjectType;
  brandCategory: string;
  isArchived?: boolean;
  title: string;
  tagline: string;
  createdAt: string;
  updatedAt: string;
  rawIdea: string;
  questionnaire: QuestionnaireAnswers;
  dynamicQuestions?: DynamicQuestion[];
  dynamicAnswers?: Record<string, string>;
  understanding: IdeaUnderstanding;
  workspaceStatuses: Record<WorkspaceId, WorkspaceStatus>;
  researchDiscovery: {
    targetAudience: TargetAudienceData;
    marketOpportunity: MarketOpportunityData;
    productFeasibility: ProductFeasibilityData;
    competitiveAnalysis: CompetitiveAnalysisData;
    risksDrawbacks: RisksDrawbacksData;
    developmentRoadmap: DevelopmentRoadmapData;
    brainstormNodes: CanvasNode[];
    simulatorInputs: SimulatorInputs;
    surveyResponses: SurveyResponse[];
  };
  brandStrategy: BrandStrategyData;
  designStudio: DesignStudioData;
  marketLaunch: MarketLaunchData;
  brandKit: CompleteBrandKitData;
  decisionHistory: DecisionLogEntry[];
  downstreamReviewFlags: WorkspaceId[];
}
