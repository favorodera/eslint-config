import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Perfectionist linting rules. */
export type PerfectionistConfigOptions = SharedOptions & {
  /**
   * Global settings for the Perfectionist plugin, applied to all rules
   * unless overridden by rule-specific options.
   * @see https://perfectionist.dev/guide/getting-started#settings
   * @see https://perfectionist.dev/configs/recommended-custom
   */
  settings?: {
    /**
     * The type of sorting algorithm.
     * @default 'natural'
     */
    type?: 'alphabetical' | 'custom' | 'line-length' | 'natural'

    /**
     * The order of sorting.
     * @default 'asc'
     */
    order?: 'asc' | 'desc'

    /**
     * The fallback sorting type and order used when two elements are equal
     * under the primary comparison.
     */
    fallbackSort?: {
      order?: 'asc' | 'desc'
      type: 'alphabetical' | 'custom' | 'line-length' | 'natural'
    }

    /**
     * Custom alphabet string for the `'custom'` sort type.
     * Defines the exact character order to use.
     */
    alphabet?: string

    /**
     * Ignore case when sorting.
     * @default true
     */
    ignoreCase?: boolean

    /**
     * Control whether special characters should be kept, trimmed or removed
     * before sorting.
     * @default 'keep'
     */
    specialCharacters?: 'keep' | 'remove' | 'trim'

    /**
     * Locale(s) used for locale-aware string comparison.
     * A BCP 47 language tag or an array of such tags.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#locales
     * @default 'en-US'
     */
    locales?: Array<string> | string

    /**
     * Partition sorted elements by comments.
     * Can be `true`, `false`, a regexp pattern string, or an array of patterns.
     * @default true
     */
    partitionByComment?: Array<string> | boolean | string

    /**
     * Partition sorted elements by newlines.
     * @default true
     */
    partitionByNewLine?: boolean

    /**
     * Specifies how to handle newlines between groups.
     * `'ignore'` preserves existing newlines; a number enforces that many blank lines.
     * @default 'ignore'
     */
    newlinesBetween?: 'ignore' | number

    /**
     * Specifies how to handle newlines between elements of each group.
     * `'ignore'` preserves existing newlines; a number enforces that many blank lines.
     * @default 'ignore'
     */
    newlinesInside?: 'ignore' | 'newlinesBetween' | number
  }
}

const perfectionistDefaults: PerfectionistConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
  settings: {
    ignoreCase: true,
    locales: 'en-US',
    newlinesBetween: 'ignore',
    newlinesInside: 'ignore',
    order: 'asc',
    partitionByComment: true,
    partitionByNewLine: true,
    specialCharacters: 'keep',
    type: 'natural',
  },
}

/**
 * Constructs the flat config items for Perfectionist linting, providing rules
 * to naturally sort objects, imports, classes, and other elements in your code.
 * @param options Perfectionist configuration options.
 * @returns Promise resolving to Perfectionist ESLint config items.
 */
export async function perfectionist(options: PerfectionistConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, perfectionistDefaults)

  const perfectionistPlugin = await importModule(import('eslint-plugin-perfectionist'))

  const safeType = resolved.settings?.type ?? 'natural'

  const baseRules = perfectionistPlugin.configs[`recommended-${safeType}`]?.rules || {}

  return [
    {
      name: 'favorodera/perfectionist/setup',
      plugins: { perfectionist: perfectionistPlugin },
      settings: {
        perfectionist: resolved.settings,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/perfectionist/rules',
      rules: {
        ...baseRules,

        ...resolved.overrides,
      },
    },
  ]
}
