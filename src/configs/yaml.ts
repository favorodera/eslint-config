import { defu } from 'defu'
import type { BooleanSharedOptions, PromisedTypedConfigFlatItemArray, SharedOptions, TypedFlatConfigItem } from '../types'
import { pnpmWorkspaceGlob, yamlGlob } from '../globs'
import { extractRules, importModule, resolveOptions } from '../utils'

/** Options for YAML linting and pnpm workspace key ordering. */
export type YAMLOptions = SharedOptions & {
  /**
   * Enables custom key ordering for pnpm-workspace.yaml.
   * @default true
   */
  pnpmWorkspace?: BooleanSharedOptions
}

/** Default options for YAML linting. */
const yamlDefaults = {
  overrides: undefined,
  pnpmWorkspace: true,
} satisfies YAMLOptions

/**
 * Creates flat config items for YAML files.
 *
 * The configuration applies recommended YAML rules and optionally enforces the
 * project's canonical key order in `pnpm-workspace.yaml`.
 * @param options Rule overrides and YAML-specific options.
 * @returns Flat config items for YAML linting.
 */
export async function yaml(options: YAMLOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, yamlDefaults)
  const enablePnpmWorkspace = resolveOptions(resolvedOptions.pnpmWorkspace, {})

  const [yamlPlugin, yamlParser] = await Promise.all([
    importModule(import('eslint-plugin-yml')),
    importModule(import('yaml-eslint-parser')),
  ])

  const config: TypedFlatConfigItem[] = [
    {
      name: 'favorodera/yaml/setup',
      plugins: { yaml: yamlPlugin },
    },

    {
      files: [yamlGlob],
      language: 'yaml/yaml',
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/rules',
      rules: {
        ...extractRules(yamlPlugin.configs['flat/recommended']),

        'yaml/quotes': [
          'error',
          { avoidEscape: true, prefer: 'single' },
        ],
        'yaml/require-string-key': 'error',

        ...resolvedOptions.overrides,
      },
    },
  ]

  if (enablePnpmWorkspace) {
    config.push({
      files: [pnpmWorkspaceGlob],
      language: 'yaml/yaml',
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/pnpm-workspace/rules',
      rules: {
        'yaml/sort-keys': [
          'error',
          {
            order: [
              // Settings
              'cacheDir',
              'catalogMode',
              'cleanupUnusedCatalogs',
              'dedupeDirectDeps',
              'deployAllFiles',
              'enablePrePostScripts',
              'engineStrict',
              'extendNodePath',
              'hoist',
              'hoistPattern',
              'hoistWorkspacePackages',
              'ignoreCompatibilityDb',
              'ignoreDepScripts',
              'ignoreScripts',
              'ignoreWorkspaceRootCheck',
              'managePackageManagerVersions',
              'minimumReleaseAge',
              'minimumReleaseAgeExclude',
              'modulesDir',
              'nodeLinker',
              'nodeVersion',
              'optimisticRepeatInstall',
              'packageManagerStrict',
              'packageManagerStrictVersion',
              'preferSymlinkedExecutables',
              'preferWorkspacePackages',
              'publicHoistPattern',
              'registrySupportsTimeField',
              'requiredScripts',
              'resolutionMode',
              'savePrefix',
              'scriptShell',
              'shamefullyHoist',
              'shellEmulator',
              'stateDir',
              'supportedArchitectures',
              'symlink',
              'tag',
              'trustPolicy',
              'trustPolicyExclude',
              'updateNotifier',

              // Packages and dependencies
              'packages',
              'overrides',
              'patchedDependencies',
              'catalog',
              'catalogs',

              // Other
              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'packageExtensions',
              'peerDependencyRules',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '.*',
          },
        ],

        ...enablePnpmWorkspace.overrides,
      },
    })
  }

  return config
}
