#!/usr/bin/env zx
import path from 'path';

const config = path.resolve(__dirname, '../config/webpack.config.js');
export const distPath =
  process.env.EE_DIST_PATH
    ? path.join(process.env.EE_DIST_PATH, 'vue-react')
    : '../dist';

// 删除旧的文件
await fs.remove(distPath); 
// 生成前端
await $`cross-env NODE_ENV=production webpack -c ${config}`;