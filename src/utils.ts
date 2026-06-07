import { defu } from 'defu'
import type { Awaitable } from 'eslint-flat-config-utils'

/**
 * Return the default export from a module-like object.
 * If the module has no default export, return the original resolved value.
 *
 * @param module - module or promise resolving to a module
 * @returns resolved module default or original module
 */
export async function getModuleDefault<TModule>(module: Awaitable<TModule>): Promise<TModule extends { default: infer TModuleDefault } ? TModuleDefault : TModule> {
  const resolvedModule = await module

  return (resolvedModule as any).default || resolvedModule
}

/**
 * Normalize boolean or options value into merged options or null.
 * Returns null when the input is false or undefined.
 *
 * @param value - boolean, options object, or undefined
 * @param defaults - defaults to merge with
 * @returns merged options or false
 */
export function resolveOptions<TOptions extends object>(value: boolean | TOptions | undefined, defaults: TOptions): TOptions | false {
  if (!value) return false

  return defu(value === true ? {} : value, defaults) as TOptions
}

/**
 * Rename rules by replacing configured plugin prefixes.
 *
 * @param rules - rules object to rename
 * @param map - prefix map used for renaming
 * @returns renamed rules object
 */
export function renameRules(rules: Record<string, any>, map: Record<string, string>): Record<string, any> {
  return Object
    .fromEntries(
      Object
        .entries(rules)
        .map(([key, value]) => {
          for (const [from, to] of Object.entries(map)) {

            if (key.startsWith(`${from}/`)) {
              return [to + key.slice(from.length), value]
            }

          }

          return [key, value]
        }),
    )
}
