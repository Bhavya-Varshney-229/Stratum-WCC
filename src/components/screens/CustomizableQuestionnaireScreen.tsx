import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
  Layers,
  Wand2,
  Compass,
  Target,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from 'lucide-react';
import {
  QuestionnaireAnswers,
  IdeaUnderstanding,
  ProjectType,
  DynamicQuestion,
} from '../../types/venture';
import { PRESET_IDEAS } from '../../services/ventureStorage';

interface CustomizableQuestionnaireScreenProps {
  initialProjectType?: ProjectType;
  onConfirmAndProceed: (
    rawIdea: string,
    answers: QuestionnaireAnswers,
    customUnderstanding?: Partial<IdeaUnderstanding>,
    projectType?: ProjectType,
    dynamicQuestions?: DynamicQuestion[],
    dynamicAnswers?: Record<string, string>
  ) => void;
  onBackToHome: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

type Step = 'idea-input' | 'questionnaire' | 'understanding';

export const CustomizableQuestionnaireScreen: React.FC<CustomizableQuestionnaireScreenProps> = ({
  initialProjectType = 'new_brand',
  onConfirmAndProceed,
  onBackToHome,
  theme = 'light',
  onToggleTheme,
}) => {
  const [projectType, setProjectType] = useState<ProjectType>(initialProjectType);
  const [step, setStep] = useState<Step>('idea-input');

  // Step 1: Raw Idea / Business Brief
  const [rawIdea, setRawIdea] = useState('');
  const [currentBrandName, setCurrentBrandName] = useState('');

  // Step 2: Dynamic Questions & Free-Text Answers
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [freeTextAnswers, setFreeTextAnswers] = useState<Record<string, string>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiDraftingQuestionId, setAiDraftingQuestionId] = useState<string | null>(null);

  // Step 3: AI-Generated Understanding of Idea
  const [understanding, setUnderstanding] = useState<IdeaUnderstanding | null>(null);
  const [isEditingUnderstanding, setIsEditingUnderstanding] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Generate initial questions based on project type and brief
  const generateQuestionsForBrief = (type: ProjectType, brief: string) => {
    if (type === 'rebrand') {
      return [
        {
          id: 'q-rebrand-1',
          title: 'Current Brand Identity & Legacy Goodwill',
          description: 'What does your business currently stand for, and what positive customer equity or reputational assets must be strictly preserved?',
          placeholder: 'e.g. We have operated for 12 years known for high reliability, but our visual identity feels outdated and does not resonate with modern software buyers...',
        },
        {
          id: 'q-rebrand-2',
          title: 'Primary Drivers for Rebranding Now',
          description: 'What specific friction, messaging fatigue, market changes, or growth ceiling are prompting this repositioning?',
          placeholder: 'e.g. Our average contract value has stalled, competitors are portraying us as a legacy vendor, and our current naming restricts us to hardware rather than cloud SaaS...',
        },
        {
          id: 'q-rebrand-3',
          title: 'Aspirational Audience & Expanded Markets',
          description: 'Who are you trying to win over that your existing brand currently fails to attract? Describe their expectations and pain points.',
          placeholder: 'e.g. Enterprise Chief Information Security Officers and VP of Operations who demand modern zero-trust compliance standards...',
        },
        {
          id: 'q-rebrand-4',
          title: 'Evolution of Product or Delivery Model',
          description: 'How has what you actually deliver evolved? (e.g., automated delivery, expanded service layers, API integrations).',
          placeholder: 'e.g. We shifted from manual annual consulting audits to continuous real-time telemetry monitoring with an automated customer dashboard...',
        },
        {
          id: 'q-rebrand-5',
          title: 'Desired Perception & Brand Transformation Goal',
          description: 'In one year, when an industry leader mentions your rebranded business, what three words or core truth should immediately come to mind?',
          placeholder: 'e.g. Autonomous, mathematically defensible, institutional-grade speed...',
        },
      ];
    } else {
      // New Brand
      return [
        {
          id: 'q-new-1',
          title: 'Core Problem & Customer Pain Point',
          description: 'What structural friction or painful inefficiency exists today? What happens if customers do not solve this?',
          placeholder: 'e.g. Commercial building operators lose 30%+ of renewable solar energy because legacy battery controllers cannot dynamically anticipate spot market tariff surges...',
        },
        {
          id: 'q-new-2',
          title: 'Ideal Customer Profile & Daily Workflow',
          description: 'Who feels this problem most acutely on a daily basis? What is their role, budget authority, and current workaround?',
          placeholder: 'e.g. VP of Facilities and Asset Managers managing 500k+ sq ft portfolios who currently rely on manual spreadsheet schedules...',
        },
        {
          id: 'q-new-3',
          title: 'Unfair Advantage & Technical Moat',
          description: 'What is your unique operational leverage, proprietary algorithm, patent, distribution edge, or structural advantage?',
          placeholder: 'e.g. Proprietary predictive tariff dispatch algorithm trained on 5 years of commercial telemetry with sub-second automated grid switching...',
        },
        {
          id: 'q-new-4',
          title: 'Business Model & Monetization Mechanics',
          description: 'How will you make money? What is your pricing philosophy and expected contract size or subscription tier?',
          placeholder: 'e.g. Annual B2B SaaS license ($24k/building) + 15% shared savings performance fee on verified utility demand-charge reductions...',
        },
        {
          id: 'q-new-5',
          title: '12-Month Market Vision & Brand Anchor',
          description: 'What is the north-star brand position you want to establish within your first year of public launch?',
          placeholder: 'e.g. The definitive autonomous energy orchestrator for decentralized commercial clean microgrids...',
        },
      ];
    }
  };

  // Start Questionnaire
  const handleProceedToQuestionnaire = async () => {
    if (!rawIdea.trim()) return;
    setIsGeneratingQuestions(true);

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: rawIdea, projectType }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          const initialAnswers: Record<string, string> = {};
          data.questions.forEach((q: DynamicQuestion) => {
            initialAnswers[q.id] = '';
          });
          setFreeTextAnswers(initialAnswers);
          setIsGeneratingQuestions(false);
          setStep('questionnaire');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch (e) {
      console.warn('Questions API fallback', e);
    }

    // Heuristic fallback
    const generated = generateQuestionsForBrief(projectType, rawIdea);
    setQuestions(generated);

    // Initialize empty free-text answers
    const initialAnswers: Record<string, string> = {};
    generated.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setFreeTextAnswers(initialAnswers);
    setIsGeneratingQuestions(false);
    setStep('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preset picker
  const handleSelectPreset = (preset: (typeof PRESET_IDEAS)[0]) => {
    setRawIdea(preset.rawIdea);
    if (projectType === 'rebrand') {
      setCurrentBrandName('Kinetix Legacy Roasting Co.');
    }
  };

  // Dynamic Question Operations
  const handleAnswerChange = (qId: string, val: string) => {
    setFreeTextAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleStartEditQuestion = (q: DynamicQuestion) => {
    setEditingQuestionId(q.id);
    setEditedTitle(q.title);
  };

  const handleSaveEditQuestion = (qId: string) => {
    if (!editedTitle.trim()) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, title: editedTitle.trim() } : q))
    );
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (qId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    setFreeTextAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleAddCustomQuestion = () => {
    const newId = `q-custom-${Date.now()}`;
    const newQ: DynamicQuestion = {
      id: newId,
      title: 'Custom Strategic Parameter',
      description: 'Define your custom inquiry to tailor the downstream brand research models.',
      placeholder: 'Type your strategic notes, assumptions, or specific considerations here...',
    };
    setQuestions((prev) => [...prev, newQ]);
    setFreeTextAnswers((prev) => ({ ...prev, [newId]: '' }));
    setEditingQuestionId(newId);
    setEditedTitle('Custom Strategic Parameter');
  };

  // AI Assistant: Auto-Draft Answer for a specific question
  const handleAiDraftAnswer = async (q: DynamicQuestion) => {
    setAiDraftingQuestionId(q.id);

    try {
      const res = await fetch('/api/ai/draft-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: rawIdea,
          questionTitle: q.title,
          questionDescription: q.description || '',
          projectType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.draft) {
          setFreeTextAnswers((prev) => ({
            ...prev,
            [q.id]: prev[q.id] ? `${prev[q.id]}\n\n${data.draft}` : data.draft,
          }));
          setAiDraftingQuestionId(null);
          return;
        }
      }
    } catch (e) {
      console.warn('Draft answer API fallback', e);
    }

    let draftText = '';
    const lower = q.title.toLowerCase();

    if (lower.includes('problem') || lower.includes('driver')) {
      draftText = `Organizations currently lose quantifiable operating margin and waste hours of labor due to fragmented, manual monitoring and legacy vendor friction. Existing solutions lack automated telemetry, resulting in costly reactive firefighting.`;
    } else if (lower.includes('customer') || lower.includes('audience')) {
      draftText = `Mid-market enterprise directors and asset leads with $100k+ discretionary operational budgets seeking rapid sub-48-hour implementation without requiring specialized internal engineering overhead.`;
    } else if (lower.includes('advantage') || lower.includes('moat')) {
      draftText = `Proprietary predictive optimization algorithm with verified sub-second response times, protected by trade secrets and a 3-year historical benchmark dataset.`;
    } else if (lower.includes('business') || lower.includes('monetization')) {
      draftText = `Predictable annual B2B subscription tier ($18,000 - $45,000/yr) supplemented by value-based performance share on verified net operational cost reductions. High gross margins (75%+).`;
    } else if (lower.includes('legacy') || lower.includes('preserve')) {
      draftText = `Preserve the deep industry reputation for zero-downtime reliability and enterprise customer support, while completely modernizing visual identity, digital UI, and modern API accessibility.`;
    } else {
      draftText = `Focused on defensible operational leverage and mathematical rigor. Designed to systematically eliminate administrative overhead and establish a benchmark-grade category standard.`;
    }

    setFreeTextAnswers((prev) => ({
      ...prev,
      [q.id]: prev[q.id] ? `${prev[q.id]}\n\n${draftText}` : draftText,
    }));
    setAiDraftingQuestionId(null);
  };

  // Step 2 Submission -> Step 3 Synthesis
  const handleQuestionnaireSubmit = async () => {
    setIsSynthesizing(true);
    const isRebrand = projectType === 'rebrand';

    try {
      const res = await fetch('/api/ai/synthesize-understanding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawIdea,
          projectType,
          category: isRebrand ? 'Modernized Enterprise Solutions' : 'Autonomous Infrastructure & Software',
          answers: freeTextAnswers,
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        if (aiData.coreValue) {
          const draft: IdeaUnderstanding = {
            ...aiData,
            projectName: isRebrand && currentBrandName.trim()
              ? `${currentBrandName.trim()} Reimagined`
              : (aiData.projectName || 'Aura Grid'),
            rebrandDetails: isRebrand
              ? {
                  currentIdentity: freeTextAnswers['q-rebrand-1'] || 'Established operational vendor with strong reliability goodwill.',
                  currentCustomers: 'Legacy commercial accounts and enterprise facilities.',
                  reasonsForRebranding: freeTextAnswers['q-rebrand-2'] || 'Outdated perception, price pressure, and TAM expansion into cloud buyers.',
                  desiredChanges: 'Modern architectural visual identity, higher ACV, and automated software positioning.',
                  elementsToPreserve: 'Reputation for uptime, direct customer relationships, and core engineering integrity.',
                }
              : undefined,
          };

          setUnderstanding(draft);
          setIsSynthesizing(false);
          setStep('understanding');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch (e) {
      console.warn('Synthesis API fallback', e);
    }

    // Heuristic fallback
    const draft: IdeaUnderstanding = {
      projectName: isRebrand
        ? (currentBrandName.trim() ? `${currentBrandName.trim()} Reimagined` : 'Kinetix Studio')
        : 'Aura Grid',
      projectType,
      businessCategory: isRebrand ? 'Modernized Enterprise Solutions' : 'Autonomous Infrastructure & Software',
      businessDescription: rawIdea,
      productOrService: isRebrand
        ? 'Next-generation modular platform modernizing legacy operational services into real-time digital automation'
        : 'Autonomous intelligence dispatch engine for commercial operational optimization',
      problemBeingSolved:
        freeTextAnswers['q-new-1'] ||
        freeTextAnswers['q-rebrand-2'] ||
        'Manual operational friction, fragmented legacy vendor tools, and severe lack of automated telemetry.',
      coreValue: isRebrand
        ? 'Preserving institutional reliability while elevating velocity, digital precision, and modern visual authority.'
        : 'Deterministic autonomous optimization delivering verifiable payback in under 9 months.',
      potentialCustomers:
        freeTextAnswers['q-new-2'] ||
        freeTextAnswers['q-rebrand-3'] ||
        'Commercial enterprise operators, multi-tenant asset managers, and VP of Operations.',
      differentiation:
        freeTextAnswers['q-new-3'] ||
        freeTextAnswers['q-rebrand-4'] ||
        'Proprietary predictive algorithm with sub-second execution loop and verifiable cryptographic audit trail.',
      businessGoals:
        freeTextAnswers['q-new-4'] ||
        freeTextAnswers['q-rebrand-5'] ||
        'Establish market-leading category benchmark with negative net revenue churn and 75%+ gross margin.',
      constraints: [
        'Customer procurement review cycles must stay within 45 days',
        'Field deployment must operate reliably without specialized developer overhead',
        'Regulatory compliance data privacy guarantees must remain zero-trust',
      ],
      importantAssumptions: [
        'Buyers prioritize mathematical payback guarantees over incumbent vendor prestige',
        'Target commercial accounts have sufficient digital telemetry infrastructure installed',
        'Pricing structure can absorb a 20% cloud compute or infrastructure margin buffer',
      ],
      unresolvedQuestions: [
        'What is the exact inflection point in customer contract willingness-to-pay?',
        'How quickly can legacy users transition to the modernized brand positioning without confusion?',
        'Which distribution channel delivers the lowest customer acquisition cost (CAC)?',
      ],
      rebrandDetails: isRebrand
        ? {
            currentIdentity: freeTextAnswers['q-rebrand-1'] || 'Established operational vendor with strong reliability goodwill.',
            currentCustomers: 'Legacy commercial accounts and enterprise facilities.',
            reasonsForRebranding: freeTextAnswers['q-rebrand-2'] || 'Outdated perception, price pressure, and TAM expansion into cloud buyers.',
            desiredChanges: 'Modern architectural visual identity, higher ACV, and automated software positioning.',
            elementsToPreserve: 'Reputation for uptime, direct customer relationships, and core engineering integrity.',
          }
        : undefined,
      corePremise: `${isRebrand ? 'Repositioning' : 'Greenfield venture'}: ${rawIdea}`,
      primaryProblem:
        freeTextAnswers['q-new-1'] ||
        freeTextAnswers['q-rebrand-2'] ||
        'Severe operating margin loss and administrative waste due to unoptimized manual processes.',
      targetAudienceSummary:
        freeTextAnswers['q-new-2'] ||
        freeTextAnswers['q-rebrand-3'] ||
        'Commercial asset operators seeking verified ROI and low onboarding friction.',
      unfairAdvantage:
        freeTextAnswers['q-new-3'] ||
        freeTextAnswers['q-rebrand-4'] ||
        'Proprietary predictive dispatch logic with verified audit defensibility.',
      businessModelSummary:
        freeTextAnswers['q-new-4'] ||
        'Annual B2B SaaS license tiered by operational volume with performance incentives.',
      unresolvedAssumptions: [
        'Customer willingness to connect telemetry feeds without a 90-day sandbox pilot',
        'Payback horizon under 9 months is sufficient to bypass competitive bidding committees',
        'Unit economics resilience under a 20% hardware or cloud compute cost surge',
      ],
      suggestedFocusAreas: [
        'Conduct 15 customer discovery interviews on willingness-to-pay',
        'Validate technical latency bounds in low-bandwidth field environments',
        'Establish defensible IP moat around the core dispatch logic',
      ],
    };

    setUnderstanding(draft);
    setIsSynthesizing(false);
    setStep('understanding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Actions
  const handleConfirmUnderstanding = () => {
    if (!understanding) return;

    // Convert free text answers into standard questionnaire format for project store
    const standardAnswers: QuestionnaireAnswers = {
      industry: understanding.businessCategory || 'Technology & Innovation',
      customerType: understanding.potentialCustomers || 'Target Enterprise Buyers',
      unfairAdvantage: understanding.differentiation || 'Proprietary Technology',
      businessModel: understanding.businessModelSummary || 'B2B Commercial Subscription',
      launchStage: projectType === 'rebrand' ? 'Field Testing / Beta' : 'Early Prototype / MVP',
    };

    onConfirmAndProceed(
      rawIdea,
      standardAnswers,
      understanding,
      projectType,
      questions,
      freeTextAnswers
    );
  };

  const handleClarifyDeepen = () => {
    if (!understanding) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setUnderstanding({
        ...understanding,
        coreValue: `${understanding.coreValue} Enhanced with sub-100ms telemetry verification and zero-trust cryptographic audit trails.`,
        problemBeingSolved: `${understanding.problemBeingSolved} Empirical benchmarks indicate 34% baseline waste observed across standard 12-month commercial operations.`,
        importantAssumptions: [
          ...understanding.importantAssumptions,
          'Direct API integrations reduce onboarding churn by at least 42% compared to manual file uploads',
        ],
        constraints: [
          ...understanding.constraints,
          'Target market demands SOC-2 Type II audit readiness from Day 1',
        ],
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F1EEE4] dark:bg-[#121212] text-[#1C1917] dark:text-[#F5F3EC] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-[#FAF8F3] dark:bg-[#161616] border-b border-[#E4DFD3] dark:border-[#2a2a2a] sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={step === 'idea-input' ? onBackToHome : () => setStep(step === 'understanding' ? 'questionnaire' : 'idea-input')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-[#252525] rounded-lg text-stone-600 dark:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#FF6124] rounded-md text-white font-black text-xs flex items-center justify-center">
              ST
            </span>
            <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">
              Stratum Onboarding Studio
            </span>
          </div>
        </div>

        {/* Journey Type Switcher & Controls */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#EAE5D9] dark:bg-[#222222] p-0.5 rounded-xl flex text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setProjectType('new_brand');
                if (step === 'questionnaire') {
                  setQuestions(generateQuestionsForBrief('new_brand', rawIdea));
                }
              }}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                projectType === 'new_brand'
                  ? 'bg-white dark:bg-[#2d2d2d] text-[#1C1917] dark:text-[#F5F3EC] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
              }`}
            >
              New Brand
            </button>
            <button
              type="button"
              onClick={() => {
                setProjectType('rebrand');
                if (step === 'questionnaire') {
                  setQuestions(generateQuestionsForBrief('rebrand', rawIdea));
                }
              }}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                projectType === 'rebrand'
                  ? 'bg-white dark:bg-[#2d2d2d] text-[#1C1917] dark:text-[#F5F3EC] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
              }`}
            >
              Rebranding
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#57534E] dark:text-[#A8A29E] font-medium pl-1">
            <span className={`px-2 py-0.5 rounded ${step === 'idea-input' ? 'bg-[#FF6124] text-white font-bold' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
              1. Brief
            </span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded ${step === 'questionnaire' ? 'bg-[#FF6124] text-white font-bold' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
              2. Custom Questions
            </span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded ${step === 'understanding' ? 'bg-[#FF6124] text-white font-bold' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
              3. Synthesis
            </span>
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors cursor-pointer shadow-2xs ml-1"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* ========================================================
            STEP 1: ROUGH IDEA / BRAND BRIEF INPUT
        ======================================================== */}
        {step === 'idea-input' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] text-xs font-bold text-[#FF6124]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {projectType === 'new_brand' ? 'Step 1: Define Your New Venture' : 'Step 1: Existing Business Rebrand Brief'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
                {projectType === 'new_brand'
                  ? 'Submit your rough startup or brand idea.'
                  : 'Tell us about your current business and rebrand goals.'}
              </h1>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
                {projectType === 'new_brand'
                  ? 'Do not worry about perfect phrasing. Stratum will generate a customized, tailored questionnaire with free-text fields to extract your true core value.'
                  : 'Provide your existing business identity, what works, and the desired new direction you wish to explore.'}
              </p>
            </div>

            {/* Input Card */}
            <div className="p-6 sm:p-8 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-3xl shadow-sm space-y-6">
              {projectType === 'rebrand' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                    Current Business or Brand Name
                  </label>
                  <input
                    type="text"
                    value={currentBrandName}
                    onChange={(e) => setCurrentBrandName(e.target.value)}
                    placeholder="e.g. Apex Industrial Systems / Heritage Roasting Co."
                    className="w-full px-4 py-3 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-sm text-[#1C1917] dark:text-[#F5F3EC] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124]"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    {projectType === 'new_brand'
                      ? 'Rough Concept or Product Brief'
                      : 'Describe What You Do & What Needs to Change'}
                  </label>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">Free-form text</span>
                </div>
                <textarea
                  rows={5}
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  placeholder={
                    projectType === 'new_brand'
                      ? 'e.g. An autonomous microgrid dispatch platform for commercial real estate that balances rooftop solar, batteries, and dynamic grid pricing to eliminate peak demand penalties...'
                      : 'e.g. We have been a commercial precision cold brew manufacturer for 8 years, but our brand feels like traditional food service. We want to pivot toward high-tech automated campus kiosks, premium subscription contracts, and an architectural editorial design aesthetic...'
                  }
                  className="w-full p-4 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-2xl text-sm text-[#1C1917] dark:text-[#F5F3EC] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124] leading-relaxed resize-y"
                />
              </div>

              {/* Instant Preset Accelerators */}
              <div>
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5">
                  Or load an illustrative founder brief:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESET_IDEAS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="p-3 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-stone-100 dark:hover:bg-[#2a2a2a] border border-[#E4DFD3] dark:border-[#2e2e2e] hover:border-[#FF6124]/40 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] group-hover:text-[#FF6124] line-clamp-1">
                        {preset.title.split('(')[0]}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {preset.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToQuestionnaire}
                  disabled={!rawIdea.trim() || isGeneratingQuestions}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Generating Custom Questions...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Custom Questionnaire</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: COMPLETELY CUSTOMIZABLE QUESTIONNAIRE
        ======================================================== */}
        {step === 'questionnaire' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF6124] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Free-Text Questionnaire</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF]">
                  {projectType === 'new_brand'
                    ? 'Explore your venture parameters in your own words'
                    : 'Analyze your rebranding goals and legacy equity'}
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                  Type freely in the boxes below. You can customize, rename, add, or delete any question.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddCustomQuestion}
                  className="py-2 px-3 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-stone-100 dark:hover:bg-[#2b2b2b] border border-[#E4DFD3] dark:border-[#2e2e2e] text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>Add Custom Question</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestions(generateQuestionsForBrief(projectType, rawIdea))}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-[#2b2b2b] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  title="Regenerate Default Questions"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Questions List with Free-Text Inputs & Full Customization */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-xs space-y-4 relative transition-all hover:border-[#FF6124]/30"
                >
                  {/* Question Title & Actions */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-md bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] font-mono text-[11px] font-bold flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        {editingQuestionId === q.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="px-2.5 py-1 text-sm font-bold bg-[#FAF8F3] dark:bg-[#222222] border border-[#FF6124] rounded-lg text-[#1C1917] dark:text-[#F5F3EC] w-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditQuestion(q.id)}
                              className="p-1 bg-[#FF6124] text-white rounded-md text-xs font-bold cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC] flex items-center gap-2">
                            {q.title}
                          </h3>
                        )}
                      </div>
                      {q.description && (
                        <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed pl-7">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Question Customization Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditQuestion(q)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-[#FAF8F3] dark:hover:bg-[#242424] cursor-pointer"
                        title="Edit Question Title"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Free-Text Input Field */}
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={freeTextAnswers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder={q.placeholder || 'Type your detailed perspective or strategic notes in free-text...'}
                      className="w-full p-3.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F3EC] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FF6124]/30 focus:border-[#FF6124] leading-relaxed"
                    />

                    {/* AI Magic Assist Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">
                        {freeTextAnswers[q.id]?.length || 0} characters entered
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAiDraftAnswer(q)}
                        disabled={aiDraftingQuestionId === q.id}
                        className="py-1 px-2.5 text-[11px] font-bold text-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 hover:bg-[#FF6124]/15 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 className="w-3 h-3 text-[#FF6124]" />
                        <span>
                          {aiDraftingQuestionId === q.id
                            ? 'Drafting with AI...'
                            : 'Draft Sample Answer with AI'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep('idea-input')}
                className="py-2.5 px-4 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                ← Back to Brief
              </button>

              <button
                type="button"
                onClick={handleQuestionnaireSubmit}
                disabled={isSynthesizing}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing Understanding...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Understanding of Idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: EDITABLE AI-GENERATED UNDERSTANDING OF IDEA
        ======================================================== */}
        {step === 'understanding' && understanding && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF6124] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesized Strategic Understanding</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF]">
                  Review & Refine Before Launching Research
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                  Stratum has analyzed your questionnaire inputs. Every parameter below is fully editable.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingUnderstanding(!isEditingUnderstanding)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isEditingUnderstanding
                      ? 'bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917]'
                      : 'bg-[#FAF8F3] dark:bg-[#222222] hover:bg-stone-100 dark:hover:bg-[#2b2b2b] border border-[#E4DFD3] dark:border-[#2e2e2e] text-[#1C1917] dark:text-[#F5F3EC]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>{isEditingUnderstanding ? 'Done Editing' : 'Edit Parameters'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClarifyDeepen}
                  disabled={isSynthesizing}
                  className="py-2 px-3.5 bg-[#FF6124]/10 dark:bg-[#FF6124]/20 hover:bg-[#FF6124]/15 border border-[#FF6124]/20 rounded-xl text-xs font-bold text-[#FF6124] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>Clarify & Deepen</span>
                </button>
              </div>
            </div>

            {/* Synthesized Understanding Cards */}
            <div className="space-y-4">
              {/* Working Name & Tagline */}
              <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Project Working Name & Category
                  </span>
                  <span className="text-[10px] font-bold text-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 px-2 py-0.5 rounded">
                    {projectType === 'new_brand' ? 'New Brand Creation' : 'Brand Rebranding'}
                  </span>
                </div>
                {isEditingUnderstanding ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={understanding.projectName || ''}
                      onChange={(e) => setUnderstanding({ ...understanding, projectName: e.target.value })}
                      placeholder="Project Name"
                      className="p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                    <input
                      type="text"
                      value={understanding.businessCategory || ''}
                      onChange={(e) => setUnderstanding({ ...understanding, businessCategory: e.target.value })}
                      placeholder="Category"
                      className="p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-sm text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF]">
                      {understanding.projectName}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">{understanding.businessCategory}</p>
                  </div>
                )}
              </div>

              {/* Core Value & Problem Solved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6124]">
                    Core Value Anchor
                  </span>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.coreValue}
                      onChange={(e) => setUnderstanding({ ...understanding, coreValue: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#1C1917] dark:text-[#F5F3EC] font-medium leading-relaxed">
                      {understanding.coreValue}
                    </p>
                  )}
                </div>

                <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Primary Problem / Structural Friction
                  </span>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.problemBeingSolved}
                      onChange={(e) => setUnderstanding({ ...understanding, problemBeingSolved: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {understanding.problemBeingSolved}
                    </p>
                  )}
                </div>
              </div>

              {/* Target Customer & Differentiation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Target Customer Profile
                  </span>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.potentialCustomers}
                      onChange={(e) => setUnderstanding({ ...understanding, potentialCustomers: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {understanding.potentialCustomers}
                    </p>
                  )}
                </div>

                <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Unfair Advantage & Moat
                  </span>
                  {isEditingUnderstanding ? (
                    <textarea
                      rows={3}
                      value={understanding.differentiation}
                      onChange={(e) => setUnderstanding({ ...understanding, differentiation: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs text-[#1C1917] dark:text-[#F5F3EC]"
                    />
                  ) : (
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {understanding.differentiation}
                    </p>
                  )}
                </div>
              </div>

              {/* Critical Assumptions to Test in Research */}
              <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Critical Hypotheses to Validate in Research & Discovery</span>
                </span>
                <div className="space-y-2">
                  {understanding.importantAssumptions.map((assump, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC] bg-[#FAF8F3] dark:bg-[#222222] p-3 rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e]"
                    >
                      <span className="text-[#FF6124] font-bold font-mono">0{i + 1}.</span>
                      <span className="leading-relaxed">{assump}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rebrand specific parameters */}
              {projectType === 'rebrand' && understanding.rebrandDetails && (
                <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF6124]" />
                    <span>Rebranding Governance: Preserved Legacy Equity</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#FAF8F3] dark:bg-[#222222] rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e]">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block mb-1">Elements to Preserve</span>
                      <p className="text-stone-600 dark:text-stone-300">{understanding.rebrandDetails.elementsToPreserve}</p>
                    </div>
                    <div className="p-3 bg-[#FAF8F3] dark:bg-[#222222] rounded-xl border border-[#E4DFD3] dark:border-[#2e2e2e]">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block mb-1">Target Transformation</span>
                      <p className="text-stone-600 dark:text-stone-300">{understanding.rebrandDetails.desiredChanges}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation & Launch Action Bar */}
            <div className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep('questionnaire')}
                className="py-2.5 px-4 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                ← Back to Questionnaire
              </button>

              <button
                type="button"
                onClick={handleConfirmUnderstanding}
                className="w-full sm:w-auto px-9 py-4 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Confirm & Launch Research & Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
