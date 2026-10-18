import { FlatConfigComposer, type Awaitable  } from "eslint-flat-config-utils";
import { ignores } from "./configs/ignores";
import type { BooleanSharedOptions, IgnoresPatterns, TypedFlatConfigItem } from "./types";
import { resolveOptions } from "./utils";
import type { ConfigNames } from "./typegen";
import { imports } from "./configs/imports";
import { css } from "./configs/css";
import { javascript } from "./configs/javascript";
import { typescript } from "./configs/typescript";

/** Configuration options for the ESLint flat config. */
interface ConfigOptions {
  /** 
   * Glob patterns to exclude from linting.
   * 
   * Can be a list of additional ignore patterns or a function to modify the defaults
   * @default `IgnoresGlob'
   */
  ignores?: IgnoresPatterns

  /** Imports linting. */
  imports?: BooleanSharedOptions

  /** Core css linting. */
  css?: BooleanSharedOptions
  
  /** Core javascript linting */
  javascript?:BooleanSharedOptions

  /** Core typescript linting */
  typescript?:BooleanSharedOptions
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
    imports,
    css,
    javascript,
    typescript
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
      'vuejs-accessibility': 'a11y',
      'yml': 'yaml',
    })

  return composer
}