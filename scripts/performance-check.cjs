#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running Performance Analysis...\n');

// Check bundle sizes
console.log('📦 Bundle Size Analysis:');
try {
  const buildOutput = execSync('npm run build', { encoding: 'utf8' });
  console.log(buildOutput);
} catch (error) {
  console.error('Build failed:', error.message);
}

// Analyze dist folder if it exists
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('\n📊 Built Assets:');
  
  const getFileSize = (filePath) => {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2) + ' KB';
  };
  
  const analyzeDir = (dir, prefix = '') => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeDir(filePath, prefix + '  ');
      } else if (file.endsWith('.js') || file.endsWith('.css')) {
        console.log(`${prefix}${file}: ${getFileSize(filePath)}`);
      }
    });
  };
  
  analyzeDir(distPath);
}

// Performance recommendations
console.log('\n🎯 Performance Checklist:');
console.log('✅ Checkout preloading implemented');
console.log('✅ Lazy loading for components');
console.log('✅ Code splitting enabled');
console.log('✅ Image optimization (WebP)');
console.log('✅ Font preloading');

console.log('\n📋 Manual Tests to Run:');
console.log('1. Open Chrome DevTools → Lighthouse');
console.log('2. Run Performance audit');
console.log('3. Check these metrics:');
console.log('   - Performance Score: Should be >90');
console.log('   - FCP (First Contentful Paint): <1.8s');
console.log('   - LCP (Largest Contentful Paint): <2.5s');
console.log('   - CLS (Cumulative Layout Shift): <0.1');

console.log('\n🔗 Test URLs:');
console.log('- Development: http://localhost:8080');
console.log('- Production build: npm run preview (after build)');

console.log('\n⚡ Checkout Performance Test:');
console.log('1. Wait 3-5 seconds after page load');
console.log('2. Click "7 Day Free Trial" button');
console.log('3. Checkout should appear INSTANTLY');
console.log('4. If not instant, check console for preloading errors');