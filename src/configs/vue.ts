import { defu } from 'defu'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor, { type Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { PromisedTypedConfigFlatItemArray, SharedOptions } from '../types'
import { vueGlob } from '../globs'
import { extractRules, importModule } from '../utils'

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
        ...extractRules(vuePlugin.configs['flat/recommended-error']),

        'vue/block-lang': [
          'error',
          { script: { lang: 'ts' } },
        ],
        'vue/block-order': [
          'error',
          {
            order: [
              'script',
              'template',
              'style',
            ],
          },
        ],
        'vue/block-tag-newline': [
          'error',
          { multiline: 'always', singleline: 'always' },
        ],
        'vue/comment-directive': [
          'error',
          { reportUnusedDisableDirectives: true },
        ],
        'vue/define-macros-order': [
          'error',
          {
            defineExposeLast: true,
            order: [
              'defineOptions',
              'definePage',
              'defineSlots',
              'defineProps',
              'defineEmits',
              'defineModel',
            ],
          },
        ],
        'vue/define-props-declaration': [
          'error',
          'type-based',
        ],
        'vue/define-props-destructuring': [
          'error',
          { destructure: 'never' },
        ],
        'vue/multi-word-component-names': 'off',
        'vue/next-tick-style': [
          'error',
          'promise',
        ],
        'vue/no-import-compiler-macros': 'error',
        'vue/no-negated-v-if-condition': 'error',
        'vue/no-reserved-component-names': [
          'error',
          {
            disallowVue3BuiltInComponents: true,
            disallowVueBuiltInComponents: true,
            htmlElementCaseSensitive: false,
          },
        ],
        'vue/no-root-v-if': 'error',
        'vue/no-template-target-blank': 'error',
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-unused-properties': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/padding-line-between-tags': [
          'error',
          [
            {
              blankLine: 'always',
              next: '*',
              prev: '*',
            },
          ],
        ],
        'vue/prefer-prop-type-boolean-first': 'error',
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-single-event-payload': 'error',
        'vue/prefer-use-template-ref': 'error',
        'vue/slot-name-casing': [
          'error',
          'kebab-case',
        ],
        'vue/v-for-delimiter-style': [
          'error',
          'in',
        ],

        ...resolvedOptions.overrides,

      },
    },
  ]
}
