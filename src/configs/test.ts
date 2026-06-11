import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { testGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring test (Vitest) linting rules. */
export type TestConfigOptions = SharedOptions

const testDefaults: TestConfigOptions = {
  files: [testGlob],
}

/**
 * Constructs the flat config items for test linting, extending
 * the recommended Vitest rule sets.
 * @param options Test configuration options.
 * @returns Promise resolving to test ESLint config items.
 */
export async function test(options: TestConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, testDefaults)

  const testPlugin = await importModule(import('@vitest/eslint-plugin'))

  const baseRules = extractRules(testPlugin.configs.recommended as any)

  return [
    {
      name: 'favorodera/test/setup',
      plugins: { test: testPlugin },
    },
    {
      files: resolved.files,
      name: 'favorodera/test/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { vitest: 'test' }),

        'test/consistent-each-for': ['error', {
          describe: 'for',
          it: 'for',
          suite: 'for',
          test: 'for',
        }],
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/consistent-vitest-vi': 'error',
        'test/hoisted-apis-on-top': 'error',
        'test/max-expects': 'error',
        'test/max-nested-describe': 'error',
        'test/no-alias-methods': 'error',
        'test/no-conditional-in-test': 'error',
        'test/no-conditional-tests': 'error',
        'test/no-duplicate-hooks': 'error',
        'test/no-hooks': 'error',
        'test/no-large-snapshots': 'warn',
        'test/no-test-prefixes': 'error',
        'test/no-test-return-statement': 'error',
        'test/padding-around-all': 'error',
        'test/prefer-called-times': 'error',
        'test/prefer-called-with': 'error',
        'test/prefer-comparison-matcher': 'error',
        'test/prefer-each': 'error',
        'test/prefer-equality-matcher': 'error',
        'test/prefer-expect-resolves': 'error',
        'test/prefer-expect-type-of': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-hooks-on-top': 'error',
        'test/prefer-import-in-mock': 'error',
        'test/prefer-importing-vitest-globals': 'error',
        'test/prefer-lowercase-title': 'error',
        'test/prefer-mock-promise-shorthand': 'error',
        'test/prefer-mock-return-shorthand': 'error',
        'test/prefer-snapshot-hint': 'error',
        'test/prefer-spy-on': 'error',
        'test/prefer-strict-boolean-matchers': 'error',
        'test/prefer-strict-equal': 'error',
        'test/prefer-to-be': 'error',
        'test/prefer-to-be-object': 'error',
        'test/prefer-to-contain': 'error',
        'test/prefer-to-have-been-called-times': 'error',
        'test/prefer-to-have-length': 'error',
        'test/prefer-todo': 'error',
        'test/prefer-vi-mocked': 'error',
        'test/require-awaited-expect-poll': 'error',
        'test/require-hook': 'error',
        'test/require-to-throw-message': 'error',
        'test/require-top-level-describe': 'error',
        'test/warn-todo': 'warn',

        ...resolved.overrides,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/test/disables',
      rules: {
        'no-unused-expressions': 'off',
        'node/prefer-global/process': 'off',
      },
    },
  ]
}
