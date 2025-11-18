/**
 * API Configuration
 * Uses Vercel serverless functions by default.
 * Can optionally use Firebase Cloud Functions by setting EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL.
 */
const FUNCTIONS_BASE_URL = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL || '';

/**
 * Get the full URL for an API endpoint
 * By default, uses Vercel serverless functions at /api/*
 * If EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL is set, uses Firebase Cloud Functions instead
 */
function getFunctionUrl(functionName: string): string {
  if (FUNCTIONS_BASE_URL) {
    // Use Firebase Cloud Functions if URL is configured
    console.log(`Using Firebase Cloud Functions for ${functionName}`);
    return `${FUNCTIONS_BASE_URL}/${functionName}`;
  }

  // Default to Vercel serverless functions
  return `/api/${functionName}`;
}

/**
 * API endpoints for serverless functions
 */
export const FUNCTIONS_ENDPOINTS = {
  EXTRACT_RESUME: getFunctionUrl('extractResume'),
  ANALYZE_STREAM: getFunctionUrl('analyzeStream'),
  SEND_EMAIL: getFunctionUrl('sendEmail'),
  FETCH_JOB: getFunctionUrl('fetchJob'),
} as const;

export default FUNCTIONS_ENDPOINTS;
