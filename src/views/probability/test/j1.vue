<template>
  <ChPage :cur="1" no="检1" base="/probability/j" :chapters="TEST_CHAPTERS"
    title="假设检验的基本思想与两类错误"
    sub="检验的做法是反着来：先假设结论不成立，再看数据在这样的假设下有多难出现。太难出现，就反过来否定这个假设。"
    :toc="[{ id: 'j1-idea', t: '小概率原理' }, { id: 'j1-hyp', t: '原假设与备择假设' }, { id: 'j1-err', t: '两类错误' }, { id: 'j1-p', t: 'p 值' }]">
    <div class="note good" id="j1-idea">在一次试验中，概率很小的事件几乎不会发生 —— 这是<b>小概率原理</b>。假设检验把这条原理用在反面：先提出一个待检验的假设 <Katex tex="H_0" />，若在 <Katex tex="H_0" /> 成立的条件下，观察到的结果出现的概率小到不合理，就拒绝 <Katex tex="H_0" />；否则不能拒绝。
      使结果落入拒绝域的最大概率称为<b>显著性水平</b> <Katex tex="\alpha" />，常取 0.05 或 0.01。</div>
    <div class="board-wrap">
      <BoardMount :factory="createErrTest" />
      <div class="cap">图 检1 · <b>假设检验与两类错误</b>：蓝曲线是 <Katex tex="H_0" /> 成立时统计量的分布，绿曲线是 <Katex tex="H_1" /> 成立时的分布，橙色竖线是临界值 <Katex tex="c" />，右侧为拒绝域。红色面积 <Katex tex="\alpha" /> 是 <Katex tex="H_0" /> 为真却落进拒绝域的概率，青色面积 <Katex tex="\beta" /> 是 <Katex tex="H_1" /> 为真却没落进拒绝域的概率。看点：把 <Katex tex="c" /> 往右移，红色面积缩小、青色面积增大；往左移则相反。两条曲线的距离由偏移 <Katex tex="\delta" /> 控制，<Katex tex="\delta" /> 变大时两条曲线几乎分开，两类错误可以同时压小。</div>
    </div>

    <h3 class="sec" id="j1-idea">小概率原理</h3>
    <p>假设检验的推理形式与反证法有相似之处，但并不相同。反证法从假设出发推出矛盾，从而断定假设为假；假设检验从假设出发算出观察结果出现的概率，概率很小就认为结果「不像」在假设下产生，于是拒绝假设。区别在于这里的「小」有具体的标准，而且结论不是逻辑上的必然，只是一种在概率意义上的判断。</p>
    <p>这个标准就是显著性水平 <Katex tex="\alpha" />。取 <Katex tex="\alpha=0.05" />，意味着承认有 5% 的机会冤枉了原本正确的 <Katex tex="H_0" />；把 <Katex tex="\alpha" /> 压到 0.01，冤枉的机会少了，但反过来漏掉真实差异的机会就大了。</p>

    <h3 class="sec" id="j1-hyp">原假设与备择假设</h3>
    <p>检验的两个假设地位不对等。<Katex tex="H_0" /> 是默认成立、要被数据检验的那个，通常写成「没有差异」「没有效果」「相互独立」；<Katex tex="H_1" /> 是希望被数据支持的那一个。这种安排的理由在于：拒绝一个假设需要证据，接受一个假设只需要没有证据反对它。把要证明的结论放在 <Katex tex="H_1" />，检验通过就等于拿到了证据。</p>
    <p>因此「不能拒绝 <Katex tex="H_0" />」与「<Katex tex="H_0" /> 成立」是两句话。前者只说数据不足以否定它，后者是一个更强的断言。样本量小的时候，几乎任何假设都无法被拒绝，这并不意味着它们都成立。</p>
    <p>拒绝域放在哪一侧由 <Katex tex="H_1" /> 的形式决定。若 <Katex tex="H_1" /> 只说「有差异」，两侧都要算，称为双侧检验；若 <Katex tex="H_1" /> 指明方向（「偏高」或「偏低」），拒绝域只在对应的一侧，称为单侧检验。单侧检验的临界值更靠近中心，同样的数据更容易显著 —— 所以方向必须来自实际问题的先验判断，不能看完数据再选。</p>

    <h3 class="sec" id="j1-err">两类错误</h3>
    <p>无论临界值怎么取，判断都可能出错，错误有两种：<Katex tex="H_0" /> 为真却拒绝了它，称为<b>第一类错误</b>（弃真），概率为 <Katex tex="\alpha" />；<Katex tex="H_0" /> 为假却没有拒绝它，称为<b>第二类错误</b>（取伪），概率为 <Katex tex="\beta" />。</p>
    <p>样本量固定时，两类错误此消彼长：把临界值往远离 <Katex tex="H_0" /> 的方向推，<Katex tex="\alpha" /> 变小、<Katex tex="\beta" /> 变大；往反方向推则相反。要同时压小两类错误，只能增加样本量 —— 样本量大了，两个分布都变窄，重叠的部分自然减少。</p>
    <p>实际中通常先固定 <Katex tex="\alpha" />（0.05 或 0.01），再在样本量允许的范围内控制 <Katex tex="\beta" />。这样做的理由是两类错误的后果常常不对等：把无病诊成有病，代价是复查一次；把有病诊成无病，代价可能很大。前者对应第一类错误，后者对应第二类错误，取 <Katex tex="\alpha" /> 的大小要按后果权衡。</p>

    <h3 class="sec" id="j1-p">p 值</h3>
    <p>把显著性水平固定成 0.05 有一个不便：它把连续的证据压缩成一个是或否的答案。<b>p 值</b>补上了这个信息，它是在 <Katex tex="H_0" /> 成立的条件下，出现「当前结果或更极端结果」的概率。p 值越小，数据越不像来自 <Katex tex="H_0" />。</p>
    <p>p 值与 <Katex tex="\alpha" /> 的关系很简单：p 值小于 <Katex tex="\alpha" /> 就拒绝 <Katex tex="H_0" />。但 p 值不是 <Katex tex="H_0" /> 为真的概率，也不是 <Katex tex="H_0" /> 为假的概率。它描述的是数据与假设的相容程度，方向与「假设为真的概率」恰好相反：p 值小说明数据与假设不相容，不代表假设为假的概率大。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 p 值当成 <Katex tex="H_0" /> 为真的概率。</strong>p 值由 <Katex tex="H_0" /> 推出，是在假设成立的前提下算的结果概率。要说「<Katex tex="H_0" /> 为真的概率」，需要的是贝叶斯公式，还必须有先验概率。</li>
        <li><strong>提示二：p 值小就说明差异大。</strong>样本量足够大时，极小的差异也能算出很小的 p 值。统计显著与实际的显著不是一回事，效应的大小要看估计值本身。</li>
        <li><strong>提示三：看完数据再选单侧。</strong>先看数据偏向哪边，再把拒绝域挪到那边，实际的第一类错误率会远大于名义的 <Katex tex="\alpha" />。方向必须在看数据之前定下。</li>
        <li><strong>提示四：把不显著当成没差异。</strong>「不能拒绝 <Katex tex="H_0" />」可能只说明样本量不足。要论证没有差异，需要做等效性检验，而不是简单地接受 <Katex tex="H_0" />。</li>
      </ul>
    </div>
    <p>回收与预告：上面的讨论以「统计量服从什么分布」为前提。检2 处理两个分类变量的独立性，统计量取 <Katex tex="\chi^2" />，它的分布在 分4 已经画过；检3 处理正态总体均值的检验，统计量标准化后服从标准正态分布。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createErrTest } from '../../../boards/probability/test/errtest.js';
import { TEST_CHAPTERS } from './testnav.js';
</script>
