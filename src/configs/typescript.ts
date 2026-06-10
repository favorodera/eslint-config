import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'
import { extractRules, importModule } from '../utils'
import { renamePluginsInRules } from 'eslint-flat-config-utils'

export type TypescriptConfigOptions = SharedOptions

const typescriptDefaults: TypescriptConfigOptions = {
  files: [tsGlob],
}

/**
 * Typescript linting via `typescript-eslint`.
 * @param options - TypeScript configuration options
 * @returns Array of TypeScript ESLint config items
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
      name: 'favorodera/typescript/rules',
      files: resolved.files,
      languageOptions: {
        parser: tsEsLint.parser,
        parserOptions: { sourceType: 'module' },
      },
      rules: {
        ...renamePluginsInRules(baseRules, { '@typescript-eslint': 'ts' }),

        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        'ts/array-type': ['error', { default: 'generic', readonly: 'generic' }],

        ...resolved.overrides,
      },
    },
  ]
}
