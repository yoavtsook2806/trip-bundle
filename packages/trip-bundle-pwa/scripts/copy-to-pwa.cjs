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
  
  // Update all manifest references to point to pwa-manifest.json
  indexContent = indexContent
    .replace(/href="[^"]*manifest\.json"/g, 'href="/pwa-manifest.json"')
    .replace(/href="[^"]*manifest\.webmanifest"/g, 'href="/pwa-manifest.json"');
  
  // Write to pwa.html
  fs.writeFileSync(pwaPath, indexContent);
  console.log('✅ Created pwa.html from index.html');
} else {
  console.error('❌ index.html not found in dist directory');
  process.exit(1);
}
