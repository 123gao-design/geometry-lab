<template>
  <component :is="to ? RouterLink : 'a'" v-bind="to ? { to } : external"
    class="reading-link" :class="{ 'reading-link-inline': inline }">
    <span v-if="back" class="reading-arrow" aria-hidden="true">←</span>
    <span v-if="chapter" class="reading-chapter">{{ chapter }}</span>
    <span class="reading-label"><slot /></span>
    <span v-if="!inline && !back" class="reading-arrow" aria-hidden="true">{{ to ? '→' : '↗' }}</span>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  to: String,
  href: String,
  chapter: String,
  back: Boolean,
  inline: Boolean,
});

const external = computed(() => ({ href: props.href, target: '_blank', rel: 'noopener noreferrer' }));
</script>

<style scoped>
.reading-link {
  display: inline-flex;
  align-items: center;
  gap: .65em;
  max-width: 100%;
  min-height: 36px;
  padding: .4em .75em;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--card);
  color: var(--ink);
  font-size: .92em;
  line-height: 1.45;
  text-decoration: none;
}
.reading-link:hover,
.reading-link:focus-visible {
  border-color: var(--blue);
  background: color-mix(in srgb, var(--blue) 9%, var(--card));
}
.reading-link:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 3px;
}
.reading-label {
  min-width: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.reading-chapter {
  flex: none;
  padding-inline-end: .65em;
  border-inline-end: 1px solid var(--line);
  color: var(--mut);
  font-size: .85em;
  font-variant-numeric: tabular-nums;
}
.reading-arrow {
  flex: none;
  color: var(--blue);
}
.reading-link-inline {
  display: inline;
  min-height: 0;
  padding: 0 .18em;
  border: 0;
  background: none;
  color: var(--blue);
  font-size: 1em;
  text-decoration: underline;
  text-underline-offset: .2em;
}
@media print {
  .reading-link { color: inherit; background: transparent; }
}
</style>
