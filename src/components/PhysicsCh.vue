<template>
  <div class="chap3" :class="{ 'no-toc': !toc.length }">
    <ReadProgress />
    <aside class="chapnav">
      <div class="chapnav-hd">
        <div class="chapnav-t">可视化物理</div>
        <div class="cn-tools">
          <button class="cn-tb" :class="{ on: allOpen }" @click="setAll(true)">展开全部</button>
          <button class="cn-tb" :class="{ on: allShut }" @click="setAll(false)">合并全部</button>
        </div>
      </div>
      <div ref="listEl" class="cn-body" @scroll.passive="saveScroll">
        <div v-for="(g, gi) in NAV" :key="g.t" class="cn-grp">
          <button class="cn-g" :class="{ on: gi === curGroup }" @click="toggleGroup(gi)">
            <span class="cn-arw" :class="{ open: open[gi] }">▸</span>
            <span class="cn-gt">{{ g.t }}</span>
            <span class="cn-gn" :class="{ all: onCount(g) === readCount(g) && onCount(g) > 0 }">
              {{ readCount(g) }}/{{ onCount(g) }}
            </span>
          </button>
          <div v-show="open[gi]" class="cn-list">
            <template v-for="c in g.chapters" :key="c.id">
              <router-link v-if="c.on" :to="pathOf(c)" :class="{ on: c.id === cur.id }">
                <span class="cn-i">{{ labelOf(c) }}</span>
                <span class="cn-t">{{ c.t }}</span>
                <i v-if="isRead(pathOf(c))" class="rd">✓</i>
              </router-link>
              <span v-else class="cn-off">
                <span class="cn-i">{{ labelOf(c) }}</span>
                <span class="cn-t">{{ c.t }}</span>
              </span>
            </template>
          </div>
        </div>
      </div>
      <div class="cn-pg">
        <router-link v-if="prev" :to="pathOf(prev)">← 上一章</router-link>
        <router-link v-if="next" :to="pathOf(next)">下一章 →</router-link>
      </div>
    </aside>

    <div class="chapmain">
      <nav v-if="tabs.length > 1" class="chaptabs">
        <router-link v-for="c in tabs" :key="c.id" :to="pathOf(c)" :class="{ on: c.id === cur.id }">
          <span class="ct-n">{{ noIn(c) }}</span>
          <span class="ct-t">{{ c.t }}</span>
        </router-link>
      </nav>

      <div class="chapter-head">
        <h1>
          <span class="no">{{ labelOf(cur) }}</span>
          <span>{{ title || cur.t }}</span>
        </h1>
        <p v-if="sub" class="sub">{{ sub }}</p>
      </div>

      <article>
        <slot />
        <div class="read-row">
          <button class="readmark" :class="{ on: read, 'just-done': justDone }" @click="toggle">
            <svg class="rm-tick" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.6 10.4 8.1 14.9 16.5 5.6" /></svg>
            <span>{{ read ? '本章已读 · 点击取消' : '读完了？标记本章' }}</span>
          </button>
          <span class="readtip">← / → 键翻章</span>
        </div>
      </article>
    </div>

    <aside v-if="toc.length" class="toc">
      <div class="toc-t">本讲结构</div>
      <a v-for="(t, i) in toc" :key="t.id" :class="{ on: active === t.id }" @click="go(t.id)">
        <span class="toc-n">{{ String(i + 1).padStart(2, '0') }}</span>
        <span>{{ t.t }}</span>
      </a>
    </aside>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ORDERED_PARTS, ON_CHAPS, pathOf, chapterByRoute, labelOf } from '../physics/plan.js';
import { isRead, toggleRead } from '../lib/progress.js';
import ReadProgress from './ReadProgress.vue';
import { NAV_OPEN, NAV_SCROLL } from '../lib/navpos.js';
import { PREFS } from '../lib/settings.js';

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  toc: { type: Array, default: () => [] },
});

const route = useRoute();
const router = useRouter();

const cur = computed(() => chapterByRoute('/physics/ch/' + props.id) || { id: props.id, t: props.title, part: ORDERED_PARTS[0], groups: [] });
const here = computed(() => ON_CHAPS.findIndex(c => c.id === cur.value.id));
const prev = computed(() => (here.value > 0 ? ON_CHAPS[here.value - 1] : null));
const next = computed(() => (here.value >= 0 && here.value < ON_CHAPS.length - 1 ? ON_CHAPS[here.value + 1] : null));

// 顶部横排：只列当前这一组（子专题）里已上线的章，按组划开
// （用户 2026-11-19：力1 顶上只放「质点、参考系与位移」到「运动图像与追及相遇」这五章，不铺整部分）
const tabs = computed(() => {
  const g = cur.value.group;
  const list = cur.value.part ? cur.value.part.chapters : [];
  return list.filter(c => c.on && (!g || c.group === g));
});

// 左栏只列当前所在的部分（用户 2026-11-18：「力学就只展示力学部分，『运动的描述与匀变速直线运动』
// 这些在导航栏中应该就属于原来『力学』的样式」）：部分里的各组直接当折叠组头，
// 组与章的次序都取自 plan.js 的这一份 part，章一律取 part.chapters 里带 group / part 引用的那一份。
const part = computed(() => cur.value.part || ORDERED_PARTS[0]);
const NAV = computed(() => (part.value.groups || []).map(g => ({
  t: g.t,
  chapters: part.value.chapters.filter(c => c.group === g),
})));

// 顶部横排的序号：按本部分里的章序连续排（机械振动 1/2/3，机械波 4/5/6），与章号前缀无关
const noIn = c => c.part.chapters.indexOf(c) + 1;

const onCount = g => g.chapters.filter(c => c.on).length;
const readCount = g => g.chapters.filter(c => c.on && isRead(pathOf(c))).length;

// 当前章落在哪一组：组头留一道左侧色条
const curGroup = computed(() => NAV.value.findIndex(g => g.chapters.some(c => c.id === cur.value.id)));

// 折叠状态按「讲义 + 部分」记（navpos.js）：各部分的开合互不覆盖，回到某部分仍认它上次的样子。
// 进页默认方式读设置页的「章节导航默认折叠」，本部分上次留下的开合样子优先；
// 栏顶「展开全部 / 合并全部」只改当下，手动点组头即离开这两态
const memKey = computed(() => 'physics:' + part.value.id);
const open = reactive({});
function saveOpen() { NAV_OPEN.set(memKey.value, NAV.value.map((g, gi) => !!open[gi])); }
function applyMode(reset) {
  const mode = PREFS.navOpen;
  if (reset) {
    Object.keys(open).forEach(k => delete open[k]);
    const saved = NAV_OPEN.get(memKey.value);
    const kept = Array.isArray(saved) && saved.length === NAV.value.length;
    NAV.value.forEach((g, gi) => {
      open[gi] = kept ? !!saved[gi] : mode === 'all' ? true : mode === 'none' ? false : gi === curGroup.value;
    });
    if (kept && mode !== 'none' && curGroup.value >= 0) open[curGroup.value] = true; // 当前组总归开着
  } else if (curGroup.value >= 0 && mode !== 'none') {
    open[curGroup.value] = true; // 翻到同部分别的组时把那一组打开，其余保持用户手动开合的样子
  }
  saveOpen();
}
function toggleGroup(gi) { open[gi] = !open[gi]; saveOpen(); }
applyMode(true);
watch([() => part.value.id, curGroup], ([id, g], [oid, o]) => {
  if (id !== oid) { applyMode(true); nextTick(settleScroll); }   // 换了部分：按这一部分的存档 / 默认档重建
  else if (g !== o) { applyMode(false); nextTick(settleScroll); } // 同部分内换章：只把新组打开
});

const allOpen = computed(() => NAV.value.every((g, gi) => open[gi]));
const allShut = computed(() => NAV.value.every((g, gi) => !open[gi]));
const setAll = v => {
  NAV.value.forEach((g, gi) => { open[gi] = v; });
  saveOpen();
  nextTick(() => { scrollCur(); saveScroll(); });
};

// 左栏可能比视口高：首次进讲义时只在必要时把当前章带进视野（滚最小距离，不居中，免得把组头切掉）
const listEl = ref(null);
function scrollCur() {
  const list = listEl.value, cur = list && list.querySelector('a.on');
  if (!list || !cur) return;
  const top = cur.offsetTop, h = cur.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = Math.max(0, top - 10);
  else if (top + h > list.scrollTop + list.clientHeight) list.scrollTop = top + h - list.clientHeight + 10;
}
function saveScroll() {
  const list = listEl.value;
  if (list) NAV_SCROLL.set(memKey.value, list.scrollTop);
}
function settleScroll() {
  const list = listEl.value;
  if (!list) return;
  const memo = NAV_SCROLL.get(memKey.value);
  if (memo !== undefined) list.scrollTop = memo;
  else scrollCur();
  saveScroll();
}
onMounted(settleScroll);

const read = computed(() => isRead(route.path));
// 勾选反馈：只在「从未读 → 已读」这一次播描边 + 柔光；取消标记不播
const justDone = ref(false);
let justTimer = 0;
function toggle() {
  const willRead = !isRead(route.path);
  toggleRead(route.path);
  clearTimeout(justTimer);
  justDone.value = false;
  if (willRead) {
    nextTick(() => {
      justDone.value = true;
      justTimer = setTimeout(() => { justDone.value = false; }, 760);
    });
  }
}
onUnmounted(() => clearTimeout(justTimer));

// 右侧结构高亮
const active = ref('');
let io = null;
onMounted(() => {
  const els = props.toc.map(t => document.getElementById(t.id)).filter(Boolean);
  if (!els.length || typeof IntersectionObserver === 'undefined') return;
  active.value = els[0].id;
  io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) active.value = e.target.id; });
  }, { rootMargin: '-72px 0px -62% 0px', threshold: 0 });
  els.forEach(el => io.observe(el));
});
onUnmounted(() => { io && io.disconnect(); io = null; });

const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

// ← / → 按章序翻章（滑块聚焦时不抢键）
function onKey(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const t = document.activeElement;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
  if (e.key === 'ArrowRight' && next.value) router.push(pathOf(next.value));
  else if (e.key === 'ArrowLeft' && prev.value) router.push(pathOf(prev.value));
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.cn-off {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 5px 10px 5px 14px;
  color: var(--faint);
  opacity: 0.6;
  cursor: default;
}
.cn-off .cn-t { font-size: 13px; line-height: 1.4; }
</style>
