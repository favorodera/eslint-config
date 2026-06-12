import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring unused imports linting rules. */
export type UnusedImportsConfigOptions = SharedOptions

const unusedImportsDefaults: UnusedImportsConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
}

/**
 * Constructs the flat config items for unused imports linting, providing plugin setup and
 * specific rules to detect and remove unused imports and variables.
 * @param options Configuration options for unused imports linting.
 * @returns Promise resolving to unused imports ESLint config items.
 */
export async function unusedImports(options: UnusedImportsConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, unusedImportsDefaults)

  const unusedImportsPlugin = await importModule(import('eslint-plugin-unused-imports'))

  return [
    {
      name: 'favorodera/unused-imports/setup',
      plugins: {
        'unused-imports': unusedImportsPlugin,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/unused-imports/rules',
      rules: {
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],

        ...resolved.overrides,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/unused-imports/disables',
      rules: {
        'no-unused-vars': 'off',
        'ts/no-unused-vars': 'off',
      },
    },
  ]
}
