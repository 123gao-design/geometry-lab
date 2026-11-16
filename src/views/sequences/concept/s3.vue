<template>
  <ChPage :cur="3" no="数3" base="/sequences/s" :chapters="SQ_CHAPTERS"
    title="前 n 项和与通项：Sₙ 与 aₙ 的换算"
    sub="Sₙ 把前 n 项累加成一个式子，再作一次差就能把每一项还原：n≥2 时 aₙ=Sₙ−Sₙ₋₁，n=1 时 a₁=S₁。两个方向各解决一类问题。"
    :toc="[{ id: 's3-def', t: '前 n 项和' }, { id: 's3-diff', t: '作差还原通项' }, { id: 's3-ex', t: '两个例子：合式与分段' }, { id: 's3-pit', t: 'n=1 与两个方向' }]">
    <div class="note good" id="s3-def">数列 <Katex tex="\{a_n\}" /> 的前 n 项和记作 <Katex tex="S_n=a_1+a_2+\dots+a_n" />，约定 <Katex tex="S_0=0" />。则对一切 <Katex tex="n\ge1" /> 有
      <Katex tex="a_n=S_n-S_{n-1}" />；实际书写时分成两段：<Katex tex="a_1=S_1" />，<Katex tex="n\ge2" /> 时 <Katex tex="a_n=S_n-S_{n-1}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSn" />
      <div class="cap">图 数3 · <b>前 n 项和机</b>：上栏是每一项 <Katex tex="a_k" /> 的条，下栏是前 k 项和 <Katex tex="S_k" /> 的折线，两栏的 n 严格对齐。拖动 n，金色虚线贯通两栏；下栏的橙色竖段是 <Katex tex="S_n" /> 比 <Katex tex="S_{n-1}" /> 高出的一段，与上栏第 n 条等高。看点：切到 ②，每一项都翻倍，折线的增量随 <Katex tex="a_n" /> 一起翻倍，<Katex tex="S_n" /> 始终比它多 1。</div>
    </div>

    <h3 class="sec" id="s3-def">前 n 项和</h3>
    <p>把数列从第一项加到第 n 项，得到 <Katex tex="S_n" />。它与通项的关系可以这样看：<Katex tex="S_n" /> 是到第 n 项为止的累加，<Katex tex="S_{n-1}" /> 是到第 n−1 项为止的累加，两者只差一项。图 数3 把这件事画成两栏：上栏的每一根条是一项，下栏的折线是累加，累加的增量就是上栏的条。</p>
    <p>约定 <Katex tex="S_0=0" /> 只是为了让 <Katex tex="a_1=S_1-S_0=S_1" /> 与通式统一，书写时仍按两段处理。已知 <Katex tex="S_n" /> 求 <Katex tex="a_n" />，和已知 <Katex tex="a_n" /> 求 <Katex tex="S_n" />，是两个方向的问题：前者作差，后者求和（和1 至 和3 专讲求和）。</p>

    <h3 class="sec" id="s3-diff">作差还原通项</h3>
    <p>由定义，<Katex tex="S_n=a_1+a_2+\dots+a_{n-1}+a_n" />，<Katex tex="S_{n-1}=a_1+a_2+\dots+a_{n-1}" />（<Katex tex="n\ge2" />）。两式相减，前面 n−1 项全部抵消：
      <Katex tex="S_n-S_{n-1}=a_n\quad(n\ge2)" display />。
      相减能消掉前面所有项，前提是两式的公共部分完全一样——这正是要求 <Katex tex="n\ge2" /> 的原因：<Katex tex="S_0" /> 没有对应的和，不能拿来作差。</p>
    <p>作差得到的是 <Katex tex="n\ge2" /> 时的通项。第 1 项必须回到 <Katex tex="S_1" /> 单独取，再把 <Katex tex="n=1" /> 代进作差的结果看看是否吻合：吻合就合并成一个式子，不吻合就分段写。这一步是整类题目的关键，图 数3 的判读徽章也放在这里。</p>

    <h3 class="sec" id="s3-ex">两个例子：合式与分段</h3>
    <p><strong>例一</strong>：<Katex tex="S_n=n^2" />。作差得 <Katex tex="n\ge2" /> 时 <Katex tex="a_n=n^2-(n-1)^2=2n-1" />；又 <Katex tex="a_1=S_1=1" />，代入 <Katex tex="2n-1" /> 在 <Katex tex="n=1" /> 处也得 1，两段吻合，于是 <Katex tex="a_n=2n-1" />（<Katex tex="n\ge1" />）。这与 数1 的 ① 是同一个数列，只是给法不同。</p>
    <p><strong>例二</strong>：<Katex tex="S_n=n^2+n+1" />。作差得 <Katex tex="n\ge2" /> 时
      <Katex tex="a_n=(n^2+n+1)-\left[(n-1)^2+(n-1)+1\right]=2n" />；
      而 <Katex tex="a_1=S_1=3" />，把 <Katex tex="n=1" /> 代入 <Katex tex="2n" /> 得 2，两边不吻合。所以答案必须分段：
      <Katex tex="a_n=\begin{cases}3, & n=1,\\ 2n, & n\ge2.\end{cases}" display />
      判断依据只看一件事：<Katex tex="n=1" /> 处作差结果与 <Katex tex="S_1" /> 是否相等。</p>

    <h3 class="sec" id="s3-pit">n=1 与两个方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：作差只在 <Katex tex="n\ge2" /> 成立，第 1 项必须单算。</strong>把 <Katex tex="n=1" /> 硬代进 <Katex tex="S_n-S_{n-1}" />，等于用 <Katex tex="S_0" /> 作差，而 <Katex tex="S_0" /> 不是题目给的量。例二就是照此出错的反面：直接写 <Katex tex="a_n=2n" />，第 1 项会错成 2。</li>
        <li><strong>提示二：两个方向别混。</strong>已知 <Katex tex="S_n" /> 求 <Katex tex="a_n" /> 用减法；已知 <Katex tex="a_n" /> 求 <Katex tex="S_n" /> 用加法。题目给的是哪个，先认清楚再动手：给了 <Katex tex="S_n" /> 却去猜通项，或者给了 <Katex tex="a_n" /> 却去作差，都做不下去。</li>
        <li><strong>提示三：<Katex tex="S_n" /> 的下标是项数，不是项的值。</strong><Katex tex="S_n" /> 表示「加到第 n 项」，与 <Katex tex="a_n" /> 的下标对得上，但两者的含义完全不同：一个是累加，一个是单项。<Katex tex="S_5=15" /> 说的是前 5 项之和为 15，不能读成第 5 项是 15。</li>
      </ul>
    </div>
    <p>回收与预告：数1 的通项、数2 的递推、数3 的求和，是描述同一数列的三条通道。接下来子专题二进入等差数列：它的通项是一次式、前 n 项和是二次式，两条公式都能由递推一次性解出，届时「累加」与「求和」都会给出图形化的解释。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSn } from '../../../boards/sequences/concept/snsplit.js';
import { SQ_CHAPTERS } from './sqnav.js';
</script>
