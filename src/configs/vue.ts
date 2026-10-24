import { defu } from 'defu'
import { mergeProcessors } from 'eslint-merge-processors'
import vueBlocksProcessor, { type Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { BooleanSharedOptions, PromisedTypedConfigFlatItemArray, SharedOptions, TypedFlatConfigItem } from '../types'
import { vueGlob } from '../globs'
import { extractRules, importModule, resolveOptions } from '../utils'

/** Shared configuration options for ESLint rules and Vue settings */
export type VueOptions = SharedOptions & {
  a11y?: BooleanSharedOptions
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
  a11y: true,
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
  const enableA11y = resolveOptions(resolvedOptions.a11y, {})

  const [vuePlugin, typescriptPlugin, vueParser, a11yPlugin] = await Promise.all([
    importModule(import('eslint-plugin-vue')),
    importModule(import('typescript-eslint')),
    importModule(import('vue-eslint-parser')),
    importModule(import('eslint-plugin-vuejs-accessibility')),
  ])

  const processor = resolvedOptions.settings.sfcBlocks === false
    ? vuePlugin.processors['.vue']
    : mergeProcessors([
        vueBlocksProcessor(resolvedOptions.settings.sfcBlocks),
        vuePlugin.processors['.vue'],
      ])

  const files = [vueGlob]

  const config: TypedFlatConfigItem[] = [
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

  if (enableA11y) {
    config.push(
      {
        name: 'favorodera/vue/a11y/setup',
        plugins: { 'vue-a11y': a11yPlugin },
      },

      {
        files,
        name: 'favorodera/vue/a11y/rules',
        rules: {
          ...extractRules(a11yPlugin.configs['flat/recommended'] as any),

          'vue-a11y/form-control-has-label': [
            'error',
            {
              controlComponents: [],
              labelComponents: [],
            },
          ],
          'vue-a11y/label-has-for': [
            'error',
            {
              allowChildren: true,
              components: [],
              controlComponents: [],
              required: {
                some: [
                  'nesting',
                  'id',
                ],
              },
            },
          ],
          'vue-a11y/no-aria-hidden-on-focusable': 'error',
          'vue-a11y/no-role-presentation-on-focusable': 'error',

          ...enableA11y.overrides,
        },
      },
    )
  }

  return config
}
