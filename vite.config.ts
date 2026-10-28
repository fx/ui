import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'))
const externalPackages = Object.keys({
  ...manifest.dependencies,
  ...manifest.peerDependencies,
}).filter((name) => name !== '@base-ui-components/react')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: ['**/*.test-d.tsx', '**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
      outDir: 'dist/types',
      rollupTypes: false,
      compilerOptions: { declarationMap: false },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: (id) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) return 'base-ui'
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
