import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import {  jsGlob, tsGlob, vueGlob } from "../globs"
import globals from 'globals'

/** 
 * Constructs the flat config for core javascript linting
 * @returns Flat config items
 */
export async function javascript(options:SharedOptions):PromisedTypedConfigFlatItemArray{
  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name:'favorodera/javascript/setup',
        languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },

    {
      files,
      name:'favorodera/javascript/rules',
      rules:{
        'no-useless-return': 'error',

        ...options.overrides
      }
    }
  ]
}