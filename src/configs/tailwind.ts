import type { Selectors } from 'eslint-plugin-better-tailwindcss/api/types'
import { defu } from "defu"
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { cssGlob, jsGlob, tsGlob, vueGlob } from "../globs"
import { importModule } from "../utils"

/** Shared configuration options for ESLint rules and Tailwind settings */
export type TailwindOptions = SharedOptions & {
  settings?: TailwindSettings
}

/**
 * Options for configuring Tailwind CSS linting rules.
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md
 */
interface TailwindSettings {
 /**
   * Working directory used to resolve Tailwind config files.
   * 
   * Useful for monorepos where linting runs from the root but each project has its own setup.
   * 
   * Relative to the ESLint process's cwd; defaults to that cwd if not specified.
   */
  cwd?: string

  /**
   * Whether to detect custom component classes (like `card`, `btn`) defined in Tailwind CSS v4, so they are not reported as unknown classes.
   * @default true
   */
  detectComponentClasses?: boolean

  /**
   * Path to the CSS entry file (e.g. `src/global.css`), relative to the current working directory.
   * 
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
   * 
   * Used to determine if arbitrary values can be replaced with predefined sizing scales.
   */
  rootFontSize?: number

  /**
   * Flat list of AST selectors that determine which string literals are linted as Tailwind classes.
   * 
   * Only matches are treated as class candidates.
   */
  selectors?: Selectors
}

const tailwindDefaults: TailwindSettings = {
  detectComponentClasses: true,
}

/** 
 * Constructs the flat config for tailwind linting
 * @returns Flat config items
 */
export async function tailwind(options: TailwindOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, { settings: tailwindDefaults })

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
        'tailwind/enforce-logical-properties': 'error',

        ...resolvedOptions.overrides
      }
    },

    {
      name: 'favorodera/tailwind/setup',
      plugins: { 'tailwind': tailwindPlugin, },
      settings: {
        'better-tailwindcss': resolvedOptions.settings,
      },
    }
  ]
}