import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

// Define as configurações do Vitest
export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    sequence: {
      // roda testes de forma sequencial (não paraleliza arquivos)
      concurrent: false,
    },
    maxConcurrency: 1,
    globals: true,
    root: './',
    setupFiles: ['./apps/generic-e-comerce/test/setup-e2e.ts'],
  },
  
  plugins: [
    swc.vite(),
    tsconfigPaths(), // Adiciona o plugin para resolver os caminhos
  ],
});
