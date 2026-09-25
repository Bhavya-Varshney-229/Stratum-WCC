import { DynamicQuestion, ProjectType, IdeaUnderstanding, RebrandDetails } from '../types/venture';

export interface AnalysisResult {
  businessCategory: string;
  productOrService: string;
  projectType: ProjectType;
  identifiedInformation: string[];
  criticalMissingInformation: string[];
  relevantCustomerConsiderations: string[];
  questions: DynamicQuestion[];
}

// Generates dynamic, business-specific questions using the user's actual free-text description
export async function analyzeAndGenerateQuestions(
  description: string,
  projectType: ProjectType
): Promise<AnalysisResult> {
  const lower = description.toLowerCase();

  // Determine category & nuance
  let category = 'Technology & Services';
  if (lower.includes('software') || lower.includes('app') || lower.includes('saas') || lower.includes('platform') || lower.includes('ai') || lower.includes('api')) {
    category = 'Software & Digital Platform';
  } else if (lower.includes('clothing') || lower.includes('apparel') || lower.includes('fashion') || lower.includes('wear') || lower.includes('textile') || lower.includes('jewelry')) {
    category = 'Fashion & Apparel';
  } else if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('food') || lower.includes('bakery') || lower.includes('dining')) {
    category = 'Food, Beverage & Hospitality';
  } else if (lower.includes('consult') || lower.includes('advisory') || lower.includes('agency') || lower.includes('coaching') || lower.includes('firm')) {
    category = 'Professional Services & Consulting';
  } else if (lower.includes('solar') || lower.includes('energy') || lower.includes('hardware') || lower.includes('clean') || lower.includes('industrial')) {
    category = 'CleanTech & Industrial Hardware';
  } else if (lower.includes('health') || lower.includes('wellness') || lower.includes('clinic') || lower.includes('fitness') || lower.includes('medical')) {
    category = 'Health, Wellness & BioTech';
  } else {
    category = 'Consumer & Enterprise Innovation';
  }

  // Generate customized questions based on Project Type and Domain
  let questions: DynamicQuestion[] = [];

  if (projectType === 'rebrand') {
    // Rebranding customized questions
    questions = [
      {
        id: 'q_current_identity',
        title: 'Current Brand Identity & Perception',
        description: 'What is your current name and reputation? How do existing customers perceive you today?',
        placeholder: 'e.g. We have operated for 8 years as a legacy IT support firm known for dependability, but perceived as outdated and reactive...',
        suggestions: [
          'Known for quality but perceived as legacy or slow',
          'Perceived as a budget alternative rather than a premium provider',
          'Name no longer reflects our expanded product capabilities',
          'Strong regional reputation seeking national expansion',
        ],
        category: 'Current Identity',
      },
      {
        id: 'q_rebrand_reasons',
        title: 'Catalyst & Reasons for Rebranding',
        description: 'What key business challenges or market shifts make this rebrand urgent now?',
        placeholder: 'e.g. Our customer base is aging, margins are compressing against low-cost entrants, and we recently built an autonomous platform...',
        suggestions: [
          'Targeting enterprise accounts with higher average contract value',
          'Expanding beyond local market into global cross-border clients',
          'Recent product breakthrough outgrew our original company name',
          'Differentiating away from commoditized low-margin rivals',
        ],
        category: 'Business Catalyst',
      },
      {
        id: 'q_desired_changes',
        title: 'Desired Positioning & Future Tone',
        description: 'When people encounter your new brand, what should they immediately think, feel, and say?',
        placeholder: 'e.g. We want to be seen as the decisive, forward-thinking authority in our space, inspiring absolute trust with modern aesthetics...',
        suggestions: [
          'High-authority, institutional, and enterprise-grade',
          'Approachable, human-centered, and transparent',
          'Futuristic, high-velocity, and category-defining',
          'Understated Scandinavian craftsmanship and quiet luxury',
        ],
        category: 'Desired Positioning',
      },
      {
        id: 'q_elements_to_preserve',
        title: 'Elements to Preserve & Protect',
        description: 'Which legacy attributes, values, or customer relationships must not be compromised during this transition?',
        placeholder: 'e.g. Our 99.9% uptime track record, white-glove customer support ethos, and core color accent must carry over...',
        suggestions: [
          'Existing trust with legacy corporate accounts',
          'Core founding principles and high-touch customer support',
          'Recognizable color mark or heritage logo emblem',
          'Transparent straightforward pricing policy',
        ],
        category: 'Brand Heritage',
      },
      {
        id: 'q_target_audience_shift',
        title: 'New Customer Audience & Buying Triggers',
        description: 'Who is the ideal customer you need to win over with this new brand that you currently struggle to reach?',
        placeholder: 'e.g. Heads of Procurement and VP of Engineering at Tier-1 tech scale-ups who currently dismiss us as a legacy vendor...',
        suggestions: [
          'Fortune 500 VP of Technology and Risk Executives',
          'Modern design-conscious millennial and Gen-Z buyers',
          'Mid-market business owners seeking turnkey automation',
          'High-net-worth professionals seeking bespoke consulting',
        ],
        category: 'Target Audience',
      },
      {
        id: 'q_commercial_goals',
        title: 'Commercial Payoff & Success Metric',
        description: 'How will you measure whether this rebrand was an overwhelming commercial success 12 months after launch?',
        placeholder: 'e.g. Closing 10 enterprise deals over $50k ACV, 30% reduction in sales cycle length, and zero legacy customer churn...',
        suggestions: [
          'Increase average contract value (ACV) by 40%',
          'Shorten sales negotiation cycles from 90 days to 30 days',
          'Win category leadership recognition in tier-1 publications',
          'Expand net revenue retention and attract top engineering talent',
        ],
        category: 'Commercial Goals',
      },
    ];
  } else {
    // New Brand customized questions according to domain
    if (category === 'Software & Digital Platform') {
      questions = [
        {
          id: 'q_core_problem',
          title: 'The Acute Customer Problem & Friction',
          description: 'What exact daily headache or financial friction does your software eliminate for your target user?',
          placeholder: 'e.g. Teams lose 12 hours a week manually consolidating fragmented data across spreadsheets and legacy tools...',
          suggestions: [
            'Manual spreadsheet data reconciliation taking 15+ hours weekly',
            'Fragmented visibility across disconnected cloud dashboards',
            'Excessive demand charge penalties and surprise operational outages',
            'Slow 6-month consulting onboarding cycles from incumbent tools',
          ],
        },
        {
          id: 'q_intended_users',
          title: 'Primary User & Economic Buyer',
          description: 'Who will log in every day, and whose budget/credit card pays for the software license?',
          placeholder: 'e.g. Everyday user: Systems Architect; Budget owner: VP of Operations ($50k annual discretionary limit)...',
          suggestions: [
            'Everyday user: Engineering leads; Budget signer: CTO / VP Infrastructure',
            'Everyday user: Financial analyst; Budget signer: CFO',
            'Everyday user: Solo founder/creator; Budget signer: Direct credit card',
            'Everyday user: Field operations manager; Budget signer: COO',
          ],
        },
        {
          id: 'q_unfair_advantage',
          title: 'Core Technology Moat & Unfair Advantage',
          description: 'Why can’t a well-funded competitor clone your product in 3 months? What is your proprietary wedge?',
          placeholder: 'e.g. Proprietary sub-second constraint optimization algorithm, air-gapped security certification, and zero hardware modification...',
          suggestions: [
            'Proprietary sub-second solver algorithm benchmarked 10x faster',
            'Pre-built bi-directional connectors into legacy SCADA and ERP databases',
            'Unique network effects where every new client sharpens model accuracy',
            'Air-gapped on-premise security with zero cloud telemetry exposure',
          ],
        },
        {
          id: 'q_business_model',
          title: 'Pricing & Monetization Structure',
          description: 'How do you plan to charge customers, and what is your target monthly or annual deal size?',
          placeholder: 'e.g. Tiered B2B SaaS starting at $1,450/month + performance share on verified operational savings...',
          suggestions: [
            'Tiered monthly subscription ($500 to $4,000/mo) based on volume',
            'Usage-based billing per 1,000 API requests with $1,000 monthly minimum',
            'Annual enterprise license ($30k - $120k ACV) with 3-year commitments',
            'Freemium self-serve with premium automated execution upgrade',
          ],
        },
        {
          id: 'q_differentiation',
          title: 'Differentiation Against Legacy Incumbents',
          description: 'What do legacy alternatives get wrong that your new brand will do right from day one?',
          placeholder: 'e.g. Incumbents require 6 months of professional services; we get customers live in under 48 hours with guaranteed ROI...',
          suggestions: [
            'Live in under 48 hours vs. 6-month consulting integration',
            'Transparent automated pricing vs. opaque high-pressure sales reps',
            'Modern intuitive UI vs. clunky 2000s desktop software',
            'Active autonomous execution vs. passive reporting dashboards',
          ],
        },
      ];
    } else if (category === 'Fashion & Apparel') {
      questions = [
        {
          id: 'q_collection_style',
          title: 'Collection Aesthetic & Silhouette',
          description: 'What is the signature design language, cut, and aesthetic vision of your collection?',
          placeholder: 'e.g. Architectural, minimalist tailoring with Japanese raw denim and unbleached organic cotton textures...',
          suggestions: [
            'Architectural minimalism with disciplined neutral palettes',
            'Elevated technical performance streetwear with modular pockets',
            'Timeless quiet luxury knitwear in natural undyed fibers',
            'Vibrant expressive avant-garde with bold silhouette experimentation',
          ],
        },
        {
          id: 'q_target_customers',
          title: 'Ideal Customer Persona & Lifestyle',
          description: 'Who wears your pieces, where do they spend their time, and what values guide their wardrobe choices?',
          placeholder: 'e.g. Urban creative directors, architects, and discerning tech founders aged 28–45 who value longevity over fast trends...',
          suggestions: [
            'Urban creative professionals and architects seeking effortless dignity',
            'Discerning travelers seeking wrinkle-free versatile luxury',
            'Sustainability-first consumers demanding traceable organic supply chains',
            'High-energy streetwear collectors who appreciate limited-edition drops',
          ],
        },
        {
          id: 'q_materials_craft',
          title: 'Materials, Provenance & Sourcing Ethos',
          description: 'What materials, mills, or manufacturing ethics distinguish your pieces from mass-market brands?',
          placeholder: 'e.g. Sourced from heritage mills in Okayama and Biella, certified circular organic, with deadstock lining...',
          suggestions: [
            'GOTS-certified organic heavy cotton and linen from heritage European mills',
            'Recycled circular performance textiles with waterless dye processing',
            'Artisanal small-batch handwoven fabrics with vegetable dye finishes',
            'Zero-waste digital 3D knitting technology eliminating cutting scrap',
          ],
        },
        {
          id: 'q_pricing_distribution',
          title: 'Pricing Tiers & Distribution Channels',
          description: 'Where will customers discover and purchase your pieces, and what is the target retail price range?',
          placeholder: 'e.g. Direct-to-consumer flagship online store ($180–$650) paired with selective wholesale in premier concept boutiques...',
          suggestions: [
            'Pure D2C via limited seasonal drop model ($150 - $450/piece)',
            'Hybrid D2C flagship website plus selective boutique stockists',
            'Made-to-order bespoke atelier model with 3-week fulfillment',
            'Curated department stores (Nordstrom, Selfridges) plus direct e-commerce',
          ],
        },
        {
          id: 'q_brand_world',
          title: 'Brand World & Cultural Narrative',
          description: 'What cultural movement, architectural philosophy, or mood surrounds the brand world?',
          placeholder: 'e.g. Warm brutalism, tactile unboxing rituals, and community salon dinners celebrating independent craft...',
          suggestions: [
            'Warm brutalist architectural lines and travertine studio photography',
            'High-velocity urban documentary film grain and night photography',
            'Quiet Scandinavian interiors, blonde oak, and natural window light',
            'Art-gallery inspired zine publications and limited physical invitations',
          ],
        },
      ];
    } else if (category === 'Food, Beverage & Hospitality') {
      questions = [
        {
          id: 'q_concept_menu',
          title: 'Dining or Beverage Concept & Menu Signature',
          description: 'What is the signature dish, beverage, or sensory experience that customers will obsess over and recommend?',
          placeholder: 'e.g. Ultra-compact precision cold-brew kiosk serving custom nitrogen-infused single-origin roasts calibrated to taste...',
          suggestions: [
            'Specialty cold-brew and single-origin pour-overs calibrated in sub-60 seconds',
            'Seasonal farm-to-table small plates with wild-fermented sourdough and wines',
            'Fast-casual wholesome bowls emphasizing regional nutrient-dense ingredients',
            'Elevated multi-course tasting counter blending heritage fermentation with modern pastry',
          ],
        },
        {
          id: 'q_guest_experience',
          title: 'Target Guest & Core Occasion',
          description: 'Who is walking through your door or ordering your product, and what emotional state or occasion brings them to you?',
          placeholder: 'e.g. Campus professionals seeking an elevated morning coffee ritual without enduring 15-minute queue delays...',
          suggestions: [
            'Time-strapped office workers needing artisanal coffee in under 90 seconds',
            'Neighborhood locals seeking a warm, third-place gathering venue',
            'Food enthusiasts and adventurous eaters seeking rare culinary pairings',
            'Wellness-focused patrons looking for clean functional fuel without refined sugars',
          ],
        },
        {
          id: 'q_location_footprint',
          title: 'Operating Footprint & Physical Presence',
          description: 'Where will this live physically? (Urban micro-kiosk, flagship dining room, cloud kitchen, or packaged grocery brand?)',
          placeholder: 'e.g. 50 sq ft modular automated kiosks in tech campus lobbies, hospital hubs, and international airport terminals...',
          suggestions: [
            'Modular micro-kiosks deployed in high-density office lobbies and transit hubs',
            'Intimate 35-seat neighborhood storefront with open kitchen counter',
            'Multi-unit fast-casual footprint in bustling downtown retail corridors',
            'Consumer packaged goods distributed through specialty grocery and direct subscription',
          ],
        },
        {
          id: 'q_unit_economics',
          title: 'Price Point & Gross Margin Profile',
          description: 'What is the average transaction size, and what is your unit contribution margin?',
          placeholder: 'e.g. $5.75 per cup with 78% gross margin contribution and low footprint footprint lease overhead...',
          suggestions: [
            '$5 to $7 per beverage with 75%+ contribution margin',
            '$25 to $45 average dinner ticket with 65% food & beverage margin',
            '$12 to $16 lunch bowl with high peak lunch-hour volume throughput',
            '$18 per 12oz bag subscription with recurring monthly renewal',
          ],
        },
        {
          id: 'q_hospitality_tone',
          title: 'Atmosphere & Sensory Design Language',
          description: 'Describe the sound, lighting, tactile materials, and service energy of the experience.',
          placeholder: 'e.g. Terrazzo surfaces, natural ash wood, ambient vinyl acoustics, and warm hospitality that remembers regular guests...',
          suggestions: [
            'Warm terrazzo counters, raw travertine stone, and ambient lo-fi vinyl audio',
            'Sleek matte black metallic finishes, brushed aluminum, and high-velocity digital ordering',
            'Earthy terracotta tiles, linen napkins, and flickering candlelit warmth',
            'Clean minimalist stainless steel, polished concrete, and natural skylights',
          ],
        },
      ];
    } else if (category === 'Professional Services & Consulting') {
      questions = [
        {
          id: 'q_core_expertise',
          title: 'Core Advisory Specialty & Deliverable',
          description: 'What high-stakes transformation, audit, or strategic deliverable do you deliver for clients?',
          placeholder: 'e.g. Cross-border regulatory compliance architecture and automated audit readiness for fintechs scaling into Europe and APAC...',
          suggestions: [
            'Cross-border financial compliance and automated regulatory audit readiness',
            'Enterprise brand repositioning and narrative architecture for Series B+ scale-ups',
            'Executive leadership coaching and organization restructuring for high-growth tech teams',
            'AI integration and operational automation for mid-market manufacturing companies',
          ],
        },
        {
          id: 'q_ideal_client',
          title: 'Ideal Client Profile & Qualifying Threshold',
          description: 'Who is the decision maker who hires you, and what revenue or complexity threshold makes a client a perfect fit?',
          placeholder: 'e.g. Founders and Chief Risk Officers at fintechs processing $10M+ in transacting volume across multiple currencies...',
          suggestions: [
            'Chief Risk Officers and Heads of Legal at $10M - $100M fintech scale-ups',
            'Founders and CEOs preparing for an institutional Series A or B funding round',
            'Private equity operating partners seeking rapid turnaround in portfolio companies',
            'Municipal leaders and infrastructure directors modernizing public utilities',
          ],
        },
        {
          id: 'q_engagement_model',
          title: 'Engagement Structure & Fee Model',
          description: 'How do you price and package your expertise? (Retainer, fixed-fee sprint, or value-based incentive?)',
          placeholder: 'e.g. $25,000 6-week diagnostic audit sprint followed by a $6,500/month recurring regulatory advisory retainer...',
          suggestions: [
            '$25,000 fixed-fee 6-week diagnostic sprint with actionable architecture blueprint',
            '$8,000 to $15,000/month recurring executive advisory retainer',
            'Value-share pricing based on verified cost reduction or revenue milestone',
            'Tiered project packages with clear scope boundaries and guaranteed turnaround',
          ],
        },
        {
          id: 'q_advisory_reputation',
          title: 'Authority Proof & Inbound Client Channels',
          description: 'Where will your highest-trust clients discover you, and what authoritative proof anchors your reputation?',
          placeholder: 'e.g. In-depth peer-reviewed industry benchmark reports, executive roundtable dinners, and referral networks...',
          suggestions: [
            'Peer-reviewed quarterly research benchmark studies and authoritative whitepapers',
            'Curated private roundtables and invite-only dinners for decision makers',
            'Warm executive referral network and co-advisory channel partnerships',
            'High-intent LinkedIn essays and podcast appearances breaking down complex case studies',
          ],
        },
        {
          id: 'q_institutional_tone',
          title: 'Advisory Voice & Brand Stature',
          description: 'What posture should your firm embody? (Boutique vanguard, trusted institutional counsel, or agile disrupter?)',
          placeholder: 'e.g. Dispassionate, empirical, institutional rigor with uncompromising clarity and zero corporate fluff...',
          suggestions: [
            'Empirical institutional rigor with direct, unhurried, and dispassionate clarity',
            'Agile, dynamic vanguard challenging sleepy legacy consulting giants',
            'Human-centered, empathetic, and collaborative problem-solving partner',
            'Prestigious boutique authority with exclusive client selectivity',
          ],
        },
      ];
    } else {
      // General Innovation & Enterprise Brand
      questions = [
        {
          id: 'q_core_premise',
          title: 'Core Venture Mission & Purpose',
          description: 'What fundamental shift in your industry does this brand exist to lead?',
          placeholder: 'e.g. Democratizing access to decentralized clean energy by automating battery storage dispatch...',
          suggestions: [
            'Eliminating unnecessary operational waste through intelligent automation',
            'Bringing handcrafted design dignity to everyday consumer essentials',
            'Enabling transparent, fair access to mission-critical infrastructure',
            'Empowering small teams to operate with the leverage of Fortune 500 enterprises',
          ],
        },
        {
          id: 'q_target_users',
          title: 'Target Customers & Primary Use Case',
          description: 'Describe the specific person whose life or work is dramatically improved by this brand.',
          placeholder: 'e.g. Forward-thinking facility managers and property operators managing multi-tenant commercial parks...',
          suggestions: [
            'Forward-thinking operations leaders seeking measurable 9-month ROI payback',
            'Discerning prosumers who refuse to compromise on quality and sustainability',
            'Fast-moving founders seeking to scale without bloated payroll overhead',
            'Specialized professionals needing reliable tools built specifically for their niche',
          ],
        },
        {
          id: 'q_unique_wedge',
          title: 'Differentiation Wedge & Secret Sauce',
          description: 'What makes your solution radically better, faster, or more desirable than existing alternatives?',
          placeholder: 'e.g. Zero-hardware implementation, sub-second latency, and verified 30% reduction in operating costs...',
          suggestions: [
            'Radically simpler onboarding (live in 48 hours vs. 6 months)',
            'Proprietary algorithm delivering quantifiable 25%+ cost savings',
            'Superior aesthetics, tactile craft, and sustainable provenance',
            'All-in-one unified workflow replacing 5 disconnected single-purpose tools',
          ],
        },
        {
          id: 'q_monetization',
          title: 'Business Model & Unit Pricing',
          description: 'How will the business generate revenue, and what are your initial price expectations?',
          placeholder: 'e.g. Direct monthly subscription starting at $1,200/mo plus enterprise custom tiering...',
          suggestions: [
            'Recurring subscription tiered by volume or active assets',
            'Direct e-commerce sales with healthy 70%+ gross margins',
            'Hybrid hardware lease plus recurring consumable margin',
            'High-ticket professional service engagement with recurring maintenance retainer',
          ],
        },
        {
          id: 'q_first_milestone',
          title: 'First Major Commercial Milestone',
          description: 'What does your first critical victory look like in the next 90–180 days?',
          placeholder: 'e.g. Deploying across 5 commercial partner pilot facilities and verifying 25% cost reduction...',
          suggestions: [
            'Signing 5 reference pilot customers and verifying core ROI metrics',
            'Selling out initial 500-unit limited production run in first 30 days',
            'Surpassing $25,000 in monthly recurring revenue with zero churn',
            'Launching public beta and securing coverage in leading industry media',
          ],
        },
      ];
    }
  }

  return {
    businessCategory: category,
    productOrService: description.slice(0, 100) + '...',
    projectType,
    identifiedInformation: [
      `Target Domain: ${category}`,
      `Project Category: ${projectType === 'rebrand' ? 'Strategic Rebranding' : 'New Brand Venture'}`,
      `Core Concept: ${description.slice(0, 80)}`,
    ],
    criticalMissingInformation: [
      'Customer willingness-to-pay threshold',
      'Target distribution channel priority',
      'Key defensibility moat against competitors',
    ],
    relevantCustomerConsiderations: [
      'Payback timeline sensitivity',
      'Switching cost friction from legacy habits',
      'Trust and credibility hurdles during initial purchase',
    ],
    questions,
  };
}

// Compiles verified business understanding reflecting user's actual answers
export function compileVerifiedUnderstanding(
  rawIdea: string,
  projectType: ProjectType,
  category: string,
  answers: Record<string, string>,
  questions: DynamicQuestion[]
): IdeaUnderstanding {
  // Extract answers intelligently
  const answersList = Object.entries(answers);
  const primaryProblem = answers['q_core_problem'] || answers['q_rebrand_reasons'] || answers['q_core_premise'] || 'Inefficiencies and friction in the current operational landscape.';
  const targetAudience = answers['q_intended_users'] || answers['q_target_customers'] || answers['q_guest_experience'] || answers['q_ideal_client'] || answers['q_target_users'] || 'Discerning commercial and enterprise customers seeking reliable ROI.';
  const coreValue = answers['q_desired_changes'] || answers['q_unique_wedge'] || answers['q_concept_menu'] || answers['q_collection_style'] || rawIdea.slice(0, 150);
  const unfairAdvantage = answers['q_unfair_advantage'] || answers['q_differentiation'] || answers['q_materials_craft'] || answers['q_core_expertise'] || 'Proprietary design architecture and proven operational methodology.';
  const businessGoals = answers['q_commercial_goals'] || answers['q_first_milestone'] || answers['q_pricing_distribution'] || 'Achieve rapid beachhead adoption and establish category leadership within 12 months.';

  let rebrandDetails: RebrandDetails | undefined;
  if (projectType === 'rebrand') {
    rebrandDetails = {
      currentIdentity: answers['q_current_identity'] || 'Established brand with dependable reputation seeking modern evolution.',
      currentCustomers: answers['q_target_audience_shift'] || 'Legacy customer relationships requiring continuity during transition.',
      reasonsForRebranding: answers['q_rebrand_reasons'] || 'Market expansion, margin compression, and updated product capabilities.',
      desiredChanges: answers['q_desired_changes'] || 'Elevated institutional stature, modern design language, and faster deal velocity.',
      elementsToPreserve: answers['q_elements_to_preserve'] || 'Foundational customer trust, quality standards, and core heritage ethos.',
    };
  }

  // Generate an evocative project title from idea words
  const words = rawIdea.trim().split(/\s+/).filter(w => w.length > 3);
  let baseName = 'Stratum';
  if (words.length > 0) {
    const candidate = words[0].replace(/[^a-zA-Z]/g, '');
    if (candidate) {
      baseName = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
    }
  }

  return {
    projectName: `${baseName} ${projectType === 'rebrand' ? 'Evolution' : 'Venture'}`,
    projectType,
    businessCategory: category,
    businessDescription: rawIdea,
    productOrService: answers['q_concept_menu'] || answers['q_collection_style'] || answers['q_core_expertise'] || rawIdea.slice(0, 120),
    problemBeingSolved: primaryProblem,
    coreValue,
    potentialCustomers: targetAudience,
    differentiation: unfairAdvantage,
    businessGoals,
    constraints: [
      'Must maintain positive unit economics from initial commercial deployment',
      'Zero downtime or disruption to legacy customer relationships',
      'Brand positioning must remain verifiable and defensible against competitor counter-attacks',
    ],
    importantAssumptions: [
      'Target customer willingness to pay matches proposed margin structure',
      'Payback period under 9 months is sufficient to bypass prolonged bidding',
      'Selected visual direction commands immediate category trust',
    ],
    unresolvedQuestions: [
      'What is the optimal first distribution channel for rapid beachhead acquisition?',
      'Are integration partner agreements non-exclusive in initial regional pilots?',
    ],
    rebrandDetails,

    // Backward compatibility fields
    corePremise: coreValue,
    primaryProblem,
    targetAudienceSummary: targetAudience,
    unfairAdvantage,
    businessModelSummary: answers['q_business_model'] || answers['q_pricing_distribution'] || answers['q_engagement_model'] || answers['q_unit_economics'] || 'Tiered commercial model optimized for high contribution margins.',
    unresolvedAssumptions: [
      'Customer willingness to adopt without a 90-day pilot cycle',
      'Payback horizon under 9 months eliminates procurement vetoes',
      'Unit margin resilience under a 20% cost surge',
    ],
    suggestedFocusAreas: [
      'Conduct 15 customer discovery interviews to confirm willingness to pay',
      'Audit competitor pricing and feature parity in Research & Discovery',
      'Lock core value anchor in Brand Strategy to prevent messaging drift',
    ],
  };
}
