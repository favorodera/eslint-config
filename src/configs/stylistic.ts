import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule, omit } from '../utils'

/** Options for configuring Stylistic formatting rules. */
export type StylisticConfigOptions = Omit<StylisticCustomizeOptions, 'pluginName'>

const stylisticDefaults: StylisticConfigOptions = {
  braceStyle: '1tbs',
  experimental: false,
  indent: 2,
  jsx: false,
  quotes: 'single',
  semi: false,
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

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  const recommendedConfig = stylePlugin.configs.customize({
    pluginName: 'style',
    ...resolved,
  })

  const { rules = {} } = recommendedConfig
  const rest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
  ])

  return [
    {
      ...rest,
      name: 'favorodera/stylistic/setup',
    },
    {
      files,
      name: 'favorodera/stylistic/rules',
      rules: {
        ...rules,

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
      },
    },
  ]
}
