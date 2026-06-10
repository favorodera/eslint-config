import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import globals from 'globals'
import { importModule } from '../utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'

export type JavascriptConfigOptions = SharedOptions

const javascriptDefaults: JavascriptConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Javascript linting via `eslint`
 * @param options - Javascript configuration options
 * @returns Promise resolving to javascript ESLint config items
 */
export async function javascript(options: JavascriptConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, javascriptDefaults)

  const jsPlugin = await importModule(import('@eslint/js'))

  const baseRules = jsPlugin.configs.recommended.rules

  return [
    {
      name: 'favorodera/javascript/setup',
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },
    {
      name: 'favorodera/javascript/rules',
      files: resolved.files,
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
