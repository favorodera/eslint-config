import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Creates flat config items for Node.js-specific linting rules.
 * @param options Rule overrides for Node.js linting.
 * @returns Flat config items for this configuration group.
 */
export async function node(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const nodePlugin = await importModule(import('eslint-plugin-n'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  return [
    {
      name: 'favorodera/node/setup',
      plugins: { node: nodePlugin },
    },

    {
      files,
      name: 'favorodera/node/rules',
      rules: {
        ...nodePlugin.configs['flat/recommended-module'].rules,

        'node/callback-return': 'error',
        'node/handle-callback-err': [
          'error',
          '^(err|error)$',
        ],
        'node/no-callback-literal': 'error',
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/no-process-exit': 'off',
        'node/no-unpublished-import': 'error',
        'node/prefer-global/buffer': 'error',
        'node/prefer-global/console': 'error',
        'node/prefer-global/crypto': 'error',
        'node/prefer-global/process': 'error',
        'node/prefer-global/text-decoder': 'error',
        'node/prefer-global/text-encoder': 'error',
        'node/prefer-global/timers': 'error',
        'node/prefer-global/url': 'error',
        'node/prefer-global/url-search-params': 'error',
        'node/prefer-node-protocol': 'error',
        'node/prefer-promises/dns': 'error',
        'node/prefer-promises/fs': 'error',

        ...options.overrides,
      },
    },
  ]
}
