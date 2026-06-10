import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { jsGlob, tsGlob, vueGlob } from '../globs'
import { importModule } from '../utils'

/** Options for configuring Node.js linting rules. */
export type NodeConfigOptions = SharedOptions

const nodeDefaults: NodeConfigOptions = {
  files: [jsGlob, tsGlob, vueGlob],
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

  const baseRules = nodePlugin.configs?.['flat/recommended']?.rules || {}

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

        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-missing-import': 'off',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/no-unpublished-import': 'off',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
