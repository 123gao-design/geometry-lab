/* 阅读进度：localStorage 持久化 + 响应式仓库（无后端，离线可用） */
import { reactive } from 'vue';

const KEY = 'gl-read';

function load() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
  catch (_) { return new Set(); } // 损坏数据或隐私模式：当作空进度
}

/** 全局已读集合；模板里 READ.set.has(path) 或 isRead(path) 都是响应式的 */
export const READ = reactive({ set: load() });
export const isRead = p => READ.set.has(p);

export function toggleRead(p) {
  READ.set.has(p) ? READ.set.delete(p) : READ.set.add(p);
  try { localStorage.setItem(KEY, JSON.stringify([...READ.set])); } catch (_) { /* 隐私模式忽略 */ }
}
