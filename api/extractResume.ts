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

  const startTime = Date.now();
  console.log('[extractResume] Request received');

  try {
    const { fileUrl, fileData, fileName, mimeType } = req.body;

    console.log('[extractResume] Mode:', fileUrl ? 'URL download' : 'Base64 upload');
    console.log('[extractResume] Params:', { fileName, mimeType, hasFileUrl: !!fileUrl, hasFileData: !!fileData });

    if (!fileName) {
      res.status(400).json({ error: 'Missing fileName parameter' });
      return;
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
        res.status(500).json({
          error: 'Failed to download file from storage',
          details: downloadError instanceof Error ? downloadError.message : 'Unknown error'
        });
        return;
      }
    }
    // Mode 2: Direct base64 upload (legacy, for smaller files)
    else if (fileData) {
      console.log('[extractResume] Processing base64 data...');

      // Check base64 size limit
      const estimatedSize = (fileData.length * 3) / 4;
      console.log('[extractResume] Estimated file size:', Math.round(estimatedSize / 1024), 'KB');

      if (estimatedSize > 4.5 * 1024 * 1024) {
        res.status(413).json({
          error: 'File too large for direct upload. Please use Firebase Storage URL instead.'
        });
        return;
      }

      try {
        buffer = Buffer.from(fileData, 'base64');
        console.log('[extractResume] Buffer created:', buffer.length, 'bytes');
      } catch (bufferError) {
        console.error('[extractResume] Buffer error:', bufferError);
        res.status(400).json({ error: 'Invalid file data format' });
        return;
      }
    } else {
      console.error('[extractResume] Missing file source. Received:', {
        hasFileUrl: !!fileUrl,
        hasFileData: !!fileData,
        fileUrlValue: fileUrl,
        fileName,
        mimeType
      });
      res.status(400).json({
        error: 'Missing file source. Provide either fileUrl or fileData.',
        details: 'The file upload may have failed. Please try again.'
      });
      return;
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
        res.status(500).json({
          error: 'Failed to parse DOCX file',
          details: mammothError instanceof Error ? mammothError.message : 'Unknown error'
        });
        return;
      }
    }
    // Parse plain text files
    else if (mimeType === 'text/plain' || fileName.toLowerCase().endsWith('.txt')) {
      console.log('[extractResume] Processing text file...');
      extractedText = buffer.toString('utf-8');
    }
    // Unsupported format
    else {
      res.status(400).json({
        error: `Unsupported file type: ${mimeType || 'unknown'}. Please upload DOCX or TXT.`
      });
      return;
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      res.status(400).json({ error: 'File appears to be empty' });
      return;
    }

    if (extractedText.length < 50) {
      console.warn('[extractResume] Very short text:', extractedText.length, 'chars');
    }

    const duration = Date.now() - startTime;
    console.log('[extractResume] Success! Duration:', duration, 'ms');

    res.status(200).json({ text: extractedText });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[extractResume] Error after', duration, 'ms:', error);

    res.status(500).json({
      error: 'Failed to extract text from file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}