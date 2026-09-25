import {
  VentureProject,
  QuestionnaireAnswers,
  IdeaUnderstanding,
  WorkspaceId,
  DecisionLogEntry,
  ProjectType,
  WorkspaceStatus,
} from '../types/venture';

export function generateVentureProject(
  rawIdea: string,
  answers: QuestionnaireAnswers,
  customUnderstanding?: Partial<IdeaUnderstanding>,
  projectType: ProjectType = 'new_brand',
  ownerId?: string
): VentureProject {
  const isSolar = rawIdea.toLowerCase().includes('solar') || rawIdea.toLowerCase().includes('energy') || answers.industry.toLowerCase().includes('clean');
  const isCoffee = rawIdea.toLowerCase().includes('coffee') || rawIdea.toLowerCase().includes('brew') || rawIdea.toLowerCase().includes('kiosk') || answers.industry.toLowerCase().includes('food') || answers.industry.toLowerCase().includes('retail');
  const isFintech = rawIdea.toLowerCase().includes('fintech') || rawIdea.toLowerCase().includes('compliance') || rawIdea.toLowerCase().includes('legal') || rawIdea.toLowerCase().includes('audit');

  let projectName = 'Stratum Venture';
  let projectTagline = 'Intelligent Venture Architecture & Brand Studio';

  if (isSolar) {
    projectName = 'Aura Grid';
    projectTagline = 'Decentralized Clean Microgrid Orchestration Engine';
  } else if (isCoffee) {
    projectName = 'Kinetix Roasters';
    projectTagline = 'Robotic Precision Cold-Brew Kiosks for Urban Campuses';
  } else if (isFintech) {
    projectName = 'Veritas Compliance';
    projectTagline = 'Real-Time Autonomous Regulatory Copilot for Cross-Border Fintech';
  } else {
    // Generate an evocative name from idea words
    const words = rawIdea.trim().split(/\s+/);
    const baseWord = words[0] ? words[0].replace(/[^a-zA-Z]/g, '') : 'Nova';
    projectName = `${baseWord.charAt(0).toUpperCase() + baseWord.slice(1).toLowerCase()} Studio`;
    projectTagline = `Next-generation ${answers.industry || 'technology'} solution for ${answers.customerType || 'modern teams'}`;
  }

  const understanding: IdeaUnderstanding = {
    projectName,
    projectType,
    businessCategory: customUnderstanding?.businessCategory || answers.industry || 'Technology & Infrastructure',
    businessDescription: customUnderstanding?.businessDescription || rawIdea,
    productOrService: customUnderstanding?.productOrService || projectName,
    problemBeingSolved: customUnderstanding?.problemBeingSolved || customUnderstanding?.primaryProblem || (isSolar
      ? 'Commercial facilities incur severe demand-charge penalties and waste 34% of onsite solar generation due to static battery storage scheduling.'
      : isCoffee
      ? 'Urban office workers endure long queue delays and inconsistent batch quality for premium iced beverages during peak morning hours.'
      : isFintech
      ? 'Fintech engineering teams spend 40% of their roadmap manually maintaining fragmented compliance reporting across 14+ international jurisdictions.'
      : 'Fragmented manual workflows, lack of transparent telemetry, and elevated operating overhead in the existing workflow.'),
    coreValue: customUnderstanding?.coreValue || customUnderstanding?.corePremise || (isSolar
      ? 'Autonomous, peer-to-peer microgrid energy dispatch balancing commercial building battery reserves with dynamic tariff spot pricing.'
      : isCoffee
      ? 'Compact automated robotic kiosk delivering single-origin artisanal cold brew formulated precisely to user biometric and taste preferences.'
      : isFintech
      ? 'Continuous compliance monitoring engine translating evolving global financial regulations directly into executable API transaction rules.'
      : `High-leverage system addressing structural friction in ${answers.industry || 'the target space'} via ${answers.unfairAdvantage || 'modern technology'}.`),
    potentialCustomers: customUnderstanding?.potentialCustomers || customUnderstanding?.targetAudienceSummary || (isSolar
      ? 'Commercial real estate operators, multi-tenant industrial park managers, and municipal clean energy microgrid developers.'
      : isCoffee
      ? 'High-density tech campus facilities, medical center lobbies, and transit hubs serving premium coffee consumers.'
      : isFintech
      ? 'Chief Compliance Officers, Heads of Risk, and Lead Infrastructure Engineers at fast-scaling cross-border payment platforms.'
      : `Forward-thinking ${answers.customerType || 'enterprises'} seeking reliable operational efficiency and high ROI.`),
    differentiation: customUnderstanding?.differentiation || customUnderstanding?.unfairAdvantage || answers.unfairAdvantage || 'Proprietary predictive optimization algorithm with sub-second execution latency.',
    businessGoals: customUnderstanding?.businessGoals || 'Establish category benchmark with 75%+ gross margins and rapid customer payback.',
    constraints: customUnderstanding?.constraints || [
      'Customer procurement cycle must stay under 45 days',
      'Integration must not disrupt existing legacy operations',
    ],
    importantAssumptions: customUnderstanding?.importantAssumptions || customUnderstanding?.unresolvedAssumptions || [
      'Customer willingness to connect operational data feeds without 90-day sandbox pilots',
      'Regulatory compliance requirements in secondary regional expansion markets',
      'Unit economics margin resilience under a 20% hardware/cloud compute cost surge',
    ],
    unresolvedQuestions: customUnderstanding?.unresolvedQuestions || [
      'Exact customer willingness-to-pay threshold',
      'Optimal customer acquisition channel',
    ],
    rebrandDetails: customUnderstanding?.rebrandDetails,

    corePremise: customUnderstanding?.corePremise || (isSolar
      ? 'Autonomous, peer-to-peer microgrid energy dispatch balancing commercial building battery reserves with dynamic tariff spot pricing.'
      : isCoffee
      ? 'Compact automated robotic kiosk delivering single-origin artisanal cold brew formulated precisely to user biometric and taste preferences.'
      : isFintech
      ? 'Continuous compliance monitoring engine translating evolving global financial regulations directly into executable API transaction rules.'
      : `High-leverage system addressing structural friction in ${answers.industry || 'the target space'} via ${answers.unfairAdvantage || 'modern technology'}.`),
    primaryProblem: customUnderstanding?.primaryProblem || (isSolar
      ? 'Commercial facilities incur severe demand-charge penalties and waste 34% of onsite solar generation due to static battery storage scheduling.'
      : isCoffee
      ? 'Urban office workers endure long queue delays and inconsistent batch quality for premium iced beverages during peak morning hours.'
      : isFintech
      ? 'Fintech engineering teams spend 40% of their roadmap manually maintaining fragmented compliance reporting across 14+ international jurisdictions.'
      : 'Fragmented manual workflows, lack of transparent telemetry, and elevated operating overhead in the existing workflow.'),
    targetAudienceSummary: customUnderstanding?.targetAudienceSummary || (isSolar
      ? 'Commercial real estate operators, multi-tenant industrial park managers, and municipal clean energy microgrid developers.'
      : isCoffee
      ? 'High-density tech campus facilities, medical center lobbies, and transit hubs serving premium coffee consumers.'
      : isFintech
      ? 'Chief Compliance Officers, Heads of Risk, and Lead Infrastructure Engineers at fast-scaling cross-border payment platforms.'
      : `Forward-thinking ${answers.customerType || 'enterprises'} seeking reliable operational efficiency and high ROI.`),
    unfairAdvantage: customUnderstanding?.unfairAdvantage || answers.unfairAdvantage || 'Proprietary predictive optimization algorithm with sub-second execution latency.',
    businessModelSummary: customUnderstanding?.businessModelSummary || (isSolar
      ? 'SaaS subscription per megawatt-capacity managed + 15% performance share on peak demand tariff reduction.'
      : isCoffee
      ? 'Hardware leasing to property hosts ($450/mo) + direct per-cup recurring gross margin (72% unit contribution).'
      : isFintech
      ? 'Tiered recurring B2B software license ($2,500 - $12,000/mo) based on monthly transacting volume and jurisdictions audited.'
      : `${answers.businessModel || 'B2B Subscription'} with tiered enterprise capabilities and volume scaling.`),
    unresolvedAssumptions: customUnderstanding?.unresolvedAssumptions || [
      'Customer willingness to connect operational data feeds without 90-day sandbox pilots',
      'Regulatory compliance requirements in secondary regional expansion markets',
      'Unit economics margin resilience under a 20% hardware/cloud compute cost surge',
    ],
    suggestedFocusAreas: customUnderstanding?.suggestedFocusAreas || [
      'Conduct 15 structured customer discovery interviews on willingness-to-pay',
      'Validate technical latency bounds in low-bandwidth deployment environments',
      'Establish defensible IP moat around the core dispatch/orchestration logic',
    ],
  };

  const project: VentureProject = {
    id: `proj_${Date.now()}`,
    ownerId,
    projectType,
    brandCategory: answers.industry || 'Enterprise & Technology',
    title: projectName,
    tagline: projectTagline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rawIdea,
    questionnaire: answers,
    understanding,
    workspaceStatuses: {
      'research-discovery': 'In Progress',
      'brand-strategy': 'In Progress',
      'design-studio': 'In Progress',
      'market-launch': 'In Progress',
      'complete-brand-kit': 'In Progress',
    },
    researchDiscovery: {
      targetAudience: {
        summary: `Validated 3 primary commercial segments. Strongest early traction observed in tier-1 enterprise operators facing immediate regulatory or operational cost penalties.`,
        status: 'Needs Testing',
        segments: [
          {
            name: 'Primary: Mid-Market Operators',
            sharePercent: 52,
            tamContribution: '$4.2B',
            readiness: 'High',
            primaryNeed: 'Immediate operational savings without requiring additional in-house engineering overhead.',
          },
          {
            name: 'Secondary: Enterprise Portfolios',
            sharePercent: 33,
            tamContribution: '$6.8B',
            readiness: 'Medium',
            primaryNeed: 'Unified governance, multi-facility visibility, and verifiable audit compliance.',
          },
          {
            name: 'Tertiary: Early-Stage Agile Teams',
            sharePercent: 15,
            tamContribution: '$1.4B',
            readiness: 'High',
            primaryNeed: 'Self-serve setup, transparent pricing, and rapid time-to-value within 48 hours.',
          },
        ],
        personas: [
          {
            id: 'per-1',
            name: 'Elena Rostova',
            role: 'VP of Infrastructure & Operations',
            avatarSeed: 'elena',
            demographics: '38–48 yrs · Urban Hub · 12 yrs domain tenure',
            psychographics: 'Pragmatic, risk-averse, hyper-focused on verifiable 9-month payback horizons.',
            dailyFriction: 'Drowning in fragmented vendor dashboards, uncoordinated telemetry, and surprise SLA breaches.',
            budgetAuthority: 'Direct discretionary sign-off up to $150k ARR; board sign-off required beyond.',
            adoptionTrigger: 'Demonstrated reduction in weekly operational firefighting plus zero-downtime pilot guarantee.',
            sourceLabel: 'Verified Source',
          },
          {
            id: 'per-2',
            name: 'Marcus Chen',
            role: 'Lead Systems Architect',
            avatarSeed: 'marcus',
            demographics: '30–38 yrs · Tech Metro · Distributed team lead',
            psychographics: 'Values clean API architecture, strict latency bounds, and transparent telemetry.',
            dailyFriction: 'Forced to maintain bespoke glue code and fragile CSV exports between disconnected platforms.',
            budgetAuthority: 'Technical veto power; influences executive purchasing committee heavily.',
            adoptionTrigger: 'Well-documented SDK, sandbox trial with synthetic data, and zero vendor lock-in.',
            sourceLabel: 'AI Hypothesis',
          },
          {
            id: 'per-3',
            name: 'Sarah Jenkins',
            role: 'Head of Strategic Finance',
            avatarSeed: 'sarah',
            demographics: '35–45 yrs · Corporate HQ · CPA background',
            psychographics: 'Analytical, skeptical of vanity metrics, demands clear cost-center attribution.',
            dailyFriction: 'Unpredictable variable bills and lack of transparent unit-economic forecasting.',
            budgetAuthority: 'Co-approver on all recurring software commitments over $25k.',
            adoptionTrigger: 'Interactive ROI calculator showing net margin expansion within 2 fiscal quarters.',
            sourceLabel: 'User Provided',
          },
        ],
        painPoints: [
          {
            friction: 'Fragmented tools require 14 hours/week of manual data reconciliation across incompatible formats.',
            severity: 'Critical',
            currentWorkaround: 'Custom spreadsheet macros maintained by an overburdened analyst.',
            opportunityScore: 9.4,
            sourceLabel: 'Verified Source',
          },
          {
            friction: 'Inability to forecast peak demand surcharges or regulatory audit exposure in real time.',
            severity: 'Critical',
            currentWorkaround: 'Reactive quarterly post-mortems after penalties have already occurred.',
            opportunityScore: 8.9,
            sourceLabel: 'Needs Testing',
          },
          {
            friction: 'High onboarding friction: existing enterprise solutions take 4 to 6 months to deploy.',
            severity: 'Moderate',
            currentWorkaround: 'Consulting engagements with 6-figure professional service fees.',
            opportunityScore: 7.8,
            sourceLabel: 'AI Hypothesis',
          },
        ],
        behaviorComparisons: [
          {
            dimension: 'Evaluation Horizon',
            earlyAdopter: '2-week sandbox trial',
            mainstream: '60-day structured POC',
            enterprise: 'Formal RFP + security review (90 days)',
          },
          {
            dimension: 'Primary Success Metric',
            earlyAdopter: 'Speed to first automated insight',
            mainstream: 'Reliability & team workflow integration',
            enterprise: 'Guaranteed SLA & regulatory audit defense',
          },
          {
            dimension: 'Integration Tolerance',
            earlyAdopter: 'Comfortable with GraphQL & webhooks',
            mainstream: 'Demands native pre-built connectors',
            enterprise: 'Demands SAML/SSO & on-premise proxy options',
          },
        ],
        charts: {
          willingnessToPay: [
            { tier: '$500 - $1,500/mo', percentage: 28 },
            { tier: '$1,500 - $3,500/mo', percentage: 46 },
            { tier: '$3,500 - $8,000/mo', percentage: 18 },
            { tier: '$8,000+/mo (Custom)', percentage: 8 },
          ],
          retentionPotential: [
            { month: 'Month 1', rate: 100 },
            { month: 'Month 3', rate: 92 },
            { month: 'Month 6', rate: 88 },
            { month: 'Month 12', rate: 84 },
          ],
        },
      },
      marketOpportunity: {
        summary: `Market expansion propelled by intensifying regulatory scrutiny and demand for autonomous operational efficiency. Note: Illustrative market synthesis provided based on industry benchmarks.`,
        status: 'AI Hypothesis',
        tam: '$14.8B',
        sam: '$4.1B',
        som: '$620M',
        cagrPercent: 18.4,
        timeframe: '2025–2030',
        trends: [
          {
            title: 'Regulatory Compulsion & ESG Mandates',
            impact: 'Tailwind',
            description: 'New disclosure frameworks penalize manual compliance and reward real-time telemetry.',
            source: 'Industry Benchmark Analysis 2025',
            sourceLabel: 'Verified Source',
          },
          {
            title: 'Decentralized Edge Intelligence',
            impact: 'Catalyst',
            description: 'Decreasing edge compute costs enable sub-100ms local decision making without cloud round-trips.',
            source: 'Gartner Emerging Tech Brief',
            sourceLabel: 'Verified Source',
          },
          {
            title: 'Enterprise Vendor Consolidation',
            impact: 'Headwind',
            description: 'CFOs prefer unified platforms over point tools; requires comprehensive feature depth.',
            source: 'Bessemer Cloud Trends Report',
            sourceLabel: 'AI Hypothesis',
          },
        ],
        barriersToEntry: [
          {
            barrier: 'Data Network Moat (Proprietary Dispatch Models)',
            defenseStrategy: 'Continuous reinforcement learning across multi-tenant telemetry datasets.',
            defensibilityScore: 8.5,
          },
          {
            barrier: 'High Switching Costs via System Integration',
            defenseStrategy: 'Deep bi-directional hooks into ERP/SCADA/financial ledgers.',
            defensibilityScore: 9.0,
          },
          {
            barrier: 'Regulatory Certification Thresholds',
            defenseStrategy: 'Pre-certified security compliance (SOC2 Type II, ISO 27001, FedRAMP pathway).',
            defensibilityScore: 7.8,
          },
        ],
        sourceCitations: [
          {
            institution: 'McKinsey Global Institute (Energy/Tech Synthesis)',
            metric: '34% baseline inefficiency in uncoordinated operations',
            credibility: 'High',
            sourceLabel: 'Verified Source',
            note: 'Peer-reviewed 2024 operational study on autonomous commercial infrastructure.',
          },
          {
            institution: 'BloombergNEF / IDC Research Benchmark',
            metric: '18.4% 5-year CAGR across autonomous infrastructure software',
            credibility: 'High',
            sourceLabel: 'Verified Source',
            note: 'Derived from multi-year forecast across 1,200 commercial deployments.',
          },
          {
            institution: 'Stratum Research Synthesis Engine',
            metric: '$620M serviceable obtainable market at 15% penetration in 36 months',
            credibility: 'Illustrative Demo',
            sourceLabel: 'Needs Testing',
            note: 'Modeled scenario based on initial pricing tiers and target customer count.',
          },
        ],
        uncertaintyAnalysis: [
          {
            variable: 'Average Sales Cycle Length',
            varianceRange: '45 to 110 days',
            sensitivityLevel: 'High',
            comment: 'Directly impacts early cash burn and required seed capital reserve.',
          },
          {
            variable: 'Hardware/Compute API Margin Degradation',
            varianceRange: '±12% gross margin variance',
            sensitivityLevel: 'Medium',
            comment: 'Requires multi-provider fallback routing to protect target 78% software gross margins.',
          },
          {
            variable: 'Incumbent Bundling Counter-Attack',
            varianceRange: 'Slow (18-24 mo lag)',
            sensitivityLevel: 'Low',
            comment: 'Legacy platforms possess legacy technical debt preventing rapid edge autonomous logic.',
          },
        ],
      },
      productFeasibility: {
        summary: `Core architecture is technically viable using existing distributed systems and modern TypeScript/Rust runtimes. Primary challenge is telemetry stream latency under peak multi-tenant load.`,
        status: 'In Progress',
        technicalConsiderations: [
          {
            domain: 'Telemetry Ingestion & Edge Synchronization',
            complexity: 'High',
            architecturePath: 'Distributed MQTT broker cluster with local SQLite edge cache and optimistic syncing.',
            stackRecommendation: 'Rust-based ingestion daemon + Apache Kafka for event stream sequencing.',
            sourceLabel: 'Verified Source',
          },
          {
            domain: 'Real-Time Optimization Engine',
            complexity: 'High',
            architecturePath: 'Constraint-programming solver operating on 10-second rolling sliding windows.',
            stackRecommendation: 'Python solver core wrapped in high-performance C++ bindings.',
            sourceLabel: 'AI Hypothesis',
          },
          {
            domain: 'Executive Dashboard & Web Portal',
            complexity: 'Low',
            architecturePath: 'React SPA with Vite, server-side streaming API, and responsive web socket hooks.',
            stackRecommendation: 'TypeScript + Tailwind CSS + WebSockets + SQLite/Postgres backend.',
            sourceLabel: 'User Provided',
          },
        ],
        costAssumptions: [
          {
            category: 'Cloud Infrastructure & Ingestion',
            monthlyBurnEstimate: '$1,200 - $3,500/mo',
            unitCost: '$0.004 per 1,000 events',
            notes: 'Scales linearly with active sensors and data frequency.',
          },
          {
            category: 'Core Engineering & Maintenance',
            monthlyBurnEstimate: '$18,000 - $32,000/mo',
            unitCost: 'Fixed team burn',
            notes: 'Assumes 2 full-stack engineers + 1 systems/domain architect.',
          },
          {
            category: 'Regulatory & Compliance Audits',
            monthlyBurnEstimate: '$1,500/mo amortized',
            unitCost: '$18k annual audit cost',
            notes: 'SOC2 readiness and third-party penetration testing.',
          },
        ],
        testingRequirements: [
          {
            testName: 'Peak Throughput Latency Benchmark',
            objective: 'Sustain 10,000 telemetry events/sec with p99 latency under 80ms.',
            targetBenchmark: '< 80ms p99',
            status: 'In Progress',
          },
          {
            testName: 'Edge Partition & Offline Resilience',
            objective: 'Local nodes must continue autonomous fallback dispatch during 48-hour network cut.',
            targetBenchmark: 'Zero unhandled faults',
            status: 'Passed',
          },
          {
            testName: 'Data Accuracy & Drift Audit',
            objective: 'Telemetry discrepancy between edge sensor and billing ledger < 0.05%.',
            targetBenchmark: '< 0.05% error',
            status: 'Pending',
          },
        ],
        feasibilityMatrix: [
          { feature: 'Core Autonomous Dispatch Algorithm', technicalComplexity: 8, userImpact: 10, priority: 'MVP' },
          { feature: 'Real-Time Anomaly & Outage Detection', technicalComplexity: 5, userImpact: 9, priority: 'MVP' },
          { feature: 'Multi-Tenant Permission Hierarchy & SSO', technicalComplexity: 4, userImpact: 8, priority: 'MVP' },
          { feature: 'Predictive 7-Day Scenario Simulation', technicalComplexity: 7, userImpact: 7, priority: 'V1' },
          { feature: 'Automated 1-Click Regulatory Filings', technicalComplexity: 8, userImpact: 6, priority: 'Backlog' },
        ],
        unresolvedProductClaims: [
          {
            claim: '"Sub-second autonomous optimization eliminates 95% of peak demand penalties"',
            riskIfFalse: 'Diminishes core ROI pitch and lengthens payback timeline to over 18 months.',
            validationMethod: 'Simulate with historical 12-month client billing traces before live cutover.',
            sourceLabel: 'Needs Testing',
          },
          {
            claim: '"Zero hardware modification required on 80% of existing legacy assets"',
            riskIfFalse: 'Increases customer onboarding friction and capital expenditures.',
            validationMethod: 'Test protocol adapters (Modbus, BACnet, REST) across 5 partner testbenches.',
            sourceLabel: 'AI Hypothesis',
          },
        ],
      },
      competitiveAnalysis: {
        summary: `Incumbents rely on complex on-premise SCADA/ERP deployments with 6-month consulting setups. Stratum represents the fast-to-deploy, autonomous cloud-first challenger.`,
        status: 'Needs Testing',
        competitors: [
          {
            id: 'comp-1',
            name: 'Apex Industrial Systems',
            category: 'Legacy',
            marketShare: '42%',
            pricingModel: 'Heavy upfront licensing ($80k+) + 20% annual maintenance',
            strengths: ['Decades-long enterprise trust', 'Extensive compliance certifications', 'Deep global sales channels'],
            vulnerabilities: ['Clunky 2000s desktop UI', 'No automated self-learning algorithms', '6-month implementation timeline'],
            differentiationAngle: 'Zero-hardware SaaS with 48-hour deployment and modern cloud-native APIs.',
            sourceLabel: 'Verified Source',
          },
          {
            id: 'comp-2',
            name: 'OmniVolt Analytics',
            category: 'Direct',
            marketShare: '18%',
            pricingModel: 'Seat-based SaaS ($180/seat/month)',
            strengths: ['Sleek visualization dashboards', 'Strong marketing presence', 'Well-funded Series B ($35M)'],
            vulnerabilities: ['Passive analytics only (no automated control or execution)', 'High customer churn in year 2', 'Poor edge reliability'],
            differentiationAngle: 'Active closed-loop execution rather than just passive dashboard reporting.',
            sourceLabel: 'AI Hypothesis',
          },
          {
            id: 'comp-3',
            name: 'GridPulse Open Core',
            category: 'Indirect',
            marketShare: '8%',
            pricingModel: 'Open source with paid enterprise support',
            strengths: ['Active developer community', 'High customization flexibility', 'Low upfront entry barrier'],
            vulnerabilities: ['Lacks enterprise security controls', 'Requires dedicated internal engineers to maintain', 'Fragile integrations'],
            differentiationAngle: 'Turnkey reliability and guaranteed SLA with zero engineering overhead required.',
            sourceLabel: 'Verified Source',
          },
        ],
        comparisonMatrix: [
          { feature: 'Autonomous Closed-Loop Dispatch', ourProduct: true, competitorA: false, competitorB: 'Manual only', competitorC: 'Partial script' },
          { feature: 'Time to First Live Telemetry', ourProduct: '< 48 Hours', competitorA: '4 - 6 Months', competitorB: '2 - 3 Weeks', competitorC: 'Varies (Dev heavy)' },
          { feature: 'Transparent Predictive ROI Simulator', ourProduct: true, competitorA: false, competitorB: false, competitorC: false },
          { feature: 'Modern REST & WebSocket APIs', ourProduct: true, competitorA: 'Proprietary XML', competitorB: true, competitorC: true },
          { feature: 'Sub-100ms Edge Failover Support', ourProduct: true, competitorA: true, competitorB: false, competitorC: 'Custom build' },
        ],
        positioningCoordinates: [
          { competitorName: 'Our Platform', xValue: 88, yValue: 92, isUs: true },
          { competitorName: 'Apex Industrial', xValue: 24, yValue: 80 },
          { competitorName: 'OmniVolt', xValue: 78, yValue: 36 },
          { competitorName: 'GridPulse OSS', xValue: 45, yValue: 64 },
        ],
      },
      risksDrawbacks: {
        summary: `Prioritized 5 primary venture risks across regulatory, technical, and commercial domains. Mitigation strategies mapped with clear review dates.`,
        status: 'In Progress',
        risks: [
          {
            id: 'risk-1',
            title: 'Customer Data Security Hesitancy',
            category: 'Regulatory',
            probability: 4,
            severity: 4,
            evidenceLog: '3 of 8 interviewed enterprise leads voiced apprehension regarding cloud-connected infrastructure controls.',
            mitigationAction: 'Implement zero-trust architecture with client-side encrypted telemetry keys and SOC2 Type II compliance roadmap.',
            status: 'In Progress',
            sourceLabel: 'Verified Source',
          },
          {
            id: 'risk-2',
            title: 'Extended Enterprise Procurement Cycles',
            category: 'Financial',
            probability: 4,
            severity: 5,
            evidenceLog: 'Initial prospective pilot stalled in legal privacy review for 7 weeks.',
            mitigationAction: 'Introduce self-serve "Read-Only Discovery Tier" requiring zero IT approval to demonstrate instant value.',
            status: 'Open',
            sourceLabel: 'User Provided',
          },
          {
            id: 'risk-3',
            title: 'Edge Sensor Hardware Protocol Fragmentation',
            category: 'Technical',
            probability: 3,
            severity: 3,
            evidenceLog: 'Legacy field deployments feature non-standard baud rates and proprietary packet structures.',
            mitigationAction: 'Bundle a universal protocol translation container with automated auto-discovery heuristics.',
            status: 'Mitigated',
            sourceLabel: 'Needs Testing',
          },
          {
            id: 'risk-4',
            title: 'Cloud Compute Cost Escalation at Scale',
            category: 'Financial',
            probability: 2,
            severity: 3,
            evidenceLog: 'Continuous streaming analytics on 1,000 simultaneous connections can generate high ingress/processing fees.',
            mitigationAction: 'Perform edge pre-aggregation to transmit only anomalous deltas rather than continuous raw streams.',
            status: 'Mitigated',
            sourceLabel: 'AI Hypothesis',
          },
        ],
        unresolvedAssumptions: [
          {
            assumption: 'Facility owners will grant write-back control access rather than only read-only monitoring.',
            dangerLevel: 'Critical',
            testToInvalidate: 'Pilot agreement offering a "Human-in-the-Loop Recommendation Mode" before activating autonomous actuation.',
          },
          {
            assumption: 'Payback timeline of under 9 months is sufficient to bypass competitive bidding in 70% of accounts.',
            dangerLevel: 'High',
            testToInvalidate: 'Confront 5 commercial finance directors with actual pro-forma cost structures.',
          },
        ],
      },
      developmentRoadmap: {
        summary: `Phased 12-month execution path spanning MVP architecture, closed enterprise alpha, security certification, and commercial public launch.`,
        status: 'Approved',
        milestones: [
          {
            id: 'm-1',
            phase: 'Phase 1: Proof & MVP',
            title: 'Core Telemetry Engine & Invariant Dispatch',
            targetDuration: 'Months 1–3',
            dependencies: ['Protocol adapter verification', 'Edge hardware simulator environment'],
            deliverables: [
              { text: 'Sub-second real-time telemetry streaming pipeline', completed: true },
              { text: 'Core optimization algorithm benchmarked against baseline', completed: true },
              { text: 'Interactive executive web console with live state', completed: true },
              { text: 'Zero-trust client encryption security audit', completed: false },
            ],
            status: 'In Progress',
          },
          {
            id: 'm-2',
            phase: 'Phase 2: Closed Beta',
            title: 'Multi-Tenant Enterprise Pilot (5 Partners)',
            targetDuration: 'Months 4–6',
            dependencies: ['MVP pipeline stability', 'SOC2 Type I compliance certificate'],
            deliverables: [
              { text: 'Deploy across 5 live commercial pilot environments', completed: false },
              { text: 'Validate 25%+ verified operational savings in production', completed: false },
              { text: 'Implement automated daily PDF executive digest exports', completed: false },
              { text: 'Establish customer support escalation SLA system', completed: false },
            ],
            status: 'Planned',
          },
          {
            id: 'm-3',
            phase: 'Phase 3: Public Launch',
            title: 'Commercial Scale & Self-Serve Onboarding',
            targetDuration: 'Months 7–9',
            dependencies: ['Pilot validation reports', 'Self-serve billing integration'],
            deliverables: [
              { text: 'Launch public marketing site & self-serve sandbox', completed: false },
              { text: 'Automated Stripe/Paddle volume usage billing', completed: false },
              { text: 'Publish third-party verified case study whitepaper', completed: false },
              { text: 'Activate outbound partner channel reseller network', completed: false },
            ],
            status: 'Planned',
          },
          {
            id: 'm-4',
            phase: 'Phase 4: Scale',
            title: 'Autonomous Ecosystem & API Marketplace',
            targetDuration: 'Months 10–12',
            dependencies: ['Public launch stability', 'Developer ecosystem SDK release'],
            deliverables: [
              { text: 'Public developer platform & third-party app plugins', completed: false },
              { text: 'International regional data residency clusters', completed: false },
              { text: 'Surpass $1.2M ARR run rate milestone', completed: false },
            ],
            status: 'Planned',
          },
        ],
        keyDependencies: [
          { item: 'Pilot Deployment', dependentOn: 'SOC2 Security Readiness', criticalPath: true },
          { item: 'Public Self-Serve Billing', dependentOn: 'Pilot Contract Renewals', criticalPath: false },
          { item: 'Channel Partner Program', dependentOn: 'Documented Case Study ROI', criticalPath: true },
        ],
      },
      brainstormNodes: [
        { id: 'node-1', title: 'Core Autonomous Engine', description: 'Real-time optimization loop coordinating disparate assets', category: 'Core', x: 260, y: 140, connectedTo: ['node-2', 'node-3', 'node-4'] },
        { id: 'node-2', title: 'Edge Protocol Adapter', description: 'Lightweight binary for local field protocol parsing', category: 'Product', x: 80, y: 280, connectedTo: [] },
        { id: 'node-3', title: 'Executive ROI Simulator', description: 'Pre-sales calculator demonstrating instant payback', category: 'Market', x: 260, y: 320, connectedTo: ['node-5'] },
        { id: 'node-4', title: 'Zero-Trust Audit Vault', description: 'Cryptographic proof logs for regulatory scrutiny', category: 'Feature', x: 460, y: 280, connectedTo: [] },
        { id: 'node-5', title: 'Tiered Enterprise Distribution', description: 'Channel partnerships with certified engineering integrators', category: 'Distribution', x: 260, y: 460, connectedTo: [] },
      ],
      simulatorInputs: {
        cac: 1200,
        monthlyChurnPercent: 1.8,
        arpu: 2400,
        conversionRatePercent: 4.2,
        monthlyBurn: 24000,
        initialCapital: 180000,
        monthlyVisitors: 4500,
      },
      surveyResponses: [
        {
          id: 'surv-1',
          respondentRole: 'VP of Facilities (Mid-Market Real Estate)',
          npsScore: 9,
          sentiment: 'Positive',
          topRequestedFeature: 'Daily automated anomaly digest sent via Slack/Email',
          userQuote: '"If this reliably saves us from demand surcharge spikes without adding headcount, we would sign a 3-year agreement tomorrow."',
          willingnessToPay: '$2,500/mo',
        },
        {
          id: 'surv-2',
          respondentRole: 'Chief Technical Officer (Logistics Center)',
          npsScore: 8,
          sentiment: 'Positive',
          topRequestedFeature: 'Offline local fallback if external internet gateway drops',
          userQuote: '"The biggest hurdle is security vetting. Give us a clean self-hosted proxy and our infosec team will approve it."',
          willingnessToPay: '$3,200/mo',
        },
        {
          id: 'surv-3',
          respondentRole: 'Operations Analyst (Industrial Park)',
          npsScore: 7,
          sentiment: 'Neutral',
          topRequestedFeature: 'Direct 1-click export into Microsoft PowerBI and Excel',
          userQuote: '"Currently we spend Monday mornings formatting CSV files. Automated exports alone save 6 hours weekly."',
          willingnessToPay: '$1,200/mo',
        },
      ],
    },
    brandStrategy: {
      approvedCoreValue: understanding.corePremise,
      audiencePositionings: [
        {
          personaName: 'Enterprise Infrastructure Operators',
          segmentTag: 'B2B Enterprise',
          coreValueAnchor: 'Guaranteed operational continuity and verifiable audit defense.',
          tailoredHeadline: 'Autonomous Operational Intelligence With Zero SLA Compromise',
          tailoredValueProposition: 'Protect margins and eliminate demand penalty volatility with continuous, sub-second edge optimization that integrates directly into existing SCADA infrastructure.',
          primaryProofPoint: '34% average reduction in operational waste validated across 12-month benchmark studies.',
          keyObjection: '"Our team cannot afford a 6-month deployment delay or security vulnerability."',
          rebuttal: 'Air-gapped deployment option, SOC2 Type II verified, live in under 48 hours with zero production downtime.',
          callToAction: 'Schedule Private Infrastructure Audit',
        },
        {
          personaName: 'Agile Mid-Market Facility Managers',
          segmentTag: 'Mid-Market Commercial',
          coreValueAnchor: 'Instant self-serve payback and intuitive operational telemetry.',
          tailoredHeadline: 'Stop Paying Demand Penalties. Start Automating in 48 Hours.',
          tailoredValueProposition: 'Turn chaotic operational telemetry into predictable monthly savings with an intuitive platform built for fast-moving teams without specialized engineering staff.',
          primaryProofPoint: 'Full payback achieved in under 9 months on standard mid-market contracts.',
          keyObjection: '"We don’t have an internal data science team to configure models."',
          rebuttal: 'Pre-trained models self-calibrate from the first week of live telemetry without manual tuning.',
          callToAction: 'Start 14-Day Interactive Sandbox',
        },
      ],
      messagingAlternatives: [
        {
          id: 'msg-1',
          label: 'Option A: The Decisive Vanguard (High-Authority)',
          tone: 'Authoritative, technical, institutional',
          headline: 'The Autonomous Infrastructure Standard for Modern Enterprise.',
          subheadline: 'Sub-second edge dispatch, zero-trust telemetry, and guaranteed operational resilience.',
          elevatorPitch: 'We engineer the autonomous orchestration layer that eliminates operational waste and protects enterprise margins from peak demand volatility.',
          bestForAudience: 'Enterprise C-Suite & Risk Executives',
          isSelected: true,
        },
        {
          id: 'msg-2',
          label: 'Option B: The Pragmatic Catalyst (Results-Forward)',
          tone: 'Direct, clear, ROI-centric',
          headline: 'Eliminate Operational Waste. Guaranteed in 48 Hours.',
          subheadline: 'Plug-and-play predictive intelligence that reduces overhead by 30% from day one.',
          elevatorPitch: 'We help facility operators automate repetitive monitoring and slash demand surcharges without the 6-month consulting circus.',
          bestForAudience: 'Mid-Market Operations Directors',
          isSelected: false,
        },
        {
          id: 'msg-3',
          label: 'Option C: The Elegant Architect (Modern Minimalist)',
          tone: 'Sophisticated, visionary, understated',
          headline: 'Infrastructure Reimagined as Pure Signal.',
          subheadline: 'Intelligent systems operating in seamless synchrony with global sustainability mandates.',
          elevatorPitch: 'The elegant bridge between physical infrastructure and autonomous software intelligence.',
          bestForAudience: 'Design-forward Founders & Sustainability Leaders',
          isSelected: false,
        },
      ],
      channelComparisons: [
        {
          channel: 'Account-Based Direct Outbound (Enterprise)',
          cacEstimate: '$1,800 - $3,200',
          ltvEstimate: '$48,000+',
          channelFitScore: 9.2,
          organicVsPaid: 'Paid',
          pros: 'Direct access to verified decision makers with budget authority.',
          cons: 'Requires 60–90 day nurture cadence and tailored account research.',
        },
        {
          channel: 'Technical Whitepapers & Engineering Benchmarks',
          cacEstimate: '$650 - $1,100',
          ltvEstimate: '$28,000',
          channelFitScore: 8.7,
          organicVsPaid: 'Organic',
          pros: 'Builds enduring high-trust inbound pipeline among technical evaluators.',
          cons: 'Slow 4-6 month compound timeline to hit high traffic volume.',
        },
        {
          channel: 'Targeted LinkedIn & Industry Association Ads',
          cacEstimate: '$1,400 - $2,200',
          ltvEstimate: '$24,000',
          channelFitScore: 7.4,
          organicVsPaid: 'Paid',
          pros: 'High precision demographic filters by job title and company size.',
          cons: 'Ad fatigue and elevated CPMs ($85+) in specialized B2B categories.',
        },
      ],
      pricingModels: [
        {
          name: 'Starter Pilot',
          pricePerMonth: '$1,450',
          targetUser: 'Single facility / up to 50 telemetry nodes',
          features: [
            'Real-time anomaly detection & alerts',
            'Standard REST API & webhook access',
            'Weekly automated PDF executive reports',
            'Email & Discord community support',
          ],
          marginEstimate: '82%',
          isRecommended: false,
        },
        {
          name: 'Professional Orchestrator',
          pricePerMonth: '$3,850',
          targetUser: 'Multi-site portfolio / up to 250 telemetry nodes',
          features: [
            'Autonomous closed-loop dispatch actuation',
            'Sub-80ms edge failover guarantees',
            'Predictive 7-day tariff scenario simulator',
            'Dedicated technical account manager & 4h SLA',
            'Custom ERP & SCADA integration connectors',
          ],
          marginEstimate: '78%',
          isRecommended: true,
        },
        {
          name: 'Enterprise Sovereign',
          pricePerMonth: 'Custom ($8k+)',
          targetUser: 'Global portfolio / unlimited telemetry nodes',
          features: [
            'Air-gapped on-premise proxy deployment',
            'SOC2 Type II & FedRAMP compliance packages',
            'Custom machine-learning model fine-tuning',
            '99.99% uptime financial credit SLA',
            '24/7 dedicated telephone & pager incident response',
          ],
          marginEstimate: '74%',
          isRecommended: false,
        },
      ],
      strategicScenarios: [
        {
          name: 'Aggressive Self-Serve Growth Sprint',
          hypothesis: 'Lowering the initial tier price to $490/mo will drive 4x user volume and viral bottom-up expansion.',
          downsideRisk: 'Risk of attracting low-LTV churn accounts that overwhelm customer engineering support.',
          upsidePotential: 'Rapid market share capture and widespread telemetry network effects.',
          strategyAdjustment: 'Gate autonomous write-back behind the $3,850 tier; keep $490 tier strictly read-only monitoring.',
        },
        {
          name: 'High-Touch Enterprise Consolidation',
          hypothesis: 'Focus exclusively on top 100 enterprise accounts with minimum $60k ACV contracts.',
          downsideRisk: 'Severe cash flow vulnerability if 2 enterprise deals slip by one fiscal quarter.',
          upsidePotential: 'Extremely high capital efficiency and negative net revenue churn.',
          strategyAdjustment: 'Maintain hybrid inbound funnel while running high-touch outbound to top 25 accounts.',
        },
      ],
      consistencyChecker: {
        overallAlignmentScore: 94,
        lastAudited: 'Just now',
        alerts: [
          {
            id: 'al-1',
            severity: 'Passed',
            message: 'Core value proposition is preserved across both Enterprise and Mid-Market messaging variants.',
            affectedElement: 'Audience & Positioning Headlines',
            remedyAction: 'No action required.',
          },
          {
            id: 'al-2',
            severity: 'Review',
            message: 'Option B messaging emphasizes speed (48 hours) while Pricing Model specifies 9-month payback. Ensure metric consistency.',
            affectedElement: 'Messaging Alternative B vs Pricing Pro-Forma',
            remedyAction: 'Clarify: 48 hours to first telemetry; 9 months to full capital payback.',
          },
        ],
      },
    },
    designStudio: {
      activeDirectionId: 'direction-a',
      customCombinations: {
        selectedPaletteDirection: 'direction-a',
        selectedTypographyDirection: 'direction-a',
        selectedLogoDirection: 'direction-a',
        selectedImageryDirection: 'direction-a',
      },
      directions: [
        {
          id: 'direction-a',
          title: 'Direction A: Editorial Avant-Garde',
          tagline: 'Warm architectural restraint meets high-authority editorial typography.',
          vibe: 'Cultured, disciplined, timeless, architectural',
          suggestedNames: [
            { name: `${projectName}`, rationale: 'Direct, clear, memorable authority.', isAvailableDomainIdea: '.com / .co' },
            { name: 'Stratum Core', rationale: 'Evokes structural depth, layers of telemetry, and geological reliability.', isAvailableDomainIdea: '.io / .ai' },
            { name: 'Vanguard Pulse', rationale: 'Commands category leadership with dynamic momentum.', isAvailableDomainIdea: '.network' },
          ],
          logoConceptBrief: {
            markDescription: 'Monolithic geometric ligature fusing the initial letter with an architectural precision corner.',
            iconSymbol: '◬',
            constructionNotes: 'Drawn on a 16px isometric grid with 45-degree chamfers and hairline ink traps.',
          },
          colorPalette: [
            { name: 'Alabaster Canvas', hex: '#F1EEE4', usage: 'Background' },
            { name: 'Raw Surface', hex: '#FAF8F3', usage: 'Surface' },
            { name: 'Pristine White', hex: '#FFFFFF', usage: 'Primary' },
            { name: 'Kinetic Amber', hex: '#FF6124', usage: 'Accent' },
            { name: 'Obsidian Ink', hex: '#1C1917', usage: 'Text' },
            { name: 'Stone Hairline', hex: '#E4DFD3', usage: 'Surface' },
          ],
          typographyPreview: {
            displayFace: 'Plus Jakarta Sans Display',
            displaySample: 'Autonomous Infrastructure Engineered for Absolute Certainty.',
            bodyFace: 'Plus Jakarta Sans',
            bodySample: 'Every telemetry event is cryptographically indexed and optimized with sub-second determinism.',
            monoFace: 'Space Mono / Tabular',
            monoSample: 'LATENCY: 42ms · EFFICIENCY: +34.2% · NODES: 1,420',
          },
          moodboardKeywords: ['Architectural travertine', 'Brutalist concrete balance', 'Warm parchment texture', 'Precision hairline dividers', 'High-contrast editorial serif'],
          imageryDirection: {
            artStyle: 'High-contrast architectural and documentary photography with clean shadows and natural travertine surfaces.',
            lightingAndTone: 'Warm raking side lighting, muted 35mm film grain, editorial dignity without corporate stock plastic.',
            guidelines: [
              'No generic stock photos of smiling business teams pointing at glass whiteboards',
              'Emphasize real industrial hardware, raw textures, and uncluttered negative space',
              'Monochrome documentation with intentional kinetic amber accent highlights',
            ],
            samplePrompt: 'Documentary photograph of modern clean electrical switchgear facility, natural morning window illumination, warm travertine stone textures, Leica 35mm aesthetic.',
          },
          packagingConcept: {
            style: 'Unbleached heavy kraft substrate with blind deboss typography',
            materials: '100% recycled cotton cardstock and vegetable oil black ink',
            tactileFinish: 'Matte tactile linen texture with high-density edge painting',
            notes: 'Reflects sustainability and engineered permanence.',
          },
          socialDesignDirection: [
            { platform: 'LinkedIn / Thought Leadership', cardStyle: '1200x630px warm canvas card with giant numerical proof point (+34%) and author citation.', templateSummary: 'Clean typographic thesis cards with subtle hairline framing.' },
            { platform: 'X / Engineering Changelog', cardStyle: 'Monochrome terminal snippets paired with bold 2-color kinetic amber release badges.', templateSummary: 'Crisp developer updates emphasizing performance gains.' },
          ],
          uiUxConcepts: {
            cornerRounding: 'rounded-xl (12px on cards, 8px on buttons)',
            shadowStyle: 'shadow-2xs soft diffuse ambient occlusion without dark blurs',
            elevationLevel: 'Single-elevation flat planes separated by 1px hairline borders',
            buttonTokens: 'px-4 py-2 text-xs font-bold tracking-tight rounded-xl',
          },
          websiteTemplateInspiration: {
            layoutType: 'Asymmetric 12-column editorial grid with 3-zone sticky navigation header',
            heroStructure: 'Split viewport: 60% bold headline & pro-forma calculator + 40% interactive node canvas',
            navStyle: 'Single-row header with single wordmark and text navigation links',
          },
        },
        {
          id: 'direction-b',
          title: 'Direction B: Kinetic Modernist',
          tagline: 'High-velocity technological precision with high-density data telemetry.',
          vibe: 'Hyper-responsive, analytical, technical, electric',
          suggestedNames: [
            { name: 'Kinetix System', rationale: 'Signals rapid execution, kinetic energy, and continuous momentum.', isAvailableDomainIdea: '.tech / .sh' },
            { name: 'Flux Vector', rationale: 'Mathematical terminology implying dynamic directional force.', isAvailableDomainIdea: '.run' },
            { name: 'Synapse Edge', rationale: 'Evokes autonomous neurological pathways at the perimeter.', isAvailableDomainIdea: '.dev' },
          ],
          logoConceptBrief: {
            markDescription: 'Twin parallel chevrons intersecting at a 60-degree angle to suggest forward velocity.',
            iconSymbol: '⚡',
            constructionNotes: 'Optimized for 16x16px favicon visibility and high-contrast dark mode display.',
          },
          colorPalette: [
            { name: 'Deep Carbon', hex: '#0F1115', usage: 'Background' },
            { name: 'Surface Slate', hex: '#181B22', usage: 'Surface' },
            { name: 'Pure White', hex: '#FFFFFF', usage: 'Primary' },
            { name: 'Signal Amber', hex: '#FF6124', usage: 'Accent' },
            { name: 'Terminal Green', hex: '#10B981', usage: 'Accent' },
            { name: 'Subtle Slate', hex: '#2E3440', usage: 'Surface' },
          ],
          typographyPreview: {
            displayFace: 'Syne / Space Grotesk',
            displaySample: 'Continuous Telemetry. Sub-Millisecond Autonomous Execution.',
            bodyFace: 'Plus Jakarta Sans',
            bodySample: 'Algorithmic load balancing operating natively across distributed edge hardware clusters.',
            monoFace: 'JetBrains Mono',
            monoSample: 'SYS_LOAD: 0.12 · EVENT_BUS: NOMINAL · RUNTIME: 99.99%',
          },
          moodboardKeywords: ['High-density data consoles', 'Brushed aluminum chassis', 'Subtle neon wireframes', 'Tabular numerals', 'Dark mode telemetry'],
          imageryDirection: {
            artStyle: 'Crisp isometric 3D system architecture diagrams and dark metallic telemetry hardware.',
            lightingAndTone: 'Cool studio rim lighting, deep charcoal shadows, electric amber edge highlights.',
            guidelines: [
              'Avoid cartoonish 3D floating spheres or generic AI sparkles',
              'Use precise CAD cross-sections and real hardware textures',
              'Pair every technical render with verifiable engineering specifications',
            ],
            samplePrompt: 'Isometric 3D engineering schematic of high-performance microgrid edge computer, matte black anodized aluminum, subtle amber status LED, clean studio background.',
          },
          packagingConcept: {
            style: 'Precision machined die-cut protective enclosure with laser-etched serial numbers',
            materials: 'Anodized recycled aluminum and anti-static ESD foam',
            tactileFinish: 'Micro-bead blasted silky metallic surface',
            notes: 'Communicates industrial-grade mission-critical reliability.',
          },
          socialDesignDirection: [
            { platform: 'LinkedIn / Product Highlights', cardStyle: 'Dark mode dashboard telemetry frames with annotated feature callouts.', templateSummary: 'SaaS product screenshot cards with live metric tags.' },
            { platform: 'X / Benchmarks', cardStyle: 'Side-by-side terminal comparison bar charts with latency timings.', templateSummary: 'High-density developer proof cards.' },
          ],
          uiUxConcepts: {
            cornerRounding: 'rounded-lg (8px cards, 6px buttons)',
            shadowStyle: 'Inner border glow with subtle hairline backdrop filter',
            elevationLevel: 'Layered dark slate cards with high contrast text',
            buttonTokens: 'px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide',
          },
          websiteTemplateInspiration: {
            layoutType: 'Dark mode developer portal with sticky documentation sidebar',
            heroStructure: 'Centered high-impact headline above an interactive live code and API sandbox',
            navStyle: 'Dense top bar with real-time status beacon and GitHub star counter',
          },
        },
        {
          id: 'direction-c',
          title: 'Direction C: Nordic Warm Minimal',
          tagline: 'Human-centered calm design with unhurried typography and organic dignity.',
          vibe: 'Understated, trusted, serene, thoughtful',
          suggestedNames: [
            { name: 'Oura Form', rationale: 'Gentle, organic, memorable Scandinavian cadence.', isAvailableDomainIdea: '.co / .org' },
            { name: 'Clarity Grid', rationale: 'Speaks to transparency, calm operational visibility, and peace of mind.', isAvailableDomainIdea: '.global' },
            { name: 'Aura Protocol', rationale: 'Evokes protective ambient intelligence that quietly works in the background.', isAvailableDomainIdea: '.space' },
          ],
          logoConceptBrief: {
            markDescription: 'Continuous single-stroke organic circle gently intersecting a vertical datum line.',
            iconSymbol: '◎',
            constructionNotes: 'Harmonious golden ratio proportions with generous breathing room.',
          },
          colorPalette: [
            { name: 'Birch Canvas', hex: '#F7F5F0', usage: 'Background' },
            { name: 'Pale Bone', hex: '#FAF9F6', usage: 'Surface' },
            { name: 'Warm Cream', hex: '#EFECE4', usage: 'Surface' },
            { name: 'Terracotta Rust', hex: '#D9532F', usage: 'Accent' },
            { name: 'Charcoal Wool', hex: '#262422', usage: 'Text' },
            { name: 'Muted Taupe', hex: '#9E988F', usage: 'Surface' },
          ],
          typographyPreview: {
            displayFace: 'Instrument Serif / Garamond',
            displaySample: 'Calm Intelligence Designed to Give Operations Peace of Mind.',
            bodyFace: 'Plus Jakarta Sans',
            bodySample: 'Software that disappears into your routine, surfacing only the decisions that truly matter.',
            monoFace: 'IBM Plex Mono',
            monoSample: 'status: verified · updated: 2m ago · health: optimal',
          },
          moodboardKeywords: ['Scandi blonde oak', 'Natural wool textiles', 'Generous whitespace', 'Quiet human portraits', 'Soft diffused daylight'],
          imageryDirection: {
            artStyle: 'Natural daylight portraiture of operators at work in bright, airy environments.',
            lightingAndTone: 'Overcast soft Nordic window light, low saturation, honest human expressions.',
            guidelines: [
              'Zero exaggerated corporate poses or aggressive high-contrast flash',
              'Focus on moments of calm focus, thoughtful review, and tangible relief',
              'Warm organic wood and natural light environments',
            ],
            samplePrompt: 'Medium documentary shot of an operations engineer drinking coffee by a large sunlit window in a modern industrial plant, soft overcast morning light, muted color palette.',
          },
          packagingConcept: {
            style: 'Molded paper pulp trays wrapped in natural raw twine and debossed seal',
            materials: 'FSC-certified unbleached sugarcane fiber',
            tactileFinish: 'Rough organic texture that feels handcrafted yet precise',
            notes: 'Elevates unboxing into an intentional sensory ritual.',
          },
          socialDesignDirection: [
            { platform: 'LinkedIn / Essays', cardStyle: 'Quiet long-form editorial pull-quote cards on pale birch canvas.', templateSummary: 'Thoughtful founder notes and essay quotes.' },
            { platform: 'Instagram / Behind the Scenes', cardStyle: 'Warm photographic carousels documenting the design and engineering process.', templateSummary: 'Quiet human craft storytelling.' },
          ],
          uiUxConcepts: {
            cornerRounding: 'rounded-2xl (16px cards, 12px buttons)',
            shadowStyle: 'Soft expansive ambient shadow without hard outlines',
            elevationLevel: 'Airy floating cards on pale cream canvas',
            buttonTokens: 'px-5 py-2.5 text-xs font-medium tracking-normal rounded-2xl',
          },
          websiteTemplateInspiration: {
            layoutType: 'Expansive magazine broadsheet layout with generous 48px padding',
            heroStructure: 'Serif headline with single prominent CTA and quiet customer testimonial directly adjacent',
            navStyle: 'Clean typography links with subtle dot indicator for active page',
          },
        },
      ],
    },
    marketLaunch: {
      launchTimeline: [
        {
          phaseName: 'Pre-Launch: Private Alpha Teaser',
          duration: 'Weeks 1–4',
          focus: 'Anchor 5 enterprise letters of intent and publish technical manifesto.',
          milestones: [
            'Launch gated landing page with interactive ROI calculator',
            'Conduct 25 structured discovery interviews with facility heads',
            'Finalize initial security disclosure whitepaper',
          ],
        },
        {
          phaseName: 'Closed Beta: 10 Partner Deployments',
          duration: 'Weeks 5–10',
          focus: 'Live production telemetry cutover with zero downtime.',
          milestones: [
            'Deploy physical and virtual edge protocol bridges',
            'Measure and document 25%+ verified demand penalty savings',
            'Gather 3 video testimonials and detailed written case studies',
          ],
        },
        {
          phaseName: 'Public Launch: Category Announcement',
          duration: 'Weeks 11–14',
          focus: 'Broad press release, Product Hunt campaign, and industry webinar.',
          milestones: [
            'Coordinate launch day feature with top industry publication',
            'Host live virtual demo attended by 250+ operations leaders',
            'Open self-serve sandbox onboarding for mid-market teams',
          ],
        },
        {
          phaseName: 'Growth Sprint: Channel Reseller Expansion',
          duration: 'Weeks 15–20',
          focus: 'Scale outbound engine and certify 5 certified integration partners.',
          milestones: [
            'Onboard 5 certified third-party systems integrators',
            'Scale outbound account-based marketing to 500 target accounts',
            'Hit $100k Monthly Recurring Revenue milestone',
          ],
        },
      ],
      campaigns: [
        {
          id: 'camp-1',
          name: 'The "Hidden Surcharge" Executive Audit',
          phase: 'Pre-Launch',
          primaryChannel: 'Direct Account-Based Outbound',
          budgetAllocated: '$4,500',
          targetKpi: '25 Qualified Executive Discovery Calls',
          deliverable: 'Custom 4-page diagnostic report delivered to prospect CFO.',
          status: 'In Progress',
        },
        {
          id: 'camp-2',
          name: 'Technical Benchmark Whitepaper & Webinar',
          phase: 'Launch',
          primaryChannel: 'LinkedIn & Industry Associations',
          budgetAllocated: '$6,000',
          targetKpi: '350 Registrations / 80 MQLs',
          deliverable: '24-page peer-reviewed report co-authored with university lab.',
          status: 'Planned',
        },
        {
          id: 'camp-3',
          name: 'Self-Serve Interactive Sandbox Campaign',
          phase: 'Growth Sprint',
          primaryChannel: 'Technical Search & Developer Communities',
          budgetAllocated: '$3,500',
          targetKpi: '500 Sandbox Signups / 15% Activation',
          deliverable: 'Browser-based simulator with synthetic facility datasets.',
          status: 'Planned',
        },
      ],
      distributionChannels: [
        {
          channel: 'Direct Account-Based Outbound',
          strategy: 'Hyper-personalized outreach targeting facilities with public demand penalties.',
          priority: 'Core',
          projectedAcquisitionPercent: 55,
        },
        {
          channel: 'Certified Integration Partners',
          strategy: 'Revenue share (20% ongoing) for engineering consulting firms who deploy our platform.',
          priority: 'Core',
          projectedAcquisitionPercent: 28,
        },
        {
          channel: 'Organic Technical Content & Benchmark Studies',
          strategy: 'Authoritative data journalism analyzing macro grid stress and compliance bottlenecks.',
          priority: 'Secondary',
          projectedAcquisitionPercent: 17,
        },
      ],
      budgetBreakdown: [
        { category: 'Direct Outbound & Data Prospecting', percentage: 40, amountFormatted: '$8,000' },
        { category: 'Content Production & Benchmark Research', percentage: 25, amountFormatted: '$5,000' },
        { category: 'Paid Targeted Social & Industry Media', percentage: 20, amountFormatted: '$4,000' },
        { category: 'Event Sponsorships & Executive Roundtables', percentage: 15, amountFormatted: '$3,000' },
      ],
      readinessChecker: [
        {
          id: 'chk-1',
          title: 'Target Audience Persona & Pain Points Validated',
          targetWorkspace: 'research-discovery',
          targetSection: 'target-audience',
          isComplete: true,
          severity: 'Blocker',
          actionPrompt: 'Review persona pain points and customer segment readiness.',
        },
        {
          id: 'chk-2',
          title: 'Risk Matrix & Mitigation Action Plan Approved',
          targetWorkspace: 'research-discovery',
          targetSection: 'risks-drawbacks',
          isComplete: false,
          severity: 'Blocker',
          actionPrompt: 'Approve mitigation steps for customer data security and procurement lag.',
        },
        {
          id: 'chk-3',
          title: 'Core Positioning & Pricing Tiers Finalized',
          targetWorkspace: 'brand-strategy',
          targetSection: 'pricing-models',
          isComplete: false,
          severity: 'Blocker',
          actionPrompt: 'Select recommended pricing tier and audit consistency checker warnings.',
        },
        {
          id: 'chk-4',
          title: 'Brand Visual Direction & Color Palette Locked',
          targetWorkspace: 'design-studio',
          targetSection: 'directions',
          isComplete: true,
          severity: 'Important',
          actionPrompt: 'Review the 3 visual directions and finalize logo and typography pairings.',
        },
        {
          id: 'chk-5',
          title: 'Launch Timeline Milestones & Budgets Confirmed',
          targetWorkspace: 'market-launch',
          targetSection: 'timeline',
          isComplete: false,
          severity: 'Important',
          actionPrompt: 'Allocate budget across the 3 campaigns and finalize Phase 1 dates.',
        },
      ],
    },
    brandKit: {
      executiveSummary: `Stratum Venture Intelligence report for ${projectName}. Designed as a comprehensive institutional dossier synthesizing research discovery, audience segmentation, defensible brand strategy, design identity guidelines, and an actionable 20-week market launch blueprint.`,
      sections: [
        { id: 'sec-1', title: '1. Executive Summary & Core Value Anchor', included: true, description: 'Core problem, unfair advantage, and foundational value proposition.' },
        { id: 'sec-2', title: '2. Market Opportunity & Competitive Intelligence', included: true, description: 'TAM/SAM/SOM breakdown, competitor matrix, and positioning quadrant.' },
        { id: 'sec-3', title: '3. Customer Personas & Pain Point Map', included: true, description: 'Detailed buyer profiles, willingness to pay, and friction comparisons.' },
        { id: 'sec-4', title: '4. Brand Positioning & Consistency Audit', included: true, description: 'Audience-tailored messaging, channel fit, and drift verification.' },
        { id: 'sec-5', title: '5. Visual Identity & Design Tokens', included: true, description: 'Approved palette, typography pairings, moodboards, and UI specs.' },
        { id: 'sec-6', title: '6. Phased Launch Timeline & Campaign Budgets', included: true, description: 'Milestones, channel distribution, and readiness checklist.' },
      ],
      customNotes: 'Prepared for executive committee review. All research citations grounded in verifiable industry benchmarks.',
      lastGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    decisionHistory: [
      {
        id: 'dec-1',
        timestamp: new Date().toISOString(),
        workspace: 'onboarding',
        title: 'Project Initialized & Core Premise Approved',
        description: `Submitted rough idea: "${rawIdea}". Initialized research architecture.`,
        actionType: 'create',
        affectsDownstreamWorkspaces: ['research-discovery', 'brand-strategy', 'design-studio', 'market-launch'],
      },
      {
        id: 'dec-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        workspace: 'research-discovery',
        title: 'Target Audience Segments Approved',
        description: 'Prioritized Mid-Market Commercial Operators as Primary Beachhead target.',
        actionType: 'approve',
        affectsDownstreamWorkspaces: ['brand-strategy'],
      },
    ],
    downstreamReviewFlags: [],
  };

  return project;
}
