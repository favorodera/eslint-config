import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'
import { getModuleDefault, renameRules } from '../utils'
import type { CompatibleConfigArray } from 'typescript-eslint'

/** Configuration options for TypeScript ESLint rules */
export type TypescriptConfigOptions = SharedOptions

const typescriptDefaults: TypescriptConfigOptions = {
  files: [tsGlob],
}

/**
 * Extract and merge rules from a compatible config array.
 * @param configs - Array of compatible ESLint configs
 * @returns Merged rules object from all configs
 */
function extractRules(configs: CompatibleConfigArray): Record<string, any> {
  return Object.assign({}, ...configs.map(config => config.rules || {}))
}

/**
 * Typescript linting via `typescript-eslint`.
 * @param options - TypeScript configuration options
 * @returns Promise resolving to TypeScript ESLint config items
 */
export async function typescript(options: TypescriptConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, typescriptDefaults)

  const tsEsLint = await getModuleDefault(import('typescript-eslint'))

  return [
    {
      name: 'favorodera/typescript/rules',
      files: resolved.files,
      plugins: { ts: tsEsLint.plugin },
      languageOptions: {
        parser: tsEsLint.parser,
        parserOptions: {
          sourceType: 'module',
        },
      },
      rules: {
        ...renameRules(extractRules(tsEsLint.configs.strict), { '@typescript-eslint': 'ts' }),
        ...renameRules(extractRules(tsEsLint.configs.stylistic), { '@typescript-eslint': 'ts' }),

        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        'ts/array-type': ['error', { default: 'array' }],

        ...resolved.overrides,
      },
    },
  ]
}
