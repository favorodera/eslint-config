import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  exports: true,
  fromVite: 'vitest',
  minify: true,
})
