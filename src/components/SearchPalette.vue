<template>
  <!-- 顶栏展开模式：搜索框直接长在导航条里 -->
  <span v-if="inline" class="nav-search" :class="{ on: panel }" role="search">
    <span class="sp-mag" aria-hidden="true">⌕</span>
    <input ref="qEl" v-model="q" class="nav-q" type="search" autocomplete="off" spellcheck="false"
      placeholder="搜章节、定理、结论" aria-label="全站搜索" @focus="openInline" @keydown="onKey" @input="openInline" />
    <kbd class="nav-kbd" aria-hidden="true">Ctrl K</kbd>
  </span>
  <!-- 弹窗模式：还是原来那枚顶栏按钮 -->
  <button v-else class="pin pin-btn" type="button" :class="{ on: open }" title="全站搜索（Ctrl K）" @click="toggle">
    <span aria-hidden="true">⌕</span> 搜索
  </button>

  <Teleport to="body">
    <!-- 顶栏展开：结果浮层挂在搜索框下面（顶栏是 overflow-x:auto，不能挂在它里面） -->
    <div v-if="inline && panel" ref="dropEl" class="sp-drop" :style="dropStyle" role="dialog" aria-label="搜索结果">
      <SearchResults :q="q" :hits="hits" :cur="cur" :loading="loading" @hover="cur = $event" @pick="go" />
    </div>

    <!-- 弹窗：屏幕中间的大对话框（设置里可选回这一种） -->
    <div v-if="!inline && open" class="sp-mask" @pointerdown.self="close">
      <div class="sp-box" role="dialog" aria-modal="true" aria-label="全站搜索">
        <div class="sp-bar">
          <span class="sp-mag" aria-hidden="true">⌕</span>
          <input ref="qEl2" v-model="q" class="sp-q" type="search" autocomplete="off" spellcheck="false"
            placeholder="搜章节、定理、结论（余弦定理 / 留数 / 二次函数）" @keydown="onKey" />
          <kbd class="sp-kbd">Esc</kbd>
        </div>
        <SearchResults :q="q" :hits="hits" :cur="cur" :loading="loading" @hover="cur = $event" @pick="go" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// 全站搜索（Ctrl+K / ⌘K）：索引与匹配在 lib/search.js，这里只管呼出、键盘走位与样式。
// 两种呈现（设置页「搜索框样式」可选）：inline = 搜索框直接展开在顶栏、结果从下面浮出（默认）；
// popup = 原来那种屏幕中间的对话框。索引按需加载——第一次用才去取那份约 100 kB 的包。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { indexReady, loadIndex, search } from '../lib/search.js';
import SearchResults from './SearchResults.vue';

const props = defineProps({
  mode: { type: String, default: 'inline' },   // inline | popup
});
const router = useRouter();
const route = useRoute();
const inline = computed(() => props.mode !== 'popup');

const open = ref(false);    // 弹窗模式：对话框开着
const panel = ref(false);   // 顶栏展开模式：结果浮层开着
const q = ref('');
const qEl = ref(null);
const qEl2 = ref(null);
const dropEl = ref(null);
const dropStyle = ref({});
const cur = ref(0);
const ready = ref(indexReady());
const loading = ref(false);

const hits = computed(() => (ready.value ? search(q.value) : []));
watch(q, () => { cur.value = 0; });

async function ensure() {
  if (ready.value) return;
  loading.value = true;
  try { await loadIndex(); ready.value = true; } catch (e) { /* 取不到就一直是「正在装载」，下次再试 */ }
  loading.value = false;
}

function show() {
  if (inline.value) {
    if (panel.value) return;
    panel.value = true;
    ensure();
    nextTick(() => { place(); if (qEl.value && qEl.value.focus) qEl.value.focus(); });
  } else {
    if (open.value) return;
    open.value = true;
    ensure();
    nextTick(() => { if (qEl2.value && qEl2.value.focus) qEl2.value.focus(); });
  }
}
function close() {
  open.value = false;
  panel.value = false;
}
function toggle() { if (open.value || panel.value) close(); else show(); }
// 顶栏里的输入框一获得焦点（或开始打字）就把结果浮层带出来
function openInline() { if (!panel.value) { panel.value = true; ensure(); } nextTick(place); }

function go(to) {
  close();
  router.push(to);
}

/** 浮层对着搜索框右缘摆放：够宽放结果，越出屏幕就往里收 */
function place() {
  if (!inline.value || !panel.value) return;
  const el = qEl.value;
  if (!el || !el.getBoundingClientRect || typeof window === 'undefined') return;
  const r = el.getBoundingClientRect();
  const w = Math.max(380, Math.min(window.innerWidth - 24, Math.round(r.width * 2.6)));
  let left = r.left + r.width - w;
  left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
  dropStyle.value = { left: left + 'px', top: (r.bottom + 8) + 'px', width: w + 'px' };
}
watch(panel, v => { if (v) nextTick(place); });

function onKey(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
    if (inline.value && qEl.value && qEl.value.blur) qEl.value.blur();
    return;
  }
  const n = hits.value.length;
  if (e.key === 'ArrowDown') { e.preventDefault(); if (n) cur.value = (cur.value + 1) % n; }
  else if (e.key === 'ArrowUp') { e.preventDefault(); if (n) cur.value = (cur.value - 1 + n) % n; }
  else if (e.key === 'Enter') { e.preventDefault(); const it = hits.value[cur.value]; if (it) go(it.to); }
}

function onWinKey(e) {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    toggle();
  }
}
// 点浮层与搜索框以外的地方就收起（顶栏输入框本身不吞点击，所以用 pointerdown 判）
function onDocDown(e) {
  if (!panel.value) return;
  const t = e && e.target;
  if (t && ((dropEl.value && dropEl.value.contains && dropEl.value.contains(t)) ||
            (qEl.value && qEl.value.contains && qEl.value.contains(t)))) return;
  panel.value = false;
}

// 换页收起（点结果跳转时也已经先收起过一次）
watch(() => route.path, close);

onMounted(() => {
  window.addEventListener('keydown', onWinKey);
  window.addEventListener('resize', place);
  document.addEventListener('pointerdown', onDocDown, true);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWinKey);
  window.removeEventListener('resize', place);
  document.removeEventListener('pointerdown', onDocDown, true);
});
defineExpose({ toggle });
</script>

<style scoped>
/* ---- 顶栏里的搜索框 ---- */
.nav-search {
  display: flex; align-items: center; gap: 7px; flex: none; height: 30px;
  padding: 0 11px; border: 1px solid color-mix(in srgb, var(--mut) 48%, transparent);
  border-radius: 99px; background: var(--card); color: var(--mut);
  transition: border-color .16s ease, background .16s ease;
}
.nav-search:hover { border-color: var(--mut); }
.nav-search:focus-within, .nav-search.on {
  border-color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, var(--card));
}
.nav-q {
  width: 220px; border: none; outline: none; background: none; color: var(--ink);
  font: inherit; font-size: 13px; padding: 0; line-height: 1;
}
.nav-q::placeholder { color: var(--mut); opacity: .9; }
.nav-q::-webkit-search-cancel-button { display: none; }
.nav-kbd {
  flex: none; font: inherit; font-size: 10.5px; color: var(--mut); opacity: .8;
  border: 1px solid var(--line); border-radius: 5px; padding: 0 5px; line-height: 1.55;
}
@media (max-width: 1100px) { .nav-kbd { display: none; } .nav-q { width: 150px; } }
@media (max-width: 760px) { .nav-search { padding: 0 9px; } .nav-q { width: 100px; } }

/* ---- 顶栏展开模式的结果浮层 ---- */
.sp-drop {
  position: fixed; z-index: 1200; max-height: 66vh; display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 14px; background: var(--card);
  box-shadow: 0 22px 60px rgba(0, 0, 0, .42); overflow: hidden;
}

/* ---- 弹窗模式 ---- */
.sp-mask {
  position: fixed; inset: 0; z-index: 1200;
  display: flex; justify-content: center; align-items: flex-start;
  padding: 12vh 16px 16px;
  background: rgba(4, 7, 12, .48); backdrop-filter: blur(3px);
}
.sp-box {
  width: min(680px, 100%); max-height: 68vh; display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 16px; background: var(--card);
  box-shadow: 0 24px 64px rgba(0, 0, 0, .42); overflow: hidden;
}
.sp-bar { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); }
.sp-mag { font-size: 17px; color: var(--mut); }
.sp-q {
  flex: 1; min-width: 0; border: none; outline: none; background: none; color: var(--ink);
  font: inherit; font-size: 15px;
}
.sp-q::placeholder { color: var(--mut); opacity: .85; }
.sp-q::-webkit-search-cancel-button { display: none; }
.sp-kbd {
  flex: none; padding: 2px 7px; border: 1px solid var(--line); border-radius: 6px;
  font: inherit; font-size: 11px; color: var(--mut);
}
html.light .sp-mask { background: rgba(20, 24, 32, .3); }
</style>
