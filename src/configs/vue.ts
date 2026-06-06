import { defu } from 'defu'
import { vueGlob } from '../globs'
import { getModuleDefault } from '../utils'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import tseslint from 'typescript-eslint'

export type VueConfigOptions = SharedOptions & {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions
}

const vueDefaults: VueConfigOptions = {
  files: [vueGlob],
  sfcBlocks: {
    blocks: { styles: true, customBlocks: true, template: false },
  },
}

export async function vue(options: VueConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, vueDefaults)

  const [pluginVue, parserVue] = await Promise.all([
    getModuleDefault(import('eslint-plugin-vue')),
    getModuleDefault(import('vue-eslint-parser')),
  ] as const)

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
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
      },
      name: 'favorodera/vue/setup',
      plugins: { vue: pluginVue },
    },
    {
      name: 'favorodera/vue/rules',
      files:  resolved.files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          parser: tseslint.parser,
          extraFileExtensions: ['.vue'],
          sourceType: 'module',
        },
      },
      rules: {
        ...pluginVue.configs.base.rules as any,

        ...pluginVue.configs['flat/essential']
        .map(config => config.rules)
        .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        ...pluginVue.configs['flat/strongly-recommended']
        .map(config => config.rules)
        .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        ...pluginVue.configs['flat/recommended']
        .map(config => config.rules)
        .reduce((accumulator, currentConfig) => ({ ...accumulator, ...currentConfig }), {}),

        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],


        // NOTE: To be filled
        
        ...resolved.overrides,
      },
    },
  ]
}