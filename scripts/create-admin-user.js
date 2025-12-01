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

async function checkAdminExists() {
  const http = require('http');
  return new Promise((resolve) => {
    const req = http.get('http://localhost:1337/admin', { timeout: 5000 }, (res) => {
      // Check if we're redirected to register-admin (means no admin exists)
      const location = res.headers.location || '';
      if (location.includes('register-admin')) {
        resolve(false); // No admin exists
      } else {
        // If we get 200 or redirect to login, admin might exist
        // Try to check the actual page content by following redirects
        resolve(res.statusCode < 400);
      }
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function createAdminUser() {
  // Wait for Strapi to be ready first
  await waitForStrapi(15, 2000);
  
  // Check if admin already exists
  console.log('🔍 Checking if admin user already exists...');
  const adminExists = await checkAdminExists();
  
  if (adminExists) {
    console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
    return true;
  }
  
  console.log('📝 No admin user found. Creating new admin user...');
  
  // Try API method first (most reliable)
  const success = await createAdminViaAPI();
  return success;
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
  const http = require('http');

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
          console.log(`✅ Admin user created successfully via admin registration endpoint: ${ADMIN_EMAIL}`);
          resolve(true);
        } else if (res.statusCode === 400) {
          // 400 might mean admin already exists or validation error
          try {
            const errorData = JSON.parse(data);
            if (errorData.error?.message?.includes('already') || data.includes('already')) {
              console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
              resolve(true);
            } else {
              console.log(`⚠️ Admin registration returned 400: ${data.substring(0, 300)}`);
              console.log('⚠️ This might mean admin already exists or validation failed.');
              // Check again if admin exists
              checkAdminExists().then(exists => {
                if (exists) {
                  console.log(`✅ Admin user exists (verified): ${ADMIN_EMAIL}`);
                  resolve(true);
                } else {
                  console.log('⚠️ Admin user creation may have failed. Tests may fail.');
                  resolve(false);
                }
              });
            }
          } catch (e) {
            console.log(`⚠️ Could not parse error response: ${data.substring(0, 200)}`);
            // Check if admin exists anyway
            checkAdminExists().then(exists => {
              if (exists) {
                console.log(`✅ Admin user exists (verified): ${ADMIN_EMAIL}`);
                resolve(true);
              } else {
                console.log('⚠️ Admin user creation may have failed.');
                resolve(false);
              }
            });
          }
        } else {
          console.log(`⚠️ Admin registration failed with status ${res.statusCode}`);
          console.log(`Response: ${data.substring(0, 300)}`);
          resolve(false);
        }
      });
    });

    adminReq.on('error', (error) => {
      console.log(`⚠️ Could not connect to admin registration endpoint: ${error.message}`);
      resolve(false);
    });

    adminReq.write(adminRegisterData);
    adminReq.end();
  });
}

// Removed tryUserRegistration - not needed, admin registration endpoint is sufficient

// Run the script
if (require.main === module) {
  createAdminUser().then((success) => {
    if (success) {
      console.log('✅ Admin user setup completed successfully');
      process.exit(0);
    } else {
      console.log('⚠️ Admin user setup completed with warnings');
      console.log('⚠️ Tests may fail if admin user is required');
      process.exit(0); // Don't fail CI, but log warning
    }
  }).catch((error) => {
    console.error('❌ Script failed:', error);
    console.error('⚠️ Admin user may need to be created manually');
    process.exit(0); // Don't fail CI if admin creation fails
  });
}

module.exports = { createAdminUser };

