import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { codeInMdGlob } from '../globs'

/**
 * Constructs the flat config for code blocks in markdown linting
 * @returns Flat config items
 */
export async function codeInMarkdown(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const files = [codeInMdGlob]

  return [
    {
      languageOptions: {
        parserOptions: {
          ecmaFeatures: { impliedStrict: true },
        },
      },
      name: 'favorodera/code-in-markdown/setup',
    },

    {
      files,
      name: 'favorodera/code-in-markdown/rules',
      rules: {
        // Javascript
        'no-alert': 'off',
        'no-console': 'off',
        'no-continue': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'unicode-bom': 'off',

        // Node
        'node/no-extraneous-import': 'off',
        'node/prefer-global/process': 'off',

        // Stylistic
        'stylistic/comma-dangle': 'off',
        'stylistic/eol-last': 'off',
        'stylistic/line-comment-position': 'off',
        'stylistic/padding-line-between-statements': 'off',

        // Typescript
        'typescript/consistent-type-imports': 'off',
        'typescript/explicit-function-return-type': 'off',
        'typescript/no-namespace': 'off',
        'typescript/no-redeclare': 'off',
        'typescript/no-require-imports': 'off',
        'typescript/no-unused-expressions': 'off',
        'typescript/no-unused-vars': 'off',
        'typescript/no-use-before-define': 'off',

        // Unused imports
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        // Vue
        'vue/no-unused-vars': 'off',

        // JsDocs
        'jsdoc/require-jsdoc': 'off',

        ...options.overrides,
      },
    },
  ]
}
