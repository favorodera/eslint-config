import { factory } from './src/factory'

export default factory({
  tailwind: false,
})
  .append({
    ignores: ['src/types/rules.d.ts'],
  })
  .overrides({
    'favorodera/typescript/rules': {
      rules: {
        'ts/no-explicit-any': 'off',
      },
    },
  })
