import { describe, expect, it } from 'vitest'
import { factory } from '../src/factory'
import { extractRules, importModule, omit, resolveOptions } from '../src/utils'

describe('omit', () => {
  it('returns a new object without the specified keys', () => {
    const source = { a: 1, b: 2, c: 3 }
    const result = omit(source, [
      'a',
      'c',
    ])

    expect(result).toStrictEqual({ b: 2 })
  })

  it('does not mutate the original object', () => {
    const source = { a: 1, b: 2 }
    const result = omit(source, ['a'])

    expect(source).toStrictEqual({ a: 1, b: 2 })
    expect(result).toStrictEqual({ b: 2 })
  })

  it('returns a shallow copy when no keys are omitted', () => {
    const source = { a: 1, b: 2 }
    const result = omit(source, [])

    expect(result).toStrictEqual({ a: 1, b: 2 })
    expect(result).not.toBe(source)
  })

  it('handles single key omission', () => {
    const source = { name: 'test', plugins: {}, rules: {} }
    const result = omit(source, ['rules'])

    expect(result).toStrictEqual({ name: 'test', plugins: {} })
    expect('rules' in result).toBe(false)
  })

  it('works with symbol keys', () => {
    const sym = Symbol('hidden')
    const source = { a: 1, [sym]: 2 }
    const result = omit(source, ['a'])

    expect(result).toStrictEqual({ [sym]: 2 })
  })

  it('returns empty object when all keys are omitted', () => {
    const source = { a: 1 }
    const result = omit(source, ['a'])

    expect(result).toStrictEqual({})
  })
})

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
  it('extracts rules from a single config array', () => {
    const result = extractRules([{ rules: { 'no-console': 'error' } }])

    expect(result).toStrictEqual({ 'no-console': 'error' })
  })

  it('merges rules across multiple config arrays', () => {
    const result = extractRules(
      [{ rules: { 'no-console': 'error' } }],
      [{ rules: { 'no-debugger': 'warn' } }],
    )

    expect(result).toStrictEqual({ 'no-console': 'error', 'no-debugger': 'warn' })
  })

  it('later rules overwrite earlier ones (last-write-wins)', () => {
    const result = extractRules(
      [{ rules: { 'no-console': 'warn' } }],
      [{ rules: { 'no-console': 'error' } }],
    )

    expect(result['no-console']).toBe('error')
  })

  it('handles configs without rules gracefully', () => {
    const result = extractRules(
      [{}],
      [{ rules: { 'no-undef': 'error' } }],
    )

    expect(result).toStrictEqual({ 'no-undef': 'error' })
  })

  it('returns empty object for empty input', () => {
    expect(extractRules([])).toStrictEqual({})
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

  it('handles null without throwing', async () => {
    // null has no .default property check — returns as-is
    // eslint-disable-next-line unicorn/no-null
    const result = await importModule(Promise.resolve(null))

    expect(result).toBeNull()
  })
})

describe('factory', () => {
  it('resolves to a non-empty array of configs', async () => {
    const resolved = await factory()

    expect(Array.isArray(resolved)).toBe(true)
    expect(resolved.length).toBeGreaterThan(0)
  })

  it('always includes the ignores config first', async () => {
    const resolved = await factory()

    expect(resolved[0]?.name).toBe('favorodera/ignores')
  })

  it('disabling typescript excludes its config', async () => {
    const withTs = await factory({ typescript: true })
    const withoutTs = await factory({ typescript: false })

    const withNames = withTs.map(config => config.name)
    const withoutNames = withoutTs.map(config => config.name)

    expect(withNames).toContain('favorodera/typescript/rules')
    expect(withNames).toContain('favorodera/typescript/setup')

    expect(withoutNames).not.toContain('favorodera/typescript/rules')
    expect(withoutNames).not.toContain('favorodera/typescript/setup')
  })

  it('disabling vue excludes its config', async () => {
    const withVue = await factory({ vue: true })
    const withoutVue = await factory({ vue: false })

    expect(withVue.map(config => config.name)).toContain('favorodera/vue/rules')
    expect(withVue.map(config => config.name)).toContain('favorodera/vue/setup')

    expect(withoutVue.map(config => config.name)).not.toContain('favorodera/vue/rules')
    expect(withoutVue.map(config => config.name)).not.toContain('favorodera/vue/setup')
  })

  it('disabling multiple configs reduces count', async () => {
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

  it('custom ignore patterns are merged', async () => {
    const resolved = await factory({
      ignores: ['**/my-custom-dir/**'],
    })
    const ignoresConfig = resolved.find(config => config.name === 'favorodera/ignores')

    expect(ignoresConfig?.ignores).toContain('**/my-custom-dir/**')
    // default patterns still present
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })

  it('ignores accepts a function to transform default patterns', async () => {
    const resolved = await factory({
      ignores: defaults => [
        ...defaults,
        '**/generated/**',
      ],
    })
    const ignoresConfig = resolved.find(config => config.name === 'favorodera/ignores')

    expect(ignoresConfig?.ignores).toContain('**/generated/**')
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })
})
