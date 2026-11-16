<template>
  <ChPage :cur="1" no="不1" base="/topology/v" :chapters="TIN_CHAPTERS"
    title="欧拉示性数"
    sub="把曲面切成有限块，数顶点、棱、面，算 V−E+F。切法换成什么样，这个数都不变——它只认曲面，不认切法。欧拉示性数是第一个能上手算的拓扑不变量。"
    :toc="[{ id: 'v1-def', t: '剖分与 V−E+F' }, { id: 'v1-inv', t: '与切法无关' }, { id: 'v1-genus', t: '亏格与 2−2g' }, { id: 'v1-use', t: '拿它判断不同胚' }, { id: 'v1-tip', t: '四条提示' }]">
    <div class="note good">设曲面 <Katex tex="S" /> 被剖分成有限个顶点、棱与面，记顶点数为 <Katex tex="V" />、棱数为 <Katex tex="E" />、面数为 <Katex tex="F" />。称
      <Katex tex="\chi(S)=V-E+F" /> 为 <Katex tex="S" /> 的<b>欧拉示性数</b>。它是拓扑不变量：同胚的曲面有相同的 <Katex tex="\chi" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createEuler" />
      <div class="cap">图 不1 · <b>数顶点机</b>：四张曲面各给一种剖分。看点：① 四面体 <Katex tex="V=4" />、<Katex tex="E=6" />、<Katex tex="F=4" />，算得 <Katex tex="2" />；② 长方体的切法完全不同，<Katex tex="8-12+6" /> 仍是 <Katex tex="2" />——球面的切法换来换去，和不变；③ 环面用一张四边形粘边，四个角成一点、两条边各成一圈，<Katex tex="1-2+1=0" />；④ 双环面再减到 <Katex tex="-2" />，规律就一条 <Katex tex="\chi=2-2g" />。</div>
    </div>

    <h3 class="sec" id="v1-def">剖分与 V−E+F</h3>
    <p>剖分是把曲面切成有限块：面是同胚于多边形的片，棱是相邻两片共用的边，顶点是棱的端点。要求每条棱恰好属于两个面，每个顶点周围的块围成一圈，不能有半截棱悬空。</p>
    <p>在平面上画一个连通图，围出的区域数记为 <Katex tex="F" />（含外面那块无界区域），高斯—邦内式的计数给出 <Katex tex="V-E+F=2" />。这就是球面上的情形：平面加一个无穷远点就是球面，外面那块区域正是无穷远附近的面。</p>
    <p>算的时候常常漏掉无界面。四面体画成平面图，外面那块也是一面，<Katex tex="F" /> 是 <Katex tex="4" /> 而不是 <Katex tex="3" />；漏掉它，算出来就是 <Katex tex="1" />，与球面矛盾。</p>

    <h3 class="sec" id="v1-inv">与切法无关</h3>
    <p>不变性可以这样看：两种剖分能通过一串局部操作互相转换，而这些操作不改变 <Katex tex="V-E+F" />。局部操作只有三种：</p>
    <ul>
      <li>在一条棱上插一个顶点：<Katex tex="V" /> 加一，<Katex tex="E" /> 加一，差额不变；</li>
      <li>在一个面里画一条对角线：<Katex tex="E" /> 加一，<Katex tex="F" /> 加一，差额不变；</li>
      <li>在一个面里加一个顶点并连接到边界：<Katex tex="V" /> 加一，<Katex tex="E" /> 加若干，<Katex tex="F" /> 加同样多，差额不变。</li>
    </ul>
    <p>任两张剖分都能经由这几种操作变成一个共同的加细剖分，所以 <Katex tex="\chi" /> 只与曲面有关。这条论证也解释了为什么细分的面再多，算出来还是同一个数。</p>

    <h3 class="sec" id="v1-genus">亏格与 2−2g</h3>
    <p>可定向闭曲面的欧拉示性数只由亏格决定：</p>
    <p style="text-align:center"><Katex display tex="\chi=2-2g." /></p>
    <p>球面 <Katex tex="g=0" />，得 <Katex tex="2" />；环面 <Katex tex="g=1" />，得 <Katex tex="0" />；双环面 <Katex tex="g=2" />，得 <Katex tex="-2" />。每接一个环柄，<Katex tex="\chi" /> 减 <Katex tex="2" />。接环柄的操作在剖分上表现为挖掉两个小圆盘再粘上一段管子：顶点与面各少一、棱少二，代数和恰好减二。</p>
    <p>不可定向的情形另有公式。每接一个交叉帽，<Katex tex="\chi" /> 减一；克莱因瓶 <Katex tex="\chi=0" />，射影平面 <Katex tex="\chi=1" />。射影平面可以由球面挖一个洞、再粘一条莫比乌斯带得到，算下来比球面少一，与公式吻合。</p>

    <h3 class="sec" id="v1-use">拿它判断不同胚</h3>
    <p><Katex tex="\chi" /> 不同，两张曲面一定不同胚。球面 <Katex tex="2" /> 与环面 <Katex tex="0" /> 因此分开；环面与克莱因瓶的 <Katex tex="\chi" /> 都是零，<Katex tex="\chi" /> 分不开它们，得再借助可定向性——环面可定向，克莱因瓶不可定向。</p>
    <p>反过来，<Katex tex="\chi" /> 相同推不出同胚。判断同胚需要整套分类数据：可定向性加亏格。欧拉示性数是必要条件，不是充分条件，答题时要把方向写清。</p>
    <p>这条不变量还有一处用处：判断多面体能否同胚于球面。凸多面体都同胚于球面，<Katex tex="\chi=2" />；若某个多面体算出来不是 <Katex tex="2" />，它必有穿洞或粘合异常，与凸性矛盾。数一数顶点、棱、面就能排掉一类错误作图。</p>

    <h3 class="sec" id="v1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：无界面也要数进去。</strong>平面图围出的区域包含外面那块。四面体 <Katex tex="F=4" />，漏了它就算成 <Katex tex="1" />。</li>
        <li><strong>提示二：粘边之后顶点数要重算。</strong>正方形四角粘成一点，<Katex tex="V=1" /> 而不是 <Katex tex="4" />。按粘好的曲面数，不能按原图数。</li>
        <li><strong>提示三：<Katex tex="\chi" /> 是必要条件。</strong><Katex tex="\chi" /> 不同必不同胚，但 <Katex tex="\chi" /> 相同未必同胚。环面与克莱因瓶就是 <Katex tex="\chi" /> 相同而不同胚的一对。</li>
        <li><strong>提示四：有边界时公式要改。</strong>带边曲面的公式里还要减去边界圈的贡献。莫比乌斯带 <Katex tex="\chi=0" />，与闭曲面的算法不同，先看清有没有边界。</li>
      </ul>
    </div>
    <p>回收与预告：<Katex tex="\chi" /> 只用了三维以下的块数，看不见「洞是怎么绕的」。把闭环路按能否连续变形分成类，这些类会组成一个群——基本群。它能分开 <Katex tex="\chi" /> 分不开的曲面。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEuler } from '../../../boards/topology/invariant/eulerchi.js';
import { TIN_CHAPTERS } from './vnav.js';
</script>
