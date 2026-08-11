import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    typecheck: {
      // A component's public props are part of its contract, and a broken prop
      // type only fails for consumers — never for a runtime test, which esbuild
      // strips the types out of. `*.test-d.tsx` files assert the contract.
      enabled: true,
      // Report only the assertions, not the strictness errors those files
      // happen to pull in from the rest of the source tree.
      ignoreSourceErrors: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
