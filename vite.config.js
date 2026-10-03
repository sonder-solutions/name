import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 6666,
    host: '0.0.0.0',
    allowedHosts: ['name.sndr.asia'],
    headers: {
      // Required for SharedArrayBuffer (multi-threaded WASM)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
