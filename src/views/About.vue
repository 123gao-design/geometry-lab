<template>
  <div class="about">
    <div class="chapter-head">
      <h1>关于本站</h1>
      <p class="sub">把中学与大学数学的结论做成能拖、能读数的画板，配逐步推导。单机运行，数据留在本机。</p>
    </div>

    <section class="hero">
      <div class="hero-id">
        <svg class="logo" viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id="abg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#5cadff" /><stop offset="1" stop-color="#67e8f9" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#abg)" />
          <ellipse cx="24" cy="24" rx="15.5" ry="9.5" fill="none" stroke="#fff" stroke-width="2.2" />
          <path d="M17.5 24 L24 16.4 L30.5 24" fill="none" stroke="#ffd166" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="17.5" cy="24" r="2.6" fill="#fff" />
          <circle cx="30.5" cy="24" r="2.6" fill="#fff" />
        </svg>
        <div>
          <b class="hero-name">Geometry Lab</b>
          <span class="hero-by">designed by CuoJue</span>
        </div>
      </div>
      <p class="hero-txt">
        每一章先给一块可以拖动的画板：参数落在滑块上，读数跟着几何事实实时变化，
        结论先在图上看见，再用 KaTeX 排的推导写清楚。
        全部讲义、速查与小工具都打包在这一个静态站点里，断网也能用。
      </p>
      <div class="hero-stats">
        <div><b>{{ modCount }}</b><span>个学习模块</span></div>
        <div><b>{{ chapCount }}</b><span>章讲义</span></div>
        <div><b>{{ boardCount }}</b><span>块交互画板</span></div>
      </div>
    </section>

    <section class="blk">
      <h2>内容范围</h2>
      <p class="blk-sub">两个阶段、{{ modCount }} 个模块：初等部分是高中主线，高等部分从一元微积分排到抽象代数。</p>
      <div class="chip-groups">
        <div class="chip-row">
          <span class="chip-tag">一 · 初等数学</span>
          <router-link v-for="s in elementary" :key="s" class="chip" :to="'/' + s">{{ MODULES[s].t }}</router-link>
        </div>
        <div class="chip-row">
          <span class="chip-tag hi">二 · 高等数学</span>
          <router-link v-for="s in higher" :key="s" class="chip" :to="'/' + s">{{ MODULES[s].t }}</router-link>
        </div>
      </div>
      <p class="blk-note">
        另有定理速查、自由画板、笔记、日历待办、可拖计算器、数字游戏与 AI 助手几个工具页，
        入口在顶栏、左侧浮钮与首页工具卡上。
      </p>
    </section>

    <section class="blk">
      <h2>技术构成</h2>
      <ul class="tech">
        <li><b>Vue 3 + Vite 5</b>：单文件组件，路由 hash 模式、按页懒加载，构建产物是纯静态文件，直接打开也能跑。</li>
        <li><b>KaTeX</b>：公式排版，板内公式与正文共用同一套渲染。</li>
        <li><b>自写 SVG 画板引擎</b>：不依赖图表库，画板是框架无关的纯 SVG/JS 模块，拖动、滑块、开关、缩放、导出、录像都在引擎里；三维板用正交投影加一层 WebGL 曲面。</li>
        <li><b>GeoGebra 自托管</b>：自由画板整包随站点分发，不连 geogebra.org。</li>
        <li><b>Rapier + three.js</b>：物理实验的刚体与接触求解用 Rapier（2D / 3D 两种构建随站点分发），三维画面用 three.js。</li>
        <li><b>Tauri 2</b>：桌面端与网页端共用同一份前端代码，安装包由 CI 出。</li>
      </ul>
    </section>

    <section class="blk">
      <h2>数据与隐私</h2>
      <p>
        没有账号，也没有服务端。笔记、待办、阅读进度、界面偏好、画板墨迹与文字位置都存在这台浏览器的
        localStorage 里，不上传任何位置；清除浏览器数据会一并清掉，换浏览器或换域名请先备份再导入
        （笔记页与日历页都有「⇪ 备份 / ⇩ 导入」）。
      </p>
      <p>
        AI 助手是唯一的联网功能，且只在你自己配置了接口之后才工作：模型地址与密钥存在本机，
        明文保存在浏览器里，公用电脑上请自行留意。接口默认不配，助手面板会提示去设置页填写。
      </p>
    </section>

    <section class="blk">
      <h2>署名与引用</h2>
      <p>
        本站由 CuoJue 设计与维护。讲义内容为教学用途整理，转载或引用请注明来源；
        内嵌的 GeoGebra 按非商业用途分发，源码未作修改。
        Rapier 以 Apache License 2.0 分发，版权归 Dimforge 及其贡献者所有；three.js 以 MIT 分发。
      </p>
    </section>

    <div class="more-row">
      <router-link class="more" to="/guide">使用说明</router-link>
      <router-link class="more" to="/changelog">更新日志</router-link>
    </div>
  </div>
</template>

<script setup>
import { MODULES } from '../lib/modnav.js';

// 画板数在 vite.config.js 里数好、编译成常量（define）。这里不 glob 画板目录——
// 那会把 412 个画板模块挂进构建图，Rollup 会把每个画板拆成单独的 chunk。
// 常量没注入时（例如改过 config 但 dev 服务器还是旧配置）退回写死的数，页面不会崩。
const boardCount = typeof __GL_BOARD_COUNT__ === 'number' ? __GL_BOARD_COUNT__ : 412; // eslint-disable-line no-undef

const ELEM = ['sets', 'functions', 'inequalities', 'trig', 'vectors', 'sequences', 'linecircle',
  'polar', 'conics', 'solid', 'combinatorics', 'probability', 'numeric', 'linalg'];
const HIGH = ['calc1', 'spacegeom', 'calc2', 'complexvar', 'numtheory', 'topology', 'fractal',
  'projgeom', 'algebra'];

const elementary = ELEM.filter(s => MODULES[s]);
const higher = HIGH.filter(s => MODULES[s]);
const modCount = elementary.length + higher.length;
const chapCount = [...elementary, ...higher].reduce((n, s) => n + MODULES[s].all.length, 0);
</script>

<style scoped>
.about { padding-bottom: 40px; }
h2 { font-size: 18px; margin: 0 0 6px; letter-spacing: .5px; }

/* ---------- 头图 ---------- */
.hero {
  margin: 18px 0 22px; padding: 20px 22px; border-radius: 18px;
  border: 1px solid var(--line);
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--blue) 12%, var(--card)),
    color-mix(in srgb, var(--cyan) 7%, var(--bg2)) 60%,
    color-mix(in srgb, var(--purple) 8%, var(--bg2)));
  box-shadow: 0 10px 30px rgba(0, 0, 0, .10);
}
.hero-id { display: flex; align-items: center; gap: 14px; }
.logo { width: 52px; height: 52px; flex: 0 0 auto; filter: drop-shadow(0 4px 12px rgba(92, 173, 255, .35)); }
.hero-name { display: block; font-size: 22px; letter-spacing: .6px; }
.hero-by { display: block; font-size: 12.5px; color: var(--mut); margin-top: 2px; letter-spacing: .3px; }
.hero-txt { margin: 14px 0 0; font-size: 14.5px; line-height: 1.9; color: var(--mut); max-width: 72ch; }
.hero-stats { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 16px; }
.hero-stats div {
  display: flex; align-items: baseline; gap: 7px; padding: 8px 15px; border-radius: 12px;
  background: color-mix(in srgb, var(--bg2) 62%, transparent);
  border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
}
.hero-stats b {
  font-size: 22px; font-variant-numeric: tabular-nums;
  background: linear-gradient(135deg, var(--blue), var(--cyan));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-stats span { font-size: 12.5px; color: var(--mut); }

/* ---------- 段落卡片 ---------- */
.blk {
  margin: 16px 0; padding: 18px 20px; border-radius: 16px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 62%, transparent);
}
.blk-sub { margin: 0 0 12px; font-size: 13.5px; color: var(--mut); line-height: 1.8; }
.blk p { margin: 8px 0 0; font-size: 14px; line-height: 1.9; color: var(--mut); }
.blk-note { font-size: 13.5px !important; }

.chip-groups { display: flex; flex-direction: column; gap: 10px; }
.chip-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.chip-tag {
  flex: 0 0 auto; font-size: 12px; color: var(--blue); padding: 3px 10px; border-radius: 99px;
  border: 1px solid color-mix(in srgb, var(--blue) 40%, transparent);
  background: color-mix(in srgb, var(--blue) 10%, transparent);
}
.chip-tag.hi { color: var(--purple); border-color: color-mix(in srgb, var(--purple) 40%, transparent); background: color-mix(in srgb, var(--purple) 10%, transparent); }
.chip {
  font-size: 13px; padding: 5px 12px; border-radius: 99px; text-decoration: none;
  color: var(--ink); border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg2) 66%, transparent);
  transition: border-color .14s ease, color .14s ease, transform .14s ease;
}
.chip:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); }

.tech { margin: 8px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 9px; }
.tech li {
  font-size: 13.8px; line-height: 1.85; color: var(--mut);
  padding-left: 16px; position: relative;
}
.tech li::before {
  content: ''; position: absolute; left: 2px; top: .72em;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--blue); opacity: .8;
}
.tech li b { color: var(--ink); margin-right: 4px; }

.more-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--line); }
.more {
  font-size: 13.5px; padding: 8px 16px; border-radius: 99px; text-decoration: none;
  color: var(--mut); border: 1px solid var(--line);
  transition: color .14s ease, border-color .14s ease, background .14s ease;
}
.more:hover { color: var(--blue); border-color: var(--blue); background: color-mix(in srgb, var(--blue) 8%, transparent); }

@media (max-width: 720px) {
  .hero { padding: 16px; }
  .blk { padding: 15px 16px; }
  .hero-name { font-size: 19px; }
}
</style>
