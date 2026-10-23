<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/transparent.svg?title=%40favorodera%2Feslint-config&amp;subtitle=An+opinionated%2C+type-safe+ESLint+flat+configuration+for+JavaScript+and+TypeScript+projects.&amp;size=wide&amp;mode=dark" /><img alt="header" src="https://shieldcn.dev/header/transparent.svg?title=%40favorodera%2Feslint-config&amp;subtitle=An+opinionated%2C+type-safe+ESLint+flat+configuration+for+JavaScript+and+TypeScript+projects.&amp;size=wide&amp;mode=light" /></picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@favorodera/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs" /><img alt="version" src="https://shieldcn.dev/npm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
  <a href="https://www.npmjs.com/package/@favorodera/eslint-config"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/dm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs" /><img alt="downloads" src="https://shieldcn.dev/npm/dm/@favorodera/eslint-config.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
  <a href="https://github.com/favorodera/eslint-config/actions"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/favorodera/eslint-config/ci.svg?variant=outline&amp;size=xs" /><img alt="CI" src="https://shieldcn.dev/github/favorodera/eslint-config/ci.svg?variant=outline&amp;size=xs&amp;mode=light" /></picture></a>
</p>

`@favorodera/eslint-config` provides a reusable ESLint flat config with defaults for JavaScript, TypeScript, Vue, CSS, Tailwind CSS, Markdown, import hygiene, and code consistency.

## Features

- ESLint flat config with type-safe rule autocomplete.
- Sensible defaults for supported configuration groups.
- Customizable rules and group-specific settings.
- Config composition for project-specific rules.

## Installation

**Requirements:** Node.js 24+ and ESLint 10.x.

```sh
pnpm add -D eslint@^10 @favorodera/eslint-config
```

## Usage

Create an `eslint.config.ts` file in your project root:

```ts
import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig()
```

All configuration groups are enabled by default.

## Configuration

Disable a group by setting its option to `false`, or pass an options object to customize it. Rule overrides use the `overrides` property; group-specific options belong in `settings` where supported.

```ts
import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  ignores: (defaults) => {
    return [
      ...defaults,
      '**/generated/**',
    ]
  },
  markdown: {
    settings: {
      gfm: true,
    },
  },
  stylistic: {
    settings: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
  },
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
    },
  },
})
```

An array passed to `ignores` is added to the default ignore patterns. A function receives the defaults and should return the complete list you want to use.

### Configuration groups

| Option | Purpose |
| --- | --- |
| `javascript` | Core JavaScript rules. |
| `typescript` | TypeScript rules and parser setup. |
| `vue` | Vue single-file component linting. |
| `a11y` | Vue single-file based accessibility linting. |
| `css` | CSS linting, including Tailwind CSS v4 syntax support. |
| `tailwind` | Tailwind class validation, ordering, and consistency. |
| `stylistic` | Code formatting and style rules. |
| `imports` | Import ordering and import-quality rules. |
| `unusedImports` | Unused import and variable checks. |
| `perfectionist` | Sorting rules for code structures. |
| `markdown` | Markdown linting; GitHub Flavored Markdown is enabled by default. |
| `codeInMarkdown` | Linting for supported code blocks embedded in Markdown. |
| `ignores` | Adds ignore patterns or customizes the default list. This option is always applied. |

## Development

This repository uses pnpm. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development and contribution guidelines.

## License

[MIT](./LICENSE) © [Favour Emeka](https://github.com/favorodera)
