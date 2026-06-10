import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
import { defu } from 'defu'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor from 'eslint-processor-vue-blocks'
import { vueGlob } from '../globs'
import { extractRules, importModule, resolveOptions } from '../utils'

/** Options for configuring Vue single-file component linting rules. */
export type VueConfigOptions = SharedOptions & {
  /**
   * Configuration for extracting and linting custom Single-File Component (SFC) blocks
   * such as `<style>`, `<route>`, or `<i18n>`.
   * Pass `false` to disable block processing, or an options object to customize block matching.
   */
  sfcBlocks?: boolean | VueBlocksOptions
}

const sfcBlocksDefaults: VueBlocksOptions = {
  blocks: { customBlocks: true, styles: true, template: false },
}

const vueDefaults: VueConfigOptions = {
  files: [vueGlob],
  sfcBlocks: sfcBlocksDefaults,
}

/**
 * Constructs the flat config items for Vue linting, setting up the custom template parser,
 * Vue block processors, and rules to enforce recommended component syntax.
 * @param options Vue configuration options.
 * @returns Promise resolving to Vue ESLint config items.
 */
export async function vue(options: VueConfigOptions): Promise<Array<TypedFlatConfigItem>> {
  const resolved = defu(options, vueDefaults)
  const sfcBlocks = resolveOptions(resolved.sfcBlocks, sfcBlocksDefaults)

  const [vuePlugin, vueParser, tsEsLint] = await Promise.all([
    importModule(import('eslint-plugin-vue')),
    importModule(import('vue-eslint-parser')),
    importModule(import('typescript-eslint')),
  ])

  const baseRules = extractRules(
    vuePlugin.configs['flat/essential'],
    vuePlugin.configs['flat/strongly-recommended'],
    vuePlugin.configs['flat/recommended'],
  )

  const processor = sfcBlocks === false
    ? vuePlugin.processors['.vue']
    : mergeProcessors([
        vuePlugin.processors['.vue'],
        vueBlocksProcessor(sfcBlocks),
      ])

  return [
    {
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
      plugins: { vue: vuePlugin },
    },
    {
      files: resolved.files,
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          extraFileExtensions: ['.vue'],
          parser: tsEsLint.parser,
          sourceType: 'module',
        },
      },
      name: 'favorodera/vue/rules',
      processor,
      rules: {
        ...baseRules,

        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/block-tag-newline': ['error', { multiline: 'ignore', singleline: 'ignore' }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/multi-word-component-names': 'off',
        'vue/multiline-html-element-content-newline': ['error', { allowEmptyLines: true, ignores: ['pre', 'textarea'] }],

        ...resolved.overrides,
      },
    },
  ]
}
