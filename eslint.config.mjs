import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',

    ignores: ['**/*.d.ts', 'src/@types/**'],

    typescript: true,

    stylistic: true,
  },
)
