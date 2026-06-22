/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  function createMockRequest(
    method: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
    cookies?: Record<string, string>
  ): any;

  function createAuthenticatedRequest(
    method: string,
    body?: Record<string, any>,
    headers?: Record<string, string>
  ): any;
}

export {};
