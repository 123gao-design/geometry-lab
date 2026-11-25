<template>
  <div class="notes">
    <div class="chapter-head">
      <h1>笔记</h1>
      <p class="sub">按 md 或 LaTeX 写，公式照常用 $…$ / $$…$$。左栏按文件夹存放，章节页里记的笔记收在「随页笔记」；正文随时存在本机浏览器里，选过文件夹后停手一会儿还会自动写一份过去。侧栏的「备份」「导入」能把全部笔记打成一份 JSON 带走。</p>
    </div>

    <!-- 两个标签页同时开着笔记：另一处刚写过，这边显示的可能是旧的 -->
    <div v-if="SAVE.other" class="nt-warn">
      <span>另一个标签页也开着笔记，那边写过一份，这边手上的是旧的。</span>
      <button class="nt-btn" type="button" @click="reload">按存档重读</button>
    </div>

    <div class="nt-wrap">
      <aside class="nt-side">
        <div class="nt-top">
          <input v-model="q" class="nt-q" type="search" placeholder="搜索标题或正文" />
        </div>
        <div class="nt-acts">
          <button class="nt-new" type="button" @click="add">＋ 笔记</button>
          <button class="nt-new ghost" type="button" @click="startFolder">＋ 文件夹</button>
        </div>
        <div class="nt-acts two">
          <button class="nt-new ghost" type="button" title="把全部笔记和文件夹导出成一份 JSON" @click="backup">⇪ 备份</button>
          <button class="nt-new ghost" type="button" title="从备份 JSON 并进本机，同 id 的以文件为准" @click="pickImport">⇩ 导入</button>
          <input ref="fileEl" class="nt-file" type="file" accept=".json,application/json" @change="onImport" />
        </div>

        <div v-if="making" class="nt-newf">
          <input v-model="draft" class="nt-q" placeholder="文件夹名，回车创建" autofocus
            @keydown.enter="commitFolder" @keydown.esc="making = false" />
          <button class="nt-mini" type="button" @click="commitFolder">建</button>
        </div>

        <div class="nt-tree">
          <!-- 搜索：平铺命中结果 -->
          <template v-if="q.trim()">
            <button v-for="n in filtered" :key="n.id" class="nt-leaf" :class="{ on: n.id === NOTES.cur }"
              type="button" @click="openNote(n.id)">
              <span class="nt-item-t">{{ n.title }}</span>
              <span class="nt-item-m">
                <i class="nt-fmt" :class="n.format">{{ n.format === 'tex' ? 'TeX' : 'MD' }}</i>
                <span>{{ where(n) }}</span>
                <span>{{ day(n.ts) }}</span>
              </span>
            </button>
            <p v-if="!filtered.length" class="nt-empty">没有匹配的笔记</p>
          </template>

          <!-- 目录树 -->
          <template v-else>
            <div v-if="pageGroup.length" class="nt-group">
              <button class="nt-node" type="button" @click="toggle('__page')">
                <span class="nt-car">{{ isOpen('__page') ? '▾' : '▸' }}</span>
                <span class="nt-node-t">随页笔记</span>
                <em class="nt-cnt">{{ pageGroup.length }}</em>
              </button>
              <div v-if="isOpen('__page')" class="nt-leaves">
                <button v-for="n in pageGroup" :key="n.id" class="nt-leaf" :class="{ on: n.id === NOTES.cur }"
                  type="button" @click="openNote(n.id)">
                  <span class="nt-item-t">{{ n.title }}</span>
                  <span class="nt-item-m">
                    <i class="nt-fmt" :class="n.format">{{ n.format === 'tex' ? 'TeX' : 'MD' }}</i>
                    <span class="nt-path">{{ n.page || n.path }}</span>
                    <span>{{ day(n.ts) }}</span>
                  </span>
                </button>
              </div>
            </div>

            <div v-for="f in NOTES.folders" :key="f.id" class="nt-group">
              <div class="nt-grow">
                <template v-if="renaming === f.id">
                  <input v-model="renameDraft" class="nt-q nt-rename" autofocus
                    @keydown.enter="commitRename(f)" @keydown.esc="renaming = ''" @blur="commitRename(f)" />
                </template>
                <template v-else>
                  <button class="nt-node" type="button" @click="toggle(f.id)">
                    <span class="nt-car">{{ isOpen(f.id) ? '▾' : '▸' }}</span>
                    <span class="nt-node-t">{{ f.name }}</span>
                    <em class="nt-cnt">{{ notesIn(f.id).length }}</em>
                  </button>
                  <button class="nt-x" type="button" title="重命名" @click.stop="startRename(f)">✎</button>
                  <button class="nt-x" type="button" title="删掉文件夹（笔记退回未分类）" @click.stop="dropFolder(f)">×</button>
                </template>
              </div>
              <div v-if="renaming !== f.id && isOpen(f.id)" class="nt-leaves">
                <button v-for="n in notesIn(f.id)" :key="n.id" class="nt-leaf" :class="{ on: n.id === NOTES.cur }"
                  type="button" @click="openNote(n.id)">
                  <span class="nt-item-t">{{ n.title }}</span>
                  <span class="nt-item-m">
                    <i class="nt-fmt" :class="n.format">{{ n.format === 'tex' ? 'TeX' : 'MD' }}</i>
                    <span>{{ day(n.ts) }}</span>
                  </span>
                </button>
                <p v-if="!notesIn(f.id).length" class="nt-empty">空文件夹</p>
              </div>
            </div>

            <div v-if="unfiled.length" class="nt-group">
              <button class="nt-node" type="button" @click="toggle('__root')">
                <span class="nt-car">{{ isOpen('__root') ? '▾' : '▸' }}</span>
                <span class="nt-node-t">未分类</span>
                <em class="nt-cnt">{{ unfiled.length }}</em>
              </button>
              <div v-if="isOpen('__root')" class="nt-leaves">
                <button v-for="n in unfiled" :key="n.id" class="nt-leaf" :class="{ on: n.id === NOTES.cur }"
                  type="button" @click="openNote(n.id)">
                  <span class="nt-item-t">{{ n.title }}</span>
                  <span class="nt-item-m">
                    <i class="nt-fmt" :class="n.format">{{ n.format === 'tex' ? 'TeX' : 'MD' }}</i>
                    <span>{{ day(n.ts) }}</span>
                  </span>
                </button>
              </div>
            </div>

            <p v-if="!NOTES.list.length" class="nt-empty">还没有笔记，点上面的「＋ 笔记」开始。</p>
          </template>
        </div>
      </aside>

      <section v-if="note" class="nt-main">
        <div class="nt-head">
          <input v-model="note.title" class="nt-title" placeholder="笔记标题" @input="touch" />
          <div class="nt-fmt-seg">
            <button v-for="f in FORMATS" :key="f.v" type="button" :class="{ on: note.format === f.v }"
              @click="setFormat(f.v)">{{ f.t }}</button>
          </div>
        </div>

        <div class="nt-tools">
          <select v-model="note.folder" class="nt-folder-sel" title="放到哪个文件夹" @change="onFolder">
            <option value="">未分类</option>
            <option v-for="f in NOTES.folders" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
          <span v-if="note.path" class="nt-pagetag" :title="note.path">来自「{{ note.page || note.path }}」</span>
          <span class="nt-sp" />
          <div class="nt-view-seg" role="group" aria-label="编辑与预览的排法">
            <button v-for="v in VIEWS" :key="v.v" type="button" :class="{ on: view === v.v }"
              :title="v.d" @click="view = v.v">{{ v.t }}</button>
          </div>
          <button class="nt-btn" type="button" title="全屏写，Esc 退出" @click="focus = true">专注写</button>
          <button class="nt-btn" type="button" @click="saveToDir">存到文件夹</button>
          <button class="nt-btn" type="button" @click="exportPdf">导出 PDF</button>
          <button class="nt-btn" type="button" @click="download">下载源文件</button>
          <span v-if="saveText" class="nt-save" :class="{ bad: !SAVE.ok, warn: SAVE.ok && FILESAVE.err }"
            :title="saveTip">{{ saveText }}</span>
          <span v-if="msg" class="nt-msg">{{ msg }}</span>
          <button class="nt-btn danger" type="button" @click="del">删除</button>
        </div>

        <div class="nt-edit" :class="'v-' + view">
          <div v-if="view !== 'preview'" class="nt-pane">
            <textarea v-model="note.content" class="nt-ta" spellcheck="false" @input="touch"
              :placeholder="note.format === 'tex' ? '\\section{…}\n\n$\\int_0^1 x^2\\,dx = \\dfrac13$' : '# 标题\n\n正文，公式写 $x^2+y^2=r^2$'"></textarea>
          </div>
          <div v-if="view !== 'write'" class="nt-pane prev">
            <div class="nt-prev-hd">预览</div>
            <div class="nt-prev" v-html="rendered"></div>
          </div>
        </div>
      </section>

      <section v-else class="nt-main empty">
        <p>左边选一篇，或者新建一篇。</p>
      </section>
    </div>

    <!-- 专注写：整屏一块纸，Esc 退出 -->
    <div v-if="focus && note" class="nt-focus" role="dialog" aria-label="专注写作">
      <div class="nt-focus-bar">
        <input v-model="note.title" class="nt-focus-title" placeholder="笔记标题" @input="touch" />
        <span class="nt-focus-meta">{{ note.format === 'tex' ? 'LaTeX' : 'Markdown' }} · 自动保存</span>
        <button class="nt-btn" type="button" @click="focus = false">退出（Esc）</button>
      </div>
      <textarea v-model="note.content" class="nt-focus-ta" spellcheck="false" @input="touch"
        :placeholder="note.format === 'tex' ? '$\\dfrac{a}{b}$' : '正文，公式写 $x^2+y^2=r^2$'"></textarea>
    </div>

    <Teleport to="body">
      <div v-if="printing" class="note-print">
        <h1>{{ note ? note.title : '' }}</h1>
        <div class="nt-prev" v-html="printBody"></div>
        <p class="note-print-ft">几何演示实验室 · 笔记 · {{ stamp() }}</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// 笔记页（wiki 式）：左栏文件夹树 + 右栏编辑器。写入区默认整宽（写作），可切分栏 / 只看预览，
// 也可以「专注写」铺满整屏。md 走 mdmini，tex 走 KaTeX 分段渲染；导出 PDF 用打印视图。
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
  NOTES, SAVE, FILESAVE, createNote, updateNote, removeNote, getNote, fileName,
  createFolder, renameFolder, removeFolder, notesIn, pageNotes,
  exportAll, importAll, reloadNotes, flushFile, flushFiles,
} from '../lib/notes.js';
import { renderRich } from '../lib/mdmini.js';
import { downloadText, getHandle, fsSupported } from '../lib/fsdir.js';
import katex from 'katex';

const FORMATS = [{ v: 'md', t: 'Markdown' }, { v: 'tex', t: 'LaTeX' }];
const VIEWS = [
  { v: 'write', t: '写作', d: '只有输入区，整宽写' },
  { v: 'split', t: '分栏', d: '左边写、右边看' },
  { v: 'preview', t: '预览', d: '只看排版结果' },
];

const q = ref('');
const msg = ref('');
const draft = ref('');
const making = ref(false);
const renaming = ref('');
const renameDraft = ref('');
const view = ref('write');
const focus = ref(false);
const closed = reactive({});
const fileEl = ref(null);
let msgTimer = null;
const printing = ref(false);
let oldTitle = '';

const note = computed(() => getNote());
const pageGroup = computed(() => pageNotes().filter(n => !n.folder));
const unfiled = computed(() => NOTES.list.filter(n => !n.folder && !n.path).sort((a, b) => b.ts - a.ts));

const filtered = computed(() => {
  const k = q.value.trim().toLowerCase();
  const list = NOTES.list.slice().sort((a, b) => b.ts - a.ts);
  if (!k) return list;
  return list.filter(n => (n.title + '\n' + n.content).toLowerCase().includes(k));
});

const rendered = computed(() => {
  const n = note.value;
  if (!n) return '';
  return n.format === 'tex' ? renderTex(n.content) : renderRich(n.content);
});

// 打印视图顶部已经写了标题：正文首行若是同名的 # 标题就不重复排一遍
const printBody = computed(() => {
  const n = note.value;
  if (!n) return '';
  if (n.format === 'md') {
    const m = String(n.content).match(/^\s*#\s+([^\n]+)\n?/);
    if (m && m[1].replace(/[*_`]/g, '').trim() === String(n.title || '').trim()) {
      return renderRich(String(n.content).slice(m[0].length));
    }
  }
  return rendered.value;
});

// LaTeX 笔记：把 $…$ / $$…$$ 交给 KaTeX，其余按等宽文本排（不假装能编译整份 .tex 文档）
function renderTex(src) {
  const s = String(src || '');
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m;
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  while ((m = re.exec(s))) {
    if (m.index > last) out.push('<pre class="tex-plain">' + esc(s.slice(last, m.index).trim()) + '</pre>');
    const tex = m[1] || m[2];
    out.push('<div class="md-math">' + katex.renderToString(tex, { displayMode: !!m[1], throwOnError: false }) + '</div>');
    last = re.lastIndex;
  }
  if (last < s.length) out.push('<pre class="tex-plain">' + esc(s.slice(last).trim()) + '</pre>');
  return out.join('\n');
}

const day = ts => new Date(ts || Date.now()).toLocaleDateString('zh-CN');
const stamp = () => new Date().toLocaleString('zh-CN');
const clock = ts => new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

// 存档状态：先看本地那一份成没成（没成是最要紧的），再看文件夹那份是不是最新的——
// 刚打完字时文件夹那份还落在后面，这时只报本机的时刻，等它追上再换成「已存到」
const saveText = computed(() => {
  if (!SAVE.ok) return SAVE.err || '这篇没存进去';
  if (FILESAVE.err) return '自动存文件夹没成';
  if (FILESAVE.at && FILESAVE.at >= SAVE.at) return '已存到 · ' + clock(FILESAVE.at);
  if (SAVE.at) return '已存 · ' + clock(SAVE.at);
  return '';
});
const saveTip = computed(() => {
  if (!SAVE.ok) return SAVE.err || '浏览器没让写本地存档';
  if (FILESAVE.err) return FILESAVE.err;
  if (FILESAVE.where) return '写到了 ' + FILESAVE.where;
  return '浏览器本地存档';
});
const isOpen = id => !closed[id];
const toggle = id => { closed[id] = isOpen(id); };

function where(n) {
  if (n.path) return n.page || '随页笔记';
  const f = NOTES.folders.find(x => x.id === n.folder);
  return f ? f.name : '未分类';
}

function say(t) {
  msg.value = t;
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { msg.value = ''; }, 3600);
}

function add() {
  // 新笔记跟着当前这篇所在的文件夹走
  const cur = note.value;
  const n = createNote('md', { title: '新笔记 ' + (NOTES.list.length + 1), folder: cur ? cur.folder : '' });
  NOTES.cur = n.id;
  nextTick(() => {
    const el = document.querySelector('.nt-title');
    if (el) el.focus();
  });
}

function startFolder() {
  making.value = true;
  draft.value = '';
  nextTick(() => {
    const el = document.querySelector('.nt-newf .nt-q');
    if (el) el.focus();
  });
}

function commitFolder() {
  const f = createFolder(draft.value);
  making.value = false;
  draft.value = '';
  if (f) {
    closed[f.id] = false;
    say('已建文件夹「' + f.name + '」');
  }
}

function startRename(f) {
  renaming.value = f.id;
  renameDraft.value = f.name;
  nextTick(() => {
    const el = document.querySelector('.nt-rename');
    if (el) { el.focus(); el.select(); }
  });
}

function commitRename(f) {
  if (renaming.value !== f.id) return;
  renameFolder(f.id, renameDraft.value || f.name);
  renaming.value = '';
}

function dropFolder(f) {
  const n = notesIn(f.id).length;
  const tip = n ? '删掉文件夹「' + f.name + '」？里面的 ' + n + ' 篇笔记会退回「未分类」，不会丢。' : '删掉空文件夹「' + f.name + '」？';
  if (!window.confirm(tip)) return;
  removeFolder(f.id);
  say('已删除文件夹「' + f.name + '」');
}

function openNote(id) { NOTES.cur = id; }

function touch() {
  const n = note.value;
  if (n) updateNote(n.id, { title: n.title, content: n.content });
}

function onFolder() {
  const n = note.value;
  if (!n) return;
  updateNote(n.id, { folder: n.folder });
  const f = NOTES.folders.find(x => x.id === n.folder);
  say(f ? '已放进「' + f.name + '」' : '已移回未分类');
}

function setFormat(v) {
  const n = note.value;
  if (!n) return;
  updateNote(n.id, { format: v });
  say(v === 'tex' ? '已切成 LaTeX：公式写 $…$，导出 .tex' : '已切成 Markdown：导出 .md');
}

async function saveToDir() {
  const n = note.value;
  if (!n) return;
  if (!fsSupported()) { say('这个浏览器不能直接写文件夹，用「下载源文件」'); return; }
  let h = null;
  try { h = await getHandle('note'); } catch (e) { h = null; }
  if (!h) { say('还没选笔记文件夹，去「设置 → 保存位置」选一个'); return; }
  // 点这一下就是一次用户动作：权限过期时也正好在这里续上（见 notes.js 的 flushFile）
  const where2 = await flushFile(n.id);
  say(where2 ? '已存到 ' + where2 : '没存成：' + (FILESAVE.err || '原因不明'));
}

/* ---------- 整份备份与导入 ---------- */
function backup() {
  try {
    say('已导出 ' + exportAll());
  } catch (e) {
    say('导出没成：' + (e.message || e));
  }
}

function pickImport() {
  if (fileEl.value) fileEl.value.click();
}

function onImport(ev) {
  const f = ev.target.files && ev.target.files[0];
  ev.target.value = '';        // 选同一个文件两次也要有反应
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const r = importAll(String(rd.result || ''));
      say(`已导入：新增 ${r.added} 篇，更新 ${r.updated} 篇`);
    } catch (e) {
      say('导入没成：' + (e.message || e));
    }
  };
  rd.onerror = () => say('读不了这个文件');
  rd.readAsText(f);
}

function reload() {
  reloadNotes();
  say('已按本地存档重读');
}

function download() {
  const n = note.value;
  if (!n) return;
  downloadText(fileName(n), n.content, n.format === 'tex' ? 'application/x-tex;charset=utf-8' : 'text/markdown;charset=utf-8');
}

async function exportPdf() {
  if (!note.value) return;
  printing.value = true;
  await nextTick();
  document.body.classList.add('printing-note');
  // 打印对话框里的文件名默认取页面标题：临时换成笔记标题，取消打印也会还回去
  oldTitle = document.title;
  document.title = (note.value.title || '笔记') + ' · 几何演示实验室';
  setTimeout(() => window.print(), 80);
}

function del() {
  const n = note.value;
  if (!n) return;
  if (!window.confirm('删掉「' + n.title + '」？删了就找不回来了。')) return;
  removeNote(n.id);
}

function endPrint() {
  document.body.classList.remove('printing-note');
  printing.value = false;
  if (oldTitle) { document.title = oldTitle; oldTitle = ''; }
}

function onKey(e) {
  if (e.key === 'Escape' && focus.value) { focus.value = false; }
}

onMounted(() => {
  window.addEventListener('afterprint', endPrint);
  window.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  window.removeEventListener('afterprint', endPrint);
  window.removeEventListener('keydown', onKey);
  endPrint();
  // 离开笔记页前把攒着的自动保存写掉，别等下一轮定时器
  flushFiles();
});
</script>

<style scoped>
.nt-wrap { display: grid; grid-template-columns: 268px minmax(0, 1fr); gap: 18px; margin-top: 14px; align-items: start; }
.nt-side { border: 1px solid var(--line); border-radius: 14px; background: var(--card); padding: 10px; position: sticky; top: 64px; }
.nt-top { display: flex; gap: 8px; margin-bottom: 8px; }
.nt-q { flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--ink); background: var(--bg2);
  border: 1px solid var(--line); border-radius: 9px; padding: 6px 10px; outline: none; }
.nt-q:focus { border-color: var(--blue); }
.nt-acts { display: flex; gap: 6px; margin-bottom: 8px; }
.nt-acts.two .nt-new { flex: 1; }
.nt-file { display: none; }
.nt-warn { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px;
  font-size: 12.5px; color: var(--yellow); background: color-mix(in srgb, var(--yellow) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--yellow) 34%, transparent); border-radius: 11px; padding: 8px 14px; }
.nt-new { flex: 1; font: inherit; font-size: 12.5px; color: #fff; background: var(--blue); border: none;
  border-radius: 9px; padding: 6px 10px; cursor: pointer; }
.nt-new.ghost { flex: none; color: var(--mut); background: transparent; border: 1px solid var(--line); }
.nt-new.ghost:hover { color: var(--ink); border-color: var(--mut); }
.nt-newf { display: flex; gap: 6px; margin-bottom: 8px; }
.nt-mini { flex: none; font: inherit; font-size: 12.5px; color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 9px; padding: 4px 12px; cursor: pointer; }
.nt-mini:hover { color: var(--ink); border-color: var(--mut); }

.nt-tree { display: flex; flex-direction: column; gap: 2px; max-height: calc(100vh - 260px); overflow: auto; }
.nt-group { display: flex; flex-direction: column; }
.nt-grow { display: flex; align-items: center; gap: 2px; }
.nt-node { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; text-align: left; font: inherit;
  font-size: 13px; color: var(--mut); background: none; border: none; border-radius: 8px; padding: 6px 8px; cursor: pointer; }
.nt-node:hover { background: var(--bg2); color: var(--ink); }
.nt-car { flex: none; width: 10px; font-size: 10px; color: var(--faint); }
.nt-node-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nt-cnt { flex: none; font-style: normal; font-size: 11px; color: var(--faint); }
.nt-x { flex: none; font: inherit; font-size: 12px; line-height: 1; color: var(--faint); background: none;
  border: none; border-radius: 6px; padding: 4px 5px; cursor: pointer; opacity: 0; transition: opacity .12s; }
.nt-grow:hover .nt-x { opacity: 1; }
.nt-x:hover { color: var(--pink); background: rgba(255, 123, 138, .12); }
.nt-rename { margin: 2px 4px; }
.nt-leaves { display: flex; flex-direction: column; gap: 1px; padding-left: 16px; }
.nt-leaf { display: flex; flex-direction: column; gap: 2px; text-align: left; font: inherit; color: var(--mut);
  background: none; border: none; border-radius: 8px; padding: 6px 9px; cursor: pointer; }
.nt-leaf:hover { background: var(--bg2); color: var(--ink); }
.nt-leaf.on { background: rgba(92, 173, 255, .13); color: var(--blue); }
.nt-item-t { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nt-item-m { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--faint); }
.nt-fmt { font-style: normal; border: 1px solid var(--line); border-radius: 5px; padding: 0 4px; font-size: 10px; }
.nt-fmt.tex { color: var(--green); border-color: color-mix(in srgb, var(--green) 45%, transparent); }
.nt-path { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nt-empty { color: var(--faint); font-size: 12.5px; padding: 8px 10px; margin: 0; line-height: 1.7; }

.nt-main { min-width: 0; }
.nt-main.empty { color: var(--faint); padding: 40px 0; text-align: center; }
.nt-head { display: flex; align-items: center; gap: 12px; }
.nt-title { flex: 1; min-width: 0; font: inherit; font-size: 21px; font-weight: 700; color: var(--ink);
  background: transparent; border: none; border-bottom: 1px dashed transparent; padding: 4px 0; outline: none; }
.nt-title:focus { border-bottom-color: var(--line); }
.nt-fmt-seg { flex: none; display: flex; gap: 3px; padding: 3px; border: 1px solid var(--line); border-radius: 99px; }
.nt-fmt-seg button { font: inherit; font-size: 12px; color: var(--mut); background: none; border: none;
  border-radius: 99px; padding: 3px 12px; cursor: pointer; }
.nt-fmt-seg button.on { color: var(--ink); background: var(--line); }

.nt-tools { display: flex; align-items: center; gap: 8px; margin: 10px 0; flex-wrap: wrap; }
.nt-folder-sel { font: inherit; font-size: 12.5px; color: var(--mut); background: var(--bg2);
  border: 1px solid var(--line); border-radius: 9px; padding: 4px 8px; max-width: 170px; }
.nt-pagetag { font-size: 11.5px; color: var(--blue); background: rgba(92, 173, 255, .1);
  border: 1px solid rgba(92, 173, 255, .3); border-radius: 99px; padding: 2px 9px; }
.nt-view-seg { display: flex; gap: 2px; padding: 3px; border: 1px solid var(--line); border-radius: 99px; }
.nt-view-seg button { font: inherit; font-size: 12px; color: var(--mut); background: none; border: none;
  border-radius: 99px; padding: 2px 11px; cursor: pointer; }
.nt-view-seg button.on { color: var(--ink); background: var(--line); }
.nt-btn { font: inherit; font-size: 12.5px; color: var(--mut); background: transparent; border: 1px solid var(--line);
  border-radius: 9px; padding: 4px 12px; cursor: pointer; }
.nt-btn:hover { color: var(--ink); border-color: var(--mut); }
.nt-btn.danger:hover { color: var(--pink); border-color: var(--pink); }
.nt-sp { flex: 1; }
.nt-msg { font-size: 12px; color: var(--blue); }
.nt-save { font-size: 11.5px; color: var(--faint); white-space: nowrap; cursor: default; }
.nt-save.warn { color: var(--yellow); }
.nt-save.bad { color: var(--pink); }

.nt-edit { display: grid; gap: 14px; align-items: stretch; }
.nt-edit.v-split { grid-template-columns: 1fr 1fr; }
.nt-edit.v-write, .nt-edit.v-preview { grid-template-columns: minmax(0, 1fr); }
.nt-pane { min-width: 0; border: 1px solid var(--line); border-radius: 14px; background: var(--card); overflow: hidden; }
.nt-ta { display: block; width: 100%; height: calc(100vh - 300px); min-height: 380px; resize: vertical;
  font-family: var(--font-mono); font-size: 13.5px; line-height: 1.85; color: var(--ink);
  background: transparent; border: none; outline: none; padding: 16px 20px; }
.nt-prev-hd { padding: 8px 16px; font-size: 12px; color: var(--faint); border-bottom: 1px solid var(--line); }
.nt-prev { padding: 10px 18px 20px; height: calc(100vh - 334px); min-height: 346px; overflow: auto;
  font-size: 14.5px; line-height: 1.8; }
.nt-prev :deep(h1) { font-size: 1.45em; margin: .5em 0 .3em; }
.nt-prev :deep(h2) { font-size: 1.25em; margin: .6em 0 .3em; }
.nt-prev :deep(h3) { font-size: 1.1em; margin: .6em 0 .25em; }
.nt-prev :deep(p) { margin: .5em 0; }
.nt-prev :deep(ul), .nt-prev :deep(ol) { margin: .4em 0; padding-left: 1.5em; }
.nt-prev :deep(code) { font-family: var(--font-mono); font-size: .9em; background: rgba(255, 255, 255, .07);
  padding: 1px 5px; border-radius: 5px; }
.nt-prev :deep(.md-code) { padding: 10px 12px; border-radius: 10px; background: rgba(0, 0, 0, .25); overflow: auto; }
.nt-prev :deep(blockquote) { margin: .5em 0; padding: 2px 12px; border-left: 3px solid var(--line); color: var(--mut); }
.nt-prev :deep(.md-math) { margin: .5em 0; overflow-x: auto; overflow-y: hidden; }
.nt-prev :deep(.md-table) { border-collapse: collapse; margin: .6em 0; }
.nt-prev :deep(.md-table th), .nt-prev :deep(.md-table td) { border: 1px solid var(--line); padding: 4px 10px; }
.nt-prev :deep(.tex-plain) { margin: .4em 0; font-family: var(--font-mono); font-size: 12.5px;
  color: var(--mut); white-space: pre-wrap; }
.nt-prev :deep(a) { color: var(--blue); }

/* 专注写：铺满整屏，Esc 回来 */
.nt-focus { position: fixed; inset: 46px 0 0; z-index: 130; display: flex; flex-direction: column;
  background: var(--bg); padding: 0 0 16px; }
.nt-focus-bar { flex: none; display: flex; align-items: center; gap: 14px; padding: 10px 24px;
  border-bottom: 1px solid var(--line); }
.nt-focus-title { flex: 1; min-width: 0; font: inherit; font-size: 17px; font-weight: 600; color: var(--ink);
  background: transparent; border: none; outline: none; }
.nt-focus-meta { flex: none; font-size: 11.5px; color: var(--faint); }
.nt-focus-ta { flex: 1; min-height: 0; width: 100%; max-width: 980px; margin: 0 auto; display: block;
  resize: none; font-family: var(--font-mono); font-size: 14.5px; line-height: 1.95;
  color: var(--ink); background: transparent; border: none; outline: none; padding: 22px 26px; }

@media (max-width: 1100px) {
  .nt-wrap { grid-template-columns: 1fr; }
  .nt-side { position: static; }
  .nt-tree { max-height: 260px; }
  .nt-edit.v-split { grid-template-columns: 1fr; }
  .nt-ta, .nt-prev { height: 46vh; min-height: 260px; }
  .nt-tools .nt-view-seg { order: 3; }
}
/* 窄屏左侧浮钮会压住第一列文字，给笔记页让出这条缝 */
@media (max-width: 900px) { .notes { padding-left: 52px; } }
</style>
