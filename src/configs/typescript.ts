import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Constructs the flat config for core typescript linting
 * @returns Flat config items
 */
export async function typescript(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const typescriptPlugin = await importModule(import('typescript-eslint'))

  const files = [tsGlob, vueGlob]

  return [
    {
      languageOptions: {
        parser: typescriptPlugin.parser,
      },
      name: 'favorodera/typescript/setup',
      plugins: { typescript: typescriptPlugin.plugin },
    },

    {
      files,
      name: 'favorodera/typescript/rules',
      rules: {
        ...typescriptPlugin.configs.strict[1].rules,
        ...typescriptPlugin.configs.strict[2].rules,
        ...typescriptPlugin.configs.strict[2].rules,

        'typescript/array-type': 'error',
        'typescript/consistent-type-imports': 'error',
        'typescript/default-param-last': 'error',
        'typescript/method-signature-style': 'error',
        'typescript/no-import-type-side-effects': 'error',
        'typescript/no-redeclare': 'error',
        'typescript/no-unused-vars': 'off',

        ...options.overrides,
      },
    },
  ]
}
