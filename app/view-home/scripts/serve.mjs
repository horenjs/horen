#!/usr/bin/env zx
import path from 'path';
import { distPath } from './build.mjs';

await $`pnpm run build`;

await $`serve ${distPath}`;
