export const vueGlob = '**/*.vue' 

export const tsGlob = '**/*.?([cm])ts' 

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