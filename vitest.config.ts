import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsconfigPaths(), 
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      //'@prisma': resolve(__dirname, 'prisma', 'generated'),
      // '@test': resolve(__dirname, 'apps/generic-e-comerce/test'),
    },
  },
});
