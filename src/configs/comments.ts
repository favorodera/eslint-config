import { defu } from 'defu'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { getModuleDefault, renameRules } from '../utils'

/** Configuration options for comments ESLint rules */
export type CommentsConfigOptions = Pick<SharedOptions, 'overrides'>

/** Default comments configuration values. */
const commentsDefaults: CommentsConfigOptions = {}


/**
 * Comments linting via `@eslint-community/eslint-plugin-eslint-comments`
 * @param options - Comments configuration options
 * @returns Promise resolving to comments ESLint config items
*/
export async function comments(options: CommentsConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, commentsDefaults)

  const commentsPlugin = await getModuleDefault(import('@eslint-community/eslint-plugin-eslint-comments'))

  return [
    {
      name: 'favorodera/comments/rules',
      plugins: { comments: commentsPlugin },
      rules: {
        ...renameRules(commentsPlugin.configs.recommended?.rules || {}, { '@eslint-community/eslint-comments': 'comments' }),

        'comments/no-aggregating-enable': 'error',
        'comments/no-duplicate-disable': 'error',
        'comments/no-unlimited-disable': 'error',
        'comments/no-unused-enable': 'error',

        ...resolved.overrides,
      },
    },
  ]
}
