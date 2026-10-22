import { defineConfig } from './src'

export default defineConfig({
  ignores: ['src/typegen.d.ts'],
  typescript:{
    overrides:{
      'ts/no-explicit-any':'off'
    }
  }
})

