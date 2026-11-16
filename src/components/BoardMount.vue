<template><div ref="host" class="board"></div></template>
<script setup>
// 通用画板挂载点：factory(rootEl) 返回 Board 实例；离开页面自动销毁（清理动画）。
// id 可选：作为实验参数进 URL 的命名空间（默认 b1/b2…，多画板页建议显式命名以便链接可读）。
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({
  factory: { type: Function, required: true },
  id: { type: String, default: '' },
});
const host = ref();
let board = null;
onMounted(() => {
  board = props.factory(host.value);
  if (!board) return;
  if (props.id) {
    board.qid = props.id;
    board.refreshLabels && board.refreshLabels(); // 板号换了：按新板号重读拖过的文字位置并重画一次
  }
  board.applyQuery && board.applyQuery(); // 从 hash query 还原实验现场
});
onUnmounted(() => { board && board.destroy && board.destroy(); });
</script>
