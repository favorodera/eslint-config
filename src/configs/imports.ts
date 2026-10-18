import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import {  jsGlob, tsGlob, vueGlob } from "../globs"

/** 
 * Constructs the flat config for imports linting
 * @returns Flat config items
 */
export async function imports(options:SharedOptions):PromisedTypedConfigFlatItemArray{
  const importsPlugin = await importModule(import('eslint-plugin-import-lite'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name:'favorodera/imports/setup',
      plugins:{'imports':importsPlugin}
    },

    {
      files,
      name:'favorodera/imports/rules',
      rules:{
        'imports/consistent-type-specifier-style': ['error','prefer-top-level',],
        'imports/exports-last':'error',
        'imports/first':'error',
        'imports/newline-after-import': ['error',{ count: 1 },],
        "imports/no-duplicates": ["error", {"prefer-inline": true}],
        'imports/no-mutable-exports': 'error',
        'imports/no-named-default': 'error',

        ...options.overrides
      }
    }
  ]
}