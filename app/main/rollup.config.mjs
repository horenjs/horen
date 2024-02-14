import path from 'path';
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const distPath = '../../dist';

export default defineConfig([
  {
    input: 'src/index.ts',
    external: ['electron'],
    plugins: [typescript(), nodeResolve(), commonjs(), json()],
    output: [
      {
        name: 'main',
        file: path.join(distPath, 'main.js'),
        format: 'commonjs',
      },
    ],
  },
  {
    input: 'src/preload.ts',
    external: ['electron'],
    plugins: [typescript(), commonjs()],
    output: [
      {
        name: 'preload',
        file: path.join(distPath, 'preload.js'),
        format: 'commonjs',
      },
    ],
  },
]);
