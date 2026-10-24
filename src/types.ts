import type { Linter } from 'eslint'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'
import type { RuleOptions } from './typegen'

/**
 * Allows a configuration group to be enabled/disabled or configured with options.
 * @template Options - The option object accepted by the configuration group. Defaults to `SharedOptions`.
 */
export type BooleanSharedOptions<Options = SharedOptions> = boolean | Options

/**
 * Patterns used to exclude files and directories from ESLint scanning.
 *
 * An array is appended to the built-in patterns. A callback receives the built-in
 * patterns and must return the complete set of ignore patterns to use.
 */
export type IgnoresPatterns = ((defaults: string[]) => string[]) | string[]

/** Promise resolving to the flat config items produced by one configuration group. */
export type PromisedTypedConfigFlatItemArray = Promise<TypedFlatConfigItem[]>

/**
 * ESLint rule map with autocomplete for the rules generated from the active plugins.
 *
 * Values may be omitted to make a rule explicitly undefined in a typed config.
 */
export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

/** Common options supported by configuration groups. */
export interface SharedOptions {
  /** Rule overrides merged after the configuration group's built-in rules. */
  overrides?: TypedFlatConfigItem['rules']
}

/**
 * An extended flat-config item based on `eslint-flat-config-utils`'s `ConfigWithExtends`.
 *
 * It provides type-safe rule autocomplete and relaxes plugin and rule typing where
 * plugins do not yet provide complete type declarations.
 */
export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
  /**
   * Maps plugin names to plugin objects. When `files` is specified, these plugins
   * are only available to matching files.
   * @see https://eslint.org/docs/latest/use/configure/plugins
   */
  plugins?: Record<string, any>

  /**
   * Configured rules. When `files` or `ignores` are specified, these rules apply
   * only to matching files.
   */
  rules?: Rules
}
