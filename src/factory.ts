import { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Awaitable } from 'eslint-flat-config-utils'
import type { TypedFlatConfigItem } from './types/utils'
import { resolveOptions } from './utils'
import { vue } from './configs/vue'
import type { VueConfigOptions } from './configs/vue'
import { typescript } from './configs/typescript'
import type { TypescriptConfigOptions } from './configs/typescript'
import { ignores } from './configs/ignores'
import type { IgnoresPatterns } from './configs/ignores'
import { stylistic } from './configs/stylistic'
import type { StylisticConfigOptions } from './configs/stylistic'
import type { ConfigNames } from './types/rules'
import { tailwind } from './configs/tailwind'
import type { TailwindConfigOptions } from './configs/tailwind'
import { comments } from './configs/comments'
import type { CommentsConfigOptions } from './configs/comments'
import { imports } from './configs/imports'
import type { ImportsConfigOptions } from './configs/imports'
import { markdown } from './configs/markdown'
import type { MarkdownConfigOptions } from './configs/markdown'
import { javascript } from './configs/javascript'
import type { JavascriptConfigOptions } from './configs/javascript'

/** Configuration options for the ESLint flat config */
export interface ConfigOptions {
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
  /**
   * Enable Tailwind CSS linting with optional configuration
   * @default false
   */
  tailwind?: boolean | TailwindConfigOptions

  /**
   * Enable Comments linting with optional configuration
   * @default false
   */
  comments?: boolean | CommentsConfigOptions

  /**
   * Enable Imports linting with optional configuration
   * @default false
   */
  imports?: boolean | ImportsConfigOptions

  /**
   * Enable Markdown linting with optional configuration
   * @default false
   */
  markdown?: boolean | MarkdownConfigOptions

  /**
   * Enable Javascript linting with optional configuration
   * @default false
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

  const vueOptions = resolveOptions(options.vue, {})
  const typescriptOptions = resolveOptions(options.typescript, {})
  const stylisticOptions = resolveOptions(options.stylistic, {})
  const tailwindOptions = resolveOptions(options.tailwind, {})
  const commentsOptions = resolveOptions(options.comments, {})
  const importsOptions = resolveOptions(options.imports, {})
  const markdownOptions = resolveOptions(options.markdown, {})
  const javascriptOptions = resolveOptions(options.javascript, {})

  if (vueOptions) configs.push(vue(vueOptions))
  if (typescriptOptions) configs.push(typescript(typescriptOptions))
  if (stylisticOptions) configs.push(stylistic(stylisticOptions))
  if (tailwindOptions) configs.push(tailwind(tailwindOptions))
  if (commentsOptions) configs.push(comments(commentsOptions))
  if (importsOptions) configs.push(imports(importsOptions))
  if (markdownOptions) configs.push(markdown(markdownOptions))
  if (javascriptOptions) configs.push(javascript(javascriptOptions))

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer.append(...configs)

  return composer
}
