import { defineConfig } from 'relizy'

export default defineConfig({
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
  ],
  projectName: '@favorodera/eslint-config',
  publish: {
    access: 'public',
    buildCmd: 'pnpm build',
    packageManager: 'pnpm',
    packages: ['*'],
    registry: 'https://registry.npmjs.org',
  },
  types: {
    build: false,
    chore: { semver: 'patch', title: 'Chores' },
    ci: false,
    docs: { semver: 'patch', title: 'Documentation' },
    feat: { semver: 'patch', title: 'Added' },
    fix: { semver: 'patch', title: 'Fixed' },
    refactor: { semver: 'patch', title: 'Refactors' },
    style: { semver: 'patch', title: 'Styling' },
    test: false,
  },
})
