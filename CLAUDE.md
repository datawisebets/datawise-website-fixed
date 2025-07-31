# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build with source maps
npm run build:sourcemap

# Build for development (with source maps)
npm run build:dev

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Run tests
npm test                    # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:ui            # Run tests with UI
npm run test:coverage      # Run tests with coverage report
npm run test:e2e           # Run E2E analytics tests
npm run test:e2e:dev       # Run E2E tests against dev server
npm run test:analytics     # Run only analytics integration tests

# Generate blog content (runs automatically before dev/build)
node scripts/build-blog-content.js

# Analytics Testing (Development Only)
# Visit http://localhost:8080/dev/analytics-test for interactive testing
```

## Feature Implementation System Guidelines

### Feature Implementation Priority Rules
- IMMEDIATE EXECUTION: Launch parallel Tasks immediately upon feature requests
- NO CLARIFICATION: Skip asking what type of implementation unless absolutely critical
- PARALLEL BY DEFAULT: Always use 7-parallel-Task method for efficiency

### Parallel Feature Implementation Workflow
1. **Component**: Create main component file
2. **Styles**: Create component styles/CSS
3. **Tests**: Create test files  
4. **Types**: Create type definitions
5. **Hooks**: Create custom hooks/utilities
6. **Integration**: Update routing, imports, exports
7. **Remaining**: Update package.json, documentation, configuration files
8. **Review and Validation**: Coordinate integration, run tests, verify build, check for conflicts

### Context Optimization Rules
- Strip out all comments when reading code files for analysis
- Each task handles ONLY specified files or file types
- Task 7 combines small config/doc updates to prevent over-splitting

### Feature Implementation Guidelines
- **CRITICAL**: Make MINIMAL CHANGES to existing patterns and structures
- **CRITICAL**: Preserve existing naming conventions and file organization
- Follow project's established architecture and component patterns
- Use existing utility functions and avoid duplicating functionality

## High-Level Architecture

This is a React-based sports betting analytics website built with:
- **React 19** with TypeScript for type safety
- **Vite** as the build tool with SWC for fast compilation
- **Tailwind CSS** with shadcn/ui component library
- **React Router v7** for client-side routing
- **TanStack Query** for server state management
- **PostHog**, Vercel Analytics & Speed Insights for tracking
- **Vitest** for unit testing with React Testing Library

### Key Architectural Patterns

1. **Component Structure**: Components are organized by feature in `/src/components/` with UI primitives in `/src/components/ui/`
2. **Lazy Loading System**: 
   - `createAboveFoldLazyComponent` for critical content
   - `createBelowFoldLazyComponent` for secondary content
   - `createDeferredLazyComponent` for non-critical content
3. **Markdown-based Blog**: Blog posts stored as Markdown in `/src/content/blog/`, processed at build time to static JSON
4. **Type Safety**: Full TypeScript coverage with strict mode enabled
5. **Path Aliases**: Use `@/*` to import from `src/*` directory

### Project Structure Overview

- **Pages** (`/src/pages/`): Route-level components (Index, BlogIndex, GuideDetail, BettingSimulator)
- **Blog System**: Two-tier static JSON system - `blog-index.json` (metadata) and `blog-content.json` (full content)
- **Styling**: Modular CSS approach with separate files for animations, effects, and utilities
- **Assets**: Self-hosted fonts and optimized images in `/public/`
- **Service Worker**: PWA with aggressive caching strategies for offline support

### Important Context

- This is a Lovable project (originally created via lovable.dev)
- The site is deployed on Netlify with SPA fallback configuration
- PostHog analytics is integrated with event queueing system
- Whop checkout integration using @whop/react for embedded checkout modal
- Development server runs on port 8080 with IPv6 support

### Performance Considerations

- Images are optimized to WebP format with responsive variants
- Build-time blog processing eliminates runtime markdown parsing
- Progressive rendering with `useProgressiveRender` hook
- Resource preloading system with route-based optimization
- Code splitting at route level with React.lazy()
- CSS animations are GPU-accelerated where possible
- Service Worker with comprehensive caching strategies

### React 19 Features in Use

1. **Error Handling**: Enhanced ErrorBoundary with onCaughtError, onUncaughtError, onRecoverableError
2. **Data Fetching**: use() hook for synchronous data fetching with Suspense
3. **State Management**: useActionState for simplified form state management
4. **Performance**: useTransition for non-blocking updates, useDeferredValue for optimized filtering
5. **Resource Loading**: Native preload/preinit APIs for resource optimization
6. **Ref Cleanup**: Ref cleanup functions following React 19 patterns

### Testing Strategy

- Vitest with React Testing Library for component testing
- Test files colocated with components (*.test.tsx)
- Coverage reporting available with `npm run test:coverage`
- Testing utilities in `/src/test/setup.ts`
- **E2E Analytics Testing**: Puppeteer-based integration tests in `/tests/e2e/`
- **Runtime Validation**: Analytics methods validated automatically in development
- **Test Harness**: Interactive analytics testing at `/dev/analytics-test` (DEV only)
- **Continuous Validation**: Prevents runtime errors from passing build verification

### Analytics Architecture

1. **PostHog**: Product analytics with feature flags and event tracking
2. **Event Queueing**: Events queued before PostHog loads to prevent data loss
3. **Type-safe Events**: Strongly typed analytics utility in `/src/utils/analytics.ts`
4. **Feature Flags**: Async-safe methods (getFeatureFlag, onFeatureFlag)
5. **Error Tracking**: Integrated with error boundaries for automatic reporting
6. **Runtime Validation**: `AnalyticsValidator` ensures all methods exist and work correctly
7. **Development Tools**: Interactive test harness at `/dev/analytics-test`
8. **E2E Testing**: Comprehensive Puppeteer tests with PostHog mocking
9. **TrackedCTA Component**: Universal CTA tracking with rich context data
10. **Page Tracking Hook**: `usePageTracking` for automatic route and engagement tracking

### Key Integration Points

1. **Whop Checkout**: CheckoutProvider manages global checkout state, all CTAs open modal
2. **Blog System**: BlogService provides React 19 compatible promise-based API
3. **Resource Preloading**: Automatic preloading based on route configuration
4. **Analytics**: Centralized through analytics utility with multiple providers
5. **Error Boundaries**: Multi-level error handling (page, section, component levels)