import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { yamlGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring YAML linting rules. */
export type YAMLConfigOptions = SharedOptions

const yamlDefaults: YAMLConfigOptions = {
  files: [yamlGlob],
}

/**
 * Constructs the flat config items for YAML linting, setting up
 * the custom parser and rule validations.
 * @param options YAML configuration options.
 * @returns Promise resolving to YAML ESLint config items.
 */
export async function yaml(options: YAMLConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, yamlDefaults)

  const [yamlPlugin, yamlParser] = await Promise.all([
    importModule(import('eslint-plugin-yml')),
    importModule(import('yaml-eslint-parser')),
  ])

  const baseRules = extractRules(yamlPlugin.configs.recommended)

  return [
    {
      name: 'favorodera/yaml/setup',
      plugins: { yml: yamlPlugin },
    },
    {
      files: resolved.files,
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/rules',
      rules: {
        ...baseRules,

        'style/spaced-comment': 'off',

        'yml/block-mapping': 'error',
        'yml/block-mapping-question-indicator-newline': 'error',
        'yml/block-sequence': 'error',
        'yml/block-sequence-hyphen-indicator-newline': 'error',
        'yml/flow-mapping-curly-newline': 'error',
        'yml/flow-mapping-curly-spacing': 'error',
        'yml/flow-sequence-bracket-newline': 'error',
        'yml/flow-sequence-bracket-spacing': 'error',
        'yml/indent': ['error', 2],
        'yml/key-spacing': 'error',
        'yml/no-empty-key': 'error',
        'yml/no-empty-sequence-entry': 'error',
        'yml/no-irregular-whitespace': 'error',
        'yml/no-tab-indent': 'error',
        'yml/plain-scalar': 'error',
        'yml/quotes': ['error', { avoidEscape: true, prefer: 'single' }],
        'yml/spaced-comment': 'error',
        'yml/vue-custom-block/no-parsing-error': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
