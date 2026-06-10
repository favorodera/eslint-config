import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Stylistic formatting rules. */
export type StylisticConfigOptions = SharedOptions & {
  settings?: Omit<StylisticCustomizeOptions, 'pluginName'>
}

const stylisticDefaults: StylisticConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
  settings: {
    experimental: false,
    indent: 2,
    jsx: false,
    quotes: 'single',
    semi: false,
  },
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
      files: resolved.files,
      name: 'favorodera/stylistic/rules',
      rules: {
        ...baseRules,

        'style/brace-style': 'off',
        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 2 }],
        'style/no-trailing-spaces': ['error', { skipBlankLines: true }],
        'style/padded-blocks': 'off',
        'style/quotes': ['error', 'single', { avoidEscape: true }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...resolved.overrides,
      },
    },
  ]
}
