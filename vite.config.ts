import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
    strictPort: true,
    watch: {
      ignored: ['**/.env*'], // <-- Ignora arquivos .env para não reiniciar constantemente
    },
    hmr: {
      host: 'localhost',
      port: 8000,
    },
  },
  plugins: [react(), splitVendorChunkPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: true,
    reportCompressedSize: true,
    minify: mode === 'production' ? 'terser' : 'esbuild',
    target: 'es2020',
    ...(mode === 'production'
      ? {
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        }
      : {}),
    rollupOptions: {
      output: {
        entryFileNames: 'assets/entry/[name]-[hash].js',
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('axios')) {
            return 'network';
          }

          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }

          if (id.includes('framer-motion')) {
            return 'motion';
          }

          if (id.includes('recharts')) {
            return 'charts';
          }

          if (id.includes('lucide-react') || id.includes('date-fns')) {
            return 'ui-primitives';
          }

          if (id.includes('@ionic/core')) {
            return 'ionic-core';
          }

          if (id.includes('@ionic/react')) {
            return 'ionic-react';
          }

          if (id.includes('ionicons')) {
            return 'ionicons';
          }

          if (id.includes('@hookform') || id.includes('zod')) {
            return 'forms';
          }

          if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('vaul')) {
            return 'ui-kit';
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          return 'vendor';
        }
      }
    }
  }
}));
