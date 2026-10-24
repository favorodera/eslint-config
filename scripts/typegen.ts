/**
 * Generates type declarations for the ESLint rules and config names exposed by this package.
 *
 * Run through `pnpm typegen` before type-checking or building the package.
 */
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { writeFile } from 'node:fs/promises'
import { defineConfig } from '../src'

/** The fully resolved default config, augmented with ESLint built-in rules. */
const configs = await defineConfig()
  .prepend({
    plugins: {
      '': { rules: Object.fromEntries(builtinRules.entries()) },
    },
  })

/** Names of config items used to generate the `ConfigNames` union. */
const configNames = configs
  .map((config) => {
    return config.name
  })
  .filter(Boolean)

/** Generated declaration text for available rules. */
let declarations = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

declarations += `
/** Names of all configuration items returned by the default configuration. */
export type ConfigNames = ${configNames.map((entry) => {
    return `'${entry}'`
  }).join(' | ')
}
`

await writeFile('src/typegen.d.ts', declarations, 'utf8')
