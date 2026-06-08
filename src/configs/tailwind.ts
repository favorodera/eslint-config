import type { Selectors } from 'eslint-plugin-better-tailwindcss/api/types'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { getModuleDefault, renameRules } from '../utils'
import { defu } from 'defu'
import { jsGlob, tsGlob, vueGlob } from '../globs'

/**
 * Tailwind ESLint configuration options.
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md
 */
export type TailwindConfigOptions = SharedOptions & {
  settings?: {
    /**
     * Path to the CSS entry file (e.g. `src/global.css`), relative to the current working directory.
     * Falls back to the default configuration when omitted.
     */
    entryPoint?: string

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
     * Font size of the `<html>` element in pixels (default 16px).
     * Used to determine if arbitrary values can be replaced with predefined sizing scales.
     */
    rootFontSize?: number

    /**
     * How linting messages are displayed:
     * - `"visual"` – visualizes whitespace/line breaks (default outside CI)
     * - `"compact"` – single-line messages, suitable for CI
     * - `"raw"` – raw information without visualization
     *
     * Defaults to `"visual"`, or `"compact"` in CI environments.
     */
    messageStyle?: 'visual' | 'compact' | 'raw'

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
 * Tailwind linting via `eslint-plugin-better-tailwindcss`.
 * @param options - Tailwind configuration options
 * @returns Promise resolving to Tailwind ESLint config items
 */
export async function tailwind(options: TailwindConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, tailwindDefaults)

  const tailwindPlugin = await getModuleDefault(import('eslint-plugin-better-tailwindcss'))

  return [
    {
      name: 'favorodera/tailwind/rules',
      plugins: { tailwind: tailwindPlugin },
      files: resolved.files,
      settings: {
        tailwindcss: resolved.settings,
      },
      rules: {
        ...renameRules(tailwindPlugin.configs['recommended-error'].rules, { 'better-tailwindcss': 'tailwind' }),
        ...renameRules(tailwindPlugin.configs['stylistic-error'].rules, { 'better-tailwindcss': 'tailwind' }),

        'tailwind/no-unregistered-classes': 'off',
        'tailwind/enforce-consistent-line-wrapping': ['error', { group: 'emptyLine' }],

        ...resolved.overrides,
      },
    },
  ]
}
