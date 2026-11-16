<template>
  <div class="chap3" :class="{ 'no-toc': !toc.length }">
    <aside class="chapnav">
      <div class="chapnav-hd">
        <div class="chapnav-t">{{ mod ? mod.t : '章节导航' }}</div>
        <template v-if="mod">
          <div class="cn-tools">
            <button class="cn-tb" :class="{ on: allOpen }" @click="setAll(true)">展开全部</button>
            <button class="cn-tb" :class="{ on: allShut }" @click="setAll(false)">合并全部</button>
          </div>
        </template>
      </div>
      <div class="cn-body" ref="listEl" @scroll.passive="saveScroll">
        <template v-if="mod">
          <div v-for="(g, gi) in mod.groups" :key="gi" class="cn-grp">
            <button class="cn-g" :class="{ on: gi === curGroup }" @click="toggleGroup(gi)">
              <span class="cn-arw" :class="{ open: open[gi] }">▸</span>
              <span class="cn-gt">{{ g.t }}</span>
              <span class="cn-gn" :class="{ all: readCount(g) === g.items.length }">{{ readCount(g) }}/{{ g.items.length }}</span>
            </button>
            <div v-show="open[gi]" class="cn-list">
              <router-link v-for="(c, i) in g.items" :key="c.path" :to="c.path" :class="{ on: route.path === c.path }">
                <span class="cn-i">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="cn-t">{{ c.t }}</span>
                <i v-if="isRead(c.path)" class="rd">✓</i>
              </router-link>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link v-for="(t, i) in chap" :key="i" :to="bse + (i + 1)" :class="{ on: cur === i + 1 }">
            <span class="cn-i">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="cn-t">{{ t }}</span>
            <i v-if="isRead(bse + (i + 1))" class="rd">✓</i>
          </router-link>
        </template>
      </div>
      <div class="cn-pg">
        <router-link v-if="prev" :to="prev.path">← 上一章</router-link>
        <router-link v-if="next" :to="next.path">下一章 →</router-link>
      </div>
    </aside>

    <div class="chapmain">
      <nav v-if="tabs.length > 1" class="chaptabs">
        <router-link v-for="(c, i) in tabs" :key="c.path" :to="c.path" :class="{ on: route.path === c.path }">
          <span class="ct-n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ct-t">{{ c.t }}</span>
        </router-link>
      </nav>

      <div class="chapter-head">
        <h1><span class="no">{{ no || ('§' + cur) }}</span><span v-html="texMix(title)"></span></h1>
        <p class="sub" v-if="sub" v-html="texMix(sub)"></p>
      </div>

      <article>
        <slot />
        <div class="read-row">
          <button class="readmark" :class="{ on: read }" @click="toggle">
            {{ read ? '✓ 本章已读 · 点击取消' : '读完了？标记本章' }}
          </button>
          <span class="readtip">← / → 键翻章</span>
        </div>
      </article>
    </div>

    <aside v-if="toc.length" class="toc">
      <div class="toc-t">本讲结构</div>
      <a v-for="(t, i) in toc" :key="t.id" :class="{ on: active === t.id }" @click="go(t.id)">
        <span class="toc-n">{{ String(i + 1).padStart(2, '0') }}</span>
        <span v-html="texMix(t.t)"></span>
      </a>
    </aside>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { texMix } from '../lib/board.js'; // title/sub/toc 支持 '$…$' 公式段（2026-11-09 公式集中修复起启用）
import { DEFAULT_CHAPTERS, DEFAULT_BASE } from './nav-defaults.js';
import { isRead, toggleRead } from '../lib/progress.js';
import { moduleOf } from '../lib/modnav.js';
import { NAV_OPEN, NAV_SCROLL } from '../lib/navpos.js';
import { PREFS } from '../lib/settings.js';

const props = defineProps({
  cur: { type: Number, required: true },
  title: { type: String, required: true },
  sub: { type: String, default: '' },
  toc: { type: Array, default: () => [] }, // [{id, t}] —— 本讲结构（右侧栏）
  no: { type: String, default: '' },       // 章节角标（默认 '§' + cur）
  chapters: { type: Array, default: undefined }, // 兜底：取不到模块大纲时用本子专题的章节表
  base: { type: String, default: undefined },
});

const route = useRoute(), router = useRouter();
const chap = computed(() => (props.chapters && props.chapters.length ? props.chapters : DEFAULT_CHAPTERS));
const bse = computed(() => props.base || DEFAULT_BASE);

// 左栏：整模块的章节大纲（子专题可折叠，不省略任何章；由 modnav 现算，章名取自各子专题的 nav 文件）
const mod = computed(() => moduleOf(route.path));
const here = computed(() => (mod.value ? mod.value.all.findIndex(c => c.path === route.path) : -1));
const prev = computed(() => (here.value > 0 ? mod.value.all[here.value - 1] : null));
const next = computed(() => (here.value >= 0 && here.value < mod.value.all.length - 1 ? mod.value.all[here.value + 1] : null));
const curGroup = computed(() => (mod.value ? mod.value.groups.findIndex(g => g.items.some(c => c.path === route.path)) : -1));
const readCount = g => g.items.filter(c => isRead(c.path)).length;
// 左栏的状态按模块记（navpos.js）：折叠表与滚动位置都存起来，翻章与来回模块时原样恢复
const memKey = computed(() => (mod.value ? route.path.split('/')[1] : 'base:' + bse.value));
// 折叠状态：进页默认方式在「设置 → 章节导航默认折叠」里选（当前子专题 / 全展开 / 全收起），
// 栏顶「展开全部 / 合并全部」两枚互斥按钮只是当下改一改，手动点组头即离开这两态；
// 本模块上次留下的开合样子优先于默认方式（2026-11-13 起），翻章时列表长度不变，位置才稳得住
const open = reactive({});
function applyMode(reset) {
  if (!mod.value) return;
  const mode = PREFS.navOpen;
  if (reset) {
    Object.keys(open).forEach(k => delete open[k]);
    const saved = NAV_OPEN.get(memKey.value);
    const kept = Array.isArray(saved) && saved.length === mod.value.groups.length;
    mod.value.groups.forEach((g, gi) => {
      open[gi] = kept ? !!saved[gi] : mode === 'all' ? true : mode === 'none' ? false : gi === curGroup.value;
    });
    if (kept && mode !== 'none' && curGroup.value >= 0) open[curGroup.value] = true; // 当前子专题总归开着
  } else {
    mod.value.groups.forEach((g, gi) => {
      if (gi === curGroup.value && mode !== 'none') open[gi] = true; // 翻到别的子专题时把那组打开
    });
  }
  saveOpen();
}
// 开合写回记忆：改一处存一处，比挂深层 watch 稳（换模块时不必担心新旧状态撞在一起）
function saveOpen() {
  if (mod.value) NAV_OPEN.set(memKey.value, mod.value.groups.map((g, gi) => !!open[gi]));
}
function toggleGroup(gi) { open[gi] = !open[gi]; saveOpen(); }
applyMode(true);
// 换模块：重建折叠表；换子专题：把新组打开（其余保持用户手动开合的样子）
watch(mod, () => { applyMode(true); nextTick(settleScroll); });
watch(curGroup, (g, o) => { if (g !== o) { applyMode(false); nextTick(settleScroll); } });
const allOpen = computed(() => !!mod.value && mod.value.groups.every((g, gi) => open[gi]));
const allShut = computed(() => !!mod.value && mod.value.groups.every((g, gi) => !open[gi]));
const setAll = v => { if (mod.value) { mod.value.groups.forEach((g, gi) => { open[gi] = v; }); saveOpen(); nextTick(() => { scrollCur(); saveScroll(); }); } };

// 标题上方的章内导航：当前子专题的几章（子专题只有一个章时不必铺）
const tabs = computed(() => {
  if (mod.value) {
    const g = mod.value.groups[curGroup.value];
    return g ? g.items : [];
  }
  return chap.value.map((t, i) => ({ t, path: bse.value + (i + 1) }));
});

const read = computed(() => isRead(route.path));
const toggle = () => toggleRead(route.path);

// 左栏可能比视口高：首次进某个模块时只在必要时把当前章带进视野（滚最小距离，不居中，免得把组头切掉），页面本身不动
const listEl = ref(null);
function scrollCur() {
  const list = listEl.value, cur = list && list.querySelector('a.on');
  if (!list || !cur) return;
  const top = cur.offsetTop, h = cur.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = Math.max(0, top - 10);
  else if (top + h > list.scrollTop + list.clientHeight) list.scrollTop = top + h - list.clientHeight + 10;
}
// 滚动位置按模块记（navpos.js）：全部展开时列表很长，翻章后回到本模块要停在原处，不能每次都跳到当前章
function saveScroll() {
  const list = listEl.value;
  if (list) NAV_SCROLL.set(memKey.value, list.scrollTop);
}
function settleScroll() {
  const list = listEl.value;
  if (!list) return;
  const memo = NAV_SCROLL.get(memKey.value);
  // 折叠表已按记忆还原，列表还是上次那一份，位置原样还回去；头一回进本模块才做最小滚动
  if (memo !== undefined) list.scrollTop = memo;
  else scrollCur();
  saveScroll();
}
onMounted(settleScroll);

// 右侧「本讲结构」高亮跟随滚动：看到哪个小节，哪一条亮起来
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

// 键盘翻章：← / →（整模块顺序）。焦点在输入类控件（滑块也算 INPUT）时不抢键；带修饰键（浏览器快捷键）不抢键
function onKey(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const t = document.activeElement;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
  if (!mod.value) {
    if (e.key === 'ArrowRight' && props.cur < chap.value.length) router.push(bse.value + (props.cur + 1));
    else if (e.key === 'ArrowLeft' && props.cur > 1) router.push(bse.value + (props.cur - 1));
    return;
  }
  if (e.key === 'ArrowRight' && next.value) router.push(next.value.path);
  else if (e.key === 'ArrowLeft' && prev.value) router.push(prev.value.path);
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));

// hash 路由占用 location.hash，页内锚点只能程序化滚动
const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
</script>
