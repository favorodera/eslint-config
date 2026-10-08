# Contributing to NotForm

Thank you for contributing to @favorodera/eslint-config.

## Code of Conduct

By participating in this project, you agree to follow the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) 24 or later
- [pnpm](https://pnpm.io/) 11 or later

### Setup

```bash
git clone https://github.com/favorodera/eslint-config.git
cd eslint-config
pnpm install
pnpm dev
```

This starts the development environment and config inspector.

## Development

Use conventional commit messages. Common prefixes are:

- `feat` — new functionality
- `fix` — bug fixes
- `docs` — documentation changes
- `refactor` — code changes without behavior changes
- `perf` — performance improvements

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Add or update tests when changing behavior.

## Documentation

Documentation lives in README.

When changing the public API, update the relevant documentation alongside the code.

## Pull Requests

Keep pull requests focused and easy to review.

Before submitting:

1. Add or update tests where appropriate.
2. Update documentation for user-facing changes.
3. Run the project checks locally.
4. Use a conventional commit message.

## Reporting Bugs

Search existing issues before opening a new one.

Include the expected behavior, actual behavior, reproduction steps, and relevant environment details.

## Feature Requests

Open an issue describing the problem, the proposed solution, and any alternatives you considered.

## Questions

For questions and discussion, use [GitHub Discussions](https://github.com/favorodera/eslint-config/discussions).

Thank you for helping improve NotForm.