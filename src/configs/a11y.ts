import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { vueGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/**
 * Constructs the flat config for accessibility linting
 * @returns Flat config items
 */
export async function a11y(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const a11yPlugin = await importModule(import('eslint-plugin-vuejs-accessibility'))

  const files = [vueGlob]

  return [
    {
      name: 'favorodera/a11y/setup',
      plugins: { a11y: a11yPlugin },
    },

    {
      files,
      name: 'favorodera/a11y/rules',
      rules: {
        ...extractRules(a11yPlugin.configs['flat/recommended'] as any),

        'a11y/form-control-has-label': [
          'error',
          {
            controlComponents: [],
            labelComponents: [],
          },
        ],
        'a11y/label-has-for': [
          'error',
          {
            allowChildren: true,
            components: [],
            controlComponents: [],
            required: {
              some: [
                'nesting',
                'id',
              ],
            },
          },
        ],
        'a11y/no-aria-hidden-on-focusable': 'error',
        'a11y/no-role-presentation-on-focusable': 'error',

        ...options.overrides,
      },
    },
  ]
}
