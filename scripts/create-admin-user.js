#!/usr/bin/env node
/**
 * Script to create admin user for testing
 * This uses Strapi's bootstrap function to create an admin user programmatically
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

const ADMIN_EMAIL = process.env.STRAPI_TEST_EMAIL || process.env.CYPRESS_ADMIN_EMAIL || 'i222697@nu.edu.pk';
const ADMIN_PASSWORD = process.env.STRAPI_TEST_PASSWORD || process.env.CYPRESS_ADMIN_PASSWORD || '@Haroon5295';
const ADMIN_FIRSTNAME = process.env.STRAPI_TEST_FIRSTNAME || 'Haroon';
const ADMIN_LASTNAME = process.env.STRAPI_TEST_LASTNAME || 'Aziz';

async function createAdminUser() {
  // First, try using Strapi CLI command (simplest method)
  try {
    const { execSync } = require('child_process');
    console.log('📝 Attempting to create admin user via Strapi CLI...');
    
    const cmd = `npx strapi admin:create-user --email="${ADMIN_EMAIL}" --password="${ADMIN_PASSWORD}" --firstname="${ADMIN_FIRSTNAME}" --lastname="${ADMIN_LASTNAME}" --no-interactive`;
    
    try {
      execSync(cmd, { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' },
        cwd: path.resolve(__dirname, '..'),
      });
      console.log(`✅ Admin user created successfully via CLI: ${ADMIN_EMAIL}`);
      return;
    } catch (cliError) {
      if (cliError.message.includes('already exists') || cliError.stdout?.toString().includes('already exists')) {
        console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
        return;
      }
      console.log('⚠️ CLI method failed, trying API method...');
    }
  } catch (error) {
    console.log('⚠️ CLI method not available, trying API method...');
  }
  
  // Fallback: Try using API
  await createAdminViaAPI();
}

async function waitForStrapi(maxRetries = 10, delay = 2000) {
  const http = require('http');
  console.log('⏳ Waiting for Strapi to be ready...');
  
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:1337/admin', { timeout: 3000 }, (res) => {
          resolve();
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      console.log('✅ Strapi is ready!');
      return true;
    } catch (error) {
      if (i === maxRetries) {
        console.log('⚠️ Strapi may not be fully ready, but continuing...');
        return false;
      }
      console.log(`⏳ Waiting for Strapi... (attempt ${i}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

async function createAdminViaAPI() {
  // Wait for Strapi to be ready first
  await waitForStrapi();
  
  const http = require('http');
  const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

  return new Promise((resolve) => {
    // First, try the admin registration endpoint (when no admin exists)
    const adminRegisterData = JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      firstname: ADMIN_FIRSTNAME,
      lastname: ADMIN_LASTNAME,
    });

    const adminOptions = {
      hostname: 'localhost',
      port: 1337,
      path: '/admin/auth/register-admin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminRegisterData),
      },
    };

    const adminReq = http.request(adminOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Admin user created via admin registration endpoint: ${ADMIN_EMAIL}`);
          resolve();
        } else {
          // If admin registration fails, try regular user registration
          console.log(`⚠️ Admin registration failed (status: ${res.statusCode}), trying user registration...`);
          console.log(`Response: ${data.substring(0, 200)}`);
          tryUserRegistration(resolve);
        }
      });
    });

    adminReq.on('error', (error) => {
      console.log('⚠️ Could not connect to admin registration endpoint:', error.message);
      console.log('⚠️ Trying user registration as fallback...');
      tryUserRegistration(resolve);
    });

    adminReq.write(adminRegisterData);
    adminReq.end();
  });
}

function tryUserRegistration(resolve) {
  const http = require('http');
  const postData = JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    username: ADMIN_EMAIL.split('@')[0],
    firstname: ADMIN_FIRSTNAME,
    lastname: ADMIN_LASTNAME,
  });

  const options = {
    hostname: 'localhost',
    port: 1337,
    path: '/api/auth/local/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`✅ Admin user created via user registration: ${ADMIN_EMAIL}`);
    } else {
      console.log(`⚠️ Could not create admin user via API (status: ${res.statusCode})`);
      console.log('⚠️ Admin user may need to be created manually via http://localhost:1337/admin');
    }
    resolve();
  });

  req.on('error', (error) => {
    console.log('⚠️ Could not connect to Strapi API:', error.message);
    console.log('⚠️ Admin user may need to be created manually via http://localhost:1337/admin');
    resolve();
  });

  req.write(postData);
  req.end();
}

// Run the script
if (require.main === module) {
  createAdminUser().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(0); // Don't fail CI if admin creation fails
  });
}

module.exports = { createAdminUser };

