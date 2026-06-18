import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { codeInMdGlob, mdGlob, mdInMdGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring Markdown linting rules. */
export type MarkdownConfigOptions = SharedOptions & {
  /**
   * Enable GitHub Flavored Markdown (GFM) support.
   * When true, applies additional linting rules specific to GFM extensions
   * like tables, task lists, and strikethrough.
   */
  gfm?: boolean
}

const markdownDefaults: MarkdownConfigOptions = {
  files: [mdGlob],
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

  const baseRules = extractRules(markdownPlugin.configs.recommended)

  return [
    {
      name: 'favorodera/markdown/setup',
      plugins: { md: markdownPlugin },
    },
    {
      files: resolved.files,
      ignores: [mdInMdGlob],
      language: resolved.gfm ? 'md/gfm' : 'md/commonmark',
      name: 'favorodera/markdown/rules',
      processor: mergeProcessors([
        markdownPlugin.processors?.markdown,
        processorPassThrough,
      ]),
      rules: {
        ...renamePluginsInRules(baseRules, { markdown: 'md' }),

        'md/fenced-code-language': 'off',
        'md/no-missing-label-refs': 'off',

        ...resolved.overrides,
      },
    },
    {
      files: [codeInMdGlob],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: { impliedStrict: true },
        },
      },
      name: 'favorodera/markdown/code-in-md/disables',
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'unicode-bom': 'off',

        'node/prefer-global/process': 'off',

        'style/comma-dangle': 'off',
        'style/eol-last': 'off',
        'style/padding-line-between-statements': 'off',

        'ts/consistent-type-imports': 'off',
        'ts/explicit-function-return-type': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',

        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        'vue/no-unused-vars': 'off',
      },
    },
  ]
}
