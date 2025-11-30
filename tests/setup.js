/**
 * Jest Test Setup
 * This file runs before all tests to set up the testing environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
process.env.DATABASE_FILENAME = process.env.DATABASE_FILENAME || '.tmp/test.db';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

