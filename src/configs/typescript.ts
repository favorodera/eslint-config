import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'
import { getModuleDefault, renameRules } from '../utils'

/** Configuration options for TypeScript ESLint rules */
export type TypescriptConfigOptions = SharedOptions

/** Default configuration for TypeScript linting */
const typescriptDefaults: TypescriptConfigOptions = {
  files: [tsGlob],
}

/**
 * Typescript linting — `typescript-eslint` and opinionated rules.
 * @param options - TypeScript configuration options
 * @returns Promise resolving to TypeScript ESLint config items
 */
export async function typescript(options: TypescriptConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, typescriptDefaults)

  const tsEsLint = await getModuleDefault(import('typescript-eslint'))

  return [
    {
      name: 'favorodera/typescript/rules',
      plugins: { ts: tsEsLint.plugin },
      languageOptions: {
        parser: tsEsLint.parser,
        sourceType: 'module',
      },
      files: resolved.files,
      rules: {
        ...renameRules(tsEsLint.configs.recommended, { '@typescript-eslint': 'ts' }),
        ...renameRules(tsEsLint.configs.strict, { '@typescript-eslint': 'ts' }),

        'ts/no-explicit-any': 'warn',
        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],

        ...resolved.overrides,
      },
    },
  ]
}
