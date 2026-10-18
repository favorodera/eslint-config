import type { PromisedTypedConfigFlatItemArray, SharedOptions } from "../types"
import { importModule } from "../utils"
import { tsGlob, } from "../globs"

/** 
 * Constructs the flat config for core typescript linting
 * @returns Flat config items
 */
export async function typescript(options: SharedOptions): PromisedTypedConfigFlatItemArray {
  const typescriptPlugin = await importModule(import('typescript-eslint'))

  const files = [tsGlob]

  return [
    {
      name: 'favorodera/typescript/setup',
      plugins: { ts: typescriptPlugin.plugin },
      languageOptions: {
        parser: typescriptPlugin.parser,
      }
    },

    {
      files,
      name: 'favorodera/typescript/rules',
      rules: {
        'no-useless-return': 'error',

        ...options.overrides
      }
    }
  ]
}