import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { importModule } from '../utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { renamePluginsInRules } from 'eslint-flat-config-utils'

export type ImportsConfigOptions = SharedOptions

const importsDefaults: ImportsConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

export async function imports(options: ImportsConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, importsDefaults)

  const [importPlugin, unusedImportsPlugin] = await Promise.all([
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
      name: 'favorodera/imports/rules',
      files: resolved.files,
      rules: {
        ...renamePluginsInRules(baseRules, { 'import-lite': 'import' }),

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
