import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Constructs the flat config items for unused imports linting, providing plugin setup and
 * specific rules to detect and remove unused imports and variables.
 * @returns Promise resolving to unused imports ESLint config items.
 */
export async function unusedImports(): Promise<Array<TypedFlatConfigItem>> {
  const unusedImportsPlugin = await importModule(import('eslint-plugin-unused-imports'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/unused-imports/setup',
      plugins: {
        'unused-imports': unusedImportsPlugin,
      },
    },
    {
      files,
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
      },
    },
    {
      files,
      name: 'favorodera/unused-imports/disables',
      rules: {
        'no-unused-vars': 'off',
        'ts/no-unused-vars': 'off',
      },
    },
  ]
}
