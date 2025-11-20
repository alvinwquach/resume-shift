/**
 * Local development server for API routes
 * This simulates the Vercel serverless function environment locally
 */
import 'dotenv/config'; // Load environment variables from .env file
import http from 'http';
import url from 'url';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import extractResumeHandler from './api/extractResume';
import analyzeStreamHandler from './api/analyzeStream';
import fetchJobHandler from './api/fetchJob';
import sendEmailHandler from './api/sendEmail';
import rankProjectsHandler from './api/rankProjects';

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse body for POST requests
  let body = '';
  if (req.method === 'POST') {
    for await (const chunk of req) {
      body += chunk.toString();
    }
  }

  // Create Vercel-compatible request object
  const vercelReq = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: body ? JSON.parse(body) : {},
    query: parsedUrl.query,
  } as VercelRequest;

  // Create Vercel-compatible response object
  const vercelRes = {
    status: (code: number) => {
      res.statusCode = code;
      return vercelRes;
    },
    json: (data: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    },
    end: (data?: string) => {
      res.end(data);
    },
    setHeader: (key: string, value: string | number | string[]) => {
      res.setHeader(key, value);
    },
    write: (chunk: any) => {
      res.write(chunk);
    },
  } as any as VercelResponse;

  // Route to appropriate handler
  try {
    if (pathname === '/api/extractResume') {
      console.log('[dev-server] Handling /api/extractResume');
      await extractResumeHandler(vercelReq, vercelRes);
    } else if (pathname === '/api/analyzeStream') {
      console.log('[dev-server] Handling /api/analyzeStream');
      await analyzeStreamHandler(vercelReq, vercelRes);
    } else if (pathname === '/api/fetchJob') {
      console.log('[dev-server] Handling /api/fetchJob');
      await fetchJobHandler(vercelReq, vercelRes);
    } else if (pathname === '/api/sendEmail') {
      console.log('[dev-server] Handling /api/sendEmail');
      await sendEmailHandler(vercelReq, vercelRes);
    } else if (pathname === '/api/rankProjects') {
      console.log('[dev-server] Handling /api/rankProjects');
      await rankProjectsHandler(vercelReq, vercelRes);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('[dev-server] Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev API server running at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/extractResume`);
  console.log(`  POST http://localhost:${PORT}/api/analyzeStream`);
  console.log(`  POST http://localhost:${PORT}/api/fetchJob`);
  console.log(`  POST http://localhost:${PORT}/api/sendEmail`);
  console.log(`  POST http://localhost:${PORT}/api/rankProjects\n`);
});
