import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    astro: true,

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
    files: ['**/package.json'],
    rules: {
      'pnpm/json-enforce-catalog': ['warn', {
        autofix: false,
      }],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
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
    files: ['**/*.astro'],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/styles/global.css',
      },
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
    },
  },
  {
    ignores: ['public/**'],
  },
)
