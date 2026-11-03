import { defineConfig } from './src'

export default defineConfig({
  ignores: ['src/typegen.d.ts'],
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
      'typescript/no-magic-numbers': 'off',
    },
  },
})
  .append({
    files: ['package.json'],
    rules: { 'jsonc/array-bracket-newline': 'off' },
  })
