import globals from 'globals'
import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Constructs the flat config items for core JavaScript linting, setting up the required
 * language options, globals, and recommended baseline rules.
 * @returns Promise resolving to javascript ESLint config items.
 */
export async function javascript(): Promise<Array<TypedFlatConfigItem>> {
  const jsPlugin = await importModule(import('@eslint/js'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
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
      name: 'favorodera/javascript/setup',
    },
    {
      files,
      name: 'favorodera/javascript/rules',
      rules: {
        ...jsPlugin.configs.recommended.rules,

        'array-callback-return': [
          'error',
          {
            allowImplicit: true,
          },
        ],
        'block-scoped-var': 'error',
        'default-case-last': 'error',
        'dot-notation': 'error',
        'eqeqeq': 'error',
        'getter-return': [
          'error',
          {
            allowImplicit: true,
          },
        ],
        'new-cap': 'error',
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-console': [
          'error',
          { allow: [
            'warn',
            'error',
          ] },
        ],
        'no-constructor-return': 'error',
        'no-continue': 'error',
        'no-else-return': 'error',
        'no-empty': [
          'error',
          { allowEmptyCatch: true },
        ],
        'no-eq-null': 'error',
        'no-eval': 'error',
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
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': [
          'error',
          { defaultAssignment: false },
        ],
        'no-unreachable-loop': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-use-before-define': [
          'error',
          { classes: false, functions: false },
        ],
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
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
      },
    },
  ]
}
