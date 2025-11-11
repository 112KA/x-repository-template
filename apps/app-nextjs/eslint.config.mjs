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
    files: ['**/*.tsx'],
    rules: {
      'node/prefer-global/process': 'off', // Allow using `process.env`
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'no-irregular-whitespace': 'warn',
    },
  },
  {
    ignores: ['public/**'],
  },

)
