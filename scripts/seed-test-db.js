const { execSync } = require('child_process');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

// Admin user credentials
const ADMIN_EMAIL = process.env.STRAPI_EMAIL || 'admin@strapi.io';
const ADMIN_PASSWORD = process.env.STRAPI_PASSWORD || 'Admin123';

console.log('🚀 Starting test database setup...');

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

// Function to check if database is ready
const waitForDatabase = async (maxRetries = 10, delay = 3000) => {
  console.log('🔍 Checking database connection...');
  
  for (let i = 1; i <= maxRetries; i++) {
    try {
      execSync('pg_isready -h localhost -p 5432', { stdio: 'ignore' });
      console.log('✅ Database connection established');
      return true;
    } catch (error) {
      if (i === maxRetries) {
        console.error('❌ Failed to connect to database after multiple attempts');
        return false;
      }
      console.log(`⏳ Waiting for database to be ready (attempt ${i}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Function to create admin user
const createAdminUser = async () => {
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
    return false;
  }
  
  console.log('✅ Admin user created successfully');
  return true;
};

// Main function
const main = async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ This script should only be run in test environment');
    process.exit(1);
  }

  try {
    // 1. Wait for database to be ready
    const isDbReady = await waitForDatabase();
    if (!isDbReady) {
      throw new Error('Database connection failed');
    }
    
    // 2. Create admin user directly
    await createAdminUser();
    
    console.log('✅ Database setup completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

// Run the main function
main();
