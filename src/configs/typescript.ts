import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { tsGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring TypeScript linting rules. */
export type TypescriptConfigOptions = SharedOptions

const typescriptDefaults: TypescriptConfigOptions = {
  files: [tsGlob],
}

/**
 * Constructs the flat config items for TypeScript linting, initializing the parser
 * and extending the recommended and strict type-aware rule sets.
 * @param options TypeScript configuration options.
 * @returns Promise resolving to TypeScript ESLint config items.
 */
export async function typescript(options: TypescriptConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, typescriptDefaults)

  const tsEsLint = await importModule(import('typescript-eslint'))

  const baseRules = extractRules(
    tsEsLint.configs.recommended as any,
    tsEsLint.configs.strict as any,
  )

  return [
    {
      name: 'favorodera/typescript/setup',
      plugins: { ts: tsEsLint.plugin },
    },
    {
      files: resolved.files,
      languageOptions: {
        parser: tsEsLint.parser,
        parserOptions: { sourceType: 'module' },
      },
      name: 'favorodera/typescript/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { '@typescript-eslint': 'ts' }),

        'ts/array-type': ['error', { default: 'generic', readonly: 'generic' }],
        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],

        ...resolved.overrides,
      },
    },
  ]
}
