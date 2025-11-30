const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

// Database connection URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://strapi:strapi@localhost:5432/strapi_test';

// Admin user credentials
const ADMIN_EMAIL = process.env.STRAPI_EMAIL || 'admin@strapi.io';
const ADMIN_PASSWORD = process.env.STRAPI_PASSWORD || 'Admin123';

console.log('🚀 Starting test database seeding...');

// Function to run shell commands with error handling
const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
};

// Main seeding function
const seedDatabase = async () => {
  console.log('🔍 Checking database connection...');
  
  try {
    // Wait for database to be ready (useful in CI/CD)
    const maxRetries = 10;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        execSync('pg_isready -h localhost -p 5432', { stdio: 'ignore' });
        console.log('✅ Database connection established');
        break;
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw new Error('❌ Failed to connect to database after multiple attempts');
        }
        console.log(`⏳ Waiting for database to be ready (attempt ${retries}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Create admin user using Strapi CLI
    console.log('👤 Creating admin user...');
    const createUserCmd = `npx strapi admin:create-user \
      --email=${ADMIN_EMAIL} \
      --password=${ADMIN_PASSWORD} \
      --firstname=Admin \
      --lastname=User \
      --roles=1 \
      --no-interactive`;
    
    if (!runCommand(createUserCmd)) {
      console.log('ℹ️ Admin user might already exist, continuing...');
    }
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ This script should only be run in test environment');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting database setup...');
    
    // 1. Build the admin panel
    console.log('🔨 Building admin panel...');
    runCommand('NODE_ENV=test npm run build');
    
    // 2. Start Strapi in the background
    console.log('🚀 Starting Strapi in the background...');
    const strapiProcess = execSync(
      'NODE_ENV=test npm run start:ci &',
      { stdio: 'inherit', shell: true, detached: true }
    );

    // 3. Wait for Strapi to start
    console.log('⏳ Waiting for Strapi to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 4. Create admin user
    await createAdminUser();
    
    // 5. Stop Strapi
    console.log('🛑 Stopping Strapi...');
    try {
      execSync('pkill -f "strapi start"', { stdio: 'ignore' });
    } catch (e) {
      // Ignore if no process was found
    }
    
    console.log('✅ Database setup completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
