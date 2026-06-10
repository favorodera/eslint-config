// Factory and configuration options.
export { type ConfigOptions, factory } from './factory'

export type { ConfigNames, RuleOptions } from './types/rules'

// Core type definitions for ESLint configuration and rules.
export type { Rules, SharedOptions, TypedFlatConfigItem } from './types/utils'
// Utility functions - useful for consumers building on top of this config.
export { importModule } from './utils'
