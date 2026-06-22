import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  collectCoverageFrom: [
    "app/api/**/*.ts",
    "src/lib/**/*.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};

export default config;
