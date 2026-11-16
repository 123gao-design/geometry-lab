<template>
  <ChPage :cur="2" no="统2" base="/probability/t" :chapters="STAT_CHAPTERS"
    title="样本的数字特征"
    sub="直方图看得出形状，却说不清「中心在哪、有多散」。几个数就能概括这两件事，代价是每一对数都丢掉了信息。"
    :toc="[{ id: 't2-cen', t: '平均数、中位数与众数' }, { id: 't2-var', t: '方差与标准差' }, { id: 't2-hist', t: '由直方图估计数字特征' }, { id: 't2-pit', t: '易错点' }]">
    <div class="note good" id="t2-cen">一组数据 <Katex tex="x_1,x_2,\dots,x_n" /> 的<b>平均数</b>为 <Katex tex="\bar x=\dfrac{1}{n}\sum_{i=1}^{n}x_i" />；把数据从小到大排列，处在中间位置的数称为<b>中位数</b>（偶数个时取中间两数的平均）；出现次数最多的数称为<b>众数</b>。
      <b>方差</b>为 <Katex tex="s^2=\dfrac{1}{n}\sum_{i=1}^{n}(x_i-\bar x)^2" />，它的算术平方根 <Katex tex="s" /> 称为<b>标准差</b>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createStatNum" />
      <div class="cap">图 统2 · <b>样本的数字特征机</b>：数轴上堆叠着 10 个数，金色那点可以拖动。橙色虚线是平均数，紫色点线是中位数，下方每一行是一个数据点到平均数的有向距离，向右为绿、向左为红。看点：把金色点拖到最右端，平均数被明显拉高，中位数几乎不动 —— 平均数用上了每一个数，极端值的影响被摊开；中位数只看位置，对极端值不敏感。红绿条的长短合起来就是方差：平方之后求和，再除以个数。</div>
    </div>

    <h3 class="sec" id="t2-cen">平均数、中位数与众数</h3>
    <p>三个数都在描述「中心」，选取的标准不同。平均数让偏差之和为零：<Katex tex="\sum(x_i-\bar x)=0" />，它是数据的重心；中位数让两侧的个数相等，它只关心顺序；众数关心出现得最频繁的取值，常用于分类数据。</p>
    <p>三者的分工可以从对极端值的反应看出来。一组收入数据里加入一位极高收入者，平均数立刻上升，中位数最多挪动一位，众数完全不变。也正因如此，描述收入、房价这类偏态分布时，中位数比平均数更能代表「典型水平」。</p>
    <p>平均数有一条重要性质：若把每个数据都乘以 <Katex tex="a" /> 再加 <Katex tex="b" />，则新数据的平均数为 <Katex tex="a\bar x+b" />。这条性质在实际中很有用 —— 换单位、减去同一个基准值，都不会改变数据的相对位置。</p>

    <h3 class="sec" id="t2-var">方差与标准差</h3>
    <p>平均数相同的两组数据，波动程度可以相差很大。描述波动要先解决「偏差有正有负、直接相加会抵消」的问题。取绝对值是一种办法，取平方是另一种 —— 平方可导、便于代数变形，因此成为标准做法。</p>
    <p>方差展开后还有一个便于计算的形式：
      <Katex tex="s^2=\dfrac{1}{n}\sum x_i^2-\bar x^2" />。计算时只需要求一次平均数与一次平方和，比逐个求偏差更省事。标准差 <Katex tex="s" /> 与原始数据同量纲，读起来更直观：成绩的标准差是 8 分，就意味着多数人与平均分相差 8 分上下。</p>
    <p>方差的变换规律与平均数不同：每个数据乘以 <Katex tex="a" /> 再加 <Katex tex="b" />，新数据的方差为 <Katex tex="a^2s^2" />，标准差为 <Katex tex="|a|s" />。加减同一个常数不改变波动，乘以负数也不改变波动 —— 这两条在比较不同单位的数据时经常用到。</p>

    <h3 class="sec" id="t2-hist">由直方图估计数字特征</h3>
    <p>只有直方图而没有原始数据时，可以用组中值近似各组的数据：把每组的频率当作权重，对各组组中值加权平均，得到平均数的估计值；把组中值到平均数的偏差平方按频率加权求和，得到方差的估计值。</p>
    <p>这样算出的平均数并非精确值，因为组内的具体取值被组中值代替了。组距越大，这种近似越粗。中位数在直方图上则按面积读：从最左端向右累加矩形面积，面积达到 0.5 的位置就是中位数所在处，再在该组内按面积比例插值。</p>

    <h3 class="sec" id="t2-pit">易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只报平均数不报方差。</strong>两组数据的平均数可以完全相同，一组紧密、一组松散。缺了方差或标准差，读者无法判断这个平均数有多可靠。</li>
        <li><strong>提示二：把标准差当成平均误差。</strong>标准差是「偏差平方的平均再开方」，与「偏差绝对值的平均」并不相等。标准差对大偏差更敏感，通常略大于平均绝对偏差。</li>
        <li><strong>提示三：样本方差与总体方差混用。</strong>本节按中学课本的约定用 <Katex tex="\dfrac{1}{n}" /> 作分母；统计软件常用 <Katex tex="\dfrac{1}{n-1}" />，称为无偏估计。两种算法在样本量大时差别很小，但不能在同一个问题里混着用。</li>
        <li><strong>提示四：用组中值算出的平均数当成真值。</strong>直方图上算出的只是近似值，组距越大偏差越大。原始数据可得时，一律用原始数据计算。</li>
      </ul>
    </div>
    <p>回收与预告：单个变量的平均数与方差已经够用，可当两个变量同时观测时，还要问它们是否一起变化。统3 把两个变量的数据点画在平面上，用一条直线概括它们的相伴关系。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createStatNum } from '../../../boards/probability/stat/statnum.js';
import { STAT_CHAPTERS } from './statnav.js';
</script>
