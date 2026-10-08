import { defu } from "defu"
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import {  jsGlob, tsGlob, vueGlob } from "../globs"

export async function _import(_options:SharedOptions):PromisedTypedConfigFlatItemArray{
  const options = defu(_options, {})

  const importPlugin = await importModule(import('eslint-plugin-import-lite'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name:'favorodera/import/setup',
      plugins:{'import':importPlugin}
    },

    {
      files,
      name:'favorodera/import/rules',
      rules:{
        'import/consistent-type-specifier-style': [
          'error',
          'prefer-top-level',
        ],

        ...options.overrides
      }
    }
  ]
}