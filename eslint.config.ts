import { defineConfig } from './src'

export default defineConfig({
  ignores: ['src/typegen.d.ts'],
})
  // .overrides({
  //   'favorodera/typescript/rules': {
  //     rules: {
  //       'ts/no-explicit-any': 'off',
  //     },
  //   },
  // })
