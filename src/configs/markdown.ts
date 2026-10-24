import { defu } from 'defu'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { mdGlob, mdInMdGlob } from '../globs'
import { importModule } from '../utils'

/** Options for Markdown linting and language settings. */
export type MarkdownOptions = SharedOptions & {
  /** Markdown language features, including GitHub Flavored Markdown. */
  settings?: MarkdownSettings
}

/** Options controlling Markdown language features. */
interface MarkdownSettings {
  /**
   * Enable GitHub Flavored Markdown (GFM) support.
   *
   * When true, applies additional linting rules specific to GFM extensions
   * like tables, task lists, and strikethrough.
   * @default true
   */
  gfm?: boolean
}

/** Default Markdown settings. */
const markdownDefaults = {
  overrides: undefined,
  settings: {
    gfm: true,
  },
} satisfies MarkdownOptions

/**
 * Creates flat config items for Markdown linting.
 * @param options Markdown language settings and rule overrides.
 * @returns Flat config items for this configuration group.
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
