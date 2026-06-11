import type { Selectors } from 'eslint-plugin-better-tailwindcss/api/types'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Tailwind CSS linting rules. */
export type TailwindConfigOptions = SharedOptions & {
  /**
   * Custom settings for the `eslint-plugin-better-tailwindcss` plugin.
   * Configure project paths, detection features, and rule specifics.
   */
  settings?: {
    /**
     * Working directory used to resolve Tailwind config files.
     * Useful for monorepos where linting runs from the root but each project has its own setup.
     * Relative to the ESLint process's cwd; defaults to that cwd if not specified.
     */
    cwd?: string

    /**
     * Whether to detect custom component classes (like `card`, `btn`) defined in Tailwind CSS v4,
     * so they are not reported as unknown classes.
     * @default true
     */
    detectComponentClasses?: boolean

    /**
     * Path to the CSS entry file (e.g. `src/global.css`), relative to the current working directory.
     * Falls back to the default configuration when omitted.
     */
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
     * Used to determine if arbitrary values can be replaced with predefined sizing scales.
     */
    rootFontSize?: number

    /**
     * Flat list of AST selectors that determine which string literals are linted as Tailwind classes.
     * Only matches are treated as class candidates.
     */
    selectors?: Selectors
  }
}

const tailwindDefaults: TailwindConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
  settings: {
    detectComponentClasses: true,
  },
}

/**
 * Constructs the flat config items for Tailwind CSS linting, providing custom settings
 * to parse and lint utility classes, and enforcing consistent ordering.
 * @param options Tailwind configuration options.
 * @returns Promise resolving to Tailwind ESLint config items.
 */
export async function tailwind(options: TailwindConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, tailwindDefaults)

  const tailwindPlugin = await importModule(import('eslint-plugin-better-tailwindcss'))

  const baseRules = {
    ...tailwindPlugin.configs['recommended-error'].rules,
    ...tailwindPlugin.configs['stylistic-error'].rules,
  }

  return [
    {
      name: 'favorodera/tailwind/setup',
      plugins: { tailwind: tailwindPlugin },
      settings: {
        tailwindcss: resolved.settings,
      },
    },
    {
      files: resolved.files,
      name: 'favorodera/tailwind/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { 'better-tailwindcss': 'tailwind' }),

        'tailwind/enforce-consistent-class-order': ['error', {
          componentClassOrder: 'asc',
          componentClassPosition: 'start',
          order: 'strict',
          unknownClassOrder: 'asc',
          unknownClassPosition: 'start',
        }],
        'tailwind/enforce-consistent-important-position': 'off',
        'tailwind/enforce-consistent-line-wrapping': ['error', { group: 'emptyLine' }],
        'tailwind/enforce-consistent-variable-syntax': 'off',
        'tailwind/enforce-consistent-variant-order': 'error',
        'tailwind/enforce-logical-properties': 'error',
        'tailwind/enforce-shorthand-classes': 'off',

        ...resolved.overrides,
      },
    },
  ]
}
