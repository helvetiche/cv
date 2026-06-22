/**
 * Test setup file - mocks Firebase Admin and external dependencies
 */

/* eslint-disable @typescript-eslint/no-require-imports */

// Mock firebase-admin before any imports
jest.mock("firebase-admin/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([{ name: "mock-app" }]),
  cert: jest.fn(),
}));

jest.mock("firebase-admin/firestore", () => {
  const mockCollection = jest.fn();
  const mockDoc = jest.fn();
  const mockGet = jest.fn();
  const mockAdd = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockOrderBy = jest.fn();
  const mockWhere = jest.fn();

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
    forEach: jest.fn(),
    map: jest.fn().mockReturnValue([]),
  };

  const mockCollectionRef = {
    doc: mockDoc.mockReturnValue(mockDocRef),
    add: mockAdd.mockResolvedValue({ id: "mock-doc-id" }),
    orderBy: mockOrderBy.mockReturnThis(),
    where: mockWhere.mockReturnThis(),
    get: mockGet.mockResolvedValue(mockSnapshot),
  };

  mockCollection.mockReturnValue(mockCollectionRef);

  return {
    getFirestore: jest.fn().mockReturnValue({
      collection: mockCollection,
      doc: mockDoc,
    }),
    FieldValue: {
      serverTimestamp: jest.fn().mockReturnValue(new Date().toISOString()),
    },
  };
});

jest.mock("firebase-admin/auth", () => ({
  getAuth: jest.fn().mockReturnValue({
    verifySessionCookie: jest.fn().mockResolvedValue({
      uid: "test-user-uid",
      email: "test@example.com",
    }),
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "test-user-uid",
    }),
    createSessionCookie: jest.fn().mockReturnValue("mock-session-cookie"),
    getUser: jest.fn().mockResolvedValue({
      uid: "test-user-uid",
      email: "test@example.com",
    }),
  }),
}));

// Mock @upstash/ratelimit
jest.mock("@upstash/ratelimit", () => {
  const mockLimit = jest.fn().mockResolvedValue({
    success: true,
    limit: 60,
    remaining: 59,
    reset: Date.now() + 60000,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockRatelimit: any = jest.fn().mockImplementation(() => ({
    limit: mockLimit,
  }));
  MockRatelimit.slidingWindow = jest.fn().mockReturnValue("sliding-window-config");
  MockRatelimit.fixedWindow = jest.fn().mockReturnValue("fixed-window-config");
  return { Ratelimit: MockRatelimit };
});

jest.mock("@upstash/redis", () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

// Mock environment variables
process.env = {
  ...process.env,
  FIREBASE_PROJECT_ID: "test-project",
  FIREBASE_CLIENT_EMAIL: "test@test.com",
  FIREBASE_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA2a2rwplBQLF6LQZPc3k5fCpRvrvPLxrNqe5qz7nPLxrNqe5q\nz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5q\nz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5q\nz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5q\nz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5q\nz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5qz7nPLxrNqe5q\n-----END RSA PRIVATE KEY-----",
  NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  UPSTASH_REDIS_REST_URL: "https://test-redis.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "test-token",
  NODE_ENV: "test",
};

// Global test helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).createMockRequest = (
  method: string,
  body?: Record<string, any>,
  headers?: Record<string, string>,
  cookies?: Record<string, string>
): any => {
  const url = new URL("http://localhost:3000/api/test");
  return {
    method,
    url: url.toString(),
    headers: new Map([
      ["content-type", "application/json"],
      ["origin", "http://localhost:3000"],
      ...Object.entries(headers || {}),
    ]),
    cookies: {
      get: jest.fn((name: string) => cookies?.[name] ? { value: cookies[name] } : undefined),
    },
    json: jest.fn().mockResolvedValue(body || {}),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).createAuthenticatedRequest = (
  method: string,
  body?: Record<string, any>,
  headers?: Record<string, string>
): any => {
  return (global as any).createMockRequest(method, body, headers, {
    __session: "valid-session-cookie",
  });
};
