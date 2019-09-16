module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testRegex: '(roots/.*|(\\.|/)(test))\\.(js|jsx)?$',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/__tests__/setup/',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/__tests__/setup/setupEnzyme.js',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
