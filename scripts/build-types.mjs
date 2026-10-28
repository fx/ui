import { rm } from 'node:fs/promises'
import { rollup } from 'rollup'
import { dts } from 'rollup-plugin-dts'

const bundle = await rollup({
  input: 'dist/types/index.d.ts',
  external: (id) => id !== 'recharts' && !id.startsWith('.') && !id.startsWith('/'),
  // Inline Recharts declarations: its published types import an undeclared redux dependency.
  plugins: [dts({ includeExternal: ['recharts'] })],
})
try {
  await bundle.write({ file: 'dist/index.d.ts', format: 'es' })
  await bundle.write({ file: 'dist/index.d.cts', format: 'es' })
} finally {
  await bundle.close()
}
await rm('dist/types', { recursive: true })
