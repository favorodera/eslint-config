import type { TypedFlatConfigItem } from '../types/utils'
import { codeInMdGlob, jsGlob, json5Glob, jsoncGlob, jsonGlob, mdGlob, mdInMdGlob, testGlob, tsGlob, vueGlob } from '../globs'

/**
 * Centralized disable configs applied **last** in the composer chain
 * so they always override any rule enabled by preceding configs.
 * @returns Config items that turn off specific rules for targeted file globs.
 */
export function disables(): Array<TypedFlatConfigItem> {
  return [
    {
      files: [
        json5Glob,
        jsoncGlob,
        jsonGlob,
      ],
      name: 'favorodera/disables/jsonc',
      rules: {
        'no-irregular-whitespace': 'off',
      },
    },
    {
      files: [mdGlob],
      ignores: [mdInMdGlob],
      languageOptions: {
        frontmatter: 'yaml',
      },
      name: 'favorodera/disables/markdown',
      rules: {
        'md/no-missing-atx-heading-space': 'off',
      },
    },
    {
      files: [codeInMdGlob],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: { impliedStrict: true },
        },
      },
      name: 'favorodera/disables/code-in-markdown',
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'unicode-bom': 'off',

        'node/prefer-global/process': 'off',

        'style/comma-dangle': 'off',
        'style/eol-last': 'off',
        'style/line-comment-position': 'off',
        'style/padding-line-between-statements': 'off',

        'ts/consistent-type-imports': 'off',
        'ts/explicit-function-return-type': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',

        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        'vue/no-unused-vars': 'off',

        'jsdoc/require-jsdoc': 'off',
      },
    },
    {
      files: [
        jsGlob,
        tsGlob,
        vueGlob,
      ],
      name: 'favorodera/disables/js-ts-vue',
      rules: {
        'jsdoc/require-throws-type': 'off',

        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'node/no-process-exit': 'off',

        'tailwind/enforce-consistent-important-position': 'off',
        'tailwind/enforce-consistent-variable-syntax': 'off',
        'tailwind/enforce-shorthand-classes': 'off',

        'unicorn/filename-case': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/prevent-abbreviations': 'off',

        'no-unused-vars': 'off',

        'ts/no-unused-vars': 'off',
      },
    },
    {
      files: [vueGlob],
      name: 'favorodera/disables/vue',
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: [testGlob],
      name: 'favorodera/disables/test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ]
}
