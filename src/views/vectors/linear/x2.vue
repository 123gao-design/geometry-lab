<template>
  <ChPage :cur="2" no="向2" base="/vectors/x" :chapters="VX_CHAPTERS"
    title="向量的加法与减法"
    sub="两次位移接在一起就是一次位移，这就是向量加法；把两支箭头的起点并到一处，平行四边形的对角线给出另一种画法。减法是加法的逆运算，结果是起点在减数、终点在被减数的一支箭头。"
    :toc="[{ id: 'x2-tri', t: '三角形法则：首尾相接' }, { id: 'x2-para', t: '平行四边形法则：同起点' }, { id: 'x2-sub', t: '减法与差向量' }, { id: 'x2-prop', t: '运算律与长度不等式' }, { id: 'x2-pit', t: '起点、方向与取等' }]">
    <div class="note good" id="x2-def">向量加法有两条画法，画出的结果相同。<strong>三角形法则</strong>：把 <Katex tex="\vec b" /> 的起点接到 <Katex tex="\vec a" /> 的终点上，由 <Katex tex="\vec a" /> 的起点指向 <Katex tex="\vec b" /> 的终点的向量就是 <Katex tex="\vec a+\vec b" />。<strong>平行四边形法则</strong>：把 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" /> 的起点并到一处，以它们为邻边作平行四边形，从公共起点出发的对角线就是 <Katex tex="\vec a+\vec b" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createAddRule" />
      <div class="cap">图 向2 · <b>加法法则机</b>：拖动 A、B 两个终点，蓝色是 <Katex tex="\vec a" />，橙色是 <Katex tex="\vec b" />，绿色是运算结果。看点：第一档把橙箭头平移到蓝箭头的终点，绿色对角线由公共起点直达平移后的终点；第二档的两个虚线边补成平行四边形，对角线是同一条；第三档换取 <Katex tex="\vec a-\vec b" />，绿色箭头改从 <Katex tex="\vec b" /> 的终点指回 <Katex tex="\vec a" /> 的终点。</div>
    </div>

    <h3 class="sec" id="x2-tri">三角形法则：首尾相接</h3>
    <p>先向东走 3 米，再向北走 4 米，两次位移合起来的效果，等于从起点直达终点的 5 米位移。把两次位移画成两支箭头，第二支的起点接在第一支的终点上，那么从第一支的起点指向第二支的终点的箭头就是合位移。这条规则叫三角形法则，名称来自图上三支箭头围成一个三角形。</p>
    <p>法则可以连续使用：<Katex tex="\vec a+\vec b+\vec c" /> 就是把三支箭头首尾相接地排起来，由第一支的起点指向最后一支的终点。多个向量相加都按这个办法处理，与相加的顺序无关，图上的箭头链首尾相接，中间的点各自抵消。</p>

    <h3 class="sec" id="x2-para">平行四边形法则：同起点</h3>
    <p>如果两支箭头的起点已经重合，三角形法则就得先把其中一支平移过去；把平移这一步留在图上，正好补出平行四边形的另外两条边，结果就是对角线。这就是平行四边形法则。它适合处理「同一个作用点上的两个力」这类问题：两个分力从同一点出发，合力沿对角线。</p>
    <p>两条法则给出的结果一定是同一个向量，因为平移向量不改变它本身。选哪一条只取决于图上方便：位移类问题习惯首尾相接，力的合成习惯同起点。图 向2 的第一档与第二档画的是同一条绿色对角线，只是补边的顺序不同。</p>

    <h3 class="sec" id="x2-sub">减法与差向量</h3>
    <p>减法是加法的逆运算：<Katex tex="\vec a-\vec b" /> 是这样一个向量，加上 <Katex tex="\vec b" /> 之后等于 <Katex tex="\vec a" />。把两个向量的起点并到一处，由 <Katex tex="\vec b" /> 的终点指向 <Katex tex="\vec a" /> 的终点的箭头就是 <Katex tex="\vec a-\vec b" />。它与和向量共用同一个平行四边形，两条对角线一和、一差，起点相同，终点互换。</p>
    <p>也可以把减法写成加法：<Katex tex="\vec a-\vec b=\vec a+(-\vec b)" />，其中 <Katex tex="-\vec b" /> 与 <Katex tex="\vec b" /> 长度相等、方向相反。第三档把 <Katex tex="-\vec b" /> 接在 <Katex tex="\vec a" /> 的终点上，得到的仍是同一支绿色箭头，与「由 <Katex tex="\vec b" /> 的终点指向 <Katex tex="\vec a" /> 的终点」画法互相印证。</p>

    <h3 class="sec" id="x2-prop">运算律与长度不等式</h3>
    <p>向量加法满足交换律 <Katex tex="\vec a+\vec b=\vec b+\vec a" /> 与结合律 <Katex tex="(\vec a+\vec b)+\vec c=\vec a+(\vec b+\vec c)" />，两条都能从平行四边形与箭头链上看出来：交换只是把两支箭头换个名字，结合只是把链子的分组换个切法。</p>
    <p>和向量的长度有一条常用的不等式：<Katex tex="\big||\vec a|-|\vec b|\big|\le|\vec a+\vec b|\le|\vec a|+|\vec b|" />。右边取等当且仅当两向量同向，此时两支箭头首尾相接后伸直成一条线，长度相加；左边取等当且仅当两向量反向，长的压住短的，长度相减。图 向2 的判读会在两向量共线时给出对应的说明，垂直时和向量与差向量的长度相等，因为这时平行四边形是矩形、两条对角线一样长。</p>

    <h3 class="sec" id="x2-pit">起点、方向与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：三角形法则的接法是「首尾相接」，不是「同起点」。</strong>若把两支箭头的起点并在一处直接连它们的终点，得到的是差向量 <Katex tex="\vec a-\vec b" />，不是和。加法的接法必须让第二支从第一支的终点出发。</li>
        <li><strong>提示二：和向量的长度不总是变长。</strong>两向量反向时，和向量的长度是两边之差，可能比任一向量都短；两个向量相等且反向时，和为 <Katex tex="\vec 0" />。写 <Katex tex="|\vec a+\vec b|>|\vec a|" /> 恒成立是错的。</li>
        <li><strong>提示三：<Katex tex="\vec a-\vec b" /> 的方向是从 <Katex tex="\vec b" /> 指向 <Katex tex="\vec a" />。</strong>它等于 <Katex tex="\overrightarrow{BA}" /> 而不是 <Katex tex="\overrightarrow{AB}" />。求两条线段端点连线的向量时，报出的顺序决定方向，顺序写反就多了一个负号。</li>
        <li><strong>提示四：向量不能随手移项到模的式子里。</strong>由 <Katex tex="\vec a+\vec b=\vec c" /> 可以推出 <Katex tex="\vec a=\vec c-\vec b" />，但推不出 <Katex tex="|\vec a|=|\vec c|-|\vec b|" />；模与向量是两套运算，长度不等式只在共线取等时才化为等式。</li>
      </ul>
    </div>
    <p>回收与预告：向1 说向量可以平移，这两条法则正是平移的直接用途——没有平移，平行四边形法则连虚线边都补不出来。向3 把加法重复若干次，自然引出「数乘」：<Katex tex="\vec a+\vec a+\vec a=3\vec a" />，方向不变、长度变成三倍。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAddRule } from '../../../boards/vectors/linear/addrule.js';
import { VX_CHAPTERS } from './vxnav.js';
</script>
