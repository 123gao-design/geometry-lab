<template>
  <ChPage :cur="2" no="检2" base="/probability/j" :chapters="TEST_CHAPTERS"
    title="独立性检验"
    sub="两个分类变量是否有关，靠一张 2×2 表就能回答。把表里四个数与各自的边际合计相比，偏差够大就说明两者不独立。"
    :toc="[{ id: 'j2-table', t: '列联表' }, { id: 'j2-chi', t: 'χ² 统计量' }, { id: 'j2-judge', t: '临界值与判定' }, { id: 'j2-pit', t: '易错点' }]">
    <div class="note good" id="j2-table">按两个分类变量把样本分成四类，统计各类人数，排成 2×2 的表，称为<b>列联表</b>。设四格人数为 <Katex tex="a,b,c,d" />，总数为 <Katex tex="n=a+b+c+d" />，则
      <Katex tex="\chi^2=\dfrac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}" />。当 <Katex tex="\chi^2\ge 3.841" /> 时，有 95% 的把握认为两个变量有关；当 <Katex tex="\chi^2\ge 6.635" /> 时，这一把握提高到 99%。</div>
    <div class="board-wrap">
      <BoardMount :factory="createChisqTest" />
      <div class="cap">图 检2 · <b>独立性检验机</b>：左侧 2×2 列联表的四格可以逐个改动，右侧是自由度 1 的 χ² 密度曲线，橙色竖线标出观测值，两条紫色虚线是 3.841 与 6.635。看点：把 <Katex tex="a" /> 与 <Katex tex="d" /> 同时调大、<Katex tex="b" /> 与 <Katex tex="c" /> 同时调小，乘积 <Katex tex="ad-bc" /> 拉开，χ² 迅速上升并越过临界值 —— 此时两个分类变量表现为「同类相吸」，独立性不成立。四格平均时 <Katex tex="ad-bc=0" />，χ² 恰好为零。</div>
    </div>

    <h3 class="sec" id="j2-table">列联表</h3>
    <p>列联表把两个分类变量的交叉情况一次列全。行是一个变量，列是另一个，末行与末列是各自的合计（称为边际合计）。判断两者是否独立，直觉上就是看各格的实际人数与「按合计比例应有的期望人数」相差多少。</p>
    <p>期望人数由独立性算得：若两者独立，则「吸烟且患病」的比例应等于「吸烟」的比例乘以「患病」的比例，于是期望人数为 <Katex tex="\dfrac{(a+b)(a+c)}{n}" />。四格的偏差合起来，就构成 χ² 统计量。</p>
    <p>把 χ² 的公式展开可以看到它的构造：<Katex tex="ad-bc" /> 是两列比例之差的核心，若四格恰好按边际比例分布，则 <Katex tex="ad=bc" />，χ² 为零。分母四个边际合计是归一化因子，把偏差折算成与样本量无关的量级。乘上 <Katex tex="n" /> 是因为偏差的显著性随样本量放大 —— 同样比例上的差别，在 100 人和 10000 人里分量完全不同。</p>

    <h3 class="sec" id="j2-chi">χ² 统计量</h3>
    <p>χ² 的分布已在 分4 介绍：自由度越大，曲线越向右偏、峰值越低。2×2 列联表的自由度固定为 1，因为四个数字一经边际合计约束，真正能自由变动的只有一个（例如 <Katex tex="a" /> 定了，其余三格都由合计确定）。</p>
    <p>自由度 1 的 χ² 密度为 <Katex tex="f(x)=\dfrac{1}{\sqrt{2\pi x}}e^{-x/2}" />（<Katex tex="x>0" />），它在 0 附近趋于无穷、向右迅速衰减。图 检2 右侧的曲线就是它。两个临界值 3.841 与 6.635 分别是它的 0.95 与 0.99 分位数：观测值落在 3.841 右侧的概率只有 5%，落在 6.635 右侧只有 1%。</p>

    <h3 class="sec" id="j2-judge">临界值与判定</h3>
    <p>判定的表述有固定的格式。「<Katex tex="\chi^2\ge 3.841" />」时，说「有 95% 的把握认为 <Katex tex="A" /> 与 <Katex tex="B" /> 有关」；「<Katex tex="\chi^2<3.841" />」时，说「没有充分证据认为 <Katex tex="A" /> 与 <Katex tex="B" /> 有关」，或者「不能认为两者有关」。后一种说法只表示证据不足，不代表已经证明两者无关。</p>
    <p>这两个临界值来自把第一类错误控制在 5% 与 1%。「有 95% 的把握」的含义是：若两者实际上无关，那么出现如此大甚至更大的 χ² 值的概率不超过 5%。把它读成「两者有关的概率是 95%」是常见的错读 —— 概率的主语是数据，不是假设。</p>
    <p>临界值表还有 2.706 一档，对应 90% 的把握，中学阶段一般不用；样本量小于 40 或某一格的人数小于 5 时，χ² 的近似分布不再可靠，需要改用精确检验。</p>

    <h3 class="sec" id="j2-pit">易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把「有 95% 的把握有关」读成「有关的概率是 95%」。</strong>95% 说的是在「无关」这个前提下，观测到当前偏差的概率不超过 5%。它与「两者无关的概率是 5%」不是同一件事。</li>
        <li><strong>提示二：把「无关」当成已证明。</strong>χ² 小于临界值只说明数据不足以否定独立。样本量偏小时，真实的关联也可能被放过。</li>
        <li><strong>提示三：不管样本量就比 χ² 的数值。</strong>同样的比例差异，样本量翻倍，χ² 也翻倍。两个不同规模的调查不能直接比 χ²，要先把比例放在一起看。</li>
        <li><strong>提示四：把独立性检验的结论说成因果。</strong>检验通过只说明两变量有关联，不能说明一个引起另一个。是否存在共同的第三个因素，检验无法回答。</li>
      </ul>
    </div>
    <p>回收与预告：独立性检验用的是离散数据的 χ² 分布。若考察的是正态总体的均值，标准化之后得到的是标准正态分布 —— 检3 把 分3b 的正态曲线旋转 90°，用竖直的拒绝域完成检验。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChisqTest } from '../../../boards/probability/test/chisqtest.js';
import { TEST_CHAPTERS } from './testnav.js';
</script>
