import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate source maps for production debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code to improve caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          'map-vendor': ['leaflet', 'react-leaflet'], // If using map features
          'ai-vendor': ['@tensorflow/tfjs'], // If using AI features
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit as needed
  },
  server: {
    open: true, // Open browser on dev start
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'dexie', 'recharts'],
  },
  define: {
    // This is important for some libraries to work properly in production
    'process.env': process.env
  }
})