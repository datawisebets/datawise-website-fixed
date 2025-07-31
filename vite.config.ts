import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["596506f3-0fc3-471e-8598-a2124ea4e5f8.lovableproject.com"],
    fs: {
      allow: ['..']
    },
    // History API fallback is handled by Vite's spa option
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
            },
          },
          {
            urlPattern: /\/blog-index\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'blog-index-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
            },
          },
          {
            urlPattern: /\/blog-content\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'blog-content-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
            },
          },
          {
            urlPattern: /\/blog|\/guides|\/betting-simulator/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
            },
          },
          {
            urlPattern: /\/api\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'DataWise Bets',
        short_name: 'DataWise',
        description: 'Advanced sports betting analytics and positive EV opportunities',
        theme_color: '#c9a961', // Gold color from the design
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/favicon/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: false, // Only enable in production to avoid conflicts with dev server
      },
    }),
    mode === 'production' && visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    // Enable automatic code splitting now that circular dependencies are fixed
    rollupOptions: {
      output: {
        // Vite's default chunking strategy is now safe to use
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
          'ui-vendor': ['framer-motion', 'lucide-react', '@radix-ui/react-dialog'],
          'analytics': ['posthog-js'],
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false, // Disable in production for smaller builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    // Standard chunk size warning
    chunkSizeWarningLimit: 500,
    // Enable build analysis
    reportCompressedSize: true,
  },
}));
