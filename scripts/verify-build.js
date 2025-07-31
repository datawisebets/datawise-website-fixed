import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distIndexPath = path.join(distDir, 'index.html');

let hasError = false;

// Helper to log errors
const logError = (message) => {
  console.error(`❌ ERROR: ${message}`);
  hasError = true;
};

// 1. Check if dist/index.html exists
if (!fs.existsSync(distIndexPath)) {
  logError('dist/index.html not found!');
} else {
  // Read the built index.html
  const indexContent = fs.readFileSync(distIndexPath, 'utf-8');

  // 2. Check for development script tags
  if (indexContent.includes('/src/main.tsx')) {
    logError('dist/index.html contains development script tags! Found: /src/main.tsx');
  }

  // 3. Check for proper production script tags
  if (!indexContent.includes('/assets/') || !indexContent.includes('.js')) {
    logError('dist/index.html missing production script tags!');
  }
}

// 4. Check for critical blog JSON files
const checkJsonFile = (filename) => {
  const filePath = path.join(distDir, filename);
  if (!fs.existsSync(filePath)) {
    logError(`${filename} not found in dist/ directory!`);
    return;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    if (!Array.isArray(data) || data.length === 0) {
      logError(`${filename} is empty or not a valid JSON array.`);
    }
  } catch (e) {
    logError(`Failed to parse ${filename}: ${e.message}`);
  }
};

checkJsonFile('blog-content.json');
checkJsonFile('blog-index.json');


// Final result
if (hasError) {
  console.error('\n🔥 Build verification failed. Please check the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ Build verification passed!');
  console.log('✅ dist/index.html contains production assets.');
  console.log('✅ Blog content JSON files are present and valid.');
}


// For Vercel: Remove root index.html to prevent serving wrong file
const rootIndexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  // Check if it's the dev html before renaming
  const rootIndexContent = fs.readFileSync(rootIndexPath, 'utf-8');
  if (rootIndexContent.includes('/src/main.tsx')) {
    console.log('📦 Moving root index.html to index.dev.html for Vercel deployment');
    fs.renameSync(rootIndexPath, path.join(rootDir, 'index.dev.html'));
  }
}