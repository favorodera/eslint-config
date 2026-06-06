import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'
import { getModuleDefault } from '../utils'

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
    ...tsEsLint.configs.recommended as any,
    ...tsEsLint.configs.strict as any,
    ...tsEsLint.configs.stylistic as any,
    {
      name: 'favorodera/typescript/rules',
      files: resolved.files,
      rules: {
        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],

        ...resolved.overrides,
      },
    },
  ]
}
