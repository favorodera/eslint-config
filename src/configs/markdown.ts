import { defu } from 'defu'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import type { TypedFlatConfigItem } from '../types/utils'
import { mdGlob, mdInMdGlob } from '../globs'
import { importModule, omit } from '../utils'

/** Options for configuring Markdown linting rules. */
export interface MarkdownConfigOptions {
  /**
   * Enable GitHub Flavored Markdown (GFM) support.
   * When true, applies additional linting rules specific to GFM extensions
   * like tables, task lists, and strikethrough.
   */
  gfm?: boolean
}

const markdownDefaults: MarkdownConfigOptions = {
  gfm: true,
}

/**
 * Constructs the flat config items for Markdown linting, extracting and linting
 * embedded code blocks within the document according to specified rules.
 * @param options Markdown configuration options.
 * @returns Promise resolving to Markdown ESLint config items.
 */
export async function markdown(options: MarkdownConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, markdownDefaults)

  const markdownPlugin = await importModule(import('@eslint/markdown'))

  const [recommendedConfig] = markdownPlugin.configs.recommended

  const { rules = {} } = recommendedConfig
  const rest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
    'language',
  ])

  return [
    {
      ...rest,
      name: 'favorodera/markdown/setup',
    },
    {
      files: [mdGlob],
      ignores: [mdInMdGlob],
      language: resolved.gfm ? 'md/gfm' : 'md/commonmark',
      languageOptions: {
        frontmatter: 'yaml',
      },
      name: 'favorodera/markdown/rules',
      processor: mergeProcessors([
        markdownPlugin.processors?.markdown,
        processorPassThrough,
      ]),
      rules,
    },
  ]
}
