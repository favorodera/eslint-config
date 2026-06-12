import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Stylistic formatting rules. */
export type StylisticConfigOptions = SharedOptions & {
  settings?: Omit<StylisticCustomizeOptions, 'pluginName'>
}

const stylisticDefaults: StylisticConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
  settings: {
    braceStyle: '1tbs',
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

        'style/array-bracket-newline': 'error',
        'style/array-element-newline': 'error',
        'style/curly-newline': [
          'error',
          'always',
        ],
        'style/function-call-argument-newline': [
          'error',
          'consistent',
        ],
        'style/function-call-spacing': 'error',
        'style/function-paren-newline': 'error',
        'style/implicit-arrow-linebreak': 'error',
        'style/line-comment-position': 'error',
        'style/linebreak-style': 'error',
        'style/multiline-comment-style': [
          'error',
          'separate-lines',
        ],
        'style/newline-per-chained-call': 'error',
        'style/no-confusing-arrow': 'error',
        'style/no-extra-semi': 'error',
        'style/nonblock-statement-body-position': 'error',
        'style/object-curly-newline': 'error',
        'style/semi-style': 'error',
        'style/switch-colon-spacing': 'error',
        'style/wrap-regex': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
