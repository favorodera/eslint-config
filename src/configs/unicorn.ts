import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Creates flat config items for Unicorn code-quality rules.
 * @param options Rule overrides for Unicorn linting.
 * @returns Flat config items for this configuration group.
 */
export async function unicorn(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const unicornPlugin = await importModule(import('eslint-plugin-unicorn'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/unicorn/setup',
      plugins: { unicorn: unicornPlugin },
    },
    {
      files,
      name: 'favorodera/unicorn/rules',
      rules: {
        ...unicornPlugin.configs.recommended.rules,

        'unicorn/filename-case': 'off',
        'unicorn/name-replacements': 'off',
        'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/no-top-level-side-effects': 'off',
        'unicorn/prefer-query-selector': [
          'error',
          {
            allowWithVariables: true,
          },
        ],
        'unicorn/single-line-block-comment-style': [
          'error',
          'single-line',
        ],

        ...options.overrides,
      },
    },
  ]
}
