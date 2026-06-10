import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Perfectionist linting rules. */
export type PerfectionistConfigOptions = SharedOptions

const perfectionistDefaults: PerfectionistConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Constructs the flat config items for Perfectionist linting, providing rules
 * to naturally sort objects, imports, classes, and other elements in your code.
 * @param options Perfectionist configuration options.
 * @returns Promise resolving to Perfectionist ESLint config items.
 */
export async function perfectionist(options: PerfectionistConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, perfectionistDefaults)

  const perfectionistPlugin = await importModule(import('eslint-plugin-perfectionist'))

  const baseRules = perfectionistPlugin.configs['recommended-natural']?.rules || {}

  return [
    {
      name: 'favorodera/perfectionist/setup',
      plugins: { perfectionist: perfectionistPlugin },
    },
    {
      files: resolved.files,
      name: 'favorodera/perfectionist/rules',
      rules: {
        ...baseRules,

        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-imports': ['error', {
          groups: [
            'type-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal'],

            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'ts-equals-import',
            'unknown',
          ],
          newlinesBetween: 'ignore',
          newlinesInside: 'ignore',
          order: 'asc',
          type: 'natural',
        }],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
        
        ...resolved.overrides,
      },
    },
  ]
}
