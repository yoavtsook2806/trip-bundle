#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy built index.html to pwa.html for PWA bookmark compatibility
const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const pwaPath = path.join(distDir, 'pwa.html');

if (fs.existsSync(indexPath)) {
  // Read the built index.html
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // For dual deployment, keep the generated manifest.webmanifest (don't change to pwa-manifest.json)
  // The Vite PWA plugin already generates the correct manifest with proper scope and start_url
  
  // Write to pwa.html without changing manifest references
  fs.writeFileSync(pwaPath, indexContent);
  console.log('✅ Created pwa.html from index.html');
} else {
  console.error('❌ index.html not found in dist directory');
  process.exit(1);
}
