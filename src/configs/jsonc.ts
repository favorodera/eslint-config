import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { importModule } from '../utils'
import { json5Glob, jsoncGlob, jsonGlob } from '../globs'

export type JSONCConfigOptions = SharedOptions

const jsoncDefaults: JSONCConfigOptions = {
  files: [json5Glob, jsoncGlob, jsonGlob],
}

export async function jsonc(options: JSONCConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, jsoncDefaults)

  const jsoncPlugin = await importModule(import('eslint-plugin-jsonc'))

  return [
    {
      name: 'favorodera/jsonc/setup',
      plugins: { jsonc: jsoncPlugin },
    },
    {
      name: 'favorodera/jsonc/rules',
      files: resolved.files,
      language: 'jsonc/x',
      rules: {
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-floating-decimal': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-infinity': 'error',
        'jsonc/no-multi-str': 'error',
        'jsonc/no-nan': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-octal': 'error',
        'jsonc/no-octal-escape': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/space-unary-ops': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/vue-custom-block/no-parsing-error': 'error',
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', 2],
        'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'jsonc/object-curly-newline': ['error', { consistent: true, multiline: true }],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'jsonc/quote-props': 'error',
        'jsonc/quotes': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
