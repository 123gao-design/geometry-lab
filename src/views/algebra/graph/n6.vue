<template>
  <ChPage :cur="6" no="网6" base="/algebra/n" :chapters="AN_CHAPTERS"
    title="图的着色与匹配"
    sub="相邻顶点必须用不同颜色，最少需要几种叫色数。团给出下界，贪心给出上界，两者常常不一致。匹配是两两不共端点的边集，最大匹配在二分图里有霍尔定理保证。"
    :toc="[{ id: 'n6-color', t: '着色与色数' }, { id: 'n6-bound', t: '下界与上界' }, { id: 'n6-match', t: '匹配与霍尔定理' }, { id: 'n6-tip', t: '四条提示' }]">
    <div class="note good">给顶点染色使每条边的两端异色，所需的最少颜色数叫<b>色数</b> <Katex tex="\chi(G)" />。团数为 <Katex tex="\omega" /> 的图必有 <Katex tex="\chi\ge\omega" />；贪心染色给出 <Katex tex="\chi\le\Delta+1" />。两两不共端点的边集叫<b>匹配</b>，二分图中最大匹配的大小等于最小顶点覆盖的大小。</div>

    <div class="board-wrap">
      <BoardMount :factory="createColor" />
      <div class="cap">图 网6 · <b>染色与匹配机</b>：三枚按钮切换三角形、五边形与完全二分图。看点：① 顶点按贪心顺序染色，相邻两点的颜色必不相同；② 三角形与五边形都要三色，完全二分图两色够用；③ 绿粗边是给出的匹配，K₃,₃ 的三条边互不共端点，是完美匹配。</div>
    </div>

    <h3 class="sec" id="n6-color">着色与色数</h3>
    <p>着色是把顶点分成若干独立集：同色的点之间没有边。色数就是最少要分成几组。地图上相邻区域异色是同一个问题的平面版本，四色定理说的是平面图的色数不超过 4。</p>
    <p>二分图的色数恰为 2，因为两组本身就是一种二着色。反过来，能二着色就意味着顶点可以分成两组、边只跨组，这正是二分图的定义。</p>
    <p>色数的精确计算是 NP 困难的。实际做法是先用团拿一个下界、再用贪心拿一个上界，两者相等就得到答案；不相等时继续搜索。</p>

    <h3 class="sec" id="n6-bound">下界与上界</h3>
    <p>团里任意两点相邻，必须各用一种颜色，所以团的大小是色数的下界。三角形与完全图 <Katex tex="K_n" /> 都取等，这条下界最直接。</p>
    <p>贪心按某个顺序逐点染色，每点只需避开已染邻居用过的颜色，所以最多用 <Katex tex="\Delta+1" /> 种。布鲁克斯定理把它收紧：连通图若不是完全图也不是奇圈，则 <Katex tex="\chi\le\Delta" />。</p>
    <p>贪心的结果与顶点顺序有关。画板固定按编号顺序染色，三角形得到 3、五边形得到 3；顺序换过结果可能更好，但不会更差。</p>

    <h3 class="sec" id="n6-match">匹配与霍尔定理</h3>
    <p>匹配是两两不共端点的边集，等价于给每个人分配一个不冲突的对象。完美匹配覆盖全部顶点，最大匹配是边数最多的那一个。</p>
    <p>二分图中求最大匹配可以用增广路：从一条未匹配的边出发，反复在不匹配、匹配之间交替寻找，找到一条两端都未被覆盖的交替路就把它翻转，匹配数加 1。找不到增广路就达到最大。</p>
    <p>霍尔定理给出存在完整匹配的判据：左侧任取一组顶点，它们的邻居总数不少于这组顶点数。这条条件既必要又充分，是匹配理论里最常用的一条。</p>

    <h3 class="sec" id="n6-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：色数不小于团数，但不必相等。</strong>五边形团数是 2、色数是 3，这组反例说明了差额确实存在。</li>
        <li><strong>提示二：贪心给出的是上界。</strong>换顺序可能少用一种颜色，判断精确值时要确认没有更省的做法。</li>
        <li><strong>提示三：奇圈的色数恒为 3。</strong>二着色在奇数个顶点上必然在第一点与最后一点冲突，这条与二分图的判据是一回事。</li>
        <li><strong>提示四：匹配的大小不等于色数。</strong>K₃,₃ 的最大匹配是 3、色数是 2，两个量分别刻画两种结构。</li>
      </ul>
    </div>
    <p>回收与预告：抽象代数到这里收束。从二元运算与半群出发，经过群、环、域与同态，再到置换群、二面体群，最后由群转向图的结构与不变量——三部分共用同一套语言：在某个运算下保持封闭、在其中辨认结构、用不变量区分彼此。速查页把每一章的结论列成卡片，可按子专题回看。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createColor } from '../../../boards/algebra/graph/color.js';
import { AN_CHAPTERS } from './annav.js';
</script>
