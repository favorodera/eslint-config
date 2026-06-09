import { ignoresGlob } from '../globs'
import type { TypedFlatConfigItem } from '../types/utils'

/**
 * Patterns used to ignore files and directories from ESLint scanning.
 * Can be a list of glob patterns or a function that receives default patterns.
 */
// eslint-disable-next-line no-unused-vars
export type IgnoresPatterns = string[] | ((defaults: string[]) => string[])

const defaultPatterns = ignoresGlob

/**
 * Globs for ignoring files and directories from ESLint scanning.
 * @param patterns - Additional ignore patterns or a function to modify the defaults.
 * @returns An array containing the ignore flat config item.
 */
export function ignores(patterns: IgnoresPatterns = []): TypedFlatConfigItem[] {
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
