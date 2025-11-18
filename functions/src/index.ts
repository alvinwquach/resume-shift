/**
 * Firebase Cloud Functions for Resume Shift
 *
 * This file exports all Cloud Functions for the Resume Shift application.
 * These functions handle:
 * - Resume text extraction (DOCX)
 * - AI-powered resume analysis with streaming
 * - Email delivery of analysis results
 * - Job posting URL fetching and parsing
 */

// Export all cloud functions
export { extractResume } from './extractResume';
export { analyzeStream } from './analyzeStream';
export { sendEmail } from './sendEmail';
export { fetchJob } from './fetchJob';
