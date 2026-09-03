import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react() as never],

  // Las variables VITE_* viven en el `.env` de la raíz del monorepo.
  envDir: fromHere('../..'),

  resolve: {
    // El orden importa: Vite usa la primera coincidencia, así que el subpath
    // del CSS va antes que el paquete.
    alias: [
      {
        find: '@real-elegance/shared/tokens.css',
        replacement: fromHere('../../packages/shared/tokens.css'),
      },
      {
        find: '@real-elegance/shared',
        replacement: fromHere('../../packages/shared/src/index.ts'),
      },
      { find: '@', replacement: fromHere('./src') },
    ],
  },

  css: {
    modules: {
      // Clases legibles en dev, cortas en producción.
      generateScopedName:
        process.env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]__[local]',
    },
  },

  server: {
    port: 5173,
    host: true,
  },

  preview: {
    port: 4173,
    host: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Separa las dependencias grandes para que el chunk de la app y sus
        // rutas perezosas no arrastren el vendor en cada despliegue.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**', 'src/mocks/**'],
    },
  },
});
