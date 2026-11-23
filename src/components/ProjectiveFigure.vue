<template>
  <figure class="board-wrap projective-figure">
    <div class="projective-heading">
      <span class="projective-number">图 {{ number }}</span>
      <strong>{{ title }}</strong>
    </div>
    <BoardMount :factory="factory" />
    <figcaption class="cap">
      <ul v-if="legend.length" class="projective-legend" aria-label="图例">
        <li v-for="[color, label, style] in legend" :key="label">
          <i :class="[color, style]" aria-hidden="true"></i>{{ label }}
        </li>
      </ul>
      <slot />
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
});
</script>

<style>
/* 实际墨色由画板当前纸面提供，正文与图注仍使用页面主题。 */
.projective-figure {
  margin: 24px 0;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--card);
}
.projective-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
  padding: 11px 16px;
  color: var(--ink);
  font-size: 14px;
  letter-spacing: .025em;
}
.projective-number {
  color: var(--mut);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.projective-figure .board:not(.bd-float) {
  border-width: 1px 0;
  border-radius: 0;
}
.projective-figure .cap {
  margin: 0;
  padding: 10px 16px 13px;
  color: var(--mut);
}
.projective-legend {
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
.projective-legend li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.projective-legend i { width: 17px; border-top: 2px solid var(--key-color, var(--pj-guide)); }
.projective-legend .blue { --key-color: var(--pj-blue); }
.projective-legend .gold { --key-color: var(--pj-gold); }
.projective-legend .pink { --key-color: var(--pj-pink); }
.projective-legend .mint { --key-color: var(--pj-mint); }
.projective-legend .ink { --key-color: var(--pj-ink); }
.projective-legend .dashed { border-top-style: dashed; }
.projective-legend .point {
  width: 7px;
  height: 7px;
  border: 2px solid var(--key-color, var(--pj-guide));
  border-radius: 50%;
}
.board.projective-board > .ctrl {
  --pj-rule: color-mix(in srgb, var(--pj-guide) 33%, transparent);
  --pj-panel: color-mix(in srgb, var(--pj-paper) 96%, var(--pj-ink));
  background: var(--pj-panel);
  border-color: var(--pj-rule);
}
.board.projective-board > .ctrl :is(.btn, .chip) {
  color: var(--pj-ink);
  border-color: var(--pj-rule);
  border-radius: 5px;
  background: var(--pj-paper);
}
.board.projective-board > .ctrl :is(.btn.on, .btn:hover, .btn.pri) {
  border-color: color-mix(in srgb, var(--pj-blue) 60%, var(--pj-paper));
  background: color-mix(in srgb, var(--pj-blue) 11%, var(--pj-paper));
}
.board.projective-board > .ctrl .chip {
  font-variant-numeric: tabular-nums;
  color: var(--pj-guide);
}
.board.projective-board > .ctrl .chip b,
.board.projective-board > .ctrl .slider { color: var(--pj-ink); }
.board.projective-board > .ctrl .chip.ok { border-inline-start: 2px solid var(--pj-mint); }
.board.projective-board > .ctrl .chip.warn { border-inline-start: 2px solid var(--pj-gold); }
.board.projective-board > .ctrl input[type='range'] { accent-color: var(--pj-blue); }
.board.projective-board svg text {
  fill: var(--pj-ink);
  stroke: var(--pj-paper);
}
.board.projective-board svg circle.hnd {
  stroke: transparent;
  stroke-width: 13px;
  pointer-events: all;
}
.board.projective-board svg circle.hnd:hover,
.board.projective-board svg circle.hnd.drag { r: 5.3px; }
@media (max-width: 600px) {
  .projective-heading, .projective-figure .cap { padding-inline: 12px; }
  .projective-board svg > g > text {
    transform: scale(1.6);
    transform-box: fill-box;
    transform-origin: center;
  }
  .board.projective-board svg circle.hnd { stroke-width: 30px; }
}
</style>
