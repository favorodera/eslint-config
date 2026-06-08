import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import { getModuleDefault } from '../utils'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'

/** Configuration options for stylistic ESLint rules. */
export type StylisticConfigOptions = Omit<StylisticCustomizeOptions, 'pluginName'> & Pick<SharedOptions, 'overrides'>

const stylisticDefaults: StylisticConfigOptions = {
  indent: 2,
  experimental: false,
  quotes: 'single',
  semi: false,
  jsx: false,
}

/**
 * Code style via `@stylistic/eslint-plugin`.
 * @param options - Stylistic configuration options
 * @returns Promise resolving to stylistic ESLint config items
 */
export async function stylistic(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, stylisticDefaults)

  const stylePlugin = await getModuleDefault(import('@stylistic/eslint-plugin'))

  const customizedStyleConfig = stylePlugin.configs.customize({
    pluginName: 'style',
    ...resolved,
  })

  return [
    {
      name: 'favorodera/stylistic/rules',
      plugins: { style: stylePlugin },
      rules: {
        ...customizedStyleConfig.rules,

        'style/quotes': ['error', 'single', { avoidEscape: true }],
        'style/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 2, maxBOF: 0 }],
        'style/padded-blocks': 'off',
        'style/no-trailing-spaces': ['error', { skipBlankLines: true }],
        'style/brace-style': 'off',
        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...resolved.overrides,
      },
    },
  ]
}
