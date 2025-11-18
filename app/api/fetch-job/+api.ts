import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * API endpoint to fetch job posting content from a URL using AI
 * This uses AI to extract job information from the URL
 */

export async function POST(request: Request) {
  try {
    const { jobUrl } = await request.json();

    if (!jobUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing jobUrl parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL
    try {
      new URL(jobUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use Jina AI Reader to fetch and render the page (handles JavaScript)
    // This is a free service that renders JS and returns clean text
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

    // Use AI to extract job posting information from the rendered page text
    const result = await generateText({
      model: openai('gpt-4o'),
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

    return new Response(
      JSON.stringify(jobData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching job posting:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch job posting. Please check the URL and try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
