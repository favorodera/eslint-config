import type { IgnoresPatterns, PromisedTypedConfigFlatItemArray } from '../types'
import { ignoresGlob } from '../globs'

/**
 * Creates the global ignore configuration item.
 *
 * An array is appended to the built-in ignore patterns. A callback receives the
 * built-in patterns and must return the complete ignore list to use.
 * @param patterns Additional patterns or a function that transforms the defaults.
 * @returns A single global ignore configuration item.
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
