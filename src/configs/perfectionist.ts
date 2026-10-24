import { defu } from 'defu'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for Perfectionist sorting rules and plugin settings. */
export type PerfectionistOptions = SharedOptions & {
  /** Sorting behavior passed to the Perfectionist plugin. */
  settings?: PerfectionistSettings
}

/**
 * Options for configuring Perfectionist linting rules.
 * @see https://perfectionist.dev/guide/getting-started#settings
 * @see https://perfectionist.dev/configs/recommended-custom
 */
interface PerfectionistSettings {
  /**
   * Custom alphabet string for the `'custom'` sort type.
   *
   * Defines the exact character order to use.
   */
  alphabet?: string

  /** The fallback sorting type and order used when two elements are equal under the primary comparison. */
  fallbackSort?: Pick<PerfectionistSettings, 'order' | 'type'>

  /**
   * Ignore case when sorting.
   * @default true
   */
  ignoreCase?: boolean

  /**
   * Locale(s) used for locale-aware string comparison.
   *
   * A BCP 47 language tag or an array of such tags.
   * @default 'en-US'
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#locales
   */
  locales?: string | string[]

  /**
   * Specifies how to handle newlines between groups.
   *
   * `'ignore'` preserves existing newlines; a number enforces that many blank lines.
   * @default 'ignore'
   */
  newlinesBetween?: 'ignore' | number

  /**
   * Specifies how to handle newlines between elements of each group.
   *
   * `'ignore'` preserves existing newlines; a number enforces that many blank lines.
   * @default 'ignore'
   */
  newlinesInside?: 'ignore' | 'newlinesBetween' | number

  /**
   * The order of sorting.
   * @default 'asc'
   */
  order?: 'asc' | 'desc'

  /**
   * Partition sorted elements by comments.
   *
   * Can be a boolean, a string pattern, an array of patterns, or an object
   * specifying separate rules for line and block comments.
   * @default { line: true, block: false } (partitions on line comments but ignores block comments, including JSDoc)
   */
  partitionByComment?:
    | boolean
    | string
    | string[]
    | {
      block?: boolean | string | string[]
      line?: boolean | string | string[]
    }

  /**
   * Partition sorted elements by newlines.
   * @default false
   */
  partitionByNewLine?: boolean

  /**
   * Control whether special characters should be kept, trimmed or removed before sorting.
   * @default 'keep'
   */
  specialCharacters?: 'keep' | 'remove' | 'trim'

  /** `tsconfig` configuration option used by rules. */
  tsconfig?: {
    /**
     * The `ts-config` filename
     * @default 'tsconfig.json'
     */
    filename?: string

    /**
     * The project root directory
     * @default '.'
     */
    rootDir?: string
  }

  /**
   * The type of sorting algorithm.
   * @default 'natural'
   */
  type?: 'alphabetical' | 'custom' | 'line-length' | 'natural'
}

/** Default settings for Perfectionist sorting. */
const perfectionistDefaults = {
  overrides: undefined,
  settings: {
    ignoreCase: true,
    locales: 'en-US',
    newlinesBetween: 'ignore',
    newlinesInside: 'ignore',
    order: 'asc',
    partitionByComment: {
      block: false,
      line: true,
    },
    partitionByNewLine: false,
    specialCharacters: 'keep',
    tsconfig: {
      filename: 'tsconfig.json',
      rootDir: '.',
    },
    type: 'natural',
  },
} satisfies PerfectionistOptions

/**
 * Creates flat config items for Perfectionist sorting rules.
 * @param options Sorting settings and rule overrides.
 * @returns Flat config items for this configuration group.
 */
export async function perfectionist(options: PerfectionistOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, perfectionistDefaults)

  const perfectionistPlugin = await importModule(import('eslint-plugin-perfectionist'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/perfectionist/setup',
      plugins: { perfectionist: perfectionistPlugin },
      settings: {
        perfectionist: resolvedOptions.settings,
      },
    },

    {
      files,
      name: 'favorodera/perfectionist/rules',
      rules: {
        ...perfectionistPlugin.configs[`recommended-${resolvedOptions.settings.type}`].rules,

        ...resolvedOptions.overrides,
      },
    },
  ]
}
