import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  input: 'index.ts',
  external: ['electron'],
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
  ],
  output: [
    {
      name: 'plugin-eipc',
      file: 'dist/index.js',
      format: 'commonjs',
    },
  ]
})