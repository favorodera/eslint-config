import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
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
 * specific rules to enforce consistent import ordering and quality.
 * @param options Configuration options for imports linting.
 * @returns Promise resolving to imports ESLint config items.
 */
export async function imports(options: ImportsConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, importsDefaults)

  const importPlugin = await importModule(import('eslint-plugin-import-lite'))

  const baseRules = importPlugin.configs.recommended?.rules || {}

  return [
    {
      name: 'favorodera/imports/setup',
      plugins: {
        import: importPlugin,
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

        ...resolved.overrides,
      },
    },
  ]
}
