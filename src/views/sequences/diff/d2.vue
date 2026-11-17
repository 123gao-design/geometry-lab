<template>
  <ChPage :cur="2" no="等2" base="/sequences/d" :chapters="DQ_CHAPTERS"
    title="等差数列的性质与判定"
    sub="项落在一列等间距的点上，关于中间项成对对称：下标和相等，项和也相等。这条对称性既给出运算性质，也是判定等差数列的一把尺子。"
    :toc="[{ id: 'd2-prop', t: '下标和的性质' }, { id: 'd2-sym', t: '对称与平均' }, { id: 'd2-judge', t: '判定三法' }, { id: 'd2-pit', t: '性质的方向与范围' }]">
    <div class="note good">等差数列 <Katex tex="\{a_n\}" /> 中，若 <Katex tex="m+n=p+q" />（<Katex tex="m,n,p,q\in\mathbb{N}^*" />），则 <Katex tex="a_m+a_n=a_p+a_q" />。特别地，与首末两端等距离的两项之和都相等：<Katex tex="a_1+a_n=a_2+a_{n-1}=\dots" />，这条性质用于配对求和，见 等3。判定方面，一个数列为等差数列当且仅当对一切 <Katex tex="n" /> 有 <Katex tex="2a_{n+1}=a_n+a_{n+2}" />，也当且仅当通项是 <Katex tex="n" /> 的一次式。</div>
    <div class="board-wrap">
      <BoardMount :factory="createIndexSum" />
      <div class="cap">图 等2 · <b>下标和性质</b>：金点是中心项 <Katex tex="a_c" />，蓝点是 <Katex tex="a_{c-1}" /> 与 <Katex tex="a_{c+1}" />，橙点是 <Katex tex="a_{c-2}" /> 与 <Katex tex="a_{c+2}" />。两对点关于金点上下对称，右侧虚线把它们的高度引出来读值。拖动中心 c 或公差 d：每一对都保持水平等高，行与行之间的距离也跟着变。</div>
    </div>

    <h3 class="sec" id="d2-prop">下标和的性质</h3>
    <p>把通项写开：<Katex tex="a_m+a_n=[a_1+(m-1)d]+[a_1+(n-1)d]=2a_1+(m+n-2)d" />。右边只用到 <Katex tex="m+n" />，与 <Katex tex="m,n" /> 各自取多少无关。所以只要下标和相等，项和就相等。图 等2 的两对点同取下标和 <Katex tex="2c" />：蓝对的项和是 <Katex tex="2a_c" />，橙对的项和也是 <Katex tex="2a_c" />。</p>
    <p>这条性质只对<strong>等差数列</strong>成立，方向也不能倒着用：由 <Katex tex="a_m+a_n=a_p+a_q" /> 只能得到下标和相等的结论在等差的前提下成立，反过来「项和相等」推不出「下标和相等」，也不能由此判定数列等差。等比数列对应的是下标和相等时<strong>积</strong>相等（见 比2），两处容易混。</p>
    <p>下标和性质常用的一个特例是：<Katex tex="a_n" /> 与 <Katex tex="a_{m}" /> 的下标和与首末两项相同，于是 <Katex tex="a_1+a_n=a_k+a_{n+1-k}" />。求前 n 项和时就是把这样的对逐对配对（等3 的倒序相加正是它的写法）。</p>

    <h3 class="sec" id="d2-sym">对称与平均</h3>
    <p>在图 等2 里，金点所在的高度 <Katex tex="a_c" /> 恰好是蓝对、橙对各自高度和的一半：<Katex tex="a_c=\dfrac{a_{c-k}+a_{c+k}}{2}" />。取 <Katex tex="k=1" /> 就得到相邻三项的中项关系 <Katex tex="2a_n=a_{n-1}+a_{n+1}" />；取 <Katex tex="k" /> 一般，则得到「与中间项等距的两项，以中间项为算术平均」。</p>
    <p>从函数角度看，项落在直线 <Katex tex="y=dx+(a_1-d)" /> 上，横坐标关于 <Katex tex="c" /> 对称的两点，其纵坐标关于 <Katex tex="a_c" /> 对称。图 等2 的中心点就是这条直线与竖直线 <Katex tex="x=c" /> 的交点，左右两侧的点等高成对出现，正是直线过这一点的含义。</p>
    <p>用这条性质可以把「求某一项」换成「求两项的平均」。例如已知 <Katex tex="a_3+a_7=20" />，则 <Katex tex="a_5=10" />，不必先求出公差。</p>

    <h3 class="sec" id="d2-judge">判定三法</h3>
    <p><strong>定义法。</strong>验证对一切 <Katex tex="n" /> 有 <Katex tex="a_{n+1}-a_n" /> 为同一个常数。这是最直接也最可靠的一法，另外两法都是它的推论。</p>
    <p><strong>中项法。</strong>验证对一切 <Katex tex="n\ge2" /> 有 <Katex tex="2a_{n+1}=a_n+a_{n+2}" />。中项法在数列各项恒等于同一常数时同样成立（此时公差为 0），不必另设条件。</p>
    <p><strong>通项法。</strong>若通项可写成 <Katex tex="a_n=kn+b" />（<Katex tex="k,b" /> 为常数），则该数列是等差数列，公差为 <Katex tex="k" />。反之等差数列的通项必为一次式。它与 E1 的一次函数判据同源。</p>
    <p>判定时注意「对一切 <Katex tex="n" />」这一限定。只验证了前几项满足递推关系，不等于整列数等差：例如 <Katex tex="2,4,6,8,7,\dots" /> 前四项等差，从第 5 项起就不是同一个数列的延续了。严格判定要在通项或递推式上做，不能靠抽查。</p>

    <h3 class="sec" id="d2-pit">性质的方向与范围</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：下标和性质只对等差数列成立。</strong>给出一般数列（如 <Katex tex="a_n=n^2" />）时，<Katex tex="1+4=2+3" /> 而 <Katex tex="1+16\ne4+9" />，性质失效。使用前先确认数列等差，或确认题目已给出公差。</li>
        <li><strong>提示二：项和相等推不出下标相等。</strong>在等差数列中也可能出现 <Katex tex="a_1+a_4=a_2+a_3" />，这是下标和相等的结果；反之，由某一组项和相等不能倒推两个下标和相等，更不能由此断定数列等差。</li>
        <li><strong>提示三：中项法要求三项依次相邻。</strong><Katex tex="2a_{n+1}=a_n+a_{n+2}" /> 中的三项下标必须连续；写成 <Katex tex="2a_n=a_{n-1}+a_{n+1}" /> 也成立，但若三项下标不连续（如 <Katex tex="a_n,a_{n+2},a_{n+4}" />），等式变成 <Katex tex="2a_{n+2}=a_n+a_{n+4}" />，中间项换成 <Katex tex="a_{n+2}" /> 才对。</li>
        <li><strong>提示四：公差为零时一切性质照旧。</strong>常数列是等差数列，中项关系、下标和性质都成立，只是各项相等看不出差别。判定「不是等差数列」时要拿 <Katex tex="d\ne0" /> 之外的差别说话，不能只凭「各项相等」否定。</li>
      </ul>
    </div>
    <p>回收与预告：用下标和把前 n 项两两配对，正好凑成 <Katex tex="\dfrac{n}{2}" /> 个 <Katex tex="a_1+a_n" />，这就是 等3 倒序相加的实质；与首末等距的项和相等，也解释了梯形面积公式与求和公式同形。下一节两块画板分别从代数配对与面积两块入手。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIndexSum } from '../../../boards/sequences/diff/indexsum.js';
import { DQ_CHAPTERS } from './dnav.js';
</script>
