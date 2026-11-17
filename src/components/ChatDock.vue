<template>
  <aside v-if="open" class="chat-dock" :class="[side, size]" role="dialog" aria-label="AI 助手">
    <div class="cd-head">
      <div class="cd-head-in">
        <strong>助手</strong>
        <select v-if="MODELS.list.length" class="cd-sel" :value="MODELS.active" @change="onPickModel($event.target.value)"
          title="选择模型（在设置页里管理）">
          <option v-for="m in MODELS.list" :key="m.id" :value="m.id">{{ m.name }}</option>
        </select>
        <span v-else class="cd-warn">未配置模型</span>
        <span class="cd-sp" />
        <button class="cd-btn" type="button" title="新对话" @click="startNew">新对话</button>
        <button class="cd-btn" type="button" title="历史对话" :class="{ on: histOpen }" @click="histOpen = !histOpen">记录</button>
        <button class="cd-btn" type="button" :title="size === 'full' ? '切成半屏' : '铺满整屏'" @click="toggleSize">
          {{ size === 'full' ? '半屏' : '整屏' }}
        </button>
        <button class="cd-btn" type="button" title="收起（Esc）" @click="close">收起</button>
      </div>
    </div>

    <div v-if="histOpen" class="cd-hist">
      <div v-if="!CHATS.list.length" class="cd-hist-empty">还没有对话</div>
      <div v-for="c in CHATS.list" :key="c.id" class="cd-hist-row" :class="{ on: c.id === CHATS.cur }">
        <button class="cd-hist-t" type="button" @click="openChat(c.id)">{{ c.title }}</button>
        <button class="cd-hist-x" type="button" title="删除这段对话" @click="dropChat(c.id)">×</button>
      </div>
    </div>

    <div ref="bodyEl" class="cd-body">
      <div v-if="!msgs.length" class="cd-empty">
        <p class="cd-empty-t">有什么想问的？</p>
        <p class="cd-empty-s">当前这一页的内容会自动带上，可以直接问「这里为什么成立」。</p>
        <div class="cd-chips">
          <button v-for="s in SUGGEST" :key="s" class="cd-chip" type="button" @click="draft = s; focusInput()">{{ s }}</button>
        </div>
        <p v-if="!MODELS.list.length" class="cd-empty-warn">
          还没有模型。去 <router-link to="/settings">设置 → 模型与 API</router-link> 填一个接口地址和密钥，就能开始对话。
        </p>
      </div>

      <div v-for="(m, i) in msgs" :key="i" class="cd-row" :class="m.role">
        <div v-if="m.role === 'assistant'" class="cd-ava" aria-hidden="true">AI</div>
        <div class="cd-bubble" :class="{ err: !!m.err }">
          <div v-if="m.role === 'assistant'" class="cd-md" v-html="m.content ? rich(m.content) : typingHtml"></div>
          <div v-else class="cd-text">{{ m.content }}</div>
          <div v-if="m.err" class="cd-err">{{ m.err }}</div>
          <div v-if="m.role === 'assistant' && m.content" class="cd-acts">
            <button class="cd-mini" type="button" @click="copy(m.content)">复制</button>
            <button class="cd-mini" type="button" @click="toNote(m.content)">存为笔记</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cd-foot">
      <div class="cd-box">
        <textarea ref="inputEl" v-model="draft" class="cd-input" rows="1" placeholder="问点什么…（Enter 发送，Shift+Enter 换行）"
          @keydown.enter.exact.prevent="send" @input="grow" />
        <button v-if="sending" class="cd-send stop" type="button" title="停止" @click="stop">■</button>
        <button v-else class="cd-send" type="button" :disabled="!draft.trim()" title="发送" @click="send">↑</button>
      </div>
      <div class="cd-hint">
        <span v-if="notice" class="cd-notice">{{ notice }}</span>
        <span v-else>{{ size === 'half' ? '半屏' : '整屏' }} · {{ side === 'right' ? '靠右' : '靠左' }}</span>
        <span class="cd-sp" />
        <button class="cd-link" type="button" :disabled="!msgs.length" @click="saveToDir">存到目录</button>
        <button class="cd-link" type="button" :disabled="!msgs.length" @click="exportMd">导出 Markdown</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
// 半屏 / 整屏的聊天窗：与画板小窗同一套呼出方式（设置页里可选靠左靠右）。
// 对话存本地，接口按 OpenAI 兼容格式流式读取；模型与密钥在设置页里配。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PREFS, setPref } from '../lib/settings.js';
import { MODELS, setActiveModel, activeModel } from '../lib/models.js';
import { CHATS, getChat, newChat, pushMessage, removeChat, renameChat, streamReply, chatToMarkdown, persistChats } from '../lib/chat.js';
import { renderRich, plain, preloadKatex } from '../lib/mdmini.js';
import { writeInto, getHandle, downloadText } from '../lib/fsdir.js';
import { NOTES, createNote, updateNote } from '../lib/notes.js';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['update:open']);
const route = useRoute();
const router = useRouter();

const side = computed(() => PREFS.chatSide);
const size = computed(() => PREFS.chatSize);
const SUGGEST = ['这一页在讲什么', '这里的式子为什么成立', '出一道同类型的题'];

/* KaTeX 是按需取的（见 lib/mdmini.js）：取到之前 renderRich 会把公式退成源码，
   取到后靠 mdTick 触发一次重渲染，手上这轮对话才看得见公式。 */
const mdTick = ref(0);
const rich = s => { mdTick.value; return renderRich(s); };
onMounted(() => { preloadKatex().then(() => { mdTick.value++; }); });

const bodyEl = ref(null);
const inputEl = ref(null);
const draft = ref('');
const sending = ref(false);
const histOpen = ref(false);
const dirName = ref('');
const notice = ref('');
const typingHtml = '<p class=cd-typing>···</p>';
let ac = null;
let noticeTimer = null;

function say(msg) {
  notice.value = msg;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { notice.value = ''; }, 3600);
}

const chat = computed(() => getChat());
const msgs = computed(() => (chat.value ? chat.value.messages : []));

function focusInput() { nextTick(() => inputEl.value && inputEl.value.focus()); }
function close() { emit('update:open', false); }
function toggleSize() { setPref('chatSize', size.value === 'full' ? 'half' : 'full'); }
function onPickModel(id) { setActiveModel(id); }

function startNew() {
  newChat();
  histOpen.value = false;
  draft.value = '';
  scrollBottom();
  focusInput();
}
function openChat(id) { CHATS.cur = id; persistChats(); histOpen.value = false; scrollBottom(); }
function dropChat(id) {
  if (!window.confirm('删掉这段对话？删了就找不回来了。')) return;
  removeChat(id);
}
function grow() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 180) + 'px';
}
function scrollBottom() {
  nextTick(() => { const b = bodyEl.value; if (b) b.scrollTop = b.scrollHeight; });
}

// 把当前页面的标题交给模型当背景，问「这里为什么」时不用再贴一遍
function sysPrompt() {
  const h1 = document.querySelector('.chapter-head h1, main h1');
  const title = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
  return '你是「几何演示实验室」里的高中数学助教。' +
    (title ? '用户正在看「' + title + '」这一页（' + route.path + '）。' : '') +
    '用中文回答，公式一律用 $…$（行内）或 $$…$$（独立成行）书写；讲解分步骤、句子短，先给结论再给理由，不要客套话。';
}

async function send() {
  const text = draft.value.trim();
  if (!text || sending.value) return;
  const c = getChat() || newChat();
  pushMessage(c, { role: 'user', content: text });
  if (c.messages.length === 1) renameChat(c.id, plain(text, 24));
  draft.value = '';
  nextTick(grow);
  scrollBottom();

  const cfg = activeModel();
  const out = pushMessage(c, { role: 'assistant', content: '' });
  scrollBottom();
  if (!cfg) {
    out.content = '';
    out.err = '还没有配置模型。打开「设置 → 模型与 API」填好接口地址、模型名与密钥再来。';
    persistChats();
    return;
  }
  // 请求只带正式的历史（去掉刚插入的空回复占位）
  const payload = [{ role: 'system', content: sysPrompt() }]
    .concat(c.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })));
  sending.value = true;
  ac = new AbortController();
  try {
    await streamReply(cfg, payload, t => { out.content += t; scrollBottom(); }, ac.signal);
  } catch (e) {
    if (e && e.name === 'AbortError') {
      if (!out.content) out.content = '';
      out.err = '已停止';
    } else {
      out.err = (e && e.message) ? e.message : String(e);
    }
  } finally {
    sending.value = false;
    ac = null;
    persistChats();
    scrollBottom();
  }
}
function stop() { if (ac) ac.abort(); }

function copy(text) {
  try { navigator.clipboard.writeText(text); } catch (e) { /* 剪贴板不可用就算了 */ }
}
function toNote(text) {
  const n = createNote('md');
  updateNote(n.id, { title: '助手回复 · ' + new Date().toLocaleDateString('zh-CN'), content: text });
  NOTES.cur = n.id;
  router.push('/notes');
}

function exportMd() {
  const c = getChat();
  if (!c) return;
  downloadText(plain(c.title, 30) + '.md', chatToMarkdown(c), 'text/markdown;charset=utf-8');
}

async function saveToDir() {
  const c = getChat();
  if (!c) return;
  try {
    const h = await getHandle('chat');
    dirName.value = h ? h.name : '';
    if (!h) { // 还没选过目录：直接跳去设置
      if (window.confirm('还没有设置对话保存目录，去设置页选一个？')) router.push('/settings');
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    const name = (plain(c.title, 40).replace(/[\\/:*?"<>|]/g, '_') || '对话') + '-' + stamp + '.md';
    const where = await writeInto('chat', name, chatToMarkdown(c));
    say('已存到 ' + where);
  } catch (e) {
    say('保存失败：' + (e.message || e));
  }
}

// Esc 收起
function onKey(e) {
  if (e.key !== 'Escape' || !props.open) return;
  close();
}
onMounted(async () => {
  window.addEventListener('keydown', onKey);
  try { const h = await getHandle('chat'); dirName.value = h ? h.name : ''; } catch (e) { /* 无痕模式 */ }
  scrollBottom();
});
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); if (ac) ac.abort(); });

// 复用同一个组件时换对话要滚到底
watch(() => CHATS.cur, () => scrollBottom());
watch(() => props.open, o => { if (o) { scrollBottom(); focusInput(); histOpen.value = false; } });
</script>

<style scoped>
.chat-dock {
  position: fixed; top: 46px; right: 0; bottom: 0; z-index: 95;
  width: 50vw; max-width: 100vw;
  display: flex; flex-direction: column;
  background: var(--bg); border-left: 1px solid var(--line);
  box-shadow: -18px 0 40px rgba(0, 0, 0, .22);
}
.chat-dock.left { left: 0; right: auto; border-left: none; border-right: 1px solid var(--line);
  box-shadow: 18px 0 40px rgba(0, 0, 0, .22); }
.chat-dock.full { width: 100vw; border: none; box-shadow: none; }

/* 整屏时标题和正文列对齐：栏宽跟 .cd-row / .cd-box 的 760px 一脉相承，
   不然「助手」两个字贴在视口最左缘，看着像出了框 */
.cd-head { flex: none; border-bottom: 1px solid var(--line); position: relative; padding: 0 12px; }
.cd-head-in { display: flex; align-items: center; gap: 8px; width: 100%; max-width: 812px; margin: 0 auto;
  min-height: 48px; min-width: 0; }
.cd-head strong { flex: none; font-size: 13.5px; line-height: 1.4; color: var(--ink); letter-spacing: .3px; white-space: nowrap; }
.cd-sel { font: inherit; font-size: 12.5px; color: var(--mut); background: var(--bg2); min-width: 0;
  border: 1px solid var(--line); border-radius: 8px; padding: 3px 6px; max-width: 190px; }
.cd-warn { font-size: 12px; color: var(--orange); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cd-sp { flex: 1; }
.cd-btn { font: inherit; font-size: 12.5px; color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 99px; padding: 3px 11px; cursor: pointer; white-space: nowrap; }
.cd-btn:hover, .cd-btn.on { color: var(--ink); border-color: var(--mut); }
.cd-btn.on { color: var(--blue); border-color: var(--blue); }

.cd-hist { position: absolute; top: 100%; right: 10px; z-index: 3; width: 280px; max-height: 320px; overflow: auto;
  padding: 6px; border: 1px solid var(--line); border-radius: 12px; background: var(--card);
  box-shadow: 0 14px 36px rgba(0, 0, 0, .3); }
.chat-dock.left .cd-hist { right: auto; left: 10px; }
.cd-hist-empty { padding: 10px 12px; font-size: 12.5px; color: var(--faint); }
.cd-hist-row { display: flex; align-items: center; gap: 4px; border-radius: 8px; }
.cd-hist-row:hover { background: var(--bg2); }
.cd-hist-row.on { background: rgba(92, 173, 255, .12); }
.cd-hist-t { flex: 1; min-width: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font: inherit; font-size: 13px; color: var(--mut); background: none; border: none; padding: 7px 9px; cursor: pointer; }
.cd-hist-row.on .cd-hist-t { color: var(--blue); }
.cd-hist-x { flex: none; font: inherit; font-size: 14px; color: var(--faint); background: none; border: none;
  padding: 4px 8px; cursor: pointer; border-radius: 8px; }
.cd-hist-x:hover { color: var(--pink); background: rgba(255, 123, 138, .12); }

.cd-body { flex: 1; min-height: 0; overflow: auto; padding: 18px 0 10px; }
.cd-empty { max-width: 620px; margin: 12vh auto 0; padding: 0 22px; text-align: center; }
.cd-empty-t { font-size: 19px; color: var(--ink); margin: 0 0 6px; font-family: Georgia, 'Songti SC', serif; }
.cd-empty-s { font-size: 13.5px; color: var(--mut); margin: 0; }
.cd-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; }
.cd-chip { font: inherit; font-size: 13px; color: var(--mut); background: var(--card); border: 1px solid var(--line);
  border-radius: 99px; padding: 6px 14px; cursor: pointer; }
.cd-chip:hover { color: var(--ink); border-color: var(--mut); }
.cd-empty-warn { margin-top: 20px; font-size: 12.5px; color: var(--orange); }
.cd-empty-warn a { color: var(--blue); }

.cd-row { display: flex; gap: 10px; max-width: 760px; margin: 0 auto; padding: 8px 22px; align-items: flex-start; }
.cd-row.user { justify-content: flex-end; }
.cd-ava { flex: none; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 10.5px; font-weight: 700; color: #fff; background: var(--blue); margin-top: 2px; }
.cd-bubble { min-width: 0; max-width: 88%; border-radius: 14px; padding: 8px 13px; font-size: 14.5px; line-height: 1.78; }
.cd-row.user .cd-bubble { background: rgba(92, 173, 255, .14); border: 1px solid rgba(92, 173, 255, .28);
  white-space: pre-wrap; word-break: break-word; }
.cd-row.assistant .cd-bubble { background: transparent; padding-left: 0; padding-right: 0; max-width: 100%; flex: 1; }
.cd-bubble.err { color: var(--orange); }
.cd-text { white-space: pre-wrap; word-break: break-word; }
.cd-err { margin-top: 6px; font-size: 12.5px; color: var(--orange); }
.cd-acts { margin-top: 4px; display: flex; gap: 6px; opacity: .55; transition: opacity .15s; }
.cd-bubble:hover .cd-acts { opacity: 1; }
.cd-mini { font: inherit; font-size: 11.5px; color: var(--faint); background: none; border: 1px solid var(--line);
  border-radius: 7px; padding: 1px 8px; cursor: pointer; }
.cd-mini:hover { color: var(--ink); border-color: var(--mut); }
.cd-typing { color: var(--faint); letter-spacing: 2px; }

/* 助手消息里的 Markdown 排版 */
.cd-md :deep(p) { margin: .45em 0; }
.cd-md :deep(h1), .cd-md :deep(h2), .cd-md :deep(h3), .cd-md :deep(h4) { margin: .8em 0 .35em; font-size: 1.05em; color: var(--ink); }
.cd-md :deep(ul), .cd-md :deep(ol) { margin: .4em 0; padding-left: 1.4em; }
.cd-md :deep(li) { margin: .2em 0; }
.cd-md :deep(code) { font-family: ui-monospace, Menlo, monospace; font-size: .9em; padding: 1px 5px;
  border-radius: 5px; background: rgba(255, 255, 255, .08); }
.cd-md :deep(.md-code) { margin: .6em 0; padding: 10px 12px; border-radius: 10px; overflow: auto;
  background: rgba(0, 0, 0, .28); border: 1px solid var(--line); }
.cd-md :deep(.md-code code) { background: none; padding: 0; font-size: 12.5px; line-height: 1.6; }
.cd-md :deep(blockquote) { margin: .5em 0; padding: 2px 12px; border-left: 3px solid var(--line); color: var(--mut); }
.cd-md :deep(.md-math) { margin: .5em 0; overflow-x: auto; overflow-y: hidden; }
.cd-md :deep(.md-table) { border-collapse: collapse; margin: .6em 0; font-size: .95em; }
.cd-md :deep(.md-table th), .cd-md :deep(.md-table td) { border: 1px solid var(--line); padding: 4px 10px; }
.cd-md :deep(a) { color: var(--blue); }
.cd-md :deep(hr) { border: none; border-top: 1px solid var(--line); margin: .8em 0; }

.cd-foot { flex: none; border-top: 1px solid var(--line); padding: 10px 14px 8px; }
.cd-box { display: flex; align-items: flex-end; gap: 8px; max-width: 760px; margin: 0 auto;
  border: 1px solid var(--line); border-radius: 16px; background: var(--bg2); padding: 8px 8px 8px 14px; }
.cd-box:focus-within { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
.cd-input { flex: 1; min-height: 24px; max-height: 180px; resize: none; border: none; outline: none;
  background: transparent; color: var(--ink); font: inherit; font-size: 14.5px; line-height: 1.7; padding: 4px 0; }
.cd-send { flex: none; width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer;
  background: var(--blue); color: #fff; font-size: 15px; line-height: 1; }
.cd-send:disabled { opacity: .35; cursor: default; }
.cd-send.stop { background: var(--pink); font-size: 10px; }
.cd-hint { display: flex; align-items: center; gap: 10px; max-width: 760px; margin: 6px auto 0;
  font-size: 11.5px; color: var(--faint); }
.cd-notice { color: var(--blue); }
.cd-link { font: inherit; font-size: 11.5px; color: var(--faint); background: none; border: none; cursor: pointer; padding: 0; }
.cd-link:hover { color: var(--blue); }
.cd-link:disabled { opacity: .4; cursor: default; }

@media print { .chat-dock { display: none !important; } }
@media (max-width: 900px) { .chat-dock { width: 100vw; } .cd-row { padding-left: 14px; padding-right: 14px; } }
</style>
