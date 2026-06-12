import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring imports linting rules. */
export type ImportsConfigOptions = SharedOptions

const importsDefaults: ImportsConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
}

/**
 * Constructs the flat config items for imports linting, providing plugin setup and
 * specific rules to enforce consistent import ordering and unused variable checks.
 * @param options Configuration options for imports linting.
 * @returns Promise resolving to imports ESLint config items.
 */
export async function imports(options: ImportsConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, importsDefaults)

  const [
    importPlugin,
    unusedImportsPlugin,
  ] = await Promise.all([
    importModule(import('eslint-plugin-import-lite')),
    importModule(import('eslint-plugin-unused-imports')),
  ])

  const baseRules = importPlugin.configs.recommended?.rules || {}

  return [
    {
      name: 'favorodera/imports/setup',
      plugins: {
        'import': importPlugin,
        'unused-imports': unusedImportsPlugin,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/imports/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { 'import-lite': 'import' }),

        'import/consistent-type-specifier-style': [
          'error',
          'prefer-top-level',
        ],
        'import/first': 'error',
        'import/newline-after-import': [
          'error',
          { count: 1 },
        ],
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',

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
