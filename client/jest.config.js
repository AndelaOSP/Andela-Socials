module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/__tests__/setup/',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/__tests__/setup/setupEnzyme.js',
};
