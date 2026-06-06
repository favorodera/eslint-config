import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    tsgo: true,
  },
  exports: true,
  format: ['esm', 'cjs'],
    clean: true,
})
