import type { ConfigOptions } from './factory'

/** Preset configuration with all options enabled */
export const allConfigOptionsTrue: ConfigOptions = {
  vue: true,
  typescript: true,
  stylistic: true,
  tailwind: true,
  comments: true,
}

/** Preset configuration with all options disabled */
export const allConfigOptionsFalse: ConfigOptions = {
  vue: false,
  typescript: false,
  stylistic: false,
  tailwind: false,
  comments: false,
}
