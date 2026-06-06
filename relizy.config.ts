import { defineConfig } from 'relizy'

export default defineConfig({
  projectName: '@favorodera/eslint-config',
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
  ],
  publish: {
    packageManager: 'pnpm',
    registry: 'https://registry.npmjs.org',
    access: 'public',
    packages: ['*'],
    buildCmd: 'pnpm build',
  },
  types: {
    feat: { title: 'Added', semver: 'patch' },
    fix: { title: 'Fixed', semver: 'patch' },
    docs: { title: 'Documentation', semver: 'patch' },
    style: { title: 'Styling', semver: 'patch' },
    refactor: { title: 'Refactors', semver: 'patch' },
    chore: { title: 'Chores', semver: 'patch' },
    test: false,
    build: false,
    ci: false,
  },
})
