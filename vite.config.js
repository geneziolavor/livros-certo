import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Aplica JSX a todos os arquivos .js
      include: '**/*.{jsx,js,ts,tsx}',
    }),
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copia o arquivo _redirects para a pasta dist após o build
        if (fs.existsSync('_redirects')) {
          fs.copyFileSync('_redirects', 'dist/_redirects');
        }
      }
    }
  ],
  root: './',
  publicDir: 'public',
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      process: 'process/browser',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      external: ['web-vitals'],
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['web-vitals']
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