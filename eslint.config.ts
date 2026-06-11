import { factory } from './src'

export default factory()
  .append({
    ignores: ['src/types/rules.d.ts'],
  })
  .overrides({
    'favorodera/typescript/rules': {
      rules: {
        'ts/no-explicit-any': 'off',
      },
    },
    'favorodera/unicorn/rules': {
      rules: {
        'unicorn/prevent-abbreviations': 'off',
      },
    },
  })
