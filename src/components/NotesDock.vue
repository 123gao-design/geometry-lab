<template>
  <aside v-if="open" class="notes-dock" role="dialog" aria-label="随页笔记">
    <div class="nd-head">
      <div class="nd-head-in">
        <strong>笔记</strong>
        <span class="nd-page" :title="pageLabel">{{ pageLabel }}</span>
        <span class="nd-sp" />
        <button class="nd-btn" type="button" title="在这一页新建一条笔记" @click="add">＋ 新笔记</button>
        <router-link class="nd-btn" to="/notes" title="打开笔记页：目录、文件夹、导出">全部笔记</router-link>
        <button class="nd-btn" type="button" title="收起（Esc）" @click="close">收起</button>
      </div>
    </div>

    <div class="nd-body">
      <div v-if="!list.length" class="nd-empty">
        <p class="nd-empty-t">这一页还没有笔记</p>
        <p class="nd-empty-s">边看边记，写下的笔记会挂在「{{ pageLabel }}」这一页下面，之后在笔记页按页或按文件夹都能找回来。</p>
        <button class="nd-cta" type="button" @click="add">在这一页新建笔记</button>
      </div>

      <template v-else>
        <div class="nd-list">
          <button v-for="n in list" :key="n.id" class="nd-item" :class="{ on: n.id === NOTES.cur }"
            type="button" @click="pick(n.id)">
            <span class="nd-item-t">{{ n.title }}</span>
            <span class="nd-item-d">{{ day(n.ts) }}</span>
          </button>
        </div>

        <div v-if="note" class="nd-edit">
          <input v-model="note.title" class="nd-title" placeholder="笔记标题" @input="touch" />
          <textarea v-model="note.content" class="nd-ta" spellcheck="false" @input="touch"
            :placeholder="note.format === 'tex' ? '随手记两句，公式写 $…$' : '随手记两句，公式写 $x^2+y^2=r^2$'"></textarea>
          <div class="nd-foot">
            <span class="nd-hint">自动保存</span>
            <span class="nd-sp" />
            <button class="nd-link" type="button" title="删掉这一条" @click="del">删除</button>
            <router-link class="nd-link" to="/notes">去笔记页继续写 →</router-link>
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
// 随页笔记：章节页里随手打开的窄条笔记窗，默认落在当前这一页的笔记上。
// 新建的笔记带 path / page，笔记页里归到「随页笔记」一组，正文与全局共用 gl-notes。
import { computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NOTES, createNote, updateNote, removeNote, getNote, notesOfPage } from '../lib/notes.js';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['update:open']);
const route = useRoute();

const list = computed(() => notesOfPage(route.path));
const note = computed(() => (list.value.some(n => n.id === NOTES.cur) ? getNote() : null));

// 页面标题：章节页 h1 里编号徽章（.no）之外那段；没有就退回路由片段
const pageLabel = computed(() => {
  const h1 = document.querySelector('.chapter-head h1');
  if (h1) {
    const t = h1.querySelector('span:not(.no)');
    const s = (t && t.textContent ? t.textContent : h1.textContent || '').replace(/\s+/g, ' ').trim();
    if (s) return s;
  }
  const seg = route.path.split('/').filter(Boolean);
  return seg.length ? seg[seg.length - 1] : '本页';
});

const day = ts => new Date(ts || Date.now()).toLocaleDateString('zh-CN');

// 打开时优先落在这一页已有的笔记上
function pickDefault() {
  const l = list.value;
  if (l.length && !l.some(n => n.id === NOTES.cur)) NOTES.cur = l[0].id;
}

watch(() => props.open, v => { if (v) pickDefault(); }, { immediate: true });
watch(() => route.path, () => { if (props.open) pickDefault(); });

function pick(id) { NOTES.cur = id; }

function add() {
  const n = createNote('md', {
    title: pageLabel.value + ' · 随页笔记',
    content: '',
    path: route.path,
    page: pageLabel.value,
  });
  NOTES.cur = n.id;
}

function touch() {
  const n = note.value;
  if (n) updateNote(n.id, { title: n.title, content: n.content });
}

function del() {
  const n = note.value;
  if (!n) return;
  if (!window.confirm('删掉「' + n.title + '」？')) return;
  removeNote(n.id);
  pickDefault();
}

function close() { emit('update:open', false); }

// Esc 收起，和助手窗一致
function onKey(e) {
  if (e.key === 'Escape' && props.open) close();
}
window.addEventListener('keydown', onKey);
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.notes-dock {
  position: fixed; top: 46px; right: 0; bottom: 0; z-index: 95;
  width: min(460px, 100vw);
  display: flex; flex-direction: column;
  background: var(--bg); border-left: 1px solid var(--line);
  box-shadow: -18px 0 40px rgba(0, 0, 0, .22);
}
.nd-head { flex: none; border-bottom: 1px solid var(--line); padding: 0 12px; }
.nd-head-in { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 48px; min-width: 0; }
.nd-head strong { flex: none; font-size: 13.5px; line-height: 1.4; color: var(--ink); letter-spacing: .3px; white-space: nowrap; }
.nd-page { min-width: 0; font-size: 12px; color: var(--faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nd-sp { flex: 1; }
.nd-btn { flex: none; font: inherit; font-size: 12.5px; color: var(--mut); background: transparent; text-decoration: none;
  border: 1px solid var(--line); border-radius: 99px; padding: 3px 11px; cursor: pointer; white-space: nowrap; }
.nd-btn:hover { color: var(--ink); border-color: var(--mut); }

.nd-body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 12px 14px 14px; }
.nd-empty { margin: auto; max-width: 320px; text-align: center; padding: 0 8px; }
.nd-empty-t { font-size: 15px; color: var(--ink); margin: 0 0 6px; }
.nd-empty-s { font-size: 12.5px; color: var(--mut); line-height: 1.75; margin: 0 0 14px; }
.nd-cta { font: inherit; font-size: 13px; color: #fff; background: var(--blue); border: none;
  border-radius: 99px; padding: 7px 16px; cursor: pointer; }

.nd-list { flex: none; display: flex; flex-direction: column; gap: 2px; max-height: 148px; overflow: auto;
  margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.nd-item { display: flex; align-items: center; gap: 8px; text-align: left; font: inherit; color: var(--mut);
  background: none; border: none; border-radius: 8px; padding: 6px 9px; cursor: pointer; }
.nd-item:hover { background: var(--bg2); color: var(--ink); }
.nd-item.on { background: rgba(92, 173, 255, .13); color: var(--blue); }
.nd-item-t { flex: 1; min-width: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nd-item-d { flex: none; font-size: 11px; color: var(--faint); }

.nd-edit { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 8px; }
.nd-title { font: inherit; font-size: 15px; font-weight: 600; color: var(--ink); background: transparent;
  border: none; border-bottom: 1px dashed var(--line); padding: 2px 0 6px; outline: none; }
.nd-title:focus { border-bottom-color: var(--blue); }
.nd-ta { flex: 1; min-height: 180px; resize: none; font-family: ui-monospace, Menlo, monospace; font-size: 13px;
  line-height: 1.8; color: var(--ink); background: var(--card); border: 1px solid var(--line);
  border-radius: 12px; padding: 12px 13px; outline: none; }
.nd-ta:focus { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
.nd-foot { flex: none; display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: var(--faint); }
.nd-link { font: inherit; font-size: 11.5px; color: var(--faint); background: none; border: none; padding: 0;
  cursor: pointer; text-decoration: none; }
.nd-link:hover { color: var(--blue); }

@media print { .notes-dock { display: none !important; } }
</style>
