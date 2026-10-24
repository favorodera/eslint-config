<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/transparent.svg?title=%40favorodera%2Feslint-config&amp;subtitle=An+opinionated%2C+type-safe+ESLint+flat+configuration+for+JavaScript+and+TypeScript+projects.&amp;size=wide&amp;mode=dark" /><img alt="@favorodera/eslint-config" src="https://shieldcn.dev/header/transparent.svg?title=%40favorodera%2Feslint-config&amp;subtitle=An+opinionated%2C+type-safe+ESLint+flat+configuration+for+JavaScript+and+TypeScript+projects.&amp;size=wide&amp;mode=light" /></picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@favorodera/eslint-config"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs" /><img alt="npm version" src="https://shieldcn.dev/npm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
  <a href="https://www.npmjs.com/package/@favorodera/eslint-config"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/dm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs" /><img alt="npm downloads" src="https://shieldcn.dev/npm/dm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
  <a href="https://github.com/favorodera/eslint-config/actions"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/favorodera/eslint-config/ci.svg?variant=outline&amp;size=xs" /><img alt="CI status" src="https://shieldcn.dev/github/favorodera/eslint-config/ci.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
</p>

`@favorodera/eslint-config` is an opinionated, type-safe ESLint flat configuration for JavaScript and TypeScript projects. It combines code-quality, sorting, and style rules with support for common project file formats and tooling.

## Features

- Type-safe flat config with rule autocomplete.
- Configurable rule groups with sensible defaults.
- JavaScript, TypeScript, and Vue single-file component linting.
- CSS and Tailwind CSS linting.
- Markdown and embedded-code linting.
- Import hygiene, sorting, and unused-import detection.
- JSON-family, YAML, pnpm, Node.js, JSDoc, Unicorn, and Vitest rules.

## Installation

**Requirements:** Node.js 24 or later and ESLint 10.

```sh
pnpm add -D eslint@^10 @favorodera/eslint-config
```

## Usage

Create `eslint.config.ts` in your project root:

```ts
import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig()
```

All configuration groups are enabled by default. Disable groups you do not need or pass options to customize them:

```ts
import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  ignores: (defaults) => {
    return [...defaults, '**/generated/**']
  },
  stylistic: {
    settings: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
  },
  tailwind: {
    settings: {
      entryPoint: 'src/styles.css',
    },
  },
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
    },
  },
  vue: false,
})
```

Use `overrides` for rule changes and `settings` for configuration-specific settings where supported. Ignore arrays are appended to the built-in patterns; an ignore callback receives the defaults and returns the complete list.

## Configuration groups

| Option | Purpose |
| --- | --- |
| `javascript` | Core JavaScript rules. |
| `typescript` | TypeScript linting. |
| `vue` | Vue single-file components and accessibility rules. |
| `stylistic` | Code style and formatting. |
| `css` | CSS linting, including Tailwind CSS v4 syntax. |
| `tailwind` | Tailwind class validation and consistency. |
| `imports` | Import ordering and import quality. |
| `unusedImports` | Unused imports and variables. |
| `perfectionist` | Sorting rules for code structures. |
| `jsdoc` | JSDoc validation and style. |
| `jsonc` | JSON, JSON5, JSONC, `package.json`, and TypeScript config files. |
| `yaml` | YAML linting and `pnpm-workspace.yaml` key ordering. |
| `pnpm` | pnpm rules for `package.json` and `pnpm-workspace.yaml`. |
| `node` | Node.js-specific rules. |
| `unicorn` | Additional JavaScript and TypeScript code-quality rules. |
| `vitest` | Rules for Vitest test files. |
| `markdown` | Markdown linting; GitHub Flavored Markdown is enabled by default. |
| `codeInMarkdown` | Rules for supported code blocks embedded in Markdown. |
| `ignores` | Adds to or customizes the default ignored paths. Always applied. |

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development and contribution guidelines.

## License

[MIT](./LICENSE) © [Favour Emeka](https://github.com/favorodera)
