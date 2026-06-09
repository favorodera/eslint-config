/** Glob pattern for JavaScript linting */
export const jsGlob = '**/*.{js,cjs,mjs}'

/** Glob pattern for TypeScript linting */
export const tsGlob = '**/*.{ts,cts,mts}'

/** Glob pattern for Vue linting */
export const vueGlob = '**/*.vue'

/** Glob pattern for Markdown linting */
export const mdGlob = '**/*.md'

/** Glob pattern for scripts */
export const scriptsGlob = '**/*.?([cm])[jt]s'

/**
 * Default glob patterns for files and directories to ignore
 * Includes common build outputs, dependencies, caches, and temporary files
 */
export const ignoresGlob = [
  '**/node_modules/**',
  '**/dist/**',
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
