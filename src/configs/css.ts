import { tailwind4 } from 'tailwind-csstree'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { cssGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Constructs the flat config for core css linting
 * @returns Flat config items
 */
export async function css(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const cssPlugin = await importModule(import('@eslint/css'))

  const files = [cssGlob]

  return [

    {
      name: 'favorodera/css/setup',
      plugins: { css: cssPlugin },
    },

    {
      files,
      language: 'css/css',
      languageOptions: {
        customSyntax: tailwind4,
        tolerant: true,
      },
      name: 'favorodera/css/rules',
      rules: {
        ...cssPlugin.configs.recommended.rules,

        'css/prefer-logical-properties': 'error',
        'css/relative-font-units': 'error',

        ...options.overrides,
      },
    },
  ]
}
