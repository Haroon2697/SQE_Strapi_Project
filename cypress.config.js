const { defineConfig } = require('cypress');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });

module.exports = defineConfig({
  projectId: 'isk912',
  e2e: {
    // Base URL for your application - using environment variable with fallback
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:1337',
    
    // Test timeouts (increased for CI)
    defaultCommandTimeout: 30000,    // Increased from 15000
    execTimeout: 120000,            // Increased from 60000
    taskTimeout: 60000,
    requestTimeout: 10000,
    responseTimeout: 60000,         // Increased from 30000
    pageLoadTimeout: 120000,        // Increased from 60000
    
    // Test retries
    retries: {
      runMode: 3,                   // Increased from 2
      openMode: 1
    },
    
    // Test settings
    video: true,
    videoCompression: 32,           // Increased compression for smaller files
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    // Security settings
    chromeWebSecurity: false,
    
    // Experimental features
    experimentalSessionAndOrigin: true,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Environment variables
    env: {
      // Strapi credentials
      STRAPI_EMAIL: process.env.CYPRESS_STRAPI_EMAIL || 'admin@strapi.io',
      STRAPI_PASSWORD: process.env.CYPRESS_STRAPI_PASSWORD || 'Admin123',
      
      // API settings with proper fallbacks
      API_BASE_URL: process.env.CYPRESS_API_BASE_URL || 'http://localhost:1337',
      
      // Test configuration
      CI: process.env.CI || false,
      
      // Add any other environment variables needed for tests
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

