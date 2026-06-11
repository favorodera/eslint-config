import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { renamePluginsInRules } from 'eslint-flat-config-utils'
import { pnpmWorkspaceGlob, yamlGlob } from '../globs'
import { extractRules, importModule } from '../utils'

/** Options for configuring YAML linting rules. */
export type YAMLConfigOptions = SharedOptions

const yamlDefaults: YAMLConfigOptions = {
  files: [yamlGlob],
}

/**
 * Constructs the flat config items for YAML linting, setting up
 * the custom parser and rule validations.
 * @param options YAML configuration options.
 * @returns Promise resolving to YAML ESLint config items.
 */
export async function yaml(options: YAMLConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, yamlDefaults)

  const [yamlPlugin, yamlParser] = await Promise.all([
    importModule(import('eslint-plugin-yml')),
    importModule(import('yaml-eslint-parser')),
  ])

  const baseRules = extractRules(yamlPlugin.configs.standard)

  return [
    {
      name: 'favorodera/yaml/setup',
      plugins: { yaml: yamlPlugin },
    },
    {
      files: resolved.files,
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/rules',
      rules: {
        ...renamePluginsInRules(baseRules, { yml: 'yaml' }),

        'yaml/quotes': ['error', { avoidEscape: true, prefer: 'single' }],
        'yaml/require-string-key': 'error',

        ...resolved.overrides,
      },
    },
    {
      files: [pnpmWorkspaceGlob],
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/sort/pnpm-workspace-yaml',
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
      },
    },
  ]
}
