import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import packageJson from './package.json';

const distPath = process.env.EE_DIST_PATH
  ? path.join(process.env.EE_DIST_PATH, packageJson.name) : './dist';
const port = Number(process.env.EE_PORT_2) || 9527;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '',
  server: {
    port: port,
  },
  build: {
    outDir: distPath,
  }
})
