module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: false, // Disable coverage for now to avoid babel issues
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
