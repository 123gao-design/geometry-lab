/* 生成桌面端全套图标（零依赖，只要 Node 自带的 zlib/fs）：
   照 public/favicon.svg 的构图 —— 渐变圆角方 + 白椭圆 + 黄折线 + 两个白点 ——
   用带符号距离场逐像素算覆盖度，任何尺寸都干净抗锯齿。

   产物（都在 src-tauri/ 下）：
     app-icon.png            1024，给 tauri icon 用的源图（以后想换图，改这里再跑一遍）
     icons/32x32.png …       tauri.conf.json 引用的 PNG 三枚
     icons/icon.ico          16/24/32/48/64 的 BMP 条目 + 256 的 PNG 条目（Vista 起认 PNG 条目）
     icons/icon.icns         ic07/ic08/ic09/ic10 四档，条目里直接包 PNG

   跑法：npm run icon   （或 node scripts/gen-icon.mjs）
   想微调设计就改下面的 DESIGN 常量，重新跑。 */
import { deflateSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* ---------- 设计（48×48 坐标系，与 favicon.svg 同一比例） ---------- */
const D = {
  rect: { x: 2, y: 2, w: 44, h: 44, r: 11 },
  grad: ['#5cadff', '#67e8f9'],     // 左上 → 右下的线性渐变
  ellipse: { cx: 24, cy: 24, rx: 15.5, ry: 9.5, w: 2.2, col: '#ffffff' },
  poly: { pts: [[17.5, 24], [24, 16.4], [30.5, 24]], w: 2.2, col: '#ffd166' },
  dots: [{ x: 17.5, y: 24, r: 2.6, col: '#ffffff' }, { x: 30.5, y: 24, r: 2.6, col: '#ffffff' }],
};
const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
// 1px 设备像素的平滑带：d≤-0.5 全在，d≥0.5 全出
const cov = d => clamp01(0.5 - d);

/** 圆角矩形 SDF（负值在内） */
function sdRoundRect(px, py, rc) {
  const cx = rc.x + rc.w / 2, cy = rc.y + rc.h / 2;
  const qx = Math.abs(px - cx) - (rc.w / 2 - rc.r);
  const qy = Math.abs(py - cy) - (rc.h / 2 - rc.r);
  const ax = Math.max(qx, 0), ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - rc.r;
}

/** 椭圆描边近似距离：按焦点比例缩出去的法向距离（图标尺寸下足够准） */
function sdEllipse(px, py, e) {
  const dx = (px - e.cx) / e.rx, dy = (py - e.cy) / e.ry;
  return (Math.hypot(dx, dy) - 1) * Math.min(e.rx, e.ry);
}

/** 点到线段的距离 */
function sdSeg(px, py, ax, ay, bx, by) {
  const ux = bx - ax, uy = by - ay;
  const t = clamp01(((px - ax) * ux + (py - ay) * uy) / (ux * ux + uy * uy));
  return Math.hypot(px - (ax + t * ux), py - (ay + t * uy));
}

/** 渲染一枚尺寸的 RGBA 缓冲（返回 Uint8Array，行主序） */
function render(size) {
  const s = size / 48;                 // 48 坐标系 → 像素
  const g0 = hex(D.grad[0]), g1 = hex(D.grad[1]);
  const out = new Uint8Array(size * size * 4);
  // 折线按两段线段取最近距离（圆头端点由线段距离自带）
  const seg = D.poly.pts.slice(0, -1).map((p, i) => [p[0], p[1], D.poly.pts[i + 1][0], D.poly.pts[i + 1][1]]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 像素中心落在 48 坐标系的哪里（+0.5 是像素中心）
      const px = (x + 0.5) / s, py = (y + 0.5) / s;
      let r = 0, g = 0, b = 0, a = 0;
      // 1) 渐变圆角方（底）
      const dRect = sdRoundRect(px, py, D.rect) * s;
      const cRect = cov(dRect);
      if (cRect > 0) {
        // SVG 的 objectBoundingBox 渐变：方向 (w,h)，t 归一到 [0,1]
        const t = clamp01(((px - D.rect.x) * D.rect.w + (py - D.rect.y) * D.rect.h) / (D.rect.w ** 2 + D.rect.h ** 2));
        r = lerp(g0[0], g1[0], t); g = lerp(g0[1], g1[1], t); b = lerp(g0[2], g1[2], t);
        a = cRect;
      }
      const over = (col, alpha) => {           // 源-over 合成（底可能有透明像素）
        if (alpha <= 0) return;
        const na = alpha + a * (1 - alpha);
        if (na > 0) {
          r = (col[0] * alpha + r * a * (1 - alpha)) / na;
          g = (col[1] * alpha + g * a * (1 - alpha)) / na;
          b = (col[2] * alpha + b * a * (1 - alpha)) / na;
          a = na;
        }
      };
      // 2) 白椭圆（描边）
      const dE = Math.abs(sdEllipse(px, py, D.ellipse) * s) - (D.ellipse.w / 2) * s;
      over(hex(D.ellipse.col), cov(dE));
      // 3) 黄折线（两段，圆头）
      let dP = Infinity;
      for (const [ax, ay, bx, by] of seg) dP = Math.min(dP, sdSeg(px, py, ax, ay, bx, by) * s);
      over(hex(D.poly.col), cov(dP - (D.poly.w / 2) * s));
      // 4) 两个白点
      for (const dt of D.dots) {
        const dD = Math.hypot(px - dt.x, py - dt.y) * s - dt.r * s;
        over(hex(dt.col), cov(dD));
      }
      const i = (y * size + x) * 4;
      out[i] = Math.round(r); out[i + 1] = Math.round(g); out[i + 2] = Math.round(b); out[i + 3] = Math.round(a * 255);
    }
  }
  return out;
}

/* ---------- PNG 编码（filter 0 + zlib，RGBA 8bit） ---------- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;                     // 8bit RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;                // filter: None
    Buffer.from(rgba.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- ICO：小尺寸 BMP 条目 + 256 的 PNG 条目 ---------- */
function icoEntryBMP(size, rgba) {
  // BITMAPINFOHEADER（40B）+ 自下而上 BGRA 行 + 全零 AND 掩码（32bpp 时仍要占位）
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);             // XOR + AND 两倍高
  header.writeUInt16LE(1, 12);                  // planes
  header.writeUInt16LE(32, 14);                 // bpp
  const row = size * 4;
  const andRow = Math.ceil(size / 32) * 4;
  const pix = Buffer.alloc(size * row);
  for (let y = 0; y < size; y++) {
    const src = (size - 1 - y) * row;           // 自下而上
    for (let x = 0; x < size; x++) {
      const si = src + x * 4, di = y * row + x * 4;
      pix[di] = rgba[si + 2]; pix[di + 1] = rgba[si + 1]; pix[di + 2] = rgba[si]; pix[di + 3] = rgba[si + 3];
    }
  }
  return Buffer.concat([header, pix, Buffer.alloc(size * andRow)]);
}
function buildICO(entries) {
  // entries: [{ size, data }]（BMP 或 PNG 均已编码好的完整条目体）
  const n = entries.length;
  const dir = Buffer.alloc(6 + n * 16);
  dir.writeUInt16LE(0, 0);                      // reserved
  dir.writeUInt16LE(1, 2);                      // type: icon
  dir.writeUInt16LE(n, 4);                      // count
  let off = 6 + n * 16;
  const bodies = [];
  entries.forEach((e, i) => {
    const d = 6 + i * 16;
    dir[d] = e.size < 256 ? e.size : 0;         // 宽（256 记 0）
    dir[d + 1] = e.size < 256 ? e.size : 0;     // 高
    dir[d + 2] = 0; dir[d + 3] = 0;             // 调色板数 / 保留
    dir[d + 4] = 1; dir[d + 5] = 0;             // planes
    dir[d + 6] = 32; dir[d + 7] = 0;            // bpp
    dir.writeUInt32LE(e.data.length, d + 8);
    dir.writeUInt32LE(off, d + 12);
    off += e.data.length;
    bodies.push(e.data);
  });
  return Buffer.concat([dir, ...bodies]);
}

/* ---------- ICNS：各档条目直接包 PNG ---------- */
function buildICNS(pairs) {
  // pairs: [[type, pngBuf], ...]
  const entries = pairs.map(([type, png]) => {
    const head = Buffer.alloc(8);
    head.write(type, 0, 'ascii');
    head.writeUInt32BE(png.length + 8, 4);
    return Buffer.concat([head, png]);
  });
  const total = entries.reduce((s, e) => s + e.length, 0) + 8;
  const head = Buffer.alloc(8);
  head.write('icns', 0, 'ascii');
  head.writeUInt32BE(total, 4);
  return Buffer.concat([head, ...entries]);
}

/* ---------- 出图 ---------- */
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const iconsDir = path.join(root, 'src-tauri', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

const pngAt = {};
for (const size of [32, 128, 256, 512, 1024]) {
  pngAt[size] = encodePNG(size, render(size));
}
fs.writeFileSync(path.join(iconsDir, '32x32.png'), pngAt[32]);
fs.writeFileSync(path.join(iconsDir, '128x128.png'), pngAt[128]);
fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), pngAt[256]);
fs.writeFileSync(path.join(root, 'src-tauri', 'app-icon.png'), pngAt[1024]);

// ICO：16–64 走 32bpp BMP（最老的办法，谁都能读），256 走 PNG 条目
const icoEntries = [16, 24, 32, 48, 64].map(s => ({ size: s, data: icoEntryBMP(s, render(s)) }));
icoEntries.push({ size: 256, data: pngAt[256] });
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), buildICO(icoEntries));

// ICNS：128 / 256 / 512 / 1024（ic10 兼作 Retina 512@2x）
fs.writeFileSync(path.join(iconsDir, 'icon.icns'), buildICNS([
  ['ic07', pngAt[128]],
  ['ic08', pngAt[256]],
  ['ic09', pngAt[512]],
  ['ic10', pngAt[1024]],
]));

console.log('图标已生成 → src-tauri/icons/（32 / 128 / 256 PNG、icon.ico、icon.icns）与 src-tauri/app-icon.png');
