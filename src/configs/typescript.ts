import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'
import { importModule } from '../utils'
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
export async function typescript(options: TypescriptConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, typescriptDefaults)

  const tsEsLint = await importModule(import('typescript-eslint'))

  const inheritedRules = Object.assign(
    {},
    ...[
      ...tsEsLint.configs.recommended,
      ...tsEsLint.configs.strict,
    ].map(config => config?.rules || {}),
  )

  return [
    {
      name: 'favorodera/typescript',
      plugins: { ts: tsEsLint.plugin },
      languageOptions: {
        parser: tsEsLint.parser,
        parserOptions: { sourceType: 'module' },
      },
      files: resolved.files,
      rules: {
        ...renamePluginsInRules(inheritedRules, { '@typescript-eslint': 'ts' }),

        'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        'ts/array-type': ['error', { default: 'array' }],

        ...resolved.overrides,
      },
    },
  ]
}
