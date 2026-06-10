import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { testsGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring test (Vitest) linting rules. */
export type TestConfigOptions = SharedOptions

const testDefaults: TestConfigOptions = {
  files: testsGlob,
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

        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

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
