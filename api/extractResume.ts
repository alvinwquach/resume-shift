import type { VercelRequest, VercelResponse } from '@vercel/node';
import mammoth from 'mammoth';

/**
 * Vercel Serverless Function to extract text from resume files (DOCX)
 * This function runs in Node.js runtime with full Buffer and mammoth support
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileData, fileName, mimeType } = req.body;

    if (!fileData) {
      res.status(400).json({ error: 'Missing fileData parameter' });
      return;
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');

    let extractedText = '';

    // Parse DOCX files with mammoth
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.length < 50) {
      throw new Error('Could not extract meaningful text from the file');
    }

    res.status(200).json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    res.status(500).json({
      error: 'Failed to extract text from file. Please try a different format or file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
