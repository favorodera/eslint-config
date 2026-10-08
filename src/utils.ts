import type { Awaitable } from 'eslint-flat-config-utils'
import {defu} from 'defu'

/**
 * Resolves a module (or a promise of one) and returns its default export
 * if present, otherwise returns the module itself.
 *
 * Handles both ESM modules (which wrap exports under `.default`) and
 * CJS / plain-object modules uniformly.
 * @template TModule The type of the module being imported.
 * @param module A module or a promise that resolves to one.
 * @returns The `.default` export if it exists, otherwise the module itself.
 */
export async function importModule<TModule>(module:Awaitable<TModule>):Promise<TModule extends { default: infer TModuleDefault } ? TModuleDefault : TModule>{
  const resolvedModule = await module

  // If the resolved module is an object and has a 'default' property, extract it (handles ESM default exports)
  if (resolvedModule !== null && typeof resolvedModule === 'object' && 'default' in resolvedModule) {
    return (resolvedModule as any).default
  }

  // Otherwise, return the module directly (handles CJS and plain objects)
  return resolvedModule as any
}

/**
 * Normalize boolean or options value into merged options or null.
 * Returns null when the input is false or undefined.
 * @template TOptions The type of the options object.
 * @param value The configuration value, which can be a boolean, an options object, or undefined.
 * @param defaults The default options to merge with if `value` is true or an object.
 * @returns The merged options object, or false if the feature is disabled.
 */
export function resolveOptions<TOptions extends object>(value: boolean | TOptions | undefined, defaults: TOptions) {
  // If the value is falsy (false, undefined, null), the feature is considered disabled
  if (!value) return false

  // If value is exactly true, use an empty object to merge with defaults.
  // Otherwise, value is an options object, so merge it with the default options using defu.
  return defu(value === true ? {} : value, defaults) as TOptions
}