import type { TypedFlatConfigItem } from '../types/utils'
import { pnpmWorkspaceGlob, yamlGlob } from '../globs'
import { extractRules, importModule, omit } from '../utils'

/**
 * Constructs the flat config items for YAML linting, setting up
 * the custom parser and rule validations.
 * @returns Promise resolving to YAML ESLint config items.
 */
export async function yaml(): Promise<Array<TypedFlatConfigItem>> {
  const [
    yamlPlugin,
    yamlParser,
  ] = await Promise.all([
    importModule(import('eslint-plugin-yml')),
    importModule(import('yaml-eslint-parser')),
  ])

  const standardConfig = yamlPlugin.configs.standard

  const [pluginConfig] = standardConfig
  const pluginRest = omit(pluginConfig, [
    'rules',
    'files',
    'name',
  ])

  const rules = extractRules(standardConfig)

  return [
    {
      ...pluginRest,
      name: 'favorodera/yaml/setup',
    },
    {
      files: [yamlGlob],
      language: 'yaml/yaml',
      languageOptions: {
        parser: yamlParser,
      },
      name: 'favorodera/yaml/rules',
      rules: {
        ...rules,

        'yaml/quotes': [
          'error',
          { avoidEscape: true, prefer: 'single' },
        ],
        'yaml/require-string-key': 'error',
      },
    },
    {
      files: [pnpmWorkspaceGlob],
      language: 'yaml/yaml',
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
