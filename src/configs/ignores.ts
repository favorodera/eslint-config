import type { TypedFlatConfigItem } from '../types'
import { ignoresGlob } from '../globs'

export type IgnoresPatterns = string[] | ((defaults: string[]) => string[])

const defaultPatterns = [...ignoresGlob]

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