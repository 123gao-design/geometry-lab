<template>
  <ChPage :cur="3" no="不3" base="/topology/v" :chapters="TIN_CHAPTERS"
    title="覆叠空间"
    sub="覆叠是把一个空间「摊平」成好几层，每一层都盖在底空间上，局部看像平铺，整体看有重数。圆周展开成直线是无穷重的覆叠，圆周映到圆周的平方映射是二重覆叠。层数的信息，正是基本群的信息。"
    :toc="[{ id: 'v3-def', t: '覆叠映射的定义' }, { id: 'v3-example', t: '两个标准例子' }, { id: 'v3-lift', t: '道路与同伦的提升' }, { id: 'v3-galois', t: '与基本群的对应' }, { id: 'v3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="p:\tilde X\to X" /> 连续满射。若每一点 <Katex tex="x\in X" /> 都有开邻域 <Katex tex="U" />，使 <Katex tex="p^{-1}(U)" /> 是一族互不相交的开集之并，且 <Katex tex="p" /> 限制在每个开集上都是到 <Katex tex="U" /> 的同胚，就称 <Katex tex="p" /> 是<b>覆叠映射</b>，<Katex tex="\tilde X" /> 是 <Katex tex="X" /> 的<b>覆叠空间</b>，这样的 <Katex tex="U" /> 叫<b>均匀覆叠邻域</b>，层数叫<b>覆叠度</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCovering" />
      <div class="cap">图 不3 · <b>覆叠空间与道路提升</b>：实数轴与圆周并排。看点：① 直线上每隔一个整数放一枚点，它们全落到圆周上同一点，虚线把对应关系拉直；② 拖动滑块让基点沿直线走，每过一个整数，就回到圆周上同一点；③ 圆周上一小段绿色弧，它的原像是一串互不相交的同款小段，这就是「均匀铺开」；④ 切到二次覆叠，原像变成两个，相隔半圈。</div>
    </div>

    <h3 class="sec" id="v3-def">覆叠映射的定义</h3>
    <p>定义分为两条。局部上，每个底点都有邻域被原像均匀摊开；整体上，摊开的层数处处相同。前者说明是「局部同胚」，后者说明层数不跳变，两条合起来才是覆叠。</p>
    <p>层数处处相同这一点不可省。把开区间 <Katex tex="(0,2)" /> 折到圆周上，靠近端点处层数会掉，原像不再是均匀的几层，只能算局部同胚，不是覆叠。要求满射也是为了排除这种掉层的情形。</p>
    <p>覆叠度可以是有限的，也可以是无限的。有限的例子如 <Katex tex="z\mapsto z^n" />，层数为 <Katex tex="n" />；无限的例子如直线覆叠圆周。覆叠度是基本群中一个子群的指数，有限与无限在这里也对应得上。</p>

    <h3 class="sec" id="v3-example">两个标准例子</h3>
    <p><b>直线覆叠圆周</b>：<Katex tex="p(x)=e^{2\pi ix}" />。圆周上每一点的原像是一整列等距点 <Katex tex="x_0+k" />，<Katex tex="k\in\mathbb Z" />。取圆周上不整圈的一小段弧，它的原像是一串同长度的小区间，每段映上去都是同胚。覆叠度无穷。</p>
    <p><b>二次覆叠</b>：<Katex tex="p(z)=z^2" /> 把圆周映到圆周，角度翻倍。基圆上一点的原像有两点，相隔半圈 <Katex tex="\pi" />。覆叠度为 <Katex tex="2" />，层数是有限的两层。</p>
    <p>两个例子共用同一条直觉：底空间上的路，抬到覆叠空间里就变成唯一的一条路，起点定下就定死了。圆周上绕一圈的闭环路抬到直线上，终点恰好比起始点大 <Katex tex="1" />，这个差数就是绕数。</p>

    <h3 class="sec" id="v3-lift">道路与同伦的提升</h3>
    <p><b>道路提升</b>：设 <Katex tex="p" /> 是覆叠映射，<Katex tex="\gamma" /> 是底空间里从 <Katex tex="x_0" /> 出发的道路，<Katex tex="\tilde x_0" /> 是 <Katex tex="x_0" /> 的一个原像。则存在唯一的道路 <Katex tex="\tilde\gamma" /> 从 <Katex tex="\tilde x_0" /> 出发，使 <Katex tex="p\circ\tilde\gamma=\gamma" />。</p>
    <p>唯一性来自局部同胚：每一步只要在一小块均匀覆叠邻域里找那唯一的一片，抬起来的路就被钉死了。存在性靠把 <Katex tex="[0,1]" /> 切成有限小段，每段落在一个均匀邻域里，再逐段接上。</p>
    <p><b>同伦提升</b>：同伦也能提升，而且把起点钉住之后同样唯一。这一条是计算基本群的主力。底空间里两条同伦的闭环路，抬到覆叠空间里就是两条端点相同的道路，于是层数信息与同伦类挂了钩。</p>

    <h3 class="sec" id="v3-galois">与基本群的对应</h3>
    <p>把圆周的基本群算出来，只用一句话：直线上的闭环路必须首尾同点，而覆盖到圆周上是闭环路当且仅当 <Katex tex="p(0)=p(n)" />，即 <Katex tex="n" /> 是整数。所以同伦类与整数一一对应，</p>
    <p style="text-align:center"><Katex display tex="\pi_1(S^1)\cong\mathbb Z." /></p>
    <p>这条论证可以推广成一条定理：连通的覆叠 <Katex tex="p:\tilde X\to X" /> 与 <Katex tex="\pi_1(X)" /> 的子群一一对应，层数等于子群的指数。覆叠空间越「大」，对应的子群越小；覆叠度就是一层的层数，也是指数。</p>
    <p>这层对应还把这些覆叠之间的关系说清了。两个覆叠之间的同构由覆叠变换群刻画，它恰是 <Katex tex="\pi_1(X)" /> 中那个子群对应的正规子群。覆叠是基本群的一张空间化的相片：群越大，摊得越开。</p>

    <h3 class="sec" id="v3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：层数处处相同。</strong>原像在每一处的层数必须一致。掉层的地方只能算局部同胚，够不上覆叠。</li>
        <li><strong>提示二：提升需要指定起点。</strong>道路的提升在给定一个原像之后才唯一。不指定起点，可以有很多条提升。</li>
        <li><strong>提示三：覆叠不同于同胚。</strong>覆叠在局部是一一对应，整体却是多层。直线与圆周局部像，整体完全不同胚。</li>
        <li><strong>提示四：覆叠度是子群的指数。</strong>二重覆叠对应指数二的子群，无限重覆叠对应无限指数的子群。层数不是随便的数，它由基本群决定。</li>
      </ul>
    </div>
    <p>回收与收束：从开集公理出发，过连通与紧致，到欧拉示性数、基本群与覆叠空间，拓扑学的主线到此走了一遍。长度与角度退出以后，剩下的远近结构反而更能分辨形状——咖啡杯与甜甜圈同胚，球面与环面不同胚，判断都落在这一套不变量上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCovering } from '../../../boards/topology/invariant/covering.js';
import { TIN_CHAPTERS } from './vnav.js';
</script>
