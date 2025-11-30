module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/cypress/**',
    '!**/.next/**',
    '!**/.strapi/**',
    '!**/jest.config.js',
    '!**/coverage/**',
    '!**/cypress.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/.strapi/',
    '/cypress/'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
