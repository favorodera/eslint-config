import { describe, expect, test } from 'vitest'
import { factory } from '../src/factory'
import { extractRules, importModule, resolveOptions } from '../src/utils'


describe('resolveOptions', () => {
  test('returns false when value is false', () => {
    expect(resolveOptions(false, { foo: 'bar' })).toBe(false)
  })

  test('returns false when value is undefined', () => {
    expect(resolveOptions(undefined, { foo: 'bar' })).toBe(false)
  })

  test('returns defaults when value is true', () => {
    expect(resolveOptions(true, { indent: 2, quotes: 'single' }))
      .toEqual({ indent: 2, quotes: 'single' })
  })

  test('merges provided options over defaults', () => {
    expect(resolveOptions({ indent: 4 }, { indent: 2, quotes: 'single' }))
      .toEqual({ indent: 4, quotes: 'single' })
  })

  test('empty object with empty defaults returns empty object', () => {
    expect(resolveOptions({}, {})).toEqual({})
  })
})


describe('extractRules', () => {
  test('extracts rules from a single config array', () => {
    const result = extractRules([{ rules: { 'no-console': 'error' } }])
    expect(result).toEqual({ 'no-console': 'error' })
  })

  test('merges rules across multiple config arrays', () => {
    const result = extractRules(
      [{ rules: { 'no-console': 'error' } }],
      [{ rules: { 'no-debugger': 'warn' } }],
    )
    expect(result).toEqual({ 'no-console': 'error', 'no-debugger': 'warn' })
  })

  test('later rules overwrite earlier ones (last-write-wins)', () => {
    const result = extractRules(
      [{ rules: { 'no-console': 'warn' } }],
      [{ rules: { 'no-console': 'error' } }],
    )
    expect(result['no-console']).toBe('error')
  })

  test('handles configs without rules gracefully', () => {
    const result = extractRules(
      [{}],
      [{ rules: { 'no-undef': 'error' } }],
    )
    expect(result).toEqual({ 'no-undef': 'error' })
  })

  test('returns empty object for empty input', () => {
    expect(extractRules([])).toEqual({})
  })
})


describe('importModule', () => {
  test('returns .default when present (ESM interop)', async () => {
    const fakeModule = { default: { rules: {} } }
    const result = await importModule(Promise.resolve(fakeModule))
    expect(result).toBe(fakeModule.default)
  })

  test('returns the module directly when no .default exists (CJS)', async () => {
    const fakeModule = { rules: {} }
    const result = await importModule(Promise.resolve(fakeModule))
    expect(result).toBe(fakeModule)
  })

  test('handles null without throwing', async () => {
    // null has no .default property check — returns as-is
    // eslint-disable-next-line unicorn/no-null
    const result = await importModule(Promise.resolve(null))
    expect(result).toBeNull()
  })
})


describe('factory', () => {
  test('resolves to a non-empty array of configs', async () => {
    const resolved = await factory()
    expect(Array.isArray(resolved)).toBe(true)
    expect(resolved.length).toBeGreaterThan(0)
  })

  test('always includes the ignores config first', async () => {
    const resolved = await factory()
    expect(resolved[0]?.name).toBe('favorodera/ignores')
  })

  test('includes expected default config names', async () => {
    const resolved = await factory()
    const names = resolved.map(config => config.name)

    const expected = [
      'favorodera/ignores',
      'favorodera/imports/setup',
      'favorodera/imports/rules',
      'favorodera/javascript/setup',
      'favorodera/javascript/rules',
      'favorodera/jsdoc/setup',
      'favorodera/jsdoc/rules',
      'favorodera/jsonc/setup',
      'favorodera/jsonc/rules',
      'favorodera/jsonc/sort/package-json',
      'favorodera/jsonc/sort/tsconfig-json',
      'favorodera/markdown/setup',
      'favorodera/markdown/rules',
      'favorodera/markdown/code-in-md/disables',
      'favorodera/node/setup',
      'favorodera/node/rules',
      'favorodera/perfectionist/setup',
      'favorodera/perfectionist/rules',
      'favorodera/pnpm/setup',
      'favorodera/pnpm/package-json',
      'favorodera/pnpm/pnpm-workspace-yaml',
      'favorodera/stylistic/setup',
      'favorodera/stylistic/rules',
      'favorodera/tailwind/setup',
      'favorodera/tailwind/rules',
      'favorodera/test/setup',
      'favorodera/test/rules',
      'favorodera/test/disables',
      'favorodera/typescript/setup',
      'favorodera/typescript/rules',
      'favorodera/unicorn/setup',
      'favorodera/unicorn/rules',
      'favorodera/vue/setup',
      'favorodera/vue/rules',
      'favorodera/yaml/setup',
      'favorodera/yaml/rules',
      'favorodera/yaml/sort/pnpm-workspace-yaml',
    ]

    for (const name of expected) {
      expect(names, `"${name}" was not returned by factory()`).toContain(name)
    }
  })

  test('disabling typescript excludes its config', async () => {
    const withTs = await factory({ typescript: true })
    const withoutTs = await factory({ typescript: false })

    const withNames = withTs.map(config => config.name)
    const withoutNames = withoutTs.map(config => config.name)

    expect(withNames).toContain('favorodera/typescript/rules')
    expect(withNames).toContain('favorodera/typescript/setup')

    expect(withoutNames).not.toContain('favorodera/typescript/rules')
    expect(withoutNames).not.toContain('favorodera/typescript/setup')
  })

  test('disabling vue excludes its config', async () => {
    const withVue = await factory({ vue: true })
    const withoutVue = await factory({ vue: false })

    expect(withVue.map(config => config.name)).toContain('favorodera/vue/rules')
    expect(withVue.map(config => config.name)).toContain('favorodera/vue/setup')

    expect(withoutVue.map(config => config.name)).not.toContain('favorodera/vue/rules')
    expect(withoutVue.map(config => config.name)).not.toContain('favorodera/vue/setup')
  })

  test('disabling multiple configs reduces count', async () => {
    const full = await factory()
    const stripped = await factory({
      jsdoc: false,
      markdown: false,
      tailwind: false,
      vue: false,
      yaml: false,
    })
    expect(stripped.length).toBeLessThan(full.length)
  })

  test('plugin renaming: @typescript-eslint → ts', async () => {
    const resolved = await factory({ vue: false })
    const tsSetup = resolved.find(config => config.name === 'favorodera/typescript/setup')
    expect(tsSetup?.plugins).toHaveProperty('ts')
    expect(tsSetup?.plugins).not.toHaveProperty('@typescript-eslint')
  })

  test('plugin renaming: n → node', async () => {
    const resolved = await factory()
    const nodeSetup = resolved.find(config => config.name === 'favorodera/node/setup')
    expect(nodeSetup?.plugins).toHaveProperty('node')
    expect(nodeSetup?.plugins).not.toHaveProperty('n')
  })

  test('plugin renaming: yml → yaml', async () => {
    const resolved = await factory()
    const yamlSetup = resolved.find(config => config.name === 'favorodera/yaml/setup')
    expect(yamlSetup?.plugins).toHaveProperty('yaml')
    expect(yamlSetup?.plugins).not.toHaveProperty('yml')
  })

  test('plugin renaming: better-tailwindcss → tailwind', async () => {
    const resolved = await factory()
    const tailwindSetup = resolved.find(config => config.name === 'favorodera/tailwind/setup')
    expect(tailwindSetup?.plugins).toHaveProperty('tailwind')
    expect(tailwindSetup?.plugins).not.toHaveProperty('better-tailwindcss')
  })

  test('plugin renaming: import-lite → import', async () => {
    const resolved = await factory()
    const importSetup = resolved.find(config => config.name === 'favorodera/imports/setup')
    expect(importSetup?.plugins).toHaveProperty('import')
    expect(importSetup?.plugins).not.toHaveProperty('import-lite')
  })

  test('plugin renaming: markdown → md', async () => {
    const resolved = await factory()
    const mdSetup = resolved.find(config => config.name === 'favorodera/markdown/setup')
    expect(mdSetup?.plugins).toHaveProperty('md')
    expect(mdSetup?.plugins).not.toHaveProperty('markdown')
  })

  test('plugin renaming: vitest → test', async () => {
    const resolved = await factory()
    const testSetup = resolved.find(config => config.name === 'favorodera/test/setup')
    expect(testSetup?.plugins).toHaveProperty('test')
    expect(testSetup?.plugins).not.toHaveProperty('vitest')
  })

  test('custom overrides are present in resolved rules', async () => {
    const resolved = await factory({
      javascript: {
        overrides: { 'no-console': 'off' },
      },
    })
    const jsRules = resolved.find(config => config.name === 'favorodera/javascript/rules')
    expect(jsRules?.rules?.['no-console']).toBe('off')
  })

  test('custom ignore patterns are merged', async () => {
    const resolved = await factory({
      ignores: ['**/my-custom-dir/**'],
    })
    const ignoresConfig = resolved.find(config => config.name === 'favorodera/ignores')
    expect(ignoresConfig?.ignores).toContain('**/my-custom-dir/**')
    // default patterns still present
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })

  test('ignores accepts a function to transform default patterns', async () => {
    const resolved = await factory({
      ignores: defaults => [...defaults, '**/generated/**'],
    })
    const ignoresConfig = resolved.find(config => config.name === 'favorodera/ignores')
    expect(ignoresConfig?.ignores).toContain('**/generated/**')
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })
})
