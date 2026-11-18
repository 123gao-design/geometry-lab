import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* 默认文字位置文件的写入接口（只在 dev 服务器上生效）：
   POST /__lbl-write  { path: 'public/xxx.json', data: {...} }
   只允许写 public/ 下的 .json，路径不许越界；构建产物没有这个接口，设置页会退成下载文件。 */
function lblWritePlugin() {
  return {
    name: 'gl-lbl-write',
    configureServer(server) {
      server.middlewares.use('/__lbl-write', (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code;
          res.setHeader('content-type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(obj));
        };
        if (req.method !== 'POST') return send(405, { ok: false, error: '只接受 POST' });
        let body = '';
        req.on('data', c => {
          body += c;
          if (body.length > 4 * 1024 * 1024) req.destroy();
        });
        req.on('end', () => {
          try {
            const { path: raw, data } = JSON.parse(body || '{}');
            const rel = String(raw || '').replace(/\\/g, '/').replace(/^\.?\//, '');
            if (!/^public\/.+\.json$/i.test(rel) || rel.includes('..')) {
              throw new Error('路径必须写成 public/<名字>.json，且不能越出项目目录');
            }
            if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('内容必须是对象');
            const root = process.cwd();
            const pub = path.resolve(root, 'public');
            const abs = path.resolve(root, rel);
            if (!abs.startsWith(pub + path.sep)) throw new Error('路径越界');
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            fs.writeFileSync(abs, JSON.stringify(data, null, 2) + '\n', 'utf8');
            send(200, { ok: true, path: rel.replace(/^public\//, '') });
          } catch (e) {
            send(400, { ok: false, error: e.message || String(e) });
          }
        });
      });
    },
  };
}

/* 画板总数：关于页显示「N 块画板」。这个数在配置期数一遍 src/boards 就够——
   若改成前端 import.meta.glob，412 个画板模块会被挂进构建图：它们平时是各章 view 静态 import 的，
   再动态 import 一次，Rollup 就会把每个画板单独拆成一块 chunk，章页反倒多出几百个请求。 */
function countBoards(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) n += countBoards(p);
    else if (e.isFile() && e.name.endsWith('.js')) n++;
  }
  return n;
}
const BOARD_COUNT = countBoards(fileURLToPath(new URL('./src/boards', import.meta.url)));

export default defineConfig({
  plugins: [vue(), lblWritePlugin()],
  base: './', // 构建产物可用 file:// 直接打开（配合 hash 路由，完全离线）
  define: {
    __GL_BOARD_COUNT__: String(BOARD_COUNT), // 关于页的画板数，构建期定值
  },
  build: {
    rollupOptions: {
      output: {
        /* 三块几乎不变的大依赖单独成文件：
           - vue/vue-router 与 katex 各自一个 chunk，浏览器缓存能一直用着，改业务代码不必重下；
           - katex 单列还顺带解决另一件事：首屏只有 lib/mdmini.js 用动态 import 摸它，
             其余都是懒路由里的静态 import，分出来后入口不再静态背着它，首页不必等公式引擎。 */
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router'],
          katex: ['katex'],
        },
      },
    },
  },
});
