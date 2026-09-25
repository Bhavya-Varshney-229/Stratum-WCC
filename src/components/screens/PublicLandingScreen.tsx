import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Target,
  Palette,
  Rocket,
  FileCheck,
  CheckCircle2,
  Users,
  TrendingUp,
  Cpu,
  Crosshair,
  AlertTriangle,
  Calendar,
  Layers,
  Sliders,
  Network,
  RotateCcw,
  ShieldCheck,
  Check,
  HelpCircle,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  Settings,
  X,
  ExternalLink,
  Sun,
  Moon,
  Search,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProjectType, VentureProject } from '../../types/venture';

interface PublicLandingScreenProps {
  onStartJourney: (type: ProjectType) => void;
  onGoToDashboard: () => void;
  onGoToWorkspace?: () => void;
  activeProject?: VentureProject | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

interface FAQItem {
  id: string;
  category: 'platform' | 'methodology' | 'rebrand' | 'antidrift' | 'exports' | 'ip';
  categoryLabel: string;
  question: string;
  answer: string;
}

export const PublicLandingScreen: React.FC<PublicLandingScreenProps> = ({
  onStartJourney,
  onGoToDashboard,
  onGoToWorkspace,
  activeProject,
  theme = 'light',
  onToggleTheme,
}) => {
  const { user, isAuthenticated, openAuthModal, openAccountSettings, signOut, showToast } = useAuth();
  const [activeStageTab, setActiveStageTab] = useState<number>(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'categories' | 'tools'>('categories');
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqFeedback, setFaqFeedback] = useState<Record<string, 'yes' | 'no'>>({});

  const stages = [
    {
      num: '01',
      title: 'Research & Discovery',
      icon: Compass,
      tagline: 'Empirical Foundation & Market Grounding',
      description:
        'Ground your brand in real customer demographics, market sizing, technical feasibility, and competitive realities. Six dedicated analytical cards synthesize complex inputs with transparent source labels.',
      highlights: ['Customer Segments & Persona Cards', 'TAM / SAM / SOM Market Sizing', 'Competitive Feature & Moat Matrices', 'Interactive Risk Heatmap'],
      previewTag: '6 Analytical Cards + 4 Research Tools',
    },
    {
      num: '02',
      title: 'Brand Strategy',
      icon: Target,
      tagline: 'Audience Adaptation & Value Preservation',
      description:
        'Formulate defensible positioning without diluting your core truth. Compare audience-specific messaging, model unit economics across marketing channels, and audit brand drift in real time.',
      highlights: ['Multi-Audience Messaging Switcher', 'CAC / LTV Channel Economics Matrix', 'Pricing Tier Optimization', 'Real-Time Anti-Drift Guardrails'],
      previewTag: 'Strategic Positioning & Consistency',
    },
    {
      num: '03',
      title: 'Design Studio',
      icon: Palette,
      tagline: 'Multi-Directional Identity Exploration',
      description:
        'Explore at least three distinct visual directions simultaneously. Evaluate geometric logo concepts, curated color palettes with contrast ratings, typography pairings, moodboards, and digital UI mocks.',
      highlights: ['3 Distinct Brand Directions Side-by-Side', 'Interactive Palette & Hex Inspector', 'Editorial & Tech Typography Pairings', 'Social & Web Hero Application Mockups'],
      previewTag: 'Visual Identity & Moodboard Space',
    },
    {
      num: '04',
      title: 'Market & Launch',
      icon: Rocket,
      tagline: 'Actionable Go-To-Market Execution',
      description:
        'Translate brand decisions into a phased 20-week launch timeline with milestone dependencies, campaign budgets, channel distribution, and an institutional Launch Readiness Checker.',
      highlights: ['20-Week Visual Milestone Timeline', 'Budget Allocation by Channel', 'Campaign Briefs with Target CACs', 'Launch Readiness Item Verification'],
      previewTag: 'Phased Timeline & Readiness Checker',
    },
    {
      num: '05',
      title: 'Complete Brand Kit',
      icon: FileCheck,
      tagline: 'Institutional Dossier & Export Engine',
      description:
        'Synthesize all approved research, positioning decisions, visual tokens, and launch plans into a unified, investor-ready report with customized section toggles and one-click exports.',
      highlights: ['Customizable Section Inclusion Toggles', 'Executive Summary Dossier', 'Export to Formatted Markdown or JSON', 'Complete Brand Book Preservation'],
      previewTag: 'Unified Exportable Master Brand Book',
    },
  ];

  const researchCategories = [
    {
      title: 'Target Audience',
      icon: Users,
      desc: 'Customer segments, persona cards, pain point rankings, and willingness-to-pay benchmarks.',
    },
    {
      title: 'Market Opportunity',
      icon: TrendingUp,
      desc: 'TAM/SAM/SOM market sizing, industry growth vectors, entry barriers, and regulatory outlook.',
    },
    {
      title: 'Product Feasibility',
      icon: Cpu,
      desc: 'Technical complexity audits, unit-cost assumptions, implementation roadmaps, and claim testing.',
    },
    {
      title: 'Competitive Analysis',
      icon: Crosshair,
      desc: 'Direct and indirect competitor profiles, positioning quadrant maps, and moat vulnerability audits.',
    },
    {
      title: 'Risks & Drawbacks',
      icon: AlertTriangle,
      desc: 'Interactive 5x5 severity matrix, empirical evidence logs, and verified mitigation action plans.',
    },
    {
      title: 'Development Roadmap',
      icon: Calendar,
      desc: 'Phase gates, technical milestones, deliverable dependencies, and operational critical paths.',
    },
  ];

  const integratedTools = [
    {
      title: 'AI Brainstorming Canvas',
      icon: Network,
      desc: 'Infinite node graph for mapping strategic ideas, customer insights, and brand hypotheses with live connection lines.',
    },
    {
      title: 'What-if Simulator',
      icon: Sliders,
      desc: 'Interactive sliders for CAC, churn, ARPU, and burn with real-time financial trajectory calculations.',
    },
    {
      title: 'Competitor Intelligence Tracker',
      icon: Crosshair,
      desc: 'Directory of direct, indirect, and legacy players with saved pricing models and vulnerability notes.',
    },
    {
      title: 'Customer Validation Studio',
      icon: Users,
      desc: 'Survey instrument designer with CSV data importer and qualitative sentiment analysis.',
    },
    {
      title: 'Brand Direction Comparison',
      icon: Palette,
      desc: 'Compare three divergent brand expressions with swatches, typographic pairings, and moodboards.',
    },
    {
      title: 'Decision History & Drift Tracking',
      icon: RotateCcw,
      desc: 'Immutable audit log of all project decisions that automatically flags downstream affected workspaces.',
    },
    {
      title: 'Launch Readiness Checker',
      icon: Rocket,
      desc: 'Comprehensive gatekeeper ensuring persona approval, risk mitigation, and budget locking prior to public launch.',
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'platform',
      categoryLabel: 'Platform & Architecture',
      question: 'How is Stratum fundamentally different from generic AI prompt wrappers or ChatGPT?',
      answer:
        'Standard LLM chat wrappers output isolated, ungrounded paragraphs that quickly contradict each other across strategy, design, and marketing. Stratum is built on a synchronized five-workspace architecture. When you lock your Core Value in Research & Discovery, that exact value proposition anchors Brand Strategy, Design Studio, and Market Launch. If any upstream assumption shifts, Stratum’s Downstream Dependency engine alerts you to audit affected deliverables rather than silently hallucinating changes.',
    },
    {
      id: 'faq-2',
      category: 'platform',
      categoryLabel: 'Platform & Architecture',
      question: 'What are the five synchronized workspaces and how do they pass context?',
      answer:
        'Stratum unites the end-to-end venture lifecycle into five connected modules: 01. Research & Discovery (empirical market sizing, persona cards, feasibility benchmarks, risk matrices), 02. Brand Strategy (core value anchor, multi-audience messaging adaptations, anti-drift audits), 03. Design Studio (3 divergent visual directions, typography hierarchies, token palettes, mix-and-match moodboards), 04. Market & Launch (20-week timeline, channel campaigns, launch readiness gatekeeper), and 05. Complete Brand Kit (unified export dossier, style guides, JSON design tokens, Markdown summaries). State flows continuously downstream, ensuring full fidelity.',
    },
    {
      id: 'faq-3',
      category: 'platform',
      categoryLabel: 'Platform & Architecture',
      question: 'What happens if I adjust customer research after building brand strategy?',
      answer:
        'Stratum’s Decision History & Downstream Dependency engine tracks dependencies across all workspaces. If you accept a research refinement—such as adjusting your primary demographic or discovering a technical constraint—downstream workspaces (Brand Strategy, Design Studio, Market Launch) are automatically flagged with a "Review Needed" badge. You can inspect what changed, compare before-and-after versions, and selectively re-analyze without losing approved design work.',
    },
    {
      id: 'faq-4',
      category: 'platform',
      categoryLabel: 'Platform & Architecture',
      question: 'Can agencies, incubators, and venture studios manage multiple client brands simultaneously?',
      answer:
        'Yes. Stratum includes a multi-project dashboard where you can create, rename, duplicate, archive, and switch between separate venture workspaces. Each project maintains its own isolated research databases, decision history logs, custom combinations, and export states with zero cross-contamination. You can also export standalone project JSON backups for client handoffs.',
    },
    {
      id: 'faq-5',
      category: 'rebrand',
      categoryLabel: 'Rebranding Pathway',
      question: 'How does Stratum handle existing businesses undergoing a brand refresh or repositioning?',
      answer:
        'Stratum features a dedicated Rebranding Pathway designed specifically for operating businesses. It begins with an audit of your legacy brand equity, existing customer goodwill, and current market friction points. The platform allows you to compare before-and-after positioning side by side, establish customer migration timelines, and ensure you do not alienate your loyal customer base while expanding into new, higher-value market segments.',
    },
    {
      id: 'faq-6',
      category: 'rebrand',
      categoryLabel: 'Rebranding Pathway',
      question: 'How do we protect and preserve our legacy brand equity while modernizing our market identity?',
      answer:
        'During the initial Rebranding Brief and throughout Brand Strategy, Stratum establishes an immutable "Elements to Preserve" registry (e.g. established uptime reputation, trusted customer relationships, specific heritage brand marks). The Anti-Drift engine continuously checks new modern adaptations against these legacy equity anchors to prevent unintended brand alienation.',
    },
    {
      id: 'faq-7',
      category: 'rebrand',
      categoryLabel: 'Rebranding Pathway',
      question: 'Can we import our legacy customer surveys, interview transcripts, and historical assets?',
      answer:
        'Yes. In Research & Discovery, the Customer Validation Studio includes direct CSV data importers for survey instruments and customer interview notes. Stratum’s intelligence models ingest qualitative feedback, calculate sentiment distributions, and automatically categorize findings into validated pain points versus unproven assumptions.',
    },
    {
      id: 'faq-8',
      category: 'methodology',
      categoryLabel: 'Data Rigor & Citations',
      question: 'Where does the quantitative research and competitive data come from?',
      answer:
        'Stratum strictly demarcates data provenance using our Four-Label Transparency Standard: Verified Source (official databases, SEC filings, regulatory registries), User Provided (your first-party telemetry and customer metrics), AI Hypothesis (heuristic projections requiring validation), and Needs Testing (empirical assumptions with high sensitivity). We never fabricate market shares, fake competitor pricing, or assign unsupported success probabilities.',
    },
    {
      id: 'faq-9',
      category: 'methodology',
      categoryLabel: 'Data Rigor & Citations',
      question: 'What is Stratum’s Four-Label Transparency Standard for data citations?',
      answer:
        'To eliminate AI hallucinations in board-level deliverables, every data claim, competitor metric, and TAM sizing card displays an explicit color-coded source badge. Hovering or clicking the badge reveals exact data origin, sample confidence interval, and validation status, giving founders total confidence during investor diligence and pitch meetings.',
    },
    {
      id: 'faq-10',
      category: 'methodology',
      categoryLabel: 'Data Rigor & Citations',
      question: 'How are TAM, SAM, and SOM computed and verified for investor due diligence?',
      answer:
        'In Card 02 (Market Opportunity), TAM, SAM, and SOM are structured using both top-down industry sizing and bottom-up contract pricing models (Average Contract Value × Total Addressable Units). The interactive What-If Simulator lets founders stress-test conversion rates, price sensitivity, and adoption velocity across optimistic, baseline, and conservative scenarios.',
    },
    {
      id: 'faq-11',
      category: 'antidrift',
      categoryLabel: 'Anti-Drift Guardrails',
      question: 'How does the Anti-Drift Brand Consistency Checker work in real-time?',
      answer:
        'In Workspace 02 (Brand Strategy), our continuous audit engine evaluates every audience-specific adaptation, campaign brief, and ad hook against your non-negotiable Core Value Anchor. It computes an overall Alignment Score (0–100%) and provides immediate diagnostic alerts with specific remediation steps if any marketing message risks diluting your core brand premise.',
    },
    {
      id: 'faq-12',
      category: 'antidrift',
      categoryLabel: 'Anti-Drift Guardrails',
      question: 'What is the Locked Core Value Anchor and why is it non-negotiable?',
      answer:
        'The Locked Core Value Anchor is the mathematical heartbeat of your venture—the singular promise that makes your company indispensable to buyers. While tone of voice, visual aesthetics, and value angles adapt to different buyer personas (e.g. enterprise CIO vs. front-line operator), the underlying product truth remains locked so the brand never becomes schizophrenic.',
    },
    {
      id: 'faq-13',
      category: 'exports',
      categoryLabel: 'Deliverables & Design Tokens',
      question: 'What exact assets and dossiers are generated in the Complete Brand Kit?',
      answer:
        'The Complete Brand Kit produces a unified brand governance manual including: Executive Summary Dossier, Research & Competitor Benchmark tables, Multi-Audience Messaging Frameworks, Color Swatches (hex, RGB, CMYK, contrast ratios), Typography Pairing Specimen sheets, Curated Moodboard Guidelines, 20-Week Go-To-Market Timeline, and Campaign Asset matrix.',
    },
    {
      id: 'faq-14',
      category: 'exports',
      categoryLabel: 'Deliverables & Design Tokens',
      question: 'Can I export design tokens directly to Tailwind CSS, Figma tokens, or structured JSON?',
      answer:
        'Yes. You can export directly to production-ready design tokens in JSON (compatible with Style Dictionary and Figma Tokens), Tailwind CSS color palette configurations, copy-pasteable Markdown reports, or print-ready executive summaries for cross-functional engineering and design handoffs.',
    },
    {
      id: 'faq-15',
      category: 'ip',
      categoryLabel: 'Security & IP Ownership',
      question: 'Who owns the intellectual property and strategic assets created in Stratum?',
      answer:
        'You retain 100% intellectual property ownership of your venture ideas, questionnaire answers, brand strategy frameworks, visual directions, custom color palettes, and launch schedules. Stratum does not claim any ownership over founder data or generated brand deliverables.',
    },
    {
      id: 'faq-16',
      category: 'ip',
      categoryLabel: 'Security & IP Ownership',
      question: 'Is my proprietary venture data used to train public AI models?',
      answer:
        'No. Stratum enforces enterprise-grade zero-retention data privacy standards. Your project briefs, proprietary customer metrics, competitive hypotheses, and decision logs are kept strictly isolated to your account and are never used to train public or commercial AI models.',
    },
  ];

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = faqCategory === 'all' || faq.category === faqCategory;
      const q = faqSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [faqCategory, faqSearchQuery]);

  const handleVoteFaq = (faqId: string, vote: 'yes' | 'no') => {
    setFaqFeedback((prev) => ({ ...prev, [faqId]: vote }));
    showToast(vote === 'yes' ? 'Thanks for the feedback!' : 'Feedback noted — we will clarify this answer', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F1EEE4] dark:bg-[#121212] text-[#1C1917] dark:text-[#F5F3EC] selection:bg-[#FF6124] selection:text-white flex flex-col font-sans transition-colors duration-200">
      {/* ========================================================
          A. NAVIGATION BAR
      ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 dark:bg-[#161616]/95 backdrop-blur-md border-b border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6124] flex items-center justify-center text-white font-black text-base shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1C1917] dark:text-[#F5F3EC] flex items-center gap-1.5 font-sans">
                STRATUM
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6124] bg-[#FF6124]/10 dark:bg-[#FF6124]/20 px-1.5 py-0.5 rounded">
                  Studio
                </span>
              </span>
              <p className="text-[10px] font-medium text-[#57534E] dark:text-[#A8A29E] -mt-0.5">
                Brand Intelligence Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
            <a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors">
              Features
            </a>
            <a href="#mission" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors">
              Our Mission
            </a>
            <a href="#journeys" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors">
              Solutions
            </a>
            <a href="#faqs" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors flex items-center gap-1">
              <span>FAQs</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] rounded-full font-bold">
                16
              </span>
            </a>
          </nav>

          {/* User Auth / Quick Controls */}
          <div className="flex items-center gap-2.5">
            {onGoToWorkspace && (
              <button
                type="button"
                onClick={onGoToWorkspace}
                className="py-2 px-3 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#FF6124] dark:hover:text-[#FF6124] transition-colors cursor-pointer hidden md:flex items-center gap-1.5"
                title="Open Active Workspace"
              >
                <Compass className="w-3.5 h-3.5 text-[#FF6124]" />
                <span>Active Studio</span>
              </button>
            )}

            {/* Dark/Light Theme Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors cursor-pointer shadow-2xs"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle color theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="py-2 px-3.5 bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-stone-400 text-[#1C1917] dark:text-[#F5F3EC] text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>Projects</span>
                </button>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={openAccountSettings}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-200/50 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                    title="Account Settings"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#E4DFD3] dark:border-[#2a2a2a]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#FF6124] text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="py-2 px-3 text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] hover:text-[#FF6124] dark:hover:text-[#FF6124] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="py-2 px-3.5 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          B. HERO SECTION
      ======================================================== */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#FF6124]/12 via-[#FF6124]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1c1c1c] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-xs text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EC] mb-6 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#FF6124] animate-pulse" />
            <span>Next-Generation Brand Development Studio</span>
            <span className="text-stone-300 dark:text-stone-600">|</span>
            <span className="text-[#57534E] dark:text-[#A8A29E]">Built for Founders & Strategic Operators</span>
          </div>

          {/* Exact Required Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight leading-[1.12] mb-6">
            From your first idea <br className="hidden sm:inline" />
            to a <span className="text-[#FF6124] underline decoration-[#FF6124]/30 underline-offset-8">complete brand.</span>
          </h1>

          {/* Exact Required Supporting Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-10 font-normal">
            Discover your market, understand your customers, build your identity and plan your launch with an intelligent AI-powered brand development studio.
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              type="button"
              onClick={() => onStartJourney('new_brand')}
              className="w-full sm:w-auto px-7 py-4 bg-[#FF6124] hover:bg-[#E5531B] text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>CREATE A NEW BRAND</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => onStartJourney('rebrand')}
              className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-[#1e1e1e] hover:bg-stone-50 dark:hover:bg-[#252525] text-[#1C1917] dark:text-[#F5F3EC] border-2 border-[#E4DFD3] dark:border-[#2d2d2d] hover:border-stone-400 dark:hover:border-stone-500 text-sm font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#FF6124]" />
              <span>REBRAND MY EXISTING BUSINESS</span>
            </button>
          </div>

          {/* Polished Visual Preview of the actual application */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border-2 border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#181818] shadow-2xl overflow-hidden p-2 sm:p-3 text-left">
            <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] overflow-hidden shadow-xs">
              {/* Fake top bar */}
              <div className="h-10 bg-[#FAF8F3] dark:bg-[#161616] border-b border-[#E4DFD3] dark:border-[#2a2a2a] px-4 flex items-center justify-between text-xs text-[#57534E] dark:text-[#A8A29E]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">|</span>
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] flex items-center gap-1.5">
                    Aura Grid
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] rounded font-semibold">
                      New Brand
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Autosaved
                  </span>
                  <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] text-[11px]">84% Complete</span>
                </div>
              </div>

              {/* Fake Workspace Split */}
              <div className="grid grid-cols-12 min-h-[340px]">
                {/* 5 Workspace Sidebar preview */}
                <div className="col-span-3 bg-[#FAF8F3] dark:bg-[#161616] border-r border-[#E4DFD3] dark:border-[#2a2a2a] p-3 hidden sm:block space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-2">
                    5 Workspaces
                  </p>
                  <div className="p-2 rounded-lg bg-[#FF6124] text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Research & Discovery</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202020] text-[#57534E] dark:text-[#A8A29E] text-xs font-medium flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    <span>Brand Strategy</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202020] text-[#57534E] dark:text-[#A8A29E] text-xs font-medium flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Design Studio</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202020] text-[#57534E] dark:text-[#A8A29E] text-xs font-medium flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Market & Launch</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202020] text-[#57534E] dark:text-[#A8A29E] text-xs font-medium flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Complete Brand Kit</span>
                  </div>
                </div>

                {/* Main Workspace Preview */}
                <div className="col-span-12 sm:col-span-9 p-4 sm:p-5 bg-white dark:bg-[#1a1a1a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E4DFD3] dark:border-[#2a2a2a] pb-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                        Research & Discovery Dashboard
                      </h4>
                      <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                        6 comprehensive research modules with empirical source tracking
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333333] text-[#57534E] dark:text-[#A8A29E] rounded-md font-semibold">
                      Live Studio View
                    </span>
                  </div>

                  {/* 6 mini cards preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Target Audience</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        Mid-market commercial real estate operators & industrial park microgrids.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                        Approved
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Market Opportunity</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        $14.2B Global TAM with 28.4% projected CAGR across decentralized power.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800/60">
                        Verified Source
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Product Feasibility</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        Sub-second tariff-dispatch algorithm verified on 4 pilot battery arrays.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800/60">
                        Testing Needed
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <Crosshair className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Competitive Analysis</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        3 direct legacy SCADA vendors evaluated with 2.4x latency deficit.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                        Approved
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Risks & Drawbacks</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        Utility interconnection timeline risk mitigated via pre-approved modules.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                        Approved
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] bg-[#FAF8F3] dark:bg-[#202020] hover:border-[#FF6124]/40 transition-colors">
                      <div className="flex items-center gap-1.5 text-[#FF6124] mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1C1917] dark:text-[#F5F3EC]">Roadmap</span>
                      </div>
                      <p className="text-[10px] text-[#57534E] dark:text-[#A8A29E] line-clamp-2">
                        18-month staged development with hardware pilot verification at M4.
                      </p>
                      <span className="mt-1.5 inline-block text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800/60">
                        In Progress
                      </span>
                    </div>
                  </div>

                  {/* Visual swatches bar */}
                  <div className="p-3 bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">Active Direction:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#1C1917] border border-stone-400 dark:border-stone-600" title="#1C1917" />
                        <span className="w-5 h-5 rounded-full bg-[#FF6124]" title="#FF6124" />
                        <span className="w-5 h-5 rounded-full bg-[#0E7490]" title="#0E7490" />
                        <span className="w-5 h-5 rounded-full bg-[#F1EEE4] border border-stone-400 dark:border-stone-600" title="#F1EEE4" />
                      </div>
                      <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                        “Editorial Architectural”
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#FF6124] hover:underline flex items-center gap-1">
                      Inspect In Studio <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          C. OUR MISSION
      ======================================================== */}
      <section id="mission" className="py-20 bg-white dark:bg-[#161616] border-y border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6124] mb-2 block">
              The Problem We Solve
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
              Eliminate the disconnect between strategy, design, and execution.
            </h2>
            <p className="mt-4 text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              Founders and existing businesses often struggle to connect customer research, market analysis, competitive positioning, visual identity and launch planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center justify-center font-black text-sm mb-4">
                  ✕
                </div>
                <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F3EC] mb-3">
                  The Fragmented Way
                </h3>
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6">
                  Research lives in isolated Google Docs, positioning in pitch decks, visual designs in Figma, and launch tasks across Asana or Notion.
                </p>
                <ul className="space-y-3 text-xs text-[#57534E] dark:text-[#A8A29E]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>Designers never read the customer discovery interview transcripts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>Copywriters alter messaging and inadvertently contradict the core value proposition.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>Launch campaigns target audiences that never validated the problem in discovery.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-xs font-semibold text-red-600 dark:text-red-400">
                Result: Strategy drift, wasted marketing budgets, and disjointed brand perception.
              </div>
            </div>

            {/* The Stratum Way */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#1e1e1e] border-2 border-[#FF6124] shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 bg-[#FF6124] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                The Stratum Method
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FF6124] text-white flex items-center justify-center font-black text-sm mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F3EC] mb-3">
                  One Unified Decision Engine
                </h3>
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6">
                  Stratum brings customer discovery, market analysis, visual identity, and go-to-market execution into one interactive workspace, preserving important decisions throughout the entire brand-building process.
                </p>
                <ul className="space-y-3 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Audience-Informed Design:</strong> Visual palettes and moodboards are generated directly from customer pain-point urgency.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Anti-Drift Guardrails:</strong> When you adjust an audience or value claim, downstream marketing assets are flagged for review.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Empirical Source Tracking:</strong> Every data point is tagged as Verified Source, User Provided, AI Hypothesis, or Needs Testing.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-xs font-bold text-[#FF6124] flex items-center gap-1.5">
                <span>Decisions in Research stay locked across Strategy, Design & Launch.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          D. HOW IT WORKS (THE FIVE STAGES)
      ======================================================== */}
      <section id="how-it-works" className="py-20 bg-[#FAF8F3] dark:bg-[#141414] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6124] mb-2 block">
              Architectural Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
              Five connected workspaces. Zero disconnected handoffs.
            </h2>
            <p className="mt-3 text-base text-[#57534E] dark:text-[#A8A29E]">
              Click through the five stages to see how Stratum turns rough thinking into a launch-ready brand.
            </p>
          </div>

          {/* Stages Tab Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8 bg-[#EAE5D9] dark:bg-[#202020] p-1.5 rounded-2xl">
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              const isActive = activeStageTab === idx;
              return (
                <button
                  key={stg.num}
                  type="button"
                  onClick={() => setActiveStageTab(idx)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col ${
                    isActive
                      ? 'bg-white dark:bg-[#2a2a2a] shadow-xs text-[#1C1917] dark:text-[#F5F3EC]'
                      : 'hover:bg-white/50 dark:hover:bg-[#252525] text-[#57534E] dark:text-[#A8A29E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-extrabold font-mono ${isActive ? 'text-[#FF6124]' : 'text-stone-400 dark:text-stone-500'}`}>
                      {stg.num}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF6124]' : 'text-stone-400 dark:text-stone-500'}`} />
                  </div>
                  <span className="text-xs font-bold leading-tight line-clamp-1">{stg.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          {(() => {
            const active = stages[activeStageTab];
            const Icon = active.icon;
            return (
              <div className="p-8 sm:p-10 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold font-mono text-[#FF6124] uppercase">
                        Stage {active.num}
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
                        {active.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#FF6124]">
                    {active.tagline}
                  </p>

                  <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    {active.description}
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] dark:text-[#F5F3EC] mb-3">
                      Key Highlights & Artifacts:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {active.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                          <CheckCircle2 className="w-4 h-4 text-[#FF6124] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onStartJourney('new_brand')}
                      className="py-3 px-5 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore In Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
                      {active.previewTag}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E4DFD3] dark:border-[#2e2e2e] pb-3">
                    <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC]">Stage Output Specification</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                      Institutional
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-[#57534E] dark:text-[#A8A29E]">
                    <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block">Downstream Interlocking</span>
                      <p className="text-[11px]">
                        Every input generated in Stage {active.num} directly influences downstream messaging, color choices, and launch channel budgets.
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block">Audit & Decision History</span>
                      <p className="text-[11px]">
                        Actions in this workspace create immutable decision records with explicit rationale and flag triggers.
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E4DFD3] dark:border-[#2a2a2a] space-y-1">
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F3EC] block">Human Review Authority</span>
                      <p className="text-[11px]">
                        AI proposes options; founders maintain final approval authority before any token is committed to the Brand Kit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================
          E. DETAILED FEATURES & TOOLS
      ======================================================== */}
      <section id="features" className="py-20 bg-white dark:bg-[#161616] border-y border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6124] mb-2 block">
              Comprehensive Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
              Built for deep strategic rigor.
            </h2>
            <p className="mt-3 text-base text-[#57534E] dark:text-[#A8A29E]">
              Switch between the six research domains and seven integrated interactive tools.
            </p>
          </div>

          {/* Toggle Feature View */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveFeatureTab('categories')}
                className={`py-2 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFeatureTab === 'categories'
                    ? 'bg-white dark:bg-[#2c2c2c] text-[#1C1917] dark:text-[#F5F3EC] shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
                }`}
              >
                6 Research Domains
              </button>
              <button
                type="button"
                onClick={() => setActiveFeatureTab('tools')}
                className={`py-2 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFeatureTab === 'tools'
                    ? 'bg-white dark:bg-[#2c2c2c] text-[#1C1917] dark:text-[#F5F3EC] shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
                }`}
              >
                7 Interactive Strategic Tools
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          {activeFeatureTab === 'categories' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center text-[#FF6124] mb-4 group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                      Module 0{i + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mt-0.5 mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integratedTools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] flex items-center justify-center text-[#FF6124] mb-4 group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                      Tool 0{i + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mt-0.5 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          F. TWO JOURNEYS (NEW BRAND VS REBRAND)
      ======================================================== */}
      <section id="journeys" className="py-20 bg-[#FAF8F3] dark:bg-[#141414] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6124] mb-2 block">
              Tailored Pathways
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
              Choose your strategic journey.
            </h2>
            <p className="mt-3 text-base text-[#57534E] dark:text-[#A8A29E]">
              Stratum configures its analytical models based on whether you are creating a greenfield startup or evolving an established business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Journey 1: New Brand */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-sm flex flex-col justify-between hover:border-[#FF6124]/50 transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] text-xs font-bold rounded-lg mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>JOURNEY 01</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mb-3">
                  Creating a New Brand
                </h3>
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6">
                  Transform a raw startup concept or unvalidated idea into a rigorously researched, beautifully designed, and launch-ready business.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Greenfield Discovery:</strong> Explore customer pain points from zero without legacy constraints.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Naming & Identity Genesis:</strong> Generate names, domain strategies, and visual concepts tailored to modern buyers.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Day-Zero Launch Roadmap:</strong> 20-week campaign playbooks with initial CAC/LTV benchmarks.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartJourney('new_brand')}
                className="w-full py-3.5 px-6 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch New Brand Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Journey 2: Rebranding */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-sm flex flex-col justify-between hover:border-[#FF6124]/50 transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-[#252525] text-[#1C1917] dark:text-[#F5F3EC] text-xs font-bold rounded-lg mb-5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF6124]" />
                  <span>JOURNEY 02</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F3EC] mb-3">
                  Rebranding an Existing Business
                </h3>
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6">
                  Audit your current brand equity, diagnose messaging fatigue, preserve legacy goodwill, and engineer a strategic repositioning plan.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Equity & Legacy Audit:</strong> Identify brand elements, customer trust, and assets that must be preserved.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Market Drift Correction:</strong> Reposition for new demographics, higher price points, or expanded verticals.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#1C1917] dark:text-[#F5F3EC]">
                    <Check className="w-4 h-4 text-[#FF6124] shrink-0 mt-0.5" />
                    <span><strong>Customer Migration Blueprint:</strong> Phased transition timeline to migrate existing loyalists without revenue dip.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartJourney('rebrand')}
                className="w-full py-3.5 px-6 bg-white dark:bg-[#1e1e1e] hover:bg-stone-50 dark:hover:bg-[#252525] text-[#1C1917] dark:text-[#F5F3EC] border-2 border-[#E4DFD3] dark:border-[#2d2d2d] hover:border-stone-400 dark:hover:border-stone-500 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#FF6124]" />
                <span>Begin Rebranding Audit</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          G. FREQUENTLY ASKED QUESTIONS (PROFESSIONAL FAQ ACCORDION)
      ======================================================== */}
      <section id="faqs" className="py-20 bg-white dark:bg-[#161616] border-y border-[#E4DFD3] dark:border-[#2a2a2a] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Direct Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-[#57534E] dark:text-[#A8A29E]">
              Everything you need to know about Stratum’s architecture, research methodology, data ownership, and brand deliverables.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., 'rebrand', 'citations', 'ChatGPT', 'IP ownership')..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F3] dark:bg-[#1f1f1f] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs font-medium text-[#1C1917] dark:text-[#F5F3EC] placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:border-[#FF6124] transition-colors"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Segmented Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FAF8F3] dark:bg-[#1f1f1f] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl">
              {[
                { id: 'all', label: 'All Questions', count: faqs.length },
                { id: 'platform', label: 'Architecture', count: faqs.filter((f) => f.category === 'platform').length },
                { id: 'rebrand', label: 'Rebranding', count: faqs.filter((f) => f.category === 'rebrand').length },
                { id: 'methodology', label: 'Data Rigor', count: faqs.filter((f) => f.category === 'methodology').length },
                { id: 'antidrift', label: 'Anti-Drift', count: faqs.filter((f) => f.category === 'antidrift').length },
                { id: 'exports', label: 'Deliverables & Tokens', count: faqs.filter((f) => f.category === 'exports').length },
                { id: 'ip', label: 'Security & IP', count: faqs.filter((f) => f.category === 'ip').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFaqCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    faqCategory === tab.id
                      ? 'bg-white dark:bg-[#2a2a2a] text-[#1C1917] dark:text-[#F5F3EC] shadow-xs'
                      : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      faqCategory === tab.id
                        ? 'bg-[#FF6124]/15 text-[#FF6124]'
                        : 'bg-stone-200/70 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Status Bar: Count + Toggle */}
            <div className="flex items-center justify-between text-xs text-[#57534E] dark:text-[#A8A29E] px-1">
              <span>Showing {filteredFaqs.length} of {faqs.length} verified answers</span>
              <button
                type="button"
                onClick={() => setOpenFaqId(openFaqId ? null : filteredFaqs[0]?.id || null)}
                className="text-[11px] font-bold text-[#FF6124] hover:underline cursor-pointer"
              >
                {openFaqId ? 'Collapse All' : 'Expand Top Question'}
              </button>
            </div>
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF8F3] dark:bg-[#1a1a1a] rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a]">
                <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F3EC]">No matching questions found.</p>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">Try a different search keyword or switch category filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqCategory('all');
                    setFaqSearchQuery('');
                  }}
                  className="mt-3 text-xs font-bold text-[#FF6124] hover:underline"
                >
                  Reset FAQ filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-[#FAF8F3] dark:bg-[#1c1c1c] border-[#FF6124]/40 shadow-xs'
                        : 'bg-white dark:bg-[#1a1a1a] border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6124]">
                          {faq.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F3EC] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-transform ${
                          isOpen
                            ? 'bg-[#FF6124] text-white border-[#FF6124] rotate-180'
                            : 'bg-white dark:bg-[#242424] border-[#E4DFD3] dark:border-[#333] text-[#57534E] dark:text-[#A8A29E]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed border-t border-[#E4DFD3]/60 dark:border-[#2a2a2a] mt-1 animate-in fade-in duration-150">
                        <p>{faq.answer}</p>

                        {/* Interactive Helpful Feedback */}
                        <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#E4DFD3]/40 dark:border-[#2a2a2a]/60 text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                          <span>Was this answer helpful?</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleVoteFaq(faq.id, 'yes')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                faqFeedback[faq.id] === 'yes'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                                  : 'hover:bg-stone-100 dark:hover:bg-[#252525] text-stone-600 dark:text-stone-400'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Yes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVoteFaq(faq.id, 'no')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                faqFeedback[faq.id] === 'no'
                                  ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold'
                                  : 'hover:bg-stone-100 dark:hover:bg-[#252525] text-stone-600 dark:text-stone-400'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Institutional Advisory Desk Card */}
          <div className="mt-10 p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF6124] text-white flex items-center justify-center shrink-0 font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                  Have a specific question about your venture or rebrand?
                </h4>
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                  Our strategic advisory desk responds with empirical guidance within 4 business hours.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('contact')}
              className="px-4 py-2.5 bg-white dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] text-[#1C1917] dark:text-[#F5F3EC] text-xs font-bold rounded-xl shadow-2xs transition-all whitespace-nowrap cursor-pointer"
            >
              Contact Advisory Desk
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          H. FINAL CALL TO ACTION
      ======================================================== */}
      <section className="py-20 bg-[#FAF8F3] dark:bg-[#141414] border-t border-[#E4DFD3] dark:border-[#2a2a2a] text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6124] text-white flex items-center justify-center font-black mx-auto mb-6 shadow-md">
            ST
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] dark:text-[#FFFFFF] tracking-tight mb-4">
            Ready to build a defensible, market-validated brand?
          </h2>
          <p className="text-base text-[#57534E] dark:text-[#A8A29E] max-w-xl mx-auto mb-8">
            Experience the complete five-stage brand intelligence studio with customizable questionnaires, empirical research cards, and real-time anti-drift guardrails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onStartJourney('new_brand')}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold tracking-wide uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>CREATE A NEW BRAND</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onStartJourney('rebrand')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#1e1e1e] hover:bg-stone-50 dark:hover:bg-[#252525] text-[#1C1917] dark:text-[#F5F3EC] border border-[#E4DFD3] dark:border-[#2d2d2d] text-xs font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#FF6124]" />
              <span>REBRAND MY EXISTING BUSINESS</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          I. FOOTER
      ======================================================== */}
      <footer className="bg-[#FAF8F3] dark:bg-[#121212] border-t border-[#E4DFD3] dark:border-[#222222] py-12 text-[#57534E] dark:text-[#A8A29E] text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 bg-[#FF6124] rounded-lg flex items-center justify-center text-white font-black text-xs">
                  S
                </span>
                <span className="font-extrabold text-sm tracking-tight text-[#1C1917] dark:text-[#F5F3EC]">
                  STRATUM BRAND INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] max-w-sm leading-relaxed">
                The institutional studio connecting customer research, market analysis, visual identity, and go-to-market execution into one unified decision engine.
              </p>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                Designed exclusively with authentic editorial aesthetics and verifiable source frameworks.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wider mb-3">
                Platform Workspaces
              </p>
              <ul className="space-y-2 text-xs">
                <li><a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC]">01. Research & Discovery</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC]">02. Brand Strategy</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC]">03. Design Studio</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC]">04. Market & Launch</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC]">05. Complete Brand Kit</a></li>
                <li><a href="#faqs" className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] font-semibold text-[#FF6124]">Platform FAQs</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] uppercase tracking-wider mb-3">
                Legal & Governance
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] cursor-pointer"
                  >
                    Privacy Protocol
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-[#1C1917] dark:hover:text-[#F5F3EC] cursor-pointer"
                  >
                    Institutional Support
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E4DFD3] dark:border-[#222222] flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 gap-4">
            <p>© {new Date().getFullYear()} Stratum Brand Intelligence. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span>Editorial Typography: Plus Jakarta Sans</span>
              <span>•</span>
              <span>Theme: Warm Editorial & Dark Studio</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal for Privacy, Terms, Contact */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E4DFD3] dark:border-[#2e2e2e] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F3EC]">
                {activeModal === 'privacy' && 'Stratum Privacy & Data Protocol'}
                {activeModal === 'terms' && 'Stratum Terms of Service'}
                {activeModal === 'contact' && 'Contact & Institutional Support'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed space-y-3 max-h-80 overflow-y-auto pr-2">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    Stratum Brand Intelligence stores venture ideas, questionnaire answers, and visual assets locally within your browser session and authenticated account partition.
                  </p>
                  <p>
                    All research labels (Verified Source, User Provided, AI Hypothesis, Needs Testing) are maintained strictly to prevent unauthorized extrapolation or simulated data leakage.
                  </p>
                  <p>
                    Passwords are cryptographic SHA-256 salted hashes. We do not sell or monetize founder project briefs or competitive intelligence matrices.
                  </p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>
                    By using Stratum, you retain 100% intellectual property ownership of your venture ideas, brand strategy artifacts, generated palettes, and master brand kits.
                  </p>
                  <p>
                    Stratum is designed as an institutional co-pilot. Output research models, CAC estimates, and competitive analyses serve as rigorous strategic guidance and should be verified with live market tests.
                  </p>
                </>
              )}
              {activeModal === 'contact' && (
                <div className="space-y-3">
                  <p>
                    For institutional deployment, enterprise brand reviews, or technical support:
                  </p>
                  <div className="p-3 bg-white dark:bg-[#222222] rounded-xl border border-[#E4DFD3] dark:border-[#333] space-y-1">
                    <p className="font-bold text-[#1C1917] dark:text-[#F5F3EC]">Stratum Advisory Desk</p>
                    <p className="text-xs text-[#FF6124] font-mono">support@stratum.ai</p>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500">Response turnaround: within 4 business hours</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E4DFD3] dark:border-[#2e2e2e] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2 px-4 bg-[#FF6124] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
