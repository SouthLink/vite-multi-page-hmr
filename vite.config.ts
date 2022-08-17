import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vitePluginImp from 'vite-plugin-imp';

const ASSET_URL = 'https://localhost:3009';

const pathResolve = (p: string) => {
  return path.join(__dirname, p)
}
const { SERVER_ENV } = process.env;
const lessUrl = `https://img.${
    SERVER_ENV === "development" ? "dev." : SERVER_ENV === "test" ? "test." : ""
}8891.com.tw/next`;

const resolveExternalsPlugin = require('vite-plugin-resolve-externals');

export default defineConfig({
  define: {
    global: {},
    'process.env': {
      SERVER_ENV: 'development'
    },
  },
  plugins: [
    react(),
    resolveExternalsPlugin({
      $: 'jquery'
    }),
    vitePluginImp({
      optimize: true,
      libList: [
        {
          libName: 'antd',
          libDirectory: 'es',
          style: (name) => `antd/es/${name}/style`
        }
      ]
    })
  ],
  resolve: {
    alias: [
      { find: /^~@Styles/, replacement: path.resolve('styles') },
      { find: '@Components', replacement: pathResolve('components') },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.php'],
  },
  base: `${ASSET_URL}/dist/`,
  server: {
    strictPort: true,
    port: 3009,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hmr: {
      host: 'localhost',
      port: 3009,
      protocol: 'ws',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@url': `"${lessUrl}"`,
        },
      },
    },
  },
  build: {
    manifest: true,
    emptyOutDir: true,
    outDir: path.resolve(__dirname, 'public/dist'),
    rollupOptions: {
      external: ['jquery'],
      input: {
        index: './app.tsx',
      },
    },
  },
});
