import { tailwind4 } from 'tailwind-csstree'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import {  cssGlob } from "../globs"
import { importModule } from "../utils"

/** 
 * Constructs the flat config for core css linting
 * @returns Flat config items
 */
export async function css(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const cssPlugin = await importModule(import('@eslint/css'))

  const files = [
    cssGlob
  ]

  return [
    {
      files,
      language: 'css/css',
      languageOptions: {
        customSyntax: tailwind4,
        tolerant: true,
      },
      name: 'favorodera/css/rules',
      rules: {
        'css/font-family-fallbacks': 'error',
        'css/no-duplicate-imports': 'error',
        'css/no-duplicate-keyframe-selectors': 'error',
        'css/no-empty-blocks': 'error',
        'css/no-invalid-at-rule-placement': 'error',
        'css/no-invalid-at-rules': 'error',
        'css/no-invalid-named-grid-areas': 'error',
        'css/no-invalid-properties': 'error',
        "css/no-unmatchable-selectors": 'error',
        'css/prefer-logical-properties': 'error',
        "css/relative-font-units": 'error',
        'css/use-baseline': 'error',

        ...options.overrides
      }
    },

    {
      name: 'favorodera/css/setup',
      plugins: { 'css': cssPlugin }
    }
  ]
}