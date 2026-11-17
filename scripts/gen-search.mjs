/* 从 views/CheatSheet.vue 抽出定理速查的 376 条，生成 src/lib/cheatindex.js。
   速查页是手写模板，条目就是 .topic-card 那一行；改完速查记得重跑：npm run gen:cheat
   （生成的文件要一起提交，运行时不该解析模板）。 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'src/views/CheatSheet.vue'), 'utf8');

const strip = html => html
  .replace(/<[^>]*>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

const out = [];
let sec = '';
const re = /<h3 class="sec">([^<]+)<\/h3>|<router-link class="topic-card" to="([^"]+)">([\s\S]*?)<\/router-link>/g;
let m;
while ((m = re.exec(src))) {
  if (m[1] !== undefined) { sec = m[1].trim(); continue; }
  const to = m[2];
  const body = m[3];
  const tag = (body.match(/<span class="tag">([^<]*)<\/span>/) || [, ''])[1].trim();
  const title = strip((body.match(/<h3>([\s\S]*?)<\/h3>/) || [, ''])[1]);
  const tex = [];
  const tre = /<Katex[^>]*\btex="([^"]*)"/g;
  let tm;
  while ((tm = tre.exec(body))) tex.push(tm[1]);
  const text = strip(body
    .replace(/<h3>[\s\S]*?<\/h3>/, '')
    .replace(/<span class="tag">[\s\S]*?<\/span>/, ''));
  out.push({ to, tag, sec, t: title, tex, d: text.slice(0, 160) });
}

if (out.length < 300) throw new Error('只抽到 ' + out.length + ' 条，速查页结构可能变了');

const js = `/* 由 scripts/gen-search.mjs 从 views/CheatSheet.vue 生成，别手改。重跑：npm run gen:cheat
   ${out.length} 条定理速查：{ to, tag, sec, t, tex[], d } */
export const CHEAT_INDEX = ${JSON.stringify(out, null, 0)};
`;
fs.writeFileSync(path.join(root, 'src/lib/cheatindex.js'), js);
console.log('cheatindex.js →', out.length, '条');
