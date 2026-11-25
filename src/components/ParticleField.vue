<template>
  <canvas ref="canvas" class="particle-field" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { mountParticleField } from '../lib/particle-field.js';

const props = defineProps({
  background: Boolean,
  strength: { type: Number, default: 1 },
});
const canvas = ref(null);
let field;
onMounted(() => {
  field = mountParticleField(canvas.value, { background: props.background, strength: () => props.strength });
});
watch(() => props.strength, () => field?.draw());
onBeforeUnmount(() => field?.dispose());
</script>

<style>
.particle-field { display: block; width: 100%; height: 100%; pointer-events: none }
.particle-background { position: fixed; inset: 0; z-index: -1 }
html.no-anim .particle-background { visibility: hidden }
@media print { .particle-field { display: none } }
</style>
