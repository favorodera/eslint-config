import { FlatConfigComposer, type Awaitable } from 'eslint-flat-config-utils'
import type { TypedFlatConfigItem } from './types/utils'
import { resolveOptions } from './utils'
import { vue, type VueConfigOptions } from './configs/vue'
import { typescript, type TypescriptConfigOptions } from './configs/typescript'
import { ignores, type IgnoresPatterns } from './configs/ignores'
import { stylistic, type StylisticConfigOptions } from './configs/stylistic'
import type { ConfigNames } from './types/rules'

/** Configuration options for the ESLint flat config */
export type ConfigOptions = {
  /**
   * Enable Vue linting with optional configuration
   * @default false
  */
  vue?: boolean | VueConfigOptions
  /**
   * Enable TypeScript linting with optional configuration
   * @default false
   */
  typescript?: boolean | TypescriptConfigOptions
  /**
   * Patterns and files to ignore
   * @default ignoresGlob
   */
  ignores?: IgnoresPatterns
  /**
   * Enable stylistic rules with optional configuration
   * @default false
   */
  stylistic?: boolean | StylisticConfigOptions
}

const pluginRenames = {
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'n': 'node',
}

/**
 * Factory to create a flat ESLint config
 * @param options - Configuration options for the ESLint config
 * @returns Flat ESLint config composer
 */
export function factory(options: ConfigOptions = {}) {
  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  configs.push(ignores(options.ignores))

  const vueOptions = resolveOptions(options.vue, {})
  const typescriptOptions = resolveOptions(options.typescript, {})
  const stylisticOptions = resolveOptions(options.stylistic, {})

  if (vueOptions) configs.push(vue(vueOptions))
  if (typescriptOptions) configs.push(typescript(typescriptOptions))
  if (stylisticOptions) configs.push(stylistic(stylisticOptions))

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer.append(...configs)

  composer.renamePlugins(pluginRenames)
  return composer
}
