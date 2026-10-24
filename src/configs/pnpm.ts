import { defu } from 'defu'
import type { BooleanSharedOptions, PromisedTypedConfigFlatItemArray, TypedFlatConfigItem } from '../types'
import { packageJsonGlob, pnpmWorkspaceGlob } from '../globs'
import { importModule, resolveOptions } from '../utils'

/** Options for pnpm package and workspace linting. */
export type PNPMOptions = {
  /**
   * Enables pnpm rules for package.json files.
   * @default true
   */
  packageJson?: BooleanSharedOptions

  /**
   * Enables pnpm rules for pnpm-workspace.yaml.
   * @default true
   */
  pnpmWorkspace?: BooleanSharedOptions
}

/** Default options for pnpm linting. */
const pnpmDefaults = {
  packageJson: true,
  pnpmWorkspace: true,
} satisfies PNPMOptions

/**
 * Creates flat config items for pnpm package and workspace rules.
 * @param options Options for package.json and pnpm-workspace.yaml rules.
 * @returns Flat config items for this configuration group.
 */
export async function pnpm(options: PNPMOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, pnpmDefaults)
  const enablePackageJson = resolveOptions(resolvedOptions.packageJson, {})
  const enablePnpmWorkspace = resolveOptions(resolvedOptions.pnpmWorkspace, {})

  const pnpmPlugin = await importModule(import('eslint-plugin-pnpm'))

  const config: TypedFlatConfigItem[] = [
    {
      name: 'favorodera/pnpm/setup',
      plugins: { pnpm: pnpmPlugin },
    },
  ]

  if (enablePackageJson) {
    config.push({
      files: [packageJsonGlob],
      language: 'jsonc/x',
      name: 'favorodera/pnpm/package-json/rules',
      rules: {
        'pnpm/json-enforce-catalog': [
          'error',
          {
            autofix: false,
            fields: [
              'dependencies',
              'devDependencies',
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
          { autofix: false },
        ],

        ...enablePackageJson.overrides,
      },
    })
  }

  if (enablePnpmWorkspace) {
    const yamlParser = await importModule(import('yaml-eslint-parser'))

    config.push({
      files: [pnpmWorkspaceGlob],
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/pnpm/pnpm-workspace/rules',
      rules: {
        'pnpm/yaml-enforce-settings': [
          'error',
          {
            settings: {
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

        ...enablePnpmWorkspace.overrides,
      },
    })
  }

  return config
}
