<template>
  <button
    ref="btnEl"
    type="button"
    :class="[bar ? 'dl' : 'pp-solo', { on: open }]"
    title="画板纸面：底色、网格、字号与线宽"
    @click.stop="toggle"
  >▦ 纸面</button>

  <Teleport to="body">
    <div v-if="open" ref="popEl" class="pp-pop" :style="pos" @pointerdown.stop @click.stop @dblclick.stop>
      <div class="pp-t">画板纸面</div>
      <div class="pp-grid">
        <button
          v-for="p in PAPERS"
          :key="p.id"
          type="button"
          class="pp-s"
          :class="{ on: PREFS.physPaper === p.id }"
          :title="p.t"
          @click="pick(p.id)"
        >
          <i class="pp-chip" :style="{ background: chipOf(p) }" />
          <span class="pp-n">{{ shortName(p) }}</span>
        </button>
      </div>

      <div class="pp-hr" />

      <div class="pp-row">
        <span class="pp-k">背景网格</span>
        <div class="pp-seg">
          <button
            v-for="g in GRIDS"
            :key="g.v"
            type="button"
            :class="{ on: PREFS.physGrid === g.v }"
            :title="g.tip"
            @click="setPref('physGrid', g.v)"
          >{{ g.t }}</button>
        </div>
      </div>
      <label class="pp-row">
        <span class="pp-k">字号</span>
        <input type="range" min="0.8" max="1.6" step="0.05" :value="PREFS.physFont" @input="num('physFont', $event)" />
        <b class="pp-v">{{ pct(PREFS.physFont) }}</b>
      </label>
      <label class="pp-row">
        <span class="pp-k">线条</span>
        <input type="range" min="0.6" max="2.5" step="0.05" :value="PREFS.physLineW" @input="num('physLineW', $event)" />
        <b class="pp-v">{{ pct(PREFS.physLineW) }}</b>
      </label>
      <label class="pp-row">
        <span class="pp-k">轴线</span>
        <input type="range" min="0.6" max="3" step="0.05" :value="PREFS.physAxisW" @input="num('physAxisW', $event)" />
        <b class="pp-v">{{ pct(PREFS.physAxisW) }}</b>
      </label>

      <div class="pp-f">与设置页「物理画板纸面 / 画板字号与线宽」同一项</div>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { PAPERS } from '../lib/papers.js';
import { PREFS, setPref } from '../lib/settings.js';

/* bar=true：长在演示板那条 .dlbar 里，套用全局 .dl 的样式；
   bar=false：长在实验页右下 .acts 里，用本组件自己的圆角描边按钮 */
defineProps({ bar: { type: Boolean, default: true } });

const open = ref(false);
const btnEl = ref(null);
const popEl = ref(null);
const pos = ref({ left: '0px', top: '0px' });

/* 背景网格：自动 = 画了坐标网格的板先收起纸面方格，免得两套网格叠在一起 */
const GRIDS = [
  { v: 'auto', t: '自动', tip: '有坐标网格时收起纸面方格' },
  { v: 'on', t: '显示', tip: '始终显示纸面方格' },
  { v: 'off', t: '隐藏', tip: '不画纸面方格' },
];

const num = (k, e) => setPref(k, Number(e.target.value));
const pct = v => Math.round((Number(v) || 1) * 100) + '%';

/* 「纸白 · 浅蓝」这类名字分成两截：格子里只放前半截，全名进 title */
function shortName(p) {
  return String(p.t).split(' · ')[0];
}

function chipOf(p) {
  const a = (p.sw && p.sw[0]) || '#10161f';
  const b = (p.sw && p.sw[1]) || '#fbf6ea';
  return 'linear-gradient(140deg, ' + a + ' 0%, ' + a + ' 46%, ' + b + ' 54%, ' + b + ' 100%)';
}

/* 面板挂 body（操作条在板内、板有 overflow:hidden，挂在里面会被裁掉），
   按按钮的屏幕位置现算；下方放不下就翻到按钮上面 */
function place() {
  const b = btnEl.value;
  if (!b) return;
  const r = b.getBoundingClientRect();
  const el = popEl.value;
  const w = el ? el.offsetWidth : 268;
  const h = el ? el.offsetHeight : 260;
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), Math.max(8, vw - w - 8));
  let top = r.bottom + 8;
  if (top + h > vh - 8) top = Math.max(8, r.top - h - 8);
  pos.value = { left: left + 'px', top: top + 'px' };
}

async function toggle() {
  open.value = !open.value;
  if (open.value) {
    await nextTick();
    place();
  }
}

function pick(id) {
  setPref('physPaper', id);
  open.value = false;
}

function onDoc(e) {
  if (!open.value) return;
  if (popEl.value && popEl.value.contains(e.target)) return;
  if (btnEl.value && btnEl.value.contains(e.target)) return;
  open.value = false;
}
function onKey(e) {
  if (e.key === 'Escape') open.value = false;
}
function onResize() {
  if (open.value) place();
}

onMounted(() => {
  document.addEventListener('pointerdown', onDoc, true);
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDoc, true);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
/* 实验页 .acts 里的样子：跟旁边那些小胶囊一个调子；演示板里直接穿全局 .dl，这一条不生效 */
.pp-solo {
  position: static; top: auto; right: auto;
  padding: 3px 12px;
  font: inherit; font-size: 12.5px; line-height: 1.5;
  color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 99px;
  cursor: pointer;
  transition: color .13s ease, border-color .13s ease;
}
.pp-solo:hover { color: var(--blue); border-color: var(--blue); }
.pp-solo.on { color: var(--blue); border-color: var(--blue); }

.pp-pop {
  position: fixed; z-index: 220;
  width: 272px;
  display: flex; flex-direction: column; gap: 9px;
  padding: 11px 12px 10px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .3);
}
.pp-t { font-size: 11.5px; letter-spacing: .02em; color: var(--faint); }
.pp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.pp-s {
  display: flex; flex-direction: column; align-items: stretch; gap: 4px;
  padding: 4px 4px 5px;
  font: inherit; font-size: 11.5px; color: var(--mut);
  background: transparent; border: 1px solid transparent; border-radius: 9px;
  cursor: pointer;
  transition: border-color .13s ease, background .13s ease, color .13s ease;
}
.pp-s:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
.pp-s.on {
  color: var(--blue); border-color: var(--blue);
  background: color-mix(in srgb, var(--blue) 9%, transparent);
}
.pp-chip {
  display: block; height: 26px; border-radius: 6px;
  border: 1px solid var(--line);
}
.pp-s.on .pp-chip { border-color: color-mix(in srgb, var(--blue) 55%, var(--line)); }
.pp-n { font-size: 11.5px; line-height: 1.25; text-align: center; white-space: nowrap; }

/* 字号 / 线宽 / 网格：与纸面同一张面板，改完当场重绘（外壳下一帧就去读） */
.pp-hr { height: 1px; background: var(--line); margin: 1px 0; }
.pp-row { display: flex; align-items: center; gap: 8px; }
.pp-k { flex: none; width: 46px; font-size: 11.5px; color: var(--mut); }
.pp-v { flex: none; width: 38px; text-align: right; font-size: 11.5px; font-weight: 500; color: var(--ink); font-variant-numeric: tabular-nums; }
.pp-row input[type='range'] { flex: 1 1 auto; min-width: 0; height: 14px; accent-color: var(--blue); cursor: pointer; }
.pp-seg { display: flex; gap: 3px; flex: 1 1 auto; }
.pp-seg button {
  flex: 1 1 0; padding: 3px 0;
  font: inherit; font-size: 11.5px; color: var(--mut);
  background: transparent; border: 1px solid var(--line); border-radius: 99px;
  cursor: pointer; transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.pp-seg button:hover { color: var(--ink); }
.pp-seg button.on { color: var(--blue); border-color: var(--blue); background: color-mix(in srgb, var(--blue) 9%, transparent); }
.pp-f { font-size: 11px; line-height: 1.5; color: var(--faint); }
</style>
