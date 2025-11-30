#!/usr/bin/env node
// Wrapper script for strapi develop that ensures configs are in dist/config
// This is needed because Strapi cleans dist/ but looks for configs in dist/config

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Copy configs function
function copyConfigs(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyConfigs(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.json'))) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const sourceConfigDir = path.resolve(__dirname, '../config');
const distConfigDir = path.resolve(__dirname, '../dist/config');

// Ensure dist exists
const distDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy configs before starting
if (fs.existsSync(sourceConfigDir)) {
  copyConfigs(sourceConfigDir, distConfigDir);
  console.log('✓ Config files copied to dist/config');
}

// Check if running in background (CI mode)
const isBackground = process.env.CI === 'true' || process.argv.includes('--background');

// Start Strapi
const strapiProcess = spawn('npx', ['strapi', 'develop', ...process.argv.slice(2)], {
  stdio: isBackground ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..')
});

// If background mode, pipe output
if (isBackground) {
  strapiProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  strapiProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
}

// Watch for dist cleaning and re-copy configs
// This is a workaround - we'll copy configs periodically
const configWatcher = setInterval(() => {
  if (fs.existsSync(sourceConfigDir) && fs.existsSync(distDir)) {
    if (!fs.existsSync(distConfigDir) || 
        (fs.existsSync(sourceConfigDir) && fs.statSync(sourceConfigDir).mtime > (fs.existsSync(distConfigDir) ? fs.statSync(distConfigDir).mtime : 0))) {
      copyConfigs(sourceConfigDir, distConfigDir);
    }
  }
}, 1000); // Check every second

strapiProcess.on('exit', (code) => {
  clearInterval(configWatcher);
  process.exit(code || 0);
});

strapiProcess.on('error', (err) => {
  clearInterval(configWatcher);
  console.error('Failed to start Strapi:', err);
  process.exit(1);
});

// Handle process signals
process.on('SIGINT', () => {
  clearInterval(configWatcher);
  strapiProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  clearInterval(configWatcher);
  strapiProcess.kill('SIGTERM');
});
