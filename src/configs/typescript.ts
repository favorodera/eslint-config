import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import { tsGlob, } from "../globs"

/** 
 * Constructs the flat config for core typescript linting
 * @returns Flat config items
 */
export async function typescript(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const typescriptPlugin = await importModule(import('typescript-eslint'))

  const files = [tsGlob]

  return [
    {
      name: 'favorodera/typescript/setup',
      plugins: { ts: typescriptPlugin.plugin },
      languageOptions: {
        parser: typescriptPlugin.parser,
      }
    },

    {
      files,
      name: 'favorodera/typescript/rules',
      rules: {
        'ts/array-type': 'error',
        'ts/consistent-type-imports': 'error',
        'ts/method-signature-style': 'error',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-redeclare': 'error',
        'ts/adjacent-overload-signatures': 'error',
        'ts/ban-ts-comment': 'error',
        "ts/class-methods-use-this": "error",
        "ts/consistent-generic-constructors": "error",
        "ts/consistent-indexed-object-style": "error",
        "ts/consistent-type-assertions": "error",
        "ts/consistent-type-definitions": "error",
        "ts/default-param-last": "error",
        "ts/member-ordering": "error",
        "ts/no-array-constructor": "error",
        "ts/no-confusing-non-null-assertion": "error",
        "ts/no-duplicate-enum-values": "error",
        "ts/no-dynamic-delete": "error",
        "ts/no-empty-object-type": "error",
        "ts/no-explicit-any": "error",
        "ts/no-extra-non-null-assertion": "error",
        "ts/no-extraneous-class": "error",
        "ts/no-inferrable-types": "error",
        "ts/no-invalid-void-type": "error",
        "ts/no-magic-numbers": "error",
        "ts/no-misused-new": "error",
        "ts/no-namespace": "error",
        "ts/no-non-null-asserted-nullish-coalescing": "error",
        "ts/no-non-null-asserted-optional-chain": "error",
        "ts/no-non-null-assertion": "error",
        "ts/no-require-imports": "error",
        "ts/no-shadow": "error",
        "ts/no-this-alias": "error",
        "ts/no-unnecessary-parameter-property-assignment": "error",
        "ts/no-unnecessary-type-constraint": "error",
        "ts/no-unsafe-declaration-merging": "error",
        "ts/no-unsafe-function-type": "error",
        "ts/no-unused-vars": "error",
        "ts/no-unused-expressions": [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],

        ...options.overrides
      }
    }
  ]
}