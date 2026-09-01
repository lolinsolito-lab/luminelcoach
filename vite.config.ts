import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      historyApiFallback: true, // serve index.html su qualsiasi rotta (BrowserRouter)
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        workbox: {
          navigateFallbackDenylist: [/^\/luminel-landing\.html/, /^\/luminel-intro\.html/],
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        manifest: {
          name: 'Luminel - Il Metodo Michael Luminels',
          short_name: 'Luminel',
          description: 'Applicazione ufficiale del Metodo Michael Luminels',
          theme_color: '#06060F',
          background_color: '#06060F',
          display: 'standalone',
          icons: [
            {
              src: 'favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            }
          ]
        }
      })
    ],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },

    // Production Build Optimizations
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Sourcemaps only in dev
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,       // NON eliminare console — la firma Luminel deve restare
          drop_debugger: true,
          pure_funcs: [],            // nessuna funzione da eliminare
        },
      },

      // Code Splitting Strategy
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk - core React libraries
            'vendor': ['react', 'react-dom', 'react-router-dom'],

            // Animations chunk - Framer Motion
            'animations': ['framer-motion'],

            // UI chunk - Icons and UI libraries
            'ui': ['@heroicons/react'],

            // AI chunk - Google GenAI
            'ai': ['@google/genai'],
          },

          // Asset naming for cache busting
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },

      // Chunk size warning limit (1MB)
      chunkSizeWarningLimit: 1000,

      // Ensure CSS is extracted
      cssCodeSplit: true,

      // Asset inline limit (4kb)
      assetsInlineLimit: 4096,
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        '@heroicons/react/24/outline',
        '@heroicons/react/24/solid',
      ],
    },
  };
});
