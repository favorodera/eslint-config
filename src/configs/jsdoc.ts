import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Creates flat config items for JSDoc validation and style rules.
 * @param options Rule overrides for JSDoc linting.
 * @returns Flat config items for this configuration group.
 */
export async function jsdoc(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const jsdocPlugin = await importModule(import('eslint-plugin-jsdoc'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/jsdoc/setup',
      plugins: { jsdoc: jsdocPlugin },
    },

    {
      files,
      name: 'favorodera/jsdoc/rules',
      rules: {
        ...jsdocPlugin.configs['flat/recommended-typescript-error'].rules,
        ...jsdocPlugin.configs['flat/stylistic-typescript-error'].rules,

        'jsdoc/check-indentation': 'error',
        'jsdoc/check-template-names': 'error',
        'jsdoc/imports-as-dependencies': 'error',
        'jsdoc/lines-before-block': [
          'error',
          { ignoreSingleLines: false },
        ],
        'jsdoc/multiline-blocks': 'error',
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-blank-block-descriptions': 'error',
        'jsdoc/no-blank-blocks': 'error',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-throws-type': 'off',
        'jsdoc/sort-tags': 'error',

        ...options.overrides,
      },
    },
  ]
}
