// src/configs/stylistic.ts
import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { defu } from 'defu'
import { getModuleDefault } from '../utils'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'

/** Configuration options for stylistic ESLint rules. */
export type StylisticConfigOptions = StylisticCustomizeOptions & SharedOptions

/** Default stylistic configuration values. */
const stylisticDefaults: StylisticConfigOptions = {
  indent: 2,
  braceStyle: 'stroustrup',
  experimental: false,
  quotes: 'single',
  semi: false,
  pluginName: 'style',
  jsx: false,
}

/**
 * Code style via @stylistic, rules exposed under the `style/` prefix.
 * @param options - Stylistic configuration options
 * @returns Promise resolving to stylistic ESLint config items
 */
export async function stylistic(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, stylisticDefaults)

  const stylePlugin = await getModuleDefault(import('@stylistic/eslint-plugin'))

  const customizedStyleConfig = stylePlugin.configs.customize(resolved) as TypedFlatConfigItem

  return [
    {
      name: 'favorodera/stylistic/rules',
      plugins: { style: stylePlugin },
      rules: {
        ...customizedStyleConfig.rules,
        ...resolved.overrides,
      },
    },
  ]
}
