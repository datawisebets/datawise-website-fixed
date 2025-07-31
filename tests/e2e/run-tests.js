#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TEST_PORT = 8081;
const TEST_URL = `http://localhost:${TEST_PORT}`;

console.log('🧪 Starting E2E Analytics Tests...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '../../dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Build directory not found. Please run `npm run build` first.');
  process.exit(1);
}

// Start preview server
console.log(`📦 Starting preview server on port ${TEST_PORT}...`);
const previewProcess = require('child_process').spawn('npm', ['run', 'preview', '--', '--port', TEST_PORT], {
  stdio: 'pipe',
  shell: true
});

// Wait for server to start
const waitForServer = async (url, maxAttempts = 30) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fetch(url);
      return true;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
};

// Function to cleanup
const cleanup = () => {
  console.log('\n🧹 Cleaning up...');
  previewProcess.kill();
  process.exit();
};

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main test execution
(async () => {
  try {
    // Wait for server
    console.log('⏳ Waiting for server to start...');
    const serverReady = await waitForServer(TEST_URL);
    
    if (!serverReady) {
      console.error('❌ Server failed to start');
      cleanup();
      return;
    }
    
    console.log('✅ Server is ready\n');
    
    // Run Puppeteer tests
    console.log('🎭 Running Puppeteer analytics tests...\n');
    
    try {
      // Get test files from command line args or default to analytics test
      const args = process.argv.slice(2);
      const testFiles = args.length > 0 ? args.join(' ') : 'tests/e2e/analytics.integration.test.ts';
      
      execSync(`TEST_URL=${TEST_URL} vitest run ${testFiles}`, {
        stdio: 'inherit',  
        env: { ...process.env, TEST_URL }
      });
      
      console.log('\n✅ All E2E tests passed!');
    } catch (error) {
      console.error('\n❌ E2E tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    cleanup();
  }
})();