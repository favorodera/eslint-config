import { describe, expect, it } from 'vitest'
import { defineConfig } from '../src/'
import { extractRules, importModule, resolveOptions } from '../src/utils'

describe('resolveOptions', () => {
  it('returns false when value is false', () => {
    expect(resolveOptions(false, { foo: 'bar' })).toBe(false)
  })

  it('returns false when value is undefined', () => {
    expect(resolveOptions(undefined, { foo: 'bar' })).toBe(false)
  })

  it('returns defaults when value is true', () => {
    expect(resolveOptions(true, { indent: 2, quotes: 'single' }))
      .toStrictEqual({ indent: 2, quotes: 'single' })
  })

  it('merges provided options over defaults', () => {
    expect(resolveOptions({ indent: 4 }, { indent: 2, quotes: 'single' }))
      .toStrictEqual({ indent: 4, quotes: 'single' })
  })

  it('empty object with empty defaults returns empty object', () => {
    expect(resolveOptions({}, {})).toStrictEqual({})
  })
})

describe('extractRules', () => {
  it('merges rules from multiple config arrays with later rules taking precedence', () => {
    expect(extractRules(
      [{ rules: { quotes: 'warn', semi: 'error' } }],
      [{ rules: { quotes: 'error' } }],
    )).toStrictEqual({ quotes: 'error', semi: 'error' })
  })

  it('ignores config items without a rules object', () => {
    expect(extractRules([{ rules: { semi: 'error' } }, {}])).toStrictEqual({ semi: 'error' })
  })
})

describe('importModule', () => {
  it('returns .default when present (ESM interop)', async () => {
    const fakeModule = { default: { rules: {} } }
    const result = await importModule(Promise.resolve(fakeModule))

    expect(result).toBe(fakeModule.default)
  })

  it('returns the module directly when no .default exists (CJS)', async () => {
    const fakeModule = { rules: {} }
    const result = await importModule(Promise.resolve(fakeModule))

    expect(result).toBe(fakeModule)
  })

  it('handles null/undefined without throwing', async () => {
    const result = await importModule(Promise.resolve())

    expect(result).toBeNullable()
  })
})

describe('defineConfig', () => {
  it('resolves to a non-empty array of configs', async () => {
    const resolved = await defineConfig()

    expect(Array.isArray(resolved)).toBe(true)
    expect(resolved.length).toBeGreaterThan(0)
  })

  it('always includes the ignores config first', async () => {
    const resolved = await defineConfig()

    expect(resolved[0].name).toBe('favorodera/ignores')
  })

  it('includes configuration groups by default', async () => {
    const resolved = await defineConfig()

    const names = resolved
      .map((config) => {
        return config.name
      })
      .filter(Boolean)

    const groups = [
      'code-in-markdown',
      'css',
      'imports',
      'ignores',
      'javascript',
      'jsdoc',
      'jsonc',
      'markdown',
      'node',
      'perfectionist',
      'pnpm',
      'stylistic',
      'tailwind',
      'typescript',
      'unicorn',
      'unused-imports',
      'vitest',
      'vue',
      'yaml',
    ]

    const hasAllGroups = groups.every((group) => {
      return names.some((name) => {
        return name?.startsWith(`favorodera/${group}`)
      })
    })

    expect(hasAllGroups).toBe(true)
  })

  it('can disable groups', async () => {
    const resolved = await defineConfig({
      pnpm: false,
      unicorn: false,
      vitest: false,
      yaml: false,
    })

    const names = resolved
      .map((config) => {
        return config.name
      })
      .filter(Boolean)

    const disabledGroups = ['pnpm', 'unicorn', 'vitest', 'yaml']

    const hasMatchingGroup = names.some((name) => {
      return disabledGroups.some((group) => {
        return name?.startsWith(`favorodera/${group}/`)
      })
    })

    expect(hasMatchingGroup).toBe(false)
  })

  it('can disable sub groups', async () => {
    const resolved = await defineConfig({
      pnpm: {
        packageJson: false,
        pnpmWorkspace: false,
      },
    })

    const names = resolved
      .map((config) => {
        return config.name
      })
      .filter(Boolean)

    const disabledSubGroups = new Set([
      'favorodera/pnpm/package-json/rules',
      'favorodera/pnpm/pnpm-workspace/rules',
    ])

    const hasSubGroup = names.some((name) => {
      return name !== undefined && disabledSubGroups.has(name)
    })

    expect(hasSubGroup).toBe(false)
  })

  it('disabling a sub group does not affect the main group setup config', async () => {
    const resolved = await defineConfig({
      pnpm: {
        packageJson: false,
        pnpmWorkspace: false,
      },
    })

    const names = resolved.map((config) => {
      return config.name
    }).filter(Boolean)

    const hasMainSetup = names.includes('favorodera/pnpm/setup')

    expect(hasMainSetup).toBe(true)
  })

  it('applies overrides to main groups and sub groups independently without affecting each other', async () => {
    const resolved = await defineConfig({
      jsonc: {
        overrides: {
          'jsonc/main-rule': 'error',
        },
        packageJson: {
          overrides: {
            'jsonc/package-json-rule': 'warn',
          },
        },
        tsConfig: {
          overrides: {
            'jsonc/tsconfig-rule': 'off',
          },
        },
      },
    })

    const mainRules = resolved.find((config) => {
      return config.name === 'favorodera/jsonc/rules'
    })?.rules
    const pkgJsonRules = resolved.find((config) => {
      return config.name === 'favorodera/jsonc/package-json/rules'
    })?.rules
    const tsconfigRules = resolved.find((config) => {
      return config.name === 'favorodera/jsonc/tsconfig/rules'
    })?.rules

    expect(mainRules?.['jsonc/main-rule']).toBe('error')
    expect(pkgJsonRules?.['jsonc/package-json-rule']).toBe('warn')
    expect(tsconfigRules?.['jsonc/tsconfig-rule']).toBe('off')
  })

  it('defaults nested sub group configurations to true when only main group properties are altered', async () => {
    const resolved = await defineConfig({
      jsonc: {
        overrides: {
          'jsonc/some-rule': 'error',
        },
      },
    })

    const names = resolved.map((config) => {
      return config.name
    }).filter(Boolean)

    expect(names).toContain('favorodera/jsonc/package-json/rules')
    expect(names).toContain('favorodera/jsonc/tsconfig/rules')
  })

  it('custom ignore patterns are merged', async () => {
    const resolved = await defineConfig({
      ignores: ['**/my-custom-dir/**'],
    })
    const ignoresConfig = resolved.find((config) => {
      return config.name === 'favorodera/ignores'
    })

    expect(ignoresConfig?.ignores).toContain('**/my-custom-dir/**')
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })

  it('ignores accepts a function to transform default patterns', async () => {
    const resolved = await defineConfig({
      ignores: (defaults) => {
        return [
          ...defaults,
          '**/generated/**',
        ]
      },
    })
    const ignoresConfig = resolved.find((config) => {
      return config.name === 'favorodera/ignores'
    })

    expect(ignoresConfig?.ignores).toContain('**/generated/**')
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })
})
