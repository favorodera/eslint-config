/** Glob pattern for matching JavaScript files */
export const jsGlob = '**/*.{js,cjs,mjs}'

/** Glob pattern for matching TypeScript files */
export const tsGlob = '**/*.{ts,cts,mts}'

/** Glob pattern for matching Vue single-file components */
export const vueGlob = '**/*.vue'

/** Glob pattern for matching Markdown files */
export const mdGlob = '**/*.md'

/** Glob pattern for matching virtual files extracted from Markdown */
export const mdInMdGlob = '**/*.md/*.md'

/** Glob pattern for matching code blocks embedded in Markdown files */
export const codeInMdGlob = '**/*.md/**/*.{js,cjs,mjs,ts,cts,mts,vue}'

/** Glob pattern for matching scripts files */
export const scriptsGlob = '**/*.{js,cjs,mjs,ts,cts,mts}'

/** Glob pattern for matching test files */
export const testsGlob = [
  '**/*.{tests,specs,benchmark,bench}.{js,cjs,mjs,ts,cts,mts}',
  '**/__tests__/**/*.{js,cjs,mjs,ts,cts,mts}',
]

/** Glob pattern for matching JSON files */
export const jsonGlob = '**/*.json'

/** Glob pattern for matching JSON5 files */
export const json5Glob = '**/*.json5'

/** Glob pattern for matching JSON with Comments files */
export const jsoncGlob = '**/*.jsonc'

/** Glob patterns for matching TypeScript configuration files */
export const tsConfigGlob = [
  '**/tsconfig.json',
  '**/tsconfig.*.json',
]

/** Glob pattern for matching YAML files */
export const yamlGlob = '**/*.{yml,yaml}'

/** Glob pattern for matching pnpm-workspace.yaml file */
export const pnpmWorkspaceGlob = 'pnpm-workspace.yaml'

/** Glob pattern for matching package.json files */
export const packageJsonGlob = '**/package.json'

/**
 * Common glob patterns for files and directories that should be ignored by ESLint.
 * Includes node_modules, build outputs, lock files, temporary files, and tool-specific caches.
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
