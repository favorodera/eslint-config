import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { testGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Creates flat config items for Vitest test files.
 * @param options Rule overrides for Vitest linting.
 * @returns Flat config items for this configuration group.
 */
export async function vitest(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const vitestPlugin = await importModule(import('@vitest/eslint-plugin'))

  const files = [testGlob]

  return [
    {
      name: 'favorodera/vitest/setup',
      plugins: { vitest: vitestPlugin },
    },

    {
      files,
      name: 'favorodera/vitest/rules',
      rules: {
        ...vitestPlugin.configs.recommended.rules,

        'vitest/consistent-each-for': [
          'error',
          {
            describe: 'for',
            it: 'for',
            suite: 'for',
            test: 'for',
          },
        ],
        'vitest/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'vitest/consistent-vitest-vi': 'error',
        'vitest/hoisted-apis-on-top': 'error',
        'vitest/max-nested-describe': 'error',
        'vitest/no-alias-methods': 'error',
        'vitest/no-conditional-in-test': 'error',
        'vitest/no-conditional-tests': 'error',
        'vitest/no-duplicate-hooks': 'error',
        'vitest/no-large-snapshots': 'warn',
        'vitest/no-test-prefixes': 'error',
        'vitest/no-test-return-statement': 'error',
        'vitest/padding-around-all': 'error',
        'vitest/prefer-called-times': 'error',
        'vitest/prefer-called-with': 'error',
        'vitest/prefer-comparison-matcher': 'error',
        'vitest/prefer-each': 'error',
        'vitest/prefer-equality-matcher': 'error',
        'vitest/prefer-expect-resolves': 'error',
        'vitest/prefer-expect-type-of': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-hooks-on-top': 'error',
        'vitest/prefer-import-in-mock': 'error',
        'vitest/prefer-importing-vitest-globals': 'error',
        'vitest/prefer-lowercase-title': 'error',
        'vitest/prefer-mock-promise-shorthand': 'error',
        'vitest/prefer-mock-return-shorthand': 'error',
        'vitest/prefer-snapshot-hint': 'error',
        'vitest/prefer-spy-on': 'error',
        'vitest/prefer-strict-boolean-matchers': 'error',
        'vitest/prefer-strict-equal': 'error',
        'vitest/prefer-to-be': 'error',
        'vitest/prefer-to-be-object': 'error',
        'vitest/prefer-to-contain': 'error',
        'vitest/prefer-to-have-been-called-times': 'error',
        'vitest/prefer-to-have-length': 'error',
        'vitest/prefer-todo': 'error',
        'vitest/prefer-vi-mocked': 'error',
        'vitest/require-awaited-expect-poll': 'error',
        'vitest/require-hook': 'error',
        'vitest/require-to-throw-message': 'error',
        'vitest/require-top-level-describe': 'error',
        'vitest/warn-todo': 'error',

        ...options.overrides,
      },
    },
  ]
}
