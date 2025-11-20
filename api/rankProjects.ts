import type { VercelRequest, VercelResponse } from '@vercel/node';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Define the schema for role-specific ranking
const roleRankingSchema = z.object({
  role: z.string().describe('The role being evaluated (e.g., "Backend Engineer", "Data Scientist", "AI/LLM Engineer")'),
  marketabilityScore: z.number().min(1).max(10).describe('Market value score for this specific role from 1-10'),
  recommendation: z.enum(['keep', 'enhance', 'drop']).describe('Recommendation for this specific role'),
  fitSummary: z.string().describe('One-sentence summary of how well this project fits this role'),
  appropriateLevel: z.enum(['junior', 'mid', 'senior', 'staff+']).describe('What experience level this project is appropriate for (junior: 0-2 years, mid: 2-5 years, senior: 5+ years, staff+: 8+ years with significant complexity/impact)'),
  levelReasoning: z.string().describe('Why this project fits this experience level - what makes it junior vs senior level work'),
  technicalComplexity: z.object({
    score: z.number().min(1).max(10),
    reasoning: z.string()
  }).describe('Technical sophistication for this role'),
  businessImpact: z.object({
    score: z.number().min(1).max(10),
    reasoning: z.string()
  }).describe('Business value relevant to this role'),
  marketRelevance: z.object({
    score: z.number().min(1).max(10),
    reasoning: z.string()
  }).describe('How relevant this project is for this role in 2025'),
  strengths: z.array(z.string()).describe('Role-specific strengths (2-4 items)'),
  weaknesses: z.array(z.string()).describe('Role-specific gaps or concerns (2-4 items)'),
  enhancementSuggestions: z.array(z.object({
    suggestion: z.string(),
    impact: z.string(),
    effort: z.enum(['low', 'medium', 'high'])
  })).describe('Improvements to make this project stronger for this role (if recommendation is enhance)'),
  redFlags: z.array(z.string()).describe('Role-specific red flags or concerns'),
  positioningAdvice: z.string().describe('How to present this project when applying to this role')
});

// Define the schema for multi-role project ranking
const projectRankingSchema = z.object({
  projectName: z.string().describe('Name of the project being evaluated'),
  projectType: z.string().describe('The primary discipline/type of this project (e.g., "Full-Stack Web App", "Data Pipeline", "ML Model", "Mobile App")'),
  overallSummary: z.string().describe('2-3 sentence executive summary of this project and its strengths/weaknesses'),
  hasAIComponents: z.boolean().describe('Does this project use OpenAI, Claude, LLMs, RAG, prompt engineering, or other AI/LLM APIs?'),
  roleRankings: z.array(roleRankingSchema).describe('Rankings for 4-5 roles, MUST include AI/LLM Engineer if hasAIComponents is true. Order from best fit to worst fit.'),
  bestFitRoles: z.array(z.string()).describe('The 1-2 roles this project is most competitive for'),
  comparableProjects: z.array(z.string()).describe('Examples of similar strong projects across any of the evaluated roles'),
  universalRedFlags: z.array(z.string()).describe('Red flags that apply regardless of target role (empty array if none)')
});

/**
 * Vercel Serverless Function for ranking engineering projects
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { projectDescription, targetRole, candidateLevel } = req.body;

    if (!projectDescription) {
      res.status(400).json({
        error: 'Missing required field: projectDescription'
      });
      return;
    }

    // Only detect AI/LLM components - let the AI determine other roles intelligently
    const aiKeywords = [
      'openai', 'claude', 'anthropic', 'gpt', 'llm', 'rag',
      'prompt engineering', 'ai api', 'ai agent', 'embeddings',
      'vector database', 'pgvector', 'token optimization',
      'cost optimization', 'fine-tuning', 'langchain'
    ];

    const descriptionLower = projectDescription.toLowerCase();

    // Use word boundary regex to avoid false positives (e.g., "rag" matching "drag")
    const hasAIKeyword = (keyword: string, text: string): boolean => {
      // For multi-word phrases, check if the entire phrase exists
      if (keyword.includes(' ')) {
        return text.includes(keyword);
      }
      // For single words, use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(text);
    };

    const hasAIComponents = aiKeywords.some(keyword => hasAIKeyword(keyword, descriptionLower));
    const detectedKeywords = aiKeywords.filter(k => hasAIKeyword(k, descriptionLower));

    const aiRoleRequirement = hasAIComponents
      ? `\n\n🚨 CRITICAL REQUIREMENT 🚨\nThis project uses AI/LLM technology (detected: ${detectedKeywords.join(', ')}).\nYou MUST include "AI/LLM Engineer" as one of the 4-5 roles you evaluate.\nThis is mandatory - do not skip this role.`
      : '';

    // Log for debugging
    console.log('[rankProjects] Has AI Components:', hasAIComponents);
    if (hasAIComponents) {
      console.log('[rankProjects] Detected AI keywords:', detectedKeywords);
    }

    // Optional context for more targeted feedback
    const roleContext = targetRole
      ? `\n\nTARGET ROLE: ${targetRole}\nEvaluate this project's relevance specifically for this type of role.`
      : '';

    const levelContext = candidateLevel
      ? `\n\nCANDIDATE LEVEL: ${candidateLevel}\nEvaluate if this project is appropriate for someone at this level.`
      : '';

    const result = streamObject({
      model: openai('gpt-4o'),
      schema: projectRankingSchema,
      system: `You are a senior tech industry hiring manager with 15+ years of experience reviewing thousands of resumes and technical projects across all tech disciplines. You evaluate projects with a critical, discerning eye and understand what makes candidates competitive across Software Engineering, Data Science, Data Engineering, ML Engineering, AI/LLM Engineering, DevOps, Product Management, and other technical roles.

EVALUATION FRAMEWORK:

**MARKETABILITY SCORE (1-10):**
- 9-10: Exceptional projects that immediately stand out. Production-scale, novel problems, significant impact, or cutting-edge work. These are resume highlights.
- 7-8: Strong projects that demonstrate solid technical depth. Good complexity, clear value, relevant skills. Definitely keep.
- 5-6: Decent projects but unremarkable. Basic implementations, limited scope, or common examples. Need enhancement or context.
- 3-4: Weak projects that don't add much value. Trivial implementations, outdated approaches, or unclear purpose. Consider dropping.
- 1-2: Projects that actively hurt candidacy. Poorly executed, irrelevant, or raise red flags. Drop immediately.

**WHAT HIRING MANAGERS LOOK FOR (ROLE-ADAPTIVE):**

**For Software/Mobile/Full-Stack Engineering:**
1. Real-world impact & scale (production usage, user base, measurable outcomes)
2. Technical sophistication (architecture, challenging problems, system design)
3. Modern tech stack relevance (2025 in-demand technologies)
4. Execution quality (production-ready code, testing, deployment)
5. Differentiation (what makes this unique or memorable)
**NOTE:** Projects without AI integration are NOT penalized. Strong software engineering fundamentals, architecture, and execution quality are what matter most.

**For Data Science/Analytics:**
1. Analytical rigor (methodology, statistical validity, hypothesis testing)
2. Business impact (insights that drove decisions, measurable outcomes)
3. Technical depth (advanced techniques, model sophistication, innovation)
4. Communication (visualization quality, storytelling, stakeholder value)
5. Tooling & reproducibility (proper methodology, version control, documentation)
**NOTE:** Traditional statistical analysis and data visualization projects are valued equally to ML-based projects. Focus on rigor and impact, not just trendy tools.

**For Data Engineering:**
1. Scale & performance (data volume, processing speed, optimization)
2. Pipeline reliability (monitoring, error handling, data quality)
3. Architecture & design (scalability, maintainability, best practices)
4. Technology choices (modern tools, appropriate stack for use case)
5. Real-world impact (enabled analytics, ML, or business processes)
**NOTE:** Core data engineering (ETL, pipelines, data quality) is evaluated on its own merits. AI integration is a bonus, not a requirement.

**For ML/AI Engineering:**
1. Model sophistication (beyond basic sklearn, novel approaches, production ML)
2. Real-world deployment (not just notebooks, actual serving/inference)
3. Scale & performance (handling production traffic, optimization)
4. Impact measurement (A/B testing, metrics, business outcomes)
5. Engineering rigor (MLOps, monitoring, reproducibility)
**NOTE:** Traditional ML (regression, classification, clustering) is valued. Not everything needs deep learning or LLMs.

**For AI/LLM Engineering (NEW ROLE CATEGORY):**
1. LLM integration quality (OpenAI, Anthropic, open-source models, fine-tuning)
2. Prompt engineering & optimization (cost efficiency, quality, latency)
3. RAG implementation (vector databases, retrieval quality, context management)
4. Production deployment (streaming, error handling, rate limiting, monitoring)
5. Cost optimization (token usage, caching, model selection, measurable savings)
6. AI agent design (multi-step reasoning, tool use, autonomous systems)
**NOTE:** This is a distinct role from ML Engineering. Focus is on LLM APIs, prompt engineering, and AI product features rather than training custom models.

**For DevOps/Infrastructure/Platform Engineering:**
1. Automation & efficiency (CI/CD, IaC, reduced manual work)
2. Scale & reliability (uptime, performance, disaster recovery)
3. Cost optimization (measurable cost savings, resource efficiency)
4. Security & compliance (best practices, certifications, governance)
5. Developer experience (improved workflows, reduced friction)
**NOTE:** Infrastructure excellence stands on its own. AI/ML workload experience is a bonus but not required.

**For Product/Technical PM:**
1. Impact & outcomes (user metrics, business results, shipped features)
2. Cross-functional leadership (stakeholder management, technical decisions)
3. Problem definition (user research, market insights, prioritization)
4. Execution (roadmap delivery, trade-off decisions, iteration)
5. Technical depth (credibility with engineers, architectural input)
**NOTE:** Strong product fundamentals matter most. AI features are evaluated as one of many possible product capabilities.

**UNIVERSAL RED FLAGS (ALL ROLES):**
- Tutorial projects presented as original work
- Overly simple work without unique value or insight
- Outdated technology/methodologies (unless for legacy maintenance)
- Unclear purpose, impact, or business value
- No evidence of completion or real-world usage
- Technologies/approaches considered anti-patterns today
- Lack of rigor appropriate for the discipline

**LEVEL APPROPRIATENESS:**
- Junior (0-2 years): Personal projects, learning exercises OK if well-executed and demonstrate growth
- Mid-level (2-5 years): Expect production experience, end-to-end ownership, real impact
- Senior (5+ years): Expect strategic decisions, scale, cross-functional influence, measurable business impact
- Staff+: Expect novel solutions, significant complexity, organizational impact, or industry-level contributions

**EVALUATION APPROACH:**
1. First, infer the project type/discipline from the description (e.g., if it mentions "trained a model" → ML/DS, "built a pipeline" → Data Eng, "designed API" → SWE)
2. Apply role-specific criteria from above
3. If a target role is specified, evaluate fit for that specific role
4. Be brutally honest - hiring managers see hundreds of resumes and can spot inflated claims

Help candidates understand what truly stands out vs what's forgettable in their specific discipline.`,
      prompt: `Evaluate this technical project from a hiring manager's perspective. Provide a comprehensive, honest assessment.${roleContext}${levelContext}${aiRoleRequirement}

PROJECT DESCRIPTION:
${projectDescription}

EVALUATION INSTRUCTIONS:

1. **Determine Project Type & Select Relevant Roles:**
   - Analyze the project description and identify its primary focus
   - Select 4-5 MOST RELEVANT roles to evaluate this project against
   - Consider: Frontend Engineer, Backend Engineer, Full-Stack Engineer, Mobile Engineer, Data Engineer, ML Engineer, AI/LLM Engineer, DevOps Engineer, Data Scientist
   - Order roles from BEST FIT to WORST FIT (highest scores first)

   **Role Selection Guidelines:**
   - React/Vue/Angular/Svelte (web) → Include Frontend Engineer
   - React Native/Expo → Include Mobile Engineer (and Frontend Engineer if web components exist)
   - Next.js/Full-stack frameworks → Include Full-Stack Engineer (and Frontend Engineer if strong UI focus)
   - APIs/Microservices/Databases → Include Backend Engineer
   - ETL/Pipelines/Data processing → Include Data Engineer
   - ML models (Scikit-learn/TensorFlow/PyTorch) → Include ML Engineer
   - OpenAI/Claude/LLM integration → Include AI/LLM Engineer (MANDATORY if detected)
   - Docker/K8s/CI/CD → Include DevOps Engineer

   **Examples for context:**
   - Full-stack web app with React + API → Full-Stack, Frontend, Backend
   - Mobile app with AI features → AI/LLM Engineer, Mobile, Full-Stack
   - Data pipeline with ML → Data Engineer, ML Engineer, Backend
   - Privacy-first SQL tool → Backend, Full-Stack, Frontend

2. **For Each Role, Provide Complete Evaluation:**

   **Marketability Score (1-10):** How competitive is this project for THIS specific role?

   **Recommendation:**
   - KEEP: Strong project for this role, include as-is (7-10/10)
   - ENHANCE: Has potential for this role but needs work first (4-6/10)
   - DROP: Not adding value for this role or actively hurting candidacy (1-3/10)

   **Fit Summary:** One sentence explaining why this project does/doesn't fit this role

   **Experience Level Appropriateness:**
   - Determine if this project is appropriate for Junior (0-2 years), Mid (2-5 years), Senior (5+ years), or Staff+ (8+ years)
   - Junior: Personal projects, learning exercises, basic implementations
   - Mid: Production systems, end-to-end ownership, measurable impact
   - Senior: Strategic decisions, scale, cross-functional complexity, significant business outcomes
   - Staff+: Novel solutions, organizational impact, industry-level contributions, exceptional complexity
   - Provide clear reasoning for the level assessment

   **Component Scores:**
   - Technical Complexity (1-10): Role-specific interpretation (DS = analytical rigor, SWE = architecture, DE = scale/pipeline design)
   - Business Impact (1-10): How this creates value in this role's context
   - Market Relevance (1-10): Demand for these skills in 2025 for this specific role

   **Strengths (2-4 items):** What stands out for THIS role specifically

   **Weaknesses (2-4 items):** What's missing or concerning for THIS role

   **Red Flags:** Role-specific concerns or deal-breakers

   **Enhancement Suggestions (if recommendation is "enhance"):**
   - Specific improvements to make (with effort estimates: low/medium/high)
   - How these changes would improve the score for THIS role
   - What would elevate this to a "keep" for THIS role

   **Positioning Advice:**
   - How to describe this project when applying to THIS role
   - What metrics or details to emphasize for THIS role
   - What to de-emphasize or omit for THIS role

3. **Cross-Role Analysis:**
   - Identify the 1-2 roles this project is MOST competitive for (bestFitRoles)
   - Note any universal red flags that apply regardless of role
   - Provide comparable project examples that are strong across evaluated roles

4. **Important Guidelines:**
   - Be HONEST about fit - a backend project should score LOW for irrelevant roles
   - The SAME project can be 8/10 for one role and 3/10 for another - that's normal
   - Order roleRankings from best fit to worst fit (highest scores first)
   - Choose roles that make sense for the project's actual capabilities

**CRITICAL SCORING PRINCIPLES (ROLE-ADAPTIVE):**

**For Software Engineering:**
- Basic to-do/CRUD app = 2-3/10 regardless of tech stack
- Complex distributed system solving novel problem = 8-10/10 even with older tech
- Tutorial projects = 1-3/10 unless significantly extended
- Production usage + real users = +2-3 points

**For Data Science/Analytics:**
- Kaggle competition participation alone = 2-3/10
- Novel analysis with business impact + rigorous methodology = 8-10/10
- Jupyter notebook without reproducibility/documentation = 3-4/10
- Deployed model or insight that drove real decisions = +2-3 points

**For Data Engineering:**
- Basic ETL script = 2-3/10
- Production pipeline handling significant scale with monitoring = 8-10/10
- One-off data processing without consideration for reliability = 3-4/10
- Measurable impact on data quality/latency/cost = +2-3 points

**For ML Engineering:**
- Training a model in a notebook = 2-3/10
- Production ML system with monitoring, A/B testing, and business impact = 8-10/10
- Model without deployment story = 3-4/10
- Real-world inference at scale = +2-3 points

**For DevOps/Infrastructure:**
- Basic Docker/K8s setup = 2-3/10
- Automated platform reducing deployment time by 50% = 8-10/10
- Configuration without automation or IaC = 3-4/10
- Measurable reliability/cost improvements = +2-3 points

**For AI/LLM Engineering:**
- Basic OpenAI API wrapper with no optimization = 2-3/10
- Production AI system with RAG, cost optimization, and measurable impact = 8-10/10
- Simple chatbot without context management or error handling = 3-4/10
- Demonstrated cost savings through prompt engineering/caching = +2-3 points
- Agent systems with multi-step reasoning and tool use = +2-3 points

**IMPORTANT: Non-AI projects are NOT penalized:**
- A well-architected backend API scores the SAME regardless of whether it uses AI
- A robust data pipeline is evaluated on pipeline quality, not AI integration
- Strong software engineering fundamentals always trump trendy buzzwords
- Only evaluate AI-specific criteria when the project actually involves AI/LLM work
- Projects should be ranked primarily against roles they're designed for

Base scores on ACTUAL SUBSTANCE and IMPACT, not buzzwords. Be brutally honest and help the candidate understand exactly why their project ranks where it does.`,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Get the stream and pipe it to the response
    const stream = result.toTextStreamResponse();
    const reader = stream.body?.getReader();

    if (!reader) {
      res.status(500).json({ error: 'Failed to create stream' });
      return;
    }

    // Stream the response
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }

    res.end();
  } catch (error) {
    console.error('Project ranking error:', error);
    res.status(500).json({ error: 'Failed to rank project' });
  }
}
