import mammoth from 'mammoth';

/**
 * API endpoint to extract text from resume files (DOCX, TXT)
 */

export async function POST(request: Request) {
  try {
    const { fileData, fileName, mimeType } = await request.json();

    if (!fileData) {
      return new Response(
        JSON.stringify({ error: 'Missing fileData parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');

    let extractedText = '';

    // Parse DOCX files with mammoth
     if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.length < 50) {
      throw new Error('Could not extract meaningful text from the file');
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to extract text from file. Please try a different format or file.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
