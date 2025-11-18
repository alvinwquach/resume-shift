import type { VercelRequest, VercelResponse } from '@vercel/node';
import mammoth from 'mammoth';

// Configure for longer timeout
export const config = {
  maxDuration: 60, // 60 seconds
};

/**
 * Vercel Serverless Function to extract text from resume files
 * Supports two modes:
 * 1. Download from Firebase Storage URL (recommended for larger files)
 * 2. Direct base64 upload (for files < 2MB)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  console.log('[extractResume] Request received');

  try {
    const { fileUrl, fileData, fileName, mimeType } = req.body;

    console.log('[extractResume] Mode:', fileUrl ? 'URL download' : 'Base64 upload');
    console.log('[extractResume] Params:', { fileName, mimeType, hasFileUrl: !!fileUrl, hasFileData: !!fileData });

    if (!fileName) {
      return res.status(400).json({ error: 'Missing fileName parameter' });
    }

    let buffer: Buffer;

    // Mode 1: Download from Firebase Storage URL (recommended)
    if (fileUrl) {
      console.log('[extractResume] Downloading from URL...');

      try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);

        console.log('[extractResume] Downloaded file:', buffer.length, 'bytes');
      } catch (downloadError) {
        console.error('[extractResume] Download error:', downloadError);
        return res.status(500).json({
          error: 'Failed to download file from storage',
          details: downloadError instanceof Error ? downloadError.message : 'Unknown error'
        });
      }
    }
    // Mode 2: Direct base64 upload (legacy, for smaller files)
    else if (fileData) {
      console.log('[extractResume] Processing base64 data...');

      // Check base64 size limit
      const estimatedSize = (fileData.length * 3) / 4;
      console.log('[extractResume] Estimated file size:', Math.round(estimatedSize / 1024), 'KB');

      if (estimatedSize > 4.5 * 1024 * 1024) {
        return res.status(413).json({
          error: 'File too large for direct upload. Please use Firebase Storage URL instead.'
        });
      }

      try {
        buffer = Buffer.from(fileData, 'base64');
        console.log('[extractResume] Buffer created:', buffer.length, 'bytes');
      } catch (bufferError) {
        console.error('[extractResume] Buffer error:', bufferError);
        return res.status(400).json({ error: 'Invalid file data format' });
      }
    } else {
      return res.status(400).json({
        error: 'Missing file source. Provide either fileUrl or fileData.'
      });
    }

    let extractedText = '';

    // Parse DOCX files
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.toLowerCase().endsWith('.docx')
    ) {
      console.log('[extractResume] Parsing DOCX with mammoth...');

      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;

        console.log('[extractResume] Extracted text length:', extractedText.length);

        if (result.messages?.length > 0) {
          console.log('[extractResume] Mammoth messages:', result.messages);
        }
      } catch (mammothError) {
        console.error('[extractResume] Mammoth error:', mammothError);
        return res.status(500).json({
          error: 'Failed to parse DOCX file',
          details: mammothError instanceof Error ? mammothError.message : 'Unknown error'
        });
      }
    }
    // Parse plain text files
    else if (mimeType === 'text/plain' || fileName.toLowerCase().endsWith('.txt')) {
      console.log('[extractResume] Processing text file...');
      extractedText = buffer.toString('utf-8');
    }
    // Unsupported format
    else {
      return res.status(400).json({
        error: `Unsupported file type: ${mimeType || 'unknown'}. Please upload DOCX or TXT.`
      });
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'File appears to be empty' });
    }

    if (extractedText.length < 50) {
      console.warn('[extractResume] Very short text:', extractedText.length, 'chars');
    }

    const duration = Date.now() - startTime;
    console.log('[extractResume] Success! Duration:', duration, 'ms');

    return res.status(200).json({ text: extractedText });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[extractResume] Error after', duration, 'ms:', error);

    return res.status(500).json({
      error: 'Failed to extract text from file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
