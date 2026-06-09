import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { writeFile } from 'node:fs/promises'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { factory } from '../src/factory'

const configs = await factory()
  .prepend({
    plugins: {
      '': { rules: Object.fromEntries(builtinRules.entries()) },
    },
  })

const configNames = configs
  .map(config => config.name)
  .filter(Boolean)

let declarations = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

declarations += `
// Names of all the configs
export type ConfigNames = ${configNames.map(entry => `'${entry}'`).join(' | ')}
`

await writeFile('src/types/rules.d.ts', declarations, 'utf8')
