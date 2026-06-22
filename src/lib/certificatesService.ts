// Certificate type matching Firestore fields
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Get all certificates from API
export async function getCertificates(): Promise<Certificate[]> {
  const res = await fetch("/api/certificates");
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// Create a new certificate via API
export async function createCertificate(
  certificate: Omit<Certificate, "id" | "createdAt" | "updatedAt">
): Promise<Certificate> {
  const res = await fetch("/api/certificates", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(certificate),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// Update a certificate via API
export async function updateCertificate(
  id: string,
  certificate: Omit<Certificate, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const res = await fetch(`/api/certificates/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(certificate),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
}

// Delete a certificate via API
export async function deleteCertificate(id: string): Promise<void> {
  const res = await fetch(`/api/certificates/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
}
