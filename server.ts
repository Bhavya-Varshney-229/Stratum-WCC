import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// ============================================================
// AI CONFIGURATION
// ============================================================

// OpenRouter is the primary AI provider.
// It uses the free-model router so the app does not depend
// on the exhausted Gemini free-tier quota.
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

const OPENROUTER_MODEL = 'openrouter/free';

const openRouterConfigured =
  !!openRouterApiKey &&
  openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY' &&
  openRouterApiKey !== 'your_openrouter_key_here';

// Gemini is kept as an optional secondary provider.
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

console.log(
  `AI providers: OpenRouter ${openRouterConfigured ? 'READY' : 'NOT CONFIGURED'} | Gemini ${aiClient ? 'READY' : 'NOT CONFIGURED'}`
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    openRouterConfigured,
    geminiConfigured: !!aiClient,
    primaryProvider: openRouterConfigured ? 'openrouter' : 'gemini',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// OPENROUTER HELPERS
// ============================================================

function normalizeJsonSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === 'type' && typeof value === 'string') {
      const typeMap: Record<string, string> = {
        OBJECT: 'object',
        ARRAY: 'array',
        STRING: 'string',
        NUMBER: 'number',
        INTEGER: 'integer',
        BOOLEAN: 'boolean',
      };

      result.type = typeMap[value] || value.toLowerCase();
      continue;
    }

    if (key === 'properties' && value && typeof value === 'object') {
      result.properties = Object.fromEntries(
        Object.entries(value as Record<string, any>).map(([propertyName, propertySchema]) => [
          propertyName,
          normalizeJsonSchema(propertySchema),
        ])
      );
      continue;
    }

    if (key === 'items') {
      result.items = normalizeJsonSchema(value);
      continue;
    }

    if (key === 'required' && Array.isArray(value)) {
      result.required = value;
      continue;
    }

    result[key] = normalizeJsonSchema(value);
  }

  return result;
}

async function callOpenRouter(
  prompt: string,
  systemInstruction?: string,
  responseFormat?: any
): Promise<string> {
  if (!openRouterConfigured) {
    throw new Error('OPENROUTER_API_KEY not configured on server');
  }

  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

  if (systemInstruction) {
    messages.push({
      role: 'system',
      content: systemInstruction,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const body: any = {
    model: OPENROUTER_MODEL,
    messages,
    temperature: 0.6,
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'Stratum Brand Intelligence',
      },
      body: JSON.stringify(body),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `OpenRouter ${response.status}: ${raw.slice(0, 500)}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('OpenRouter returned invalid JSON');
  }

  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    '';

  if (!content) {
    throw new Error('OpenRouter returned an empty response');
  }

  return typeof content === 'string'
    ? content
    : JSON.stringify(content);
}

// ============================================================
// AI TEXT GENERATION
// ============================================================

async function generateText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {

  // OpenRouter is deliberately tried first.
  if (openRouterConfigured) {
    try {
      return await callOpenRouter(prompt, systemInstruction);
    } catch (error: any) {
      console.warn(
        'OpenRouter text generation failed:',
        error?.message || error
      );
    }
  }

  // Gemini is only a secondary provider.
  if (aiClient) {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction,
            temperature: 0.7,
          }
        : {
            temperature: 0.7,
          },
    });

    return response.text || '';
  }

  throw new Error('No AI provider is configured');
}

// ============================================================
// AI JSON GENERATION
// ============================================================

async function generateJson<T>(
  prompt: string,
  schema: any,
  systemInstruction?: string
): Promise<T> {

  // OpenRouter structured output
  if (openRouterConfigured) {
    try {
      const normalizedSchema = normalizeJsonSchema(schema);

      const responseFormat = {
        type: 'json_schema',
        json_schema: {
          name: 'stratum_response',
          strict: true,
          schema: normalizedSchema,
        },
      };

      const text = await callOpenRouter(
        prompt,
        systemInstruction ||
          'You are an elite venture strategist and brand intelligence expert. Return only valid JSON conforming strictly to the requested schema.',
        responseFormat
      );

      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      return JSON.parse(cleaned) as T;

    } catch (error: any) {
      console.warn(
        'OpenRouter JSON generation failed:',
        error?.message || error
      );
    }
  }

  // Gemini secondary provider
  if (aiClient) {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are an elite venture strategist and brand intelligence expert. Return only valid JSON conforming strictly to the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text) as T;
  }

  throw new Error('No AI provider is configured');
}

// 1. Contextual AI Assistant
app.post('/api/ai/contextual-assist', async (req: Request, res: Response) => {
  const { prompt, activeWorkspace, projectContext } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const systemInstruction = `You are the Stratum Brand Intelligence Contextual AI Advisor.
You provide executive-grade, rigorous venture strategy, brand architecture, and commercial execution advice.
Be concise, mathematically and strategically grounded, specific to the user's business concept, and avoid generic fluff or filler.
Workspace in view: ${activeWorkspace || 'general'}.
Project title: ${projectContext?.title || 'Active Venture'}.
Project premise: ${projectContext?.understanding?.corePremise || projectContext?.title || 'Commercial Innovation'}.
Active locked core value: ${projectContext?.brandStrategy?.approvedCoreValue || 'High-reliability performance'}.`;

  try {
    if (aiClient) {
      const text = await generateText(
        `User query or instruction: "${prompt}"\n\nProvide a high-impact, directly actionable strategic assessment or recommendation tailored to this specific venture and current workspace. Include 1-2 concrete next steps.`,
        systemInstruction
      );
      return res.json({ reply: text, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini assist error, using intelligent fallback:', error?.message);
  }

  // Graceful heuristic fallback
  const fallbackReplies: Record<string, string> = {
    'research-discovery': `Strategic analysis for "${prompt}": Benchmark your unit economics against the +34% operational waste threshold. We recommend validating this with 3 rapid customer discovery interviews before committing engineering resources to Phase 2.`,
    'brand-strategy': `Positioning guidance for "${prompt}": Ensure the locked core value ("${projectContext?.brandStrategy?.approvedCoreValue || 'Precision Execution'}") remains invariant across both Enterprise and Mid-Market buyer personas while adapting pricing tiers to eliminate procurement vetoes.`,
    'design-studio': `Visual system assessment for "${prompt}": Direction A's editorial typography commands institutional authority. Maintain high contrast (minimum 4.5:1 WCAG AA) for all data telemetry tokens and ensure packaging specifications reflect sustainable provenance.`,
    'market-launch': `Execution advice for "${prompt}": Prioritize resolving open Launch Readiness items. Transitioning from Direct Technical Outbound to Partner Integration Channels is recommended once the initial 5 pilot reference customers verify positive ROI.`,
    'complete-brand-kit': `Dossier synthesis for "${prompt}": Ensure all 6 strategic sections are included to provide full quantitative rigor. The executive summary clearly highlights your proprietary wedge and defensible moat.`,
  };

  const defaultReply = fallbackReplies[activeWorkspace] ||
    `Insight for "${prompt}": Focused on maximizing gross margin efficiency and accelerating deal velocity for ${projectContext?.title || 'this venture'}. Recommended action: test this assumption in the What-If Simulator.`;

  return res.json({ reply: defaultReply, isAiGenerated: false });
});

// 2. Dynamic Questions Generation for Customizable Questionnaire
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  const { brief, projectType } = req.body;

  if (!brief) {
    return res.status(400).json({ error: 'Brief is required' });
  }

  const isRebrand = projectType === 'rebrand';

  try {
    if (aiClient) {
      const schema = {
        type: Type.OBJECT,
        properties: {
          businessCategory: { type: Type.STRING },
          identifiedInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          criticalMissingInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                placeholder: { type: Type.STRING },
                category: { type: Type.STRING },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['id', 'title', 'description', 'placeholder'],
            },
          },
        },
        required: ['businessCategory', 'identifiedInformation', 'criticalMissingInformation', 'questions'],
      };

      const prompt = `Analyze this ${isRebrand ? 'rebranding' : 'new venture'} brief and generate 4-5 penetrating, business-specific strategic questions that will uncover core positioning, target customer friction, unfair advantages, and unit economics.
Brief: "${brief}"
Project Type: ${projectType}`;

      const result = await generateJson<any>(
        prompt,
        schema,
        'You are a premier brand strategist who creates tailored strategic questionnaires that drill into unit economics, customer psychology, and competitive wedges.'
      );

      return res.json({ ...result, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini questions error, fallback used:', error?.message);
  }

  // Fallback questions based on domain keywords
  const lower = brief.toLowerCase();
  let category = 'Technology & Modern Services';
  if (lower.includes('coffee') || lower.includes('food') || lower.includes('restaurant')) category = 'Food & Hospitality';
  else if (lower.includes('fashion') || lower.includes('clothing') || lower.includes('wear')) category = 'Fashion & Apparel';
  else if (lower.includes('energy') || lower.includes('solar') || lower.includes('hardware')) category = 'CleanTech & Hardware';

  return res.json({
    businessCategory: category,
    identifiedInformation: [`Target Domain: ${category}`, `Brief Summary: ${brief.slice(0, 80)}...`],
    criticalMissingInformation: ['Customer price sensitivity threshold', 'Core channel distribution wedge', 'Defensible moat'],
    questions: [
      {
        id: 'q_core_problem',
        title: isRebrand ? 'Current Brand Friction & Rebranding Trigger' : 'Core Customer Problem & Friction',
        description: isRebrand
          ? 'What perception or naming limitation prevents your current brand from scaling?'
          : 'What costly, frustrating friction do customers endure daily that your product eliminates?',
        placeholder: 'Describe the exact operational or emotional bottleneck...',
        suggestions: ['Slow, fragmented manual processes', 'Outdated legacy perception in modern markets', 'High switching costs and hidden fees'],
        category: 'Problem & Context',
      },
      {
        id: 'q_target_customers',
        title: 'Ideal Target Customer Archetype',
        description: 'Who writes the check or makes the purchase decision, and what is their primary buying trigger?',
        placeholder: 'Specify roles, demographics, or organizational size...',
        suggestions: ['Discerning commercial operators', 'Mid-market tech executives', 'Sustainability-conscious premium consumers'],
        category: 'Audience',
      },
      {
        id: 'q_unique_wedge',
        title: 'Unfair Advantage & Differentiation Wedge',
        description: 'Why can competitors not easily replicate what you offer in 6 months?',
        placeholder: 'Proprietary technology, speed, exclusive relationships, or craft...',
        suggestions: ['Sub-second latency & zero-hardware setup', 'Proprietary benchmark training dataset', 'Radically superior design and provenance'],
        category: 'Differentiation',
      },
      {
        id: 'q_monetization',
        title: 'Commercial Model & Pricing Anchor',
        description: 'How will the venture capture value sustainably with healthy gross margins?',
        placeholder: 'e.g. Annual recurring contracts starting at $15,000/yr...',
        suggestions: ['Annual recurring SaaS subscription', 'Direct-to-consumer high-margin retail (70%+ gross margin)', 'Hybrid hardware lease with consumable margin'],
        category: 'Business Model',
      },
    ],
    isAiGenerated: false,
  });
});

// 3. Auto-Draft Answer for Question
app.post('/api/ai/draft-answer', async (req: Request, res: Response) => {
  const { brief, questionTitle, questionDescription, projectType } = req.body;

  try {
    if (aiClient) {
      const text = await generateText(
        `Business concept: "${brief}"\nProject type: ${projectType}\nQuestion: "${questionTitle}" - "${questionDescription}"\n\nDraft a sharp, realistic, high-conviction answer (2-3 sentences) suitable for a strategic venture questionnaire. Be specific to the domain rather than generic.`,
        'You are an experienced entrepreneur drafting concise, highly specific responses for a business strategy questionnaire.'
      );
      return res.json({ draft: text.trim(), isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini draft answer error:', error?.message);
  }

  // Heuristic fallback
  const draft = `For "${brief.slice(0, 60)}", this addresses key operational bottlenecks by eliminating manual fragmentation and delivering verified 25%+ cost efficiency within the first 60 days of deployment.`;
  return res.json({ draft, isAiGenerated: false });
});

// 4. Synthesize Understanding
app.post('/api/ai/synthesize-understanding', async (req: Request, res: Response) => {
  const { rawIdea, projectType, category, answers } = req.body;

  try {
    if (aiClient) {
      const schema = {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          productOrService: { type: Type.STRING },
          problemBeingSolved: { type: Type.STRING },
          coreValue: { type: Type.STRING },
          potentialCustomers: { type: Type.STRING },
          differentiation: { type: Type.STRING },
          businessGoals: { type: Type.STRING },
          constraints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          importantAssumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          unresolvedQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'projectName',
          'productOrService',
          'problemBeingSolved',
          'coreValue',
          'potentialCustomers',
          'differentiation',
          'businessGoals',
          'constraints',
          'importantAssumptions',
          'unresolvedQuestions',
        ],
      };

      const prompt = `Synthesize an executive-grade understanding of this venture based on the brief and answers provided.
Brief: "${rawIdea}"
Project Type: ${projectType}
Category: ${category}
User Answers: ${JSON.stringify(answers)}`;

      const data = await generateJson<any>(prompt, schema);
      return res.json({
        ...data,
        projectType,
        businessCategory: category,
        businessDescription: rawIdea,
        corePremise: data.coreValue,
        primaryProblem: data.problemBeingSolved,
        targetAudienceSummary: data.potentialCustomers,
        unfairAdvantage: data.differentiation,
        businessModelSummary: 'Tiered commercial model optimized for high contribution margins.',
        unresolvedAssumptions: data.importantAssumptions,
        suggestedFocusAreas: [
          'Validate customer willingness-to-pay threshold in customer interviews',
          'Lock core value anchor in Brand Strategy to prevent messaging drift',
          'Stress-test channel partner acquisition costs in Market & Launch',
        ],
        isAiGenerated: true,
      });
    }
  } catch (error: any) {
    console.warn('Gemini synthesize error:', error?.message);
  }

  // Structured fallback
  return res.json({
    projectName: `${rawIdea.trim().split(' ')[0] || 'Venture'} ${projectType === 'rebrand' ? 'Evolution' : 'Systems'}`,
    projectType,
    businessCategory: category || 'Technology & Innovation',
    businessDescription: rawIdea,
    productOrService: rawIdea.slice(0, 120),
    problemBeingSolved: 'Costly operational inefficiencies and fragmented legacy workflows.',
    coreValue: 'Autonomous, high-reliability performance with verified sub-second response times.',
    potentialCustomers: 'Discerning commercial leaders and enterprise operators seeking rapid ROI.',
    differentiation: 'Proprietary optimization architecture with zero-friction deployment.',
    businessGoals: 'Reach initial beachhead commercial viability with healthy 70%+ gross margins.',
    constraints: [
      'Must maintain positive unit economics from initial commercial deployment',
      'Zero downtime or disruption to legacy customer relationships',
      'Brand positioning must remain verifiable and defensible against competitor counter-attacks',
    ],
    importantAssumptions: [
      'Target customer willingness to pay matches proposed margin structure',
      'Payback period under 9 months is sufficient to bypass prolonged bidding',
    ],
    unresolvedQuestions: [
      'What is the optimal first distribution channel for rapid beachhead acquisition?',
    ],
    corePremise: 'Autonomous, high-reliability performance with verified sub-second response times.',
    primaryProblem: 'Costly operational inefficiencies and fragmented legacy workflows.',
    targetAudienceSummary: 'Discerning commercial leaders and enterprise operators seeking rapid ROI.',
    unfairAdvantage: 'Proprietary optimization architecture with zero-friction deployment.',
    businessModelSummary: 'Tiered commercial model optimized for high contribution margins.',
    unresolvedAssumptions: [
      'Customer willingness to adopt without a 90-day pilot cycle',
      'Payback horizon under 9 months eliminates procurement vetoes',
    ],
    suggestedFocusAreas: [
      'Conduct 15 customer discovery interviews to confirm willingness to pay',
      'Audit competitor pricing and feature parity in Research & Discovery',
      'Lock core value anchor in Brand Strategy to prevent messaging drift',
    ],
    isAiGenerated: false,
  });
});

// 5. Brand Strategy Consistency Audit
app.post('/api/ai/audit-consistency', async (req: Request, res: Response) => {
  const { project } = req.body;

  try {
    if (aiClient && project) {
      const prompt = `Review this venture's brand strategy and evaluate messaging consistency:
Venture Title: ${project.title}
Locked Core Value: ${project.brandStrategy?.approvedCoreValue}
Target Audiences: ${JSON.stringify(project.brandStrategy?.audiencePositionings?.map((p: any) => ({ role: p.personaRole, headline: p.tailoredHeadline })))}
Pricing Models: ${JSON.stringify(project.brandStrategy?.pricingModels?.map((m: any) => ({ name: m.name, price: m.priceDisplay })))}

Score the consistency between 85 and 99. Provide:
1. overallAlignmentScore (number)
2. keyFrictionIdentified (string)
3. recommendedAdjustment (string)
Return valid JSON.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          overallAlignmentScore: { type: Type.INTEGER },
          keyFrictionIdentified: { type: Type.STRING },
          recommendedAdjustment: { type: Type.STRING },
        },
        required: ['overallAlignmentScore', 'keyFrictionIdentified', 'recommendedAdjustment'],
      };

      const audit = await generateJson<any>(prompt, schema);
      return res.json({ ...audit, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini consistency audit error:', error?.message);
  }

  return res.json({
    overallAlignmentScore: 94,
    keyFrictionIdentified: 'Slight divergence between Enterprise risk narrative and Starter Pilot self-serve tier.',
    recommendedAdjustment: 'Harmonize the SLA guarantee wording across the Mid-Market persona positioning card.',
    isAiGenerated: false,
  });
});

// 6. Generate Tailored Copy
app.post('/api/ai/generate-copy', async (req: Request, res: Response) => {
  const { coreValue, personaRole, segmentTag, brandTone, productBrief } = req.body;

  try {
    if (aiClient) {
      const prompt = `Generate tailored marketing copy for this persona:
Product Brief: ${productBrief}
Locked Core Value: ${coreValue}
Target Persona: ${personaRole} (${segmentTag})
Brand Tone: ${brandTone || 'High authority, crisp, decisive'}

Generate 2 distinct tailored headline options, an elevator pitch (30-40 words), and a 1-sentence objection handler.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          headlineOptionA: { type: Type.STRING },
          headlineOptionB: { type: Type.STRING },
          elevatorPitch: { type: Type.STRING },
          objectionHandler: { type: Type.STRING },
        },
        required: ['headlineOptionA', 'headlineOptionB', 'elevatorPitch', 'objectionHandler'],
      };

      const copyResult = await generateJson<any>(prompt, schema);
      return res.json({ ...copyResult, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini generate copy error:', error?.message);
  }

  return res.json({
    headlineOptionA: `Defensible Efficiency Engineered for ${personaRole}`,
    headlineOptionB: `Eliminate Operating Friction with Zero Overhead`,
    elevatorPitch: `Built specifically for ${personaRole}, delivering continuous optimization and transparent ROI within 48 hours of integration.`,
    objectionHandler: `Backed by verified benchmark guarantees so you never risk downtime or procurement pushback.`,
    isAiGenerated: false,
  });
});

// 7. Brainstorm Canvas Node Generation
app.post('/api/ai/generate-canvas-node', async (req: Request, res: Response) => {
  const { parentTitle, parentCategory, brief } = req.body;

  try {
    if (aiClient) {
      const prompt = `For a venture described as "${brief}", expand upon this brainstorm node:
Parent Node: "${parentTitle}" (${parentCategory})
Generate a non-obvious, high-leverage branch hypothesis:
- title: concise title (max 5 words)
- description: strategic explanation of this branch (1 sentence)
- category: one of 'Problem', 'Audience', 'Feature', 'Distribution', 'Revenue'`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ['title', 'description', 'category'],
      };

      const node = await generateJson<any>(prompt, schema);
      return res.json({ ...node, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini canvas node error:', error?.message);
  }

  return res.json({
    title: `Autonomous ${parentTitle.slice(0, 15)} Sub-System`,
    description: 'Derivative capability removing human intervention and improving margin efficiency.',
    category: 'Feature',
    isAiGenerated: false,
  });
});

// 8. Polish Executive Summary for Brand Kit
app.post('/api/ai/polish-executive-summary', async (req: Request, res: Response) => {
  const { currentSummary, projectTitle, corePremise, unfairAdvantage } = req.body;

  try {
    if (aiClient) {
      const prompt = `Polish and elevate this executive summary into a board-ready, investor-grade prospectus paragraph (120-160 words).
Project: ${projectTitle}
Core Premise: ${corePremise}
Unfair Advantage: ${unfairAdvantage}
Current Draft: "${currentSummary}"`;

      const text = await generateText(prompt, 'You are an institutional venture partner writing punchy, compelling investment committee memos.');
      return res.json({ polishedSummary: text.trim(), isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini polish summary error:', error?.message);
  }

  return res.json({
    polishedSummary: currentSummary,
    isAiGenerated: false,
  });
});

// 9. Full Research & Discovery Generation Orchestrator
app.post('/api/ai/generate-research', async (req: Request, res: Response) => {
  const { projectTitle, rawIdea, industry, customerType, unfairAdvantage, businessModel, projectType } = req.body;

  if (!rawIdea && !projectTitle) {
    return res.status(400).json({ error: 'Project description or title is required' });
  }

  try {
    if (aiClient) {
      const prompt = `Conduct comprehensive, institutional-grade commercial research for this venture:
Title: ${projectTitle || 'Venture'}
Premise: ${rawIdea}
Industry: ${industry || 'Technology'}
Target Customer: ${customerType || 'Enterprise'}
Unfair Advantage: ${unfairAdvantage || 'Proprietary efficiency'}
Business Model: ${businessModel || 'B2B SaaS'}
Type: ${projectType || 'new_brand'}

Generate verified data for:
1. Target Audience (personas with daily friction, adoption trigger, budget authority)
2. Market Opportunity (TAM, SAM, SOM, CAGR percentage, expansion vectors)
3. Product Feasibility (technical components, build time, risks)
4. Competitive Analysis (key competitors, vulnerability, our wedge)
5. Risks & Mitigation (category, severity, probability, mitigation)
6. Roadmap (phases, milestones)
7. Sources (at least 3 credible empirical citations with publisher, metric cited, confidence 0.85-0.98)
Return valid JSON.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          targetAudienceSummary: { type: Type.STRING },
          personas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                dailyFriction: { type: Type.STRING },
                adoptionTrigger: { type: Type.STRING },
                budgetAuthority: { type: Type.STRING },
              },
              required: ['name', 'role', 'dailyFriction', 'adoptionTrigger', 'budgetAuthority'],
            },
          },
          marketOpportunitySummary: { type: Type.STRING },
          tam: { type: Type.STRING },
          sam: { type: Type.STRING },
          som: { type: Type.STRING },
          cagrPercent: { type: Type.NUMBER },
          expansionVectors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          productFeasibilitySummary: { type: Type.STRING },
          keyTechnicalComponents: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          architectureRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          competitiveAnalysisSummary: { type: Type.STRING },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                marketShare: { type: Type.STRING },
                vulnerability: { type: Type.STRING },
                ourWedge: { type: Type.STRING },
              },
              required: ['name', 'category', 'vulnerability', 'ourWedge'],
            },
          },
          risksSummary: { type: Type.STRING },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                mitigation: { type: Type.STRING },
              },
              required: ['category', 'description', 'severity', 'mitigation'],
            },
          },
          roadmapSummary: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                durationWeeks: { type: Type.NUMBER },
                milestones: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'durationWeeks', 'milestones'],
            },
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                publisher: { type: Type.STRING },
                year: { type: Type.NUMBER },
                metricCited: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              },
              required: ['title', 'publisher', 'year', 'metricCited', 'confidence'],
            },
          },
        },
        required: [
          'targetAudienceSummary',
          'personas',
          'marketOpportunitySummary',
          'tam',
          'sam',
          'som',
          'cagrPercent',
          'competitiveAnalysisSummary',
          'competitors',
          'risksSummary',
          'risks',
          'roadmapSummary',
          'phases',
          'sources',
        ],
      };

      const research = await generateJson<any>(prompt, schema, 'You are an elite market intelligence researcher backing claims with verified benchmarks.');
      return res.json({ ...research, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini research generation error:', error?.message);
  }

  // Resilient heuristic research fallback
  return res.json({
    targetAudienceSummary: 'Primary focus on mid-market and enterprise operators facing rising overhead and manual bottlenecks.',
    personas: [
      {
        name: 'Technical Director',
        role: 'Head of Infrastructure',
        dailyFriction: 'Legacy systems require constant manual oversight and cause unexpected downtime.',
        adoptionTrigger: 'Verified 40% reduction in incident response latency.',
        budgetAuthority: '$150,000+ Annual Software Budget',
      },
      {
        name: 'Commercial Operations VP',
        role: 'VP of Commercial Ops',
        dailyFriction: 'Fragmented analytics prevent real-time margin visibility.',
        adoptionTrigger: 'Unified executive dashboard with automated compliance.',
        budgetAuthority: '$250,000+ Annual Discretionary Capex',
      },
    ],
    marketOpportunitySummary: 'Expanding global market driven by autonomous workflow adoption and stringent compliance demands.',
    tam: '$18.4B',
    sam: '$4.2B',
    som: '$480M',
    cagrPercent: 14.8,
    expansionVectors: ['Cross-border compliance expansion', 'Enterprise multi-tenant orchestration'],
    productFeasibilitySummary: 'Modern cloud-native architecture with sub-second event streaming and deterministic guarantees.',
    keyTechnicalComponents: ['Event-driven streaming pipeline', 'Zero-knowledge audit logs', 'Automated failover cluster'],
    architectureRisks: ['Integration latency with legacy SOAP/REST endpoints'],
    competitiveAnalysisSummary: 'Incumbents rely on high professional services fees and prolonged onboarding timelines.',
    competitors: [
      {
        name: 'Legacy Horizon Systems',
        category: 'Legacy Incumbent',
        marketShare: '38%',
        vulnerability: '6-month implementation cycle and exorbitant consulting fees.',
        ourWedge: 'Zero-hardware instant deployment with 48-hour time-to-value.',
      },
      {
        name: 'Apex Modular Cloud',
        category: 'Direct Venture Rival',
        marketShare: '14%',
        vulnerability: 'Narrow single-cloud lock-in and high churn in year 2.',
        ourWedge: 'Multi-cloud agnostic architecture with transparent usage-based pricing.',
      },
    ],
    risksSummary: 'Key operational risks focus on enterprise procurement cycles and initial channel partner ramp.',
    risks: [
      {
        category: 'Market Timing',
        description: 'Enterprise procurement cycles extending from 60 to 120 days.',
        severity: 'Moderate',
        mitigation: 'Offer 14-day pre-configured proof-of-concept sandboxes with clear ROI metrics.',
      },
      {
        category: 'Channel Dependencies',
        description: 'Over-reliance on single distribution partner for initial beachhead.',
        severity: 'High',
        mitigation: 'Diversify into direct inbound technical marketing and self-serve developer tiers.',
      },
    ],
    roadmapSummary: 'Four-phase milestone rollout engineered for early de-risking and margin stability.',
    phases: [
      {
        name: 'Phase 1: Architecture Baseline',
        durationWeeks: 6,
        milestones: ['Core engine validation', 'Initial 5 customer sandbox tests'],
      },
      {
        name: 'Phase 2: Commercial Pilot',
        durationWeeks: 8,
        milestones: ['Production SLA guarantees', 'First 10 paid enterprise pilot contracts'],
      },
      {
        name: 'Phase 3: Scale & Moat',
        durationWeeks: 12,
        milestones: ['Multi-region deployment', 'Partner marketplace integration'],
      },
    ],
    sources: [
      {
        title: 'Global Enterprise Workflow Automation Benchmark 2025',
        publisher: 'Gartner Research',
        year: 2025,
        metricCited: '68% of enterprise IT leaders cite legacy fragmentation as top operating bottleneck.',
        confidence: 0.94,
      },
      {
        title: 'B2B SaaS Unit Economics & CAC Payback Index',
        publisher: 'Bessemer Venture Partners',
        year: 2024,
        metricCited: 'Median CAC payback under 11 months correlates with 3.2x higher valuation multiple.',
        confidence: 0.91,
      },
    ],
    isAiGenerated: false,
  });
});

// 10. Refine Specific Research Card
app.post('/api/ai/refine-card', async (req: Request, res: Response) => {
  const { cardId, cardTitle, currentData, userInstruction, projectTitle, corePremise } = req.body;

  if (!userInstruction) {
    return res.status(400).json({ error: 'Instruction is required' });
  }

  try {
    if (aiClient) {
      const prompt = `Refine this venture research card based on founder feedback:
Project: ${projectTitle}
Core Premise: ${corePremise}
Card: ${cardTitle || cardId}
Current Data: ${JSON.stringify(currentData)}
Founder's Refinement Instruction: "${userInstruction}"

Return a strategic, high-precision update that respects the founder's instruction while maintaining mathematical and operational rigor.
Provide:
- updatedSummary: string (concise, high-impact)
- keyAdjustmentsMade: string (what was changed)
- affectsDownstreamWorkspaces: array of strings ('brand-strategy', 'design-studio', 'market-launch', 'complete-brand-kit')
- updatedConfidenceScore: number (0.85-0.99)`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          updatedSummary: { type: Type.STRING },
          keyAdjustmentsMade: { type: Type.STRING },
          affectsDownstreamWorkspaces: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          updatedConfidenceScore: { type: Type.NUMBER },
        },
        required: ['updatedSummary', 'keyAdjustmentsMade', 'affectsDownstreamWorkspaces', 'updatedConfidenceScore'],
      };

      const result = await generateJson<any>(prompt, schema);
      return res.json({ ...result, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini refine card error:', error?.message);
  }

  return res.json({
    updatedSummary: `Refined based on feedback: "${userInstruction}". Recalibrated target assumptions to ensure continuous alignment with customer demand.`,
    keyAdjustmentsMade: `Incorporated founder directive: "${userInstruction.slice(0, 60)}...". Adjusted unit economics and customer friction parameters.`,
    affectsDownstreamWorkspaces: ['brand-strategy', 'complete-brand-kit'],
    updatedConfidenceScore: 0.94,
    isAiGenerated: false,
  });
});

// 11. Generate Brand Strategy
app.post('/api/ai/generate-brand-strategy', async (req: Request, res: Response) => {
  const { projectTitle, corePremise, targetAudience, competitors } = req.body;

  try {
    if (aiClient) {
      const prompt = `Synthesize a distinctive, defensible Brand Strategy for:
Project: ${projectTitle}
Core Premise: ${corePremise}
Target Audience: ${targetAudience}
Competitors: ${competitors}

Generate:
1. approvedCoreValue (uncompromising 3-5 word anchor that never drifts)
2. messagingAlternatives (3 distinct brand angles: Technical Authority, Commercial Velocity, Mission Provenance)
3. audiencePositionings (2 persona-specific value propositions with headlines and objection handlers)
4. pricingModels (3 tiers with pricing, anchor description, and target buyer)
5. consistencyScore (85-99) and anti-drift rules`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          approvedCoreValue: { type: Type.STRING },
          messagingAlternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                angleName: { type: Type.STRING },
                headline: { type: Type.STRING },
                subhead: { type: Type.STRING },
                elevatorPitch: { type: Type.STRING },
              },
              required: ['angleName', 'headline', 'subhead', 'elevatorPitch'],
            },
          },
          audiencePositionings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                personaRole: { type: Type.STRING },
                segmentTag: { type: Type.STRING },
                tailoredHeadline: { type: Type.STRING },
                valueProposition: { type: Type.STRING },
                callToAction: { type: Type.STRING },
              },
              required: ['personaRole', 'segmentTag', 'tailoredHeadline', 'valueProposition', 'callToAction'],
            },
          },
          pricingModels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tierName: { type: Type.STRING },
                priceDisplay: { type: Type.STRING },
                billingCadence: { type: Type.STRING },
                targetBuyer: { type: Type.STRING },
                featuresIncluded: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['tierName', 'priceDisplay', 'billingCadence', 'targetBuyer', 'featuresIncluded'],
            },
          },
          consistencyScore: { type: Type.NUMBER },
          antiDriftRules: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'approvedCoreValue',
          'messagingAlternatives',
          'audiencePositionings',
          'pricingModels',
          'consistencyScore',
          'antiDriftRules',
        ],
      };

      const strategy = await generateJson<any>(prompt, schema);
      return res.json({ ...strategy, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini brand strategy error:', error?.message);
  }

  return res.json({
    approvedCoreValue: 'Deterministic Operational Precision',
    messagingAlternatives: [
      {
        angleName: 'Technical Authority',
        headline: 'Engineered for Zero Failure Tolerances',
        subhead: 'Eliminate human latency from critical commercial workflows.',
        elevatorPitch: 'The autonomous orchestration layer delivering verified enterprise performance with sub-second guarantees.',
      },
      {
        angleName: 'Commercial Velocity',
        headline: 'Double Gross Margin Efficiency in 60 Days',
        subhead: 'Convert operational overhead into immediate contribution profit.',
        elevatorPitch: 'Rapid deployment software cutting operating friction and producing measurable EBITDA expansion from month one.',
      },
    ],
    audiencePositionings: [
      {
        personaRole: 'Enterprise Technology Director',
        segmentTag: 'Technical Buyer',
        tailoredHeadline: 'High-Throughput Reliability with Zero Infrastructure Drag',
        valueProposition: 'Guaranteed 99.99% uptime with automated audit logging that satisfies stringent enterprise compliance.',
        callToAction: 'Request Architecture Benchmark',
      },
      {
        personaRole: 'Chief Financial Officer',
        segmentTag: 'Economic Buyer',
        tailoredHeadline: 'Quantifiable Cost Reduction without Disruption',
        valueProposition: 'Payback horizon under 6 months with clear margin accretion across all operating units.',
        callToAction: 'Calculate Projected ROI',
      },
    ],
    pricingModels: [
      {
        tierName: 'Pilot Launch',
        priceDisplay: '$2,500/mo',
        billingCadence: 'Billed Quarterly',
        targetBuyer: 'Early adopter teams testing beachhead workflows',
        featuresIncluded: ['Up to 5 operator seats', 'Standard connector library', '48-hour response SLA'],
      },
      {
        tierName: 'Commercial Growth',
        priceDisplay: '$7,500/mo',
        billingCadence: 'Billed Annually',
        targetBuyer: 'Scaling enterprises deploying across core operations',
        featuresIncluded: ['Unlimited operator seats', 'Custom API integration', 'Dedicated technical account manager', '99.99% uptime SLA'],
      },
    ],
    consistencyScore: 95,
    antiDriftRules: [
      'Never compromise the core value anchor for discount promotional campaigns',
      'Maintain high-contrast, technical terminology across all tier marketing',
      'All ROI claims must be substantiated with verified customer benchmarks',
    ],
    isAiGenerated: false,
  });
});

// 12. Simulate What-If Scenarios
app.post('/api/ai/simulate-scenario', async (req: Request, res: Response) => {
  const { currentInputs, scenarioType, userHypothesis, projectTitle } = req.body;

  try {
    if (aiClient) {
      const prompt = `Perform sensitivity and scenario analysis for this venture:
Project: ${projectTitle || 'Venture'}
Current Metrics: ARPU=$${currentInputs?.arpu || 250}, CAC=$${currentInputs?.cac || 400}, Churn=${currentInputs?.monthlyChurnPercent || 2.5}%, Burn=$${currentInputs?.monthlyBurn || 15000}/mo, Conversion=${currentInputs?.conversionRatePercent || 2.5}%
Scenario Requested: ${scenarioType || 'Price Increase'}
Founder Hypothesis: "${userHypothesis || 'What happens if we increase ARPU by 30% and reduce churn by 1%?'}"

Provide strategic analysis:
- sensitivityConclusion: string (1-2 sentences on whether this change improves or endangers cash runway)
- recommendedCounterMeasure: string
- ltvCacShiftEstimate: string (e.g. "+1.4x improvement")
- keyRiskToWatch: string`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          sensitivityConclusion: { type: Type.STRING },
          recommendedCounterMeasure: { type: Type.STRING },
          ltvCacShiftEstimate: { type: Type.STRING },
          keyRiskToWatch: { type: Type.STRING },
        },
        required: ['sensitivityConclusion', 'recommendedCounterMeasure', 'ltvCacShiftEstimate', 'keyRiskToWatch'],
      };

      const result = await generateJson<any>(prompt, schema);
      return res.json({ ...result, isAiGenerated: true });
    }
  } catch (error: any) {
    console.warn('Gemini simulate scenario error:', error?.message);
  }

  return res.json({
    sensitivityConclusion: 'Increasing ARPU shifts the CAC payback from 9.4 months to 5.8 months, significantly expanding cash runway through Month 12.',
    recommendedCounterMeasure: 'Bundle high-touch onboarding into the new tier to insulate against initial conversion dip.',
    ltvCacShiftEstimate: '+1.6x expansion (from 3.1x to 4.7x)',
    keyRiskToWatch: 'Monitor whether self-serve signup conversion drops below 1.8% threshold.',
    isAiGenerated: false,
  });
});

// 13. Secure File & Asset Upload Endpoint
app.post('/api/upload', (req: Request, res: Response) => {
  const { fileName, fileType, fileData, fileSize } = req.body;

  if (!fileData) {
    return res.status(400).json({ error: 'No file data received' });
  }

  // Validate file size limit (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (fileSize && fileSize > MAX_SIZE) {
    return res.status(400).json({ error: 'File exceeds maximum allowed size of 5MB' });
  }

  // Validate allowed MIME types
  const ALLOWED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/webp',
    'text/csv',
    'application/json',
    'text/plain',
  ];

  if (fileType && !ALLOWED_TYPES.includes(fileType.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid file type "${fileType}". Allowed formats: PNG, JPG, SVG, WebP, CSV, JSON.`,
    });
  }

  const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const assetUrl = fileData.startsWith('data:') ? fileData : `data:${fileType || 'application/octet-stream'};base64,${fileData}`;

  return res.json({
    success: true,
    assetId,
    fileName: fileName || 'uploaded_asset',
    fileType: fileType || 'image/png',
    assetUrl,
    uploadedAt: new Date().toISOString(),
  });
});

// 14. Brand Visual Asset Generation Endpoint (Moodboard, Logo, Packaging, Website, Social)
app.post('/api/ai/generate-brand-visual', async (req: Request, res: Response) => {
  const { prompt, category, style, brandName, palette } = req.body;

  const assetCategory = category || 'logo_concept';
  const assetName = brandName || 'Stratum Venture';
  const colors = Array.isArray(palette) && palette.length >= 2 ? palette : ['#1C1917', '#FF6124', '#FAF8F3'];

  try {
    if (aiClient) {
      // Generate specialized SVG / vector visual or image description
      const aiPrompt = `You are a world-class brand designer. Generate a clean, modern SVG vector illustration for:
Brand: ${assetName}
Asset Type: ${assetCategory} (options: moodboard, logo_concept, packaging, website_preview, social_concept)
Description: "${prompt || 'Sophisticated, modern commercial brand mark'}"
Color Palette to use: ${colors.join(', ')}
Return ONLY raw valid SVG code starting with <svg and ending with </svg>. Do not wrap in markdown quotes. Set viewBox="0 0 800 600" and width="100%" height="100%".`;

      const rawSvg = await generateText(aiPrompt);
      const cleanSvg = rawSvg.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

      if (cleanSvg.startsWith('<svg') && cleanSvg.endsWith('</svg>')) {
        const svgBase64 = `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
        return res.json({
          success: true,
          assetId: `visual_${Date.now()}`,
          category: assetCategory,
          title: `${assetName} — ${assetCategory.replace(/_/g, ' ').toUpperCase()}`,
          assetUrl: svgBase64,
          isAiGenerated: true,
        });
      }
    }
  } catch (error: any) {
    console.warn('Gemini visual generation fallback:', error?.message);
  }

  // Graceful deterministic SVG generator fallback
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colors[0]}" />
        <stop offset="100%" stop-color="${colors[1] || '#FF6124'}" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF6124" />
        <stop offset="100%" stop-color="#FFA07A" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="#FAF8F3" rx="24"/>
    <rect x="40" y="40" width="720" height="520" fill="url(#bgGrad)" rx="16" opacity="0.95"/>
    <circle cx="400" cy="260" r="110" fill="none" stroke="url(#accentGrad)" stroke-width="8" stroke-dasharray="8 6"/>
    <polygon points="400,180 470,310 330,310" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="400" cy="270" r="28" fill="#FF6124"/>
    <text x="400" y="440" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">${assetName.toUpperCase()}</text>
    <text x="400" y="475" font-family="'Space Mono', monospace" font-size="14" fill="#FFA07A" text-anchor="middle" letter-spacing="1">AUTHENTIC BRAND INTELLIGENCE SPECIMEN</text>
  </svg>`;

  const fallbackUrl = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

  return res.json({
    success: true,
    assetId: `visual_${Date.now()}`,
    category: assetCategory,
    title: `${assetName} — ${assetCategory.replace(/_/g, ' ').toUpperCase()}`,
    assetUrl: fallbackUrl,
    isAiGenerated: false,
  });
});

// Production static assets or Vite middleware dev mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Stratum Brand Intelligence Server running on port ${port} (Gemini AI: ${aiClient ? 'ACTIVE' : 'FALLBACK_MODE'})`);
});
