import { defineConfig } from './src'

export default defineConfig({
  ignores: ['dump/', 'src/typegen.d.ts'],
  typescript: {
    overrides: {
      'ts/no-explicit-any': 'off',
      'ts/no-magic-numbers': 'off',
    },
  },
})
