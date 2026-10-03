import { tailwind4 } from 'tailwind-csstree'
import type { TypedFlatConfigItem } from '../types/utils'
import { cssGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for CSS linting, providing a collection of
 * awesome ESLint rules to improve code quality and enforce best practices.
 * @returns Promise resolving to CSS ESLint config items.
 */
export async function css(): Promise<Array<TypedFlatConfigItem>> {
  const cssPlugin = await importModule(import('@eslint/css'))
  const cssicornPlugin = await importModule(import('eslint-cssicorn'))

  const files = [cssGlob]

  const cssRecommendedConfig = cssPlugin.configs.recommended
  const cssicornRecommendedConfig = cssicornPlugin.configs.recommended

  const { rules: cssRules = {} } = cssRecommendedConfig
  const cssRest = omit(cssRecommendedConfig, [
    'rules',
    'name',
  ])

  const { rules: cssicornRules = {} } = cssicornRecommendedConfig
  const cssicornRest = omit(cssicornRecommendedConfig, [
    'rules',
    'name',
    'files',
    'language',
    'languageOptions'
  ])

  return [
    {
      ...cssRest,
      name: 'favorodera/css/setup',
    },
    {
      ...cssicornRest,
      name: 'favorodera/css/cssicorn/setup',
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
        ...cssRules,

        'css/prefer-logical-properties': 'error',
        'css/relative-font-units': 'error',
      },
    },
    {
      files,
      language: 'css/css',
      languageOptions: {
        customSyntax: tailwind4,
        tolerant: true,
      },
      name: 'favorodera/css/cssicorn/rules',
      rules: {
        ...cssicornRules,

      },
    },
  ]
}
