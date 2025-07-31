module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/tests/e2e/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'],
  testTimeout: 30000,
  verbose: true,
};