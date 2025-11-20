import { db } from '@/firebaseConfig';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import type { RankedProject, SavedProjectRanking } from '../types/project';

/**
 * Save project ranking results to Firestore
 */
export async function saveProjectRanking(
  userId: string,
  projects: RankedProject[],
  targetRole?: string,
  candidateLevel?: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'projectRankings'), {
      userId,
      projects,
      targetRole: targetRole || null,
      candidateLevel: candidateLevel || null,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving project ranking:', error);
    throw error;
  }
}

/**
 * Get user's project ranking history
 */
export async function getUserProjectRankings(userId: string): Promise<SavedProjectRanking[]> {
  try {
    console.log('Fetching project rankings for user:', userId);
    const q = query(
      collection(db, 'projectRankings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rankings: SavedProjectRanking[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rankings.push({
        id: doc.id,
        userId: data.userId,
        projects: data.projects,
        targetRole: data.targetRole,
        candidateLevel: data.candidateLevel,
        createdAt: data.createdAt.toDate(),
      });
    });

    console.log('Fetched project rankings:', rankings.length, 'sessions');
    return rankings;
  } catch (error) {
    console.error('Error fetching project rankings:', error);
    throw error;
  }
}
