const path = require('path');
const fs = require('fs');
const { hash } = require('@strapi/plugin-users-permissions/server/utils/encryption');

// Ensure the database directory exists
const dbDir = path.join(__dirname, '../.tmp');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.test') });

// Initialize Strapi
const strapiFactory = require('@strapi/strapi');

// Create a test admin user
const createAdmin = async (strapi) => {
  try {
    // Check if admin already exists
    const adminExists = await strapi.db.query('admin::user').findOne({
      where: { email: 'admin@strapi.io' }
    });

    if (!adminExists) {
      // Hash the password
      const hashedPassword = await hash('Admin123');
      
      // Create admin user with test credentials
      await strapi.db.query('admin::user').create({
        data: {
          firstname: 'Admin',
          lastname: 'User',
          email: 'admin@strapi.io',
          username: 'admin',
          password: hashedPassword,
          isActive: true,
          roles: [1], // Super Admin role
          registrationToken: null,
          isActive: true
        }
      });
      console.log('✅ Test admin user created successfully');
    } else {
      console.log('ℹ️ Test admin user already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error creating test admin user:', error.message);
    if (error.details) {
      console.error('Error details:', error.details);
    }
    throw error;
  }
};

// Run the seed
const runSeed = async (strapi) => {
  try {
    console.log('🌱 Starting database seed...');
    await createAdmin(strapi);
    console.log('✅ Database seed completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
};

// Main function
const start = async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ This script should only be run in test environment');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting Strapi for seeding...');
    
    // Initialize Strapi
    const app = await strapiFactory({
      appDir: path.join(__dirname, '..'),
      distDir: path.join(__dirname, '../dist')
    }).load();

    // Start Strapi
    await app.start();
    
    // Run seed
    await runSeed(app);
    
    // Stop Strapi
    await app.stop();
    console.log('👋 Strapi stopped');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
};

// Start the process
start();
