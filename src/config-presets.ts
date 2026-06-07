import type { ConfigOptions } from './factory'

/** Preset configuration with all options enabled */
export const allConfigOptionsTrue: ConfigOptions = {
  vue: true,
  typescript: true,
  stylistic: true,
  tailwind: true,
  comments: true,
  imports: true,
}

/** Preset configuration with all options disabled */
export const allConfigOptionsFalse = Object
  .fromEntries(
    Object
      .entries(allConfigOptionsTrue)
      .map(([key]) => [key, false]),
  ) as ConfigOptions
