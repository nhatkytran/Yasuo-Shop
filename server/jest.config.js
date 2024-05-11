/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`${__dirname}/src/__tests__/*.test.ts`],
  verbose: true, // report for each test
  forceExit: true,
  // clearMocks: true,
  // testTimeout: 30 * 1000, // default is 5 seconds
};
