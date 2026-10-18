import { defu } from "defu"
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import {  jsGlob, tsGlob, vueGlob } from "../globs"

/** 
 * Constructs the flat config for imports linting
 * @returns Flat config items
 */
export async function imports(options:SharedOptions):PromisedTypedConfigFlatItemArray{
  const importPlugin = await importModule(import('eslint-plugin-import-lite'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name:'favorodera/import/setup',
      plugins:{'imports':importPlugin}
    },

    {
      files,
      name:'favorodera/import/rules',
      rules:{
        'imports/consistent-type-specifier-style': 'error',
        'imports/exports-last':'error',
        'imports/first':'error',
        'imports/newline-after-import':"error",
        "imports/no-duplicates": ["error", {"prefer-inline": true}],
        'imports/no-mutable-exports': 'error',
        'imports/no-named-default': 'error',

        ...options.overrides
      }
    }
  ]
}