const FUNCTIONS_BASE_URL = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL || '';

if (!FUNCTIONS_BASE_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    'Warning: EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL is not set. ' +
    'API calls will fail in production. Please set this environment variable.'
  );
}

/**
 * Get the full URL for a Cloud Function
 */
function getFunctionUrl(functionName: string): string {
  if (!FUNCTIONS_BASE_URL) {
    // Fallback to local API routes for development
    console.warn(
      `Using local API fallback for ${functionName}. ` +
      'Set EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL to use Cloud Functions.'
    );
    return `/api/${functionName}`;
  }
  return `${FUNCTIONS_BASE_URL}/${functionName}`;
}

/**
 * Firebase Cloud Functions endpoints
 */
export const FUNCTIONS_ENDPOINTS = {
  EXTRACT_RESUME: getFunctionUrl('extractResume'),
  ANALYZE_STREAM: getFunctionUrl('analyzeStream'),
  SEND_EMAIL: getFunctionUrl('sendEmail'),
  FETCH_JOB: getFunctionUrl('fetchJob'),
} as const;

export default FUNCTIONS_ENDPOINTS;
