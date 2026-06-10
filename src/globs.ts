export const jsGlob = '**/*.{js,cjs,mjs}'

export const tsGlob = '**/*.{ts,cts,mts}'

export const vueGlob = '**/*.vue'

export const mdGlob = '**/*.md'

// virtual files extracted from markdown by the processor
export const mdInMdGlob = '**/*.md/*.md'
export const codeInMdGlob = '**/*.md/**/*.{js,cjs,mjs,ts,cts,mts,vue}'

export const jsonGlob = '**/*.json'
export const json5Glob = '**/*.json5'
export const jsoncGlob = '**/*.jsonc'

export const tsConfigGlob = [
  '**/tsconfig.json',
  '**/tsconfig.*.json',
]

export const packageJsonGlob = '**/package.json'

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
