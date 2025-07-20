import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'ES2022',
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  tsconfig: 'tsconfig.json',
  clean: true,
  dts: true,
  sourcemap: true,
});
