import { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Awaitable } from 'eslint-flat-config-utils'
import { vue, type VueConfigOptions } from './configs/vue'
import { ignores, type IgnoresPatterns } from './configs/ignores'
import { imports, type ImportsConfigOptions } from './configs/imports'
import { javascript, type JavascriptConfigOptions } from './configs/javascript'
import { markdown, type MarkdownConfigOptions } from './configs/markdown'
import { stylistic, type StylisticConfigOptions } from './configs/stylistic'
import { tailwind, type TailwindConfigOptions } from './configs/tailwind'
import { typescript, type TypescriptConfigOptions } from './configs/typescript'
import type { ConfigNames } from './types/rules'
import type { TypedFlatConfigItem } from './types/utils'
import { resolveOptions } from './utils'
import { jsonc, type JSONCConfigOptions } from './configs/jsonc'
import { jsdoc, type JSDocConfigOptions } from './configs/jsdoc'

/**
 * Configuration options for the ESLint flat config.
 *
 * By default, all feature configurations are enabled (`true`).
 * You can disable any feature by setting it to `false`, or customize it by passing its options object.
 * 
 * Note: `ignores` is not a boolean toggle, but accepts patterns or a function.
 */
export interface ConfigOptions {
  /** Vue single-file components linting (via `eslint-plugin-vue`). */
  vue?: boolean | VueConfigOptions

  /** TypeScript language linting (via `typescript-eslint`). */
  typescript?: boolean | TypescriptConfigOptions

  /** Glob patterns to exclude from linting. */
  ignores?: IgnoresPatterns

  /** Stylistic code formatting rules (via `@stylistic/eslint-plugin`). */
  stylistic?: boolean | StylisticConfigOptions

  /** Tailwind CSS class sorting and best practices (via `eslint-plugin-better-tailwindcss`). */
  tailwind?: boolean | TailwindConfigOptions

  /** Imports sorting and unused imports cleanup (via `eslint-plugin-import-lite` and `eslint-plugin-unused-imports`). */
  imports?: boolean | ImportsConfigOptions

  /** Markdown files and embedded code blocks linting (via `@eslint/markdown`). */
  markdown?: boolean | MarkdownConfigOptions

  /** Core JavaScript language rules (via `@eslint/js`). */
  javascript?: boolean | JavascriptConfigOptions

  /** JSON, JSON5, and JSONC files linting and sorting (via `eslint-plugin-jsonc`). */
  jsonc?: boolean | JSONCConfigOptions

  /** JSDoc comments formatting and validation (via `eslint-plugin-jsdoc`). */
  jsdoc?: boolean | JSDocConfigOptions
}

/**
 * Factory to create a flat ESLint config.
 * It builds an ESLint config by sequentially adding sub-configs based on the provided options.
 * @param options Configuration options for enabling/disabling or configuring specific rule sets.
 * @returns A flat config composer instance that can be exported directly or further modified.
 */
export function factory(options: ConfigOptions = {}) {
  // Array to hold the promises of flat configuration items
  const configs: Array<Awaitable<Array<TypedFlatConfigItem>>> = []

  // Always append the ignore patterns configuration first to apply it globally
  configs.push(ignores(options.ignores))

  // Mapping of configuration keys to their respective factory functions
  const configFunctions = {
    vue,
    typescript,
    stylistic,
    tailwind,
    imports,
    markdown,
    javascript,
    jsonc,
    jsdoc,
  }

  // Iterate over each configuration factory function
  for (const [key, configFunction] of Object.entries(configFunctions)) {
    const configOption = (options as Record<string, unknown>)[key]
    
    // Resolve the options for the current configuration, defaulting to true if not explicitly provided
    const resolved = resolveOptions(configOption ?? true, {})
    
    // If the configuration is enabled (resolved is truthy), append its resulting config items
    if (resolved) configs.push(configFunction(resolved))
  }

  // Initialize the composer that allows method chaining and plugins renaming
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
