<template>
  <div v-if="PREFS.bgMotionOn === 'on' && PREFS.bgScene === 'glow'" class="bg-fx" aria-hidden="true"><i></i><i></i><i></i></div>
  <BgMotion v-if="!isPlayground && PREFS.bgMotionOn === 'on' && PREFS.bgScene !== 'glow'" />
  <BgPoly v-if="!isPlayground && PREFS.bgMotionOn === 'on' && PREFS.bgSolidOn === 'on'" :pos="PREFS.bgSolidPos" />
  <nav class="topnav"><div class="in">
    <router-link to="/" class="logo"><svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="11" fill="#5cadff"/><ellipse cx="24" cy="24" rx="15.5" ry="9.5" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M17.5 24 L24 16.4 L30.5 24" fill="none" stroke="#ffd166" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="24" r="2.8" fill="#fff"/><circle cx="30.5" cy="24" r="2.8" fill="#fff"/></svg><span>几何演示实验室</span></router-link>
    <button class="navdir" type="button" :class="{ on: drawerOpen }" @click="drawerOpen = !drawerOpen">
      <span class="navdir-ic" aria-hidden="true">☰</span>章节目录
    </button>
    <Breadcrumb />
    <span class="nav-sp" />
    <div class="nav-center"><SearchPalette ref="searchEl" :mode="PREFS.searchBox" /></div>
    <router-link to="/cheatsheet" class="pin">速查</router-link>
    <router-link to="/playground" class="pin">画板</router-link>
    <button class="pin pin-btn" type="button" title="画布：整屏空白画布，随手写画（可保存成 PNG）" @click="openCanvas">
      <span aria-hidden="true">✏</span> 画布
    </button>
    <router-link to="/notes" class="pin">笔记</router-link>
    <button class="pin pin-btn" type="button" :class="{ on: chatOpen }" @click="chatOpen = !chatOpen">
      <span aria-hidden="true">💬</span> 助手
    </button>
    <router-link to="/settings" class="pin" title="界面偏好、模型与 API、保存位置">⚙ 设置</router-link>
    <button id="printBtn" class="theme-btn print-btn" title="打印讲义：自动切纸面配色，隐藏控件与导航">🖨 打印</button>
    <button id="themeBtn" class="theme-btn" title="点击展开配色选单">🎨 主题</button>
  </div></nav>
  <main ref="mainEl" :data-anim="PREFS.pageAnim"
    :class="{ 'dock-split': dockOpen, 'dock-left': (dockOpen && PREFS.dockSide === 'left'),
              'chat-split': chatOpen && PREFS.chatSize === 'half',
              'chat-left': chatOpen && PREFS.chatSize === 'half' && PREFS.chatSide === 'left',
              'draw-split': drawOpen && drawMode === 'side',
              'draw-left': drawOpen && drawMode === 'side' && drawSide === 'left' }"><router-view /></main>
  <ChapterDrawer v-model:open="drawerOpen" :side="PREFS.drawerSide" />
  <GeoGebraDock v-model:open="dockOpen" :side="PREFS.dockSide" />
  <CalcDock />
  <ChatDock v-model:open="chatOpen" />
  <NotesDock v-model:open="notesOpen" />
  <FloatRail v-model:chat-open="chatOpen" v-model:notes-open="notesOpen" />
  <DrawPad v-model:open="drawOpen" v-model:mode="drawMode" v-model:side="drawSide" />
  <footer v-if="!isFullPage" :class="{ 'dock-split': dockOpen, 'dock-left': dockOpen && PREFS.dockSide === 'left',
    'chat-split': chatOpen && PREFS.chatSize === 'half', 'chat-left': chatOpen && PREFS.chatSize === 'half' && PREFS.chatSide === 'left',
    'draw-split': drawOpen && drawMode === 'side', 'draw-left': drawOpen && drawMode === 'side' && drawSide === 'left' }">
    <div class="foot-line">Geometry Lab · Vue 3 + Vite + KaTeX · designed by CuoJue</div>
    <nav class="foot-links" aria-label="站务"><router-link to="/about">关于</router-link><i>·</i><router-link to="/guide">使用说明</router-link><i>·</i><router-link to="/changelog">更新日志</router-link></nav>
  </footer>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { applyTheme, currentTheme, mountThemeButton } from './lib/theme.js';
import GeoGebraDock from './components/GeoGebraDock.vue';
import CalcDock from './components/CalcDock.vue';
import ChapterDrawer from './components/ChapterDrawer.vue';
import ChatDock from './components/ChatDock.vue';
import NotesDock from './components/NotesDock.vue';
import SearchPalette from './components/SearchPalette.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import FloatRail from './components/FloatRail.vue';
import DrawPad from './components/DrawPad.vue';
import BgMotion from './components/BgMotion.vue';
import BgPoly from './components/BgPoly.vue';
import { PREFS } from './lib/settings.js';
import { playPageAnim } from './lib/pagetransition.js';

// 顶栏「章节目录」抽屉：模块链接收进一枚按钮，点开左侧列出全部模块与阅读进度
const drawerOpen = ref(false);

// 右侧半屏画板：讲解页随时点开，正文让出右半边（main.dock-split 收窄），画板贴右边
const dockOpen = ref(false);

// 助手小窗 / 随页笔记：入口在顶栏与左侧圆按钮；三者互斥，免得同时让位把正文挤没
const chatOpen = ref(false);
const notesOpen = ref(false);
const searchEl = ref(null);   // SearchPalette 实例：顶栏「搜索」钮与 Ctrl K 走同一个 toggle
// 空白画布（顶栏「✏ 画布」与右下铅笔钮）：侧栏时正文同样让出一半，整页时铺满屏幕。
// 半屏贴哪边在设置页里选（PREFS.canvasSide）。
const drawOpen = ref(false);
const drawMode = ref('side');    // side | full
const drawSide = ref(PREFS.canvasSide);   // right | left
// 顶栏按钮：一律整屏打开
function openCanvas() {
  drawMode.value = 'full';
  drawOpen.value = true;
}
// 设置里换了半屏方向，画布没开着就跟着换（开着的时候不硬拽，免得上了一半跑掉）
watch(() => PREFS.canvasSide, v => { if (!drawOpen.value) drawSide.value = v; });
watch(dockOpen, v => { if (v) { chatOpen.value = false; notesOpen.value = false; drawOpen.value = false; } });
watch(chatOpen, v => { if (v) { dockOpen.value = false; notesOpen.value = false; drawOpen.value = false; } });
watch(notesOpen, v => { if (v) { dockOpen.value = false; chatOpen.value = false; drawOpen.value = false; } });
watch(drawOpen, v => { if (v) { dockOpen.value = false; chatOpen.value = false; notesOpen.value = false; } });

// 画板页是整页画板：页脚会顶出竖向滚动条，故只在非画板页显示
const route = useRoute();
const isPlayground = computed(() => route.path === '/playground');
// 电路实验室铺满整页，但页脚要留在画板底下——画板高度由页内 fitHeight() 按「视口减标题减页脚」现算，
// 两者叠起来正好一屏，不会顶出滚动条。故这里不再把它算进 isFullPage。
const isFullPage = computed(() => isPlayground.value);

// 切页过渡：动画种类由设置页决定（main[data-anim]），这里只负责重放入场；
// 顺手收起右侧的窗——整屏助手盖着整页时点站名会看不到新页面，像是「跳不过去」
const mainEl = ref();
watch(() => route.path, () => {
  playPageAnim();
  chatOpen.value = false;
  notesOpen.value = false;
});

// 打印讲义：打印前临时切纸面配色（画板同步重渲染；persist=false 不覆盖用户存的偏好），打印后还原原主题；菜单 Ctrl+P 同样生效
let printTheme = null;
onMounted(() => {
  mountThemeButton(document.getElementById('themeBtn'));
  const pb = document.getElementById('printBtn');
  if (pb) pb.addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => {
    printTheme = currentTheme();
    if (printTheme !== 'light') applyTheme('light', false);
  });
  window.addEventListener('afterprint', () => {
    if (printTheme && printTheme !== 'light') applyTheme(printTheme, false);
    printTheme = null;
  });
});
</script>
