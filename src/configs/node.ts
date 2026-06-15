import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Node.js linting rules. */
export type NodeConfigOptions = SharedOptions

const nodeDefaults: NodeConfigOptions = {
  files: [
    jsGlob,
    tsGlob,
    vueGlob,
  ],
}

/**
 * Constructs the flat config items for Node.js linting, providing rules
 * to enforce best practices for Node.js environments.
 * @param options Node configuration options.
 * @returns Promise resolving to Node ESLint config items.
 */
export async function node(options: NodeConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, nodeDefaults)

  const nodePlugin = await importModule(import('eslint-plugin-n'))

  const baseRules = nodePlugin.configs?.['flat/recommended-module']?.rules || {}

  return [
    {
      name: 'favorodera/node/setup',
      plugins: { node: nodePlugin },
    },
    {
      files: resolved.files,
      name: 'favorodera/node/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { n: 'node' }),

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

        'node/no-process-exit': 'off',

        ...resolved.overrides,
      },
    },
    {
      files: [
        tsGlob,
        vueGlob,
      ],
      name: 'favorodera/node/disables',
      rules: {
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
      },
    },
  ]
}
