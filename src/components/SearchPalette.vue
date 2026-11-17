<template>
  <Teleport to="body">
    <div v-if="open" class="sp-mask" @pointerdown.self="close">
      <div class="sp-box" role="dialog" aria-modal="true" aria-label="全站搜索">
        <div class="sp-bar">
          <span class="sp-mag" aria-hidden="true">⌕</span>
          <input ref="qEl" v-model="q" class="sp-q" type="search" autocomplete="off" spellcheck="false"
            placeholder="搜章节、定理、结论（余弦定理 / 留数 / 二次函数）" @keydown="onKey" />
          <kbd class="sp-kbd">Esc</kbd>
        </div>

        <div v-if="!q.trim()" class="sp-tip">
          <span class="sp-lb">常用</span>
          <router-link v-for="s in SUGGEST" :key="s.to" :to="s.to" class="sp-chip" @click="close">{{ s.t }}</router-link>
          <span class="sp-say">Ctrl K 随时呼出</span>
        </div>

        <div v-else-if="loading" class="sp-empty">正在装载索引…</div>
        <div v-else-if="!hits.length" class="sp-empty">没找到「{{ q }}」，换个说法试试——章节名、定理名、结论里的一句话都行</div>
        <ul v-else class="sp-list">
          <li v-for="(it, i) in hits" :key="it.to + '#' + i">
            <router-link :to="it.to" class="sp-row" :class="{ on: i === cur }"
              @click="close" @mouseenter="cur = i">
              <span class="sp-k">{{ it.k }}</span>
              <span class="sp-main">
                <span class="sp-t">{{ it.t }}</span>
                <span v-if="it.d" class="sp-d">{{ it.d }}</span>
                <span v-else-if="it.s" class="sp-s">{{ it.s }}</span>
              </span>
              <span v-if="it.tag" class="sp-tag">{{ it.tag }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// 全站搜索（Ctrl+K / ⌘K）：索引与匹配在 lib/search.js，这里只管呼出、键盘走位与样式。
// 索引按需加载——第一次打开才去取 376 条速查那份约 117 kB 的包。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { indexReady, loadIndex, search } from '../lib/search.js';

const router = useRouter();
const open = ref(false);
const q = ref('');
const qEl = ref(null);
const cur = ref(0);
const ready = ref(indexReady());
const loading = ref(false);

const SUGGEST = [
  { t: '定理速查', to: '/cheatsheet' },
  { t: '自由画板', to: '/playground' },
  { t: '笔记', to: '/notes' },
  { t: '设置', to: '/settings' },
];

const hits = computed(() => (ready.value ? search(q.value) : []));
watch(q, () => { cur.value = 0; });

async function ensure() {
  if (ready.value) return;
  loading.value = true;
  try { await loadIndex(); ready.value = true; } catch (e) { /* 取不到就一直是「正在装载」，下次再试 */ }
  loading.value = false;
}

function show() {
  if (open.value) return;
  open.value = true;
  ensure();
  nextTick(() => { if (qEl.value) qEl.value.focus(); });
}
function close() { open.value = false; }
function toggle() { if (open.value) close(); else show(); }

function go(to) {
  close();
  router.push(to);
}

function onKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); close(); return; }
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

onMounted(() => window.addEventListener('keydown', onWinKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onWinKey));
defineExpose({ toggle });
</script>

<style scoped>
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
.sp-tip { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 14px; }
.sp-lb { font-size: 12px; color: var(--mut); }
.sp-chip {
  padding: 5px 11px; border: 1px solid var(--line); border-radius: 99px; background: none;
  color: var(--mut); font: inherit; font-size: 12.5px; cursor: pointer; text-decoration: none;
}
.sp-chip:hover { color: var(--blue); border-color: color-mix(in srgb, var(--blue) 50%, transparent); }
.sp-say { margin-left: auto; font-size: 12px; color: var(--mut); opacity: .8; }
.sp-empty { padding: 22px 16px 26px; font-size: 13.5px; color: var(--mut); text-align: center; }
.sp-list { margin: 0; padding: 6px; list-style: none; overflow-y: auto; }
.sp-row {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px;
  color: var(--ink); text-decoration: none;
}
.sp-row.on { background: color-mix(in srgb, var(--blue) 13%, transparent); }
.sp-k {
  flex: none; width: 52px; text-align: center; padding: 2px 0; border-radius: 6px;
  font-size: 11px; color: var(--mut); border: 1px solid var(--line);
}
.sp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.sp-t { font-size: 14px; }
.sp-d, .sp-s {
  font-size: 12px; color: var(--mut);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sp-tag { flex: none; font-size: 11px; color: var(--blue); opacity: .85; }
html.light .sp-mask { background: rgba(20, 24, 32, .3); }
</style>
