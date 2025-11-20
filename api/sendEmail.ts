import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Lazy initialization to avoid errors when env var is missing at import time
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface EmailParams {
  jobTitle?: string;
  jobCompany?: string;
  resumeFileName?: string;
  analysisResult: {
    compatibilityScore?: number;
    competitivePositioning?: string;
    strengths?: string[];
    weaknesses?: string[];
    skillMatches?: Array<{
      skill: string;
      present: boolean;
      importance: 'critical' | 'high' | 'medium' | 'low';
    }>;
    experienceGaps?: Array<{
      requirement: string;
      gap: string;
      suggestion: string;
    }>;
    keywordRecommendations?: Array<{
      keyword: string;
      reason: string;
      currentlyPresent: boolean;
    }>;
    formattingTips?: string[];
    overallFeedback?: string;
  };
}

interface ProjectRankingEmailParams {
  projectRankings: Array<{
    title: string;
    description: string;
    rankingResult?: {
      projectName: string;
      projectType: string;
      overallSummary: string;
      bestFitRoles: string[];
      roleRankings: Array<{
        role: string;
        marketabilityScore: number;
        recommendation: 'keep' | 'enhance' | 'drop';
        fitSummary: string;
        strengths: string[];
        weaknesses: string[];
      }>;
    };
  }>;
  targetRole?: string;
  candidateLevel?: string;
}

/**
 * Vercel Serverless Function to send resume analysis via email
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      email,
      jobTitle,
      jobCompany,
      resumeFileName,
      analysisResult,
      projectRankings,
      targetRole,
      candidateLevel
    } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Missing required field: email'
      });
      return;
    }

    let htmlContent: string;
    let subject: string;

    // Determine email type based on payload
    if (projectRankings && Array.isArray(projectRankings)) {
      // Project ranking email
      htmlContent = generateProjectRankingEmailHTML({
        projectRankings,
        targetRole,
        candidateLevel
      });
      subject = `Project Rankings Analysis - ${projectRankings.length} ${projectRankings.length === 1 ? 'Project' : 'Projects'}`;
    } else if (analysisResult) {
      // Resume analysis email
      htmlContent = generateEmailHTML({
        jobTitle,
        jobCompany,
        resumeFileName,
        analysisResult
      });
      subject = `Resume Analysis: ${jobTitle || 'Job Position'}${jobCompany ? ` at ${jobCompany}` : ''}`;
    } else {
      res.status(400).json({
        error: 'Missing required fields: either analysisResult or projectRankings'
      });
      return;
    }

    const resendClient = getResendClient();

    // Use Resend test domain for development/testing
    // In test mode, use onboarding@resend.dev as sender (no domain verification needed)
    // But still send to the actual user's email address
    const isTestMode = process.env.NODE_ENV !== 'production' || process.env.RESEND_TEST_MODE === 'true';
    const fromEmail = isTestMode ? 'Acme <onboarding@resend.dev>' : 'Resume Pivot <noreply@resumepivot.xyz>';

    console.log(`[sendEmail] Mode: ${isTestMode ? 'TEST' : 'PRODUCTION'}`);
    console.log(`[sendEmail] From: ${fromEmail}`);
    console.log(`[sendEmail] To: ${email}`);

    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: [email],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

function generateEmailHTML(params: EmailParams): string {
  const { jobTitle, jobCompany, resumeFileName, analysisResult } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Analysis Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    h1 {
      color: #1f2937;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .job-info {
      color: #6b7280;
      font-size: 14px;
    }
    .score-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 6px;
      margin: 12px 0;
      text-align: center;
    }
    .score {
      font-size: 36px;
      font-weight: bold;
      margin: 6px 0;
    }
    .score-label {
      font-size: 15px;
      opacity: 0.9;
    }
    .section {
      margin: 16px 0;
    }
    .section-title {
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    .icon {
      margin-right: 8px;
    }
    .list-item {
      background-color: #f9fafb;
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 4px;
      border-left: 3px solid #3b82f6;
      font-size: 14px;
      line-height: 1.4;
    }
    .strength {
      border-left-color: #22c55e;
    }
    .weakness {
      border-left-color: #ef4444;
    }
    .skill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      margin: 3px 0;
      background-color: #f9fafb;
      border-radius: 4px;
      font-size: 14px;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-critical { background-color: #fecaca; color: #991b1b; }
    .badge-high { background-color: #fed7aa; color: #9a3412; }
    .badge-medium { background-color: #fef08a; color: #854d0e; }
    .badge-low { background-color: #bbf7d0; color: #166534; }
    .present { color: #22c55e; }
    .missing { color: #ef4444; }
    .gap-item {
      background-color: #fef3c7;
      padding: 10px 12px;
      margin: 4px 0;
      border-radius: 4px;
      border-left: 3px solid #f59e0b;
      font-size: 14px;
    }
    .gap-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 4px;
      font-size: 14px;
    }
    .gap-text {
      font-size: 13px;
      color: #78350f;
      margin: 3px 0;
      line-height: 1.4;
    }
    .keyword-item {
      background-color: #f5f3ff;
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 4px;
      border-left: 3px solid #8b5cf6;
      font-size: 14px;
    }
    .keyword-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }
    .keyword-title {
      font-weight: 600;
      color: #5b21b6;
      font-size: 14px;
    }
    .keyword-status {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .status-present { background-color: #bbf7d0; color: #166534; }
    .status-missing { background-color: #fecaca; color: #991b1b; }
    .feedback-box {
      background-color: #ede9fe;
      padding: 12px;
      border-radius: 6px;
      margin: 8px 0;
      border-left: 4px solid #a78bfa;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Resume Analysis Results</h1>
      ${jobTitle || jobCompany ? `
        <div class="job-info">
          ${jobTitle ? `<strong>${jobTitle}</strong>` : ''}
          ${jobTitle && jobCompany ? ' at ' : ''}
          ${jobCompany || ''}
        </div>
      ` : ''}
      ${resumeFileName ? `<div class="job-info">Resume: ${resumeFileName}</div>` : ''}
    </div>

    ${analysisResult.compatibilityScore !== undefined ? `
      <div class="score-section">
        <div class="score-label">Compatibility Score</div>
        <div class="score">${analysisResult.compatibilityScore}%</div>
        <div class="score-label">${getScoreLabel(analysisResult.compatibilityScore)}</div>
      </div>
    ` : ''}

    ${analysisResult.competitivePositioning ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">🏆</span> Competitive Position
        </div>
        <div class="list-item">
          ${analysisResult.competitivePositioning}
        </div>
      </div>
    ` : ''}

    ${analysisResult.strengths && analysisResult.strengths.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">✅</span> Strengths
        </div>
        ${analysisResult.strengths.map(strength => `
          <div class="list-item strength">${strength}</div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.weaknesses && analysisResult.weaknesses.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">⚠️</span> Areas to Improve
        </div>
        ${analysisResult.weaknesses.map(weakness => `
          <div class="list-item weakness">${weakness}</div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.skillMatches && analysisResult.skillMatches.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">💻</span> Skill Analysis
        </div>
        ${analysisResult.skillMatches.map(skill => `
          <div class="skill-item">
            <span class="${skill.present ? 'present' : 'missing'}">
              ${skill.present ? '✓' : '✗'} ${skill.skill}
            </span>
            <span class="badge badge-${skill.importance}">${skill.importance}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.experienceGaps && analysisResult.experienceGaps.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">💼</span> Experience Gaps
        </div>
        ${analysisResult.experienceGaps.map(gap => `
          <div class="gap-item">
            <div class="gap-title">${gap.requirement}</div>
            <div class="gap-text"><strong>Gap:</strong> ${gap.gap}</div>
            <div class="gap-text"><strong>💡 Suggestion:</strong> ${gap.suggestion}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.keywordRecommendations && analysisResult.keywordRecommendations.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">🏷️</span> Keyword Recommendations
        </div>
        ${analysisResult.keywordRecommendations.map(keyword => `
          <div class="keyword-item">
            <div class="keyword-header">
              <span class="keyword-title">${keyword.keyword}</span>
              <span class="keyword-status ${keyword.currentlyPresent ? 'status-present' : 'status-missing'}">
                ${keyword.currentlyPresent ? 'PRESENT' : 'MISSING'}
              </span>
            </div>
            <div style="font-size: 14px; color: #6b21a8;">${keyword.reason}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.formattingTips && analysisResult.formattingTips.length > 0 ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">📄</span> Formatting Tips
        </div>
        ${analysisResult.formattingTips.map(tip => `
          <div class="list-item">${tip}</div>
        `).join('')}
      </div>
    ` : ''}

    ${analysisResult.overallFeedback ? `
      <div class="section">
        <div class="section-title">
          <span class="icon">💬</span> Overall Feedback
        </div>
        <div class="feedback-box">
          ${analysisResult.overallFeedback}
        </div>
      </div>
    ` : ''}

    <div class="footer">
      <p>Generated by Resume Optimizer - AI-powered job fit analysis</p>
      <p style="font-size: 12px; margin-top: 10px;">
        This analysis is AI-generated and should be used as guidance alongside your own professional judgment.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Strong Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Fair Match";
  if (score >= 50) return "Moderate Match";
  return "Needs Improvement";
}

function generateProjectRankingEmailHTML(params: ProjectRankingEmailParams): string {
  const { projectRankings, targetRole, candidateLevel } = params;

  // Calculate average scores for portfolio summary
  const projectScores = projectRankings.map(p => {
    const avgScore = p.rankingResult?.roleRankings
      ? p.rankingResult.roleRankings.reduce((sum, r) => sum + r.marketabilityScore, 0) / p.rankingResult.roleRankings.length
      : 0;
    return { project: p, avgScore };
  });

  const strongProjects = projectScores.filter(p => p.avgScore >= 7);
  const decentProjects = projectScores.filter(p => p.avgScore >= 5 && p.avgScore < 7);
  const weakProjects = projectScores.filter(p => p.avgScore < 5);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Rankings Analysis</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    h1 {
      color: #1f2937;
      margin: 0 0 10px 0;
      font-size: 26px;
    }
    h2 {
      color: #1f2937;
      font-size: 20px;
      margin: 24px 0 12px 0;
    }
    .summary-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .summary-stat {
      display: inline-block;
      margin-right: 24px;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 13px;
      opacity: 0.9;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
    }
    .project-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .project-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
    .score-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
    }
    .score-high { background-color: #d1fae5; color: #065f46; }
    .score-medium { background-color: #fef3c7; color: #92400e; }
    .score-low { background-color: #fee2e2; color: #991b1b; }
    .recommendation-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 8px;
    }
    .rec-keep { background-color: #d1fae5; color: #065f46; }
    .rec-enhance { background-color: #fef3c7; color: #92400e; }
    .rec-drop { background-color: #fee2e2; color: #991b1b; }
    .role-section {
      margin: 12px 0;
      padding: 12px;
      background-color: white;
      border-left: 3px solid #3b82f6;
      border-radius: 4px;
    }
    .role-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 15px;
      margin-bottom: 6px;
    }
    .fit-summary {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 8px;
      font-style: italic;
    }
    .strength-list, .weakness-list {
      margin: 8px 0;
      padding-left: 20px;
    }
    .strength-list li {
      color: #059669;
      margin: 4px 0;
      font-size: 14px;
    }
    .weakness-list li {
      color: #dc2626;
      margin: 4px 0;
      font-size: 14px;
    }
    .portfolio-advice {
      background-color: #ede9fe;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #a78bfa;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Project Rankings Analysis</h1>
      <p style="color: #6b7280; margin: 8px 0 0 0;">
        ${projectRankings.length} ${projectRankings.length === 1 ? 'Project' : 'Projects'} Analyzed
        ${targetRole ? `• Target: ${targetRole}` : ''}
        ${candidateLevel ? `• Level: ${candidateLevel}` : ''}
      </p>
    </div>

    <div class="summary-box">
      <div class="summary-stat">
        <div class="stat-label">Strong Projects</div>
        <div class="stat-value">✅ ${strongProjects.length}</div>
      </div>
      <div class="summary-stat">
        <div class="stat-label">Need Enhancement</div>
        <div class="stat-value">⚡ ${decentProjects.length}</div>
      </div>
      <div class="summary-stat">
        <div class="stat-label">Consider Dropping</div>
        <div class="stat-value">❌ ${weakProjects.length}</div>
      </div>
    </div>

    ${projectRankings.length > 4 ? `
      <div class="portfolio-advice">
        <strong>⚠️ Portfolio Size Warning:</strong> You have ${projectRankings.length} projects.
        Resumes should highlight 2-4 strongest projects (ideally 3). Focus on quality over quantity.
      </div>
    ` : ''}

    ${projectRankings.map((project, index) => {
      const avgScore = projectScores[index].avgScore;
      const scoreClass = avgScore >= 7 ? 'score-high' : avgScore >= 5 ? 'score-medium' : 'score-low';

      return `
        <div class="project-card">
          <div class="project-header">
            <div class="project-title">${project.title}</div>
            <div class="score-badge ${scoreClass}">${avgScore.toFixed(1)}/10</div>
          </div>

          ${project.rankingResult ? `
            <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
              <strong>Type:</strong> ${project.rankingResult.projectType}
            </p>

            ${project.rankingResult.bestFitRoles && project.rankingResult.bestFitRoles.length > 0 ? `
              <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
                <strong>Best Fit For:</strong> ${project.rankingResult.bestFitRoles.join(', ')}
              </p>
            ` : ''}

            <p style="color: #374151; font-size: 14px; margin: 12px 0; line-height: 1.6;">
              ${project.rankingResult.overallSummary}
            </p>

            <h3 style="font-size: 16px; margin: 16px 0 10px 0; color: #1f2937;">Role-Specific Analysis</h3>

            ${project.rankingResult.roleRankings.map(role => `
              <div class="role-section">
                <div class="role-name">
                  ${role.role}
                  <span class="recommendation-badge rec-${role.recommendation}">${role.recommendation}</span>
                  <span style="color: #6b7280; font-weight: normal; font-size: 14px;">${role.marketabilityScore}/10</span>
                </div>
                <div class="fit-summary">${role.fitSummary}</div>

                ${role.strengths && role.strengths.length > 0 ? `
                  <div style="margin-top: 8px;">
                    <strong style="font-size: 13px; color: #059669;">Strengths:</strong>
                    <ul class="strength-list">
                      ${role.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${role.weaknesses && role.weaknesses.length > 0 ? `
                  <div style="margin-top: 8px;">
                    <strong style="font-size: 13px; color: #dc2626;">Gaps:</strong>
                    <ul class="weakness-list">
                      ${role.weaknesses.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          ` : '<p style="color: #dc2626;">Analysis failed for this project</p>'}
        </div>
      `;
    }).join('')}

    <div class="portfolio-advice">
      <h3 style="margin: 0 0 12px 0; color: #1f2937;">💡 Portfolio Recommendations</h3>
      ${strongProjects.length >= 4 ? `
        <p>You have ${strongProjects.length} strong projects. Use your top 3-4 on your resume:</p>
        <ol style="margin: 8px 0; padding-left: 24px;">
          ${strongProjects.slice(0, 4).map(p => `<li>${p.project.title} (${p.avgScore.toFixed(1)}/10)</li>`).join('')}
        </ol>
        <p style="margin-top: 8px; font-size: 14px;">Select the most relevant for each job application.</p>
      ` : strongProjects.length >= 2 ? `
        <p>You have ${strongProjects.length} strong project${strongProjects.length > 1 ? 's' : ''}. ${decentProjects.length > 0 ? `Consider enhancing ${Math.min(4 - strongProjects.length, decentProjects.length)} "decent" project(s) to build a stronger portfolio of 3-4 projects.` : 'This is a solid portfolio foundation.'}</p>
      ` : strongProjects.length + decentProjects.length >= 2 ? `
        <p>Enhance ${Math.min(4 - strongProjects.length, decentProjects.length)} "decent" project(s) following the suggestions above, then use your top 3-4.</p>
      ` : `
        <p>You need stronger projects. Consider building 2-3 substantial projects that demonstrate real technical depth and impact.</p>
      `}
    </div>

    <div class="footer">
      <p>Generated by Resume Pivot - AI-powered project analysis</p>
      <p style="font-size: 12px; margin-top: 10px;">
        This analysis is AI-generated and should be used as guidance alongside your own professional judgment.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
