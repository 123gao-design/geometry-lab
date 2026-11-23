<template>
  <figure class="board-wrap conic-figure">
    <div v-if="head !== 'bottom'" class="conic-heading">
      <span class="conic-number">图 {{ number }}</span>
      <strong>{{ title }}</strong>
    </div>
    <BoardMount :factory="factory" :id="id" />
    <figcaption class="cap">
      <ul v-if="legend.length" class="conic-legend" aria-label="图例">
        <li v-for="[color, label, style] in legend" :key="label">
          <i :class="[color, style]" aria-hidden="true"></i>{{ label }}
        </li>
      </ul>
      <template v-if="head === 'bottom'">
        <span class="conic-number">图 {{ number }}</span>
        <strong class="conic-cap-title">{{ title }}</strong>：<slot />
      </template>
      <slot v-else />
    </figcaption>
  </figure>
</template>

<script setup>
import BoardMount from './BoardMount.vue';

defineProps({
  number: { type: String, required: true },
  title: { type: String, required: true },
  factory: { type: Function, required: true },
  legend: { type: Array, default: () => [] },
  /* 'top' 题头在板上方（圆锥曲线各章沿用）；'bottom' 图号与图名挪到图注行 */
  head: { type: String, default: 'top' },
  /* 板号：同一页有多块板时给画板一个可读的 URL 命名空间（墨迹与文字位置也按它存） */
  id: { type: String, default: '' },
});
</script>

<style>
/* 实际墨色由画板当前纸面提供，正文与图注仍使用页面主题。 */
.conic-figure {
  margin: 24px 0;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--card);
  /* 工具条提到卡片外之后，卡片顶部直接就是画板。画板自己的圆角在卡片里被抹平
     （见下方 .conic-figure .board 那条），方形底会盖住卡片的上圆角；裁一下，让上角跟着卡片走 */
  overflow: hidden;
}
.conic-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
  padding: 11px 16px;
  color: var(--ink);
  font-size: 14px;
  letter-spacing: .025em;
}
.conic-number {
  color: var(--mut);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.conic-cap-title { color: var(--ink); margin: 0 1px; }
.conic-figure .board:not(.bd-float) {
  border-width: 1px 0;
  border-radius: 0;
}
.conic-figure .cap {
  margin: 0;
  padding: 10px 16px 13px;
  color: var(--mut);
}
.conic-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 16px;
  list-style: none;
  padding: 5px 10px;
  margin: 0 0 8px;
  border-radius: 5px;
  background: var(--pj-paper, var(--bg2));
  color: var(--pj-ink, var(--ink));
}
.conic-legend li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.conic-legend i { width: 17px; border-top: 2px solid var(--key-color, var(--pj-guide)); }
.conic-legend .blue { --key-color: var(--pj-blue); }
.conic-legend .gold { --key-color: var(--pj-gold); }
.conic-legend .pink { --key-color: var(--pj-pink); }
.conic-legend .mint { --key-color: var(--pj-mint); }
.conic-legend .green { --key-color: var(--pj-green); }
.conic-legend .orange { --key-color: var(--pj-orange); }
.conic-legend .violet { --key-color: var(--pj-violet); }
.conic-legend .ink { --key-color: var(--pj-ink); }
.conic-legend .dashed { border-top-style: dashed; }
.conic-legend .point {
  width: 7px;
  height: 7px;
  border: 2px solid var(--key-color, var(--pj-guide));
  border-radius: 50%;
}
.board.conic-board > .ctrl {
  --pj-rule: color-mix(in srgb, var(--pj-guide) 33%, transparent);
  --pj-panel: color-mix(in srgb, var(--pj-paper) 96%, var(--pj-ink));
  background: var(--pj-panel);
  border-color: var(--pj-rule);
}
.board.conic-board > .ctrl :is(.btn, .chip) {
  color: var(--pj-ink);
  border-color: var(--pj-rule);
  border-radius: 5px;
  background: var(--pj-paper);
}
.board.conic-board > .ctrl :is(.btn.on, .btn:hover, .btn.pri) {
  border-color: color-mix(in srgb, var(--pj-blue) 60%, var(--pj-paper));
  background: color-mix(in srgb, var(--pj-blue) 11%, var(--pj-paper));
}
.board.conic-board > .ctrl .chip {
  font-variant-numeric: tabular-nums;
  color: var(--pj-guide);
}
.board.conic-board > .ctrl .chip b,
.board.conic-board > .ctrl .slider { color: var(--pj-ink); }
.board.conic-board > .ctrl .chip.ok { border-inline-start: 2px solid var(--pj-mint); }
.board.conic-board > .ctrl .chip.warn { border-inline-start: 2px solid var(--pj-gold); }
.board.conic-board > .ctrl input[type='range'] { accent-color: var(--pj-blue); }
.board.conic-board svg text {
  fill: var(--pj-ink);
  stroke: var(--pj-paper);
}
.board.conic-board svg circle.hnd {
  stroke: transparent;
  stroke-width: 13px;
  pointer-events: all;
}
.board.conic-board svg circle.hnd:hover,
.board.conic-board svg circle.hnd.drag { r: 5.3px; }
/* 补充实验把可调输入和读数分成两条窄栏，纸色仍由画板设置决定。 */
.board.conic-instrument > .ctrl { gap: 7px 9px; padding-block: 9px; }
.board.conic-instrument > .chips { border-top: 1px solid var(--pj-rule) !important; padding-block: 8px !important; }
.board.conic-instrument > .chips .chip { margin: 0; padding-inline: 9px; min-width: 0; max-width: 100%; }
.board.conic-instrument > .chips .chip span { min-width: 0; overflow-wrap: anywhere; }
.board.conic-instrument > .ctrl button:disabled { opacity: .45; cursor: default; }
.board.conic-instrument > .ctrl button:focus-visible { outline: 2px solid var(--pj-blue); outline-offset: 2px; }
@media (max-width: 600px) {
  .conic-heading, .conic-figure .cap { padding-inline: 12px; }
  .conic-board svg > g > text {
    transform: scale(1.6);
    transform-box: fill-box;
    transform-origin: center;
  }
  .board.conic-board svg circle.hnd { stroke-width: 30px; }
}
</style>
