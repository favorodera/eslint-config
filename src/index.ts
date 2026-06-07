// factory
export { factory, type ConfigOptions } from './factory'

// configs — individually importable
export { ignores, type IgnoresPatterns } from './configs/ignores'
export { vue, type VueConfigOptions } from './configs/vue'
export { typescript, type TypescriptConfigOptions } from './configs/typescript'
export { stylistic, type StylisticConfigOptions } from './configs/stylistic'
export { tailwind, type TailwindConfigOptions } from './configs/tailwind'

// presets -- pre-configured sets of options
export { allConfigOptionsFalse, allConfigOptionsTrue } from './config-presets'

// utils - useful for consumers building on top
export { getModuleDefault, renameRules } from './utils'

// globs — useful when extending configs
export { vueGlob, tsGlob, ignoresGlob } from './globs'

// types
export type { TypedFlatConfigItem, SharedOptions, Rules } from './types/utils'
export type { RuleOptions, ConfigNames } from './types/rules'
