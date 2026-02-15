import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/out/**/*', '**/*.md'],

    stylistic: true,

    formatters: {
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'no-irregular-whitespace': 'warn',
    },
  },
  {
    files: ['**/package.json'],
    rules: {
      'pnpm/json-enforce-catalog': ['warn', {
        autofix: false,
      }],
    },
  },

)
