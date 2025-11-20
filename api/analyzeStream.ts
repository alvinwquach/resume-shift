import type { VercelRequest, VercelResponse } from '@vercel/node';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Define the schema for structured streaming
const resumeAnalysisSchema = z.object({
  compatibilityScore: z.number().min(0).max(100).describe('Overall compatibility score from 0-100'),
  competitivePositioning: z.string().describe('How competitive this candidate is for the role. MUST include a summary of: (1) critical requirements met/missing, (2) nice-to-have skills present/missing. Example: "Meets 8/10 critical requirements. Has 3/5 nice-to-have skills (SQL time series, data analytics missing but not required)."'),
  strengths: z.array(z.string()).describe('Specific strengths that match the job requirements'),
  weaknesses: z.array(z.string()).describe('Areas that need improvement'),
  skillMatches: z.array(z.object({
    skill: z.string(),
    present: z.boolean(),
    importance: z.enum(['critical', 'high', 'medium', 'low'])
  })).describe('Analysis of required skills - IMPORTANT: Search the ENTIRE resume carefully before marking present as false'),
  experienceGaps: z.array(z.object({
    requirement: z.string(),
    gap: z.string(),
    suggestion: z.string()
  })).describe('Experience gaps and how to address them'),
  projectRecommendations: z.array(z.object({
    title: z.string(),
    description: z.string(),
    skills: z.array(z.string()),
    impact: z.string(),
    timeEstimate: z.string()
  })).describe('Specific projects to build that would strengthen candidacy for this role'),
  keywordRecommendations: z.array(z.object({
    keyword: z.string(),
    reason: z.string(),
    currentlyPresent: z.boolean()
  })).describe('Keywords to add or emphasize - IMPORTANT: Set currentlyPresent to TRUE if the keyword appears ANYWHERE in the resume text'),
  formattingTips: z.array(z.string()).describe('Resume formatting suggestions'),
  overallFeedback: z.string().describe('Comprehensive summary and recommendations')
});

/**
 * Vercel Serverless Function for streaming resume analysis
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { resumeText, jobDescription, projectRankings } = req.body;

    if (!resumeText || !jobDescription) {
      res.status(400).json({
        error: 'Missing required fields: resumeText and jobDescription'
      });
      return;
    }

    // Optional: Project rankings from rankProjects.ts to influence compatibility score
    // projectRankings format: Array<{ title, description, rankingResult }>
    const hasProjects = projectRankings && Array.isArray(projectRankings) && projectRankings.length > 0;

    // Auto-detect PROJECTS section from resume text for technical roles
    const detectProjectsFromResume = (resumeText: string): Array<{ title: string, description: string }> => {
      const projects: Array<{ title: string, description: string }> = [];

      // Look for PROJECTS or PROJECT section (case insensitive)
      // Capture everything until we hit another all-caps section (EDUCATION, SKILLS, etc.) or end of string
      const projectsSectionMatch = resumeText.match(/(?:^|\n)(PROJECTS?|Portfolio)\s*\n([\s\S]*?)(?=\n[A-Z][A-Z\s]{2,}\n|$)/i);

      if (!projectsSectionMatch) return projects;

      const projectsSection = projectsSectionMatch[2];

      // Split by project: Each project is separated by blank lines
      const projectBlocks = projectsSection.split(/\n\s*\n/);

      for (const block of projectBlocks) {
        if (block.trim().length < 20) continue; // Skip empty or too-short blocks

        // First line is usually the title (may include URL and tech stack)
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length === 0) continue;

        // Extract title (everything before | or first line if no |)
        const titleLine = lines[0];
        const titleMatch = titleLine.match(/^([^|]+?)(?:\s*\||$)/);
        const title = titleMatch ? titleMatch[1].trim() : titleLine.trim();

        // Description is the rest (bullet points)
        const description = lines.slice(1).join('\n').trim();

        if (title && description.length > 30) {
          projects.push({ title, description: `${titleLine}\n${description}` });
        }
      }

      return projects;
    };

    const autoDetectedProjects = detectProjectsFromResume(resumeText);
    const shouldAutoRankProjects = !hasProjects && autoDetectedProjects.length > 0;

    // If we detected projects but user hasn't ranked them, do inline lightweight scoring
    let inlineProjectScores: Array<{ title: string, avgScore: number, bestFitRoles: string[] }> = [];
    if (shouldAutoRankProjects) {
      // Simple heuristic scoring (not full AI ranking, to save API calls)
      // This gives a rough estimate - user can visit "My Projects" for detailed analysis
      for (const project of autoDetectedProjects) {
        const desc = project.description.toLowerCase();

        // Count relevant technologies and complexity indicators
        let score = 5.0; // Base score

        // Tech stack breadth (+0-2 points)
        const techCount = commonTechs.filter(tech => desc.includes(tech.toLowerCase())).length;
        score += Math.min(techCount / 5, 2);

        // Impact indicators (+0-2 points)
        const impactKeywords = ['production', 'real-time', 'deployed', 'users', 'scale', 'optimization', 'reduced', 'improved'];
        const impactCount = impactKeywords.filter(kw => desc.includes(kw)).length;
        score += Math.min(impactCount / 3, 2);

        // Modern/advanced tech (+0-1 point)
        const advancedTech = ['ai', 'ml', 'openai', 'websocket', 'vector', 'graphql', 'docker', 'kubernetes'];
        if (advancedTech.some(tech => desc.includes(tech))) score += 1;

        // Clamp to 1-10
        score = Math.min(Math.max(score, 1), 10);

        // Infer best fit roles from tech stack
        const roles: string[] = [];
        if (desc.includes('react') || desc.includes('next.js') || desc.includes('vue')) roles.push('Full-Stack Engineer');
        if (desc.includes('react native') || desc.includes('expo')) roles.push('Mobile Engineer');
        if (desc.includes('api') || desc.includes('backend') || desc.includes('database')) roles.push('Backend Engineer');
        if (desc.includes('openai') || desc.includes('claude') || desc.includes('llm')) roles.push('AI/LLM Engineer');
        if (desc.includes('data pipeline') || desc.includes('etl')) roles.push('Data Engineer');
        if (desc.includes('ml') || desc.includes('model')) roles.push('ML Engineer');

        inlineProjectScores.push({
          title: project.title,
          avgScore: parseFloat(score.toFixed(1)),
          bestFitRoles: roles.length > 0 ? roles : ['Software Engineer']
        });
      }
    }

    // Pre-scan resume for common technologies to prevent hallucination
    const commonTechs = [
      // Frontend Frameworks & Libraries
      'React Native', 'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Expo',
      // Languages
      'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'Swift', 'Kotlin', 'C++', 'C#',
      // Backend & APIs
      'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'GraphQL', 'REST', 'API', 'Apollo',
      // Databases & SQL
      'SQL', 'Firebase', 'Supabase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firestore', 'Prisma', 'Drizzle', 'SQLite', 'pgvector',
      // Cloud & DevOps
      'AWS', 'GCP', 'Azure', 'Vercel', 'Docker', 'Kubernetes', 'CI/CD',
      // Styling & UI
      'Tailwind', 'CSS', 'SASS', 'styled-components', 'Material-UI', 'Chakra UI',
      // AI/ML
      'OpenAI', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
      // Testing
      'Jest', 'Cypress', 'Playwright', 'Testing Library',
      // Mobile
      'iOS', 'Android', 'Flutter',
      // Tools & Others
      'Git', 'GitHub', 'Webpack', 'Vite', 'D3.js', 'WebSocket', 'Zustand'
    ];

    const foundTechs = commonTechs.filter(tech =>
      resumeText.toLowerCase().includes(tech.toLowerCase())
    );

    // SQL-specific detection: If any SQL database is found, mark SQL as present
    const sqlDatabases = ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase', 'Prisma', 'Drizzle'];
    const hasSqlDatabase = sqlDatabases.some(db =>
      resumeText.toLowerCase().includes(db.toLowerCase())
    );
    const hasSqlKeyword = resumeText.toLowerCase().includes('sql');

    // Add SQL to foundTechs if any SQL database or SQL keyword is present
    if ((hasSqlDatabase || hasSqlKeyword) && !foundTechs.includes('SQL')) {
      foundTechs.push('SQL');
    }

    const techContext = foundTechs.length > 0
      ? `\n\nIMPORTANT - Technologies detected in resume: ${foundTechs.join(', ')}\nDo NOT mark these as missing!`
      : '';

    // Additional SQL context if SQL databases are present
    const sqlContext = hasSqlDatabase || hasSqlKeyword
      ? `\n\nSQL DETECTION: This candidate has SQL experience (found: ${[
          hasSqlKeyword ? 'SQL' : null,
          ...sqlDatabases.filter(db => resumeText.toLowerCase().includes(db.toLowerCase()))
        ].filter(Boolean).join(', ')}). Any SQL databases (PostgreSQL, MySQL, SQLite, etc.) count as SQL experience.`
      : '';

    // Build project portfolio context to influence compatibility scoring
    let projectContext = '';

    // Use provided rankings if available, otherwise use inline scores
    if (hasProjects) {
      const projectSummaries = projectRankings.map((proj: any) => {
        const result = proj.rankingResult;
        if (!result) return null;

        // Find the best role ranking for this project
        const bestRole = result.roleRankings?.[0]; // Already sorted best to worst
        const avgScore = result.roleRankings
          ? (result.roleRankings.reduce((sum: number, r: any) => sum + r.marketabilityScore, 0) / result.roleRankings.length).toFixed(1)
          : 'N/A';

        return `- **${proj.title}** (Avg Score: ${avgScore}/10)
  Best fit for: ${result.bestFitRoles?.join(', ') || 'Multiple roles'}
  Summary: ${result.overallSummary || 'No summary'}
  Key strengths: ${bestRole?.strengths?.slice(0, 2).join('; ') || 'N/A'}`;
      }).filter(Boolean);

      if (projectSummaries.length > 0) {
        projectContext = `\n\n📊 **PORTFOLIO ANALYSIS CONTEXT (User-Ranked):**
This candidate has been evaluated on ${projectRankings.length} portfolio project${projectRankings.length > 1 ? 's' : ''}:

${projectSummaries.join('\n\n')}

**CRITICAL SCORING ADJUSTMENT:**
- Strong portfolio work (7-10/10 avg) should BOOST the compatibility score by 5-10 points
  * Engineering: Well-built projects, production systems, meaningful scale/impact
  * Design: High-quality case studies, shipped work, clear design thinking
  * Product: Shipped features with measurable impact, user research, data-driven decisions
  * Marketing: Campaign results, growth metrics, content portfolio, analytics-driven work
  * Data/Analytics: Analysis quality, business impact, methodology rigor, reproducible insights
- Average portfolio (5-6/10 avg) maintains the baseline score
- Weak portfolio (1-4/10 avg) may REDUCE score by 3-5 points if it reveals skill gaps
- **Role relevance is critical:** A strong design portfolio doesn't boost an engineering application
- Explain the adjustment in overallFeedback (e.g., "Base fit: 65. Your 3 strong UX case studies demonstrate execution quality, boosting to 73.")`;
      }
    } else if (shouldAutoRankProjects && inlineProjectScores.length > 0) {
      // Auto-detected projects with heuristic scoring
      const avgScore = inlineProjectScores.reduce((sum, p) => sum + p.avgScore, 0) / inlineProjectScores.length;

      const projectSummaries = inlineProjectScores.map(proj => {
        return `- **${proj.title}** (Est. Score: ${proj.avgScore}/10)
  Likely fit for: ${proj.bestFitRoles.join(', ')}`;
      });

      projectContext = `\n\n📊 **AUTO-DETECTED PORTFOLIO (Heuristic Scoring):**
Detected ${inlineProjectScores.length} project${inlineProjectScores.length > 1 ? 's' : ''} in resume (avg: ${avgScore.toFixed(1)}/10):

${projectSummaries.join('\n')}

**SCORING GUIDANCE:**
- These are quick estimates based on tech stack and impact keywords
- For detailed analysis, suggest the user visit "My Projects" tab to rank them properly
- Still adjust compatibility score based on portfolio strength (avg ${avgScore.toFixed(1)}/10)
- Strong portfolio (7-10/10 avg): +5-10 points
- Average (5-6/10): No adjustment
- Weak (1-4/10): -3-5 points

**In your feedback, mention:** "Note: Project scores are estimates. Visit 'My Projects' for detailed analysis and recommendations."`;
    }

    const result = streamObject({
      model: openai('gpt-4o'),
      schema: resumeAnalysisSchema,
      system: `You are an expert resume analyzer and career coach specializing in tech roles. Analyze resumes against job postings to provide detailed, actionable feedback.

CRITICAL ANALYSIS FACTORS:
1. **Tech Stack Match** - Exact technologies matter (React Native vs React, Firebase vs Supabase, etc.)
2. **Seniority Level Alignment** - Match experience to:
   - Reporting structure (who they report to indicates level)
   - Scope of responsibility (team size, cross-functional work)
   - Years of experience stated
3. **Role-Specific Responsibilities** - What they'll actually be doing day-to-day
4. **Industry/Domain Expertise** - Sector-specific knowledge (sports tech, fintech, healthcare, etc.)
5. **Company Culture Signals** - Values, mission, work style mentioned
6. **Team Dynamics** - Collaboration style, team structure, stakeholder management
7. **Company Size & Stage** - Startup vs scale-up vs enterprise experience

WHAT TO ANALYZE:
1. Compatibility score (0-100) - Be honest and specific about scoring
2. **Competitive Positioning** - MUST include high-level summary:
   - "Meets X/Y critical requirements"
   - "Has A/B nice-to-have skills (list missing nice-to-haves but note they're not required)"
   - Example: "Strong candidate. Meets 8/10 critical requirements (React, TypeScript, Node.js, etc.). Has 3/5 nice-to-have skills (SQL time series, data analytics missing but desirable, not required)."
3. Specific strengths with concrete resume examples
4. Critical gaps (deal-breakers) vs nice-to-have improvements - CLEARLY DISTINGUISH THESE
5. Exact skill/technology matches with importance levels
6. Seniority level fit based on reporting structure and scope
7. Cultural and team fit indicators
8. ATS-friendly keyword recommendations
9. Resume formatting and presentation tips
10. Strategic positioning advice for THIS specific role
11. **Portfolio strength** - If project rankings are provided, factor portfolio quality into the final score

SCORING GUIDANCE:
- 90-100: Excellent match, highly competitive candidate
- 80-89: Strong match, good chance with minor improvements
- 70-79: Good potential, needs some positioning work
- 60-69: Fair match, has relevant experience but notable gaps
- 50-59: Moderate match, significant gaps to address
- <50: Poor match, may not be suitable for this role

**IMPORTANT: Only penalize missing REQUIRED skills. Nice-to-haves should never reduce the score.**
- Missing "nice to have" SQL time series? No penalty. Note: "SQL time series would be a bonus."
- Missing "preferred" experience with X? No penalty. Note: "X is preferred but not required."
- Missing "desirable" skill Y? No penalty. Note: "Y would strengthen the application."

**PORTFOLIO-ADJUSTED SCORING (if portfolio rankings provided):**
Start with the base resume-job fit score, then adjust:
- **Strong portfolio (avg 7-10/10, 3+ items):** Add 5-10 points. Portfolio demonstrates execution quality, not just claims.
- **Decent portfolio (avg 5-6/10):** No adjustment. Portfolio is unremarkable.
- **Weak portfolio (avg 1-4/10):** Subtract 3-5 points. Portfolio may indicate gaps or lack of depth.
- **Role relevance is critical:** Only apply adjustments if portfolio work is relevant to the target role
  * Engineer applying to eng role → engineering projects count
  * Designer applying to design role → design case studies count
  * PM applying to PM role → product work counts
  * Cross-discipline: A design portfolio doesn't boost an engineering application

**MANDATORY: In overallFeedback, you MUST explicitly explain the portfolio's impact on the score:**
Format: "Base resume-job fit: X/100. [Portfolio context: number of projects, average score, and which ones are strongest]. Portfolio boost: +Y points. Final score: Z/100."

Examples:
- Engineering: "Base resume-job fit: 78/100. Your portfolio of 5 projects (Hoop Almanac: 8.7/10, SculptQL: 7.9/10, Play Plan Craft: 7.5/10, Hone Your Craft: 8.0/10, Resume Pivot: 7.8/10, avg 7.98/10) demonstrates strong execution across multiple technical domains. Particularly impressive are your production systems (Hoop Almanac, SculptQL) and AI integration work. This portfolio validates your claimed skills and shows consistent high-quality delivery. Portfolio boost: +10 points. Final score: 88/100."
- Design: "Base fit: 58/100. Your 4 UX case studies (avg 7.2/10) show strong design thinking and shipped work. Portfolio boost: +8 points. Final score: 66/100."
- Product: "Base fit: 70/100. Your portfolio lacks measurable product outcomes (avg 4.5/10). Portfolio penalty: -3 points. Final score: 67/100."

If NO portfolio is provided, add: "Note: This score is based solely on resume content. Building relevant portfolio projects could further strengthen your application."

Be specific, honest, and constructive. Focus on actionable improvements that will genuinely help the candidate.`,
      prompt: `Analyze this resume against the job posting and provide a comprehensive, detailed analysis.${techContext}${sqlContext}${projectContext}

RESUME:
${resumeText}

JOB POSTING:
${jobDescription}

ANALYSIS INSTRUCTIONS:
1. **Extract Key Context from Job Posting:**
   - Who they report to (e.g., "Reports to VP of Engineering") - indicates seniority expectations
   - Team structure (e.g., "Join a team of 5 engineers") - shows scope and collaboration needs
   - Specific responsibilities and deliverables - what they'll actually do
   - Required vs preferred qualifications - distinguish must-haves from nice-to-haves
   - Company culture/values mentioned - assess cultural fit
   - Industry/domain context - sector-specific expertise needed

2. **Match Against Resume (and Portfolio if Provided):**
   - CRITICAL: Carefully search the ENTIRE resume text for skills/technologies before marking them as missing
   - Check for variations: "React Native" may appear in project descriptions, tech stacks, or bullets
   - Exact tech stack matches (be specific: React vs React Native, AWS vs GCP)
   - Seniority alignment (does reporting structure match candidate's level?)
   - Scope fit (has candidate worked with similar team sizes/cross-functional work?)
   - Industry experience (relevant domain expertise?)
   - Cultural signals (does candidate's presentation align with company values?)
   - VERIFY: If marking a skill as "MISSING", double-check the resume text to ensure it's truly absent
   - **CRITICAL DISTINCTION - Required vs Nice-to-Have:**
     * Look for keywords: "nice to have", "desirable", "bonus", "preferred", "plus", "a plus if", "ideal candidate"
     * **REQUIRED skills** (critical/high importance): These are deal-breakers. Missing these should reduce the score.
     * **NICE-TO-HAVE skills** (low importance): These are bonuses. Missing these should NOT reduce the score at all.
     * If the job says "Nice to have: SQL time series" or "Experience with X is desirable", mark importance as LOW
     * **DO NOT penalize missing nice-to-haves.** They can only ADD to the score if present, never subtract.
     * Example: If candidate has SQL but not "SQL time series" (nice to have), do not reduce their score. Instead note: "Having SQL time series would be a bonus but is not required."
   - **Portfolio consideration:** If project rankings are provided, evaluate:
     * Are the projects relevant to this specific role?
     * Do strong projects (7-10/10) validate skills claimed on the resume?
     * Do weak projects (1-4/10) contradict resume claims or reveal execution gaps?
     * Does the portfolio demonstrate growth, consistency, or depth?

3. **Provide Actionable Recommendations:**
   - Be honest about critical gaps vs areas for improvement
   - Give specific examples from the resume to cite
   - Suggest concrete ways to address gaps or better position themselves
   - Include ATS-friendly keywords they should add
   - Note any red flags or deal-breakers

4. **Career Pivot & Repositioning Advice (Analyze ENTIRE Career Trajectory):**
   - IMPORTANT: Analyze ALL titles and roles the candidate has held throughout their career, not just the current one
   - Look for transferable skills and experiences across their ENTIRE work history
   - If the candidate's current title differs from the target role (e.g., Software Engineer → Technical Product Manager), check if they held similar roles previously
   - Consider career transitions: Someone might have been a PM 3 years ago, became an engineer, and now wants to return to PM - highlight this relevant experience
   - Suggest how to reframe existing experience from ANY previous role to match the target role (e.g., "Led integration of Stripe payment API" could be positioned as "Product ownership of payment infrastructure")
   - Recommend specific bullet points to add, remove, or rewrite for better role alignment, drawing from their complete work history
   - Identify projects or experiences from ANY point in their career that demonstrate relevant competencies even if their current title doesn't match
   - Suggest how to adjust the profile statement to signal interest and capability in the target role, leveraging their full career arc
   - Note relevant certifications, side projects, or skills acquired across different roles that support the career transition

5. **Project Recommendations (Especially for Engineering/Technical Roles):**
   - Extract what the company is building from the job description (their product, tech stack, domain, mission)
   - Review the candidate's existing projects and identify gaps in relevant experience
   - Suggest 2-4 specific, concrete projects the candidate should build to strengthen their candidacy
   - Each project should:
     * Directly relate to the company's tech stack, domain, or product (e.g., if company builds supply chain software, suggest a supply chain project)
     * Be achievable in 1-4 weeks (weekend projects to month-long builds)
     * Demonstrate skills missing from the resume or emphasize critical skills
     * Be portfolio-worthy and resume-addable
     * Show domain knowledge relevant to the company's industry
   - Examples:
     * Company building AI-first ERP → Suggest building a workflow automation tool with LLMs
     * Company in fintech → Suggest building a personal finance tracker with Plaid integration
     * Company using Next.js + Firebase → Suggest a project using that exact stack
     * Company in supply chain → Suggest building a shipment tracking dashboard
   - For each project, specify: title, description, skills demonstrated, impact on candidacy, and estimated time to build

Provide a thorough, honest analysis with specific examples from both the resume and job posting. Help candidates understand not just IF they're a fit, but HOW to position themselves better and what to BUILD to become more competitive.

**CRITICAL ACCURACY REQUIREMENT:**
Before marking ANY skill, technology, or keyword as "MISSING" or "not present":
1. Use Ctrl+F / search functionality mentally to scan the ENTIRE resume text
2. Check for the skill in: project descriptions, tech stack lists, job titles, bullet points, and summary sections
3. Look for variations (e.g., "React Native" = "RN", "TypeScript" = "TS")
4. Only mark as MISSING if you are 100% certain it does not appear anywhere in the resume
5. If unsure, mark as PRESENT and note it could be emphasized more

**FOR JOB TITLES / ROLE KEYWORDS (e.g., "Technical Product Manager", "DevOps Engineer"):**
- Do NOT mark these as "MISSING" just because the exact title isn't listed
- Instead, check if the candidate has DONE the work associated with that role
- Example: "Technical Product Management" - look for evidence of: roadmap planning, feature prioritization, stakeholder management, product decisions, technical leadership
- If they've done the work but don't have the title, mark as PRESENT but suggest emphasizing it more
- Only mark role keywords as MISSING if there's no evidence of relevant experience

DO NOT hallucinate missing skills that are actually present in the resume. Accuracy is critical for user trust.`,
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
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
}
