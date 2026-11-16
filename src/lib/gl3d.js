/* ================= 三维画板的 WebGL 层（three.js） =================
   为什么有这一层：solid3d 的 SVG 画家算法只排先后、不做遮挡，曲面只能用「一组截痕环 + 两条子午线」示意，
   背面的线也照画不误；面数一多，SVG 每帧重建也吃不住。这里只把「面」交给 GPU：
   真三角形网格、深度测试、半透明壳（背面一层 + 正面一层），背面的网格线才被正面挡住。

   分工：
   - three 画曲面与它的网格线；
   - 坐标轴、金色截痕、标签、读数仍由 solid3d 的 SVG 画——它们插在 foreignObject 之后，天然压在上面；
   - 画布放进 <foreignObject>，跟着 viewBox 一起缩放，＋/－ 与 Ctrl+滚轮都不用额外同步；
   - 整层 pointer-events:none：这一层只是底图，按下、拖动必须落到 svg 上，和没有它时一模一样
     （否则手指压在曲面上时，事件被画布接走，拖不动视角）。

   视角由 solid3d 的 orbit 改同一个 cam 对象，板子每帧 B.render()，renderFn 末尾 gl.draw() 就换到新视角；
   曲面自己不接受拖动，也没法被单独拖走——转的是相机。

   取景与 solid3d.view 同一套：右向量 (−sin a, cos a, 0)、上向量 (−cos a sin b, −sin a sin b, cos b)、
   前向量 (cos a cos b, sin a cos b, sin b)；s 是每单位多少像素，正交投影不做透视，量长读角不失真。

   导出与打印：board.js 的 _svgXML() 会用 B._glSnapshot 把 foreignObject 换成一枚 <image>
   （画布像素不进 SVG 串，不换就导不出去）；打印前由本层自己把 <image> 插进实时 DOM。
   拿不到 three、或环境不给 WebGL 时 ready() 恒为 false，板子照旧走 SVG 线网，不会白屏。 */

const SVGNS = 'http://www.w3.org/2000/svg';

let threeP = null;
function loadThree() {
  if (!threeP) threeP = import('three').catch(() => null);
  return threeP;
}

/** 参数网格：fn(u, v)（u、v ∈ [0,1]）→ {x, y, z}；返回顶点与索引，法线交给 three 算 */
export function paramGrid(fn, nu, nv) {
  const pos = [];
  const idx = [];
  const id = (i, j) => j * (nu + 1) + i;
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const p = fn(i / nu, j / nv);
      pos.push(p.x, p.y, p.z);
    }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = id(i, j), b = id(i + 1, j), c = id(i, j + 1), d = id(i + 1, j + 1);
      idx.push(a, b, d, a, d, c);
    }
  }
  return { pos, idx };
}

/** 统一三角形绕向：闭合曲面让法线背离形心（形心落在体内），
 *  开放曲面（z=f(x,y) 那类，o.up）让法线朝上——正/背两趟的「哪一半在前面」才不会画反，遮挡才对。
 *  各种参数化的绕向不统一（椭球与单叶曲面就是反的），不能照抄索引顺序。 */
function orientIndex(pos, idx, o) {
  let sum = 0;
  if (o.up) {
    for (let t = 0; t < idx.length; t += 3) {
      const i0 = idx[t] * 3, i1 = idx[t + 1] * 3, i2 = idx[t + 2] * 3;
      const ax = pos[i1] - pos[i0], ay = pos[i1 + 1] - pos[i0 + 1];
      const bx = pos[i2] - pos[i0], by = pos[i2 + 1] - pos[i0 + 1];
      sum += ax * by - ay * bx;      // 三角形法向的 z 分量
    }
  } else {
    let cx = 0, cy = 0, cz = 0;
    const n = pos.length / 3;
    for (let i = 0; i < pos.length; i += 3) { cx += pos[i]; cy += pos[i + 1]; cz += pos[i + 2]; }
    cx /= n; cy /= n; cz /= n;
    for (let t = 0; t < idx.length; t += 3) {
      const i0 = idx[t] * 3, i1 = idx[t + 1] * 3, i2 = idx[t + 2] * 3;
      const ax = pos[i1] - pos[i0], ay = pos[i1 + 1] - pos[i0 + 1], az = pos[i1 + 2] - pos[i0 + 2];
      const bx = pos[i2] - pos[i0], by = pos[i2 + 1] - pos[i0 + 1], bz = pos[i2 + 2] - pos[i0 + 2];
      const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
      sum += nx * ((pos[i0] + pos[i1] + pos[i2]) / 3 - cx)
        + ny * ((pos[i0 + 1] + pos[i1 + 1] + pos[i2 + 1]) / 3 - cy)
        + nz * ((pos[i0 + 2] + pos[i1 + 2] + pos[i2 + 2]) / 3 - cz);
    }
  }
  if (sum >= 0) return idx;
  const out = idx.slice();
  for (let t = 0; t < out.length; t += 3) { const tmp = out[t + 1]; out[t + 1] = out[t + 2]; out[t + 2] = tmp; }
  return out;
}

/** 网格线按两族分开给：u 向（v 固定）一族、v 向（u 固定）一族。
 *  双曲抛物面要按族分色——它的两族直母线正是这两族参数线，画成一色就看不出「两族」了 */
function gridFamilies(fn, nu, nv) {
  const U = [], V = [];
  const put = (arr, p, q) => arr.push(p.x, p.y, p.z, q.x, q.y, q.z);
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i < nu; i++) put(U, fn(i / nu, j / nv), fn((i + 1) / nu, j / nv));
  }
  for (let i = 0; i <= nu; i++) {
    for (let j = 0; j < nv; j++) put(V, fn(i / nu, j / nv), fn(i / nu, (j + 1) / nv));
  }
  return { U, V };
}

/**
 * 给一块画板挂上 WebGL 层。cam 与 solid3d 的相机是同一个对象：orbit 拖动改 yaw/pitch 后，
 * 板子照常调 B.render()，renderFn 里再调 gl.draw() 就换到新视角。
 * opts.onReady：three 就绪时回调（板子在这里重画一次，把 SVG 线网换成网格）。
 */
export function attachGL(B, opts = {}) {
  let impl = null;
  let closed = false;
  // 画布冻住比没有还糟（看着像一张贴图，拖视角时纹丝不动），出事一律拆掉退回 SVG 线网
  const fail = (why) => {
    if (!impl) return;
    const dead = impl;
    impl = null;
    try { dead.dispose(); } catch (_) { /* 已经拆干净就算了 */ }
    console.warn('[gl3d] WebGL 层罢工，这一块板退回 SVG 线网：', why && (why.message || why));
    // 下一轮再重画：现在正处在 renderFn 里，直接回调会自己套自己
    setTimeout(() => {
      if (closed) return;
      try { (opts.onFail || (() => B.render()))(); } catch (_) { /* 板子可能已经拆了 */ }
    }, 0);
  };
  const api = {
    ready: () => !!impl,
    /** 重建几何：key 相同就跳过（orbit 每帧都 render，不能每次都重建顶点） */
    build(key, fn) {
      if (!impl) return false;
      try { return impl.build(key, fn); } catch (e) { fail(e); return false; }
    },
    draw() {
      if (!impl) return;
      try { impl.draw(); } catch (e) { fail(e); }
    },
    /** 清空曲面（关掉立体面或退回 SVG 线网时用） */
    clear() {
      if (!impl) return;
      try { impl.clear(); } catch (e) { fail(e); }
    },
    dispose() {
      closed = true;
      if (!impl) return;
      const dead = impl;
      impl = null;
      try { dead.dispose(); } catch (_) { /* 已经拆干净就算了 */ }
    },
  };
  loadThree().then((T) => {
    if (!T || impl || closed) return;
    try {
      impl = new GLBoard(T, B, Object.assign({}, opts, { onLost: fail }));
      // 板子销毁走 api 这一条路：impl 一并置空，ready() 才跟着变回 false
      B._glDispose = () => api.dispose();
      if (opts.onReady) opts.onReady();
    } catch (e) {
      impl = null;
      // 构造到一半抛错可能已经插进了 foreignObject：按这一块板清掉，别留个空壳子
      const stray = B.svg && B.svg.querySelector && B.svg.querySelector('foreignObject.gl-fo');
      if (stray && stray.parentNode) stray.parentNode.removeChild(stray);
      B._glSnapshot = null;
      B._glDispose = null;
      console.warn('[gl3d] WebGL 不可用，这一块板回退 SVG 线网：', e && e.message);
    }
  });
  return api;
}

class GLBoard {
  constructor(T, B, o) {
    this.T = T;
    this.B = B;
    this.cam = o.cam;
    this._key = null;
    this.objs = [];

    // 画布：foreignObject 铺满整块板的用户坐标，SVG 自己按 viewBox 裁切/缩放
    this.fo = document.createElementNS(SVGNS, 'foreignObject');
    this.fo.setAttribute('x', 0);
    this.fo.setAttribute('y', 0);
    this.fo.setAttribute('width', B.w);
    this.fo.setAttribute('height', B.h);
    this.fo.setAttribute('class', 'gl-fo');
    // 属性与样式都写：有的浏览器只认 foreignObject 自己的 pointer-events，
    // 压着曲面时事件才不会落在这层上（落上来就拖不动视角了）
    this.fo.setAttribute('pointer-events', 'none');
    this.fo.style.pointerEvents = 'none';
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'gl-canvas';
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
    this.fo.appendChild(this.canvas);

    this.renderer = new T.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setClearAlpha(0);
    // 上下文一丢，画布会冻在最后一帧——不重画就永远不动，认输退回线网反而是对的
    this.canvas.addEventListener('webglcontextlost', (ev) => {
      ev.preventDefault();
      if (o.onLost) o.onLost('WebGL 上下文丢失');
    });
    // 渲染器建好再插进 DOM：拿不到 WebGL 时构造会抛错，不能留下一个空的 foreignObject
    B.svg.insertBefore(this.fo, B.dyn);
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(-B.w / 2, B.w / 2, B.h / 2, -B.h / 2, -500, 500);
    // 一盏环境光打底 + 一盏从画面左上方来的主光 + 一盏背面弱补光：
    // 一圈明暗渐变，椭球的弧面、双曲面的喇叭口才立得起来
    this.scene.add(new T.AmbientLight(0xffffff, 0.95));
    const dir = new T.DirectionalLight(0xffffff, 1.9);
    dir.position.set(-3, -4, 9);
    this.scene.add(dir);
    const fill = new T.DirectionalLight(0xffffff, 0.55);
    fill.position.set(4, 3, 7);
    this.scene.add(fill);

    // 导出 PNG / 录视频：_svgXML() 会拿这个把画布换成 <image>
    B._glSnapshot = () => this.snapshot();
    // 离开页面时释放显存（WebGL 上下文有数量上限，不还给浏览器，切几页就没了）
    B._glDispose = () => this.dispose();

    this._resize();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(B.svg);
    // 缩放只改 viewBox：投影不必重算（相机按整块板取景，viewBox 只是裁切），
    // 但屏幕上放的倍数变了，画布的分辨率要跟上，否则放大后发虚
    this._mo = new MutationObserver(() => this._resize());
    this._mo.observe(B.svg, { attributes: true, attributeFilter: ['viewBox'] });

    // 打印：WebGL 画布在纸上常常一片空白，打印前把当前画面贴成 <image> 顶上去
    this._pimg = null;
    this._onBefore = () => this._armPrint(true);
    this._onAfter = () => this._armPrint(false);
    window.addEventListener('beforeprint', this._onBefore);
    window.addEventListener('afterprint', this._onAfter);
    this._armPrint(false);
  }

  /* ---------- 相机：与 solid3d.view 同一个取景 ---------- */
  _aim() {
    const { yaw, pitch, s, cx, cy, cz } = this.cam;
    const ca = Math.cos(yaw), sa = Math.sin(yaw);
    const cb = Math.cos(pitch), sb = Math.sin(pitch);
    const R = { x: -sa, y: ca, z: 0 };
    const U = { x: -ca * sb, y: -sa * sb, z: cb };
    const F = { x: ca * cb, y: sa * cb, z: sb };
    const B = this.B;
    // 画布中心（板坐标 W/2, H/2）对应的世界点：投影中心是 (cx, cy)，这里反解回来
    const a = (B.w / 2 - cx) / s;
    const b = (cy - B.h / 2) / s;
    const tx = R.x * a + U.x * b;
    const ty = R.y * a + U.y * b;
    const tz = cz + R.z * a + U.z * b;
    const dist = 80;   // 正交投影下距离只影响裁剪，不影响大小
    this.camera.position.set(tx + F.x * dist, ty + F.y * dist, tz + F.z * dist);
    this.camera.up.set(U.x, U.y, U.z);
    this.camera.lookAt(tx, ty, tz);
    const hw = B.w / (2 * s), hh = B.h / (2 * s);
    this.camera.left = -hw;
    this.camera.right = hw;
    this.camera.top = hh;
    this.camera.bottom = -hh;
    this.camera.updateProjectionMatrix();
  }

  _resize() {
    if (!this.renderer) return;
    const rect = this.B.svg.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = (rect.width || this.B.w) / this.B.w;
    // 分辨率跟着屏幕上的实际尺寸与缩放倍数走，夹在 1–2.5 倍之间，放大不发虚也不爆显存
    const k = Math.max(1, Math.min(2.5, scale * dpr * (this.B._z || 1)));
    const pw = Math.round(this.B.w * k);
    const ph = Math.round(this.B.h * k);
    if (this.canvas.width !== pw || this.canvas.height !== ph) this.renderer.setSize(pw, ph, false);
    this.draw();
  }

  draw() {
    if (!this.renderer) return;
    this._aim();
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this._key = null;
    this._clear();
    this.draw();
  }

  /* ---------- 几何 ---------- */
  build(key, fn) {
    if (this._key === key) return false;
    this._key = key;
    this._clear();
    fn((surfaceFn, o) => this._surface(surfaceFn, o));
    this.draw();
    return true;
  }

  _surface(fn, o = {}) {
    const T = this.T;
    const { pos, idx } = paramGrid(fn, o.nu || 56, o.nv || 24);
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setIndex(orientIndex(pos, idx, o));
    geo.computeVertexNormals();
    const color = new T.Color(o.color || '#5cadff');
    // 浅色纸面上同样的色相得压深一点，否则半透明的面几乎看不见（与 SVG 那套语义色映射同一个意图）
    const light = document.documentElement.classList.contains('light');
    if (light) color.multiplyScalar(0.72);
    const op = o.opacity ?? 0.52;
    const tint = color.clone().multiplyScalar(0.22);
    // 高光：有它才看得出「面在转」，不然半透明的面就是一块匀色
    const spec = new T.Color(light ? '#3a4a5e' : '#9dbfe6');
    // 先画背面（不写深度）再画正面（写深度）：透过前面能看见后面，背面的网格线又被正面挡住。
    // 正面开 polygonOffset，把面稍微推远一点，压在面上的网格线才不会和它闪动。
    const back = new T.Mesh(geo, new T.MeshPhongMaterial({
      color, transparent: true, opacity: op * 0.5, side: T.BackSide, depthWrite: false,
      emissive: tint, shininess: 26, specular: spec,
    }));
    const front = new T.Mesh(geo, new T.MeshPhongMaterial({
      color, transparent: true, opacity: op, side: T.FrontSide, depthWrite: true,
      emissive: tint, shininess: 34, specular: spec,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    }));
    back.renderOrder = 0;
    front.renderOrder = 1;
    this.scene.add(back, front);
    this.objs.push(back, front);

    if (o.wire !== false) {
      const { U, V } = gridFamilies(fn, o.wu || 12, o.wv || 6);
      const c1 = o.wireColor || o.color || '#5cadff';
      const c2 = o.wireColor2 || c1;
      const op = o.wireOpacity ?? 0.42;
      // 背面那半张网格垫在壳子底下（不吃深度）：透过半透明的面隐约看得见，球面才有经纬纹理；
      // 正面那张照旧吃深度，被正面挡住的背面线段不画，才分得清「前」与「后」
      if (o.wireBack) {
        this._wire(U, c1, o.wireBack, 0.5, false);
        this._wire(V, c2, o.wireBack, 0.5, false);
      }
      this._wire(U, c1, op, 2, true);
      this._wire(V, c2, op, 2, true);
    }
    return { mesh: front, geo };
  }

  /** 网格线一趟：segs 是 [x1,y1,z1, x2,y2,z2, …]；depth=false 的那趟不吃深度（垫在面底下） */
  _wire(segs, color, op, order, depth) {
    if (!segs.length) return;
    const T = this.T;
    const lg = new T.BufferGeometry();
    lg.setAttribute('position', new T.Float32BufferAttribute(segs, 3));
    const ln = new T.LineSegments(lg, new T.LineBasicMaterial({
      color, transparent: true, opacity: op, depthTest: depth, depthWrite: false,
    }));
    ln.renderOrder = order;
    this.scene.add(ln);
    this.objs.push(ln);
  }

  _clear() {
    for (const ob of this.objs) {
      this.scene.remove(ob);
      if (ob.geometry) ob.geometry.dispose();
      if (ob.material) ob.material.dispose();
    }
    this.objs = [];
  }

  /* ---------- 导出与打印 ---------- */
  snapshot() {
    // 没开 preserveDrawingBuffer（省显存、省每帧拷贝），所以先重画再读：同一个任务里读才拿得到像素
    try { this.draw(); return this.canvas.toDataURL('image/png'); } catch (_) { return ''; }
  }

  _armPrint(on) {
    if (!this.fo || !this.canvas) return;
    try {
      if (on) {
        if (this._pimg) return;
        const url = this.snapshot();
        if (!url) return;
        const img = document.createElementNS(SVGNS, 'image');
        img.setAttribute('x', 0);
        img.setAttribute('y', 0);
        img.setAttribute('width', this.B.w);
        img.setAttribute('height', this.B.h);
        img.setAttribute('href', url);
        img.setAttribute('class', 'gl-print');
        this.fo.parentNode.insertBefore(img, this.fo.nextSibling);
        this.fo.style.display = 'none';
        this._pimg = img;
      } else if (this._pimg) {
        this.fo.style.display = '';
        if (this._pimg.parentNode) this._pimg.parentNode.removeChild(this._pimg);
        this._pimg = null;
      }
    } catch (_) { /* 打印是尽力而为，失败就按原样印 */ }
  }

  dispose() {
    try {
      window.removeEventListener('beforeprint', this._onBefore);
      window.removeEventListener('afterprint', this._onAfter);
      if (this._ro) this._ro.disconnect();
      if (this._mo) this._mo.disconnect();
      this._clear();
      if (this.renderer) this.renderer.dispose();
      if (this.fo && this.fo.parentNode) this.fo.parentNode.removeChild(this.fo);
      this.B._glSnapshot = null;
      this.B._glDispose = null;
      this.renderer = null;
    } catch (_) { /* 已经拆干净就算了 */ }
  }
}
