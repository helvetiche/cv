import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// Project type matching Firestore fields
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  github: string;
  live: string;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = "projects";

// Get all projects
export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
}
