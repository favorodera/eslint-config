import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for JSDoc linting, ensuring comments follow
 * proper styling, parameter checks, and types alignment.
 * @returns Promise resolving to JSDoc ESLint config items.
 */
export async function jsdoc(): Promise<Array<TypedFlatConfigItem>> {
  const jsdocPlugin = await importModule(import('eslint-plugin-jsdoc'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  const recommendedConfig = jsdocPlugin.configs['flat/recommended-typescript-error']
  const stylisticConfig = jsdocPlugin.configs['flat/stylistic-typescript-error']

  const { rules: recommendedRules = {} } = recommendedConfig
  const recommendedRest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
  ])

  const { rules: stylisticRules = {} } = stylisticConfig
  const stylisticRest = omit(stylisticConfig, [
    'rules',
    'files',
    'name',
  ])

  const rules = {
    ...recommendedRules,
    ...stylisticRules,
  }

  return [
    {
      ...recommendedRest,
      name: 'favorodera/jsdoc/recommended/setup',
    },
    {
      ...stylisticRest,
      name: 'favorodera/jsdoc/stylistic/setup',
    },
    {
      files,
      name: 'favorodera/jsdoc/rules',
      rules: {
        ...rules,

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
        'jsdoc/sort-tags': 'error',
      },
    },
  ]
}
