import { ignoresGlob } from '../globs'
import type { TypedFlatConfigItem } from '../types/utils'

/**
 * Patterns used to ignore files and directories from ESLint scanning.
 * Can be a list of glob patterns or a function that receives default patterns.
 */
export type IgnoresPatterns = string[] | ((defaults: string[]) => string[])

/** Default ignore patterns copied from the shared ignore glob list. */
const defaultPatterns = [...ignoresGlob]

/**
 * Create an ESLint ignore config item.
 *
 * @param patterns - Additional ignore patterns or a function to modify the defaults.
 * @returns An array containing the ignore flat config item.
 */
export function ignores(patterns: string[] | ((defaults: string[]) => string[]) = []): TypedFlatConfigItem[] {
  const resolved = typeof patterns === 'function'
    ? patterns(defaultPatterns)
    : [...defaultPatterns, ...patterns]

  return [
    {
      name: 'favorodera/ignores',
      ignores: resolved,
    },
  ]
}
