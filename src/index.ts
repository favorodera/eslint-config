import { FlatConfigComposer, type Awaitable } from "eslint-flat-config-utils";
import { ignores, type IgnoresPatterns } from "./configs/ignores";
import type { BooleanSharedOptions, TypedFlatConfigItem } from "./types";
import { resolveOptions } from "./utils";
import type { ConfigNames } from "./typegen";
import { _import } from "./configs/import";

/** Configuration options for the ESLint flat config. */
interface ConfigOptions {
  /** 
   * Glob patterns to exclude from linting.
   * @default `IgnoresGlob'
   */
  ignores?: IgnoresPatterns

  /** Imports sorting and quality rules. */
  imports?: BooleanSharedOptions
}

/**
 * Factory to create a flat ESLint config.
 * It builds an ESLint config by sequentially adding sub-configs based on the provided options.
 * @param options Configuration options for enabling/disabling or configuring specific rule sets.
 * @returns A flat config composer instance that can be exported directly or further modified.
 */
export function defineConfig(options:ConfigOptions = {}) {
  // Array to hold the promises of flat configuration items
  // Always append the ignore patterns configuration first to apply it globally
  const configs: Array<Awaitable<Array<TypedFlatConfigItem>>> = [ignores(options.ignores)]

  // Mapping of configuration keys to their respective factory functions
  const configFunctions = {
    import :_import
  }

  for(const [key, configFunction] of Object.entries(configFunctions)) {
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
      '@typescript-eslint': 'ts',
      'better-tailwindcss': 'tailwind',
      'import-lite': 'import',
      'markdown': 'md',
      'n': 'node',
      'vuejs-accessibility': 'vue-a11y',
      'yml': 'yaml',
    })

  return composer
}