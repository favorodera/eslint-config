import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Options for Stylistic formatting rules.
 * @template isInternal - Allows the internal `pluginName` option when `true`.
 */
export type StylisticOptions<isInternal extends boolean = false> = SharedOptions & {
  /** Options passed to the Stylistic plugin customization helper. */
  settings?: isInternal extends true ? StylisticCustomizeOptions : Omit<StylisticCustomizeOptions, 'pluginName'>
}

/** Default code-style settings used by the Stylistic plugin. */
const stylisticDefaults: StylisticOptions<true> = {
  overrides: undefined,
  settings: {
    arrowParens: true,
    blockSpacing: true,
    braceStyle: '1tbs',
    commaDangle: 'always-multiline',
    experimental: false,
    indent: 2,
    jsx: false,
    pluginName: 'stylistic',
    quoteProps: 'consistent-as-needed',
    quotes: 'single',
    semi: false,
    severity: 'error',
  },
}

/**
 * Creates flat config items for code style and formatting rules.
 * @param options Stylistic settings and rule overrides.
 * @returns Flat config items for this configuration group.
 */
export async function stylistic(options: StylisticOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, stylisticDefaults)

  const stylisticPlugin = await importModule(import('@stylistic/eslint-plugin'))

  const files = [
    jsGlob,
    vueGlob,
    tsGlob,
  ]

  return [
    {
      name: 'favorodera/stylistic/setup',
      plugins: { stylistic: stylisticPlugin },
    },

    {
      files,
      name: 'favorodera/stylistic/rules',
      rules: {
        ...stylisticPlugin.configs.customize(resolvedOptions.settings).rules,

        'stylistic/array-bracket-newline': 'error',
        'stylistic/array-element-newline': [
          'error',
          'consistent',
        ],
        'stylistic/curly-newline': [
          'error',
          'always',
        ],
        'stylistic/function-call-argument-newline': [
          'error',
          'consistent',
        ],
        'stylistic/function-call-spacing': 'error',
        'stylistic/function-paren-newline': 'error',
        'stylistic/implicit-arrow-linebreak': 'error',
        'stylistic/linebreak-style': 'error',
        'stylistic/multiline-comment-style': 'error',
        'stylistic/newline-per-chained-call': 'error',
        'stylistic/no-confusing-arrow': 'error',
        'stylistic/no-extra-semi': 'error',
        'stylistic/nonblock-statement-body-position': 'error',
        'stylistic/object-curly-newline': 'error',
        'stylistic/semi-style': 'error',
        'stylistic/switch-colon-spacing': 'error',
        'stylistic/wrap-regex': 'error',

        ...resolvedOptions.overrides,
      },
    },
  ]
}
