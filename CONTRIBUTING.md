# Contributing to `@favorodera/eslint-config` 

By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

Requires Node.js 24 or later and pnpm 12 (both pinned in `package.json`).

```bash
git clone https://github.com/favorodera/eslint-config
cd notform
pnpm install
pnpm dev
```

`pnpm dev` builds the packages in watch mode and serves the development environment with the inspector running at `http://localhost:7777`.

## Before you open a pull request

Run the checks CI runs:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Or run all of them at once with `pnpm ready`.

- Add or update tests in `tests` when you change behavior.
- Update the docs in `README.md` when you change the public API.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org) with the config as the scope, for example `feat(vue): add template rule` or `fix(unicorn): resolve alias conflict`.

Commits of type `feat`, `fix`, `perf`, `refactor`, `docs`, and `chore` appear in the changelog. `ci`, `styles`, `build`, and `test` do not.

## Pull requests

Keep each pull request focused on one change, fill in the template, and link the issue it addresses.

## Issues and questions

Search existing issues first, then use the bug report or feature request template. A bug report needs a minimal reproduction. For questions and ideas, use [GitHub Discussions](https://github.com/favorodera/eslint-config/discussions).