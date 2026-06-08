import { factory } from './src/factory'
import { allConfigOptionsTrue } from './src/config-presets'

export default factory({
  ...allConfigOptionsTrue,
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
