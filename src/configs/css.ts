import { defu } from 'defu'
import { tailwind4 } from 'tailwind-csstree'
import type { BooleanSharedOptions, PromisedTypedConfigFlatItemArray, SharedOptions, TypedFlatConfigItem } from '../types'
import { cssGlob } from '../globs'
import { importModule, resolveOptions } from '../utils'

/** Options for CSS linting and its optional CSSicorn rule set. */
export type CSSOptions = SharedOptions & {
  /**
   * Enables the optional CSSicorn rule set.
   * @default true
   */
  cssicorn?: BooleanSharedOptions
}

/** Default CSS settings, including enabled CSSicorn rules. */
const cssDefaults = {
  cssicorn: true,
  overrides: undefined,
} satisfies CSSOptions

/**
 * Creates flat config items for CSS linting.
 * @param options CSS-specific settings and rule overrides.
 * @returns Flat config items for this configuration group.
 */
export async function css(options: CSSOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, cssDefaults)
  const enableCssicorn = resolveOptions(resolvedOptions.cssicorn, {})

  const cssPlugin = await importModule(import('@eslint/css'))

  const files = [cssGlob]

  const config: TypedFlatConfigItem[] = [
    {
      name: 'favorodera/css/setup',
      plugins: { css: cssPlugin },
    },

    {
      files,
      language: 'css/css',
      languageOptions: {
        customSyntax: tailwind4,
        tolerant: true,
      },
      name: 'favorodera/css/rules',
      rules: {
        ...cssPlugin.configs.recommended.rules,

        'css/prefer-logical-properties': 'error',
        'css/relative-font-units': 'error',

        ...options.overrides,
      },
    },
  ]

  if (enableCssicorn) {
    const cssicornPlugin = await importModule(import('eslint-cssicorn'))

    config.push(
      {
        name: 'favorodera/css/cssicorn/setup',
        plugins: { cssicorn: cssicornPlugin },
      },

      {
        files,
        language: 'css/css',
        languageOptions: {
          customSyntax: tailwind4,
          tolerant: true,
        },
        name: 'favorodera/css/cssicorn/rules',
        rules: {
          ...cssicornPlugin.configs.recommended.rules,

          ...enableCssicorn.overrides,
        },
      },
    )
  }

  return config
}
