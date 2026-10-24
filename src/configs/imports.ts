import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Creates flat config items for import ordering and import-quality rules.
 * @param options Rule overrides for import linting.
 * @returns Flat config items for this configuration group.
 */
export async function imports(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const importsPlugin = await importModule(import('eslint-plugin-import-lite'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/imports/setup',
      plugins: { imports: importsPlugin },
    },

    {
      files,
      name: 'favorodera/imports/rules',
      rules: {
        ...importsPlugin.configs.recommended.rules,

        'imports/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        'imports/first': 'error',
        'imports/newline-after-import': ['error', { count: 1 }],
        'imports/no-duplicates': ['error', { 'prefer-inline': true }],
        'imports/no-mutable-exports': 'error',
        'imports/no-named-default': 'error',

        ...options.overrides,
      },
    },
  ]
}
