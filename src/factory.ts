import { FlatConfigComposer, type Awaitable } from "eslint-flat-config-utils";
import type { FlatConfig, TypedFlatConfigItem } from "./types/utils";
import { resolveOptions } from "./utils";
import { vue, type VueConfigOptions } from "./configs/vue";
import { typescript,type TypescriptConfigOptions } from "./configs/typescript";
import { ignores, type IgnoresPatterns } from "./configs/ignores";
export type ConfigOptions = {
  vue?: boolean | VueConfigOptions
  typescript?:boolean|TypescriptConfigOptions
  ignores?:IgnoresPatterns
}

/**
 * Factory to create a flat ESLint config
 * @returns Flat ESLint config
 */
export function favorodera(options: ConfigOptions = {}) {
  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  configs.push(ignores(options.ignores))

  const vueOptions = resolveOptions(options.vue, {})
  const typescriptOptions = resolveOptions(options.typescript, {})

  if (vueOptions) configs.push(vue(vueOptions))
  if (typescriptOptions) configs.push(typescript(typescriptOptions))

  return new FlatConfigComposer<FlatConfig>(...configs)
}