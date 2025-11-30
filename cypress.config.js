const { defineConfig } = require('cypress');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });

module.exports = defineConfig({
  projectId: 'isk912',
  e2e: {
    // Base URL for your application
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:1337',
    
    // Experimental features
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test timeouts
    defaultCommandTimeout: 15000,    // Time to wait for commands to complete
    execTimeout: 60000,             // Time to wait for exec commands to complete
    taskTimeout: 60000,             // Time to wait for tasks to complete
    requestTimeout: 10000,          // Time to wait for requests to complete
    responseTimeout: 30000,         // Time to wait for responses to complete
    pageLoadTimeout: 60000,         // Time to wait for page load events
    
    // Test retries
    retries: {
      runMode: 2,                   // Retry failed tests up to 2 times in CI
      openMode: 1                   // Retry failed tests up to 1 time in interactive mode
    },
    
    // Test settings
    video: true,                    // Record video of tests
    videoCompression: 15,           // Lower number = better quality, higher file size
    screenshotOnRunFailure: true,   // Take screenshots on test failures
    trashAssetsBeforeRuns: true,    // Clear screenshots/videos before test runs
    
    // Security settings
    chromeWebSecurity: false,       // Required for testing in development with self-signed certs
    
    // Environment variables
    env: {
      // Strapi credentials (can be overridden with CYPRESS_STRAPI_* env vars)
      STRAPI_EMAIL: process.env.CYPRESS_STRAPI_EMAIL || 'admin@strapi.io',
      STRAPI_PASSWORD: process.env.CYPRESS_STRAPI_PASSWORD || 'Admin123',
      
      // API settings
      API_BASE_URL: process.env.CYPRESS_API_BASE_URL || 'http://localhost:1337',
      
      // Test settings
      grepFilterSpecs: true,
      grepOmitFiltered: true
    },
    
    // Setup Node events
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
  
  // Global configuration
  watchForFileChanges: false,  // Disable file watching in CI
  numTestsKeptInMemory: 5      // Reduce memory usage in CI
});

