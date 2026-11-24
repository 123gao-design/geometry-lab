<template>
  <ChPage :cur="2" no="X2" base="/sets/x" :chapters="X_CHAPTERS"
    title="子集的个数：$2^n$ 家族" sub="三个元素的集合有几个子集？把每个元素的「留 / 去」当成一道独立的选择题，乘法原理直接清点出 $8$ 个 —— 而且按「留下几个元素」分类陈列，恰好是杨辉三角的一行。真子集、非空子集、非空真子集三个口径，各减各的，一条核验线贯穿到底。"
    :toc="[{ id: 'x2-mult', t: '乘法原理：每个元素两道选题' }, { id: 'x2-acc', t: '四口径核验：各减各的' }, { id: 'x2-pit', t: '$2^n$ 不是 $2n$' }]">
    <div class="note good" id="x2-law"><strong>计数公式</strong>：<Katex tex="n" /> 元集合的子集 <Katex tex="2^n" /> 个；<strong>真子集</strong> <Katex tex="2^n-1" />（减去 <Katex tex="A" /> 本身）；<strong>非空子集</strong> <Katex tex="2^n-1" />（减去 <Katex tex="\varnothing" />）；<strong>非空真子集</strong> <Katex tex="2^n-2" />（两者都减去）。按元素个数分类：<Katex tex="\mathrm{C}_n^0+\mathrm{C}_n^1+\cdots+\mathrm{C}_n^n=2^n" />（二项式定理在 <Katex tex="x=y=1" /> 的取值）。</div>
    <ConicFigure number="X2" title="子集的个数" head="bottom" :factory="createFam">
      toggle 条逐个决定每个元素的「留 / 去」，网格按元素个数 <Katex tex="k" /> 分行陈列全部 <Katex tex="2^n"/> 个子集 —— <Katex tex="n" /> 滑到 <Katex tex="4" />，<Katex tex="1" />、<Katex tex="4" />、<Katex tex="6" />、<Katex tex="4" />、<Katex tex="1" /> 的杨辉三角行直接显示；点卡片选定，四口径计数实时核验。
    </ConicFigure>

    <h3 class="sec" id="x2-mult">乘法原理：每个元素两道选题</h3>
    <p>为什么偏偏是 <Katex tex="2^n"/>？图 X2 把「造一个子集」做成 <Katex tex="n" /> 道<strong>独立的二选一</strong>：元素 <Katex tex="a" /> 留还是去？<Katex tex="b" /> 留还是去？……每个元素 <Katex tex="2" /> 种、彼此互不干涉，按乘法原理共 <Katex tex="2\times2\times\cdots\times2=2^n" /> 种组合，每一种组合恰是一个子集 —— 「全部留下」得 <Katex tex="A" /> 本身，「全部去掉」得 <Katex tex="\varnothing" />，谁也不多、谁也不少。<Katex tex="n=3" /> 的网格里 <Katex tex="8" /> 张卡正好排满；<Katex tex="n" /> 滑到 <Katex tex="4" />，<Katex tex="16" /> 张卡重新排列。换个视角看同一件事：按「留下 <Katex tex="k" /> 个元素」分类，第 <Katex tex="k" /> 行有 <Katex tex="\mathrm{C}_n^k" /> 张卡 —— <Katex tex="n=4" /> 的五行 <Katex tex="1" />、<Katex tex="4" />、<Katex tex="6" />、<Katex tex="4" />、<Katex tex="1" /> 正是杨辉三角第五行，也是 <Katex tex="(1+1)^n"/> 展开式的系数表。组合学的第一课在这里预告：<strong>计数与杨辉三角是同一件事的两种表现</strong>。</p>

    <h3 class="sec" id="x2-acc">四口径核验：各减各的</h3>
    <p>考试常在口径上设置辨析，图 X2 的判读读数把四条口径的来历逐一演给你看：<strong>真子集</strong> —— <Katex tex="16" /> 张卡里去掉「<Katex tex="A" /> 本身」那张（选到 <Katex tex="A" /> 本身时读数变黄提醒），剩 <Katex tex="2^n-1" />；<strong>非空子集</strong> —— 去掉「<Katex tex="\varnothing" />」那张，同为 <Katex tex="2^n-1" />；<strong>非空真子集</strong> —— 两张都去，<Katex tex="2^n-2" />。三个数字不同的原因是「<Katex tex="A" /> 本身」与「<Katex tex="\varnothing" />」互不重叠 —— 各自减去、互不替代。解题步骤固定为两步：先算 <Katex tex="2^n" /> 总数，再按题干口径减 1 或减 2，不会混淆。</p>

    <h3 class="sec" id="x2-pit"><Katex tex="2^n"/> 不是 <Katex tex="2n"/></h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：指数记成倍数。</strong><Katex tex="n=4" /> 时 <Katex tex="2^n=16" /> 而 <Katex tex="2n=8" />，相差一倍 —— 「每加一个元素、子集数翻倍」（新元素对每个旧子集追加「带它 / 不带它」两种可能）才是正确的增长直觉，指数由此而来。</li>
        <li><strong>提示二：口径混淆。</strong>「非空真子集」最常被错答成 <Katex tex="2^n-1" />（只减去一个）—— 口径里两个限定词，就减去两个。</li>
        <li><strong>提示三：与「元素个数」混谈。</strong><Katex tex="2^n" /> 数的是子集个数，不是元素个数；若题目问「含某指定元素的子集有几个」，答案减半：<Katex tex="2^{n-1}" />（指定元素锁定「留」，其余 <Katex tex="n-1" /> 个自由选择）—— 图 X2 点亮一个 toggle 后再数卡，答案立现。</li>
      </ul>
    </div>
    <p>集合的关系与子集个数都已讲完，下一节讲「运算」：交集、并集把两个集合合起来算 —— 区域着色与成员清单实时重算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFam } from '../../../boards/sets/rel/subfamily.js';
import { X_CHAPTERS } from './xnav.js';
</script>
