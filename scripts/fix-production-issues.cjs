#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing production issues...\n');

// Fix 1: Replace process.env.NODE_ENV with import.meta.env.DEV
const filesToFix = [
  'src/utils/analyticsValidator.ts',
  'src/components/error/ErrorBoundary.tsx',
  'src/components/performance/PerformanceMonitor.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace process.env.NODE_ENV checks
    content = content.replace(
      /process\.env\.NODE_ENV\s*!==?\s*['"]development['"]/g,
      '!import.meta.env.DEV'
    );
    content = content.replace(
      /process\.env\.NODE_ENV\s*===?\s*['"]development['"]/g,
      'import.meta.env.DEV'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed environment checks in ${file}`);
  }
});

// Fix 2: Add queue size limit to analytics.ts
const analyticsPath = path.join(__dirname, '..', 'src/utils/analytics.ts');
let analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

// Add MAX_QUEUE_SIZE constant after imports
analyticsContent = analyticsContent.replace(
  '// Event queue for events that are tracked before PostHog is loaded\nconst eventQueue: QueuedEvent[] = [];',
  `// Event queue for events that are tracked before PostHog is loaded
const MAX_QUEUE_SIZE = 100;
const eventQueue: QueuedEvent[] = [];`
);

// Add queue size check in trackEvent
analyticsContent = analyticsContent.replace(
  'eventQueue.push(event);',
  `// Prevent unbounded queue growth
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      eventQueue.shift(); // Remove oldest event
    }
    eventQueue.push(event);`
);

fs.writeFileSync(analyticsPath, analyticsContent);
console.log('✅ Added event queue size limit');

// Fix 3: Update PostHog initialization with privacy settings
const analyticsProviderPath = path.join(__dirname, '..', 'src/components/analytics/AnalyticsProvider.tsx');
let providerContent = fs.readFileSync(analyticsProviderPath, 'utf8');

// Update PostHog init configuration
providerContent = providerContent.replace(
  `posthog.init(
          posthogKey,
          {
            api_host: posthogHost,
            // Only enable debug in development
            debug: import.meta.env.DEV,
            // Disable automatic page view tracking - we'll do it manually
            autocapture: false,
            // Only load core features to reduce bundle size
            disable_session_recording: true,
            disable_persistence: false,
            // Use performance-optimized settings
            capture_pageview: false,
            capture_pageleave: false,`,
  `posthog.init(
          posthogKey,
          {
            api_host: posthogHost,
            // Only enable debug in development
            debug: import.meta.env.DEV,
            // Disable automatic page view tracking - we'll do it manually
            autocapture: false,
            // Only load core features to reduce bundle size
            disable_session_recording: true,
            disable_persistence: false,
            // Use performance-optimized settings
            capture_pageview: false,
            capture_pageleave: false,
            // Privacy settings
            ip: false, // Don't collect IP addresses
            respect_dnt: true, // Respect Do Not Track
            property_blacklist: ['email', 'password', 'credit_card'],`
);

fs.writeFileSync(analyticsProviderPath, providerContent);
console.log('✅ Updated PostHog privacy configuration');

// Fix 4: Guard console.warn in analytics.ts
analyticsContent = fs.readFileSync(analyticsPath, 'utf8');
analyticsContent = analyticsContent.replace(
  `console.warn(\`Feature flag '\${flagName}' check timed out - PostHog not loaded\`);`,
  `if (import.meta.env.DEV) {
      console.warn(\`Feature flag '\${flagName}' check timed out - PostHog not loaded\`);
    }`
);
fs.writeFileSync(analyticsPath, analyticsContent);
console.log('✅ Guarded console.warn statement');

console.log('\n✨ All critical production issues fixed!');
console.log('\n📋 Remaining manual tasks:');
console.log('1. Review email tracking for GDPR compliance');
console.log('2. Consider adding a privacy consent banner');
console.log('3. Implement error message sanitization');
console.log('4. Add throttling to scroll events for performance');
console.log('\nRun "npm run build" to verify the fixes.');