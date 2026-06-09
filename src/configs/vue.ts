import { defu } from 'defu'
import { vueGlob } from '../globs'
import { importModule, resolveOptions } from '../utils'
import type { TypedFlatConfigItem, SharedOptions } from '../types/utils'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor from 'eslint-processor-vue-blocks'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'

export type VueConfigOptions = SharedOptions & {
  sfcBlocks?: boolean | VueBlocksOptions
}

const sfcBlocksDefaults: VueBlocksOptions = {
  blocks: { styles: true, customBlocks: true, template: false },
}

const vueDefaults: VueConfigOptions = {
  files: [vueGlob],
  sfcBlocks: sfcBlocksDefaults,
}

export async function vue(options: VueConfigOptions): Promise<TypedFlatConfigItem[]> {
  const resolved = defu(options, vueDefaults)
  const sfcBlocks = resolveOptions(resolved.sfcBlocks, sfcBlocksDefaults)

  const [vuePlugin, vueParser, tsEsLint] = await Promise.all([
    importModule(import('eslint-plugin-vue')),
    importModule(import('vue-eslint-parser')),
    importModule(import('typescript-eslint')),
  ])

  const inheritedRules = Object.assign(
    {},
    ...[
      ...vuePlugin.configs['flat/essential'],
      ...vuePlugin.configs['flat/strongly-recommended'],
      ...vuePlugin.configs['flat/recommended'],
    ].map(config => config?.rules || {}),
  )

  return [
    {
      name: 'favorodera/vue',
      plugins: { vue: vuePlugin },
      files: resolved.files,
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
        ...inheritedRules,

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
