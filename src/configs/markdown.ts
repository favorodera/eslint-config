import { defu } from 'defu'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { mdGlob, mdInMdGlob } from '../globs'
import { importModule } from '../utils'

/** Shared configuration options for ESLint rules and Markdown settings */
export type MarkdownOptions = SharedOptions & {
  settings?: MarkdownSettings
}

/** Options for configuring Markdown linting rules. */
interface MarkdownSettings {
  /**
   * Enable GitHub Flavored Markdown (GFM) support.
   * When true, applies additional linting rules specific to GFM extensions
   * like tables, task lists, and strikethrough.
   * @default true
   */
  gfm?: boolean
}

const markdownDefaults = {
  overrides: undefined,
  settings: {
    gfm: true,
  },
} satisfies MarkdownOptions

/**
 * Constructs the flat config for markdown linting
 * @returns Flat config items
 */
export async function markdown(options: MarkdownOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, markdownDefaults)

  const markdownPlugin = await importModule(import('@eslint/markdown'))

  const files = [mdGlob]
  const ignores = [mdInMdGlob]

  return [
    {
      name: 'favorodera/markdown/setup',
      plugins: { markdown: markdownPlugin },
    },

    {
      files,
      ignores,
      language: resolvedOptions.settings.gfm ? 'markdown/gfm' : 'markdown/commonmark',
      languageOptions: {
        frontmatter: 'yaml',
        math: true,
      },
      name: 'favorodera/markdown/rules',
      processor: mergeProcessors([
        markdownPlugin.processors?.markdown,
        processorPassThrough,
      ]),
      rules: {
        ...markdownPlugin.configs.recommended[0].rules,

        'markdown/no-missing-atx-heading-space': 'off',

        ...resolvedOptions.overrides,
      },
    },
  ]
}
