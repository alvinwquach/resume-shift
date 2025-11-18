import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ResumeAnalysisResult, SavedAnalysis } from "../types/analysis";

const ANALYSES_COLLECTION = "analyses";

/**
 * Save an analysis result to Firestore
 */
export async function saveAnalysis(
  userId: string,
  jobUrl: string,
  jobTitle: string | undefined,
  companyName: string | undefined,
  resumeFileName: string | undefined,
  result: ResumeAnalysisResult
): Promise<string> {
  try {
    const analysisData = {
      userId,
      jobUrl,
      jobTitle: jobTitle || null,
      companyName: companyName || null,
      resumeFileName: resumeFileName || null,
      result,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), analysisData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw new Error("Failed to save analysis");
  }
}

/**
 * Get all analyses for a user
 */
export async function getUserAnalyses(userId: string): Promise<SavedAnalysis[]> {
  try {
    const q = query(
      collection(db, ANALYSES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const analyses: SavedAnalysis[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        userId: data.userId,
        jobUrl: data.jobUrl,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        result: data.result,
        createdAt: data.createdAt.toDate(),
        resumeFileName: data.resumeFileName,
      });
    });

    return analyses;
  } catch (error) {
    console.error("Error fetching analyses:", error);
    throw new Error("Failed to fetch analysis history");
  }
}
