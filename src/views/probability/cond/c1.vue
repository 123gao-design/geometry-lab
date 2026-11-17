<template>
  <ChPage :cur="1" no="独1" base="/probability/c" :chapters="COND_CHAPTERS"
    title="条件概率与乘法公式"
    sub="已知某事件已经发生，样本空间就不是原来的全体了，而是缩小到那个事件之内。把分母换成它的概率，得到的就是条件概率。"
    :toc="[{ id: 'c1-def', t: '条件概率的定义' }, { id: 'c1-mul', t: '乘法公式' }, { id: 'c1-use', t: '抽球与分步计算' }, { id: 'c1-pit', t: '条件概率的三个易错处' }]">
    <div class="note good" id="c1-def">设 <Katex tex="P(A)>0" />，在事件 <Katex tex="A" /> 发生的条件下事件 <Katex tex="B" /> 发生的概率记作 <Katex tex="P(B\mid A)" />，定义为 <Katex tex="P(B\mid A)=\dfrac{P(A\cap B)}{P(A)}" />。分子取两者同时发生，分母换成已知发生的那个事件。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCondProb" />
      <div class="cap">图 独1 · <b>条件概率</b>：蓝圆 <Katex tex="A" /> 加粗表示它是已知发生的事件，圆外的样本点全部淡出，样本空间只剩圆内这一块。右侧两根横条并排比较 <Katex tex="P(B)" /> 与 <Katex tex="P(B\mid A)" />。看点：把 <Katex tex="B" /> 拖进 <Katex tex="A" />，条件概率随之上升；两圆拉开则降到零。两根横条几乎等高时，两事件接近独立。</div>
    </div>

    <h3 class="sec" id="c1-def">条件概率的定义</h3>
    <p>一副牌去掉大小王，<Katex tex="A" /> 为「抽到红桃」，<Katex tex="B" /> 为「抽到 K」。已知抽到红桃，此时 13 张牌里只有红桃 K 这一张满足，所以 <Katex tex="P(B\mid A)=1/13" />；而 <Katex tex="P(B)=4/52=1/13" />。反过来，已知抽到 K 时抽到红桃的机会是 1/4，<Katex tex="P(A\mid B)=1/4" />，与 <Katex tex="P(B\mid A)" /> 不等 —— 条件概率的先后次序不能交换。</p>
    <p>公式的来历就是「缩小样本空间」：新的样本空间是 <Katex tex="A" />，其中属于 <Katex tex="B" /> 的部分是 <Katex tex="A\cap B" />，两边的概率同除以 <Katex tex="P(A)" />，便得到条件概率。图 独1 里这一点看得最清楚：圆外的点淡出以后，剩下点中紫色那部分的占比就是条件概率。要求 <Katex tex="P(A)>0" /> 也是这个原因，分母为零时没有可缩的空间。</p>

    <h3 class="sec" id="c1-mul">乘法公式</h3>
    <p>把定义式两边乘以 <Katex tex="P(A)" />，得 <Katex tex="P(A\cap B)=P(A)P(B\mid A)" />，同样有 <Katex tex="P(A\cap B)=P(B)P(A\mid B)" />。这条式子把「同时发生」拆成两步：先让一件事发生，再在它的条件下让另一件发生。</p>
    <p>推广到三个事件：<Katex tex="P(ABC)=P(A)P(B\mid A)P(C\mid AB)" />。每次都在前面所有事件都已发生的条件下算下一个，这与树形图的读法一致 —— 沿树枝一路乘下去就是该条路径的概率。全概率与贝叶斯公式正是建立在这条式子上。</p>

    <h3 class="sec" id="c1-use">抽球与分步计算</h3>
    <p>袋中 3 红 2 白，不放回地连取两次，求两次都是红球的概率。第一次取到红球的概率是 <Katex tex="3/5" />；第一次取走红球后，袋里还剩 2 红 2 白，第二次取红球的概率变成 <Katex tex="2/4" />。于是 <Katex tex="P(\text{两红})=\dfrac{3}{5}\times\dfrac{2}{4}=\dfrac{3}{10}" />。</p>
    <p>有放回地取时情况不同：第一次取完放回去，第二次的条件概率仍是 <Katex tex="3/5" />，两次之积为 <Katex tex="9/25" />。同一个问题，取法决定条件是否改变，也就决定了要不要用条件概率。考试里「不放回」「依次抽取」「已知第一次取到……」这类措辞，都是在提示条件已经在变。</p>

    <h3 class="sec" id="c1-pit">条件概率的三个易错处</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="P(B\mid A)" /> 与 <Katex tex="P(A\mid B)" /> 不是同一个数。</strong>前者以 <Katex tex="A" /> 为样本空间，后者以 <Katex tex="B" /> 为样本空间，分母不同，次序一换结果就变。读题先确定「已知」的是哪个事件，它就是分母。</li>
        <li><strong>提示二：条件概率不是「交的概率」。</strong><Katex tex="P(B\mid A)" /> 可能远大于 <Katex tex="P(A\cap B)" />，两者差一个 <Katex tex="P(A)" /> 的因子。要求同时发生用乘法公式，要求条件概率才除以 <Katex tex="P(A)" />。</li>
        <li><strong>提示三：没有条件不能硬套。</strong>公式要求 <Katex tex="P(A)>0" />；若已知事件本身概率为零，条件概率无定义。另外，条件概率满足概率的三条性质，可以照常使用对立事件与可加性，只是样本空间换成了 <Katex tex="A" />。</li>
      </ul>
    </div>
    <p>回收与预告：乘法公式把复杂事件拆成依次发生的几步，这与计数原理里「分步相乘」的做法呼应。独2 把它用到「所有可能的前提」上：事先把情形分成互斥的几组，各自乘上条件概率再相加，就得到全概率公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCondProb } from '../../../boards/probability/cond/condprob.js';
import { COND_CHAPTERS } from './condnav.js';
</script>
