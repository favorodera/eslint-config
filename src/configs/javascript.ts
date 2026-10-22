import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { jsGlob, tsGlob, vueGlob } from "../globs"
import globals from 'globals'

/** 
 * Constructs the flat config for core javascript linting
 * @returns Flat config items
 */
export async function javascript(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/javascript/setup',
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },

    {
      files,
      name: 'favorodera/javascript/rules',
      rules: {
        'array-callback-return': [
          'error',
          {
            allowImplicit: true,
            checkForEach: true
          },
        ],
        'for-direction': 'error',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-constant-binary-expression': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-dupe-else-if': 'error',
        'no-duplicate-case': 'error',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-ex-assign': 'error',
        'no-fallthrough': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-prototype-builtins': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-unassigned-vars': 'error',
        'no-unexpected-multiline': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unreachable-loop': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-optional-chaining': 'error',
        'no-useless-assignment': 'error',
        'no-useless-backreference': 'error',
        'require-atomic-updates': 'error',
        'use-isnan': 'error',
        'arrow-body-style': ['error', 'always'],
        'default-case-last': 'error',
        'eqeqeq': 'error',
        'new-cap': 'error',
        'no-alert': 'error',
        'no-caller': 'error',
        'no-console': 'error',
        'no-continue': 'error',
        'no-else-return': 'error',
        'no-empty': [
          'error',
          { allowEmptyCatch: true },
        ],
        'no-eq-null': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-labels': [
          'error',
          { allowLoop: false, allowSwitch: false },
        ],
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-multi-str': 'error',
        'no-negated-condition': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-object-constructor': 'error',
        'no-octal-escape': 'error',
        'no-param-reassign': 'error',
        'no-promise-executor-return': 'error',
        'no-proto': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'block-scoped-var': 'error',
        'dot-notation': 'error',
        'getter-return': [
          'error',
          {
            allowImplicit: true,
          },
        ],
        'no-constructor-return': 'error',
        'no-eval': 'error',
        'no-unneeded-ternary': [
          'error',
          { defaultAssignment: false },
        ],
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'one-var': [
          'error',
          { initialized: 'never' },
        ],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true,
          },
        ],
        'prefer-exponentiation-operator': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': [
          'error',
          { disallowRedundantWrapping: true },
        ],
        'prefer-template': 'error',
        'symbol-description': 'error',
        'unicode-bom': 'error',
        'valid-typeof': [
          'error',
          { requireStringLiterals: true },
        ],
        'vars-on-top': 'error',
        'yoda': 'error',

        ...options.overrides
      }
    }
  ]
}