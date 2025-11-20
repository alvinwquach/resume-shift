import { useState } from 'react';
import { FUNCTIONS_ENDPOINTS } from '@/services/functionsConfig';
import type { Project, ProjectRankingResult } from '@/types/project';

interface RankProjectParams {
  projectDescription: string;
  targetRole?: string;
  candidateLevel?: string;
}

export function useProjectRanking() {
  const [isRanking, setIsRanking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rankProject = async (
    params: RankProjectParams
  ): Promise<ProjectRankingResult | null> => {
    setIsRanking(true);
    setError(null);

    try {
      const response = await fetch(FUNCTIONS_ENDPOINTS.RANK_PROJECTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Failed to rank project: ${response.statusText}`);
      }

      // Read the streamed response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result: ProjectRankingResult | null = null;

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Try to parse the complete JSON at the end
        try {
          result = JSON.parse(buffer);
        } catch (e) {
          // Not complete JSON yet, continue reading
        }
      }

      setIsRanking(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsRanking(false);
      return null;
    }
  };

  return {
    rankProject,
    isRanking,
    error,
  };
}
