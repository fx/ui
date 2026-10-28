import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { transform } from 'lightningcss'

const root = process.cwd()
const fixture = await mkdtemp(join(root, 'node_modules', '.package-test-'))
const run = (command, args, cwd = fixture) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

try {
  const packed = run(
    'npm',
    ['pack', '--ignore-scripts', '--pack-destination', fixture],
    root,
  ).trim()
  const destination = join(fixture, 'node_modules/@fx/ui')
  await mkdir(destination, { recursive: true })
  run('tar', ['-xzf', join(fixture, packed), '-C', destination, '--strip-components=1'])
  const files = await readdir(join(destination, 'dist'))
  assert.deepEqual(files.sort(), ['index.cjs', 'index.d.cts', 'index.d.ts', 'index.js', 'styles'])

  await writeFile(
    join(fixture, 'esm.mjs'),
    "import { Button, buttonVariants } from '@fx/ui'; if (!Button || !buttonVariants({variant:'destructive'}).includes('bg-destructive')) throw Error('ESM exports');\n",
  )
  await writeFile(
    join(fixture, 'cjs.cjs'),
    "const { Button, buttonVariants } = require('@fx/ui'); if (!Button || !buttonVariants({size:'icon-lg'}).includes('size-10')) throw Error('CJS exports');\n",
  )
  run(process.execPath, ['esm.mjs'])
  run(process.execPath, ['cjs.cjs'])

  await writeFile(
    join(fixture, 'consumer.mts'),
    `import { Button, type ButtonProps, type ChartConfig } from '@fx/ui'
const props: ButtonProps = { variant: 'destructive', size: 'icon-lg' }
const chart: ChartConfig = { desktop: { label: 'Desktop', color: '#fff' } }
// @ts-expect-error unknown button variant
const bad: ButtonProps = { variant: 'unknown' }
void [Button, props, chart, bad]
`,
  )
  await writeFile(
    join(fixture, 'consumer.cts'),
    `import ui = require('@fx/ui')
const props: ui.ButtonProps = { variant: 'outline' }
void [ui.Button, props]
`,
  )
  await writeFile(
    join(fixture, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
      },
      files: ['consumer.mts', 'consumer.cts'],
    }),
  )
  run(join(root, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'])
  await writeFile(
    join(fixture, 'tsconfig-bundler.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        target: 'ES2022',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
      },
      files: ['consumer.mts'],
    }),
  )
  run(join(root, 'node_modules/.bin/tsc'), ['-p', 'tsconfig-bundler.json'])

  await mkdir(join(fixture, 'src'))
  await writeFile(
    join(fixture, 'src/index.css'),
    `@import '@fx/ui/styles/globals.css' source(none);
@source './';
@source '../node_modules/@fx/ui/dist/index.js';
`,
  )
  await writeFile(
    join(fixture, 'src/main.js'),
    "import './index.css'\nimport { buttonVariants } from '@fx/ui'\nconsole.log(buttonVariants({ variant: 'destructive', size: 'icon-lg' }))\n",
  )
  await writeFile(
    join(fixture, 'index.html'),
    '<script type="module" src="/src/main.js"></script>\n',
  )
  await writeFile(
    join(fixture, 'vite.config.mjs'),
    "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'\nexport default defineConfig({ plugins: [tailwindcss()] })\n",
  )
  run(join(root, 'node_modules/.bin/vite'), ['build'])
  const assets = join(fixture, 'dist/assets')
  const cssName = (await readdir(assets)).find((name) => name.endsWith('.css'))
  assert.ok(cssName)
  const css = await readFile(join(assets, cssName))
  const output = css.toString()
  for (const token of [
    'bg-destructive',
    'hover\\:bg-destructive',
    'size-10',
    '[stroke="#ccc"]',
    '[stroke="#fff"]',
  ]) {
    assert.ok(output.includes(token), `Missing generated CSS: ${token}`)
  }
  assert.ok(!output.includes('.prose'), 'Unexpected typography utilities')
  assert.deepEqual(
    transform({ filename: 'consumer.css', code: css, errorRecovery: true }).warnings,
    [],
  )
  console.log(`Packed ESM, CJS, NodeNext types, and Tailwind CSS verified (${css.length} bytes)`)
} finally {
  await rm(fixture, { recursive: true, force: true })
}
