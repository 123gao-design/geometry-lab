/* 物理实验室的公共绘图件：取主题色、世界坐标 → 屏幕坐标的相机、网格与文字。
   实验模块都是框架无关的纯 JS，只拿一个 canvas 2D 上下文与宽高，不碰 Vue。 */

/** 从站点 CSS 变量里取一套颜色，主题切换后重新取一次即可。
    给了 el 就再从画板容器上读一组「纸面皮肤」的 --pb-*：外壳把令牌写在板容器上，
    CSS 自定义属性会往下继承，所以传画布所在的宿主元素即可。没给或没声明时退回主题色，
    实验模块拿到的 pal 里因此总有这七个键，不必到处判空。 */
export function readPal(el) {
  let cs = null;
  try { cs = getComputedStyle(document.documentElement); } catch (e) { cs = null; }
  const v = k => (cs && cs.getPropertyValue(k).trim()) || '#888';
  let bs = null;
  try { bs = el && el.nodeType === 1 ? getComputedStyle(el) : null; } catch (e) { bs = null; }
  const p = (k, fb) => (bs && bs.getPropertyValue(k).trim()) || fb;
  return {
    /* 墨色与语义色一律先问画板自己（--pb-*），问不到才退回主题根上的 --ink / --blue …
       纸面可以单独换（浅纸配深墨、深纸配浅墨），主题却仍是暗色时，按根上那套取色
       会把字画糊、把曲线画淡；与「跟随主题」档一样，host 上没有这条 --pb-* 就走后面 */
    ink: p('--pb-ink', v('--ink')),
    mut: p('--pb-mut', v('--mut')),
    faint: p('--pb-faint', v('--faint')),
    line: p('--pb-line', v('--line')),
    blue: p('--pb-blue', v('--blue')),
    orange: p('--pb-orange', v('--orange')),
    green: p('--pb-green', v('--green')),
    purple: p('--pb-purple', v('--purple')),
    pink: p('--pb-pink', v('--pink')),
    cyan: p('--pb-cyan', v('--cyan')),
    card: p('--pb-card', v('--card')),
    /* bg2 在画布里的用法一律是「板底色」——spot 的环形缺口、被打穿背景的
       物块 / 电阻 / 纸带都拿它填。纸面皮肤上线后板底不再是 --bg2，这里跟着
       指到 --pb-paper，老模块不用逐个改也贴得严丝合缝。 */
    bg2: p('--pb-paper', v('--bg2')),
    /* 纸面皮肤：底色、方格线、细框，与一组双色强调
       （indigo 留给图形、轨迹与力，sienna 留给运动物体与电流） */
    paper: p('--pb-paper', v('--bg2')),
    grid: p('--pb-grid', 'rgba(140,160,190,.13)'),
    rule: p('--pb-rule', v('--line')),
    indigo: p('--pb-indigo', v('--blue')),
    sienna: p('--pb-sienna', v('--orange')),
    graphite: p('--pb-graphite', v('--mut')),
    alert: p('--pb-alert', v('--pink')),
  };
}

/* 外壳的缩放与平移：z 是缩放倍数，x / y 是整幅画面的屏幕像素位移（世界原点与图形都不动，
   全在相机里叠），所以各实验的绘制代码不用为缩放写任何分支。 */
export const VIEW = { z: 1, x: 0, y: 0 };
export function resetView() { VIEW.z = 1; VIEW.x = 0; VIEW.y = 0; }

/** 世界坐标范围 → 屏幕坐标：等比缩放并居中，四周留 pad 比例的边；
    再叠加 VIEW（o.fixed 为真时忽略，留给不跟随视野的小图）。 */
export function camera2d(w, h, xmin, xmax, ymin, ymax, pad = 0.06, o) {
  const v = o && o.fixed ? { z: 1, x: 0, y: 0 } : VIEW;
  const s = Math.min(w / (xmax - xmin), h / (ymax - ymin)) * (1 - pad) * v.z;
  const sx = w / 2 + v.x - ((xmin + xmax) / 2) * s;
  const sy = h / 2 + v.y + ((ymin + ymax) / 2) * s;
  return {
    s, sx, sy,
    X: x => sx + x * s,
    Y: y => sy - y * s,
    wx: px => (px - sx) / s,
    wy: py => (sy - py) / s,
    len: n => n / s,
  };
}

/** 铺一层淡网格，step 是世界坐标里的间距 */
export function grid2d(ctx, cam, w, h, step = 1, color = '#8882') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const wx0 = Math.floor(cam.wx(0) / step) * step;
  const wx1 = cam.wx(w);
  for (let x = wx0; x <= wx1; x += step) {
    const px = Math.round(cam.X(x)) + 0.5;
    ctx.moveTo(px, 0); ctx.lineTo(px, h);
  }
  const wy1 = Math.ceil(cam.wy(0) / step) * step;
  const wy0 = cam.wy(h);
  for (let y = wy0; y <= wy1; y += step) {
    const py = Math.round(cam.Y(y)) + 0.5;
    ctx.moveTo(0, py); ctx.lineTo(w, py);
  }
  ctx.stroke();
  ctx.restore();
  return { x0: cam.X(0), y0: cam.Y(0) };
}

/** 带一点底色的圆点 */
export function dot(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/* 板内文字可以拖动：与数学画板同一条习惯——标注重叠时按住在画面里挪开，双击复原。
   每一帧画标签时把它的框登记进 LBL.frame，外壳拿指针坐标（已去掉缩放平移）去命中；
   偏移记的是**相对自然位置的位移**，单位是绘制坐标，所以缩放后标签仍跟着图形走。
   键是「演示名#本帧第几个标签」：同一台演示每帧的绘制次序固定，重画后偏移照样带着走；
   刻度数字（12px）不登记，免得按住画面平移时误抓到一枚序号。 */
export const LBL = { g: '', n: 0, frame: [], off: {} };

/** 外壳在每帧调 frame() 之前调一次：换演示名、序号归零、清掉上一帧的框 */
export function lblBegin(g) {
  LBL.g = g || '';
  LBL.n = 0;
  LBL.frame.length = 0;
}

export const lblKey = i => LBL.g + '#' + i;

/** 命中最上面的那个标签（后画的压在上面），x / y 是绘制坐标 */
export function lblAt(x, y) {
  const f = LBL.frame;
  for (let i = f.length - 1; i >= 0; i--) {
    const b = f[i];
    if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) return b;
  }
  return null;
}

/* ── 画板字与线的粗细（2026-11-20 用户「线条太细」「公式符号数字用 LaTeX 渲染」
   「增加 board 中字体的设置」） ─────────────────────────────────────────
   INK 是外壳灌进来的三个倍率，演示模块不用知道有这回事：
   · font —— 所有 label() 的字号乘它；
   · lw   —— 包装后的 ctx 在写 lineWidth 时乘它（arrow / poly / 各演示的硬编码值一并放大）；
   · axis —— 只给 axes.js 的坐标轴用，取绝对宽度（换算见该文件的注释）。
   换值时不用重搭演示，下一帧画出来就是新粗细。 */
export const INK = { font: 1, lw: 1, axis: 1 };

const nn = (v, a, b, dflt) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(b, Math.max(a, n)) : dflt;
};

/** 外壳在挂载时与偏好变动时各调一次 */
export function setInkStyle(o = {}) {
  INK.font = nn(o.font, 0.8, 1.6, 1);
  INK.lw = nn(o.lw, 0.6, 2.5, 1);
  INK.axis = nn(o.axis, 0.6, 3, 1);
}

/* 坐标网格用没用（axes.js 的 panel 每画一块就记一次）：外壳每帧先清零、画完再看，
   「自动」档靠它决定这一帧要不要把纸面方格收起来，免得两种网格叠在一起互相咬 */
export const GRIDUSE = { n: 0 };
export const gridBegin = () => { GRIDUSE.n = 0; };
export const gridUsed = () => GRIDUSE.n > 0;
export const gridMark = () => { GRIDUSE.n++; };

/* KaTeX 的字族（main.css 全局已引入）：数字与公式用衬线数学体，变量字母用
   KaTeX_Math 的斜体，带汉字的标签仍走系统无衬线——KaTeX 字族没有汉字字形 */
const UI_FONT = 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
const MATH_FONT = '"KaTeX_Main", "Latin Modern Math", "Times New Roman", serif';
const MATH_VAR_FONT = '"KaTeX_Math", "KaTeX_Main", "Times New Roman", serif';
const HAS_CJK = /[⺀-鿿豈-﫿＀-￯]/;
const ONE_VAR = /^[A-Za-zͰ-Ͽ]$/;

const LETTER_RE = /[A-Za-zͰ-Ͽ]/;
const LATIN_RE = /[A-Za-z]/;

/* 上下标：Unicode 的 ₀ ₁ ² 与 ^{…} / _{…} 标记都排成小一号、抬高或压低，
   画布上的公式因此有真正的指数与下标，而不是整条挤在同一行 */
const SUB_MAP = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '₊': '+', '₋': '−', '₌': '=', '₍': '(', '₎': ')', 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x',
};
const SUP_MAP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '−', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁿ': 'n',
};

/* 排正体的字母串：函数名与常数。别的一连串字母按 LaTeX 的规矩拆成一个个斜体变量
   （gt² 是 g·t 的平方，不是一个单词；sinθ 里 sin 要正体、θ 要斜体） */
const UP_WORDS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'ln', 'log', 'lg', 'exp', 'lim', 'max', 'min', 'det', 'const',
]);

/* 先把上下标标记展开成一串 { c: 字符, lv: -1 下标 / 0 常规 / 1 上标 } */
function scriptTokens(text) {
  const out = [];
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if ((ch === '^' || ch === '_') && k + 1 < text.length) {
      const lv = ch === '^' ? 1 : -1;
      if (text[k + 1] === '{') {
        const end = text.indexOf('}', k + 2);
        if (end > k + 1) {
          for (const c of text.slice(k + 2, end)) out.push({ c, lv });
          k = end;
          continue;
        }
      } else if (!/\s/.test(text[k + 1])) {
        out.push({ c: text[k + 1], lv });
        k += 1;
        continue;
      }
    }
    if (SUB_MAP[ch]) { out.push({ c: SUB_MAP[ch], lv: -1 }); continue; }
    if (SUP_MAP[ch]) { out.push({ c: SUP_MAP[ch], lv: 1 }); continue; }
    out.push({ c: ch, lv: 0 });
  }
  return out;
}

/* 一个字符归哪一族：汉字 → 系统无衬线；字母 → 函数名与常数正体、其余按斜体变量
   （希腊字母一律按变量）；数字、单位、运算符 → 数学正体 */
function classify(toks) {
  const kinds = new Array(toks.length);
  for (let k = 0; k < toks.length; k++) {
    const c = toks[k].c;
    if (HAS_CJK.test(c)) { kinds[k] = 'cjk'; continue; }
    if (!LATIN_RE.test(c)) { kinds[k] = LETTER_RE.test(c) ? 'var' : 'math'; continue; }
    let a = k, b = k;
    while (a > 0 && LATIN_RE.test(toks[a - 1].c)) a--;
    while (b < toks.length - 1 && LATIN_RE.test(toks[b + 1].c)) b++;
    let word = '';
    for (let j = a; j <= b; j++) word += toks[j].c;
    kinds[k] = UP_WORDS.has(word.toLowerCase()) ? 'math' : 'var';
  }
  return kinds;
}

function fontFor(kind, size) {
  if (kind === 'cjk') return size + 'px ' + UI_FONT;
  if (kind === 'var') return size + 'px ' + MATH_VAR_FONT;
  return size + 'px ' + MATH_FONT;
}

/* 把整条标签切成「字族 + 上下标档」相同的连续几段：「速度 v = 2.0 m/s」→
   [汉字段][空格 v = 2.0 m/s 段]，逐段换字体依次填过去；下标段字号 0.7 倍、
   基线压低 0.2 字高，上标抬高 0.36 字高，排出来和正文里的 KaTeX 是一路样子 */
function runsOf(text, size) {
  const toks = scriptTokens(text);
  const kinds = classify(toks);
  const out = [];
  for (let k = 0; k < toks.length; k++) {
    const tk = toks[k];
    const kind = kinds[k];
    const fs = tk.lv ? Math.round(size * 0.7 * 10) / 10 : size;
    const key = kind + '|' + tk.lv;
    const last = out[out.length - 1];
    if (last && last.key === key) last.s += tk.c;
    else out.push({
      key, kind, s: tk.c, font: fontFor(kind, fs),
      dy: tk.lv > 0 ? -size * 0.36 : tk.lv < 0 ? size * 0.2 : 0,
    });
  }
  return out;
}

/* 量一条标签在画布上的宽度（按 label() 的同一套切段规则），图例与批注排版要用 */
export function textWidth(ctx, text, size = 15) {
  const sz = Math.round(size * INK.font * 10) / 10;
  const runs = runsOf(String(text), sz);
  let w = 0;
  ctx.save();
  for (const r of runs) { ctx.font = r.font; w += ctx.measureText(r.s).width; }
  ctx.restore();
  return w;
}

/* canvas 用的是网页字体，先让浏览器把两族拉下来；没拉到时退回衬线，画面不会空 */
try {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
    document.fonts.load('16px "KaTeX_Main"');
    document.fonts.load('16px "KaTeX_Math"');
  }
} catch (e) { /* 字体服务不可用就算了 */ }

/** 包一层：所有 lineWidth 赋值乘 INK.lw。演示模块 500 多处硬编码的线宽因此一起变粗，
    不用逐个改；save / restore 存的是乘过的值，恢复回去仍然是同一套粗细。
    （axes.js 想要「绝对」的轴宽时自己除掉这个倍率，见那边注释） */
export function inkCtx(raw) {
  if (!raw || raw.__ink) return raw;
  const fns = new Map();
  return new Proxy(raw, {
    get(t, k) {
      if (k === '__ink') return true;
      if (k === 'lineWidth') return t.lineWidth;
      const v = t[k];
      if (typeof v !== 'function') return v;
      let f = fns.get(k);
      if (!f) { f = v.bind(t); fns.set(k, f); }
      return f;
    },
    set(t, k, v) {
      if (k === 'lineWidth') {
        const n = Number(v);
        t.lineWidth = Number.isFinite(n) ? n * INK.lw : v;
        return true;
      }
      t[k] = v;
      return true;
    },
  });
}

/** 小字标签：左对齐或居中都走这里。
    不叠描边光晕——中文与数字被 3px 的黑边一包，笔画首尾咬在一起，整行看着发糊；
    画板底色本来就淡，直接填色就够清楚。坐标落在半像素格上，DPR 缩放下字缘不发灰。
    默认 15px：画框铺满窗口后 13px 看上去仍偏小，读数与量值一律走这个尺寸。
    字号再乘 INK.font（设置页 / 板内「▦ 纸面」都能调）；没有汉字的走 KaTeX 字族，
    数字、单位、公式与正文里的 KaTeX 是同一副衬线样子。 */
export function label(ctx, text, x, y, color, align = 'left', size = 15) {
  const i = LBL.n++;
  const o = LBL.off[lblKey(i)];
  const str = String(text);
  const px = Math.round((x + (o ? o[0] : 0)) * 2) / 2;
  const py = Math.round((y + (o ? o[1] : 0)) * 2) / 2;
  const sz = Math.round(size * INK.font * 10) / 10;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  // 汉字与公式各用各的字族，逐段量宽再逐段填，整条仍按 align 对齐
  const runs = runsOf(str, sz);
  const ws = [];
  let tw = 0;
  for (const r of runs) {
    ctx.font = r.font;
    const w = ctx.measureText(r.s).width;
    ws.push(w);
    tw += w;
  }
  const x0 = align === 'center' ? px - tw / 2 : align === 'right' ? px - tw : px;
  let cur = x0;
  for (let k = 0; k < runs.length; k++) {
    ctx.font = runs[k].font;
    ctx.fillText(runs[k].s, cur, py + runs[k].dy);
    cur = Math.round((cur + ws[k]) * 2) / 2;
  }
  if (LBL.g && size >= 13) {
    LBL.frame.push({
      i, key: lblKey(i), text: str,
      x0: x0 - 3, y0: py - sz * 0.74, x1: x0 + tw + 3, y1: py + sz * 0.74,
    });
  }
  ctx.restore();
}

/** 箭头（速度、力向量用） */
export function arrow(ctx, x1, y1, x2, y2, color, width = 2) {
  const dx = x2 - x1, dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  if (L < 1) return;
  const ux = dx / L, uy = dy / L;
  const head = Math.min(14, L * 0.4);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * head * 0.7, y2 - uy * head * 0.7); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ux * head - uy * head * 0.45, y2 - uy * head + ux * head * 0.45);
  ctx.lineTo(x2 - ux * head + uy * head * 0.45, y2 - uy * head - ux * head * 0.45);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** 从世界坐标 (x, y) 画一根世界向量 (vx, vy) 乘 k；返回箭头末端的屏幕坐标，便于挂标签 */
export function vec(ctx, cam, x, y, vx, vy, k, color, width = 2.5) {
  const x2 = cam.X(x + vx * k), y2 = cam.Y(y + vy * k);
  arrow(ctx, cam.X(x), cam.Y(y), x2, y2, color, width);
  return { x: x2, y: y2 };
}

/** 指针是否停在世界坐标 (x, y) 附近，r 用世界单位给 */
export function hover(ui, cam, x, y, r) {
  if (!ui || !ui.in) return false;
  return Math.hypot(cam.wx(ui.x) - x, cam.wy(ui.y) - y) <= r;
}

/** 分析图层要不要画：开关常显，或指针停在物体上 */
export function showInfo(ui, onObject) {
  return !!ui && (!!ui.always || !!onObject);
}

/** 悬停定格：开了这一档且指针停在这个物体上，调用方就把这一帧的 step 置 0 */
export function holdFor(ui, onObject) {
  return !!ui && !!ui.hold && !!onObject;
}

/** 物体大小倍率：右下「物体」滑块给的 0.5–1.8，乘在各实验的刚体几何上。
    几何同时进碰撞体与密度，所以倍率一变，模块要重搭一次世界。 */
export function objScale(ui) {
  const v = ui && ui.scale;
  return Number.isFinite(v) ? clamp(v, 0.5, 1.8) : 1;
}


export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const fmt = (v, n = 2) => (Number.isFinite(v) ? v.toFixed(n) : '—');
