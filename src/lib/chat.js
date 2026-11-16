// 对话记录：存 localStorage['gl-chats']。消息按 OpenAI 的 role/content 结构存，
// 直接就是下次请求的上下文。流式回复走 fetch + ReadableStream 解 SSE。
import { reactive } from 'vue';

const KEY = 'gl-chats';

export const CHATS = reactive({
  list: [],   // [{ id, title, ts, messages: [{ role, content, ts, err }] }]
  cur: '',    // 当前对话 id
});

export function loadChats() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && Array.isArray(raw.list)) {
      CHATS.list = raw.list.filter(c => c && c.id).map(c => ({
        id: String(c.id),
        title: String(c.title || '未命名对话'),
        ts: Number(c.ts) || Date.now(),
        messages: Array.isArray(c.messages) ? c.messages.filter(m => m && m.role).map(m => ({
          role: m.role, content: String(m.content || ''), ts: Number(m.ts) || 0, err: m.err || '',
        })) : [],
      }));
      CHATS.cur = CHATS.list.some(c => c.id === raw.cur) ? raw.cur : (CHATS.list[0] ? CHATS.list[0].id : '');
    }
  } catch (e) { /* 脏档丢弃 */ }
}

export function persistChats() {
  try {
    // 只留最近 40 段对话，避免 localStorage 撑爆
    if (CHATS.list.length > 40) CHATS.list.splice(40);
    localStorage.setItem(KEY, JSON.stringify(CHATS));
  } catch (e) { /* 存不下就算了，页面上的内容不受影响 */ }
}
let saveTimer = null;
function persistSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistChats, 250);
}

export function newChat() {
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const c = { id, title: '新对话', ts: Date.now(), messages: [] };
  CHATS.list.unshift(c);
  CHATS.cur = id;
  persistSoon();
  return c;
}

export function getChat(id = CHATS.cur) {
  return CHATS.list.find(c => c.id === id) || null;
}

export function removeChat(id) {
  const i = CHATS.list.findIndex(c => c.id === id);
  if (i < 0) return;
  CHATS.list.splice(i, 1);
  if (CHATS.cur === id) CHATS.cur = CHATS.list[0] ? CHATS.list[0].id : '';
  persistSoon();
}

export function renameChat(id, title) {
  const c = getChat(id);
  if (!c) return;
  c.title = String(title || '').trim().slice(0, 60) || '未命名对话';
  persistSoon();
}

export function pushMessage(chat, msg) {
  const c = typeof chat === 'string' ? getChat(chat) : chat;
  if (!c) return;
  c.messages.push({ ts: Date.now(), ...msg });
  c.ts = Date.now();
  persistSoon();
  return c.messages[c.messages.length - 1];
}

/** 对话导出成 Markdown（带标题与时间，公式原样保留） */
export function chatToMarkdown(chat) {
  const c = typeof chat === 'string' ? getChat(chat) : chat;
  if (!c) return '';
  const time = new Date(c.ts || Date.now()).toLocaleString('zh-CN');
  const head = '# ' + c.title + '\n\n> 导出自几何演示实验室 · ' + time + '\n\n';
  return head + c.messages.map(m => (m.role === 'user' ? '## 我\n\n' : '## 助手\n\n') + m.content).join('\n\n---\n\n');
}

/**
 * 发一条请求，边收边回调。
 * @param {object} cfg  { baseUrl, key, model, temp }
 * @param {Array} messages  [{role, content}]
 * @param {(t:string)=>void} onDelta
 * @returns {Promise<string>} 完整回复
 */
export async function streamReply(cfg, messages, onDelta, signal) {
  if (!cfg || !cfg.baseUrl) throw new Error('还没有配置模型接口地址，去「设置 → 模型与 API」加一个');
  if (!cfg.model) throw new Error('这个模型没有填模型名（如 gpt-4o-mini）');
  const url = cfg.baseUrl.replace(/\/+$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.key ? { Authorization: 'Bearer ' + cfg.key } : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      temperature: Number.isFinite(cfg.temp) ? cfg.temp : 0.6,
      stream: true,
    }),
    signal,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch (e) { /* 忽略 */ }
    throw new Error('接口返回 ' + res.status + (detail ? '：' + detail.slice(0, 300) : ''));
  }
  // 有的代理忽略 stream 参数，直接回整块 JSON
  const ct = res.headers.get('content-type') || '';
  if (!res.body || ct.includes('application/json')) {
    const data = await res.json();
    const text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
    if (text) onDelta(text);
    return text || '';
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let full = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let k;
    while ((k = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, k).trim();
      buf = buf.slice(k + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return full;
      let j;
      try { j = JSON.parse(payload); } catch (e) { continue; }
      const d = j.choices && j.choices[0] ? (j.choices[0].delta || j.choices[0].message || {}) : {};
      const t = d.content || (d.reasoning_content ? '' : '');
      if (t) { full += t; onDelta(t); }
    }
  }
  return full;
}
