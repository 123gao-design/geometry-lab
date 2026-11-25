<template>
  <aside v-if="open" class="chat-dock" :class="[side, size]" role="dialog" aria-label="AI 助手">
    <div class="cd-head">
      <div class="cd-head-in">
        <span class="cd-brand">
          <span class="cd-ava sm" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="7.2" opacity=".85"/>
              <path d="M8.4 15.2 12 8.6l3.6 6.6z"/>
              <circle cx="12" cy="12" r="1.15" fill="#fff" stroke="none"/>
            </svg>
          </span>
          <strong>助手</strong>
        </span>
        <div v-if="MODELS.list.length" class="cd-selwrap" :class="{ open: modelOpen }">
          <button class="cd-seltog" type="button" :aria-expanded="modelOpen" title="选择模型（在设置页里管理）"
            @click="modelOpen = !modelOpen">
            <span class="cd-selnm">{{ curModel ? curModel.name : '选择模型' }}</span>
            <span class="cd-caret">▾</span>
          </button>
          <div v-if="modelOpen" class="cd-menu" role="listbox" aria-label="选择模型">
            <button v-for="m in MODELS.list" :key="m.id" class="cd-mi" :class="{ on: m.id === MODELS.active }"
              type="button" role="option" :aria-selected="m.id === MODELS.active" @click="pickModel(m.id)">
              <span class="cd-mi-n">{{ m.name }}</span>
              <span class="cd-mi-m">{{ m.model || '未填模型名' }}</span>
              <span v-if="m.id === MODELS.active" class="cd-mi-ck">✓</span>
            </button>
            <button class="cd-mi-add" type="button" @click="goSettings">设置里添加或修改…</button>
          </div>
        </div>
        <span v-else class="cd-warn">未配置模型</span>
        <span class="cd-sp" />
        <button v-if="size === 'full'" class="cd-btn cd-ico" type="button"
          :title="PREFS.chatHist === 'on' ? '收起对话列表' : '展开对话列表'" @click="toggleHist">☰</button>
        <button class="cd-btn" type="button" title="新对话" @click="startNew">新对话</button>
        <button v-if="size !== 'full' || PREFS.chatHist !== 'on'" class="cd-btn" type="button" title="历史对话" :class="{ on: histOpen }" @click="histOpen = !histOpen">记录</button>
        <button class="cd-btn" type="button" :title="size === 'full' ? '切成半屏' : '铺满整屏'" @click="toggleSize">
          {{ size === 'full' ? '半屏' : '整屏' }}
        </button>
        <button class="cd-btn" type="button" title="收起（Esc）" @click="close">收起</button>
      </div>
    </div>

    <div v-if="histOpen && size !== 'full'" class="cd-hist">
      <div class="cd-hist-hd">
        <span class="cd-side-ttl">历史记录</span>
        <span class="cd-side-count">{{ CHATS.list.length }}</span>
      </div>
      <div v-if="!CHATS.list.length" class="cd-hist-empty">还没有对话</div>
      <div v-for="c in CHATS.list" :key="c.id" class="cd-hist-row" :class="{ on: c.id === CHATS.cur }">
        <button class="cd-hist-t" type="button" @click="openChat(c.id)">{{ c.title }}</button>
        <button class="cd-hist-x" type="button" title="删除这段对话" @click="dropChat(c.id)">×</button>
      </div>
    </div>

    <div class="cd-wrap">
      <aside v-if="size === 'full' && PREFS.chatHist === 'on'" class="cd-side" aria-label="对话列表">
        <div class="cd-side-hd">
          <button class="cd-side-new" type="button" @click="startNew">＋ 新对话</button>
          <span class="cd-side-meta">
            <span class="cd-side-ttl">历史记录</span>
            <span class="cd-side-count">{{ CHATS.list.length }}</span>
            <button class="cd-side-fold" type="button" title="收起对话列表" @click="toggleHist">‹</button>
          </span>
        </div>
        <div class="cd-side-list">
          <div v-if="!CHATS.list.length" class="cd-side-empty">还没有对话</div>
          <div v-for="c in CHATS.list" :key="c.id" class="cd-side-row" :class="{ on: c.id === CHATS.cur }">
            <button class="cd-side-t" type="button" :title="c.title" @click="openChat(c.id)">{{ c.title || '新对话' }}</button>
            <button class="cd-side-x" type="button" title="删除这段对话" @click="dropChat(c.id)">×</button>
          </div>
        </div>
      </aside>

      <div class="cd-main">
    <div ref="bodyEl" class="cd-body" @scroll.passive="onBodyScroll">
      <div v-if="!msgs.length" class="cd-empty">
        <p class="cd-empty-t">有什么想问的？</p>
        <p class="cd-empty-s">当前这一页的内容会自动带上，可以直接问「这里为什么成立」。</p>
        <div class="cd-chips">
          <button v-for="s in SUGGEST" :key="s" class="cd-chip" type="button" @click="draft = s; focusInput()">{{ s }}</button>
          <button v-if="hasBoard" class="cd-chip" type="button" @click="askBoard">解释这个图形</button>
        </div>
        <p v-if="hasBoard" class="cd-empty-s">这一页画板的滑块、开关与实时读数会一起交给模型。</p>
        <p v-if="!MODELS.list.length" class="cd-empty-warn">
          还没有模型。去 <router-link to="/settings">设置 → 模型与 API</router-link> 填一个接口地址和密钥，就能开始对话。
        </p>
      </div>

      <div v-for="(m, i) in msgs" :key="i" class="cd-row" :class="m.role">
        <div v-if="m.role === 'assistant'" class="cd-ava" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="7.2" opacity=".85"/>
            <path d="M8.4 15.2 12 8.6l3.6 6.6z"/>
            <circle cx="12" cy="12" r="1.15" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div class="cd-bubble" :class="{ err: !!m.err }">
          <details v-if="m.role === 'assistant' && m.reason && PREFS.chatThink === 'on'" class="cd-think"
            :open="i === msgs.length - 1 && sending">
            <summary>思考过程 <span class="cd-think-n">{{ m.reason.length }} 字</span></summary>
            <div class="cd-think-b">{{ m.reason }}</div>
          </details>
          <div v-if="m.role === 'assistant'" class="cd-md">
            <div v-if="isStreaming(i)" class="cd-stream">{{ m.content }}<i class="cd-caret" aria-hidden="true"></i></div>
            <div v-else-if="m.content" v-html="rich(m.content)"></div>
            <div v-else v-html="typingHtml"></div>
          </div>
          <div v-if="m.role === 'assistant' && m.usage" class="cd-usage"
            :title="m.usage.est ? '提供方没有返回用量，这里按字符数估算' : '提示 token / 补全 token'">
            <span v-if="m.usage.est">≈ </span>↑ {{ tokTxt(m.usage.prompt) }} · ↓ {{ tokTxt(m.usage.completion) }} tokens
          </div>
          <div v-else class="cd-text">{{ m.content }}</div>
          <div v-if="m.role === 'user' && m.attachments && m.attachments.length" class="cd-uatts">
            <template v-for="(a, ai) in m.attachments" :key="ai">
              <img v-if="a.k === 'img'" :src="a.u" :alt="a.n" class="cd-uimg" />
              <span v-else class="cd-ufile">📄 {{ a.n }}</span>
            </template>
          </div>
          <div v-if="m.err" class="cd-err">{{ m.err }}</div>
          <div v-if="m.role === 'assistant' && m.content" class="cd-acts">
            <button class="cd-mini" type="button" @click="copy(m.content)">复制</button>
            <button class="cd-mini" type="button" @click="toNote(m.content)">存为笔记</button>
            <button class="cd-mini" type="button" @click="openFile(m)">生成文件</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cd-foot">
      <div class="cd-box" @dragover.prevent @drop.prevent="onDrop">
        <div v-if="atts.length" class="cd-atts">
          <div v-for="(a, i) in atts" :key="i" class="cd-att" :class="a.k">
            <img v-if="a.k === 'img'" :src="a.u" :alt="a.n" />
            <span v-else class="cd-att-t">📄 {{ a.n }}</span>
            <button class="cd-att-x" type="button" title="移除" @click="removeAtt(i)">×</button>
          </div>
        </div>
        <textarea ref="inputEl" v-model="draft" class="cd-input" rows="2" placeholder="问点什么…（Enter 发送，Shift+Enter 换行；可拖入图片或文本文件）"
          @keydown.enter.exact.prevent="send" @input="grow" @paste="onPaste" />
        <input ref="fileEl" class="cd-file-in" type="file" multiple hidden
          accept="image/*,text/*,.md,.json,.csv,.tex,.txt" @change="onFiles" />
        <button class="cd-add" type="button" title="添加图片或文本文件" @click="pickFiles">＋</button>
        <button v-if="sending" class="cd-send stop" type="button" title="停止" @click="stop">■</button>
        <button v-else class="cd-send" type="button" :disabled="!draft.trim() && !atts.length" title="发送" @click="send">↑</button>
      </div>
      <div class="cd-hint">
        <span v-if="notice" class="cd-notice">{{ notice }}</span>
        <span v-else>{{ size === 'half' ? '半屏' : '整屏' }} · {{ side === 'right' ? '靠右' : '靠左' }}</span>
        <span class="cd-sp" />
        <button v-if="size === 'full'" class="cd-link" type="button" @click="toggleHist">{{ PREFS.chatHist === 'on' ? '列表：开' : '列表：关' }}</button>
        <button class="cd-link" type="button" @click="toggleThink">{{ PREFS.chatThink === 'on' ? '思考：开' : '思考：关' }}</button>
        <button class="cd-link" type="button" :disabled="!msgs.length" @click="saveToDir">存到目录</button>
        <button class="cd-link" type="button" :disabled="!msgs.length" @click="exportMd">导出 Markdown</button>
      </div>
    </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="fileOpen" class="cd-fmask" @click.self="fileOpen = false">
        <div class="cd-file" role="dialog" aria-label="生成文件">
          <div class="cd-file-hd">
            <strong>生成文件</strong>
            <span class="cd-file-sub">改好内容和类型，预览无误后下载或存到目录</span>
            <span class="cd-sp" />
            <button class="cd-btn" type="button" @click="fileOpen = false">关闭</button>
          </div>
          <div class="cd-file-bar">
            <label class="cd-file-f"><span>文件名</span>
              <input v-model="fileName" spellcheck="false" />
            </label>
            <label class="cd-file-f"><span>类型</span>
              <select v-model="fileKind">
                <option value="md">Markdown</option>
                <option value="html">HTML</option>
                <option value="svg">SVG</option>
                <option value="txt">纯文本</option>
              </select>
            </label>
            <span class="cd-file-name">{{ fileName }}{{ extOf(fileKind) }}</span>
            <span class="cd-sp" />
            <button class="cd-btn" type="button" @click="refreshPreview">刷新预览</button>
            <button class="cd-btn" type="button" @click="copyFile">复制</button>
            <button class="cd-btn" type="button" @click="downloadFile">下载</button>
            <button class="cd-btn" type="button" :disabled="!dirName" @click="saveFileToDir">存到目录</button>
          </div>
          <div class="cd-file-body">
            <textarea v-model="fileBody" class="cd-file-ta" spellcheck="false" aria-label="文件内容"></textarea>
            <div class="cd-file-pv">
              <div v-if="fileKind === 'md'" class="cd-md" v-html="filePreviewMd"></div>
              <iframe v-else-if="fileKind === 'html' || fileKind === 'svg'" class="cd-file-ifr" :key="previewKey"
                :srcdoc="fileKind === 'svg' ? svgDoc(previewBody) : previewBody"
                sandbox="allow-scripts allow-popups allow-forms"></iframe>
              <pre v-else class="cd-file-pre">{{ previewBody }}</pre>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup>
// 半屏 / 整屏的聊天窗：与画板小窗同一套呼出方式（设置页里可选靠左靠右）。
// 对话存本地，接口按 OpenAI 兼容格式流式读取；模型与密钥在设置页里配。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PREFS, setPref } from '../lib/settings.js';
import { MODELS, setActiveModel, activeModel } from '../lib/models.js';
import { CHATS, getChat, newChat, pushMessage, removeChat, renameChat, streamReply, chatToMarkdown, persistChats, persistSoon } from '../lib/chat.js';
import { renderRich, plain, preloadKatex } from '../lib/mdmini.js';
import { writeInto, getHandle, downloadText, writeIfGranted } from '../lib/fsdir.js';
import { NOTES, createNote, updateNote } from '../lib/notes.js';
import { boardContext } from '../lib/boardctx.js';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['update:open']);
const route = useRoute();
const router = useRouter();

const side = computed(() => PREFS.chatSide);
const size = computed(() => PREFS.chatSize);
const SUGGEST = ['这一页在讲什么', '这里的式子为什么成立', '出一道同类型的题'];

/* 这一页有没有画板：决定要不要出「解释这个图形」那颗钮。画板在路由切换后挂载，
   所以要等一次 nextTick 再问，否则读到的是上一页的板。 */
const hasBoard = ref(false);
function refreshBoardFlag() { hasBoard.value = !!boardContext(); }
function askBoard() {
  draft.value = '解释这个图形：它在演示什么，各个参数怎么影响结果，这一组取值能看出什么结论。';
  send();
}

/* KaTeX 是按需取的（见 lib/mdmini.js）：取到之前 renderRich 会把公式退成源码，
   取到后靠 mdTick 触发一次重渲染，手上这轮对话才看得见公式。 */
const mdTick = ref(0);
const rich = s => { mdTick.value; return renderRich(toDollarMath(s)); };
onMounted(() => { preloadKatex().then(() => { mdTick.value++; }); });

const bodyEl = ref(null);
const inputEl = ref(null);
const fileEl = ref(null);
const draft = ref('');
// 待发送的附件：图片存压缩后的 dataURL，文本存原文（上限 20 万字符）
const atts = ref([]);
const MAX_ATT = 6, MAX_IMG = 1024, MAX_TXT = 200000;
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
function toggleThink() { setPref('chatThink', PREFS.chatThink === 'on' ? 'off' : 'on'); }
function toggleHist() { setPref('chatHist', PREFS.chatHist === 'on' ? 'off' : 'on'); }

/* 对话实时落盘：流式期间每 300ms 写一次 localStorage（persistSoon），
   若已经选过保存目录且权限还在，停手 1.2 秒后再补一份 md 到目录里。 */
let fileTimer = null;
let remindedDir = false;
function queueChatFile() {
  clearTimeout(fileTimer);
  if (!dirName.value) return;
  fileTimer = setTimeout(async () => {
    const c = getChat();
    if (!c || !c.messages.length) return;
    if (!c.fileName) {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      const stamp = '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
      c.fileName = (plain(c.title, 30).replace(/[\\/:*?"<>|]/g, '_') || '对话') + '-' + stamp + '.md';
    }
    await writeIfGranted('chat', c.fileName, chatToMarkdown(c));
  }, 1200);
}
function remindDirOnce() {
  if (dirName.value || remindedDir) return;
  remindedDir = true;
  say('对话已经实时存在浏览器里，刷新不会丢；想同时写成 md，可在「设置 → 保存位置」选一个文件夹。');
}

// 大致的 token 估算：汉字与全角标点按 1，拉丁字符按 1/4；提供方返回真实用量时不走这里
function estTok(s) {
  let n = 0;
  for (const ch of String(s || '')) {
    n += /[　-〿一-鿿＀-￯]/.test(ch) ? 1 : 0.25;
  }
  return Math.max(1, Math.round(n));
}
function tokTxt(n) {
  const v = Number(n) || 0;
  return v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(v);
}

const chat = computed(() => getChat());
const msgs = computed(() => (chat.value ? chat.value.messages : []));
const stickBottom = ref(true);
const isStreaming = i => sending.value && i === msgs.value.length - 1;
function onBodyScroll() {
  const b = bodyEl.value;
  if (!b) return;
  stickBottom.value = b.scrollHeight - b.scrollTop - b.clientHeight < 90;
}

function focusInput() { nextTick(() => inputEl.value && inputEl.value.focus()); }
function close() { emit('update:open', false); }
function toggleSize() { setPref('chatSize', size.value === 'full' ? 'half' : 'full'); }

// 顶栏的模型选择：自绘下拉，拉出来以后与站点同一套配色（原生 select 的弹层没法改样式）
const modelOpen = ref(false);
const curModel = computed(() => MODELS.list.find(m => m.id === MODELS.active) || null);
function pickModel(id) { setActiveModel(id); modelOpen.value = false; }
function goSettings() { modelOpen.value = false; router.push('/settings'); }
function onDocDown(e) {
  if (!modelOpen.value) return;
  const t = e.target;
  if (t && t.closest && t.closest('.cd-selwrap')) return;
  modelOpen.value = false;
}

function startNew() {
  if (sending.value) stop();                 // 正在收回复时先停掉，别让内容继续写进旧对话
  histOpen.value = false;
  draft.value = '';
  const cur = getChat();
  if (cur && !cur.messages.length) {          // 当前已是空对话，直接复用，不再新建
    scrollBottom();
    focusInput();
    return;
  }
  // 顺手清掉以前留下的空对话，列表里不堆一串「新对话」
  CHATS.list.filter(c => !c.messages.length).forEach(c => removeChat(c.id));
  newChat();
  persistChats();
  scrollBottom();
  focusInput();
}
function openChat(id) {
  if (sending.value) stop();
  CHATS.cur = id;
  persistChats();
  histOpen.value = false;
  scrollBottom();
}
function dropChat(id) {
  if (!window.confirm('删掉这段对话？删了就找不回来了。')) return;
  removeChat(id);
}
function grow() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 260) + 'px';
}

/* —— 附件：图片压缩到长边 1280 以内再发，文本原样带进消息 —— */
function readAsDataURL(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });
}
async function shrinkImage(f) {
  const url = await readAsDataURL(f);
  try {
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url; });
    const k = Math.min(1, MAX_IMG / Math.max(img.width, img.height));
    if (k >= 1 && f.size < 260000) return url;
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(img.width * k));
    cv.height = Math.max(1, Math.round(img.height * k));
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    return cv.toDataURL('image/jpeg', .8);
  } catch (e) {
    return url;
  }
}
async function addFiles(list) {
  const arr = Array.from(list || []);
  for (const f of arr) {
    if (atts.value.length >= MAX_ATT) break;
    if (f.type && f.type.startsWith('image/')) {
      atts.value.push({ k: 'img', n: f.name || '图片', u: await shrinkImage(f) });
    } else {
      try {
        const t = await f.text();
        atts.value.push({ k: 'txt', n: f.name || '文本', t: t.slice(0, MAX_TXT) });
      } catch (e) { /* 读不出就跳过 */ }
    }
  }
}
function pickFiles() { if (fileEl.value) { fileEl.value.value = ''; fileEl.value.click(); } }
function onFiles(e) { addFiles(e.target.files); }
function onDrop(e) { addFiles(e.dataTransfer && e.dataTransfer.files); }
function onPaste(e) {
  const items = (e.clipboardData && e.clipboardData.items) || [];
  const files = [];
  for (const it of items) {
    if (it.kind === 'file' && it.type && it.type.startsWith('image/')) {
      const f = it.getAsFile();
      if (f) files.push(f);
    }
  }
  if (files.length) { e.preventDefault(); addFiles(files); }
}
function removeAtt(i) { atts.value.splice(i, 1); }

/* 给回复里的代码块补一条工具条（语言 · 复制 · 下载）。
   内容由 v-html 生成，这里在 DOM 更新后扫描还没挂过工具条的 .md-code。 */
const CODE_EXT = { html: '.html', svg: '.svg', js: '.js', javascript: '.js', json: '.json', css: '.css', py: '.py', python: '.py', sh: '.sh', bash: '.sh', tex: '.tex', md: '.md', markdown: '.md' };
// 轻量高亮：注释 / 字符串 / 数字 / 关键字各上一色，够用且不引第三方库
const CODE_KW = {
  js: 'const let var function return if else for while do switch case break continue class extends new this typeof instanceof in of try catch finally throw async await import export from default null true false undefined',
  javascript: 'const let var function return if else for while do switch case break continue class extends new this typeof instanceof in of try catch finally throw async await import export from default null true false undefined',
  json: 'true false null',
  py: 'def class return if elif else for while in not and or import from as pass break continue try except finally with lambda yield None True False self',
  python: 'def class return if elif else for while in not and or import from as pass break continue try except finally with lambda yield None True False self',
  sh: 'if then else fi for do done case esac function export echo cd sudo npm node git',
  bash: 'if then else fi for do done case esac function export echo cd sudo npm node git',
  css: 'important media supports keyframes from to',
  html: '',
  svg: '',
  tex: 'frac sqrt sin cos tan log ln sum int begin end',
};
const CODE_CMT = {
  js: '(?:\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
  javascript: '(?:\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
  json: '(?:\\/\\/[^\\n]*)',
  css: '(?:\\/\\*[\\s\\S]*?\\*\\/)',
  py: '#[^\\n]*', python: '#[^\\n]*', sh: '#[^\\n]*', bash: '#[^\\n]*',
  html: '<!--[\\s\\S]*?-->', svg: '<!--[\\s\\S]*?-->', tex: '%[^\\n]*',
};
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function highlight(code, lang) {
  const kw = new Set((CODE_KW[lang] || '').split(/\s+/).filter(Boolean));
  const cpat = CODE_CMT[lang] || '(?!)';
  const re = new RegExp(
    '(' + cpat + ')'
    + '|("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)'
    + '|(\\b\\d+(?:\\.\\d+)?\\b)'
    + '|([A-Za-z_$][\\w$]*)', 'g');
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += escHtml(code.slice(last, m.index));
    const tok = m[0];
    if (m[1]) out += '<span class="tk-c">' + escHtml(tok) + '</span>';
    else if (m[2]) out += '<span class="tk-s">' + escHtml(tok) + '</span>';
    else if (m[3]) out += '<span class="tk-n">' + escHtml(tok) + '</span>';
    else if (m[4]) out += kw.has(tok) ? '<span class="tk-k">' + escHtml(tok) + '</span>' : escHtml(tok);
    last = m.index + tok.length;
  }
  out += escHtml(code.slice(last));
  return out;
}
function decorateCode() {
  const root = bodyEl.value;
  if (!root) return;
  root.querySelectorAll('pre.md-code:not([data-tools])').forEach(pre => {
    pre.setAttribute('data-tools', '1');
    const lang = (pre.getAttribute('data-lang') || '').toLowerCase();
    const code = pre.querySelector('code');
    if (code) {
      code.classList.add('md-code-body');
      const raw = code.textContent;
      if (lang) code.innerHTML = highlight(raw, lang);
    }
    const bar = document.createElement('div');
    bar.className = 'md-code-bar';
    const tag = document.createElement('span');
    tag.className = 'md-code-lang';
    tag.textContent = lang || '文本';
    const cp = document.createElement('button');
    cp.type = 'button';
    cp.className = 'md-code-btn';
    cp.textContent = '复制';
    cp.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code ? code.textContent : '');
        cp.textContent = '已复制';
        setTimeout(() => { cp.textContent = '复制'; }, 1200);
      } catch (e) { /* 剪贴板不可用 */ }
    });
    const dl = document.createElement('button');
    dl.type = 'button';
    dl.className = 'md-code-btn';
    dl.textContent = '下载';
    dl.addEventListener('click', () => {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      const name = '代码-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate())
        + '-' + p(d.getHours()) + p(d.getMinutes()) + (CODE_EXT[lang] || '.txt');
      downloadText(name, code ? code.textContent : '', 'text/plain;charset=utf-8');
    });
    bar.append(tag, cp, dl);
    pre.prepend(bar);
  });
}
watch([msgs, mdTick], () => nextTick(decorateCode), { deep: true, flush: 'post' });
function scrollBottom(force = true) {
  if (!force && !stickBottom.value) return;
  nextTick(() => {
    const b = bodyEl.value;
    if (b) b.scrollTop = b.scrollHeight;
    stickBottom.value = true;
  });
}

// 把当前页面与画板现场交给模型当背景，问「这里为什么」时不用再贴一遍
function sysPrompt() {
  const h1 = document.querySelector('.chapter-head h1, main h1');
  const title = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
  const ctx = boardContext();
  return '你是「几何演示实验室」里的高中数学助教。' +
    (title ? '用户正在看「' + title + '」这一页（' + route.path + '）。' : '') +
    (ctx ? '\n页面上画板此刻的状态（实时读数，用来解释「现在这个图形」）：\n' + ctx + '\n' : '') +
    '用中文回答，公式一律用 $…$（行内）或 $$…$$（独立成行）书写；讲解分步骤、句子短，先给结论再给理由，不要客套话。';
}

// 把带附件的消息翻成接口要的形状：文本文件拼进正文，图片走 OpenAI 的 image_url 数组
function toApiMessage(m) {
  const list = Array.isArray(m.attachments) ? m.attachments : [];
  const txts = list.filter(a => a && a.k === 'txt' && a.t);
  const imgs = list.filter(a => a && a.k === 'img' && a.u);
  let text = String(m.content || '');
  if (txts.length) {
    text += (text ? '\n\n' : '') + txts.map(a => {
      const body = a.t.length > MAX_TXT ? a.t.slice(0, MAX_TXT) + '\n…（已截断）' : a.t;
      return '【附件：' + a.n + '】\n```\n' + body + '\n```';
    }).join('\n\n');
  }
  if (!imgs.length) return { role: m.role, content: text };
  return {
    role: m.role,
    content: [{ type: 'text', text }, ...imgs.map(a => ({ type: 'image_url', image_url: { url: a.u } }))],
  };
}

async function send() {
  const text = draft.value.trim();
  const hasAtt = atts.value.length > 0;
  if ((!text && !hasAtt) || sending.value) return;
  remindDirOnce();
  const c = getChat() || newChat();
  const snapshot = atts.value.map(a => (a.k === 'img' ? { k: 'img', n: a.n, u: a.u } : { k: 'txt', n: a.n, t: a.t }));
  pushMessage(c, { role: 'user', content: text, attachments: snapshot });
  if (c.messages.length === 1) renameChat(c.id, plain(text || (snapshot[0] && snapshot[0].n) || '附件', 24));
  draft.value = '';
  atts.value = [];
  nextTick(grow);
  scrollBottom();

  const cfg = activeModel();
  const out = pushMessage(c, { role: 'assistant', content: '', reason: '' });
  scrollBottom();
  if (!cfg) {
    out.content = '';
    out.err = '还没有配置模型。打开「设置 → 模型与 API」填好接口地址、模型名与密钥再来。';
    persistChats();
    return;
  }
  // 请求只带正式的历史（去掉刚插入的空回复占位）
  const payload = [{ role: 'system', content: sysPrompt() }]
    .concat(c.messages.slice(0, -1).map(toApiMessage));
  sending.value = true;
  ac = new AbortController();
  // 流式文本先在缓冲里攒 60ms 再上屏：比逐 token 改 DOM 顺得多，也不会每来一个字就重排一次
  let pend = '', pendR = '', flushTimer = null;
  const flush = () => {
    flushTimer = null;
    const had = pend || pendR;
    if (pend) { out.content += pend; pend = ''; }
    if (pendR) { out.reason = (out.reason || '') + pendR; pendR = ''; }
    if (!had) return;
    persistSoon();
    scrollBottom(false);
  };
  const queue = () => { if (!flushTimer) flushTimer = setTimeout(flush, 60); };
  try {
    await streamReply(
      cfg,
      payload,
      t => { pend += t; queue(); },
      ac.signal,
      r => { pendR += r; queue(); },
      u => {
        out.usage = {
          prompt: Number(u.prompt_tokens) || 0,
          completion: Number(u.completion_tokens) || 0,
        };
      },
    );
    if (flushTimer) { clearTimeout(flushTimer); flush(); }
    if (!out.usage) {
      const promptText = payload.map(x => (typeof x.content === 'string'
        ? x.content
        : (x.content || []).map(part => part.text || '').join(' '))).join('\n');
      out.usage = {
        est: true,
        prompt: estTok(promptText),
        completion: estTok(out.content) + estTok(out.reason),
      };
    }
  } catch (e) {
    if (e && e.name === 'AbortError') {
      if (!out.content) out.content = '';
      out.err = '已停止';
    } else {
      out.err = (e && e.message) ? e.message : String(e);
    }
  } finally {
    if (pend || pendR) { if (flushTimer) clearTimeout(flushTimer); flush(); }
    sending.value = false;
    ac = null;
    persistChats();
    queueChatFile();
    scrollBottom(false);
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

/* 全屏对话里的「生成文件」：从回复里挑最大的代码块（没有就用整段），
   改内容、换类型、看预览，最后下载或写进已选的保存目录。 */
const fileOpen = ref(false);
const fileName = ref('');
const fileKind = ref('md');
const fileBody = ref('');
const previewBody = ref('');
const previewKey = ref(0);
const EXT = { md: '.md', html: '.html', svg: '.svg', txt: '.txt' };
const MIME = { md: 'text/markdown;charset=utf-8', html: 'text/html;charset=utf-8', svg: 'image/svg+xml', txt: 'text/plain;charset=utf-8' };
const extOf = k => EXT[k] || '.txt';
// 有些模型仍用 \[ \] / \( \) 写公式，预览前先归一到站内认识的 $ 与 $$
function toDollarMath(s) {
  return String(s || '')
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, x) => '$$' + x + '$$')
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, x) => '$' + x + '$');
}
const filePreviewMd = computed(() => rich(previewBody.value));

function fenceOf(src) {
  const re = /```([A-Za-z0-9_+-]*)[^\n]*\n([\s\S]*?)```/g;
  let best = null, m;
  while ((m = re.exec(src || ''))) {
    const body = m[2];
    if (!best || body.length > best.body.length) best = { lang: (m[1] || '').toLowerCase(), body };
  }
  return best;
}
function openFile(msg) {
  try {
    const src = String((msg && msg.content) || '');
    const f = fenceOf(src);
    const map = { html: 'html', svg: 'svg', xml: 'svg', md: 'md', markdown: 'md' };
    fileKind.value = f ? (map[f.lang] || 'txt') : 'md';
    fileBody.value = f ? f.body : src;
    const d = new Date(), p = n => String(n).padStart(2, '0');
    fileName.value = '助手-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes());
    previewBody.value = fileBody.value;
    previewKey.value++;
    fileOpen.value = true;
  } catch (e) {
    say('无法生成文件：' + (e && e.message ? e.message : e));
  }
}
// 编辑时预览延迟 350ms 再刷新，敲 HTML 不会每敲一个字就整页重载一次
let pvTimer = null;
watch(fileBody, v => {
  clearTimeout(pvTimer);
  pvTimer = setTimeout(() => { previewBody.value = v; }, 350);
});
function refreshPreview() {
  previewBody.value = fileBody.value;
  previewKey.value++;
}
function copyFile() {
  try {
    navigator.clipboard.writeText(fileBody.value);
    say('文件内容已复制');
  } catch (e) {
    say('复制失败：' + (e && e.message ? e.message : e));
  }
}
function svgDoc(s) {
  return '<!doctype html><meta charset="utf-8"><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#fff">'
    + s + '</body>';
}
function downloadFile() {
  try {
    downloadText(fileName.value + extOf(fileKind.value), fileBody.value, MIME[fileKind.value] || MIME.txt);
    say('已开始下载 ' + fileName.value + extOf(fileKind.value));
    fileOpen.value = false;
  } catch (e) { say('下载失败：' + (e.message || e)); }
}
async function saveFileToDir() {
  try {
    const where = await writeInto('chat', fileName.value + extOf(fileKind.value), fileBody.value);
    say('已存到 ' + where);
    fileOpen.value = false;
  } catch (e) { say('保存失败：' + (e.message || e)); }
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

// Esc 收起：先收「生成文件」弹层，再收下拉菜单与记录面板，最后收整窗
function onKey(e) {
  if (e.key !== 'Escape' || !props.open) return;
  if (fileOpen.value) { fileOpen.value = false; return; }
  if (modelOpen.value) { modelOpen.value = false; return; }
  if (histOpen.value) { histOpen.value = false; return; }
  close();
}
onMounted(async () => {
  window.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onDocDown, true);
  window.addEventListener('beforeunload', persistChats);
  document.addEventListener('visibilitychange', onVis);
  try { const h = await getHandle('chat'); dirName.value = h ? h.name : ''; } catch (e) { /* 无痕模式 */ }
  scrollBottom();
  nextTick(decorateCode);
});
function onVis() { if (document.visibilityState === 'hidden') persistChats(); }
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  document.removeEventListener('pointerdown', onDocDown, true);
  window.removeEventListener('beforeunload', persistChats);
  document.removeEventListener('visibilitychange', onVis);
  clearTimeout(pvTimer);
  clearTimeout(fileTimer);
  persistChats();
  if (ac) ac.abort();
});

// 复用同一个组件时换对话要滚到底
watch(() => CHATS.cur, () => scrollBottom());
watch(() => props.open, o => {
  if (o) { scrollBottom(); focusInput(); histOpen.value = false; modelOpen.value = false; fileOpen.value = false; nextTick(refreshBoardFlag); }
  else { modelOpen.value = false; histOpen.value = false; fileOpen.value = false; }
});
watch(() => route.fullPath, () => { if (props.open) nextTick(refreshBoardFlag); });
</script>

<style scoped>
.chat-dock {
  --cd-col: 920px;
  position: fixed; top: 46px; right: 0; bottom: 0; z-index: 95;
  width: 50vw; max-width: 100vw;
  display: flex; flex-direction: column;
  background: var(--bg); border-left: 1px solid var(--line);
  box-shadow: -18px 0 40px rgba(0, 0, 0, .22);
}
.chat-dock.left { left: 0; right: auto; border-left: none; border-right: 1px solid var(--line);
  box-shadow: 18px 0 40px rgba(0, 0, 0, .22); }
.chat-dock.full { --cd-col: 1060px; width: 100vw; border: none; box-shadow: none; }

/* 整屏时标题和正文列对齐：栏宽跟 .cd-row / .cd-box 的 760px 一脉相承，
   不然「助手」两个字贴在视口最左缘，看着像出了框 */
.cd-head { flex: none; border-bottom: 1px solid var(--line); position: relative; padding: 0 12px; }
.cd-head-in { display: flex; align-items: center; gap: 8px; width: 100%; max-width: var(--cd-col); margin: 0 auto;
  min-height: 48px; min-width: 0; }
.cd-head strong { flex: none; font-size: 13.5px; line-height: 1.4; color: var(--ink); letter-spacing: .3px; white-space: nowrap; }
.cd-selwrap { position: relative; display: inline-flex; align-items: center; min-width: 0; flex: 0 1 auto; }
.cd-seltog { display: inline-flex; align-items: center; gap: 8px; max-width: 190px; min-width: 0;
  font: inherit; font-size: 12.5px; color: var(--ink); background: var(--bg2); cursor: pointer;
  border: 1px solid var(--line); border-radius: 99px; padding: 4px 12px; }
.cd-seltog:hover { border-color: var(--mut); }
.cd-selwrap.open .cd-seltog { border-color: color-mix(in srgb, var(--blue) 55%, var(--line)); }
.cd-selnm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cd-caret { flex: none; font-size: 10px; color: var(--faint); transition: transform .16s ease; }
.cd-selwrap.open .cd-caret { transform: rotate(180deg); }
.cd-menu {
  position: absolute; left: 0; top: calc(100% + 6px); z-index: 30; width: 260px; max-width: 78vw;
  display: flex; flex-direction: column; gap: 1px; padding: 6px;
  border: 1px solid var(--line); border-radius: 14px; background: var(--card);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .32);
}
.cd-mi {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'n ck' 'm ck';
  column-gap: 10px; align-items: center; width: 100%; text-align: left;
  font: inherit; color: var(--mut); background: none; border: 0; border-radius: 9px;
  padding: 8px 10px; cursor: pointer; transition: background-color .14s ease, color .14s ease;
}
.cd-mi:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
.cd-mi.on { color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent); }
.cd-mi-n { grid-area: n; min-width: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cd-mi-m { grid-area: m; min-width: 0; font-size: 11.5px; color: var(--faint);
  font-family: var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cd-mi-ck { grid-area: ck; font-size: 12px; color: var(--blue); }
.cd-mi-add {
  margin-top: 4px; padding: 8px 10px 4px; width: 100%; text-align: left;
  font: inherit; font-size: 12px; color: var(--faint); background: none; border: 0;
  border-top: 1px solid var(--line); cursor: pointer;
}
.cd-mi-add:hover { color: var(--ink); }
.cd-warn { font-size: 12px; color: var(--orange); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cd-sp { flex: 1; }
.cd-btn { font: inherit; font-size: 12.5px; color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 99px; padding: 3px 11px; cursor: pointer; white-space: nowrap; }
.cd-btn:hover, .cd-btn.on { color: var(--ink); border-color: var(--mut); }
.cd-btn.on { color: var(--blue); border-color: var(--blue); }
.cd-ico { padding: 3px 9px; font-size: 13px; line-height: 1.2; }

/* 整屏时左侧常驻对话列表：主列（正文 + 输入框）挤在右边 */
.cd-wrap { flex: 1; min-height: 0; display: flex; }
.cd-main { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.cd-side { flex: none; width: 296px; min-height: 0; display: flex; flex-direction: column;
  border-right: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--blue) 5%, var(--bg2)) 0,
      var(--bg2) 96px,
      var(--bg2) 100%);
  box-shadow: 6px 0 18px -12px rgba(0, 0, 0, .45); }
.cd-side-hd { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 14px 14px 10px 26px; border-bottom: 1px solid color-mix(in srgb, var(--line) 65%, transparent); }
.cd-side-meta { display: inline-flex; align-items: center; gap: 7px; min-width: 0; }
.cd-side-ttl { font-size: 12px; letter-spacing: .06em; color: var(--mut); }
.cd-side-count {
  min-width: 19px; padding: 2px 6px; border-radius: 99px; text-align: center;
  font-size: 11px; line-height: 1.2; color: var(--faint); font-variant-numeric: tabular-nums;
  background: color-mix(in srgb, var(--ink) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
}
.cd-side-new { font: inherit; font-size: 12px; letter-spacing: 0; color: var(--blue);
  background: transparent; border: 1px solid color-mix(in srgb, var(--blue) 40%, transparent);
  border-radius: 99px; padding: 4px 12px; cursor: pointer; transition: background-color .15s ease; }
.cd-side-new:hover { background: color-mix(in srgb, var(--blue) 12%, transparent); }
.cd-side-fold {
  flex: none; width: 22px; height: 22px; border-radius: 7px; cursor: pointer;
  border: 1px solid var(--line); background: transparent; color: var(--faint);
  font-size: 13px; line-height: 1; padding: 0;
}
.cd-side-fold:hover { color: var(--ink); border-color: var(--mut); }
.cd-side-list { flex: 1; min-height: 0; overflow: auto; padding: 8px 12px 14px; }
.cd-side-empty {
  margin: 6px 4px; padding: 16px 12px; border: 1px dashed color-mix(in srgb, var(--line) 85%, transparent);
  border-radius: 12px; text-align: center; font-size: 12.5px; color: var(--faint);
}
.cd-side-row {
  position: relative; display: flex; align-items: center; gap: 2px; margin-bottom: 3px;
  border-radius: 10px; transition: background-color .14s ease;
}
.cd-side-row:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
.cd-side-row.on { background: color-mix(in srgb, var(--blue) 13%, transparent); }
.cd-side-row.on::before {
  content: ''; position: absolute; left: 5px; top: 50%; width: 3px; height: 15px;
  margin-top: -7.5px; border-radius: 3px; background: var(--blue);
}
.cd-side-t { flex: 1; min-width: 0; text-align: left; font: inherit; font-size: 13px; line-height: 1.45;
  color: var(--mut); background: none; border: 0; padding: 9px 10px 9px 15px; cursor: pointer;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cd-side-row.on .cd-side-t { color: var(--blue); font-weight: 500; }
.cd-side-x { flex: none; font: inherit; font-size: 14px; color: var(--faint); background: none; border: 0;
  padding: 4px 8px; margin-right: 2px; border-radius: 8px; cursor: pointer;
  opacity: 0; transition: opacity .14s ease, color .14s ease; }
.cd-side-row:hover .cd-side-x, .cd-side-row.on .cd-side-x { opacity: 1; }
.cd-side-x:hover { color: var(--pink); background: rgba(255, 123, 138, .12); }
.cd-side-list::-webkit-scrollbar { width: 8px; }
.cd-side-list::-webkit-scrollbar-thumb {
  border: 2px solid transparent; background-clip: content-box; border-radius: 8px;
  background-color: color-mix(in srgb, var(--mut) 22%, transparent);
}
.cd-side-list:hover::-webkit-scrollbar-thumb { background-color: color-mix(in srgb, var(--mut) 40%, transparent); }
@media (max-width: 760px) { .cd-side { display: none; } }

.cd-hist { position: absolute; top: calc(100% + 6px); right: 10px; z-index: 30; width: 324px; max-height: 340px; overflow: auto;
  padding: 8px; border: 1px solid var(--line); border-radius: 14px; background: var(--card);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .32); }
.chat-dock.left .cd-hist { right: auto; left: 10px; }
.cd-hist-hd { display: flex; align-items: center; justify-content: flex-end; gap: 7px;
  padding: 2px 8px 8px; margin-bottom: 4px;
  border-bottom: 1px solid color-mix(in srgb, var(--line) 65%, transparent); }
.cd-hist-empty { padding: 12px; font-size: 12.5px; color: var(--faint); }
.cd-hist-row { display: flex; align-items: center; gap: 2px; border-radius: 9px;
  transition: background-color .14s ease; }
.cd-hist-row:hover { background: color-mix(in srgb, var(--ink) 7%, transparent); }
.cd-hist-row.on { background: color-mix(in srgb, var(--blue) 12%, transparent); }
.cd-hist-t { flex: 1; min-width: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font: inherit; font-size: 13px; color: var(--mut); background: none; border: none; padding: 8px 10px; cursor: pointer; }
.cd-hist-row.on .cd-hist-t { color: var(--blue); }
.cd-hist-x { flex: none; font: inherit; font-size: 14px; color: var(--faint); background: none; border: none;
  padding: 4px 8px; cursor: pointer; border-radius: 8px; opacity: 0; transition: opacity .14s ease, color .14s ease; }
.cd-hist-row:hover .cd-hist-x, .cd-hist-row.on .cd-hist-x { opacity: 1; }
.cd-hist-x:hover { color: var(--pink); background: rgba(255, 123, 138, .12); }

.cd-body { flex: 1; min-height: 0; overflow: auto; padding: 18px 0 10px; scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--mut) 30%, transparent) transparent; }
.cd-body::-webkit-scrollbar { width: 10px; height: 10px; }
.cd-body::-webkit-scrollbar-track { background: transparent; }
.cd-body::-webkit-scrollbar-thumb {
  border: 3px solid transparent; background-clip: content-box; border-radius: 10px;
  background-color: color-mix(in srgb, var(--mut) 26%, transparent);
}
.cd-body:hover::-webkit-scrollbar-thumb { background-color: color-mix(in srgb, var(--mut) 46%, transparent); }
.cd-empty { max-width: 720px; margin: 12vh auto 0; padding: 0 22px; text-align: center; }
.cd-empty-t { font-size: 19px; color: var(--ink); margin: 0 0 6px; font-family: var(--font-sans); }
.cd-empty-s { font-size: 13.5px; color: var(--mut); margin: 0; }
.cd-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; }
.cd-chip { font: inherit; font-size: 13px; color: var(--mut); background: var(--card); border: 1px solid var(--line);
  border-radius: 99px; padding: 6px 14px; cursor: pointer; }
.cd-chip:hover { color: var(--ink); border-color: var(--mut); }
.cd-empty-warn { margin-top: 20px; font-size: 12.5px; color: var(--orange); }
.cd-empty-warn a { color: var(--blue); }

.cd-row { display: flex; gap: 10px; max-width: var(--cd-col); margin: 0 auto; padding: 8px 22px; align-items: flex-start; }
.cd-row.user { justify-content: flex-end; }
.cd-brand { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.cd-ava { flex: none; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; margin-top: 2px;
  background: linear-gradient(140deg, var(--blue), var(--purple));
  box-shadow: 0 1px 2px rgba(0, 0, 0, .28), inset 0 0 0 1px rgba(255, 255, 255, .14); }
.cd-ava svg { width: 16px; height: 16px; display: block; }
.cd-ava.sm { width: 22px; height: 22px; margin: 0; }
.cd-ava.sm svg { width: 13px; height: 13px; }
.cd-bubble { min-width: 0; max-width: 88%; border-radius: 14px; padding: 8px 13px; font-size: 14.5px; line-height: 1.78; }
.cd-row.user .cd-bubble { background: rgba(92, 173, 255, .14); border: 1px solid rgba(92, 173, 255, .28);
  white-space: pre-wrap; word-break: break-word; }
.cd-row.assistant .cd-bubble { background: transparent; padding-left: 0; padding-right: 0; max-width: 100%; flex: 1; }
.cd-bubble.err { color: var(--orange); }

/* 推理模型的思考过程：折叠块，流式时自动展开最新一条 */
.cd-think { margin: 0 0 8px; border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
  border-radius: 10px; background: color-mix(in srgb, var(--ink) 3%, transparent); overflow: hidden; }
.cd-think > summary { display: flex; align-items: center; gap: 8px; list-style: none;
  padding: 7px 12px; font-size: 12px; color: var(--mut); cursor: pointer; }
.cd-think > summary::-webkit-details-marker { display: none; }
.cd-think > summary::before { content: '▸'; font-size: 10px; color: var(--faint); transition: transform .16s ease; }
.cd-think[open] > summary::before { transform: rotate(90deg); }
.cd-think-n { color: var(--faint); font-variant-numeric: tabular-nums; }
.cd-think-b { max-height: 320px; overflow: auto; padding: 2px 12px 10px;
  font-size: 12.5px; line-height: 1.75; color: var(--mut); white-space: pre-wrap; word-break: break-word;
  border-top: 1px dashed color-mix(in srgb, var(--line) 70%, transparent); }
.cd-text { white-space: pre-wrap; word-break: break-word; }
.cd-uatts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.cd-uimg { max-width: 220px; max-height: 180px; border-radius: 8px; display: block; }
.cd-ufile { font-size: 12px; color: var(--mut); padding: 3px 8px; border: 1px solid var(--line); border-radius: 8px; }
.cd-err { margin-top: 6px; font-size: 12.5px; color: var(--orange); }
.cd-usage { margin-top: 6px; font-size: 11.5px; color: var(--faint);
  font-variant-numeric: tabular-nums; letter-spacing: .01em; }
.cd-acts { margin-top: 4px; display: flex; gap: 6px; opacity: .55; transition: opacity .15s; }
.cd-bubble:hover .cd-acts { opacity: 1; }
.cd-mini { font: inherit; font-size: 11.5px; color: var(--faint); background: none; border: 1px solid var(--line);
  border-radius: 7px; padding: 1px 8px; cursor: pointer; }
.cd-mini:hover { color: var(--ink); border-color: var(--mut); }
.cd-typing { color: var(--faint); letter-spacing: 2px; }
/* 流式输出：纯文本逐段上屏 + 一枚闪烁光标，结束后再整段排成 Markdown/公式 */
.cd-stream { white-space: pre-wrap; word-break: break-word; }
.cd-caret {
  display: inline-block; width: 2px; height: 1.02em; margin-left: 2px; vertical-align: -.14em;
  background: var(--blue); border-radius: 1px; opacity: .8;
  animation: cdCaret 1s steps(2, start) infinite;
}
@keyframes cdCaret { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .cd-caret { animation: none; } }

/* 助手消息里的 Markdown 排版 */
.cd-md :deep(p) { margin: .45em 0; }
.cd-md :deep(h1), .cd-md :deep(h2), .cd-md :deep(h3), .cd-md :deep(h4) { margin: .8em 0 .35em; font-size: 1.05em; color: var(--ink); }
.cd-md :deep(ul), .cd-md :deep(ol) { margin: .4em 0; padding-left: 1.4em; }
.cd-md :deep(li) { margin: .2em 0; }
.cd-md :deep(code) { font-family: var(--font-mono); font-size: .9em; padding: 1px 5px;
  border-radius: 5px; color: var(--ink);
  background: color-mix(in srgb, var(--blue) 11%, transparent); }
/* 代码块：深灰底换成淡蓝卡片 + 顶部工具条（语言 · 复制 · 下载） */
.cd-md :deep(.md-code) {
  margin: .7em 0; padding: 0; border-radius: 10px; overflow: hidden;
  background: color-mix(in srgb, var(--blue) 6%, var(--bg2));
  border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
}
.cd-md :deep(.md-code-bar) {
  display: flex; align-items: center; gap: 6px; padding: 5px 8px 5px 11px;
  border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
  background: color-mix(in srgb, var(--blue) 8%, transparent);
}
.cd-md :deep(.md-code-lang) {
  margin-right: auto; font-size: 11px; letter-spacing: .05em; color: var(--mut); text-transform: uppercase;
}
.cd-md :deep(.md-code-btn) {
  font: inherit; font-size: 11.5px; line-height: 1; color: var(--mut);
  background: var(--card); border: 1px solid var(--line); border-radius: 7px;
  padding: 3px 9px; cursor: pointer;
}
.cd-md :deep(.md-code-btn:hover) { color: var(--ink); border-color: var(--mut); }
.cd-md :deep(.md-code-body) {
  display: block; padding: 10px 12px; overflow: auto; background: transparent; border-radius: 0;
  font-family: var(--font-mono); font-size: 12.5px; line-height: 1.65;
  color: var(--ink); white-space: pre; tab-size: 2;
}
/* 代码高亮：注释 / 字符串 / 数字 / 关键字 */
.cd-md :deep(.tk-c) { color: var(--faint); font-style: italic; }
.cd-md :deep(.tk-s) { color: var(--green); }
.cd-md :deep(.tk-n) { color: var(--orange); }
.cd-md :deep(.tk-k) { color: var(--purple); }
.cd-md :deep(blockquote) { margin: .5em 0; padding: 2px 12px; border-left: 3px solid var(--line); color: var(--mut); }
.cd-md :deep(.md-math) { margin: .5em 0; overflow-x: auto; overflow-y: hidden; }
.cd-md :deep(.md-table) { border-collapse: collapse; margin: .6em 0; font-size: .95em; }
.cd-md :deep(.md-table th), .cd-md :deep(.md-table td) { border: 1px solid var(--line); padding: 4px 10px; }
.cd-md :deep(a) { color: var(--blue); }
.cd-md :deep(hr) { border: none; border-top: 1px solid var(--line); margin: .8em 0; }

.cd-foot { flex: none; border-top: 1px solid var(--line); padding: 10px 14px 8px; }
.cd-box { display: flex; align-items: flex-end; gap: 8px; max-width: var(--cd-col); margin: 0 auto;
  border: 1px solid var(--line); border-radius: 18px; padding: 10px 10px 10px 16px;
  background: color-mix(in srgb, var(--blue) 4%, var(--bg2)); }
.cd-box:focus-within { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
.cd-input { flex: 1; min-height: 54px; max-height: 260px; resize: none; border: none; outline: none;
  background: transparent; color: var(--ink); font: inherit; font-size: 15px; line-height: 1.7; padding: 4px 0; }
.cd-send { flex: none; width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer;
  background: var(--blue); color: #fff; font-size: 15px; line-height: 1; }
.cd-send:disabled { opacity: .35; cursor: default; }
.cd-send.stop { background: var(--pink); font-size: 10px; }
.cd-add { flex: none; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);
  background: transparent; color: var(--mut); font-size: 17px; line-height: 1; cursor: pointer; }
.cd-add:hover { color: var(--ink); border-color: var(--mut); }
/* 附件条：图片给缩略图、文本给文件名，点 × 移除 */
.cd-atts { flex: 1 1 100%; display: flex; flex-wrap: wrap; gap: 8px; padding: 0 2px 2px; }
.cd-box { position: relative; overflow: visible; flex-wrap: wrap; }
.cd-att { position: relative; display: flex; align-items: center; gap: 6px; max-width: 220px;
  padding: 4px 8px; border-radius: 10px; border: 1px solid var(--line); background: var(--card); }
.cd-att img { width: 46px; height: 46px; object-fit: cover; border-radius: 6px; display: block; }
.cd-att.txt { font-size: 12px; color: var(--mut); }
.cd-att-t { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cd-att-x { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--card); color: var(--faint);
  font-size: 12px; line-height: 1; cursor: pointer; padding: 0; }
.cd-att-x:hover { color: var(--pink); border-color: var(--pink); }
.cd-hint { display: flex; align-items: center; gap: 10px; max-width: var(--cd-col); margin: 6px auto 0;
  font-size: 11.5px; color: var(--faint); }
.cd-notice { color: var(--blue); }
.cd-link { font: inherit; font-size: 11.5px; color: var(--faint); background: none; border: none; cursor: pointer; padding: 0; }
.cd-link:hover { color: var(--blue); }
.cd-link:disabled { opacity: .4; cursor: default; }

@media print { .chat-dock { display: none !important; } }
@media (max-width: 900px) { .chat-dock { width: 100vw; } .cd-row { padding-left: 14px; padding-right: 14px; } }

/* 「生成文件」弹层：左边改内容、右边看预览 */
.cd-fmask { position: fixed; inset: 0; z-index: 220; display: flex; align-items: center; justify-content: center;
  padding: 24px; background: rgba(0, 0, 0, .55); }
.cd-file { width: min(1120px, 94vw); height: min(760px, 88vh); display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 16px; background: var(--bg); overflow: hidden;
  box-shadow: 0 26px 70px rgba(0, 0, 0, .45); }
.cd-file-hd { flex: none; display: flex; align-items: baseline; gap: 10px; padding: 12px 16px;
  border-bottom: 1px solid var(--line); }
.cd-file-hd strong { font-size: 14px; color: var(--ink); }
.cd-file-sub { font-size: 12px; color: var(--faint); }
.cd-file-bar { flex: none; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 10px 16px; border-bottom: 1px solid var(--line); background: var(--bg2); }
.cd-file-f { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--mut); }
.cd-file-f input, .cd-file-f select { font: inherit; font-size: 12.5px; color: var(--ink); background: var(--bg);
  border: 1px solid var(--line); border-radius: 8px; padding: 5px 9px; outline: none; }
.cd-file-f input { width: 210px; }
.cd-file-f input:focus, .cd-file-f select:focus { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
.cd-file-name { font-size: 11.5px; color: var(--faint); font-family: var(--font-mono); }
.cd-file-body { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
.cd-file-ta { width: 100%; height: 100%; resize: none; border: 0; outline: none;
  padding: 14px 16px; background: color-mix(in srgb, var(--blue) 4%, var(--bg2)); color: var(--ink);
  font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7; }
.cd-file-pv { min-width: 0; overflow: auto; padding: 16px 20px; background: var(--bg); }
.cd-file-ifr { width: 100%; height: 100%; border: 0; border-radius: 8px; background: #fff; }
.cd-file-pre { margin: 0; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7;
  white-space: pre-wrap; word-break: break-word; color: var(--ink); }
@media (max-width: 820px) {
  .cd-file { height: min(820px, 92vh); }
  .cd-file-body { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); }
  .cd-file-f input { width: 150px; }
}
</style>
