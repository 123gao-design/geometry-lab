import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';

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

export default defineConfig({
  plugins: [vue(), lblWritePlugin()],
  base: './', // 构建产物可用 file:// 直接打开（配合 hash 路由，完全离线）
});
