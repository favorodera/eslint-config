import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import { jsGlob, tsGlob, vueGlob, } from "../globs"

/** 
 * Constructs the flat config for unused imports linting
 * @returns Flat config items
 */
export async function unusedImports(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const unusedImportsPlugin = await importModule(import('eslint-plugin-unused-imports'))

  const files = [
    tsGlob,
    vueGlob,
    jsGlob
  ]

  return [
    {
      name: 'favorodera/unused-imports/setup',
      plugins: { 'unused-imports': unusedImportsPlugin, },
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

        ...options.overrides
      }
    }
  ]
}