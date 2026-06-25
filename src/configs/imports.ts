import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for imports linting, providing plugin setup and
 * specific rules to enforce consistent import ordering and quality.
 * @returns Promise resolving to imports ESLint config items.
 */
export async function imports(): Promise<Array<TypedFlatConfigItem>> {
  const importPlugin = await importModule(import('eslint-plugin-import-lite'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  const recommendedConfig = importPlugin.configs.recommended

  const { rules = {} } = recommendedConfig
  const rest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
  ])

  return [
    {
      ...rest,
      name: 'favorodera/imports/setup',
    },
    {
      files,
      name: 'favorodera/imports/rules',
      rules: {
        ...rules,

        'import/consistent-type-specifier-style': [
          'error',
          'prefer-top-level',
        ],
        'import/first': 'error',
        'import/newline-after-import': [
          'error',
          { count: 1 },
        ],
        'import/no-duplicates': [
          'error',
          { 'prefer-inline': true },
        ],
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
      },
    },
  ]
}
