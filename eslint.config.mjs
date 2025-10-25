import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/*.d.ts', 'src/@types/**'],

    typescript: true,

    stylistic: true,
  },
)
