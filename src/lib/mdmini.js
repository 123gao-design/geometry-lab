// 轻量 Markdown 渲染：聊天与笔记共用。支持标题、列表、引用、代码块、表格、分割线、链接、粗斜体、删除线，
// 以及 $…$ / $$…$$ 的 KaTeX 公式（与站内 texMix 同一个 katex 实例）。不做 HTML 透传，全部先转义。
//
// KaTeX 改成按需取：它是首屏最大的一块依赖，而首屏并不画公式。挂载后由 preloadKatex() 预取，
// 取到之前公式先退成等宽源码，取到后由调用方重渲染一次（见 ChatDock 的 mdTick）。
let katex = null;
let loading = null;
export function katexReady() { return !!katex; }
export function preloadKatex() {
  if (katex) return Promise.resolve(katex);
  if (!loading) {
    loading = import('katex')
      .then(m => { katex = m.default || m; return katex; })
      .catch(() => null); // 取不到就一直是源码形态，别让聊天整体挂掉
  }
  return loading;
}

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function tex(tex, display) {
  if (!katex) return '<code>' + esc(tex) + '</code>';
  try {
    return katex.renderToString(tex, { displayMode: display, throwOnError: false });
  } catch (e) {
    return '<code>' + esc(tex) + '</code>';
  }
}

// 行内：先把代码片段与公式抽成占位符，转义后再拼回来，免得被 * _ ~ 规则误伤
function inline(s) {
  const slots = [];
  const keep = html => { slots.push(html); return '\u0000' + (slots.length - 1) + '\u0000'; };
  s = s.replace(/`([^`\n]+)`/g, (_, c) => keep('<code>' + esc(c) + '</code>'));
  s = s.replace(/\$(?!\$)([^$\n]+?)\$/g, (_, t) => keep(tex(t, false)));
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => '<img alt="' + a + '" src="' + u + '">');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => '<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
}

const isList = l => /^\s*(?:[-*+]|\d+[.)])\s+/.test(l);
const isQuote = l => /^\s*>/.test(l);
const isHr = l => /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l);
const isHead = l => /^\s*#{1,6}\s+/.test(l);
const isFence = l => /^\s*```/.test(l);
const isMathBlock = l => /^\s*\$\$\s*$/.test(l) || /^\s*\$\$.+\$\$\s*$/.test(l);

function splitRow(l) {
  return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

export function renderRich(src) {
  const lines = String(src == null ? '' : src).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 围栏代码块（记下语言，聊天窗据此显示标签与下载扩展名）
    if (isFence(line)) {
      const lang = (line.trim().slice(3) || '').trim().split(/\s+/)[0].toLowerCase();
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // 跳过收尾的 ```
      out.push('<pre class="md-code"' + (lang ? ' data-lang="' + esc(lang) + '"' : '') + '><code>' + esc(buf.join('\n')) + '</code></pre>');
      continue;
    }

    // 独立公式块：$$ 单行包住，或独占两行的 $$ … $$
    if (isMathBlock(line)) {
      const oneLine = line.trim().replace(/^\$\$/, '').replace(/\$\$$/, '');
      if (oneLine.trim()) { out.push('<div class="md-math">' + tex(oneLine, true) + '</div>'); i++; continue; }
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*\$\$\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      out.push('<div class="md-math">' + tex(buf.join('\n'), true) + '</div>');
      continue;
    }

    if (/^\s*$/.test(line)) { i++; continue; }

    if (isHead(line)) {
      const m = line.match(/^\s*(#{1,6})\s+(.*)$/);
      const n = m[1].length;
      out.push('<h' + n + '>' + inline(m[2]) + '</h' + n + '>');
      i++;
      continue;
    }

    if (isHr(line)) { out.push('<hr>'); i++; continue; }

    // 表格：一行 | a | b | 紧跟一行 | --- | --- |
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:-]+\|[\s:|-]*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && /\S/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      out.push('<table class="md-table"><thead><tr>' + head.map(c => '<th>' + inline(c) + '</th>').join('') +
        '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>');
      continue;
    }

    // 引用：整段 > 行连起来，内部再按 Markdown 走一遍
    if (isQuote(line)) {
      const buf = [];
      while (i < lines.length && isQuote(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push('<blockquote>' + renderRich(buf.join('\n')) + '</blockquote>');
      continue;
    }

    // 列表：同一个列表里允许缩进的续行
    if (isList(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items = [];
      while (i < lines.length && (isList(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const m = lines[i].match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)$/);
        if (m) items.push(m[1]);
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push('<' + tag + '>' + items.map(t => '<li>' + inline(t) + '</li>').join('') + '</' + tag + '>');
      continue;
    }

    // 普通段落：连续行合并，段内换行保留为 <br>
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !isHead(lines[i]) && !isList(lines[i]) && !isQuote(lines[i]) &&
      !isFence(lines[i]) && !isHr(lines[i]) && !isMathBlock(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push('<p>' + buf.map(inline).join('<br>') + '</p>');
  }
  return out.join('\n');
}

/** 纯文本摘要：给对话列表当标题用 */
export function plain(s, n = 40) {
  const t = String(s || '').replace(/[#>*`_~$|]/g, '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}
