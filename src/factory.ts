import { type Awaitable, FlatConfigComposer } from 'eslint-flat-config-utils'
import type { ConfigNames } from './types/rules'
import type { TypedFlatConfigItem } from './types/utils'
import { disables } from './configs/disables'
import { ignores, type IgnoresPatterns } from './configs/ignores'
import { imports } from './configs/imports'
import { javascript } from './configs/javascript'
import { jsdoc } from './configs/jsdoc'
import { jsonc } from './configs/jsonc'
import { markdown, type MarkdownConfigOptions } from './configs/markdown'
import { node } from './configs/node'
import { perfectionist, type PerfectionistConfigOptions } from './configs/perfectionist'
import { pnpm } from './configs/pnpm'
import { stylistic, type StylisticConfigOptions } from './configs/stylistic'
import { tailwind, type TailwindConfigOptions } from './configs/tailwind'
import { test } from './configs/test'
import { typescript } from './configs/typescript'
import { unicorn } from './configs/unicorn'
import { unusedImports } from './configs/unused-imports'
import { vue, type VueConfigOptions } from './configs/vue'
import { yaml } from './configs/yaml'
import { resolveOptions } from './utils'

/**
 * Configuration options for the ESLint flat config.
 *
 * By default, all feature configurations are enabled (`true`).
 * You can disable any feature by setting it to `false`, or customize it by passing its options object.
 *
 * Note: `ignores` is not a boolean toggle, but accepts patterns or a function.
 */
export interface ConfigOptions {
  /** Glob patterns to exclude from linting. */
  ignores?: IgnoresPatterns

  /** Imports sorting and quality rules (via `eslint-plugin-import-lite`). */
  imports?: boolean

  /** Core JavaScript language rules (via `@eslint/js`). */
  javascript?: boolean

  /** JSDoc comments formatting and validation (via `eslint-plugin-jsdoc`). */
  jsdoc?: boolean

  /** JSON, JSON5, and JSONC files linting and sorting (via `eslint-plugin-jsonc`). */
  jsonc?: boolean

  /** Markdown files and embedded code blocks linting (via `@eslint/markdown`). */
  markdown?: boolean | MarkdownConfigOptions

  /** Node.js specific linting rules (via `eslint-plugin-n`). */
  node?: boolean

  /** Perfectionist rules for sorting objects, imports, classes, etc (via `eslint-plugin-perfectionist`). */
  perfectionist?: boolean | PerfectionistConfigOptions

  /** PNPM workspaces rules (via `eslint-plugin-pnpm`). */
  pnpm?: boolean

  /** Stylistic code formatting rules (via `@stylistic/eslint-plugin`). */
  stylistic?: boolean | StylisticConfigOptions

  /** Tailwind CSS class sorting and best practices (via `eslint-plugin-better-tailwindcss`). */
  tailwind?: boolean | TailwindConfigOptions

  /** Test and Vitest specific linting rules (via `@vitest/eslint-plugin`). */
  test?: boolean

  /** TypeScript language linting (via `typescript-eslint`). */
  typescript?: boolean

  /** Unicorn rules for various code quality improvements (via `eslint-plugin-unicorn`). */
  unicorn?: boolean

  /** Unused imports and variables detection and cleanup (via `eslint-plugin-unused-imports`). */
  unusedImports?: boolean

  /** Vue single-file components accessibility and linting (via `eslint-plugin-vue` and `eslint-plugin-vuejs-accessibility`). */
  vue?: boolean | VueConfigOptions

  /** YAML files linting and sorting (via `eslint-plugin-yml`). */
  yaml?: boolean
}

/**
 * Factory to create a flat ESLint config.
 * It builds an ESLint config by sequentially adding sub-configs based on the provided options.
 * @param options Configuration options for enabling/disabling or configuring specific rule sets.
 * @returns A flat config composer instance that can be exported directly or further modified.
 */
export function factory(options: ConfigOptions = {}) {
  // Array to hold the promises of flat configuration items
  // Always append the ignore patterns configuration first to apply it globally
  const configs: Array<Awaitable<Array<TypedFlatConfigItem>>> = [ignores(options.ignores)]

  // Mapping of configuration keys to their respective factory functions
  const configFunctions = {
    imports,
    javascript,
    jsdoc,
    jsonc,
    markdown,
    node,
    perfectionist,
    pnpm,
    stylistic,
    tailwind,
    test,
    typescript,
    unicorn,
    unusedImports,
    vue,
    yaml,
  }

  // Iterate over each configuration factory function
  for (const [
    key,
    configFunction,
  ] of Object.entries(configFunctions)) {
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
    .append(...disables())
    .renamePlugins({
      '@typescript-eslint': 'ts',
      'better-tailwindcss': 'tailwind',
      'import-lite': 'import',
      'markdown': 'md',
      'n': 'node',
      'vitest': 'test',
      'vuejs-accessibility': 'vue-a11y',
      'yml': 'yaml',
    })

  return composer
}
