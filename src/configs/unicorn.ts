import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for Unicorn linting, providing a collection of
 * awesome ESLint rules to improve code quality and enforce best practices.
 * @returns Promise resolving to Unicorn ESLint config items.
 */
export async function unicorn(): Promise<Array<TypedFlatConfigItem>> {
  const unicornPlugin = await importModule(import('eslint-plugin-unicorn'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  const recommendedConfig = unicornPlugin.configs.recommended

  const { rules = {} } = recommendedConfig
  const rest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
  ])

  return [
    {
      ...rest,
      name: 'favorodera/unicorn/setup',
    },
    {
      files,
      name: 'favorodera/unicorn/rules',
      rules,
    },
  ]
}
