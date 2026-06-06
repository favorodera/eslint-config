import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { favorodera } from '../src/factory'
import { allConfigOptionsTrue } from '../src/config-presets'
import { writeFile } from 'node:fs/promises'

const configs = await favorodera(allConfigOptionsTrue)

const configNames = configs
  .map(config => config.name)
  .filter(Boolean)

let declarations = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
})

declarations += `
// Names of all the configs
export type ConfigNames = ${configNames.map((entry) => `'${entry}'`).join(' | ')}
`

await writeFile('src/types/rules.d.ts', declarations, 'utf8')