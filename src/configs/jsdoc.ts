import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring JSDoc linting rules. */
export type JSDocConfigOptions = SharedOptions

const jsdocDefaults: JSDocConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
}

/**
 * Constructs the flat config items for JSDoc linting, ensuring comments follow
 * proper styling, parameter checks, and types alignment.
 * @param options JSDoc configuration options.
 * @returns Promise resolving to JSDoc ESLint config items.
 */
export async function jsdoc(options: JSDocConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, jsdocDefaults)

  const jsdocPlugin = await importModule(import('eslint-plugin-jsdoc'))

  const baseRules = {
    ...jsdocPlugin.configs['flat/recommended-typescript-error']?.rules,
    ...jsdocPlugin.configs['flat/stylistic-typescript-error']?.rules,
  }

  return [
    {
      name: 'favorodera/jsdoc/setup',
      plugins: { jsdoc: jsdocPlugin },
    },
    {
      files: resolved.files,
      name: 'favorodera/tailwind/rules',
      rules: {
        ...baseRules,

        'jsdoc/check-access': 'warn',
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/multiline-blocks': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-yields-check': 'warn',

        ...resolved.overrides,
      },
    },
  ]
}
