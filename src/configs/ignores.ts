import type { TypedFlatConfigItem } from '../types/utils'
import { ignoresGlob } from '../globs'

/**
 * Patterns used to ignore files and directories from ESLint scanning.
 * Can be a list of glob patterns or a function that receives default patterns.
 */
export type IgnoresPatterns = ((defaults: Array<string>) => Array<string>) | Array<string>

const defaultPatterns = ignoresGlob

/**
 * Globs for ignoring files and directories from ESLint scanning.
 * @param patterns Additional ignore patterns or a function to modify the defaults.
 * @returns An array containing the ignore flat config item.
 */
export function ignores(patterns: IgnoresPatterns = []): Array<TypedFlatConfigItem> {
  const resolved = typeof patterns === 'function'
    ? patterns(defaultPatterns)
    : [
        ...defaultPatterns,
        ...patterns,
      ]

  return [
    {
      ignores: resolved,
      name: 'favorodera/ignores',
    },
  ]
}
