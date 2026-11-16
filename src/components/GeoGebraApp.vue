<template>
  <div class="ggb-shell" :class="{ fill }">
    <div ref="host" :id="hostId" class="ggb-host" :style="fill ? null : { height: height + 'px' }"></div>
    <div v-if="state === 'loading'" class="ggb-mask">
      <span>正在加载画板…</span>
    </div>
    <div v-else-if="state === 'error'" class="ggb-mask err">
      <p>GeoGebra 本体没有找到。</p>
      <p class="sub">组件按 /ggb/HTML5/5.0/ 找自托管文件，缺文件时整页仍然可用，只是这一块画不出来。</p>
    </div>
  </div>
</template>

<script setup>
// GeoGebra 嵌入组件（自托管版）：deployggb.js 从 /ggb/ 读取，不上外网。
// 用法：<GeoGebraApp app-name="graphing" :commands="['f(x)=sin(x)']" @ready="onReady" />
// 父组件拿到 api 后可直接调用 GeoGebra Apps API（evalCommand / setCoordSystem / getBase64 …）。
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  appName: { type: String, default: 'classic' },   // classic | graphing | 3d | geometry
  height: { type: Number, default: 640 },
  commands: { type: Array, default: () => [] },
  showToolBar: { type: Boolean, default: true },
  showAlgebraInput: { type: Boolean, default: true },
  fill: { type: Boolean, default: false },   // 铺满父容器（整页画板与右侧小窗用），忽略 height
  paneRatio: { type: Number, default: 0 },   // 左侧代数栏占比（0 = 按 GeoGebra 默认；整页与小窗都传 0.2 收窄）
});
const emit = defineEmits(['ready', 'error']);

const host = ref();
const hostId = 'ggb-' + Math.random().toString(36).slice(2, 10);
const state = ref('loading');
let api = null;
let applet = null;
let ro = null;
let winSync = null;
let syncTimer = null;
let layTimer = null;

// 只有带代数栏的经典界面才有左右分栏可调
const PERSPECTIVE = props.appName === '3d' ? 'T' : props.appName === 'classic' ? 'AG' : '';

// 站点 base 是 './'（构建产物可放任意子目录或本地打开），路径一律跟着 BASE_URL 走
const BASE = import.meta.env.BASE_URL || '/';
const deployUrl = BASE.replace(/\/$/, '') + '/ggb/deployggb.js';
// deployggb 从 codebase 的倒数第二段判断要加载哪个 nocache 脚本，
// 所以这里必须指到 web3d/（带工具栏的完整界面），指到 5.0/ 它会去取不存在的 web.nocache.js
const codebase = BASE.replace(/\/$/, '') + '/ggb/HTML5/5.0/web3d/';

// 一个页面可能挂好几块板（使用说明页就挂了两块），deployggb.js 只能载一次，
// 否则控制台会报 was loaded twice。注意 <script setup> 里声明的变量是每实例一份，
// 不能拿模块变量去去重，改成看页面里已有的 script 标签。
function loadDeploy() {
  if (window.GGBApplet) return Promise.resolve();
  const old = document.querySelector('script[src="' + deployUrl + '"]');
  return new Promise((res, rej) => {
    const s = old || document.createElement('script');
    s.addEventListener('load', () => res());
    s.addEventListener('error', () => rej(new Error('deployggb.js 加载失败')));
    if (!old) {
      s.src = deployUrl;
      document.head.appendChild(s);
    }
  });
}

const run = cmds => {
  if (!api) return;
  cmds.forEach(c => { try { api.evalCommand(c); } catch (e) { /* 单条命令失败不影响其余 */ } });
};

// 左侧代数栏初值偏宽，初始按比例收窄：GeoGebra 没有改分栏的 API，
// 只能对它自己的分隔条派发一次 mousedown → mousemove → mouseup，等价于用户拖一下。
// 画板界面比 appletOnLoad 晚一拍才排好版，分隔条可能还不在，故轮询到它出现为止（最多约 6 秒）。
let paneTimer = null;
function setPaneRatio(ratio, tries = 0) {
  const root = host.value;
  if (!root || !(ratio > 0 && ratio < 1)) return;
  const drag = root.querySelector('.splitPaneDragger');
  // 分隔条的 parentNode 只是它自己的小包装层（宽约几十像素），比例要从整个分栏面板量
  const box = root.querySelector('.gwt-SplitLayoutPanel');
  const pane = root.querySelector('.dockPanelParent');
  const d = drag && drag.getBoundingClientRect();
  const b = box && box.getBoundingClientRect();
  const p = pane && pane.getBoundingClientRect();
  if (!d || !b || !p || !d.width || !b.width) {
    if (tries < 40) paneTimer = setTimeout(() => setPaneRatio(ratio, tries + 1), 150);
    return;
  }
  // 太窄时对象定义会被截断成半行，留一个 192px 的下限
  const ratioUse = Math.max(ratio, Math.min(192 / b.width, 0.4));
  // 已经接近目标比例（首次排好版就是窄的）就不再动
  if (Math.abs(p.width / b.width - ratioUse) < 0.03) return;
  const sx = d.left + d.width / 2;
  const sy = d.top + d.height / 2;
  const tx = b.left + b.width * ratioUse;
  const fire = (el, type, x) => el.dispatchEvent(new MouseEvent(type, {
    bubbles: true, cancelable: true, view: window, button: 0,
    buttons: type === 'mouseup' ? 0 : 1, clientX: x, clientY: sy,
  }));
  fire(drag, 'mousedown', sx);
  fire(document, 'mousemove', tx);
  fire(document, 'mouseup', tx);
}

// 分栏方向与宽度一次摆好。 GeoGebra 按容器的横竖比例决定分栏方向：容器高于宽时它把代数栏
// 挪到图形区下方（分栏对齐变成上下），图形区被压成顶上一条横带 —— 右侧半屏画板正好是这种
// 窄高比例。重放一次 perspective 能把分栏扳回左右，已画的对象与坐标都不受影响；
// 布局是异步重排的，扳完隔一拍再量。tries 归零的一次调用会掐掉上一轮未完成的轮询。
function layoutFix(tries = 0) {
  if (tries === 0) { clearTimeout(layTimer); layTimer = null; }
  if (!api || !host.value) return;
  const drag = host.value.querySelector('.splitPaneDragger');
  if (!drag) {
    if (tries < 40) layTimer = setTimeout(() => layoutFix(tries + 1), 150);
    return;
  }
  if (drag.className.indexOf('VDragger') >= 0) {
    // 三维与纯图形界面没有代数栏，上下分栏随它；经典界面要扳回左右
    if (PERSPECTIVE !== 'AG') return;
    try { api.setPerspective(PERSPECTIVE); } catch (e) { /* 接口缺失就保持原样 */ }
    if (tries < 40) layTimer = setTimeout(() => layoutFix(tries + 1), 150);
    return;
  }
  if (props.paneRatio > 0) setPaneRatio(props.paneRatio);
}

// 把宿主当前尺寸交给 applet；挂载后、窗口缩放、容器变化都走这一处
function applySize() {
  syncTimer = null;
  if (!api || !host.value) return;
  const nw = Math.max(360, Math.round(host.value.clientWidth));
  const nh = Math.max(300, Math.round(props.fill ? host.value.clientHeight : props.height));
  try { api.setSize(nw, nh); } catch (e) {}
  // setSize 会重新判定分栏方向（窄高的容器又会被改成上下），跟着再摆一次
  layoutFix();
}
// 连续 resize 合并成一次：拖窗口时逐帧 setSize 会让分栏来回翻
function syncSize() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(applySize, 110);
}

onMounted(async () => {
  try {
    await loadDeploy();
    if (!window.GGBApplet) throw new Error('GGBApplet 未定义');
    const w = Math.max(360, Math.round(host.value.clientWidth || 900));
    const h0 = Math.max(300, Math.round(props.fill ? host.value.clientHeight || props.height : props.height));
    applet = new window.GGBApplet({
      appName: props.appName,
      width: w,
      height: h0,
      showToolBar: props.showToolBar,
      showAlgebraInput: props.showAlgebraInput,
      showMenuBar: false,
      showKeyboard: false,
      showKeyboardOnFocus: false,
      preventFocus: true,
      showResetIcon: true,
      showFullscreenButton: true,
      enableLabelDrags: true,
      enableShiftDragZoom: true,
      language: 'zh_CN',
      perspective: PERSPECTIVE,
      // 关掉 GeoGebra 的自动缩放：它按容器算出的比例把整块界面缩小时，会在右侧留一条空白，
      // 画板看着不居中；尺寸统一由下面的 sync() 用 setSize 交给它。
      disableAutoScale: true,
      appletOnLoad(a) {
        api = a;
        state.value = 'ready';
        run(props.commands);
        // 分栏方向与代数栏宽度：排好版之后摆一次，稍后再核一次（首次布局常有二次重排）
        layoutFix();
        setTimeout(() => layoutFix(), 600);
        // 挂载那一刻量到的宽度偶尔是父容器还没排好的旧值，等一帧再交一次尺寸，
        // 免得画板比宿主窄、右侧空一条
        if (props.fill) setTimeout(syncSize, 120);
        emit('ready', a);
      },
    }, true);
    applet.setHTML5Codebase(codebase, true);
    applet.inject(hostId);
    // 容器尺寸变化时同步给 applet（fill 档高度也随时改，窗口竖直拖动同样要跟上）
    const sync = syncSize;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(sync);
      ro.observe(host.value);
    }
    window.addEventListener('resize', sync);
    winSync = sync;
  } catch (e) {
    state.value = 'error';
    emit('error', e);
  }
});

watch(() => props.commands, c => run(c), { deep: true });
watch(() => props.paneRatio, r => { if (r > 0) layoutFix(); });

onBeforeUnmount(() => {
  if (paneTimer) clearTimeout(paneTimer);
  if (layTimer) clearTimeout(layTimer);
  if (syncTimer) clearTimeout(syncTimer);
  ro && ro.disconnect();
  if (winSync) window.removeEventListener('resize', winSync);
  if (host.value) host.value.innerHTML = '';
});

defineExpose({
  get api() { return api; },
  eval: c => api && api.evalCommand(c),
  reset: () => { if (api) api.reset(); },
  clear: () => { if (api) api.deleteObject && api.getAllObjectNames().forEach(n => { try { api.deleteObject(n); } catch (e) {} }); },
});
</script>

<style scoped>
.ggb-shell { position: relative; width: 100%; }
.ggb-shell.fill { height: 100%; display: flex; flex-direction: column; }
.ggb-shell.fill .ggb-host { flex: 1; min-height: 0; }
.ggb-host { width: 100%; background: #fff; border-radius: 10px; overflow: hidden; }
.ggb-mask {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px;
  color: #8fa3bd; font-size: 14px; pointer-events: none;
}
.ggb-mask.err { pointer-events: auto; color: #ff7b8a; }
.ggb-mask .sub { font-size: 12.5px; color: #8fa3bd; max-width: 420px; text-align: center; line-height: 1.7; }
</style>
