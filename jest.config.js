module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/cypress/**',
    '!**/.next/**',
    '!**/.strapi/**',
    '!**/jest.config.js',
    '!**/coverage/**',
    '!**/cypress.config.js',
    '!**/dist/**',
    '!**/build/**',
    '!**/config/**',
    '!**/scripts/**',
    '!**/babel.config.js',
    '!**/src/**',
    '!**/utils/**',
    '!**/__tests__/**',
    '!**/test-*.js',
    '!**/eslint.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/.strapi/',
    '/cypress/',
    '/dist/',
    '/build/',
    '/tests/integration/' // Integration tests need Strapi running
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000
};
