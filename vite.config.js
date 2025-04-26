import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      process: 'process/browser',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/.netlify\/functions/, '')
      }
    }
  }
}); 