import type { IgnoresPatterns, PromisedTypedConfigFlatItemArray } from '../types'
import { ignoresGlob } from '../globs'

/**
 * Globs for ignoring files and directories from ESLint scanning.
 * @param patterns Additional ignore patterns or a function to modify the defaults.
 * @returns An array containing the ignore flat config item.
 */
export function ignores(patterns: IgnoresPatterns = []): Awaited<PromisedTypedConfigFlatItemArray> {
  const resolved = typeof patterns === 'function'
    ? patterns(ignoresGlob)
    : [
        ...ignoresGlob,
        ...patterns,
      ]

  return [
    {
      ignores: resolved,
      name: 'favorodera/ignores',
    },
  ]
}
