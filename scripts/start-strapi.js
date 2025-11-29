#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure environment variables are loaded from .env.test if it exists
const envPath = path.join(__dirname, '../.env.test');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Set default environment variables if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.HOST = process.env.HOST || '0.0.0.0';
process.env.PORT = process.env.PORT || '1337';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://strapi:strapi@localhost:5432/strapi_test';
process.env.ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'test_admin_jwt_secret_12345';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_12345';
process.env.API_TOKEN_SALT = process.env.API_TOKEN_SALT || 'test_api_token_salt_12345';
process.env.APP_KEYS = process.env.APP_KEYS || 'test_app_keys_12345,test_app_keys_67890';
process.env.TRANSFER_TOKEN_SALT = process.env.TRANSFER_TOKEN_SALT || 'test_transfer_token_salt_12345';
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
process.env.STRAPI_ADMIN_BACKEND_URL = process.env.STRAPI_ADMIN_BACKEND_URL || 'http://localhost:1337';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('Starting Strapi with the following environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`HOST: ${process.env.HOST}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`ADMIN_JWT_SECRET: ${process.env.ADMIN_JWT_SECRET ? '***' : 'not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '***' : 'not set'}`);
console.log(`API_TOKEN_SALT: ${process.env.API_TOKEN_SALT ? '***' : 'not set'}`);
console.log(`APP_KEYS: ${process.env.APP_KEYS ? '***' : 'not set'}`);
console.log(`TRANSFER_TOKEN_SALT: ${process.env.TRANSFER_TOKEN_SALT ? '***' : 'not set'}`);

// Start Strapi
const strapi = exec('npx strapi develop', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Log output from Strapi
strapi.stdout.on('data', (data) => {
  console.log(`[Strapi] ${data}`);
  
  // Check for common error messages
  if (data.includes('Missing') || data.includes('Error') || data.includes('error')) {
    console.error(`[Strapi Error] ${data}`);
  }
});

strapi.stderr.on('data', (data) => {
  console.error(`[Strapi Error] ${data}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping Strapi...');
  strapi.kill();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  strapi.kill();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  strapi.kill();
  process.exit(1);
});
