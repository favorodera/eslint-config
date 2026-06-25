import type { TypedFlatConfigItem } from '../types/utils'
import { packageJsonGlob, pnpmWorkspaceGlob } from '../globs'
import { importModule } from '../utils'

/**
 * Constructs the flat config items for pnpm linting.
 * @returns Promise resolving to pnpm ESLint config items.
 */
export async function pnpm(): Promise<Array<TypedFlatConfigItem>> {
  const [
    pnpmPlugin,
    yamlParser,
  ] = await Promise.all([
    importModule(import('eslint-plugin-pnpm')),
    importModule(import('yaml-eslint-parser')),
  ])

  return [
    {
      name: 'favorodera/pnpm/setup',
      plugins: { pnpm: pnpmPlugin },
    },
    {
      files: [packageJsonGlob],
      language: 'jsonc/x',
      name: 'favorodera/pnpm/package-json',
      rules: {
        'pnpm/json-enforce-catalog': [
          'error',
          {
            autofix: true,
            fields: [
              'dependencies',
              'devDependencies',
              'optionalDependencies',
              'peerDependencies',
            ],
            ignores: ['@types/vscode'],
          },
        ],
        'pnpm/json-prefer-workspace-settings': [
          'error',
          { autofix: true },
        ],
        'pnpm/json-valid-catalog': [
          'error',
          { autofix: true },
        ],
      },
    },
    {
      files: [pnpmWorkspaceGlob],
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/pnpm/pnpm-workspace-yaml',
      rules: {
        'pnpm/yaml-enforce-settings': [
          'error',
          {
            settings: {
              allowBuilds: {
                '@parcel/watcher': true,
                '@tailwindcss/oxide': true,
                'better-sqlite3': true,
                'esbuild': true,
                'sharp': true,
                'unrs-resolver': true,
                'vue-demi': true,
              },
              shellEmulator: true,
              trustPolicy: 'no-downgrade',
            },
          },
        ],
        'pnpm/yaml-no-duplicate-catalog-item': [
          'error',
          { checkDuplicates: 'exact-version' },
        ],
        'pnpm/yaml-no-unused-catalog-item': 'error',
        'pnpm/yaml-valid-packages': 'error',
      },
    },
  ]
}
