import { defu } from 'defu'
import type { Awaitable } from 'eslint-flat-config-utils'

/**
 * Resolves a module (or a promise of one) and returns its default export
 * if present, otherwise returns the module itself.
 *
 * Handles both ESM modules (which wrap exports under `.default`) and
 * CJS / plain-object modules uniformly.
 *
 * @param module - A module or a promise that resolves to one
 * @returns The `.default` export if it exists, otherwise the module itself
 */
export async function importModule<TModule>(module: Awaitable<TModule>): Promise<TModule extends { default: infer TModuleDefault } ? TModuleDefault : TModule> {
  const resolved = await module

  if (resolved !== null && typeof resolved === 'object' && 'default' in resolved) {
    return (resolved as any).default
  }

  return resolved as any
}

/**
 * Normalize boolean or options value into merged options or null.
 * Returns null when the input is false or undefined.
 *
 * @param value - boolean, options object, or undefined
 * @param defaults - defaults to merge with
 * @returns merged options or false
 */
export function resolveOptions<TOptions extends object>(value: boolean | TOptions | undefined, defaults: TOptions) {
  if (!value) return false

  return defu(value === true ? {} : value, defaults) as TOptions
}
