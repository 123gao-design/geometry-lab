<template>
  <ChPage :cur="5" no="群5" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="置换群与凯莱定理"
    sub="置换就是把元素重新排一遍，几个置换可以复合，复合又给出置换。凯莱定理说：任何有限群都能这样实现，元素就是「乘某个元素」这个动作本身。"
    :toc="[{ id: 'g5-perm', t: '置换与轮换写法' }, { id: 'g5-group', t: '对称群的结构' }, { id: 'g5-cayley', t: '凯莱定理' }, { id: 'g5-tip', t: '四条提示' }]">
    <div class="note good"><Katex tex="\{1,\dots,n\}" /> 到自身的双射叫<b>置换</b>，全体置换按复合构成<b>对称群</b> <Katex tex="S_n" />，阶为 <Katex tex="n!" />。每个置换可拆成若干个互不相交的轮换，轮换长度的最小公倍数就是置换的阶。<b>凯莱定理</b>：任何阶为 <Katex tex="n" /> 的有限群都同构于 <Katex tex="S_n" /> 的一个子群。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPerm" />
      <div class="cap">图 群5 · <b>置换机</b>：上下两排各三个位置，三条彩色箭头画出置换的去向。看点：① 点按钮切换六个置换，轮换写法同步给出；② 滑块改变复合次数，箭头随之重排；③ 复合次数走到置换的阶时，下排的 1、2、3 回到原位。</div>
    </div>

    <h3 class="sec" id="g5-perm">置换与轮换写法</h3>
    <p>置换记作两行表或一个圈。两行表上行是原位置、下行是像，直观但占地方；轮换写法把循环的行踪连成一圈，如 <Katex tex="(1\,2\,3)" /> 表示 <Katex tex="1\to2\to3\to1" />，站住不动的元素省略。</p>
    <p>任何置换都能唯一拆成互不相交的轮换之积。这个分解像整数的质因数分解，轮换长度就是置换的基本数据。</p>
    <p>置换的阶是各轮换长度的最小公倍数。画板上三次轮换轮换一次、转三次回到原位，阶为 3；换位轮换一次就抵消，阶为 2。</p>

    <h3 class="sec" id="g5-group">对称群的结构</h3>
    <p><Katex tex="S_n" /> 的阶是 <Katex tex="n!" />，随 <Katex tex="n" /> 增长很快。<Katex tex="S_3" /> 有六个元素，<Katex tex="S_4" /> 已有二十四个。</p>
    <p><Katex tex="n\ge3" /> 时 <Katex tex="S_n" /> 非交换：先换两个再换另一对，与反过来的顺序得到不同结果。这在画板上表现为两个按钮连续按下的次序有影响。</p>
    <p>偶置换全体构成交错群 <Katex tex="A_n" />，阶为 <Katex tex="n!/2" />，是 <Katex tex="S_n" /> 中指数为 2 的正规子群。奇偶性由轮换长度的奇偶决定。</p>

    <h3 class="sec" id="g5-cayley">凯莱定理</h3>
    <p>给群 <Katex tex="G" /> 的每个元素 <Katex tex="a" /> 配一个动作：左乘 <Katex tex="a" />。这个动作是 <Katex tex="G" /> 到自身的置换，因为右乘 <Katex tex="a^{-1}" /> 能还原。</p>
    <p>把动作按复合排列，恰好复刻 <Katex tex="G" /> 的乘法。于是 <Katex tex="G" /> 嵌入 <Katex tex="S_{|G|}" />，成为它的一个子群。</p>
    <p>定理的意义是把抽象的群换成具体的置换群：所有群论问题都能在置换群里研究。代价是阶变为 <Katex tex="n!" />，嵌入往往很浪费，实用中要找更小的表示。</p>

    <h3 class="sec" id="g5-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：复合顺序从右往左。</strong>写作 <Katex tex="\sigma\tau" /> 表示先做 <Katex tex="\tau" /> 再做 <Katex tex="\sigma" />。与写函数复合的习惯一致。</li>
        <li><strong>提示二：轮换可以旋转，不能倒读。</strong><Katex tex="(1\,2\,3)=(2\,3\,1)" />，但 <Katex tex="(1\,3\,2)" /> 是它的逆。</li>
        <li><strong>提示三：阶是最小公倍数，不是乘积。</strong>拆成互不相交轮换后，各长度互素时乘积与最小公倍数才相同。</li>
        <li><strong>提示四：凯莱定理给的是嵌入。</strong><Katex tex="G" /> 与 <Katex tex="S_n" /> 的子群同构，不等于整个对称群。别把 <Katex tex="G" /> 直接当成 <Katex tex="S_n" />。</li>
      </ul>
    </div>
    <p>回收与预告：置换描述的是「重排」，正多边形的旋转与翻转也是一次重排。把这些重排收齐，得到一个具体的群，形状的对称性由此有了代数写法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPerm } from '../../../boards/algebra/groupt/perm.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
