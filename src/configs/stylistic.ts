import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Stylistic formatting rules. */
export type StylisticConfigOptions = SharedOptions & {
  settings?: Omit<StylisticCustomizeOptions, 'pluginName'>
}

const stylisticDefaults: StylisticConfigOptions = {
  settings: {
    indent: 2,
    experimental: false,
    quotes: 'single',
    semi: false,
    jsx: false,
  },
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Constructs the flat config items for Stylistic linting, applying customized
 * formatting settings such as quotes, indentation, and spacing.
 * @param options Stylistic configuration options.
 * @returns Promise resolving to stylistic ESLint config items.
 */
export async function stylistic(options: StylisticConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, stylisticDefaults)

  const stylePlugin = await importModule(import('@stylistic/eslint-plugin'))

  const config = stylePlugin.configs.customize({
    pluginName: 'style',
    ...resolved.settings,
  })

  const baseRules = config?.rules || {}

  return [
    {
      name: 'favorodera/stylistic/setup',
      plugins: { style: stylePlugin },
    },
    {
      name: 'favorodera/stylistic/rules',
      files: resolved.files,
      rules: {
        ...baseRules,

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
