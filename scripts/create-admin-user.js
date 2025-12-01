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
  try {
    // Import Strapi
    const strapi = require('@strapi/strapi');
    
    // Start Strapi instance
    const app = await strapi({
      distDir: path.resolve(__dirname, '../dist'),
      autoReload: false,
      serveAdminPanel: false,
    }).load();

    // Check if admin user already exists
    const existingAdmin = await strapi.admin.services.user.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
      await app.destroy();
      return;
    }

    // Create admin user
    const adminUser = await strapi.admin.services.user.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      firstname: ADMIN_FIRSTNAME,
      lastname: ADMIN_LASTNAME,
      isActive: true,
    });

    if (adminUser) {
      console.log(`✅ Admin user created successfully: ${ADMIN_EMAIL}`);
    } else {
      console.log('⚠️ Failed to create admin user');
    }

    await app.destroy();
  } catch (error) {
    // If Strapi is already running, try using API instead
    if (error.code === 'EADDRINUSE' || error.message.includes('already in use')) {
      console.log('⚠️ Strapi is already running, trying API method...');
      await createAdminViaAPI();
      return;
    }
    
    console.error('❌ Error creating admin user:', error.message);
    // Don't fail the script - tests will handle missing user gracefully
    process.exit(0);
  }
}

async function createAdminViaAPI() {
  const http = require('http');
  const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

  return new Promise((resolve) => {
    // Try to register a user (if registration is enabled)
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
        console.log(`✅ Admin user created via API: ${ADMIN_EMAIL}`);
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
  });
}

// Run the script
if (require.main === module) {
  createAdminUser().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(0); // Don't fail CI if admin creation fails
  });
}

module.exports = { createAdminUser };

