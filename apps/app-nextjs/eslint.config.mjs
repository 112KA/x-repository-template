import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/*.d.ts', 'src/@types/**'],

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
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
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
  {
    ignores: ['public/**'],
  },

)
