import type { Linter } from 'eslint'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'
import type { RuleOptions } from './rules'

/** ESLint rules configuration with type-safe autocompletion */
export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

/** Shared configuration options for ESLint rules */
export interface SharedOptions {
  /** Override rules configuration */
  overrides?: TypedFlatConfigItem['rules']
  /** File glob patterns to apply configuration to */
  files?: string[]
}
