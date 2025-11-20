import { useQuery } from '@tanstack/react-query';
import { getUserProjectRankings } from '../services/projectService';
import type { SavedProjectRanking } from '../types/project';

export function useUserProjectRankings(userId: string | undefined) {
  return useQuery<SavedProjectRanking[]>({
    queryKey: ['projectRankings', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return getUserProjectRankings(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
