const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 30000, // Increased timeout
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: {
      runMode: 2, // Retry failed tests up to 2 times in CI
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // Add any required setup here
      return config
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
})

