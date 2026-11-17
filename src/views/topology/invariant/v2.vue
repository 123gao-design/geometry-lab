<template>
  <ChPage :cur="2" no="不2" base="/topology/v" :chapters="TIN_CHAPTERS"
    title="基本群"
    sub="固定基点，把闭环路按「能连续变形」分成类，再把类拼起来：走一段再接一段。这些类对拼接封闭，还有单位元与逆元，构成一个群。它记录的是空间的洞绕着走的方式。"
    :toc="[{ id: 'v2-homotopy', t: '同伦与闭环路' }, { id: 'v2-group', t: '拼接与群结构' }, { id: 'v2-example', t: '几个基本群' }, { id: 'v2-cover', t: '基本群的计算思路' }, { id: 'v2-tip', t: '四条提示' }]">
    <div class="note good">固定基点 <Katex tex="x_0\in X" />。两条从 <Katex tex="x_0" /> 出发的闭环路 <Katex tex="\gamma,\delta" /> 叫<b>同伦</b>的，若存在连续映射 <Katex tex="H:[0,1]\times[0,1]\to X" />，使 <Katex tex="H(t,0)=\gamma(t)" />、<Katex tex="H(t,1)=\delta(t)" />，且两端口始终钉在基点：<Katex tex="H(0,s)=H(1,s)=x_0" />。同伦类的全体在拼接运算下构成群，叫<b>基本群</b> <Katex tex="\pi_1(X,x_0)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createFundGroup" />
      <div class="cap">图 不2 · <b>基本群与绕数</b>：圆周上画一条从基点出发又回到基点的闭环路。看点：① 绕数 <Katex tex="n" /> 一层层加，路绕着圆心越绕越多，起点与终点始终只隔一条接缝；② 换成顺时针，绕数取负，群的逆元素就是倒着走的那条路；③ 把 <Katex tex="n" /> 调到零，路缩成贴着基点的小圈，能直接收成一点，那是单位元。</div>
    </div>

    <h3 class="sec" id="v2-homotopy">同伦与闭环路</h3>
    <p>同伦是一族连续变化的道路，参数 <Katex tex="s" /> 记时间，<Katex tex="t" /> 记路上位置。固定 <Katex tex="s" /> 时，<Katex tex="t\mapsto H(t,s)" /> 是一条闭环路；<Katex tex="s" /> 从零滑到一，整族路就把 <Katex tex="\gamma" /> 连续地搬到了 <Katex tex="\delta" />。两端口钉死这一条把基点固定住，不让路在变形中滑开。</p>
    <p>同伦是等价关系：自反（停着不动）、对称（把 <Katex tex="s" /> 反过来走）、传递（先变形一次再变形一次，两段拼接后仍连续）。因此闭环路能按同伦分类，每一类叫一个<b>同伦类</b>。</p>
    <p>不动端点与允许端点滑动是两种不同的同伦。前者更严，基本群用的就是它。若允许端点滑动，基点会跑到别处，群结构就散了。</p>

    <h3 class="sec" id="v2-group">拼接与群结构</h3>
    <p>两条闭环路的拼接 <Katex tex="\gamma\cdot\delta" /> 取第一条走完再走第二条，参数各自压缩到半个区间。这个运算在同伦类上是良定义的：把两条路各自变形，拼接后的路也跟着变形。</p>
    <p>群的三条要求逐条对上：</p>
    <ul>
      <li><b>单位元</b>：停在基点的常值道路，把任何一条路拼上它，得到的路仍同伦于原路；</li>
      <li><b>逆元</b>：<Katex tex="\gamma^{-1}(t)=\gamma(1-t)" />，倒着走，拼接后能缩回常值道路；</li>
      <li><b>结合律</b>：<Katex tex="(\gamma\cdot\delta)\cdot\varepsilon" /> 与 <Katex tex="\gamma\cdot(\delta\cdot\varepsilon)" /> 划分参数的比例不同，但中间只差一次时间重参数化，仍同伦。</li>
    </ul>
    <p>结合律不是严格相等，只在同伦意义下成立。这一点值得留意：基本群是「同伦类的群」，不是「道路的群」，等式都按同伦来算。</p>

    <h3 class="sec" id="v2-example">几个基本群</h3>
    <p><b>圆周</b> <Katex tex="\pi_1(S^1)\cong\mathbb Z" />。闭环路按绕数分类，绕数就是整数。画板上滑块的 <Katex tex="n" /> 正是这个整数，拼接对应整数相加，逆元对应取负。这条基本群是整个学科的计算起点。</p>
    <p><b>平面与球面</b>的基本群都是平凡群。平面上任何闭环路都能缩成一点，球面上也一样——球面没有洞可绕。这类空间叫<b>单连通</b>的。</p>
    <p><b>环面</b> <Katex tex="\pi_1\cong\mathbb Z\times\mathbb Z" />。两条独立的圈，一条绕管子，一条绕洞，绕的次序无所谓，所以是直积而不是非交换群。环面与球面的基本群不同，二者不同胚，这个结论比 <Katex tex="\chi" /> 更细。</p>
    <p><b>克莱因瓶与射影平面</b>的基本群不可交换。顺着一个方向走一圈回来上下颠倒，两条圈换个次序就差一个翻转，拼接不满足交换律。基本群能记住这种拧劲，欧拉示性数记不住。</p>

    <h3 class="sec" id="v2-cover">基本群的计算思路</h3>
    <p>直接按定义算基本群很吃力，常用两条工具。其一，<b>同伦等价</b>：若两个空间能互相连续地变形过去，基本群相同。圆柱面同伦等价于圆周，所以 <Katex tex="\pi_1\cong\mathbb Z" />，尽管两者不同胚。</p>
    <p>其二，<b>覆叠空间</b>。圆周的基本群之所以能一眼看出是 <Katex tex="\mathbb Z" />，靠的是把圆周展开成直线：直线上的道路一一对应圆周上的闭环路，覆叠变换是「平移一个整数」。这条对应下一章展开，它的完整说法是覆叠空间与子群一一对应。</p>
    <p>还有一条常用结论：若 <Katex tex="A" /> 是 <Katex tex="X" /> 的形变收缩核，则约化基本群相同。球面去掉一点就是平面，平面又能收成一点，所以球面挖一点单连通。这类论证在具体问题里比硬算快得多。</p>

    <h3 class="sec" id="v2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：群元素是同伦类，不是道路。</strong>两条路只要同伦就是同一个元素。写「<Katex tex="\gamma\in\pi_1" />」时，心里要装的是它那一类。</li>
        <li><strong>提示二：端点必须钉住。</strong>放松端点会改变群。基本群的定义里，<Katex tex="H(0,s)" /> 与 <Katex tex="H(1,s)" /> 始终等于基点，这条不能省。</li>
        <li><strong>提示三：基本群一般不可交换。</strong>圆周、环面的 <Katex tex="\pi_1" /> 恰好交换，别推广到所有空间。克莱因瓶与射影平面的基本群就非交换。</li>
        <li><strong>提示四：不同胚可由基本群不同推出，反过来不行。</strong>基本群相同未必同胚，也未必同伦等价。它是必要条件，与 <Katex tex="\chi" /> 一样只负责否证。</li>
      </ul>
    </div>
    <p>回收与预告：把圆周展开成直线，覆叠空间把「绕了几圈」摊成了「平移了几个整数」。这条对应不是巧合：覆叠空间与基本群的子群一一对应，基本群的结构因此能被一张铺开的图读出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFundGroup } from '../../../boards/topology/invariant/fundgroup.js';
import { TIN_CHAPTERS } from './vnav.js';
</script>
