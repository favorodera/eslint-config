import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import { defu } from 'defu'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor from 'eslint-processor-vue-blocks'
import type { SharedOptions, TypedFlatConfigItem } from '../types/utils'
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

  const [
    vuePlugin,
    vueParser,
    tsEsLint,
  ] = await Promise.all([
    importModule(import('eslint-plugin-vue')),
    importModule(import('vue-eslint-parser')),
    importModule(import('typescript-eslint')),
  ])

  const baseRules = extractRules(vuePlugin.configs['flat/recommended-error'])

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

        'vue/block-lang': [
          'error',
          { script: { lang: 'ts' } },
        ],
        'vue/block-order': [
          'error',
          { order: [
            'script',
            'template',
            'style',
          ] },
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
              'defineEmits',
              'defineProps',
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
            { blankLine: 'always', next: '*:multi-line', prev: '*:single-line' },
            { blankLine: 'always', next: '*:single-line', prev: '*:multi-line' },
            { blankLine: 'always', next: '*:multi-line', prev: '*:multi-line' },
            { blankLine: 'never', next: '*:single-line', prev: '*:single-line' },
          ],
        ],
        'vue/prefer-prop-type-boolean-first': 'error',
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-single-event-payload': 'error',
        'vue/prefer-use-template-ref': 'error',
        'vue/require-explicit-slots': 'error',
        'vue/require-macro-variable-name': 'error',
        'vue/slot-name-casing': [
          'error',
          'kebab-case',
        ],
        'vue/v-for-delimiter-style': [
          'error',
          'in',
        ],

        ...resolved.overrides,
      },
    },
  ]
}
