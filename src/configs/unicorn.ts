import { defu } from 'defu'
import globals from 'globals'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Unicorn linting rules. */
export type UnicornConfigOptions = SharedOptions

const unicornDefaults: UnicornConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
}

/**
 * Constructs the flat config items for Unicorn linting, providing a collection of
 * awesome ESLint rules to improve code quality and enforce best practices.
 * @param options Unicorn configuration options.
 * @returns Promise resolving to Unicorn ESLint config items.
 */
export async function unicorn(options: UnicornConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, unicornDefaults)

  const unicornPlugin = await importModule(import('eslint-plugin-unicorn'))

  const baseRules = unicornPlugin.configs.recommended?.rules || {}

  return [
    {
      name: 'favorodera/unicorn/setup',
      plugins: { unicorn: unicornPlugin },
    },
    {
      files: resolved.files,
      languageOptions: {
        globals: globals.builtin,
      },
      name: 'favorodera/unicorn/rules',
      rules: {
        ...baseRules,

        'unicorn/filename-case': 'off',
        'unicorn/prevent-abbreviations': [
          'error',
          {
            allowList: {
              props: true,
              utils: true,
            },
          },
        ],

        ...resolved.overrides,
      },
    },
  ]
}
