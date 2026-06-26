import type { TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule, omit } from '../utils'

/**
 * Constructs the flat config items for Node.js linting, providing rules
 * to enforce best practices for Node.js environments.
 * @returns Promise resolving to Node ESLint config items.
 */
export async function node(): Promise<Array<TypedFlatConfigItem>> {
  const nodePlugin = await importModule(import('eslint-plugin-n'))

  const files = [
    jsGlob,
    tsGlob,
    vueGlob,
  ]

  const recommendedConfig = nodePlugin.configs['flat/recommended-module']

  const { rules = {} } = recommendedConfig
  const rest = omit(recommendedConfig, [
    'rules',
    'files',
    'name',
  ])

  return [
    {
      ...rest,
      name: 'favorodera/node/setup',
    },
    {
      files,
      name: 'favorodera/node/rules',
      rules: {
        ...rules,

        'node/callback-return': 'error',
        'node/handle-callback-err': [
          'error',
          '^(err|error)$',
        ],
        'node/no-callback-literal': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
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
      },
    },
  ]
}
