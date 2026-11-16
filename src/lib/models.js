// 模型列表与 API 设置：都存在 localStorage['gl-models']，聊天窗口直接读这里。
// 接口按 OpenAI 兼容的 /chat/completions 走，所以自定义地址只需填到 /v1 这一层。
import { reactive } from 'vue';

const KEY = 'gl-models';

export const MODELS = reactive({
  list: [],      // [{ id, name, baseUrl, model, key, temp }]
  active: '',    // 当前使用模型的 id
});

export const PRESETS = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { name: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { name: '本地 Ollama', baseUrl: 'http://localhost:11434/v1', model: 'qwen2.5:7b' },
];

export function loadModels() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && Array.isArray(raw.list)) {
      MODELS.list = raw.list.filter(m => m && m.id && typeof m.baseUrl === 'string').map(norm);
      MODELS.active = MODELS.list.some(m => m.id === raw.active) ? raw.active : (MODELS.list[0] ? MODELS.list[0].id : '');
    }
  } catch (e) { /* 脏档丢弃，按空白处理 */ }
}

function norm(m) {
  return {
    id: String(m.id),
    name: String(m.name || m.model || '未命名模型'),
    baseUrl: String(m.baseUrl || '').replace(/\/+$/, ''),
    model: String(m.model || ''),
    key: String(m.key || ''),
    temp: Number.isFinite(m.temp) ? m.temp : 0.6,
  };
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ list: MODELS.list, active: MODELS.active })); } catch (e) { /* 忽略 */ }
}

export function addModel(patch = {}) {
  const id = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const m = norm({ id, name: patch.name || '新模型', baseUrl: patch.baseUrl || '', model: patch.model || '', key: '', temp: 0.6 });
  MODELS.list.push(m);
  if (!MODELS.active) MODELS.active = id;
  persist();
  return m;
}

export function updateModel(id, patch) {
  const i = MODELS.list.findIndex(m => m.id === id);
  if (i < 0) return;
  MODELS.list[i] = norm({ ...MODELS.list[i], ...patch, id });
  persist();
}

export function removeModel(id) {
  const i = MODELS.list.findIndex(m => m.id === id);
  if (i < 0) return;
  MODELS.list.splice(i, 1);
  if (MODELS.active === id) MODELS.active = MODELS.list[0] ? MODELS.list[0].id : '';
  persist();
}

export function setActiveModel(id) {
  if (!MODELS.list.some(m => m.id === id)) return;
  MODELS.active = id;
  persist();
}

export function activeModel() {
  return MODELS.list.find(m => m.id === MODELS.active) || null;
}

loadModels();
