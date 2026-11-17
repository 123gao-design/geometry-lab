<template>
  <ChPage :cur="2" no="概2" base="/probability/g" :chapters="SAM_CHAPTERS"
    title="频率与几何概型"
    sub="概率有两个常用的来源：反复试验中频率稳定到的那一个值，以及长度、面积这类可量测的比值。前者靠次数，后者靠图形。"
    :toc="[{ id: 'g2-freq', t: '频率的稳定性' }, { id: 'g2-class', t: '古典概型' }, { id: 'g2-geo', t: '几何概型' }, { id: 'g2-pit', t: '样本空间的等可能与有限' }]">
    <div class="note good" id="g2-freq">在相同条件下重复试验，事件 <Katex tex="A" /> 出现的频率 <Katex tex="f_n(A)=\dfrac{m}{n}" /> 随次数增多总在一个常数附近摆动，摆动幅度越来越小，这个常数就是 <Katex tex="P(A)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFreqStab" />
      <div class="cap">图 概2a · <b>频率的稳定性</b>：一枚正面概率为 <Katex tex="p" /> 的硬币连投 <Katex tex="n" /> 次，折线是前 <Katex tex="k" /> 次中正面所占的比例，金色虚线是 <Katex tex="p" />。看点：次数少时折线大幅跳动，上到几百次后贴着虚线，偏差进入 2 倍标准差的范围；把 <Katex tex="n" /> 拉回几十次，折线立刻重新乱摆。上方一排小方块是最近若干次的结果，金色为正面。</div>
    </div>
    <div class="board-wrap">
      <BoardMount :factory="createGeoProb" />
      <div class="cap">图 概2b · <b>几何概型</b>：① 档在线段 <Katex tex="[0,6]" /> 上取点，拖动两端移动金色区间，概率就是长度之比，下方一行散点是同一批随机点；② 档在正方形里撒点，拖动半径改圆的大小，概率由面积之比给出。两档的频率都只是把比值量出来，点撒得越多越贴近。</div>
    </div>

    <h3 class="sec" id="g2-freq">频率的稳定性</h3>
    <p>掷硬币的历史记录里，正面出现的比例总在 0.5 上下：投 10 次可能是 0.6，投 100 次多半在 0.45 到 0.55 之间，投上千次往往只差几个千分点。这种稳定不是巧合，而是大量独立试验平均下来的结果，次数越多，平均结果的波动越小。</p>
    <p>图 概2a 用一枚有偏的硬币演示这一点：折线在前几次能从 0 跳到 1，几百次以后就在 <Katex tex="p" /> 附近小幅起落。偏差通常不超过两倍的标准差 <Katex tex="\sqrt{p(1-p)/n}" /> 的两倍，这个量随 <Katex tex="n" /> 增大而趋于零。频率与概率的关系是估计与被估计：概率客观存在，频率是量它的手段。</p>

    <h3 class="sec" id="g2-class">古典概型</h3>
    <p>若样本空间只含有限个样本点，且每个样本点出现的可能性相同，事件 <Katex tex="A" /> 含 <Katex tex="m" /> 个样本点、样本空间含 <Katex tex="n" /> 个样本点，则 <Katex tex="P(A)=\dfrac{m}{n}" />。这就是古典概型，算概率归结为两次数数：数总样本点、数事件里的样本点。</p>
    <p>数数时常用的工具正是组合学：从 5 人中任选 2 人共有 <Katex tex="\mathrm{C}_5^2=10" /> 种选法，其中「含甲」的有 4 种，概率就是 0.4。掷两枚骰子点数之和为 7 的情形有 6 个、样本点共 36 个，概率为 <Katex tex="1/6" />。图 概1 的点阵正是这个模型的图形版本：170 个点等可能，落在哪个区域里就按点数占比读概率。</p>

    <h3 class="sec" id="g2-geo">几何概型</h3>
    <p>把等可能的对象从有限个样本点换成一段线段、一块区域，概率就由长度或面积的比给出：<Katex tex="P(A)=\dfrac{\text{构成事件 } A \text{ 的测度}}{\text{试验全部结果的测度}}" />。在 <Katex tex="[0,6]" /> 上随机取一点，落在 <Katex tex="[1.4,3.8]" /> 内的概率是 <Katex tex="2.4/6=0.4" />；在正方形内随机撒点，落进圆内的概率是圆面积与正方形面积之比。</p>
    <p>图 概2b 的两个档位各画一种。长度档拖动 <Katex tex="a" />、<Katex tex="b" /> 改变金色区间，概率读数立即跟着变；面积档拖动半径，<Katex tex="\pi r^2" /> 与边长平方之比随之改变。两档下面都撒了一批固定的随机点，落进目标区域的点数占比是频率，它总是朝概率读数靠拢，但不等于概率 —— 随机取点恰好落在边界上的机会为零，所以端点开闭不影响结果。</p>

    <h3 class="sec" id="g2-pit">样本空间的等可能与有限</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：样本点不等可能时不能用古典概型。</strong>掷两枚骰子记「点数和」，和从 2 到 12 共 11 个取值，但「和为 7」的机会远大于「和为 2」。要么回到 36 个有序对去数，要么另找等可能的模型。</li>
        <li><strong>提示二：几何概型要求「均匀」。</strong>长度比、面积比的算法只适用于点在区域内均匀分布的情形。若取点方式偏向某一侧，概率就不再是测度之比。</li>
        <li><strong>提示三：频率不是概率。</strong>投 10 次得 0.6，不能说这枚硬币正面的概率是 0.6。频率随试验变化，概率是固定的常数，只能说次数很多时频率接近概率。</li>
        <li><strong>提示四：几何概型里「恰好落在某条线上」的概率为零。</strong>这不等于不可能事件，只是它的测度为零；概率为零的事件未必是不可能事件，概率为 1 的事件也未必是必然事件。</li>
      </ul>
    </div>
    <p>回收与预告：古典概型的数数依赖计1、计2 的两条原理与排列组合，几何概型把概率与长度、面积的比值联系起来。有了概率的赋值方法，下一步处理「已知某事件发生」的情形 —— 独1 把样本空间缩到那个事件之内，重新定义概率。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFreqStab } from '../../../boards/probability/sample/freqstab.js';
import { createBoard as createGeoProb } from '../../../boards/probability/sample/geoprob.js';
import { SAM_CHAPTERS } from './samnav.js';
</script>
