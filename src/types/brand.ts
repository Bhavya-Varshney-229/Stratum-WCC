export type WorkflowStep =
  | 'landing'
  | 'product'
  | 'understand'
  | 'lock-value'
  | 'select-audiences'
  | 'audience-shift'
  | 'consistency-check'
  | 'deliver'
  | 'dashboard'
  | 'settings';

export interface ProductIdea {
  title: string;
  rawIdea: string;
  industry?: string;
  targetAudience?: string;
  problemSolved?: string;
}

export interface ProductUnderstanding {
  coreProblem: string;
  targetUsers: string;
  productPurpose: string;
  coreValue: string;
  productPromise: string;
  nonNegotiablePrinciples: string[];
}

export interface CoreValueLock {
  coreValue: string;
  isLocked: boolean;
  lockedTimestamp?: string;
  originalExtractedValue: string;
}

export interface AudienceOption {
  id: string;
  name: string;
  shortLabel: string;
  category: string;
  description: string;
  avatarIcon: string; // lucide icon identifier
  defaultSelected?: boolean;
}

export interface ShiftComparisonMetric {
  from: string;
  to: string;
  explanation: string;
}

export interface AudienceBrandShift {
  audienceId: string;
  audienceName: string;
  whyAdaptation: string; // e.g. "This audience may respond better to simple, friendly language that emphasizes independence..."
  audienceProfile: {
    demographics: string;
    mindset: string;
    primaryObjection: string;
  };
  positioning: string;
  personality: {
    traits: string[];
    vibe: string;
  };
  toneOfVoice: string;
  keyMotivation: string;
  painPointEmphasis: string;
  tagline: string;
  exampleHeadline: string;
  exampleMessage: string;
  callToAction: string;
  visualDirection: {
    paletteName: string;
    accentHex: string;
    bgHex: string;
    textHex: string;
    mood: string;
  };
  whatChanged: {
    tone: ShiftComparisonMetric;
    messaging: ShiftComparisonMetric;
    positioning: ShiftComparisonMetric;
    cta: ShiftComparisonMetric;
  };
}

export interface ValueDriftAlert {
  audienceId: string;
  hasDrift: boolean;
  title: string;
  description: string;
  suggestedFix: string;
}

export interface ConsistencyVerification {
  coreProblemPreserved: boolean;
  coreValuePreserved: boolean;
  productPromisePreserved: boolean;
  productIdentityPreserved: boolean;
  audienceMessagingAdapted: boolean;
  toneAdaptedAppropriately: boolean;
  positioningAdaptedAppropriately: boolean;
  overallScore: number;
  valueDriftAlerts: ValueDriftAlert[];
}

export interface AudienceShifterProject {
  id: string;
  title: string;
  updatedAt: string;
  product: ProductIdea;
  understanding: ProductUnderstanding;
  coreValueLock: CoreValueLock;
  selectedAudiences: string[]; // list of audience IDs
  audienceShifts: Record<string, AudienceBrandShift>;
  consistency: ConsistencyVerification;
  isDriftSimulated: boolean;
}
