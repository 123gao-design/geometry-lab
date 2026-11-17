<template>
  <ChPage :cur="3" no="群3" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="正规子群与商群"
    sub="左陪集与右陪集处处相同，子群就正规。此时把每个陪集当成一个点，块与块之间能直接相乘，得到的结构就是商群。核总是正规的，这是同态留给群的固定遗产。"
    :toc="[{ id: 'g3-norm', t: '正规的三种写法' }, { id: 'g3-quot', t: '商群的运算' }, { id: 'g3-kernel', t: '核为什么正规' }, { id: 'g3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="H\le G" />。若对每个 <Katex tex="g\in G" /> 都有 <Katex tex="gH=Hg" />，称 <Katex tex="H" /> 为<b>正规子群</b>，记 <Katex tex="H\trianglelefteq G" />。等价写法是 <Katex tex="gHg^{-1}=H" />，即 <Katex tex="H" /> 对共轭封闭。此时陪集全体 <Katex tex="G/H" /> 按 <Katex tex="(aH)(bH)=(ab)H" /> 构成群，称为<b>商群</b>，阶为 <Katex tex="[G:H]" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createNormal" />
      <div class="cap">图 群3 · <b>正规子群的判定</b>：<Katex tex="S_3" /> 取两个子群，左右两列逐行对照陪集。看点：① <Katex tex="H=\langle(12)\rangle" /> 时两列对不上，红叉标出；② 换成 <Katex tex="A_3" />，两列逐行相等，判为正规；③ 正规时商群阶为 2，非正规时商集没有群结构。</div>
    </div>

    <h3 class="sec" id="g3-norm">正规的三种写法</h3>
    <p>三种说法等价：左陪集等于右陪集；对任意 <Katex tex="g" /> 有 <Katex tex="gHg^{-1}\subseteq H" />；<Katex tex="H" /> 是某个同态的核。做题时按方便挑一种：判断具体子群常用第一种，证明结构性结论常用第三种。</p>
    <p>交换群的每个子群都正规，因为 <Katex tex="gH=Hg" /> 直接由交换律得到。非交换群里正规性需要检验，<Katex tex="S_3" /> 的换位子群就不正规。</p>
    <p>指数为 2 的子群自动正规：只有两个陪集，左陪集的补集唯一确定为右陪集。<Katex tex="A_3" /> 正是这种情形。</p>

    <h3 class="sec" id="g3-quot">商群的运算</h3>
    <p>商群的元素是陪集，运算是「代表元相乘，再取所在的块」。定义要成立，必须先确认结果与代表元的选择无关；正规性正好保证这一点。</p>
    <p>商群把每块压成一个元素，原来群里的信息被抹去一部分，剩下的正是「模掉 <Katex tex="H" />」之后的结构。仿射变换商掉平移群得到线性变换群，就是这种压缩。</p>
    <p>画板上正规的 <Katex tex="A_3" /> 给出阶 2 的商群。非正规时左右陪集对不上，两块的乘积取决于顺序，运算无法定义。</p>

    <h3 class="sec" id="g3-kernel">核为什么正规</h3>
    <p>设 <Katex tex="\varphi\colon G\to G'" /> 是群同态，<Katex tex="h\in\ker\varphi" />。则 <Katex tex="\varphi(ghg^{-1})=\varphi(g)e'\varphi(g)^{-1}=e'" />，所以共轭后的元素仍在核里。核对共轭封闭，因此正规。</p>
    <p>反过来，每个正规子群都是商映射 <Katex tex="G\to G/H" /> 的核。两条合起来说明：正规子群与同态的核是同一批对象，两种语言一一对应。</p>
    <p>这条对应是下一章同态基本定理的全部内容。先记住结论，再看画板上那两列陪集，正规与非正规的差别就落在「能不能乘」这一件事上。</p>

    <h3 class="sec" id="g3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：正规不是「子群里的元素都正常」。</strong>它说的是子群与整个群的共轭关系，与元素本身无关。</li>
        <li><strong>提示二：商群的元素是陪集，不是元素。</strong>写 <Katex tex="aH" /> 时它代表一整块，运算结果也只报到块的层级。</li>
        <li><strong>提示三：正规性依赖父群。</strong>同一个子群嵌在不同群里，正规与否可能不同，说正规必须指明父群。</li>
        <li><strong>提示四：指数 2 一定正规。</strong>这是最快的一条判据，<Katex tex="A_n\trianglelefteq S_n" /> 就靠它。</li>
      </ul>
    </div>
    <p>回收与预告：核正规、商群存在，这两件事合起来给出 <Katex tex="G/\ker\varphi\cong\operatorname{im}\varphi" />。这就是群同态基本定理，也是本模块里第一个把三样对象串成一条等式的结论。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNormal } from '../../../boards/algebra/groupt/normal.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
