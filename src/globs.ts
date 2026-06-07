/** Glob pattern for Vue template files */
export const vueGlob = '**/*.vue'

/** Glob pattern for TypeScript files (*.ts, *.cts, *.mts) */
export const tsGlob = '**/*.?([cm])ts'

export const tailwindGlob = [
  vueGlob,
  tsGlob,
]

/**
 * Default glob patterns for files and directories to ignore
 * Includes common build outputs, dependencies, caches, and temporary files
 */
export const ignoresGlob = [
  '**/node_modules',
  '**/dist',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lockb',

  '**/output',
  '**/coverage',
  '**/temp',
  '**/.temp',
  '**/tmp',
  '**/.tmp',
  '**/.history',
  '**/.vitepress/cache',
  '**/.nuxt',
  '**/.next',
  '**/.svelte-kit',
  '**/.vercel',
  '**/.changeset',
  '**/.idea',
  '**/.cache',
  '**/.output',
  '**/.vite-inspect',
  '**/.yarn',

  '**/CHANGELOG*.md',
  '**/LICENSE*',
  '**/*.min.*',
  '**/__snapshots__',

  // Tools temp files
  '**/vite.config.*.timestamp-*',
  '**/auto-import?(s).d.ts',
  '**/components.d.ts',

  // AI related
  '**/.context',
  '**/.claude',
  '**/.agents',
  '**/.*/skills',
]
