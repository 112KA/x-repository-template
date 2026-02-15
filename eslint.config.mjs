import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/out'],

    gitignore: true,

    stylistic: true,

    formatters: {
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
