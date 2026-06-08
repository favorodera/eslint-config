import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { mdGlob } from '../globs'
import { getModuleDefault, renameRules } from '../utils'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'

/** Configuration options for Markdown ESLint rules */
export type MarkdownConfigOptions = SharedOptions & {
  /**
   * Enable GFM (GitHub Flavored Markdown) support.
   * @default true
   */
  gfm?: boolean
}

const markdownDefaults: MarkdownConfigOptions = {
  files: [mdGlob],
  gfm: true,
}

/**
 * Markdown linting via `@eslint/markdown`.
 * @param options - Markdown configuration options
 * @returns Promise resolving to Markdown ESLint config items
 */
export async function markdown(options: MarkdownConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, markdownDefaults)

  const markdownPlugin = await getModuleDefault(import('@eslint/markdown'))

  return [
    {
      name: 'favorodera/markdown/rules',
      files: resolved.files,
      plugins: { md: markdownPlugin },
      processor: mergeProcessors([
        markdownPlugin.processors?.markdown,
        processorPassThrough,
      ]),
      language: resolved.gfm ? 'md/gfm' : 'md/commonmark',
      rules: {
        ...renameRules(markdownPlugin.configs.recommended[0]?.rules || {}, { markdown: 'md' }),

        'md/fenced-code-language': 'off',
        'md/no-missing-label-refs': 'off',

        ...resolved.overrides,
      },
    },
  ]
}
