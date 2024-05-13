/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`${__dirname}/src/__tests__/*.test.ts`],
  verbose: true, // report for each test
  forceExit: true,
  clearMocks: true, // number of mocks called -> 0
  resetMocks: true,
  restoreMocks: true, // reset and restore -> set mocks back to original state
  testTimeout: 30 * 1000, // default is 5 seconds
};
