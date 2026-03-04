import vue from 'eslint-plugin-vue';
import js from '@eslint/js';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: false
      }
    ]
  }
];
