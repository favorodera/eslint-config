import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import globals from 'globals'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring JavaScript linting rules. */
export type JavascriptConfigOptions = SharedOptions

const javascriptDefaults: JavascriptConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Constructs the flat config items for core JavaScript linting, setting up the required
 * language options, globals, and recommended baseline rules.
 * @param options Javascript configuration options.
 * @returns Promise resolving to javascript ESLint config items.
 */
export async function javascript(options: JavascriptConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, javascriptDefaults)

  const jsPlugin = await importModule(import('@eslint/js'))

  const baseRules = jsPlugin.configs.recommended.rules

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
      files: resolved.files,
      name: 'favorodera/javascript/rules',
      rules: {
        ...baseRules,

        'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
        'array-callback-return': 'error',
        'block-scoped-var': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
