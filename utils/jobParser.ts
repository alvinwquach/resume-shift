/**
 * Utility functions for parsing job descriptions and extracting metadata
 */

export interface ParsedJobInfo {
  jobTitle: string;
  company: string;
  jobDescription: string;
}

/**
 * Parse job description text to extract title, company, and description
 */
export function parseJobDescription(userInput: string, manualJobUrl?: string): ParsedJobInfo {
  let jobTitle = '';
  let company = '';
  let jobDescription = userInput;

  const lines = userInput.split('\n').filter(line => line.trim().length > 0);

  console.log('[Manual Job] Input received:', {
    totalLength: userInput.length,
    lineCount: lines.length,
    firstLine: lines[0]?.substring(0, 200),
    secondLine: lines[1]?.substring(0, 200),
    thirdLine: lines[2]?.substring(0, 200)
  });

  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    const secondLine = lines.length > 1 ? lines[1].trim() : '';

    // Format 1: "Job Title at Company"
    const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+)$/i);
    if (atMatch) {
      jobTitle = atMatch[1].trim();
      company = atMatch[2].trim();
      jobDescription = lines.slice(1).join('\n').trim();
      console.log('[Manual Job] Matched format 1: "Title at Company"');
    }
    // Format 2: "Company - Job Title"
    else if (firstLine.includes('-') || firstLine.includes('–') || firstLine.includes('—')) {
      const dashMatch = firstLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);
      if (dashMatch) {
        company = dashMatch[1].trim();
        jobTitle = dashMatch[2].trim();
        jobDescription = lines.slice(1).join('\n').trim();
        console.log('[Manual Job] Matched format 2: "Company - Title"');
      }
    }
    // Format 3: First line is title, second line is company
    else if (secondLine.length > 0 && secondLine.length < 100 && !secondLine.toLowerCase().includes('responsibilities') && !secondLine.toLowerCase().includes('requirements')) {
      jobTitle = firstLine;
      // Clean up common prefixes from company name
      let cleanedCompany = secondLine
        .replace(/^(job category|category|company|location|posted by)\s*[:|\t]\s*/i, '')
        .trim();

      // If the company name contains multiple parts (e.g., "Tesla AI"), extract just the first part (company name)
      const companyMatch = cleanedCompany.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+[A-Z]/);
      if (companyMatch) {
        company = companyMatch[1].trim();
      } else {
        company = cleanedCompany.split(/\s+(AI|Cloud|Labs|Team|Group|Division|Department)/i)[0].trim();
      }

      jobDescription = lines.slice(2).join('\n').trim();
      console.log('[Manual Job] Matched format 3: Separate lines, cleaned company:', company);
    }
    // Format 4: Just use first line as title (if it looks like a title)
    else if (firstLine.length < 150) {
      jobTitle = firstLine;
      jobDescription = lines.slice(1).join('\n').trim();
      console.log('[Manual Job] Matched format 4: First line as title');
    }
  }

  // Try to extract from URL if we still don't have a job title and we have a manual job URL
  if (!jobTitle && manualJobUrl) {
    const urlParts = manualJobUrl.split('/').filter(part => part.length > 0);
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart.length > 5) {
      // Convert URL slug to title case (e.g., "fullstack-software-engineer" -> "Fullstack Software Engineer")
      jobTitle = lastPart
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .replace(/\d+/g, '')
        .trim();
      console.log('[Manual Job] Extracted title from URL:', jobTitle);
    }
  }

  // Default fallback
  if (!jobTitle || jobTitle.length === 0) {
    jobTitle = 'Job Application';
    jobDescription = userInput;
    console.log('[Manual Job] Using fallback title');
  }

  console.log('[Manual Job] Final parsed result:', {
    jobTitle,
    company,
    descriptionLength: jobDescription.length
  });

  return { jobTitle, company, jobDescription };
}
