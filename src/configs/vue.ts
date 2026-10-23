import { defu } from 'defu'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor, { type Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { vueGlob } from '../globs'
import { importModule } from '../utils'

/** Shared configuration options for ESLint rules and Vue settings */
export type VueOptions = SharedOptions & {
  settings?: VueSettings
}

/** Options for configuring Vue linting rules. */
interface VueSettings {
  /**
   * Configuration for extracting and linting custom Single-File Component (SFC) blocks
   * such as `<style>`, `<route>`, or `<i18n>`.
   * Pass `false` to disable block processing, or an options object to customize block matching.
   * @default { customBlocks: true, styles: true, template: false }
   */
  sfcBlocks?: false | VueBlocksOptions
}

const vueDefaults = {
  overrides: undefined,
  settings: {
    sfcBlocks: {
      blocks: {
        customBlocks: true,
        styles: true,
        template: false,
      },
    },
  },
} satisfies VueOptions

/**
 * Constructs the flat config for vue linting
 * @returns Flat config items
 */
export async function vue(options: VueOptions): PromisedTypedConfigFlatItemArray {
  const resolvedOptions = defu(options, vueDefaults)

  const [vuePlugin, typescriptPlugin, vueParser] = await Promise.all([
    importModule(import('eslint-plugin-vue')),
    importModule(import('typescript-eslint')),
    importModule(import('vue-eslint-parser')),
  ])

  const processor = resolvedOptions.settings.sfcBlocks === false
    ? vuePlugin.processors['.vue']
    : mergeProcessors([
        vueBlocksProcessor(resolvedOptions.settings.sfcBlocks),
        vuePlugin.processors['.vue'],
      ])

  const files = [vueGlob]

  return [
    {
      files,
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          extraFileExtensions: ['.vue'],
          parser: typescriptPlugin.parser,
          sourceType: 'module',
        },
      },
      name: 'favorodera/vue/rules',
      processor,
      rules: {
        'vue/block-lang': [
          'error',
          { script: { lang: 'ts' } },
        ],

        ...resolvedOptions.overrides,
      },
    },

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
  ]
}
