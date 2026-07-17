import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/*.d.ts', 'src/types/**'],

    nextjs: true,

    typescript: true,

    stylistic: true,

    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
  },
  {
    files: ['**/*.{tsx,ts}'],
    rules: {
      'node/prefer-global/process': 'off', // Allow using `process.env`
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // 💡 先頭が _ の変数は無視
          args: 'after-used',
          argsIgnorePattern: '^_', // 💡 先頭が _ の引数は無視
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
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
  {
    ignores: ['public/**'],
  },

)
