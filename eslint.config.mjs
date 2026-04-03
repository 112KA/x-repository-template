import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['apps/**', 'packages/**', '**/*.md/**'],

    gitignore: true,

    stylistic: true,

    formatters: {
      markdown: 'prettier',
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
