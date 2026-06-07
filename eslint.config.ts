import { factory } from './src'

export default factory({
  vue: true,
  typescript: true,
  stylistic: true,
})
  .overrides({
    'favorodera/typescript/rules': {
      rules: {
        'ts/no-explicit-any': 'off',
      },
    },
  })
