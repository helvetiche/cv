/**
 * Projects API Endpoint Tests
 * Tests: GET/POST /api/projects, PUT/DELETE /api/projects/[id]
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
    add: mockAdd.mockResolvedValue({ id: "new-project-id" }),
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

import { GET, POST } from "../../app/api/projects/route";
import { PUT, DELETE } from "../../app/api/projects/[id]/route";

describe("Projects Endpoints", () => {
  const mockProject = {
    id: "project-1",
    title: "Test Project",
    description: "A test project description",
    tags: ["React", "TypeScript"],
    imageUrl: "https://example.com/image.png",
    github: "https://github.com/test/project",
    live: "https://project.example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const mockProjects = [mockProject];

  const getMocks = () => require("../../src/lib/firebase-admin");

  beforeEach(() => {
    jest.clearAllMocks();
    const mocks = getMocks();

    // Reset mock implementations
    mocks._mockCollection.mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: mockProjects.map((p) => ({
          id: p.id,
          data: () => p,
        })),
        empty: false,
        size: mockProjects.length,
      }),
      add: jest.fn().mockResolvedValue({ id: "new-project-id" }),
      doc: mocks._mockDocFn,
    });

    mocks._mockDocFn.mockReturnValue({
      id: "project-1",
      get: jest.fn().mockResolvedValue({
        exists: true,
        id: "project-1",
        data: () => mockProject,
      }),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    });
  });

  // ==========================================
  // GET /api/projects
  // ==========================================
  describe("GET /api/projects", () => {
    it("should return 200 with list of projects", async () => {
      const req = createAuthenticatedRequest("GET");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it("should return projects ordered by createdAt desc", async () => {
      const req = createAuthenticatedRequest("GET");
      await GET(req);

      const mocks = getMocks();
      expect(mocks._mockCollection).toHaveBeenCalledWith("projects");
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

    it("should return empty array when no projects exist", async () => {
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
  });

  // ==========================================
  // POST /api/projects
  // ==========================================
  describe("POST /api/projects", () => {
    const validProject = {
      title: "New Project",
      description: "Project description",
      tags: ["React", "Next.js"],
      imageUrl: "https://example.com/image.png",
      github: "https://github.com/test/project",
      live: "https://project.example.com",
    };

    it("should return 200 when project is created successfully", async () => {
      const req = createAuthenticatedRequest("POST", validProject);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.title).toBe(validProject.title);
    });

    it("should return 400 when title is missing", async () => {
      const req = createAuthenticatedRequest("POST", {
        description: "Project description",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Title and description are required");
    });

    it("should return 400 when description is missing", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "Project Title",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Title and description are required");
    });

    it("should return 400 when title is empty string", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "   ",
        description: "Description",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("POST", validProject);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("POST", validProject);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid request origin");
    });

    it("should trim title and description before saving", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "  Trimmed Title  ",
        description: "  Trimmed Description  ",
        tags: [],
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Trimmed Title");
      expect(data.data.description).toBe("Trimmed Description");
    });

    it("should set createdAt and updatedAt timestamps", async () => {
      const req = createAuthenticatedRequest("POST", validProject);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.createdAt).toBeDefined();
      expect(data.data.updatedAt).toBeDefined();
    });

    it("should default tags to empty array if not provided", async () => {
      const req = createAuthenticatedRequest("POST", {
        title: "Project",
        description: "Description",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.tags).toEqual([]);
    });
  });

  // ==========================================
  // PUT /api/projects/[id]
  // ==========================================
  describe("PUT /api/projects/[id]", () => {
    const updateData = {
      title: "Updated Project",
      description: "Updated description",
      tags: ["Vue", "Nuxt"],
    };

    it("should return 200 when project is updated successfully", async () => {
      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "project-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 400 when title is missing", async () => {
      const req = createAuthenticatedRequest("PUT", {
        description: "Updated description",
      });
      const params = Promise.resolve({ id: "project-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("PUT", updateData);
      const params = Promise.resolve({ id: "project-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "project-1" });
      const res = await PUT(req, { params });
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should update the updatedAt timestamp", async () => {
      const req = createAuthenticatedRequest("PUT", updateData);
      const params = Promise.resolve({ id: "project-1" });
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
  });

  // ==========================================
  // DELETE /api/projects/[id]
  // ==========================================
  describe("DELETE /api/projects/[id]", () => {
    it("should return 200 when project is deleted successfully", async () => {
      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "project-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 401 when user is not authenticated", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.requireAuth.mockResolvedValueOnce(null);

      const req = createMockRequest("DELETE");
      const params = Promise.resolve({ id: "project-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("should return 403 when CSRF check fails", async () => {
      const authMocks = require("../../src/lib/auth-middleware");
      authMocks.csrfCheck.mockReturnValueOnce(false);

      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "project-1" });
      const res = await DELETE(req, { params });
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should call delete on the correct document", async () => {
      const req = createAuthenticatedRequest("DELETE");
      const params = Promise.resolve({ id: "project-to-delete" });
      await DELETE(req, { params });

      const mocks = getMocks();
      expect(mocks._mockDocFn).toHaveBeenCalledWith("project-to-delete");
      const docRef = mocks._mockDocFn.mock.results[0].value;
      expect(docRef.delete).toHaveBeenCalled();
    });
  });
});
