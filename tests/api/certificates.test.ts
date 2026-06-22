/**
 * Certificates API Endpoint Tests
 * Tests: GET/POST /api/certificates, PUT/DELETE /api/certificates/[id]
 */

// Mock firebase-admin/firestore - must be before imports
jest.mock("../../src/lib/firebase-admin", () => {
  const mockGet = jest.fn();
  const mockAdd = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockOrderBy = jest.fn();

  const mockDocRef = {
    id: "mock-doc-id",
    get: mockGet,
    update: mockUpdate,
    delete: mockDelete,
  };

  const mockSnapshot = {
    docs: [],
    empty: true,
    size: 0,
  };

  const mockDocFn = jest.fn().mockReturnValue(mockDocRef);
  const mockCollectionRef = {
    doc: mockDocFn,
    add: mockAdd.mockResolvedValue({ id: "new-cert-id" }),
    orderBy: mockOrderBy.mockReturnThis(),
    get: mockGet.mockResolvedValue(mockSnapshot),
  };

  const mockCollection = jest.fn().mockReturnValue(mockCollectionRef);

  return {
    adminDb: {
      collection: mockCollection,
      doc: mockDocFn,
    },
    __esModule: true,
    _mockCollection: mockCollection,
    _mockDocFn: mockDocFn,
    _mockDocRef: mockDocRef,
    _mockCollectionRef: mockCollectionRef,
  };
});

// Mock auth middleware
jest.mock("../../src/lib/auth-middleware", () => ({
  requireAuth: jest.fn().mockResolvedValue({
    uid: "test-user-uid",
    email: "test@example.com",
  }),
  csrfCheck: jest.fn().mockReturnValue(true),
  securityHeaders: jest.fn((res) => res),
}));

// Mock rate limiter
jest.mock("../../src/lib/rate-limit", () => ({
  apiLimiter: {
    limit: jest.fn().mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60000,
    }),
  },
}));

import { GET, POST } from "../../app/api/certificates/route";
import { PUT, DELETE } from "../../app/api/certificates/[id]/route";

describe("Certificates Endpoints", () => {
  const mockCertificate = {
    id: "cert-1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024-01-15",
    credentialUrl: "https://www.credential.net/abc123",
    description: "Professional level certification for AWS architecture",
    imageUrl: "https://example.com/cert-image.png",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  };

  const mockCertificates = [mockCertificate];

  const getMocks = () => require("../../src/lib/firebase-admin");

  beforeEach(() => {
    jest.clearAllMocks();
    const mocks = getMocks();

    mocks._mockCollection.mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: mockCertificates.map((c) => ({
          id: c.id,
          data: () => c,
        })),
        empty: false,
        size: mockCertificates.length,
      }),
      add: jest.fn().mockResolvedValue({ id: "new-cert-id" }),
      doc: mocks._mockDocFn,
    });

    mocks._mockDocFn.mockReturnValue({
      id: "cert-1",
      get: jest.fn().mockResolvedValue({
        exists: true,
        id: "cert-1",
        data: () => mockCertificate,
      }),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    });
  });

  // ==========================================
  // GET /api/certificates
  // ==========================================
  describe("GET /api/certificates", () => {
    it("should return 200 with list of certificates", async () => {
      const req = createAuthenticatedRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it("should return certificates ordered by createdAt desc", async () => {
      const req = createAuthenticatedRequest("GET");
      await GET(req);

      const mocks = getMocks();
      expect(mocks._mockCollection).toHaveBeenCalledWith("certificates");
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unauthorized");
    });

    it("should return 429 when rate limit is exceeded", async () => {
      const rateLimitMocks = require("../../src/lib/rate-limit");
      rateLimitMocks.apiLimiter.limit.mockResolvedValueOnce({
        success: false,
        limit: 60,
        remaining: 0,
        reset: Date.now() + 60000,
      });

      const req = createAuthenticatedRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Too many requests");
    });

    it("should return empty array when no certificates exist", async () => {
      const mocks = getMocks();
      mocks._mockCollection.mockReturnValueOnce({
        orderBy: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [],
          empty: true,
          size: 0,
        }),
      });

      const req = createAuthenticatedRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });

    it("should include all certificate fields in response", async () => {
      const req = createAuthenticatedRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      const cert = data.data[0];
      expect(cert).toHaveProperty("id");
      expect(cert).toHaveProperty("title");
      expect(cert).toHaveProperty("issuer");
      expect(cert).toHaveProperty("date");
      expect(cert).toHaveProperty("credentialUrl");
      expect(cert).toHaveProperty("description");
      expect(cert).toHaveProperty("imageUrl");
      expect(cert).toHaveProperty("createdAt");
      expect(cert).toHaveProperty("updatedAt");
    });
  });

  // ==========================================
  // POST /api/certificates
  // ==========================================
  describe("POST /api/certificates", () => {
    const validCertificate = {
      title: "Google Cloud Professional",
      issuer: "Google Cloud",
      date: "2024-02-01",
      credentialUrl: "https://cloud.google.com/certification/verify/123",
      description: "Professional Cloud Architect certification",
      imageUrl: "https://example.com/gcp-cert.png",
    };

    it("should return 200 when certificate is created successfully", async () => {
      const req = createAuthenticatedRequest("POST", validCertificate);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.title).toBe(validCertificate.title);
      expect(data.data.issuer).toBe(validCertificate.issuer);
    });

    it("should return 400 when title is missing", async () => {
      const req = createAuthenticatedRequest("POST", {
        issuer: "Google Cloud",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Title and issuer are required");
    });

    it("should return 400 when issuer is missing", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "Some Certificate",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Title and issuer are required");
    });

    it("should return 400 when title is empty string", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "   ",
        issuer: "Some Issuer",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 400 when issuer is empty string", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "Some Title",
        issuer: "   ",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("POST", validCertificate);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("POST", validCertificate);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid request origin");
    });

    it("should trim title and issuer before saving", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "  Trimmed Title  ",
        issuer: "  Trimmed Issuer  ",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Trimmed Title");
      expect(data.data.issuer).toBe("Trimmed Issuer");
    });

    it("should set createdAt and updatedAt timestamps", async () => {
      const req = createAuthenticatedRequest("POST", validCertificate);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.createdAt).toBeDefined();
      expect(data.data.updatedAt).toBeDefined();
    });

    it("should default optional fields to empty strings if not provided", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "Certificate",
        issuer: "Issuer",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.date).toBe("");
      expect(data.data.credentialUrl).toBe("");
      expect(data.data.description).toBe("");
      expect(data.data.imageUrl).toBe("");
    });

    it("should save all provided fields correctly", async () => {
      const req = createAuthenticatedRequest("POST", validCertificate);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.title).toBe(validCertificate.title);
      expect(data.data.issuer).toBe(validCertificate.issuer);
      expect(data.data.date).toBe(validCertificate.date);
      expect(data.data.credentialUrl).toBe(validCertificate.credentialUrl);
      expect(data.data.description).toBe(validCertificate.description);
      expect(data.data.imageUrl).toBe(validCertificate.imageUrl);
    });
  });

  // ==========================================
  // PUT /api/certificates/[id]
  // ==========================================
  describe("PUT /api/certificates/[id]", () => {
    const updateData = {
      title: "Updated Certificate",
      issuer: "Updated Issuer",
      date: "2024-03-01",
      credentialUrl: "https://updated.url",
      description: "Updated description",
      imageUrl: "https://updated.image.png",
    };

    it("should return 200 when certificate is updated successfully", async () => {
      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 400 when title is missing", async () => {
      const req = createAuthenticatedRequest("PUT", {
        issuer: "Updated Issuer",
      });
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 400 when issuer is missing", async () => {
      const req = createAuthenticatedRequest("PUT", {
        title: "Updated Title",
      });
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("PUT", updateData);
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should update the updatedAt timestamp", async () => {
      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });

      expect(res.status).toBe(200);
      const mocks = getMocks();
      const docRef = mocks._mockDocFn.mock.results[0].value;
      expect(docRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedAt: expect.any(String),
        })
      );
    });

    it("should update all provided fields", async () => {
      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "cert-1" });
      const res = await PUT(req, { params });

      expect(res.status).toBe(200);
      const mocks = getMocks();
      const docRef = mocks._mockDocFn.mock.results[0].value;
      expect(docRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: updateData.title,
          issuer: updateData.issuer,
          date: updateData.date,
          credentialUrl: updateData.credentialUrl,
          description: updateData.description,
          imageUrl: updateData.imageUrl,
        })
      );
    });
  });

  // ==========================================
  // DELETE /api/certificates/[id]
  // ==========================================
  describe("DELETE /api/certificates/[id]", () => {
    it("should return 200 when certificate is deleted successfully", async () => {
      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "cert-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("DELETE");
      const params = Promise.resolve({ id: "cert-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "cert-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should call delete on the correct document", async () => {
      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "cert-to-delete" });
      await DELETE(req, { params });

      const mocks = getMocks();
      expect(mocks._mockDocFn).toHaveBeenCalledWith("cert-to-delete");
      const docRef = mocks._mockDocFn.mock.results[0].value;
      expect(docRef.delete).toHaveBeenCalled();
    });
  });
});
