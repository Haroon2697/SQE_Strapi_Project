const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the database directory exists
const dbDir = path.join(__dirname, '../.tmp');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create a test admin user
const createAdmin = async () => {
  try {
    const { createCoreController } = require('@strapi/strapi').factories;
    const { createUser } = require('@strapi/plugin-users-permissions/server/controllers/user');
    
    // Check if admin already exists
    const adminExists = await strapi.db.query('admin::user').findOne({
      where: { email: 'test@example.com' }
    });

    if (!adminExists) {
      // Create admin user
      await strapi.db.query('admin::user').create({
        data: {
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          username: 'testadmin',
          password: 'Test1234!',
          isActive: true,
          roles: [1] // Super Admin role
        }
      });
      console.log('Test admin user created successfully');
    } else {
      console.log('Test admin user already exists');
    }
  } catch (error) {
    console.error('Error creating test admin user:', error);
    process.exit(1);
  }
};

// Run the seed
const runSeed = async () => {
  try {
    console.log('Starting database seed...');
    await createAdmin();
    console.log('Database seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Initialize Strapi and run the seed
const strapi = require('@strapi/strapi');

if (process.env.NODE_ENV !== 'test') {
  console.error('This script should only be run in test environment');
  process.exit(1);
}

strapi()
  .load()
  .then((app) => {
    app.start().then(() => {
      console.log('Strapi started for seeding...');
      runSeed();
    });
  })
  .catch((error) => {
    console.error('Failed to start Strapi:', error);
    process.exit(1);
  });
