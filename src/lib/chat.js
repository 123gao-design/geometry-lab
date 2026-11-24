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
        fileName: String(c.fileName || ''),
        messages: Array.isArray(c.messages) ? c.messages.filter(m => m && m.role).map(m => ({
          role: m.role, content: String(m.content || ''), reason: String(m.reason || ''), ts: Number(m.ts) || 0, err: m.err || '',
          attachments: Array.isArray(m.attachments) ? m.attachments.filter(a => a && (a.k === 'img' || a.k === 'txt')).map(a => ({
            k: a.k, n: String(a.n || ''), u: a.u ? String(a.u) : '', t: a.t ? String(a.t) : '',
          })) : [],
          usage: m.usage && typeof m.usage === 'object' ? {
            prompt: Number(m.usage.prompt) || 0,
            completion: Number(m.usage.completion) || 0,
            est: !!m.usage.est,
          } : null,
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
  } catch (e) {
    // 带图片的对话可能撞上配额：退一步把图片数据去掉再存一次，至少文字与结构不丢
    try {
      const slim = {
        ...CHATS,
        list: CHATS.list.map(c => ({
          ...c,
          messages: c.messages.map(m => ({
            ...m,
            attachments: (m.attachments || []).map(a => (a.k === 'img' ? { ...a, u: '' } : a)),
          })),
        })),
      };
      localStorage.setItem(KEY, JSON.stringify(slim));
    } catch (e2) { /* 还是存不下就只能放弃这一轮 */ }
  }
}
let saveTimer = null;
/** 拖尾节流：流式回复期间每 300ms 落一次盘，停顿后再补最后一次 */
export function persistSoon() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => { saveTimer = null; persistChats(); }, 300);
}

export function newChat() {
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const c = { id, title: '新对话', ts: Date.now(), fileName: '', messages: [] };
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
  return head + c.messages.map(m => {
    let body = m.content || '';
    for (const a of (m.attachments || [])) {
      if (a.k === 'img') body += (body ? '\n\n' : '') + '［图片：' + a.n + '］';
      else if (a.t) body += (body ? '\n\n' : '') + '【附件：' + a.n + '】\n```\n' + a.t.slice(0, 200000) + '\n```';
    }
    return (m.role === 'user' ? '## 我\n\n' : '## 助手\n\n') + body;
  }).join('\n\n---\n\n');
}

/** 把用户填的接口地址补成真正的 /chat/completions 终点：
 *  - 已经以 /chat/completions 结尾：原样用（有人习惯把整条端点粘进来）；
 *  - 只填了域名（没有路径）：补 /v1/chat/completions（OpenAI、DeepSeek、Ollama 都是这一层）；
 *  - 其余（…/v1、…/compatible-mode/v1）：补 /chat/completions。
 * 尾斜杠与首尾空格一并清掉——地址栏里多一个斜杠、复制 Key 时多一个换行，都会让请求悄悄失败。 */
export function endpointOf(baseUrl) {
  const u = String(baseUrl || '').trim().replace(/\/+$/, '');
  if (!u) return '';
  if (/\/chat\/completions$/i.test(u)) return u;
  try {
    const url = new URL(u);
    if (!url.pathname || url.pathname === '/') return u + '/v1/chat/completions';
  } catch (e) { /* 不是标准 URL，按普通路径处理 */ }
  return u + '/chat/completions';
}

function netHint(url) {
  if (/^https?:\/\/api\.openai\.com/i.test(url)) {
    return '连不上 ' + url + '：OpenAI 官方接口不允许网页直连（浏览器跨域被拦）。请把接口地址换成你自己的代理（指向代理的 /v1 一层），或改用支持跨域的提供方。';
  }
  return '连不上 ' + url + '。常见原因：接口地址或模型名写错；对方不允许浏览器直连（跨域 CORS 被拦）；网络不通；'
    + '站点是 https 而接口是 http（浏览器按混合内容拦掉）。可在设置里点「测试连接」看具体是哪一种，或换成自建代理 / 本地服务的地址。';
}

function httpHint(status, detail) {
  const d = String(detail || '').replace(/\s+/g, ' ').slice(0, 300);
  const tail = d ? '接口原话：' + d : '';
  if (status === 401 || status === 403) return '鉴权失败（' + status + '）：API Key 不对、已过期，或复制时带了空格 / 换行。' + tail;
  if (status === 404) return '地址不对（404）：接口地址要填到 /v1 这一层，模型名也要与该提供方一致。' + tail;
  if (status === 429) return '被限流（429）：稍后再试，或换一个模型。' + tail;
  return '接口返回 ' + status + (d ? '：' + d : '');
}

function cfgChecked(cfg) {
  if (!cfg || !cfg.baseUrl) throw new Error('还没有配置模型接口地址，去「设置 → 模型与 API」加一个');
  if (!cfg.model) throw new Error('这个模型没有填模型名（如 gpt-4o-mini）');
  const url = endpointOf(cfg.baseUrl);
  const key = String(cfg.key || '').trim();
  const local = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(url);
  if (!key && !local) {
    throw new Error('「' + (cfg.name || '当前模型') + '」还没有填 API Key。填好后在设置里点「测试连接」确认一次，再回来发消息。');
  }
  return { url, key, model: String(cfg.model).trim() };
}

/** 设置页的「测试连接」：发一条 1 token 的短请求，只判断能不能通、报错是什么。 */
export async function pingModel(cfg, signal) {
  const { url, key, model } = cfgChecked(cfg);
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }),
      signal,
    });
  } catch (e) {
    if (e && e.name === 'AbortError') throw new Error('已取消');
    throw new Error(netHint(url));
  }
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(httpHint(res.status, text));
  return true;
}

/**
 * 发一条请求，边收边回调。
 * @param {object} cfg  { baseUrl, key, model, temp }
 * @param {Array} messages  [{role, content}]
 * @param {(t:string)=>void} onDelta
 * @param {AbortSignal} signal
 * @param {(t:string)=>void} [onReason] 推理模型的思考过程（DeepSeek-R1 一类返回 reasoning_content）
 * @returns {Promise<string>} 完整回复
 */
export async function streamReply(cfg, messages, onDelta, signal, onReason, onUsage) {
  const { url, key, model } = cfgChecked(cfg);
  const headers = {
    'Content-Type': 'application/json',
    ...(key ? { Authorization: 'Bearer ' + key } : {}),
  };
  // 有的提供方不认 stream_options（会回 400），下面遇到就退回不带它的请求再发一次
  const bodyOf = withUsage => JSON.stringify({
    model,
    messages,
    temperature: Number.isFinite(cfg.temp) ? cfg.temp : 0.6,
    stream: true,
    ...(withUsage ? { stream_options: { include_usage: true } } : {}),
  });
  const send = body => fetch(url, { method: 'POST', headers, body, signal });
  let res;
  try {
    res = await send(bodyOf(true));
  } catch (e) {
    if (e && e.name === 'AbortError') throw e;
    throw new Error(netHint(url));
  }
  if (res.status === 400) {
    let d = '';
    try { d = await res.text(); } catch (e) { /* 忽略 */ }
    if (/stream_options|include_usage/i.test(d)) {
      try {
        res = await send(bodyOf(false));
      } catch (e) {
        if (e && e.name === 'AbortError') throw e;
        throw new Error(netHint(url));
      }
    } else {
      throw new Error(httpHint(400, d));
    }
  }
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch (e) { /* 忽略 */ }
    throw new Error(httpHint(res.status, detail));
  }
  // 有的代理忽略 stream 参数，直接回整块 JSON
  const ct = res.headers.get('content-type') || '';
  if (!res.body || ct.includes('application/json')) {
    const data = await res.json();
    const msg = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message : null;
    const text = msg ? (msg.content || '') : '';
    const reason = msg ? (msg.reasoning_content || msg.reasoning || '') : '';
    if (reason && onReason) onReason(reason);
    if (data.usage && onUsage) onUsage(data.usage);
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
      if (j.usage && onUsage) onUsage(j.usage);
      const d = j.choices && j.choices[0] ? (j.choices[0].delta || j.choices[0].message || {}) : {};
      const r = d.reasoning_content || d.reasoning || '';
      if (r && onReason) onReason(r);
      const t = d.content || '';
      if (t) { full += t; onDelta(t); }
    }
  }
  return full;
}

// 和 models.js / notes.js 一样，模块加载时就把存档读进来；
// 缺了这一行的话，刷新后 CHATS 是空的，第一次落盘会把旧对话覆盖掉。
loadChats();
