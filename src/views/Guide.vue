<template>
  <div class="guide">
    <div class="chapter-head">
      <h1>使用说明</h1>
      <p class="sub">从找章节到拖画板、记笔记、导出图片，一页看完。不需要装任何东西。</p>
    </div>

    <nav class="toc">
      <button v-for="s in SECS" :key="s.id" type="button" @click="jump(s.id)">{{ s.n }} · {{ s.t }}</button>
    </nav>

    <section id="g-start" class="blk">
      <h2><i>1</i>找到想看的内容</h2>
      <ul class="lst">
        <li><b>首页</b>：按「初等数学 / 高等数学」两栏列出全部模块，点模块卡进模块主页，主页里再分子专题列出各章。</li>
        <li><b>章节目录</b>：顶栏左侧「☰ 章节目录」抽屉，任何时候都能跳到别的模块，带各模块读了几章。</li>
        <li><b>全站搜索</b>：<kbd>Ctrl</kbd> + <kbd>K</kbd>（macOS 用 <kbd>⌘</kbd>），章名、板名与定理速查的词条都能搜到，回车直接打开。</li>
        <li><b>翻章</b>：章节页底部有上一章 / 下一章，键盘 <kbd>←</kbd> <kbd>→</kbd> 也能翻。</li>
        <li><b>定理速查</b>：顶栏「速查」，按模块列出核心结论，卡片点进去就是对应章节。</li>
        <li><b>阅读进度</b>：打开过的章节会被记住，模块主页与目录抽屉上显示读了几章；进度在本机，不上传。</li>
      </ul>
    </section>

    <section id="g-chapter" class="blk">
      <h2><i>2</i>一章里有什么</h2>
      <p>
        每章通常是「一块画板 + 一段推导」的结构：画板先给图形与可调的参数，下方用公式把结论写清楚，
        需要时再补例题。画板上方的操作条平时隐藏，鼠标移上去才出现。
      </p>
      <p>
        想打印成纸质讲义，点顶栏「🖨 打印」：会临时换成纸面配色（浅底深字、隐藏控件与导航），
        打印结束自动还原原来的主题。用浏览器菜单里的打印（<kbd>Ctrl</kbd> + <kbd>P</kbd>）也是同样效果。
      </p>
    </section>

    <section id="g-board" class="blk">
      <h2><i>3</i>画板怎么拖</h2>
      <ul class="lst">
        <li><b>把手</b>：图上的圆点、点或端点都能按住拖，读数与图形实时跟着变。</li>
        <li><b>滑块与开关</b>：板内下方的滑块调参数，开关切换辅助线与不同的构型。</li>
        <li><b>缩放与平移</b>：<kbd>Ctrl</kbd> + 滚轮在指针处放大缩小，放大后按住画面拖动平移，双击画面复原；
          操作条上的 <b>＋</b> / <b>－</b> 等效。</li>
        <li><b>半屏 / 全屏</b>：<b>◧ 半屏</b> 把这一块板浮在页面中间偏大处，<b>⛶ 全屏</b> 铺满整个窗口，
          再点一次或按 <kbd>Esc</kbd> 复原。同一时刻只浮一块板。</li>
        <li><b>搬动板内文字</b>：标签、标注可以直接拖开，双击挪过的文字回到原位（没挪过的双击仍是复原缩放）。
          设置页「记住板内文字位置」开着时，拖动结果会存档，刷新后还在。</li>
        <li><b>Aa 底注</b>：收起板内的说明行与图注，讲图时腾出版面；<b>▤ 底色</b> 只改这一块板的背景，
          预设色随亮暗主题自动配对，也能从调色板里挑任意颜色。</li>
        <li><b>🔗 分享</b>：把当前滑块值、开关状态、三维视角写进地址栏并复制链接，发给别人打开就是同一个现场。</li>
        <li><b>⤓ PNG</b>：把这块板（含板上的批注）导成图片，文件名按当前章节起。</li>
        <li><b>● 视频</b>：点一次开始录，再点一次结束并下载；录的是画板上动的部分，适合做小段演示。</li>
        <li><b>↗ GeoGebra</b>：把这章画板的图形与参数交给自由画板，接着自己改。</li>
        <li><b>→ 画布</b>：把整块板搬进画布，搬过去每个元素能单独拖、单独删，文字还能双击改。</li>
      </ul>
      <p class="tip">操作条的位置可以在设置页改：默认悬浮在画板右上，也可以搬到画板上方靠左或靠右。</p>
    </section>

    <section id="g-pad" class="blk">
      <h2><i>4</i>画布：随手写画</h2>
      <ul class="lst">
        <li>入口是顶栏「✏ 画布」与右下角铅笔圆钮。可以侧栏（正文让出一半）或整屏，跟设置页选的方向一致。</li>
        <li>画笔、橡皮、直线、矩形、圆、正多边形、五角星都有；Shift 拖动能把直线吸到 15° 的整数倍。</li>
        <li><b>选中</b>：点一下选中单个元素，拖动空白处框选；按住 <kbd>Ctrl</kbd> 点可以加选、减选。
          套索按形状剪选（设置里可切成按整条选）。</li>
        <li><b>改选中</b>：有选区时再点色块、粗细、线型，改的是选中的元素，不是画笔默认值。</li>
        <li><b>方向</b>：左右上下翻转、±90° 旋转；选区上方还有一枚圆钮可以任意角度旋转。</li>
        <li><b>撤销</b>：<kbd>Ctrl</kbd> + <kbd>Z</kbd>，一次退一整步。</li>
        <li>图片可以拖进来或粘贴进来，也能把整块章节画板搬进来。画布内容本机保存，一键导出 PNG。</li>
      </ul>
    </section>

    <section id="g-note" class="blk">
      <h2><i>5</i>笔记与备份</h2>
      <p>
        顶栏「笔记」打开随页笔记，左侧浮钮上的 📝 也一样。每个页面各有一份笔记，用 Markdown 记，
        公式写 <code>$…$</code> 或 <code>$$…$$</code> 会按 KaTeX 排出来。
      </p>
      <ul class="lst">
        <li>停手约 1.6 秒自动存；标题改了会自动另起一份，旧文件留着。</li>
        <li>同时在两个标签页开着编辑时，后改的那边会提示，点一下就能拉到最新内容。</li>
        <li>如果在设置页选了保存文件夹，笔记会同时写进那个文件夹（需要浏览器授权一次）。</li>
        <li>侧栏「⇪ 备份」导出整份 JSON，「⇩ 导入」在另一台机器或另一个浏览器里还原。</li>
      </ul>
    </section>

    <section id="g-tools" class="blk">
      <h2><i>6</i>几样常用工具</h2>
      <ul class="lst">
        <li><b>日历 · 待办</b>：月视图上点某天，右边记下要做的事，勾掉即完成；格子里带农历与节日（节日转橙，初一处写月份名），
          右侧显示当天的农历日期与干支生肖。首页与左侧浮钮上有入口，浮钮角标是今天还没做完的条数。整月可以导出成 JSON 备份。</li>
        <li><b>计算器</b>：右下角可拖动的圆形按钮，点开是带公式输入的键盘，可以改写成函数、积分、矩阵等。</li>
        <li><b>数字游戏</b>：顶栏与浮钮进「数字游戏」，24 点、华容道、速算、猜数字，另有 2048 与数独两页。</li>
        <li><b>AI 助手</b>：先在设置页填一个模型接口（地址、模型名、密钥），助手才会应答；
          面板里可以让它读当前画板的现场，也可以让它直接改板上的参数。</li>
      </ul>
    </section>

    <section id="g-look" class="blk">
      <h2><i>7</i>外观与偏好</h2>
      <p>
        顶栏「🎨 主题」一键换配色，共八套，深浅都在里面。更多细项在「⚙ 设置」：
        抽屉与各窗的开合方向、搜索框位置、翻页动画、卡片悬停颜色、背景动画（线、点尘、三维多面体）与浓度、
        操作条位置、批注工具条形态、板内文字位置档、模型与 API、笔记保存位置。
      </p>
      <p>偏好存在本机。换浏览器或换网址后要重新设一次，笔记与待办可以用各自的备份文件搬过去。</p>
    </section>

    <section id="g-keys" class="blk">
      <h2><i>8</i>快捷键</h2>
      <div class="keys">
        <div><kbd>Ctrl</kbd> K</div><span>打开全站搜索</span>
        <div><kbd>←</kbd> <kbd>→</kbd></div><span>上一章 / 下一章</span>
        <div><kbd>Ctrl</kbd> 滚轮</div><span>画板缩放</span>
        <div>拖动画面</div><span>放大后平移</span>
        <div>双击画面</div><span>复原缩放</span>
        <div><kbd>Esc</kbd></div><span>收回半屏 / 全屏画板</span>
        <div><kbd>Ctrl</kbd> Z</div><span>画布撤销</span>
        <div><kbd>Ctrl</kbd> 点击</div><span>画布加选 / 减选</span>
        <div><kbd>Ctrl</kbd> P</div><span>打印讲义</span>
      </div>
    </section>

    <section id="g-data" class="blk">
      <h2><i>9</i>数据在哪，怎么搬</h2>
      <p>
        笔记、待办、阅读进度、偏好、画布墨迹、板内文字位置，全部存在当前浏览器的 localStorage，
        按网址（origin）分开存。换浏览器、换域名、清了浏览器数据，这些都会没。
      </p>
      <ul class="lst">
        <li>笔记：笔记页侧栏「⇪ 备份」导出 JSON，新环境「⇩ 导入」。</li>
        <li>待办：日历页右上「备份 / 导入」。</li>
        <li>偏好与板内文字位置：在设置页重新调一次即可；文字位置也可导出 / 导入一份存档。</li>
      </ul>
    </section>

    <div class="more-row">
      <router-link class="more" to="/about">关于本站</router-link>
      <router-link class="more" to="/changelog">更新日志</router-link>
    </div>
  </div>
</template>

<script setup>
const SECS = [
  { id: 'g-start', n: 1, t: '找内容' },
  { id: 'g-chapter', n: 2, t: '一章的结构' },
  { id: 'g-board', n: 3, t: '画板' },
  { id: 'g-pad', n: 4, t: '画布' },
  { id: 'g-note', n: 5, t: '笔记' },
  { id: 'g-tools', n: 6, t: '工具' },
  { id: 'g-look', n: 7, t: '外观' },
  { id: 'g-keys', n: 8, t: '快捷键' },
  { id: 'g-data', n: 9, t: '数据' }
];

// hash 路由占着 #，锚点链接会把路由打乱，跳转改用 scrollIntoView
function jump(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<style scoped>
.guide { padding-bottom: 40px; }
h2 { font-size: 17.5px; margin: 0 0 10px; letter-spacing: .4px; display: flex; align-items: center; gap: 9px; }
h2 i {
  font-style: normal; font-size: 12px; font-weight: 600; width: 21px; height: 21px;
  display: inline-flex; align-items: center; justify-content: center; border-radius: 7px;
  color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--blue) 32%, transparent);
  font-variant-numeric: tabular-nums;
}

.toc {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 4px; padding: 12px 14px;
  border-radius: 14px; border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 55%, transparent);
}
.toc button {
  font: inherit; font-size: 12.8px; padding: 5px 11px; border-radius: 99px; cursor: pointer;
  color: var(--mut); border: 1px solid var(--line); background: transparent;
  transition: color .14s ease, border-color .14s ease;
}
.toc button:hover { color: var(--blue); border-color: var(--blue); }

.blk {
  margin: 14px 0; padding: 18px 20px; border-radius: 16px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 62%, transparent);
  scroll-margin-top: 80px;
}
.blk p { margin: 8px 0 0; font-size: 14px; line-height: 1.92; color: var(--mut); }
.blk p.tip { font-size: 13px; padding: 9px 13px; margin-top: 12px; border-radius: 10px;
  border-left: 3px solid var(--cyan); background: color-mix(in srgb, var(--cyan) 8%, transparent); }

.lst { margin: 6px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 9px; }
.lst li {
  position: relative; padding-left: 16px; font-size: 13.8px; line-height: 1.88; color: var(--mut);
}
.lst li::before {
  content: ''; position: absolute; left: 2px; top: .74em;
  width: 5px; height: 5px; border-radius: 50%; background: var(--blue); opacity: .75;
}
.lst li b { color: var(--ink); margin-right: 3px; }

code {
  font-size: 12.6px; padding: 1px 5px; border-radius: 5px;
  background: color-mix(in srgb, var(--blue) 10%, transparent); color: var(--blue);
}
kbd {
  display: inline-block; font: inherit; font-size: 11.6px; line-height: 1.5;
  padding: 0 6px; margin: 0 1px; border-radius: 5px; color: var(--ink);
  border: 1px solid var(--line); border-bottom-width: 2px;
  background: color-mix(in srgb, var(--bg2) 70%, transparent);
}

.keys {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 8px 18px; margin-top: 4px;
}
.keys > div {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  padding: 7px 0; border-bottom: 1px dashed color-mix(in srgb, var(--line) 70%, transparent);
}
.keys span { font-size: 13px; color: var(--mut); }

.more-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; padding-top: 16px; border-top: 1px dashed var(--line); }
.more {
  font-size: 13.5px; padding: 8px 16px; border-radius: 99px; text-decoration: none;
  color: var(--mut); border: 1px solid var(--line);
  transition: color .14s ease, border-color .14s ease, background .14s ease;
}
.more:hover { color: var(--blue); border-color: var(--blue); background: color-mix(in srgb, var(--blue) 8%, transparent); }

@media (max-width: 720px) {
  .blk { padding: 15px 16px; }
  .keys { grid-template-columns: 1fr; }
}
</style>
