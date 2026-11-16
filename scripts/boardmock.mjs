/* 无头画板测试的最小 DOM mock 与断言工具（放在仓库内，/tmp 在本机不可用）。
   用法：
     import { install, rootEl, chips, chipVal, inputs, btns, setSlider, click, audit, chk, done } from './boardmock.mjs';
     install();                       // 装好 document / window / localStorage / rAF
     const mod = await import('../src/boards/<模块>/<子专题>/<板>.js');
     const B = mod.createBoard(rootEl());   // 构造 → 断言徽章 → 拖滑块 → 再断言 → audit
   约定：mock 的 textContent 是普通属性、innerHTML 另存一处，所以 chipM/btnM 的「源串镜像」得以保留，
   徽章标签与读数一律按 tex 源串比对（`\\infty` 而不是 ∞）。 */

const svgAttrs = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'width', 'height', 'rx', 'ry', 'fx', 'fy', 'opacity', 'fill-opacity', 'stroke-width'];

export function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(),
    attrs: {},
    children: [],
    parent: null,
    listeners: {},
    style: {},
    dataset: {},
    _value: '',
    _innerHTML: '',
    textContent: '',
    setAttribute(k, v) {
      this.attrs[k] = String(v);
      if (k === 'value') this._value = String(v);
    },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    hasAttribute(k) { return k in this.attrs; },
    appendChild(c) { c.parent = this; this.children.push(c); return c; },
    removeChild(c) {
      const i = this.children.indexOf(c);
      if (i >= 0) this.children.splice(i, 1);
      c.parent = null;
      return c;
    },
    insertBefore(c) { return this.appendChild(c); },
    addEventListener(t, fn) { (this.listeners[t] || (this.listeners[t] = [])).push(fn); },
    removeEventListener(t, fn) {
      const a = this.listeners[t] || [];
      const i = a.indexOf(fn);
      if (i >= 0) a.splice(i, 1);
    },
    dispatchEvent(ev) { for (const fn of (this.listeners[ev.type] || []).slice()) fn(ev); return true; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 800, height: 450, right: 800, bottom: 450 }; },
    setPointerCapture() {},
    releasePointerCapture() {},
    focus() {},
    blur() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
  };
  Object.defineProperties(el, {
    className: {
      get() { return el.attrs.class || ''; },
      set(v) { el.attrs.class = String(v); },
    },
    innerHTML: {
      get() { return el._innerHTML; },
      set(v) {
        el._innerHTML = String(v);
        if (el._innerHTML === '') el.children.length = 0;   // root.innerHTML = ''（destroy）要真清空
      },
    },
    value: {
      get() { return el._value; },
      set(v) { el._value = String(v); },
    },
  });
  const has = n => (el.attrs.class || '').split(/\s+/).includes(n);
  const set = (n, on) => {
    const a = (el.attrs.class || '').split(/\s+/).filter(x => x && x !== n);
    if (on) a.push(n);
    el.attrs.class = a.join(' ');
  };
  el.classList = {
    add(...ns) { ns.forEach(n => set(n, true)); },
    remove(...ns) { ns.forEach(n => set(n, false)); },
    contains: has,
    toggle(n, force) { const on = force === undefined ? !has(n) : !!force; set(n, on); return on; },
  };
  return el;
}

export function install() {
  const docEl = makeEl('html');
  const store = new Map();
  globalThis.document = {
    documentElement: docEl,
    body: makeEl('body'),
    head: makeEl('head'),
    createElement: makeEl,
    createElementNS: (ns, tag) => makeEl(tag),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.window = {
    innerWidth: 1440,
    innerHeight: 900,
    devicePixelRatio: 1,
    addEventListener() {},
    removeEventListener() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  };
  globalThis.location = { hash: '#/', href: 'http://localhost/#/' };
  globalThis.history = { replaceState() {}, pushState() {} };
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear(),
  };
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' });
  return docEl;
}

export const rootEl = () => makeEl('div');

/* ---------- 从画板根节点取控件 ---------- */
function allEls(el, out = []) {
  for (const c of el.children) { out.push(c); allEls(c, out); }
  return out;
}
export const chips = root => {
  const row = root.children[2];
  return row ? row.children.map(c => ({
    label: (c.children[0] ? c.children[0].textContent : '').trim(),
    value: (c.children[1] ? c.children[1].textContent : ''),
    cls: c.className,
  })) : [];
};
/** 按标签前缀取徽章读数（tex 源串原样返回；找不到返回 undefined）
 *  chipM 对含 '$' 的标签把整串（含 $）写进 textContent 作源串镜像，
 *  所以前缀比对两种写法都认：'商 $q$' 认 '商'，'$d=\\gcd(a,m)$' 认 'd=\\gcd'（去 $ 后再比）。 */
export const chipVal = (root, prefix) => {
  const c = chips(root).find(x => x.label.startsWith(prefix) || x.label.replace(/\$/g, '').startsWith(prefix));
  return c ? c.value : undefined;
};
export const inputs = root => allEls(root.children[1] || makeEl('div')).filter(e => e.tagName === 'INPUT');
export const btns = root => allEls(root.children[1] || makeEl('div')).filter(e => e.tagName === 'BUTTON');
/** 按按钮文字（textContent 前缀）取按钮，找不到返回 undefined */
export const btn = (root, prefix) => btns(root).find(b => String(b.textContent).startsWith(prefix));
export const setSlider = (input, v) => { input.value = v; input.dispatchEvent({ type: 'input' }); return input; };
export const click = b => { b.dispatchEvent({ type: 'click' }); return b; };
/** 模拟拖把手：按 viewBox 坐标给 client 坐标，走 pointerdown → pointermove → pointerup */
export const dragHandle = (B, i, x, y) => {
  const h = B.handles[i];
  if (!h) return false;
  const rect = B.svg.getBoundingClientRect();
  const p0 = h.st.get();
  const ev = (type, X, Y) => ({
    type, pointerId: 1, preventDefault() {},
    clientX: X / B.w * rect.width, clientY: Y / B.h * rect.height,
  });
  h.c.dispatchEvent(ev('pointerdown', p0.x, p0.y));
  h.c.dispatchEvent(ev('pointermove', x, y));
  h.c.dispatchEvent(ev('pointerup', x, y));
  return true;
};
export const V = (x, y) => ({ x, y });

/* ---------- NaN 坐标审计 ---------- */
export function audit(root, name = '') {
  const bad = [];
  const walk = el => {
    for (const k of svgAttrs) {
      if (k in el.attrs) {
        const n = Number(el.attrs[k]);
        if (!Number.isFinite(n)) bad.push(`<${el.tagName} ${k}="${el.attrs[k]}">`);
      }
    }
    for (const k of ['d', 'points']) {
      const v = el.attrs[k];
      if (typeof v === 'string' && /NaN|undefined|Infinity/.test(v)) bad.push(`<${el.tagName} ${k}=…${v.slice(0, 60)}…>`);
    }
    el.children.forEach(walk);
  };
  walk(root);
  return bad.map(s => (name ? `[${name}] ` : '') + s);
}

/* ---------- 断言 ---------- */
const results = { pass: 0, fail: 0, fails: [] };
export function chk(cond, msg) {
  if (cond) { results.pass++; return true; }
  results.fail++;
  results.fails.push(msg);
  console.log('  ✗ ' + msg);
  return false;
}
export function done(title = 'numtheory') {
  console.log(`\n${title}：${results.pass} 通过 / ${results.fail} 失败，共 ${results.pass + results.fail} 项`);
  if (results.fail) {
    console.log('\n失败清单：');
    results.fails.forEach(s => console.log('  - ' + s));
    process.exitCode = 1;
  }
  return results.fail === 0;
}
