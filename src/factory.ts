import { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Awaitable } from 'eslint-flat-config-utils'
import { vue } from './configs/vue'
import type { VueConfigOptions } from './configs/vue'
import { ignores } from './configs/ignores'
import type { IgnoresPatterns } from './configs/ignores'
import { imports } from './configs/imports'
import type { ImportsConfigOptions } from './configs/imports'
import { javascript } from './configs/javascript'
import type { JavascriptConfigOptions } from './configs/javascript'
import { markdown } from './configs/markdown'
import type { MarkdownConfigOptions } from './configs/markdown'
import { stylistic } from './configs/stylistic'
import type { StylisticConfigOptions } from './configs/stylistic'
import { tailwind } from './configs/tailwind'
import type { TailwindConfigOptions } from './configs/tailwind'
import { typescript } from './configs/typescript'
import type { TypescriptConfigOptions } from './configs/typescript'
import type { ConfigNames } from './types/rules'
import type { TypedFlatConfigItem } from './types/utils'
import { resolveOptions } from './utils'


/** Configuration options for the ESLint flat config */
export interface ConfigOptions {
  /**
   * Enable Vue linting with optional configuration
   * @default true
  */
  vue?: boolean | VueConfigOptions

  /**
   * Enable TypeScript linting with optional configuration
   * @default true
   */
  typescript?: boolean | TypescriptConfigOptions

  /**
   * Patterns and files to ignore
   * @default ignoresGlob
   */
  ignores?: IgnoresPatterns

  /**
   * Enable stylistic rules with optional configuration
   * @default true
   */
  stylistic?: boolean | StylisticConfigOptions
  /**
   * Enable Tailwind CSS linting with optional configuration
   * @default true
   */
  tailwind?: boolean | TailwindConfigOptions

  /**
   * Enable Imports linting with optional configuration
   * @default true
   */
  imports?: boolean | ImportsConfigOptions

  /**
   * Enable Markdown linting with optional configuration
   * @default true
   */
  markdown?: boolean | MarkdownConfigOptions

  /**
   * Enable Javascript linting with optional configuration
   * @default true
   */
  javascript?: boolean | JavascriptConfigOptions
}

/**
 * Factory to create a flat ESLint config
 * @param options - Configuration options for the ESLint config
 * @returns Flat ESLint config composer
 */
export function factory(options: ConfigOptions = {}) {
  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  configs.push(ignores(options.ignores))

  const configFunctions = {
    vue,
    typescript,
    stylistic,
    tailwind,
    imports,
    markdown,
    javascript,
  }

  for (const [key, configFunction] of Object.entries(configFunctions)) {
    const configOption = (options as Record<string, unknown>)[key]
    const resolved = resolveOptions(configOption ?? true, {})
    if (resolved) configs.push(configFunction(resolved))
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer
    .append(...configs)
    .renamePlugins({
      'better-tailwindcss': 'tailwind',
      '@typescript-eslint': 'ts',
      'markdown': 'md',
      'import-lite': 'import',
    })

  return composer
}
