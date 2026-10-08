import { describe, expect, it } from 'vitest'
import { defineConfig } from '../src/'
import {  importModule, resolveOptions } from '../src/utils'

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
    const result = await importModule(Promise.resolve(null))

    expect(result).toBeNull()
  })
})

describe('factory', () => {
  it('resolves to a non-empty array of configs', async () => {
    const resolved = await defineConfig()

    expect(Array.isArray(resolved)).toBe(true)
    expect(resolved.length).toBeGreaterThan(0)
  })

  it('always includes the ignores config first', async () => {
    const resolved = await defineConfig()

    expect(resolved[0]?.name).toBe('favorodera/ignores')
  })

  it('disabling configs reduces count', async () => {
    const full = await defineConfig()
    const stripped = await defineConfig({
      markdown: false,
      tailwind: false,
      vue: false,
      yaml: false,
    })

    expect(stripped.length).toBeLessThan(full.length)
  })

  it('custom ignore patterns are merged', async () => {
    const resolved = await defineConfig({
      ignores: ['**/my-custom-dir/**'],
    })
    const ignoresConfig = resolved.find(config => config.name === 'favorodera/ignores')

    expect(ignoresConfig?.ignores).toContain('**/my-custom-dir/**')
    // default patterns still present
    expect(ignoresConfig?.ignores).toContain('**/node_modules/**')
  })

  it('ignores accepts a function to transform default patterns', async () => {
    const resolved = await defineConfig({
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
