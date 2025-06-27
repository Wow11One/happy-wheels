import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import environment from 'vite-plugin-environment';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    // rollupOptions: {
    //   plugins: [
    //     inject({
    //       Buffer: ['buffer', 'Buffer'], // Polyfill Buffer
    //       process: ['process', 'default'], // Polyfill process
    //     }),
    //   ],
    // },
  },
  envDir: '../',
  base: './',
  plugins: [
    react({
      include: '**/*.jsx',
    }),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
    nodePolyfills(),

  ],
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(new URL('../src/declarations', import.meta.url)),
        // assert: 'assert',
        // buffer: 'buffer',
        // process: 'process',
        // 'process/browser': 'process/browser',
        // stream: 'stream-browserify',
        // crypto: 'crypto-browserify',
        // url: 'url',
        // os: 'os-browserify',
      },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    host: '127.0.0.1',
    watch: {
      usePolling: true,
    },
  },
});
