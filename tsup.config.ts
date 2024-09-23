import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  clean: true,
  ...options,
}))
