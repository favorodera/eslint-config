// Factory and configuration options.
export { factory, type ConfigOptions } from './factory'

// Utility functions - useful for consumers building on top of this config.
export { importModule } from './utils'

// Core type definitions for ESLint configuration and rules.
export type { TypedFlatConfigItem, SharedOptions, Rules } from './types/utils'
export type { RuleOptions, ConfigNames } from './types/rules'
