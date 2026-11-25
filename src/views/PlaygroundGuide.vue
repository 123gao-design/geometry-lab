<template>
  <div>
    <div class="chapter-head">
      <h1>使用说明</h1>
      <p class="sub">画板的界面、命令、对象属性，以及挂在对象上的 GeoGebra 脚本与 JavaScript 脚本。末尾两块板可以直接动手，两个例子各用一类脚本。</p>
    </div>

    <h3 class="sec">一 · 界面与基本操作</h3>
    <div class="note good">
      <p>画板分四块：顶部工具栏放作图工具，左侧代数栏按名字列出全部对象与数值，右边是绘图区，右上角菜单管视图与设置。</p>
    </div>
    <p>几个通用操作：选中工具后在绘图区点几下即可作图；<strong>Esc</strong> 放弃当前工具，<strong>Ctrl+Z</strong> 撤销。切到「移动」工具，自由对象（点、滑块、圆）可以直接拖动，依赖对象随之重算。右键对象选「设置」可以改名称、标签、颜色与线型；右键绘图区选「设置」可以改坐标轴与网格。</p>

    <h3 class="sec">二 · 输入栏与常用命令</h3>
    <p>代数栏底部的输入栏接受 GeoGebra 命令，回车执行。对象可以随手命名，冒号后面写定义，之后按名字引用即可，例如 <code>c: x^2+y^2=4</code>。常用命令如下：</p>
    <table>
      <tr><td>Point((1,2))</td><td>取一点；<code>Point(c)</code> 取曲线 <code>c</code> 上的一点</td></tr>
      <tr><td>Segment(A,B) / Line(A,B)</td><td>线段与直线</td></tr>
      <tr><td>Circle(O,3)</td><td>以 <code>O</code> 为心、3 为半径作圆</td></tr>
      <tr><td>Polygon(A,B,C)</td><td>多边形</td></tr>
      <tr><td>Intersect(c,d)</td><td>两条曲线的交点</td></tr>
      <tr><td>PerpendicularLine(A,c)</td><td>过点 <code>A</code> 作 <code>c</code> 的垂线</td></tr>
      <tr><td>Midpoint(A,B)</td><td>中点</td></tr>
      <tr><td>f(x)=a x^2</td><td>函数；<code>a</code> 先定义，改 <code>a</code> 时曲线跟着变</td></tr>
      <tr><td>Slider(0,6.28,0.01)</td><td>滑动条，绘图区里出现一枚可拖的滑块</td></tr>
      <tr><td>Sequence(k,k,1,10)</td><td>序列，批量生成对象</td></tr>
    </table>
    <p>自由对象的位置由拖动决定，依赖对象的位置由定义算出。改上游对象的取值，下游对象立即重算，这是后面两类脚本能起作用的前提。</p>

    <h3 class="sec">三 · 对象属性</h3>
    <p>右键对象选「设置」，常用的几页是：<strong>基本</strong>（名称、标签、定义、是否显示）、<strong>颜色</strong>、<strong>样式</strong>（线型、线宽、填充与透明度）、<strong>高级</strong>（位置、条件显示）；视图一页管坐标轴、网格与单位。代数栏只显示定义，要看一个对象为什么在当前位置，看它的定义最短。</p>

    <h3 class="sec">四 · GeoGebra 脚本</h3>
    <p>设置面板最后一页是「脚本」，可以给每个对象挂两类事件：</p>
    <p><strong>单击</strong>：鼠标点这个对象时执行。<strong>更新</strong>：对象的值或位置改变时执行。</p>
    <p>脚本正文就是输入栏能执行的命令，一行一条，对象名直接写，不需要别的语法。常用的几条：</p>
    <table>
      <tr><td>SetValue(k,3)</td><td>把数值改成 3</td></tr>
      <tr><td>SetCoords(P,1,2)</td><td>把点的坐标改成 (1,2)</td></tr>
      <tr><td>SetColor(P,"orange")</td><td>改颜色</td></tr>
      <tr><td>SetVisibleInView(P,1,true)</td><td>在第 1 视图里显示或隐藏</td></tr>
      <tr><td>StartAnimation(P,true)</td><td>播放动画，<code>false</code> 为停止</td></tr>
      <tr><td>ZoomIn(1.2)</td><td>按倍数缩放视图</td></tr>
    </table>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>更新脚本里修改对象自身会再次触发更新，陷入递归；脚本应当只改其他对象。需要改自身时，先比较新旧取值，确实变了再写回。</p>
    </div>

    <div class="board-wrap">
      <div class="board"><GeoGebraApp :commands="cmds1" :height="440" :pane-ratio="0.2" @ready="ready1" /></div>
      <p class="cap"><b>图 说明1 · 滑块驱动两个点</b>：拖动左侧的滑块 <code>k</code>，点 <code>P</code>、<code>Q</code> 同时绕单位圆转动，两条半径始终垂直。挂在 <code>k</code> 上的更新脚本是下面两行：</p>
    </div>
    <pre class="code">SetCoords(P, 3*cos(k), 3*sin(k))
SetCoords(Q, -3*sin(k), 3*cos(k))</pre>
    <p>这一页的两行脚本由页面代为绑定，效果与在 <code>k</code> 的设置 → 脚本 → 更新 里亲手填进去相同：脚本只在 <code>k</code> 变化时执行，改的是 <code>P</code> 与 <code>Q</code>，不会反过来触发自己。</p>

    <h3 class="sec">五 · JavaScript 脚本</h3>
    <p>脚本页的左上有语言选项，另一档是 JavaScript。这一档按事件写函数：</p>
    <p><strong>全局 JavaScript</strong> 写 <code>function ggbOnInit() { … }</code>，画板加载完成时调用一次，适合挂监听。<strong>对象的脚本</strong>写 <code>function onClick(el) { … }</code> 与 <code>function onUpdate(el) { … }</code>，参数是被点的或变了的对象。</p>
    <p>函数里通过 <code>ggbApplet</code> 调用画板 API，常用的几个：</p>
    <table>
      <tr><td>ggbApplet.setCoords(A,1,2)</td><td>设置点坐标</td></tr>
      <tr><td>ggbApplet.setValue(k,3)</td><td>设置数值</td></tr>
      <tr><td>ggbApplet.getXcoord(A)</td><td>读横坐标；纵坐标与数值分别是 <code>getYcoord</code>、<code>getValue</code></td></tr>
      <tr><td>ggbApplet.evalCommand("…")</td><td>执行一条 GeoGebra 命令</td></tr>
      <tr><td>ggbApplet.startAnimation(A,true)</td><td>开始或停止动画</td></tr>
      <tr><td>ggbApplet.setColor(A,"red")</td><td>改颜色</td></tr>
      <tr><td>ggbApplet.registerObjectUpdateListener("A",fn)</td><td>对象变化时调用 <code>fn</code></td></tr>
      <tr><td>ggbApplet.registerClickListener("A",fn)</td><td>对象被单击时调用 <code>fn</code></td></tr>
    </table>
    <p>JavaScript 能算，也能把结果写回宿主页面，所以读数、状态提示这类界面元素也可以由脚本维护。</p>

    <div class="board-wrap">
      <div class="board"><GeoGebraApp :commands="cmds2" :height="440" :pane-ratio="0.2" @ready="ready2" /></div>
      <div class="ctrl chips">
        <span class="chip">P <b>{{ live.P }}</b></span>
        <span class="chip">Q <b>{{ live.Q }}</b></span>
        <span class="chip">|PQ| <b>{{ live.d }}</b></span>
        <span class="chip" :class="{ ok: live.hit }">{{ live.hit ? '已点中 Q' : '单击 Q 试试' }}</span>
      </div>
      <p class="cap"><b>图 说明2 · 拖点求圆上最近点</b>：拖动 <code>P</code>，脚本算出圆上离它最近的点 <code>Q</code> 并写回坐标；单击 <code>Q</code> 时右下的提示亮起。|PQ| 等于 P 到圆心的距离减半径，可以拿读数核对。</p>
    </div>
    <pre class="code">ggbApplet.registerObjectUpdateListener("P", () => {
  const x = ggbApplet.getXcoord("P"), y = ggbApplet.getYcoord("P");
  const n = Math.hypot(x, y) || 1;
  ggbApplet.setCoords("Q", 2 * x / n, 2 * y / n);
  // 读数写回页面：P、Q 的坐标与 |PQ| = n - 2
});
ggbApplet.registerClickListener("Q", () => { /* 提示亮起 */ });</pre>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>更新监听里如果改动同一个对象，回调会再次进入；改其他对象不会。拖动类互动用 <code>registerObjectUpdateListener</code> 比对象的 <code>onUpdate</code> 更容易控制时机，前者只在被监听的对象变化时触发。</p>
    </div>

    <h3 class="sec">六 · 两类脚本怎么选</h3>
    <p>GeoGebra 脚本直接写命令，不用记 API，改几个对象的位置与取值足够用；JavaScript 能算、能读宿主页面的数据，也能调用页面里的其他函数。两者可以混用：GeoGebra 脚本里能执行的命令，JavaScript 里用 <code>evalCommand</code> 执行同一条即可。</p>

    <h3 class="sec">七 · 与章节画板的分工</h3>
    <p>章节里的画板是为一节推导定制的，参数与读数都围绕当节结论；GeoGebra 适合自己动手验证、试错与作图。讲解页右下角的圆形按钮把当前章节的参数带进半屏画板，接着在代数栏里改；需要更大的地方就在本页左上角切模式，或从半屏画板的「整页 ↗」过来。</p>

    <div class="read-row">
      <router-link class="readmark" to="/playground">← 回到画板</router-link>
      <router-link class="readmark" to="/playground/about">关于画板</router-link>
      <span class="readtip">两块板都可以直接拖动</span>
    </div>
  </div>
</template>

<script setup>
// 使用说明页：四节讲界面、命令、属性与两类脚本，末尾两块 GeoGebra 板各用一类脚本驱动。
// GeoGebra 5 的 Web 版没有 setScript 这类 API，脚本只有两条路：对象属性里手填，或由宿主页面用
// registerObjectUpdateListener / registerClickListener 挂上同样的命令——两块板走的是后一条。
import { onBeforeUnmount, reactive, ref } from 'vue';
import GeoGebraApp from '../components/GeoGebraApp.vue';

const g1 = ref();
const g2 = ref();

// 图 说明1：滑块 k 的更新脚本（GeoGebra 脚本两行）
const cmds1 = [
  'k = Slider(0, 6.28, 0.01)',
  'c: x^2 + y^2 = 9',
  'P = (3, 0)',
  'Q = (0, 3)',
  'r1 = Segment((0, 0), P)',
  'r2 = Segment((0, 0), Q)',
];
const SCRIPT1 = [
  'SetCoords(P, 3*cos(k), 3*sin(k))',
  'SetCoords(Q, -3*sin(k), 3*cos(k))',
];

// 图 说明2：拖动自由点 P，脚本把圆上离它最近的点 Q 写回
const cmds2 = [
  'c: x^2 + y^2 = 4',
  'P = (3, 1)',
  'Q = (2, 0)',
  's = Segment(P, Q)',
];
const live = reactive({ P: '—', Q: '—', d: '—', hit: false });

let api2 = null;
let upd2 = null;
let clk2 = null;

function ready1(api) {
  try {
    api.evalCommand('SetColor(P, "orange")');
    api.evalCommand('SetColor(Q, "cyan")');
  } catch (e) { /* 颜色名不被识别时保持默认 */ }
  // 先挂监听再拨 k，开屏就落在 k=0.6 的位置，不用等用户先拖一下
  api.registerObjectUpdateListener('k', () => {
    SCRIPT1.forEach(c => { try { api.evalCommand(c); } catch (e) { /* 忽略单条失败 */ } });
  });
  api.setValue('k', 0.6);
}

function ready2(api) {
  api2 = api;
  upd2 = () => {
    const x = api.getXcoord('P');
    const y = api.getYcoord('P');
    const n = Math.hypot(x, y) || 1;
    api.setCoords('Q', 2 * x / n, 2 * y / n);
    live.P = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
    live.Q = `${(2 * x / n).toFixed(2)}, ${(2 * y / n).toFixed(2)}`;
    live.d = (n - 2).toFixed(2);
  };
  clk2 = () => { live.hit = !live.hit; };
  api.registerObjectUpdateListener('P', upd2);
  api.registerClickListener('Q', clk2);
  upd2();
}

onBeforeUnmount(() => {
  if (!api2) return;
  try { api2.unregisterObjectUpdateListener('P'); } catch (e) {}
  try { api2.unregisterClickListener('Q'); } catch (e) {}
});
</script>

<style scoped>
.code {
  margin: 10px 0 4px; padding: 12px 16px; overflow-x: auto;
  background: var(--bg2); border: 1px solid var(--line); border-radius: 10px;
  color: var(--ink); font: 13px/1.75 var(--font-mono);
}
.board-wrap { margin: 22px 0 8px; }
.read-row a { text-decoration: none; }
</style>
