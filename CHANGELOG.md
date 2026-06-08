# Changelog

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
