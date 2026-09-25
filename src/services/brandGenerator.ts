import {
  AudienceShifterProject,
  ProductIdea,
  ProductUnderstanding,
  AudienceOption,
  AudienceBrandShift,
  ConsistencyVerification,
  ValueDriftAlert
} from '../types/brand';

export const AVAILABLE_AUDIENCES: AudienceOption[] = [
  {
    id: 'students',
    name: 'College Students & Gen Z',
    shortLabel: 'Students',
    category: 'End Users',
    description: 'Tech-fluent undergrads seeking autonomy, simplicity, and low cognitive friction.',
    avatarIcon: 'GraduationCap',
    defaultSelected: true
  },
  {
    id: 'parents',
    name: 'Parents & Family Guardians',
    shortLabel: 'Parents',
    category: 'Decision Influencers',
    description: 'Protective sponsors prioritizing safety, financial guidance, and long-term peace of mind.',
    avatarIcon: 'ShieldCheck',
    defaultSelected: true
  },
  {
    id: 'institutions',
    name: 'Universities & Academic Institutions',
    shortLabel: 'Institutions',
    category: 'B2B & Partners',
    description: 'Administrators and deans focused on student retention, graduation metrics, and compliance.',
    avatarIcon: 'Building2',
    defaultSelected: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Corporate Employers',
    shortLabel: 'Enterprise',
    category: 'B2B / B2B2C',
    description: 'HR and business leaders looking for productivity, employee wellness, and scalable ROI.',
    avatarIcon: 'Briefcase'
  },
  {
    id: 'professionals',
    name: 'Early-Career Professionals',
    shortLabel: 'Professionals',
    category: 'Direct Consumers',
    description: 'Ambitious 20-somethings transitioning into high-velocity careers seeking leverage.',
    avatarIcon: 'UserCheck'
  },
  {
    id: 'creators',
    name: 'Freelancers & Independent Creators',
    shortLabel: 'Creators',
    category: 'Prosumer',
    description: 'Solopreneurs craving flexible, jargon-free tools that save precious creative hours.',
    avatarIcon: 'Sparkles'
  },
  {
    id: 'smallbiz',
    name: 'Small Business Owners',
    shortLabel: 'Small Business',
    category: 'Commercial',
    description: 'Pragmatic operators managing tight cash flow, immediate utility, and clear accountability.',
    avatarIcon: 'Store'
  },
  {
    id: 'investors',
    name: 'Angel & Venture Investors',
    shortLabel: 'Investors',
    category: 'Capital & Stakeholders',
    description: 'Thesis-driven evaluators searching for defensibility, scalable distribution, and high retention.',
    avatarIcon: 'TrendingUp'
  }
];

export const PRESET_IDEAS: { title: string; idea: string; category: string; defaultAudiences: string[] }[] = [
  {
    title: 'Student AI Financial Companion',
    idea: 'I am building an AI-powered financial management app for students that tracks micro-expenses, prevents overdraft fees, and explains budgeting in plain English.',
    category: 'Fintech & EdTech',
    defaultAudiences: ['students', 'parents', 'institutions']
  },
  {
    title: 'Cognitive Health & Sleep Coach',
    idea: 'A non-invasive wearable and app that tracks circadian rhythm, predicts afternoon fatigue, and gives personalized recovery prompts without medical jargon.',
    category: 'Health & Wellness',
    defaultAudiences: ['students', 'professionals', 'enterprise']
  },
  {
    title: 'Autonomous Freelance Tax Assistant',
    idea: 'An intelligent finance assistant that continuously logs freelance write-offs and auto-calculates quarterly tax estimates so solo founders never face surprise penalties.',
    category: 'SaaS & Productivity',
    defaultAudiences: ['creators', 'smallbiz', 'investors']
  }
];

export function extractProductUnderstanding(input: ProductIdea): ProductUnderstanding {
  const text = (input.rawIdea + ' ' + (input.targetAudience || '') + ' ' + (input.problemSolved || '')).toLowerCase();

  if (text.includes('financ') || text.includes('money') || text.includes('budget') || text.includes('expense') || text.includes('overdraft')) {
    return {
      coreProblem: 'College students struggle to understand, track, and manage variable daily living costs, leading to unexpected debt, overdraft fees, and chronic financial stress.',
      productPurpose: 'Provide an approachable, intelligent financial guide that builds healthy money habits early in life.',
      coreValue: 'Help students understand and manage their money easily.',
      productPromise: 'Real-time financial clarity, zero hidden fees, and actionable guidance without overwhelming spreadsheet jargon.',
      targetUsers: 'Students, young adults, and the families and academic networks that support their success.',
      nonNegotiablePrinciples: [
        'Zero predatory lending or punitive penalties',
        'Radical clarity over financial obfuscation',
        'Respect user privacy and sovereign financial data'
      ]
    };
  } else if (text.includes('sleep') || text.includes('health') || text.includes('wearable') || text.includes('fatigue') || text.includes('recovery')) {
    return {
      coreProblem: 'High-performing individuals suffer from burnout and midday energy crashes because traditional health tracking produces numbers without actionable daily guidance.',
      productPurpose: 'Transform biometric sleep and circadian data into immediate, gentle recovery choices.',
      coreValue: 'Empower everyday individuals to sustain peak energy and restorative rest naturally.',
      productPromise: 'Clear, anxiety-free recovery metrics that tell you what to do, not just what went wrong.',
      targetUsers: 'Stressed knowledge workers, student athletes, and proactive individuals prioritizing longevity.',
      nonNegotiablePrinciples: [
        'No anxiety-inducing biometric panic scoring',
        'Scientific backing behind every recovery prompt',
        'Privacy-first encryption for all biological telemetry'
      ]
    };
  } else if (text.includes('tax') || text.includes('freelanc') || text.includes('write-off') || text.includes('invoice') || text.includes('solo')) {
    return {
      coreProblem: 'Independent contractors lose thousands in unclaimed deductions and dread tax filing because existing tools are bloated CPA software.',
      productPurpose: 'Automate tax compliance and expense deduction tracking for the modern flexible workforce.',
      coreValue: 'Keep more of your hard-earned independent income with zero accounting friction.',
      productPromise: 'Real-time deduction capture, automated tax reserve calculations, and zero filing surprises.',
      targetUsers: 'Freelancers, fractional consultants, solopreneurs, and small agency operators.',
      nonNegotiablePrinciples: [
        'Never charge arbitrary transaction tolls on independent earners',
        'Audit-grade transparency on every deduction calculation',
        'Instant exportability with zero vendor lock-in'
      ]
    };
  }

  // Dynamic fallback for arbitrary user input
  const cleanIdea = input.rawIdea.trim();
  const summarySnippet = cleanIdea.slice(0, 80) + (cleanIdea.length > 80 ? '...' : '');

  return {
    coreProblem: input.problemSolved?.trim() || `Users in this space face fragmented tools, unnecessary friction, and a lack of intelligent guidance tailored to their actual daily routine.`,
    productPurpose: `Solve this fundamental friction using modern automated intelligence and user-centered design.`,
    coreValue: `Empower people to achieve better results faster with intuitive, friction-free guidance.`,
    productPromise: `Consistent reliability, instant clarity, and measurable value from day one.`,
    targetUsers: input.targetAudience?.trim() || 'Modern consumers, digital operators, and organizations seeking better outcomes.',
    nonNegotiablePrinciples: [
      'Unwavering commitment to core user utility',
      'Transparency and clarity in all interactions',
      'Continuous adaptation to user feedback without compromising foundational integrity'
    ]
  };
}

export function generateAudienceShift(
  audienceId: string,
  understanding: ProductUnderstanding,
  lockedCoreValue: string
): AudienceBrandShift {
  const audience = AVAILABLE_AUDIENCES.find((a) => a.id === audienceId) || {
    id: audienceId,
    name: audienceId.charAt(0).toUpperCase() + audienceId.slice(1),
    shortLabel: audienceId,
    category: 'Target Segment',
    description: 'Target demographic segment',
    avatarIcon: 'Users'
  };

  const isFinance = understanding.coreProblem.toLowerCase().includes('money') || understanding.coreProblem.toLowerCase().includes('financ');
  const isHealth = understanding.coreProblem.toLowerCase().includes('sleep') || understanding.coreProblem.toLowerCase().includes('health');

  if (isFinance) {
    if (audienceId === 'students') {
      return {
        audienceId: 'students',
        audienceName: 'College Students & Gen Z',
        whyAdaptation: 'This audience responds best to friendly, non-judgmental language that emphasizes personal independence, immediate relief from overdraft dread, and effortless mobile speed.',
        audienceProfile: {
          demographics: 'Ages 18–24, undergraduate and graduate students, first time managing independent living budgets.',
          mindset: 'Seeking freedom and social life, but anxious about overdraft fees, rent deadlines, and student loan balances.',
          primaryObjection: '“Finance apps make me feel guilty, and I don’t have time to categorize 50 receipts every week.”'
        },
        positioning: 'The effortless, judgment-free money companion that keeps your bank balance safe while you focus on college life.',
        personality: {
          traits: ['Friendly', 'Casual', 'Empowering', 'Direct'],
          vibe: 'Like a smart, reliable roommate who knows the hacks and never shames your late-night boba runs.'
        },
        toneOfVoice: 'Conversational, energetic, plain-English, supportive without being patronizing.',
        keyMotivation: 'Immediate financial autonomy and never seeing an unexpected $35 overdraft fee.',
        painPointEmphasis: 'The anxiety of checking your balance before tapping your card at the grocery checkout.',
        tagline: 'Money doesn’t have to be a mystery.',
        exampleHeadline: 'Know what you can spend today without checking four different bank apps.',
        exampleMessage: 'You’ve got midterms, labs, and a social life. Let our AI handle tracking rent, splitting bills with roommates, and keeping your cash safe in the background.',
        callToAction: 'Start Managing Money Free',
        visualDirection: {
          paletteName: 'Electric Daylight',
          accentHex: '#FF6124',
          bgHex: '#FFF5F0',
          textHex: '#1C1917',
          mood: 'Energetic, modern, high contrast with tactile warm canvas and punchy orange momentum.'
        },
        whatChanged: {
          tone: {
            from: 'Objective Product Core',
            to: 'Friendly & Casual',
            explanation: 'Replaces cold banking jargon with relaxed, relatable peer language.'
          },
          messaging: {
            from: 'General money management',
            to: 'Everyday Autonomy & Zero Overdraft Guilt',
            explanation: 'Focuses squarely on day-to-day college spending and social bills rather than retirement planning.'
          },
          positioning: {
            from: 'Financial management app',
            to: 'Judgment-Free Student Money Companion',
            explanation: 'Frames the tool as an ally and protector against punitive bank fees.'
          },
          cta: {
            from: 'Create Account',
            to: 'Start Managing Money Free',
            explanation: 'Low-commitment invitation with an explicit zero-cost reassurance.'
          }
        }
      };
    }

    if (audienceId === 'parents') {
      return {
        audienceId: 'parents',
        audienceName: 'Parents & Family Guardians',
        whyAdaptation: 'This audience prioritizes safety, trust, and fostering adult self-reliance. Messaging must emphasize security, supportive oversight, and constructive habits rather than surveillance.',
        audienceProfile: {
          demographics: 'Ages 42–58, parents of college students contributing to tuition or living allowances.',
          mindset: 'Want their child to thrive independently, but worry about impulsive spending, debt, and emergencies.',
          primaryObjection: '“I don’t want to micromanage my child, but I also can’t afford to bail them out every month.”'
        },
        positioning: 'The trusted financial training wheels that help your student master real-world budgeting before entering the workforce.',
        personality: {
          traits: ['Trustworthy', 'Reassuring', 'Protective', 'Constructive'],
          vibe: 'A respected family mentor that builds mutual trust between parents and emerging adults.'
        },
        toneOfVoice: 'Warm, dependable, dignified, safety-first, and encouraging.',
        keyMotivation: 'Ensuring their child develops lifelong financial discipline without feeling policed.',
        painPointEmphasis: 'The distress of emergency wire transfers, maxed-out credit cards, and unspoken money stress.',
        tagline: 'Give your student lifelong financial confidence.',
        exampleHeadline: 'Help your child build healthy money habits before graduation day.',
        exampleMessage: 'Set up safe allowance rails, celebrate their savings milestones, and rest easy knowing intelligent safeguards prevent overdraft emergencies without intrusive snooping.',
        callToAction: 'Help Your Child Build Better Financial Habits',
        visualDirection: {
          paletteName: 'Heritage Navy & Warm Bone',
          accentHex: '#0F766E',
          bgHex: '#F0FDFA',
          textHex: '#134E4A',
          mood: 'Calm, authoritative, reassuring teal and soft cream reflecting security and stability.'
        },
        whatChanged: {
          tone: {
            from: 'Friendly & Casual',
            to: 'Trustworthy & Reassuring',
            explanation: 'Elevates credibility and parental peace of mind over youth slang.'
          },
          messaging: {
            from: 'Everyday spending and friend splits',
            to: 'Safety, Habit-Building & Responsible Freedom',
            explanation: 'Addresses long-term adult readiness and safety rails rather than immediate convenience.'
          },
          positioning: {
            from: 'Student Money Companion',
            to: 'Parent-Student Financial Guidance Platform',
            explanation: 'Positions the app as a collaborative bridge between parent support and student autonomy.'
          },
          cta: {
            from: 'Start Managing Money Free',
            to: 'Help Your Child Build Better Financial Habits',
            explanation: 'Appeals directly to the parental instinct to nurture and equip their child.'
          }
        }
      };
    }

    if (audienceId === 'institutions') {
      return {
        audienceId: 'institutions',
        audienceName: 'Universities & Academic Institutions',
        whyAdaptation: 'University decision-makers care about measurable student persistence, retention rates, and accredited financial wellness initiatives. The brand must feel enterprise-grade, compliant, and data-driven.',
        audienceProfile: {
          demographics: 'Vice Chancellors of Student Affairs, Deans of Financial Aid, and Campus Wellness Directors.',
          mindset: 'Financial distress is the #1 non-academic cause of student dropouts; seeking scalable, measurable intervention.',
          primaryObjection: '“Will this integrate with our campus SSO and comply with FERPA/HEOA data privacy mandates?”'
        },
        positioning: 'The campus-wide student financial wellness infrastructure proven to reduce emergency withdrawals and elevate completion rates.',
        personality: {
          traits: ['Professional', 'Data-driven', 'Institutional', 'Reliable'],
          vibe: 'A modern, accredited educational partner built to institutional compliance standards.'
        },
        toneOfVoice: 'Objective, analytical, strategic, research-backed, and mission-aligned.',
        keyMotivation: 'Measurable reduction in student financial withdrawals and higher alumni graduation rates.',
        painPointEmphasis: 'Losing enrolled students midway through their degrees due to unmanaged micro-financial crises.',
        tagline: 'Empower student retention through intelligent financial literacy.',
        exampleHeadline: 'Close the retention gap caused by student financial stress.',
        exampleMessage: 'Deploy verified, automated financial guidance across your entire student body. Real-time anonymized cohort analytics give student affairs teams early warning signals before dropouts occur.',
        callToAction: 'Request a Campus Partnership Brief',
        visualDirection: {
          paletteName: 'Academic Slate & Indigo',
          accentHex: '#4338CA',
          bgHex: '#EEF2FF',
          textHex: '#312E81',
          mood: 'Scholarly, structured, high-contrast crisp typography emphasizing institutional rigor.'
        },
        whatChanged: {
          tone: {
            from: 'Reassuring & Warm',
            to: 'Professional & Data-driven',
            explanation: 'Shifts from personal empathy to administrative efficacy, retention ROI, and compliance.'
          },
          messaging: {
            from: 'Individual student spending',
            to: 'Campus-wide Retention Metrics & Wellness Infrastructure',
            explanation: 'Frames financial management as an institutional retention strategy.'
          },
          positioning: {
            from: 'Consumer Mobile App',
            to: 'Higher-Ed Student Retention & Wellness Platform',
            explanation: 'Transforms from a mobile gadget into an institutional student-affairs system.'
          },
          cta: {
            from: 'Help Your Child',
            to: 'Request a Campus Partnership Brief',
            explanation: 'Matches institutional B2B procurement workflows.'
          }
        }
      };
    }
  }

  // Generic intelligent adapter for other audiences or domains
  const audienceKeyLower = audienceId.toLowerCase();
  let tone = 'Professional & Action-oriented';
  let personality = ['Focused', 'Reliable', 'Results-driven'];
  let keyMotiv = 'Efficiency and measurable return on investment';
  let painPoint = 'Wasted operational hours and disjointed workflows';
  let tagline = `Elevate how your team leverages ${understanding.coreValue.toLowerCase().replace('.', '')}.`;
  let headline = `The smarter way to achieve ${understanding.coreValue.toLowerCase().replace('.', '')}.`;
  let message = `Bring speed, clarity, and consistency to your operations. Built around our locked commitment: ${lockedCoreValue}`;
  let cta = `Discover the ${audience.shortLabel} Solution`;
  let accentHex = '#FF6124';
  let bgHex = '#FAF8F3';

  if (audienceKeyLower.includes('enterprise')) {
    tone = 'Executive, Strategic & Scalable';
    personality = ['Enterprise-ready', 'Secure', 'Compliant', 'Analytical'];
    keyMotiv = 'Governance, systemic scalability, and team-wide productivity';
    painPoint = 'Security risks and compliance hurdles with shadow software';
    tagline = 'Enterprise velocity with zero compromise on control.';
    headline = 'Operationalize our core value across your global workforce.';
    message = `Deliver seamless capabilities to your enterprise teams while preserving our foundational promise: ${lockedCoreValue}`;
    cta = 'Schedule Enterprise Evaluation';
    accentHex = '#0284C7';
    bgHex = '#F0F9FF';
  } else if (audienceKeyLower.includes('creator') || audienceKeyLower.includes('freelanc')) {
    tone = 'Candid, Agile & High-Energy';
    personality = ['Creative', 'Independent', 'Fast', 'Uncompromising'];
    keyMotiv = 'Reclaiming hours from administrative chores to focus on craft';
    painPoint = 'Clunky corporate software designed for 500-person offices';
    tagline = 'Built for solo operators who ship fast.';
    headline = 'Keep your momentum without the administrative drag.';
    message = `No bloat, no meetings, no friction. Just the pure core value you need: ${lockedCoreValue}`;
    cta = 'Get Started Solo';
    accentHex = '#8B5CF6';
    bgHex = '#F5F3FF';
  } else if (audienceKeyLower.includes('investor')) {
    tone = 'Rigorous, Quantitative & Thesis-Aligned';
    personality = ['Defensible', 'High-Growth', 'Visionary', 'Grounded'];
    keyMotiv = 'Defensible unit economics, rapid viral coefficient, and moat';
    painPoint = 'Commoditized features with poor organic customer retention';
    tagline = 'Unlocking deep category leadership through differentiated retention.';
    headline = 'Massive market expansion anchored to one non-negotiable core value.';
    message = `Discover how our multi-audience distribution strategy multiplies addressable TAM while maintaining: ${lockedCoreValue}`;
    cta = 'Request Investor Deck';
    accentHex = '#059669';
    bgHex = '#ECFDF5';
  } else if (audienceKeyLower.includes('smallbiz')) {
    tone = 'Practical, Honest & High-Utility';
    personality = ['Down-to-earth', 'Dependable', 'Transparent', 'Hardworking'];
    keyMotiv = 'Protecting cash flow and saving valuable team bandwidth';
    painPoint = 'Expensive enterprise software with steep learning curves';
    tagline = 'Honest tools that pay for themselves on day one.';
    headline = 'Run a tighter, more profitable operation without the headache.';
    message = `Practical tools tailored for your real-world team, delivering our core commitment: ${lockedCoreValue}`;
    cta = 'Start Free 14-Day Trial';
    accentHex = '#D97706';
    bgHex = '#FFFBEB';
  }

  return {
    audienceId,
    audienceName: audience.name,
    whyAdaptation: `Adapted specifically for ${audience.shortLabel} by shifting tone and emphasis to their primary decision triggers while strictly preserving the core value anchor.`,
    audienceProfile: {
      demographics: `${audience.name} across target metropolitan and regional sectors.`,
      mindset: `Pragmatic, value-sensitive, and evaluating how this directly moves their needle.`,
      primaryObjection: `“Is this really built for someone in my exact shoes, or is it a generic one-size-fits-all tool?”`
    },
    positioning: `Intelligently adapted to provide ${audience.shortLabel} with tailored workflows and resonant messaging.`,
    personality: {
      traits: personality,
      vibe: `Authoritative yet approachable within the ${audience.shortLabel} ecosystem.`
    },
    toneOfVoice: tone,
    keyMotivation: keyMotiv,
    painPointEmphasis: painPoint,
    tagline,
    exampleHeadline: headline,
    exampleMessage: message,
    callToAction: cta,
    visualDirection: {
      paletteName: `${audience.shortLabel} Modern`,
      accentHex,
      bgHex,
      textHex: '#1C1917',
      mood: `Tailored visual cues that immediately build familiarity with ${audience.shortLabel}.`
    },
    whatChanged: {
      tone: {
        from: 'Baseline Core Voice',
        to: tone.split(',')[0],
        explanation: `Calibrated specifically to mirror the cadence of ${audience.shortLabel}.`
      },
      messaging: {
        from: 'Generic product benefits',
        to: keyMotiv,
        explanation: `Highlights what matters most during ${audience.shortLabel} decision making.`
      },
      positioning: {
        from: 'Broad multi-market tool',
        to: `Tailored ${audience.shortLabel} Solution`,
        explanation: `Removes peripheral features and elevates immediate category relevance.`
      },
      cta: {
        from: 'Get Started',
        to: cta,
        explanation: `Optimized for the specific procurement threshold of ${audience.shortLabel}.`
      }
    }
  };
}

export function buildConsistencyReport(
  understanding: ProductUnderstanding,
  lockedCoreValue: string,
  shifts: Record<string, AudienceBrandShift>,
  isSimulatedDrift: boolean
): ConsistencyVerification {
  const alerts: ValueDriftAlert[] = [];

  if (isSimulatedDrift) {
    alerts.push({
      audienceId: 'enterprise',
      hasDrift: true,
      title: 'Value Drift Detected in Enterprise Direction',
      description: 'The Enterprise version has changed the original product promise into an algorithmic corporate treasury optimization desk instead of simply adapting communication for student financial clarity.',
      suggestedFix: 'Re-anchor the Enterprise messaging to campus student employment wellness and parental reimbursement rails, preserving the core promise of student financial empowerment.'
    });
  }

  return {
    coreProblemPreserved: true,
    coreValuePreserved: !isSimulatedDrift,
    productPromisePreserved: !isSimulatedDrift,
    productIdentityPreserved: true,
    audienceMessagingAdapted: true,
    toneAdaptedAppropriately: true,
    positioningAdaptedAppropriately: true,
    overallScore: isSimulatedDrift ? 68 : 100,
    valueDriftAlerts: alerts
  };
}

export function createAudienceShifterProject(input: ProductIdea): AudienceShifterProject {
  const understanding = extractProductUnderstanding(input);
  const defaultAudiences = ['students', 'parents', 'institutions'];
  const shifts: Record<string, AudienceBrandShift> = {};

  defaultAudiences.forEach((audId) => {
    shifts[audId] = generateAudienceShift(audId, understanding, understanding.coreValue);
  });

  const consistency = buildConsistencyReport(understanding, understanding.coreValue, shifts, false);

  return {
    id: `proj-${Date.now()}`,
    title: input.title || 'Brand Project',
    updatedAt: new Date().toISOString(),
    product: input,
    understanding,
    coreValueLock: {
      coreValue: understanding.coreValue,
      isLocked: false,
      originalExtractedValue: understanding.coreValue
    },
    selectedAudiences: defaultAudiences,
    audienceShifts: shifts,
    consistency,
    isDriftSimulated: false
  };
}
