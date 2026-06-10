import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import globals from 'globals'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Unicorn linting rules. */
export type UnicornConfigOptions = SharedOptions

const unicornDefaults: UnicornConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
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

  const baseRules = unicornPlugin.configs.unopinionated?.rules || {}

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

        'unicorn/consistent-empty-array-spread': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-instanceof-builtins': 'error',
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/number-literal-case': 'error',
        'unicorn/prefer-dom-node-text-content': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/throw-new-error': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
