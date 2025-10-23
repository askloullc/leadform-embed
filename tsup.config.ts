import { defineConfig } from 'tsup'

export default defineConfig([
  // Main widget build (vanilla JS)
  {
    entry: ['src/index.ts'],
    format: ['iife', 'esm'],
    globalName: 'LeadForm',
    minify: true,
    sourcemap: true,
    clean: true,
    dts: true,
    target: 'es2018',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: format === 'iife' ? '.iife.min.js' : '.esm.js',
      }
    },
    esbuildOptions(options) {
      // Ensure the IIFE is properly wrapped
      if (options.globalName) {
        options.footer = {
          js: '// LeadForm Embed Widget v1.0.0',
        }
      }
    },
  },
  // React components build
  {
    entry: ['src/react.ts'],
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
  },
])
