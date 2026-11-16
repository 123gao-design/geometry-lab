<template><span ref="el" class="ktx"></span></template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import katex from 'katex';

const props = defineProps({
  tex: { type: String, required: true },
  display: { type: Boolean, default: false }, // display=true 居中块级公式
});
const el = ref();
const render = () => {
  katex.render(props.tex, el.value, { displayMode: props.display, throwOnError: false });
};
onMounted(render);
watch(() => props.tex, render);
</script>
