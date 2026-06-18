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

// Get all projects from API
export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}
