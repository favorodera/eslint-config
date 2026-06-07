import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { getModuleDefault, renameRules } from '../utils'

/** Configuration options for imports ESLint rules. */
export type ImportsConfigOptions = Pick<SharedOptions, 'overrides'>

/** Default imports configuration values. */
const importsDefaults: ImportsConfigOptions = {}

/**
 * Import linting via `eslint-plugin-import`.
 * @param options - Imports configuration options
 * @returns Promise resolving to imports ESLint config items
 */
export async function imports(options: ImportsConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, importsDefaults)

  const importPlugin = await getModuleDefault(import('eslint-plugin-import-lite'))

  return [
    {
      name: 'favorodera/imports/rules',
      plugins: { import: importPlugin },
      rules: {
        ...renameRules(importPlugin.configs.recommended?.rules || {}, { 'import-lite': 'import' }),

        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/newline-after-import': ['error', { count: 1 }],

        ...resolved.overrides,
      },
    },
  ]
}
