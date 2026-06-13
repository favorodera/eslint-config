# Changelog

## v0.0.11...v0.0.12

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.11...v0.0.12)

### Added

- **imports:** Enable prefer-inline for no-duplicates ([c376d66](https://github.com/favorodera/eslint-config/commit/c376d66))

### Refactors

- **imports:** Extract unused-imports to separate config ([28789c2](https://github.com/favorodera/eslint-config/commit/28789c2))

  - Move unused-imports logic to a new module
  - Add dedicated unusedImports option to factory
  - Update factory to include unusedImports config
  - Update README documentation

- **config:** Update jsdoc rules and formatting ([48f470e](https://github.com/favorodera/eslint-config/commit/48f470e))

  - update jsdoc rule set to improve validation
  - set stricter error levels for jsdoc linting
  - reorder jsdoc configuration properties
  - fix minor documentation alignment in perfectionist

- **config:** Simplify eslint rules and optimize build ([11283e8](https://github.com/favorodera/eslint-config/commit/11283e8))

  - update javascript eslint rules
  - set node memory limit in workspace
  - clean up type imports and exports


### Styling

- **config:** Cleanup formatting in package and ignores ([b80891a](https://github.com/favorodera/eslint-config/commit/b80891a))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.10...v0.0.11

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.10...v0.0.11)

### Added

- **pnpm:** Configure package.json field sorting and validation ([5933224](https://github.com/favorodera/eslint-config/commit/5933224))

  - Add dependency fields to sort-package-json
  - Enable pnpm/yaml-valid-packages rule

- **jsonc:** Update rules and configuration ([5d47aff](https://github.com/favorodera/eslint-config/commit/5d47aff))

  - Enable additional jsonc formatting rules
  - Disable irregular whitespace rule for jsonc
  - Refactor package and tsconfig formatting


### Refactors

- **configs:** Improve code style and organization ([86684be](https://github.com/favorodera/eslint-config/commit/86684be))

  - standardize import ordering across files
  - refactor perfectionist config settings
  - update stylistic and tailwind rule configurations
  - clean up comments in factory and utils

- **node:** Update rules and configuration ([79c4e43](https://github.com/favorodera/eslint-config/commit/79c4e43))

  - switch to recommended-module config
  - enable strict node plugin rules
  - add node/prefer-node-protocol
  - disable missing import rules for ts and vue
  - remove redundant process override in test config

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.9...v0.0.10

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.9...v0.0.10)

### Added

- **stylistic:** Add additional style linting rules ([2574e37](https://github.com/favorodera/eslint-config/commit/2574e37))

  - Add braceStyle option to defaults
  - Enable various stylistic rule constraints


### Styling

- **lint:** Apply consistent multiline formatting ([985d088](https://github.com/favorodera/eslint-config/commit/985d088))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.8...v0.0.9

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.8...v0.0.9)

### Added

- **config:** Update tailwind linting rules ([ed46b3e](https://github.com/favorodera/eslint-config/commit/ed46b3e))

  - Enforce consistent class and variant order
  - Enable logical properties enforcement
  - Disable shorthand and variable syntax checks

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.7...v0.0.8

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.7...v0.0.8)

### Added

- **config:** Update typescript rules and strictness ([f413056](https://github.com/favorodera/eslint-config/commit/f413056))

  - Add stylistic config to base rules
  - Add additional typescript linting rules
  - Remove specific rule configurations

- **test:** Add comprehensive vitest linting rules ([1a4a262](https://github.com/favorodera/eslint-config/commit/1a4a262))

  - update test configuration to include new rules
  - standardize test glob pattern
  - refactor test files to use it instead of test


### Refactors

- **package:** Simplify exports to esm only ([b44fef3](https://github.com/favorodera/eslint-config/commit/b44fef3))

  - remove cjs support from package exports
  - update tsdown config to remove cjs format

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.6...v0.0.7

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.6...v0.0.7)

### Added

- **vue:** Update and expand linting rules ([b8f01fe](https://github.com/favorodera/eslint-config/commit/b8f01fe))

  - Update base rules to recommended-error
  - Add comprehensive vue linting rules
  - Improve code consistency and standards
  - Fix spacing in yaml config

- **exports:** Export glob patterns from index ([4f4f489](https://github.com/favorodera/eslint-config/commit/4f4f489))

### Refactors

- **yaml:** Update config and simplify rules ([e905e25](https://github.com/favorodera/eslint-config/commit/e905e25))

  - Switch from recommended to standard config
  - Remove redundant yaml rules
  - Add require-string-key rule

- **eslint:** Update unicorn config and rules ([d281041](https://github.com/favorodera/eslint-config/commit/d281041))

  - Switch to recommended unicorn config
  - Disable unicorn/prevent-abbreviations
  - Disable unicorn/filename-case
  - Clean up redundant rule definitions

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.5...v0.0.6

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.5...v0.0.6)

### Added

- **config:** Add yaml linting support ([0b48491](https://github.com/favorodera/eslint-config/commit/0b48491))

  - Add eslint-plugin-yml and yaml-eslint-parser
  - Implement new yaml configuration factory
  - Update factory to include yaml support
  - Expand base javascript linting rules

- **pnpm:** Add support for pnpm workspace linting ([9dbe73d](https://github.com/favorodera/eslint-config/commit/9dbe73d))

  - Add eslint-plugin-pnpm configuration
  - Migrate package dependencies to pnpm catalogs
  - Integrate pnpm rules into the factory
  - Update pnpm-workspace.yaml with catalog definitions

- **test:** Add Vitest linting support ([fa8b826](https://github.com/favorodera/eslint-config/commit/fa8b826))

  - Add @vitest/eslint-plugin for test linting
  - Implement test configuration factory
  - Define test file glob patterns
  - Add test:watch script to package.json
  - Expand factory tests to verify configuration


### Refactors

- **index:** Export extractRules and simplify imports ([df5fd1c](https://github.com/favorodera/eslint-config/commit/df5fd1c))

  - Export extractRules from entry point
  - Simplify entry path in eslint.config.ts

- **yaml:** Rename plugin to yaml and add pnpm-workspace support ([7a1ba93](https://github.com/favorodera/eslint-config/commit/7a1ba93))

  - Rename yml plugin prefix to yaml
  - Add pnpm-workspace.yaml linting support
  - Implement key sorting for pnpm-workspace.yaml


### Documentation

- **readme:** Update code block language to typescript ([e459d2c](https://github.com/favorodera/eslint-config/commit/e459d2c))

### Chores

- Add licence to the project ([ddafe59](https://github.com/favorodera/eslint-config/commit/ddafe59))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
- Favour  Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.4...v0.0.5

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.4...v0.0.5)

### Added

- **config:** Add perfectionist and unicorn support ([1be53ee](https://github.com/favorodera/eslint-config/commit/1be53ee))

  - Add perfectionist for auto-sorting code
  - Add unicorn for best practice rules
  - Update factory with new modules
  - Refactor existing configs for consistency

- **node:** Add node.js linting configuration ([0a6990d](https://github.com/favorodera/eslint-config/commit/0a6990d))

  - create node config module
  - integrate node rules via eslint-plugin-n
  - expose node configuration in factory


### Refactors

- **config:** Group imports and update rule style ([9038ad0](https://github.com/favorodera/eslint-config/commit/9038ad0))

  - consolidate import statements in factory
  - update consistent-type-specifier-style rule


### Documentation

- **factory:** Add missing newline in JSDoc comment ([658bd94](https://github.com/favorodera/eslint-config/commit/658bd94))
- **readme:** Add new supported plugins to features list ([7a914c8](https://github.com/favorodera/eslint-config/commit/7a914c8))

  - Add unicorn, perfectionist, and node plugins

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.3...v0.0.4

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.3...v0.0.4)

### Added

- **config:** Add JSDoc support and improve documentation ([4370bc7](https://github.com/favorodera/eslint-config/commit/4370bc7))

  - Add JSDoc linting configuration
  - Install eslint-plugin-jsdoc
  - Add TSDoc comments to public utilities
  - Update README with project features and usage

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.2...v0.0.3

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.2...v0.0.3)

### Added

- Add jsonc support and dev inspector ([efc0652](https://github.com/favorodera/eslint-config/commit/efc0652))

  - Add jsonc configuration with standard rules
  - Integrate jsonc into factory
  - Update scripts to include eslint config inspector
  - Add concurrently for development workflow
  - Refactor config rules extraction for consistency

- **jsonc:** Add sorting rules for package.json and tsconfig.json ([aaceed5](https://github.com/favorodera/eslint-config/commit/aaceed5))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.1...v0.0.2

[compare changes](https://github.com/favorodera/eslint-config/compare/v0.0.1...v0.0.2)

### Refactors

- **factory:** Simplify configuration and plugin handling ([af0e923](https://github.com/favorodera/eslint-config/commit/af0e923))

  - remove unused comments config and presets
  - switch to eslint-flat-config-utils for plugin renaming
  - unify module import utility
  - optimize config composition and rule inheritance
  - update glob patterns and factory defaults

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v0.0.0...v0.0.1

[compare changes](https://github.com/favorodera/eslint-config/compare/73447b8c21af27d21014ce495a551e74e524a585...v0.0.1)

### Added

- **deps:** Add tailwind and vue eslint plugins ([ed848c9](https://github.com/favorodera/eslint-config/commit/ed848c9))

  - add tailwind and vue eslint dependencies
  - implement flat config factory
  - update package dependencies and lockfile

- **config:** Implement rule type generation and structure ([fa4a429](https://github.com/favorodera/eslint-config/commit/fa4a429))

  - Add eslint-typegen for rule type safety
  - Configure script to generate rules.d.ts
  - Organize source structure with config presets
  - Add ignore patterns and glob utilities
  - Refactor factory to support modular configurations

- **core:** Modularize and refactor configuration factory ([fe4a11c](https://github.com/favorodera/eslint-config/commit/fe4a11c))

  - Add stylistic configuration support
  - Implement plugin renaming strategy
  - Update preset options and export structure
  - Reorganize internal types and utilities
  - Add funding information to package.json

- **tailwind:** Add tailwind css support ([480d744](https://github.com/favorodera/eslint-config/commit/480d744))

  - implement tailwind configuration and rules
  - add tailwind option to factory
  - update rule types for tailwind
  - update test script to run vitest

- **index:** Export tailwind config and presets ([e316533](https://github.com/favorodera/eslint-config/commit/e316533))

  - Export tailwind config and options
  - Export config presets
  - Export getModuleDefault utility

- **config:** Add support for eslint-comments ([6a444f1](https://github.com/favorodera/eslint-config/commit/6a444f1))

  - Add @eslint-community/eslint-plugin-eslint-comments
  - Create comments configuration preset
  - Integrate comments option into factory
  - Export comments config in index

- **config:** Add import linting support ([51b8787](https://github.com/favorodera/eslint-config/commit/51b8787))

  - Add eslint-plugin-import-lite
  - Implement imports config preset
  - Update factory to support imports option
  - Expose imports config in index

- **markdown:** Add support for markdown linting ([ce7c449](https://github.com/favorodera/eslint-config/commit/ce7c449))

  - add @eslint/markdown dependency
  - implement markdown config preset
  - register markdown in factory
  - add markdown file globs

- **eslint:** Add javascript config and unused imports ([40e210d](https://github.com/favorodera/eslint-config/commit/40e210d))

  - Add javascript config with base rules
  - Integrate eslint-plugin-unused-imports
  - Update factory to support javascript option
  - Standardize glob patterns across configs


### Refactors

- **config:** Cleanup unused utilities and dev script ([95fa68e](https://github.com/favorodera/eslint-config/commit/95fa68e))

  - remove renamePluginInConfigs from utils
  - update dev script to run prebuild
  - comment out outdated typescript rules configuration

- **eslint:** Update rules and typescript config ([d6db559](https://github.com/favorodera/eslint-config/commit/d6db559))

  - Enable typescript-eslint recommended/strict configs
  - Add stylistic, vue, and typescript rule overrides
  - Update ConfigNames type definitions
  - Refactor ConfigOptions to interface

- **typescript:** Migrate to typescript-eslint flat config ([ef20ae1](https://github.com/favorodera/eslint-config/commit/ef20ae1))

  - Remove legacy @typescript-eslint dependencies
  - Manually extract and map rules to ts prefix
  - Update typescript config logic
  - Clean up config type declarations


### Chores

- **gitignore:** Ignore generated rules type definition ([f655842](https://github.com/favorodera/eslint-config/commit/f655842))

  - add src/types/rules.d.ts to gitignore

- **types:** Src/types/rules.d.ts ([50abb19](https://github.com/favorodera/eslint-config/commit/50abb19))
- **scripts:** Reorder build before lint in ready script ([ad881a6](https://github.com/favorodera/eslint-config/commit/ad881a6))
- **project:** Initialize repository configuration ([9d64062](https://github.com/favorodera/eslint-config/commit/9d64062))

  - add github issue and pull request templates
  - set up ci and release workflows
  - add code of conduct and contributing guidelines
  - include funding configuration

- **ci:** Update release workflow secrets ([3ed4950](https://github.com/favorodera/eslint-config/commit/3ed4950))

  - Update GitHub PAT and NPM token secrets

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
- Favour  Emeka ([@favorodera](https://github.com/favorodera))
