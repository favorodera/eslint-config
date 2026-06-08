import { defu } from 'defu'
import { vueGlob } from '../globs'
import { getModuleDefault, resolveOptions } from '../utils'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import { mergeProcessors } from 'eslint-merge-processors'

/** Configuration options for Vue ESLint rules */
export type VueConfigOptions = SharedOptions & {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions
}

const sfcBlocksDefaults: VueBlocksOptions = {
  blocks: { styles: true, customBlocks: true, template: false },
}

const vueDefaults: VueConfigOptions = {
  files: [vueGlob],
  sfcBlocks: sfcBlocksDefaults,
}

/**
 * Vue SFC linting via `vue-eslint-parser`, `eslint-plugin-vue`, `typescript-eslint(parser)`.
 * @param options - Vue configuration options
 * @returns Promise resolving to Vue ESLint config items
 */
export async function vue(options: VueConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, vueDefaults)
  const sfcBlocks = resolveOptions(resolved.sfcBlocks, sfcBlocksDefaults)

  const [vuePlugin, vueParser, tsEsLint, vueBlocksProcessor] = await Promise.all([
    getModuleDefault(import('eslint-plugin-vue')),
    getModuleDefault(import('vue-eslint-parser')),
    getModuleDefault(import('typescript-eslint')),
    getModuleDefault(import('eslint-processor-vue-blocks')),
  ])

  return [
    {
      name: 'favorodera/vue/rules',
      plugins: { vue: vuePlugin },
      files: resolved.files,
      languageOptions: {
        // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
        parser: vueParser,
        parserOptions: {
          parser: tsEsLint.parser,
          extraFileExtensions: ['.vue'],
          sourceType: 'module',
        },
      },

      processor: sfcBlocks === false
        ? vuePlugin.processors['.vue']
        : mergeProcessors([
            vuePlugin.processors['.vue'],
            vueBlocksProcessor(sfcBlocks),
          ]),

      rules: {
        ...vuePlugin.configs.base.rules as any,

        ...vuePlugin.configs['flat/essential']
          .map(config => config.rules)
          .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        ...vuePlugin.configs['flat/strongly-recommended']
          .map(config => config.rules)
          .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        ...vuePlugin.configs['flat/recommended']
          .map(config => config.rules)
          .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/multi-word-component-names': 'off',
        'vue/block-tag-newline': ['error', { multiline: 'ignore', singleline: 'ignore' }],
        'vue/multiline-html-element-content-newline': ['error', { allowEmptyLines: true, ignores: ['pre', 'textarea'] }],

        ...resolved.overrides,
      },
    },
  ]
}
