import { onRequest } from 'firebase-functions/v2/https';
import { Resend } from 'resend';

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

/**
 * Cloud Function to send resume analysis via email
 */
export const sendEmail = onRequest({ cors: true }, async (req, res) => {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

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
      analysisResult
    } = req.body;

    if (!email || !analysisResult) {
      res.status(400).json({ error: 'Missing required fields: email and analysisResult' });
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const resend = new Resend(resendApiKey);

    const htmlContent = generateEmailHTML({
      jobTitle,
      jobCompany,
      resumeFileName,
      analysisResult
    });

    const { data, error } = await resend.emails.send({
      from: 'Resume Optimizer <onboarding@resend.dev>',
      to: [email],
      subject: `Resume Analysis: ${jobTitle || 'Job Position'}${jobCompany ? ` at ${jobCompany}` : ''}`,
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
});
