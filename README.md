<div align="center">
  <h1>ESLint Config</h1>
  <p><strong>Opinionated, type-safe flat ESLint configuration factory</strong></p>
  <p>
    <a href="https://github.com/favorodera/eslint-config/blob/main/LICENSE"><img src="https://img.shields.io/github/license/favorodera/eslint-config.svg?style=plastic&label=License&color=blue" alt="License"></a>
    <a href="https://github.com/favorodera/eslint-config/stargazers"><img src="https://img.shields.io/github/stars/favorodera/eslint-config.svg?style=plastic&label=Stars&color=blue" alt="GitHub Stars"></a>
    <a href="https://npmx.dev/package/@favorodera/eslint-config"><img src="https://img.shields.io/npm/v/@favorodera/eslint-config.svg?style=plastic&label=Version&color=blue" alt="NPM Version"></a>
  </p>
</div>

<br>

An opinionated, highly customizable ESLint flat configuration factory. It provides a seamless, type-safe linting experience out-of-the-box for Vue, TypeScript, Tailwind CSS, Markdown, and more.

## Features

- **Flat Config First** — Built from the ground up for ESLint's new flat config system.
- **TypeScript Support** — Robust linting for TypeScript out of the box.
- **Vue Integration** — First-class support for Vue 3 single-file components.
- **Stylistic Rules** — Consistent code styling powered by ESLint Stylistic.
- **Tailwind CSS** — Built-in rules for Tailwind classes sorting and best practices.
- **Auto-formatting** — Formats JSON, JSONC, Markdown, and JS/TS automatically.
- **Type-safe Rules** — Rules are generated with JSDoc comments, giving you rich auto-complete and descriptions right in your IDE.
- **Highly Configurable** — Easily enable or disable specific rulesets based on your project's needs.

## Supported Configs

The following configurations are bundled and enabled by default (they can be individually disabled or customized):

- **JavaScript** — Core ESLint rules (`@eslint/js`)
- **TypeScript** — Type-aware linting (`typescript-eslint`)
- **Vue** — Single-file component support (`eslint-plugin-vue`, `vue-eslint-parser`)
- **Stylistic** — Formatting rules (`@stylistic/eslint-plugin`)
- **Tailwind CSS** — Utility class linting and sorting (`eslint-plugin-better-tailwindcss`)
- **Test** — Test and Vitest specific linting (`@vitest/eslint-plugin`)
- **Imports** — Auto-sorting and import quality rules (`eslint-plugin-import-lite`)
- **Unused Imports** — Unused imports and variables detection and cleanup (`eslint-plugin-unused-imports`)
- **Markdown** — Linting for markdown files and embedded code blocks (`@eslint/markdown`)
- **JSON/JSONC/JSON5** — Formatting and sorting for JSON files like `package.json` (`eslint-plugin-jsonc`)
- **JSDoc** — Standardized comment formatting (`eslint-plugin-jsdoc`)
- **Unicorn** — Various code quality improvements (`eslint-plugin-unicorn`)
- **Perfectionist** — Sorting objects, imports, classes, etc. (`eslint-plugin-perfectionist`)
- **Node** — Node.js specific linting rules (`eslint-plugin-n`)


## Usage

### Install

<details>
<summary><b>pnpm</b></summary>

```bash
pnpm install -D eslint @favorodera/eslint-config
```
</details>

<details>
<summary><b>npm</b></summary>

```bash
npm install -D eslint @favorodera/eslint-config
```
</details>

<details>
<summary><b>yarn</b></summary>

```bash
yarn add -D eslint @favorodera/eslint-config
```
</details>

<details>
<summary><b>bun</b></summary>

```bash
bun add -D eslint @favorodera/eslint-config
```
</details>

### Configure

Create an `eslint.config.ts` file in the root of your project. Since all configurations are enabled by default, you only need to pass options if you want to disable or customize something.

The `factory()` function returns a `FlatConfigComposer` instance (powered by [`eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils)), which acts as a powerful composer. This makes it incredibly easy to append your own configurations, override existing rules, or insert plugins seamlessly.

```ts
import { factory } from '@favorodera/eslint-config'

export default factory({
  // All configs are true by default!

  // Example: Customize specific rulesets
  stylistic: {
    settings: {
      indent: 4,
      quotes: 'double',
    },
  },

  // Example: Disable tailwind if you aren't using it
  tailwind: false,
})
  // You can seamlessly chain methods to compose your config
  .append({
    // Add your own custom ESLint configs
    ignores: ['src/types/rules.d.ts'],
  })
  .overrides({
    // Easily override predefined rules by their name
    'favorodera/typescript/rules': {
      rules: {
        'ts/no-explicit-any': 'off',
      },
    },
  })
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- [pnpm](https://pnpm.io/installation) v11 or later

### Getting Started

```bash
# Install all dependencies
pnpm install

# Start compiler in watch mode and open ESLint config inspector
pnpm dev

# Build the project
pnpm build

# Lint, typecheck, build, and test in one go
pnpm ready
```

### Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Generates types, starts watch mode, and opens `@eslint/config-inspector` |
| `pnpm build` | Production build using `tsdown` |
| `pnpm script:generate-rules-types` | Extracts and generates type definitions for all ESLint rules |
| `pnpm lint` | Lint the repository |
| `pnpm typecheck` | Type-check without emitting files |
| `pnpm test` | Run test suites with Vitest |
| `pnpm ready` | Full pipeline: install → build → lint → typecheck → test |

## Contributing & Issues

Feel free to open an issue or submit a pull request if you'd like to improve the rules, add new features, or fix a bug. Please ensure you run `pnpm ready` before submitting your PR to make sure tests and linting pass.

## Inspiration

This project takes heavy inspiration from [antfu/eslint-config](https://github.com/antfu/eslint-config) and similar modern ESLint presets, adapting their best patterns into a custom set of opinionated rules.

## License

[MIT](./LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)
