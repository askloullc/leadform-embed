import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/simple.ts'],
  format: ['esm', 'cjs'],
  external: ['react'],
  dts: true,
  sourcemap: true,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs.js' : '.esm.js',
    }
  },
})
