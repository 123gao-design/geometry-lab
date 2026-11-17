<template>
  <button ref="btnEl" class="crumb-fab" type="button" :class="{ on: open }"
    title="页面路径与最近打开（缓存跳转）" aria-label="页面路径与最近打开" :aria-expanded="open"
    @click="toggle">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6.2" cy="6.4" r="2.1" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="17.8" cy="12" r="2.1" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="6.2" cy="17.6" r="2.1" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M8.3 6.4h3.2a2.1 2.1 0 0 1 2.1 2.1v1.4a2.1 2.1 0 0 0 2.1 2.1M8.3 17.6h3.2a2.1 2.1 0 0 0 2.1-2.1v-1.4a2.1 2.1 0 0 1 2.1-2.1"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>

  <Teleport to="body">
    <div v-if="open" ref="panelEl" class="bc-panel" :style="panelStyle" role="dialog" aria-label="页面路径与最近打开">
      <div class="bc-hd">
        <strong>页面路径</strong>
        <span class="bc-cap">{{ VISITS.list.length }} / {{ visitCap() }}</span>
        <span class="bc-sp" />
        <button class="bc-hbtn" type="button" :class="{ on: pinned }" :title="pinned ? '取消固定，切页或点外面就收起' : '固定住，切页也不收起'" @click="togglePin">
          {{ pinned ? '已固定' : '固定' }}
        </button>
        <button class="bc-hbtn" type="button" title="清空缓存" @click="clearVisits">清空</button>
      </div>

      <div ref="trailEl" class="bc-trail" aria-label="当前位置">
        <template v-for="(c, i) in crumbs" :key="i">
          <span v-if="i" class="bc-sep" aria-hidden="true">›</span>
          <router-link v-if="c.to && !c.cur" class="bc-crumb" :to="c.to" :title="c.t">{{ c.t }}</router-link>
          <span v-else class="bc-crumb" :class="{ cur: c.cur }" :title="c.t">{{ c.t }}</span>
        </template>
      </div>

      <div class="bc-list">
        <button v-for="r in recent" :key="r.path" class="bc-item" type="button"
          :class="{ on: r.path === route.path }" :title="r.path" @click="goto(r.path)">
          <span class="bc-item-main">
            <span class="bc-item-t">{{ r.title }}</span>
            <span class="bc-item-sub">{{ r.sub }}</span>
          </span>
          <span v-if="r.no" class="bc-item-no">{{ r.no }}</span>
          <span class="bc-item-ago">{{ ago(r.ts) }}</span>
        </button>
        <p v-if="!recent.length" class="bc-empty">还没有打开过的页面。</p>
      </div>

      <p class="bc-ft">点一条回到那一页；缓存条数在「设置 → 页面缓存」里改（上限 {{ MAX_VISITS }}）。</p>
    </div>
  </Teleport>
</template>

<script setup>
// 面包屑：顶栏里「章节目录」右边一枚小圆钮（`App.vue` 的 `.topnav` 里挂着，不浮在正文上），
// 点开是「当前位置」和最近打开过的页面缓存。
// 面板挂 body、按下按钮现算坐标（顶栏 .topnav .in 的 overflow 会裁掉挂在里面的绝对定位层）。
// 面板自按钮正下方展开、限高不会压到左下角的浮钮；可固定（切页不收起），不固定时点外面 / Esc / 切页都收。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VISITS, MAX_VISITS, infoOf, recordVisit, clearVisits, trimVisits, visitCap } from '../lib/visits.js';

const route = useRoute();
const router = useRouter();

const btnEl = ref();
const panelEl = ref();
const trailEl = ref();
const open = ref(false);
const pos = ref({ left: 16, top: 52, maxH: 520 });

const PIN_KEY = 'gl-crumb-pin';
const pinned = ref(localStorage.getItem(PIN_KEY) === '1');

const panelStyle = computed(() => ({ left: pos.value.left + 'px', top: pos.value.top + 'px', maxHeight: pos.value.maxH + 'px' }));

// 当前位置：首页 › 模块 › 子专题 › 本章；特殊页就是 首页 › 页面
const crumbs = computed(() => {
  const p = route.path;
  if (p === '/') return [{ t: '首页', cur: true }];
  const i = infoOf(p);
  const out = [{ t: '首页', to: '/' }];
  if (i.kind === 'chapter') {
    out.push({ t: i.mod, to: i.modulePath });
    if (i.group) out.push({ t: i.group });
    out.push({ t: i.title, cur: true });
  } else {
    out.push({ t: i.title, cur: true });
  }
  return out;
});

// 缓存列表：标题与副行都在这里算好，模板里不再重复查大纲
const recent = computed(() => VISITS.list.map(v => {
  const i = infoOf(v.path);
  return {
    path: v.path,
    ts: v.ts,
    title: i.title,
    no: i.no,
    sub: i.mod ? (i.group ? i.mod + ' · ' + i.group : i.mod) : (v.path === '/' ? '站点首页' : v.path),
  };
}));

function ago(ts) {
  const d = Date.now() - (ts || 0);
  if (d < 60e3) return '刚刚';
  if (d < 3600e3) return Math.floor(d / 60e3) + ' 分钟前';
  if (d < 86400e3) return Math.floor(d / 3600e3) + ' 小时前';
  return new Date(ts).toLocaleDateString('zh-CN');
}

// 面板贴在按钮正下方；宽度夹在视口内，高度夹在左下角浮钮之上（浮钮是 fixed 的，按它的顶边现算）
function place() {
  const b = btnEl.value;
  if (!b) return;
  const r = b.getBoundingClientRect();
  const w = Math.min(440, window.innerWidth - 20);
  const left = Math.max(10, Math.min(r.left, window.innerWidth - w - 10));
  const top = Math.max(52, r.bottom + 8);
  const rail = document.querySelector('.float-rail');
  const railTop = rail ? rail.getBoundingClientRect().top : window.innerHeight - 12;
  const maxH = Math.max(220, Math.min(window.innerHeight - top - 12, railTop - 12 - top));
  pos.value = { left, top, maxH };
}

function toggle() {
  if (open.value) { open.value = false; return; }
  place();
  open.value = true;
  // 窄屏排不下整条时，滚到右端让当前页先露面
  nextTick(() => {
    const t = trailEl.value;
    if (t && t.scrollWidth > t.clientWidth) t.scrollLeft = t.scrollWidth;
  });
}

function togglePin() {
  pinned.value = !pinned.value;
  try { localStorage.setItem(PIN_KEY, pinned.value ? '1' : '0'); } catch (e) { /* 忽略 */ }
}

function goto(path) {
  if (path !== route.path) router.push(path);
  if (!pinned.value) open.value = false;
}

function onDocDown(e) {
  if (!open.value || pinned.value) return;
  const p = panelEl.value;
  const b = btnEl.value;
  if (p && p.contains(e.target)) return;
  if (b && b.contains(e.target)) return;
  open.value = false;
}

function onKey(e) {
  if (e.key === 'Escape' && open.value) open.value = false;
}

// 切页：记一笔缓存；没固定就收起。
// 初次解析路由期间 route.path 还是 '/'，要等 router.isReady() 再记，免得白记一条首页
let ready = false;
router.isReady().then(() => {
  ready = true;
  recordVisit(route.path);
});
watch(() => route.path, p => {
  if (!ready) return;
  recordVisit(p);
  if (!pinned.value) open.value = false;
});

// 设置里改了条数，立刻按新上限裁掉多的
watch(() => visitCap(), trimVisits);

onMounted(() => {
  document.addEventListener('mousedown', onDocDown);
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocDown);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', place);
  window.removeEventListener('scroll', place);
});
</script>

<style scoped>
/* 页面缓存（最近打开）钮：早先钉在左侧浮着，会压住正文一截；现在收进顶栏、挨着「章节目录」——
   顶栏不盖内容，位置也更好找。外观跟顶栏那几枚胶囊同一套调子，只是收成 28px 的圆 */
.crumb-fab {
  flex: none; width: 28px; height: 28px; margin-left: 1px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 50%; cursor: pointer;
  transition: color .16s ease, border-color .16s ease, background .16s ease;
}
.crumb-fab svg { width: 17px; height: 17px; }
.crumb-fab:hover { color: var(--ink); border-color: var(--mut); background: rgba(255, 255, 255, .06); }
.crumb-fab.on { color: var(--blue); border-color: var(--blue); }

.bc-panel {
  position: fixed; z-index: 121; width: 440px; max-width: calc(100vw - 20px);
  max-height: calc(100vh - 70px);
  display: flex; flex-direction: column;
  background: var(--card); border: 1px solid var(--line); border-radius: 14px;
  box-shadow: 0 16px 44px rgba(0, 0, 0, .3); padding: 10px;
}
.bc-hd { display: flex; align-items: center; gap: 8px; padding: 0 2px 8px; flex: none; }
.bc-hd strong { font-size: 13px; color: var(--ink); }
.bc-cap { font-size: 11px; color: var(--faint); }
.bc-sp { flex: 1; }
.bc-hbtn { font: inherit; font-size: 12px; color: var(--mut); background: transparent; border: 1px solid var(--line);
  border-radius: 99px; padding: 3px 10px; cursor: pointer; white-space: nowrap; }
.bc-hbtn:hover { color: var(--ink); border-color: var(--mut); }
.bc-hbtn.on { color: var(--blue); border-color: var(--blue); }

/* 每一级都用圆角矩形包起来；一行排开不换行，标题过长按胶囊宽度省略 */
.bc-trail { display: flex; align-items: center; flex-wrap: nowrap; gap: 3px; padding: 7px 2px;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 12.5px;
  overflow-x: auto; overflow-y: hidden; flex: none; scrollbar-width: none; }
.bc-trail::-webkit-scrollbar { display: none; }
.bc-sep { color: var(--faint); padding: 0 1px; flex: none; }
.bc-crumb {
  flex: 0 0 auto; max-width: 150px;
  padding: 2px 9px; border-radius: 99px;
  background: var(--bg2); border: 1px solid var(--line);
  color: var(--blue); text-decoration: none;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
a.bc-crumb:hover { color: var(--ink); border-color: var(--mut); background: var(--card); }
/* 当前页最长，允许它先缩：一行排不下时只截这一枚 */
.bc-crumb.cur { color: var(--ink); flex: 0 1 auto; min-width: 84px; }

.bc-list { display: flex; flex-direction: column; gap: 1px; flex: 1; min-height: 0; overflow: auto; padding: 6px 0 2px; }
.bc-item { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; font: inherit;
  color: var(--mut); background: none; border: none; border-radius: 9px; padding: 6px 8px; cursor: pointer; }
.bc-item:hover { background: var(--bg2); color: var(--ink); }
.bc-item.on { background: rgba(92, 173, 255, .13); color: var(--blue); }
.bc-item-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.bc-item-t { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-item-sub { font-size: 11px; color: var(--faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-item-no { flex: none; font-size: 10.5px; color: var(--faint); border: 1px solid var(--line); border-radius: 5px; padding: 0 4px; }
.bc-item-ago { flex: none; font-size: 11px; color: var(--faint); min-width: 38px; text-align: right; }
.bc-empty { margin: 0; padding: 12px 8px; font-size: 12.5px; color: var(--faint); }
.bc-ft { margin: 6px 2px 0; padding-top: 8px; border-top: 1px solid var(--line); font-size: 11px; color: var(--faint); line-height: 1.6; flex: none; }

@media (max-width: 900px) {
  .crumb-fab { width: 26px; height: 26px; }
  .crumb-fab svg { width: 16px; height: 16px; }
}
@media print { .crumb-fab, .bc-panel { display: none !important; } }
</style>
