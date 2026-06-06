import { defu } from 'defu'
import {  type Awaitable } from "eslint-flat-config-utils";

/**
 * Safely extracts the default export from a module.
 *
 * This function handles both standard objects and asynchronous promises.\
 * If the input object has a `default` property, that property is returned.\
 * If there is no `default` property, the entire input object is returned.\
 *
 * @template TModule - The type of the input module or object.
 * @template TModuleDefault - The inferred type of the default export if it exists.
 *
 * @param module - The module object or a promise that resolves to the module.
 * @returns The default export or the original module.
 */
export async function getModuleDefault<TModule>(module: Awaitable<TModule>): Promise<TModule extends { default: infer TModuleDefault } ? TModuleDefault : TModule> {
  const resolvedModule = await module

  return (resolvedModule as any).default || resolvedModule
}

/**
 * Resolves a boolean | options value into options or null.
 * Returns null if disabled (false or undefined), merged options if enabled.
 */
export function resolveOptions<TOptions extends object>(value: boolean | TOptions | undefined,defaults: TOptions): TOptions | null {
  if (!value) return null
  return defu(value === true ? {} : value, defaults) as TOptions
}