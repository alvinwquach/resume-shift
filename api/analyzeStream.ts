import type { VercelRequest, VercelResponse } from '@vercel/node';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Define the schema for structured streaming
const resumeAnalysisSchema = z.object({
  compatibilityScore: z.number().min(0).max(100).describe('Overall compatibility score from 0-100'),
  competitivePositioning: z.string().describe('How competitive this candidate is for the role'),
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
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      res.status(400).json({
        error: 'Missing required fields: resumeText and jobDescription'
      });
      return;
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
2. Specific strengths with concrete resume examples
3. Critical gaps (deal-breakers) vs nice-to-have improvements
4. Exact skill/technology matches with importance levels
5. Seniority level fit based on reporting structure and scope
6. Cultural and team fit indicators
7. ATS-friendly keyword recommendations
8. Resume formatting and presentation tips
9. Strategic positioning advice for THIS specific role

SCORING GUIDANCE:
- 90-100: Excellent match, highly competitive candidate
- 80-89: Strong match, good chance with minor improvements
- 70-79: Good potential, needs some positioning work
- 60-69: Fair match, has relevant experience but notable gaps
- 50-59: Moderate match, significant gaps to address
- <50: Poor match, may not be suitable for this role

Be specific, honest, and constructive. Focus on actionable improvements that will genuinely help the candidate.`,
      prompt: `Analyze this resume against the job posting and provide a comprehensive, detailed analysis.${techContext}${sqlContext}

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

2. **Match Against Resume:**
   - CRITICAL: Carefully search the ENTIRE resume text for skills/technologies before marking them as missing
   - Check for variations: "React Native" may appear in project descriptions, tech stacks, or bullets
   - Exact tech stack matches (be specific: React vs React Native, AWS vs GCP)
   - Seniority alignment (does reporting structure match candidate's level?)
   - Scope fit (has candidate worked with similar team sizes/cross-functional work?)
   - Industry experience (relevant domain expertise?)
   - Cultural signals (does candidate's presentation align with company values?)
   - VERIFY: If marking a skill as "MISSING", double-check the resume text to ensure it's truly absent

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
