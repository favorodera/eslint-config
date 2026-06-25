import type { TypedFlatConfigItem } from '../types/utils'
import { tsGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for TypeScript linting, initializing the parser
 * and extending the recommended and strict type-aware rule sets.
 * @returns Promise resolving to TypeScript ESLint config items.
 */
export async function typescript(): Promise<Array<TypedFlatConfigItem>> {
  const tsEsLint = await importModule(import('typescript-eslint'))

  const files = [tsGlob]

  // Both arrays share base + eslint-recommended, only the 3rd element differs
  const [
    baseConfig,
    eslintRecommended,
    strictConfig,
  ] = tsEsLint.configs.strict
  const stylisticConfig = tsEsLint.configs.stylistic[2]

  const baseRest = omit(baseConfig, [
    'rules',
    'name',
  ])

  // Merge rules from eslint-recommended (core overrides), strict, and stylistic
  const rules = {
    ...eslintRecommended?.rules,
    ...strictConfig?.rules,
    ...stylisticConfig?.rules,
  }

  return [
    {
      ...baseRest,
      name: 'favorodera/typescript/setup',
    },
    {
      files,
      name: 'favorodera/typescript/rules',
      rules: {
        ...rules,

        'ts/array-type': [
          'error',
          { default: 'generic', readonly: 'generic' },
        ],
        'ts/consistent-type-imports': 'error',
        'ts/default-param-last': 'error',
        'ts/method-signature-style': 'error',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-loop-func': 'error',
        'ts/no-redeclare': 'error',
      },
    },
  ]
}
