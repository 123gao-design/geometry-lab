<template>
  <ChPage :cur="1" no="计1" base="/combinatorics/c" :chapters="CC_CHAPTERS"
    title="分类加法与分步乘法"
    sub="数一件事情的几种做法，先要分清它是「选一类」还是「走一步」：两类办法互不重叠、任选一种就能交差，用加法；几步依次进行、少一步就完不成，用乘法。"
    :toc="[{ id: 'c1-add', t: '分类加法计数原理' }, { id: 'c1-mul', t: '分步乘法计数原理' }, { id: 'c1-diff', t: '两种原理的分辨' }, { id: 'c1-pit', t: '重叠、漏步与列举检验' }]">
    <div class="note good" id="c1-add">完成一件事有 <Katex tex="k" /> 类办法，第 <Katex tex="i" /> 类有 <Katex tex="m_i" /> 种，且任一类中的任一种办法都能单独完成这件事，则 <Katex tex="N=m_1+m_2+\cdots+m_k" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createAddMul" />
      <div class="cap">图 计1 · <b>分类加法与分步乘法机</b>：① 档蓝弧是火车、橙弧是飞机，两类互不重叠，条数相加；② 档把路线拆成两段，金色一条是一种走法，两段都选定才到乙地，条数相乘。看点：拖两个滑块改条数，徽章里的加号与乘号随档切换；某一类只留一条时，那一类就退化为一种办法。</div>
    </div>

    <h3 class="sec" id="c1-add">分类加法计数原理</h3>
    <p>从甲地到乙地，一天里有 3 班火车、2 班飞机。坐火车能到，坐飞机也能到，两类里任取一种就把「到乙地」这件事办完了，所以共有 <Katex tex="3+2=5" /> 种走法。判别标准只有一条：<b>每一类里的每一种办法都能独立完成任务</b>。能独立交差的才算一类，只能完成一半的不算。</p>
    <p>图 计1 的 ① 档把这个情形画成两支弧：蓝色是火车、橙色是飞机，两支都从甲地直达乙地。弧的条数就是每类的办法数，加起来即总数。若某天只剩一班火车，蓝色那支就只画一条，总数相应减一。</p>

    <h3 class="sec" id="c1-mul">分步乘法计数原理</h3>
    <p>改换路线：从甲地先到中转站，再从站里到乙地；两段各有若干条路。只走第一段到不了乙地，两段都走完才算完成。第一段的每种走法都能接上第二段的每种走法，搭配一次得到一条完整路线，于是总数为两段条数之积。</p>
    <p>原理的内容是：完成一件事需要 <Katex tex="k" /> 个步骤，做第 <Katex tex="i" /> 步有 <Katex tex="m_i" /> 种方法，且每一步只完成一部分，则 <Katex tex="N=m_1m_2\cdots m_k" />。判别标准与加法相反：<b>少一步任务就没完成</b>。图 计1 的 ② 档画两段弧，金色的一条先取第一段再取第二段；段数增加到三段，乘法因子也就依次添到三个。</p>

    <h3 class="sec" id="c1-diff">两种原理的分辨</h3>
    <p>题面上的「或」与「且」只是语言提示，真正的判据是能否单独完成。凡属「各类互不重叠、任选其一即可」的，相加；凡属「几步依次进行、缺一不可」的，相乘。判错了原理，结果往往相差一个数量级。</p>
    <p>同一道题里两种原理常叠着用：先按某个标准把情形分成几类，类内再按步骤逐个处理，最后把各类的结果加起来。这时要保证两件事——分类不重不漏，分步不重不漏。前者的漏洞表现为多算，后者的漏洞表现为少算。</p>

    <h3 class="sec" id="c1-pit">重叠、漏步与列举检验</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：类别之间必须互斥。</strong>「会打篮球的 5 人」与「会打排球的 4 人」直接相加，两样都会的人被算了两次。分类前先确认同一对象只能落进一类。</li>
        <li><strong>提示二：步骤必须把任务做完。</strong>分步时漏掉某一步里的一种选法，乘积就偏小；把同一步拆成两段重复计数，乘积就偏大。每一步都要问一句「这一步的选法数是否与人选无关」。</li>
        <li><strong>提示三：数目不大时列举检验。</strong>把所有做法逐个写出，与两个原理算出的数对照，重叠和遗漏都会立刻显形。</li>
        <li><strong>提示四：带顺序的取法不属于这两个原理的直接范围。</strong>「从 5 人里选 3 人排队」不能只写成两个数相乘，还要数顺序，这类问题由计2 的排列数处理。</li>
      </ul>
    </div>
    <p>回收与预告：分类讨论这套动作在集合的运算里已经用过，那里是把元素按归属分成几块，这里是按办法分成几类，思路相同。计2 处理「取出若干并按顺序排成一列」的情形，给出排列数公式，它是本节的乘法原理反复套用的结果。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAddMul } from '../../../boards/combinatorics/counting/addmul.js';
import { CC_CHAPTERS } from './ccnav.js';
</script>
