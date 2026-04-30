import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      historyApiFallback: true, // serve index.html su qualsiasi rotta (BrowserRouter)
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },

    // Production Build Optimizations
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Sourcemaps only in dev
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.log in production
          drop_debugger: true,
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
