import { defu } from 'defu'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { MatcherType, SelectorKind, type Selectors } from 'eslint-plugin-better-tailwindcss/types'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { cssGlob, jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Shared configuration options for ESLint rules and Tailwind settings */
export type TailwindOptions = SharedOptions & {
  settings?: TailwindSettings
}

/**
 * Options for configuring Tailwind CSS linting rules.
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md
 */
interface TailwindSettings {
  /** Working directory used to resolve Tailwind config files. */
  cwd?: string

  /**
   * Whether to detect and not report custom component classes (like `card`, `btn`) defined in Tailwind CSS v4.
   * @default true
   */
  detectComponentClasses?: boolean

  /** Path to the CSS entry file (e.g. `src/global.css`), relative to the current working directory. */
  entryPoint?: string

  /**
   * How linting messages are displayed:
   * - `"visual"` – visualizes whitespace/line breaks (default outside CI)
   * - `"compact"` – single-line messages, suitable for CI
   * - `"raw"` – raw information without visualization
   *
   * Defaults to `"visual"`, or `"compact"` in CI environments.
   */
  messageStyle?: 'compact' | 'raw' | 'visual'

  /**
   * Font size of the `<html>` element in pixels (default 16px).
   *
   * Used to determine if arbitrary values can be replaced with predefined sizing scales.
   */
  rootFontSize?: number

  /** Flat list of AST selectors that determine which string literals are linted as Tailwind classes. */
  selectors?: Selectors
}

const tailwindDefaults = {
  overrides: undefined,
  settings: {
    detectComponentClasses: true,
    selectors: [
      ...getDefaultSelectors(),
      {
        kind: SelectorKind.Callee,
        match: [
          { type: MatcherType.ObjectKey },
          { type: MatcherType.ObjectValue },
          { type: MatcherType.String },
        ],
        name: '^computed$',
      },
      {
        kind: SelectorKind.Callee,
        match: [
          { type: MatcherType.ObjectKey },
          { type: MatcherType.ObjectValue },
          { type: MatcherType.String },
        ],
        name: '^defineAppConfig$',
      },
    ],
  },
} satisfies TailwindOptions

/**
 * Constructs the flat config for tailwind linting
 * @returns Flat config items
 */
export async function tailwind(options: TailwindOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, tailwindDefaults)

  const tailwindPlugin = await importModule(import('eslint-plugin-better-tailwindcss'))

  const files = [
    cssGlob,
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      files,
      name: 'favorodera/tailwind/rules',
      rules: {
        'tailwind/enforce-canonical-classes': 'error',
        'tailwind/enforce-consistent-class-order': [
          'error',
          {
            componentClassOrder: 'asc',
            componentClassPosition: 'start',
            order: 'strict',
            unknownClassOrder: 'asc',
            unknownClassPosition: 'start',
          },
        ],
        'tailwind/enforce-consistent-line-wrapping': [
          'error',
          { group: 'newLine' },
        ],
        'tailwind/enforce-consistent-variant-order': 'error',
        'tailwind/enforce-logical-properties': 'error',
        'tailwind/no-concatenated-classes': 'error',
        'tailwind/no-conflicting-classes': 'error',
        'tailwind/no-deprecated-classes': 'error',
        'tailwind/no-duplicate-classes': 'error',
        'tailwind/no-unknown-classes': 'error',
        'tailwind/no-unnecessary-whitespace': 'error',

        ...resolvedOptions.overrides,
      },
    },

    {
      name: 'favorodera/tailwind/setup',
      plugins: { tailwind: tailwindPlugin },
      settings: {
        'better-tailwindcss': resolvedOptions.settings,
      },
    },
  ]
}
