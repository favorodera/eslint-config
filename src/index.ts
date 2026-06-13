// Factory and configuration options.
export { type ConfigOptions, factory } from './factory'

// Globs used to match files for specific configurations.
export {
  codeInMdGlob,
  ignoresGlob,
  jsGlob,
  json5Glob,
  jsoncGlob,
  jsonGlob,
  mdGlob,
  mdInMdGlob,
  packageJsonGlob,
  pnpmWorkspaceGlob,
  scriptsGlob,
  testGlob,
  tsConfigGlob,
  tsGlob,
  vueGlob,
  yamlGlob,
} from './globs'

// Type definitions for ESLint rules - provides type-safe autocompletion for rule names and options.
export type { ConfigNames } from './types/rules'

// Core type definitions for ESLint configuration and rules.
export type { TypedFlatConfigItem } from './types/utils'

// Utility functions - useful for consumers building on top of this config.
export { extractRules, importModule } from './utils'
