import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { getModuleDefault, renameRules } from '../utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'

/** Configuration options for imports & unused imports ESLint rules. */
export type ImportsConfigOptions = SharedOptions

const importsDefaults: ImportsConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Imports & unused imports linting via `eslint-plugin-import-lite` and `eslint-plugin-unused-imports`.
 * @param options - Imports & unused imports configuration options
 * @returns Promise resolving to imports & unused imports ESLint config items
 */
export async function imports(options: ImportsConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, importsDefaults)

  const [importPlugin, unusedImportsPlugin] = await Promise.all([
    getModuleDefault(import('eslint-plugin-import-lite')),
    getModuleDefault(import('eslint-plugin-unused-imports')),
  ])

  return [
    {
      name: 'favorodera/imports/rules',
      files: resolved.files,
      plugins: {
        'import': importPlugin,
        'unused-imports': unusedImportsPlugin,
      },
      rules: {
        ...renameRules(importPlugin.configs.recommended?.rules || {}, { 'import-lite': 'import' }),

        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/newline-after-import': ['error', { count: 1 }],

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
  ]
}
