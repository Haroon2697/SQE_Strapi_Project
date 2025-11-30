#!/usr/bin/env node
// Script to copy config files to dist directory
// This is needed because Strapi looks for configs in dist/config when distDir is set

const fs = require('fs');
const path = require('path');

const sourceConfigDir = path.resolve(__dirname, '../config');
const distConfigDir = path.resolve(__dirname, '../dist/config');

// Create dist/config directory structure
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

if (fs.existsSync(sourceConfigDir)) {
  // Ensure dist directory exists
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  copyConfigs(sourceConfigDir, distConfigDir);
  console.log('✓ Config files copied to dist/config');
} else {
  console.error('Source config directory not found:', sourceConfigDir);
  process.exit(1);
}

