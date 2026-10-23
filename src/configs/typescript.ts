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
      files,
      name: 'favorodera/typescript/rules',
      rules: {
        'typescript/array-type': 'error',
        'typescript/ban-ts-comment': 'error',
        'typescript/class-methods-use-this': 'error',
        'typescript/consistent-generic-constructors': 'error',
        'typescript/consistent-indexed-object-style': 'error',
        'typescript/consistent-type-assertions': 'error',
        'typescript/consistent-type-definitions': 'error',
        'typescript/consistent-type-imports': 'error',
        'typescript/default-param-last': 'error',
        'typescript/member-ordering': 'error',
        'typescript/method-signature-style': 'error',
        'typescript/no-array-constructor': 'error',
        'typescript/no-confusing-non-null-assertion': 'error',
        'typescript/no-duplicate-enum-values': 'error',
        'typescript/no-dynamic-delete': 'error',
        'typescript/no-empty-object-type': 'error',
        'typescript/no-explicit-any': 'error',
        'typescript/no-extra-non-null-assertion': 'error',
        'typescript/no-extraneous-class': 'error',
        'typescript/no-import-type-side-effects': 'error',
        'typescript/no-inferrable-types': 'error',
        'typescript/no-invalid-void-type': 'error',
        'typescript/no-magic-numbers': 'error',
        'typescript/no-misused-new': 'error',
        'typescript/no-namespace': 'error',
        'typescript/no-non-null-asserted-nullish-coalescing': 'error',
        'typescript/no-non-null-asserted-optional-chain': 'error',
        'typescript/no-non-null-assertion': 'error',
        'typescript/no-redeclare': 'error',
        'typescript/no-require-imports': 'error',
        'typescript/no-shadow': 'error',
        'typescript/no-this-alias': 'error',
        'typescript/no-unnecessary-parameter-property-assignment': 'error',
        'typescript/no-unnecessary-type-constraint': 'error',
        'typescript/no-unsafe-declaration-merging': 'error',
        'typescript/no-unsafe-function-type': 'error',
        'typescript/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'typescript/no-use-before-define': [
          'error',
          { classes: false, functions: false },
        ],
        'typescript/no-useless-constructor': 'error',
        'typescript/no-wrapper-object-types': 'error',
        'typescript/prefer-as-const': 'error',
        'typescript/prefer-enum-initializers': 'error',
        'typescript/prefer-for-of': 'error',
        'typescript/prefer-function-type': 'error',
        'typescript/prefer-literal-enum-member': 'error',
        'typescript/triple-slash-reference': 'error',
        'typescript/unified-signatures': 'error',

        ...options.overrides,
      },
    },

    {
      languageOptions: {
        parser: typescriptPlugin.parser,
      },
      name: 'favorodera/typescript/setup',
      plugins: { typescript: typescriptPlugin.plugin },
    },
  ]
}
