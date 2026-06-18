import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring JSDoc linting rules. */
export type JSDocConfigOptions = SharedOptions

const jsdocDefaults: JSDocConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
}

/**
 * Constructs the flat config items for JSDoc linting, ensuring comments follow
 * proper styling, parameter checks, and types alignment.
 * @param options JSDoc configuration options.
 * @returns Promise resolving to JSDoc ESLint config items.
 */
export async function jsdoc(options: JSDocConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, jsdocDefaults)

  const jsdocPlugin = await importModule(import('eslint-plugin-jsdoc'))

  const baseRules = {
    ...jsdocPlugin.configs['flat/recommended-typescript-error']?.rules,
    ...jsdocPlugin.configs['flat/stylistic-typescript-error']?.rules,
  }

  return [
    {
      name: 'favorodera/jsdoc/setup',
      plugins: { jsdoc: jsdocPlugin },
    },
    {
      files: resolved.files,
      name: 'favorodera/jsdoc/rules',
      rules: {
        ...baseRules,

        'jsdoc/check-indentation': 'error',
        'jsdoc/check-template-names': 'error',
        'jsdoc/imports-as-dependencies': 'error',
        'jsdoc/lines-before-block': [
          'error',
          {
            ignoreSingleLines: false,
          },
        ],
        'jsdoc/multiline-blocks': 'error',
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-blank-block-descriptions': 'error',
        'jsdoc/no-blank-blocks': 'error',
        'jsdoc/require-throws-type': 'off',
        'jsdoc/sort-tags': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
