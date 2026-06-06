import tseslint from 'typescript-eslint'
import { defu } from 'defu'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { tsGlob } from '../globs'

export type TypescriptConfigOptions = SharedOptions

const typescriptDefaults: TypescriptConfigOptions = {
  files: [tsGlob],
}

export async function typescript(options: TypescriptConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, typescriptDefaults)

return [
  ...(tseslint.configs.recommended as TypedFlatConfigItem[]),

  {
    name: 'favorodera/typescript/rules',
    files: resolved.files,
    rules: { 
      ...resolved.overrides
    },
  },
]
}