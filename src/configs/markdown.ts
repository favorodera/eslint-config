import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { mdGlob } from '../globs'
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { importModule } from '../utils'

export type MarkdownConfigOptions = SharedOptions & {
  /** github flavoured markdown */
  gfm?: boolean
}

const markdownDefaults: MarkdownConfigOptions = {
  files: [mdGlob],
  gfm: true,
}

export async function markdown(options: MarkdownConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, markdownDefaults)

  const markdownPlugin = await importModule(import('@eslint/markdown'))

  const inheritedRules = Object.assign(
    {},
    ...[
      ...markdownPlugin.configs.recommended,
    ].map(config => config?.rules || {}),
  )

  return [
    {
      name: 'favorodera/markdown',
      files: resolved.files,
      plugins: { md: markdownPlugin },
      processor: mergeProcessors([
        markdownPlugin.processors?.markdown,
        processorPassThrough,
      ]),
      language: resolved.gfm ? 'md/gfm' : 'md/commonmark',
      rules: {
        ...renamePluginsInRules(inheritedRules, { markdown: 'md' }),

        'md/fenced-code-language': 'off',
        'md/no-missing-label-refs': 'off',

        ...resolved.overrides,
      },
    },
  ]
}
