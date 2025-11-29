const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.test') });

// Ensure the database directory exists
const dbDir = path.join(__dirname, '../.tmp');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Simple function to run shell commands
const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    throw error;
  }
};

// Create admin user using Strapi CLI
const createAdminUser = async () => {
  try {
    // First, check if admin already exists by trying to get a JWT token
    try {
      const token = execSync(
        'curl -X POST http://localhost:1337/admin/login \
        -H "Content-Type: application/json" \
        -d \'{"email":"admin@strapi.io","password":"Admin123"}\''
      );
      console.log('ℹ️ Admin user already exists');
      return true;
    } catch (e) {
      // If we get here, the user doesn't exist or credentials are wrong
      console.log('🌱 Creating admin user...');
      
      // Run the bootstrap command to create the first admin user
      const cmd = `NODE_ENV=test npx strapi admin:create-user \
        --email=admin@strapi.io \
        --password=Admin123 \
        --firstname=Admin \
        --lastname=User`;
      
      runCommand(cmd);
      console.log('✅ Admin user created successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
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
