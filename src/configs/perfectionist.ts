import { defu } from "defu"
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { jsGlob, tsGlob, vueGlob, } from "../globs"
import { importModule } from "../utils"

/**
 * Options for configuring Perfectionist linting rules.
 * @see https://perfectionist.dev/guide/getting-started#settings
 * @see https://perfectionist.dev/configs/recommended-custom
 */
interface PerfectionistSettings {
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
   * @default 'en-US'
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#locales
   */
  locales?: string | string[]

  /**
   * Partition sorted elements by comments.
   * Can be `true`, `false`, a regexp pattern string, or an array of patterns.
   * @default true
   */
  partitionByComment?: boolean | string | string[]

  /**
   * Partition sorted elements by newlines.
   * @default false
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

  /** `tsconfig` configuration option used by rules.*/
  tsconfig?: {
    /** 
     * The `ts-config` filename
     * @default 'tsconfig.json'
     */
    filename?: string,
    /** 
     * The project root directory
     * @default '.'
     */
    rootDir?: string
  }
}

/** Shared configuration options for ESLint rules and Perfectionist settings */
export type PerfectionistOptions = SharedOptions & {
  settings?: PerfectionistSettings
}

const perfectionistDefaults: PerfectionistSettings = {
  ignoreCase: true,
  locales: 'en-US',
  newlinesBetween: 'ignore',
  newlinesInside: 'ignore',
  order: 'asc',
  partitionByComment: true,
  partitionByNewLine: false,
  specialCharacters: 'keep',
  tsconfig: {
    filename: 'tsconfig.json',
    rootDir: '.',
  },
  type: 'natural',
}

/** 
 * Constructs the flat config for perfectionist linting
 * @returns Flat config items
 */
export async function perfectionist(options: PerfectionistOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, { settings: perfectionistDefaults })

  const perfectionistPlugin = await importModule(import('eslint-plugin-perfectionist'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob
  ]

  return [
    {
      files,
      name: 'favorodera/perfectionist/rules',
      rules: {
        'perfectionist/sort-array-includes': 'error',
        'perfectionist/sort-arrays': [
          'error',
          {
            useConfigurationIf: {},
          }
        ],
        'perfectionist/sort-classes': 'error',
        'perfectionist/sort-enums': 'error',
        'perfectionist/sort-exports': 'error',
        'perfectionist/sort-heritage-clauses': 'error',
        'perfectionist/sort-imports': 'error',
        'perfectionist/sort-interfaces': 'error',
        'perfectionist/sort-intersection-types': 'error',
        'perfectionist/sort-maps': 'error',
        'perfectionist/sort-modules': 'error',
        'perfectionist/sort-named-exports': 'error',
        'perfectionist/sort-named-imports': 'error',
        'perfectionist/sort-object-types': 'error',
        'perfectionist/sort-objects': 'error',
        'perfectionist/sort-sets': 'error',
        'perfectionist/sort-switch-case': 'error',
        'perfectionist/sort-union-types': 'error',
        'perfectionist/sort-variable-declarations': 'error',

        ...resolvedOptions.overrides
      }
    },

    {
      name: 'favorodera/perfectionist/setup',
      plugins: { 'perfectionist': perfectionistPlugin, },
      settings: {
        perfectionist: resolvedOptions.settings,
      },
    }
  ]
}