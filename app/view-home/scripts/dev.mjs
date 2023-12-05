#!/usr/bin/env zx
import { resolve } from 'path';

const config = resolve(__dirname, '../config/webpack.config.js');

await $`cross-env NODE_ENV=development webpack serve -c ${config}`;
