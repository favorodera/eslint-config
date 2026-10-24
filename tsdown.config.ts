import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: {
    globs: 'src/globs.ts',
    index: 'src/index.ts',
    types: 'src/types.ts',
    utils: 'src/utils.ts',
  },
  // exports: true,
  fromVite: 'vitest',
  minify: true,
})
