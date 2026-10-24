import { type Awaitable, FlatConfigComposer } from 'eslint-flat-config-utils'
import type { ConfigNames } from './typegen'
import type { BooleanSharedOptions, IgnoresPatterns, TypedFlatConfigItem } from './types'
import { codeInMarkdown } from './configs/code-in-markdown'
import { css, type CSSOptions } from './configs/css'
import { ignores } from './configs/ignores'
import { imports } from './configs/imports'
import { javascript } from './configs/javascript'
import { jsdoc } from './configs/jsdoc'
import { jsonc, type JSONCOptions } from './configs/jsonc'
import { markdown, type MarkdownOptions } from './configs/markdown'
import { node } from './configs/node'
import { perfectionist, type PerfectionistOptions } from './configs/perfectionist'
import { pnpm, type PNPMOptions } from './configs/pnpm'
import { stylistic, type StylisticOptions } from './configs/stylistic'
import { tailwind, type TailwindOptions } from './configs/tailwind'
import { typescript } from './configs/typescript'
import { unicorn } from './configs/unicorn'
import { unusedImports } from './configs/unused-imports'
import { vitest } from './configs/vitest'
import { vue, type VueOptions } from './configs/vue'
import { yaml, type YAMLOptions } from './configs/yaml'
import { resolveOptions } from './utils'

/**
 * Options for enabling, disabling, and customizing the configuration groups.
 *
 * Every group is enabled by default. Set a group to `false` to disable it, or pass
 * an options object to configure that group. `ignores` is always included.
 * @see {@linkcode defineConfig} for the configuration factory.
 */
export interface ConfigOptions {
  /**
   * Lint supported code blocks embedded in Markdown files.
   * @default true
   */
  codeInMarkdown?: BooleanSharedOptions

  /**
   * Configure CSS linting and its optional CSS-specific rules.
   * @default true
   */
  css?: BooleanSharedOptions<CSSOptions>

  /**
   * Additional patterns to ignore, or a callback that receives and returns the default patterns.
   * An array is appended to the defaults; a callback must return the complete list to use.
   * @default Built-in ignore patterns
   */
  ignores?: IgnoresPatterns

  /**
   * Configure import ordering and import-quality rules.
   * @default true
   */
  imports?: BooleanSharedOptions

  /**
   * Configure core JavaScript rules.
   * @default true
   */
  javascript?: BooleanSharedOptions

  /**
   * Configure JSDoc validation and style rules.
   * @default true
   */
  jsdoc?: BooleanSharedOptions

  /**
   * Configure JSON, JSON5, JSONC, package.json, and TypeScript config-file rules.
   * @default true
   */
  jsonc?: BooleanSharedOptions<JSONCOptions>

  /**
   * Configure Markdown linting and Markdown language features.
   * @default true
   */
  markdown?: BooleanSharedOptions<MarkdownOptions>

  /**
   * Configure Node.js-specific linting rules.
   * @default true
   */
  node?: BooleanSharedOptions

  /**
   * Configure sorting rules for objects, imports, and other code structures.
   * @default true
   */
  perfectionist?: BooleanSharedOptions<PerfectionistOptions>

  /**
   * Configure pnpm rules for package.json and pnpm-workspace.yaml.
   * @default true
   */
  pnpm?: BooleanSharedOptions<PNPMOptions>

  /**
   * Configure code style and formatting rules.
   * @default true
   */
  stylistic?: BooleanSharedOptions<StylisticOptions>

  /**
   * Configure Tailwind CSS class validation, ordering, and consistency rules.
   * @default true
   */
  tailwind?: BooleanSharedOptions<TailwindOptions>

  /**
   * Configure TypeScript rules.
   * @default true
   */
  typescript?: BooleanSharedOptions

  /**
   * Configure Unicorn code-quality rules.
   * @default true
   */
  unicorn?: BooleanSharedOptions

  /**
   * Configure unused-import and unused-variable rules.
   * @default true
   */
  unusedImports?: BooleanSharedOptions

  /**
   * Configure Vitest rules for test files.
   * @default true
   */
  vitest?: BooleanSharedOptions

  /**
   * Configure Vue single-file components and optional accessibility rules.
   * @default true
   */
  vue?: BooleanSharedOptions<VueOptions>

  /**
   * Configure YAML linting and pnpm-workspace.yaml key ordering.
   * @default true
   */
  yaml?: BooleanSharedOptions<YAMLOptions>
}

/** Internal signature used to keep the public option list and builder map in sync. */
type ConfigBuilder = (options: never) => Awaitable<TypedFlatConfigItem[]>

/**
 * Creates the ESLint flat configuration for a project.
 *
 * All configuration groups are enabled by default. The returned composer can be
 * exported directly or extended with additional flat config items and overrides.
 * @param options Options for enabling, disabling, or customizing configuration groups.
 * @returns A composer containing the configured ESLint flat config.
 * @example
 * ```ts
 * import { defineConfig } from '@favorodera/eslint-config'
 *
 * export default defineConfig({
 *   vue: false,
 *   typescript: {
 *     overrides: { 'typescript/no-explicit-any': 'off' },
 *   },
 * })
 * ```
 */
export function defineConfig(options: ConfigOptions = {}) {
  /** The ignore item is first so it applies globally before the other config groups. */
  const configs: Awaitable<TypedFlatConfigItem[]>[] = [ignores(options.ignores)]

  /** Maps each public configuration option to its config builder. */
  const configFunctions = {
    codeInMarkdown,
    css,
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
    typescript,
    unicorn,
    unusedImports,
    vitest,
    vue,
    yaml,
  } satisfies Record<Exclude<keyof ConfigOptions, 'ignores'>, ConfigBuilder>

  for (const [key, configFunction] of Object.entries(configFunctions)) {
    const configOption = (options as Record<string, boolean | object | undefined>)[key]

    // Resolve each group independently; omitted groups are enabled by default.
    const resolved = resolveOptions(configOption ?? true, {})

    // Add the group's resulting items only when that group is enabled.
    if (resolved) {
      configs.push(configFunction(resolved))
    }
  }

  /** Composer that permits chaining additional config items and rule overrides. */
  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer
    .append(...configs)
    .renamePlugins({
      '@stylistic': 'stylistic',
      '@typescript-eslint': 'typescript',
      'better-tailwindcss': 'tailwind',
      'import-lite': 'imports',
      'n': 'node',
      'test': 'vitest',
      'vuejs-accessibility': 'vue-a11y',
      'yml': 'yaml',
    })

  return composer
}
