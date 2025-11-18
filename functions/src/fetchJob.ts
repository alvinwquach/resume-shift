import { onRequest } from 'firebase-functions/v2/https';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * Cloud Function to fetch job posting content from a URL using AI
 */
export const fetchJob = onRequest(
  {
    timeoutSeconds: 60,
    memory: '512MiB',
    cors: true
  },
  async (req, res) => {
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
      const { jobUrl } = req.body;

      if (!jobUrl) {
        res.status(400).json({ error: 'Missing jobUrl parameter' });
        return;
      }

      // Validate URL
      try {
        new URL(jobUrl);
      } catch {
        res.status(400).json({ error: 'Invalid URL format' });
        return;
      }

      // Use Jina AI Reader to fetch and render the page (handles JavaScript)
      const jinaUrl = `https://r.jina.ai/${jobUrl}`;
      const response = await fetch(jinaUrl, {
        headers: {
          'Accept': 'application/json',
          'X-Return-Format': 'text'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
      }

      const pageText = await response.text();

      // Use AI to extract job posting information
      const result = await generateText({
        model: openai(process.env.OPENAI_API_KEY || ''),
        prompt: `Extract job posting information from this page content:

${pageText.substring(0, 20000)}

Please extract:
1. Job title
2. Company name
3. Complete job description including responsibilities, requirements, and qualifications

Return the information in this exact JSON format:
{
  "title": "<job title>",
  "company": "<company name>",
  "description": "<full job description text>"
}

Return ONLY valid JSON, no additional text.`,
      });

      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract job information');
      }

      const jobData = JSON.parse(jsonMatch[0]);

      res.status(200).json(jobData);
    } catch (error) {
      console.error('Error fetching job posting:', error);
      res.status(500).json({ error: 'Failed to fetch job posting. Please check the URL and try again.' });
    }
  }
);
