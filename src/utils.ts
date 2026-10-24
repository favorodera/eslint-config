import type { Awaitable } from 'eslint-flat-config-utils'
import { defu } from 'defu'
import type { Rules } from './types'

/**
 * Extracts and merges rules from multiple arrays of flat config items.
 *
 * Later configurations take precedence when the same rule appears more than once.
 * @param configArrays Flat config arrays whose `rules` objects should be merged.
 * @returns A new rule map containing the merged rules.
 */
export function extractRules(...configArrays: { rules?: Record<string, unknown> }[][]): Rules {
  return Object.assign(
    {},
    // Flatten the array of config arrays, then map over each config to extract its 'rules' object (or an empty object if undefined).
    ...configArrays
      .flat()
      .map((config) => {
        return config?.rules ?? {}
      }),
  )
}

/**
 * Resolves a module (or a promise of one) and returns its default export
 * if present, otherwise returns the module itself.
 *
 * Handles both ESM modules (which wrap exports under `.default`) and
 * CJS / plain-object modules uniformly.
 * @template TModule - The type of the resolved module.
 * @param module A module value or promise-like value to normalize.
 * @returns The module's default export when present; otherwise, the resolved module.
 */
export async function importModule<TModule>(module: Awaitable<TModule>): Promise<TModule extends { default: infer TModuleDefault } ? TModuleDefault : TModule> {
  const resolvedModule = await module

  // If the resolved module is an object and has a 'default' property, extract it (handles ESM default exports)
  if (resolvedModule !== null && resolvedModule !== undefined && typeof resolvedModule === 'object' && 'default' in resolvedModule) {
    return (resolvedModule as any).default
  }

  // Otherwise, return the module directly (handles CJS and plain objects)
  return resolvedModule as any
}

/**
 * Resolves a boolean-or-options value against a set of defaults.
 *
 * A falsy value disables the configuration. `true` enables it with defaults,
 * while an options object is merged over the defaults (provided values win).
 * @template TOptions - The shape of the configuration group's options.
 * @param value Whether the group is enabled, its custom options, or `undefined`.
 * @param defaults Default options applied when the group is enabled.
 * @returns `false` when disabled, or the merged options when enabled.
 */
export function resolveOptions<TOptions extends object>(value: boolean | TOptions | undefined, defaults: TOptions): false | TOptions {
  // If the value is falsy (false, undefined, null), the feature is considered disabled
  if (!value) return false

  /*
   * If value is exactly true, use an empty object to merge with defaults.
   * Otherwise, value is an options object, so merge it with the default options using defu.
   */
  return defu(value === true ? {} : value, defaults) as TOptions
}
