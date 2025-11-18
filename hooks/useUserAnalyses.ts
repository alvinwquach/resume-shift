import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { subscribeToUserAnalyses } from '../services/analysisService';
import { SavedAnalysis } from '../types/analysis';

export function useUserAnalyses(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Use query with initial data
  const query = useQuery({
    queryKey: ['analyses', userId],
    queryFn: async () => {
      // Return empty array initially - real-time updates will populate
      return [] as SavedAnalysis[];
    },
    enabled: !!userId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    console.log('[useUserAnalyses] Setting up real-time listener...');

    const unsubscribe = subscribeToUserAnalyses(userId, (updatedAnalyses: SavedAnalysis[]) => {
      console.log('[useUserAnalyses] Received update:', updatedAnalyses.length, 'analyses');
      queryClient.setQueryData(['analyses', userId], updatedAnalyses);
    });

    return () => {
      console.log('[useUserAnalyses] Cleaning up subscription');
      unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}
