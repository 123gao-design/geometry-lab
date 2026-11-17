<template>
  <ChPage :cur="1" no="分1" base="/probability/r" :chapters="RV_CHAPTERS"
    title="随机变量与分布列"
    sub="试验的结果往往不是数。把每个结果对应到一个数上，就能用分布列把「每个取值有多大机会」一次写清，概率问题由此变成对一列数的研究。"
    :toc="[{ id: 'r1-var', t: '随机变量' }, { id: 'r1-list', t: '分布列及其性质' }, { id: 'r1-read', t: '从分布列读概率' }, { id: 'r1-pit', t: '取值与概率和' }]">
    <div class="note good" id="r1-var">在样本空间 <Katex tex="\Omega" /> 上，把每个样本点对应到一个实数 <Katex tex="X(\omega)" />，就得到一个<b>随机变量</b> <Katex tex="X" />。取值能一一列出的叫<b>离散型随机变量</b>；它取每个值 <Katex tex="x_i" /> 的概率 <Katex tex="p_i=P(X=x_i)" /> 排成的表，叫 <Katex tex="X" /> 的<b>分布列</b>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRvList" />
      <div class="cap">图 分1 · <b>分布列的构成</b>：袋中红、蓝、金三种球，摸出一球并按颜色编号为 1、2、3，编号就是一个离散型随机变量。三个滑块改各色球数，左框里的球随之增减，右侧三根柱子按「该色球数 ÷ 总球数」给出概率。看点：无论怎么拖，三个概率都非负、加起来恒为 1，最后一行 <Katex tex="p_1+p_2+p_3" /> 始终读 1.000 —— 这正是一张合法的分布列要满足的两条。</div>
    </div>

    <h3 class="sec" id="r1-var">随机变量</h3>
    <p>掷一枚硬币，「正面」与「反面」不是数，处理起来不方便。规定正面记 1、反面记 0，就有了一个只取 0 与 1 的随机变量。掷两枚硬币记正面数，得到取值 <Katex tex="0,1,2" /> 的随机变量；一批产品中抽十件记次品数，取值是 <Katex tex="0" /> 到 <Katex tex="10" />。随机变量的作用是把「结果的语言」换成「数的语言」，之后就能用等式、不等式去描述事件。</p>
    <p>随机变量与普通函数的区别在于，自变量是样本点，而样本点出现与否带随机性。所以谈的不是「<Katex tex="X" /> 等于几」，而是「<Katex tex="X" /> 等于某个值的概率」。像 <Katex tex="\{X\le 2\}" /> 这样用不等式写出来的集合仍是一个事件，它的概率记作 <Katex tex="P(X\le 2)" />。</p>
    <p>按取值是否可列，随机变量分成两类：掷骰子、抽球、数次数，取值能逐个列出，是离散型；等车时间、零件长度、测量误差，取值充满一段区间，是连续型。图 分1 里的颜色编号属于前者，分布列可以一行行列出来；后者要改用密度曲线描述，见 分3。</p>

    <h3 class="sec" id="r1-list">分布列及其性质</h3>
    <p>设离散型随机变量 <Katex tex="X" /> 的取值为 <Katex tex="x_1,x_2,\dots,x_n" />，把 <Katex tex="P(X=x_i)=p_i" /> 按取值顺序排成两行，就得到分布列。它必须满足两条：</p>
    <p><Katex tex="p_i\ge 0\ (i=1,2,\dots,n)" />，且 <Katex tex="p_1+p_2+\cdots+p_n=1" />。</p>
    <p>第一条来自概率的非负性，第二条来自「各取值对应的事件互斥且合起来是整个样本空间」。反过来，任意一列满足这两条的数，都可以作为某个离散型随机变量的分布列。</p>
    <p>求分布列的步骤是固定的三步：先定出 <Katex tex="X" /> 的全部可能取值，一个也不能漏；再逐个计算 <Katex tex="P(X=x_i)" />，这一步通常要回到样本空间去数样本点，或者用计数原理；最后列成表并用「和为 1」核对。图 分1 中三根柱子的高度就是这张表，把球数拖成 <Katex tex="3,3,3" /> 时三根柱等高，分布列均匀；把某色球拖到 9 个而其余各 1 个，对应柱子明显高出，摸到它的机会接近八成。</p>

    <h3 class="sec" id="r1-read">从分布列读概率</h3>
    <p>有了分布列，任何由 <Katex tex="X" /> 描述的事件都能读出概率：<Katex tex="P(X\in A)" /> 等于 <Katex tex="A" /> 中各个取值对应的概率之和。例如 <Katex tex="P(X\le 2)=p_1+p_2" />，<Katex tex="P(X>2)=1-p_1-p_2" />。这就是分布列比逐个事件算概率省事的地方 —— 算一次，全都有了。</p>
    <p>比较两次试验时，只需比较分布列：柱子更集中在中间，说明取值更稳定；柱子摊得更平，说明结果的分散程度更大。这种「集中或分散」的定量刻画留给 数2 的方差，这里先建立直观。</p>

    <h3 class="sec" id="r1-pit">取值与概率和</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：取值漏项。</strong>「取到红球数」若袋中红球只有 3 个、要抽 4 个球，取值就取不到 4，上限是 3；反之若蓝球只有 2 个，红球数也取不到 1 以下。写分布列前先按两色球数把取值的上下限卡准，中间再逐项核。</li>
        <li><strong>提示二：概率和不是 1。</strong>用「和为 1」可以反求某个未知概率，也可以检验答案。若算出 <Katex tex="0.95" />，多半漏了一种情形；若算出 <Katex tex="1.2" />，多半有事件被重复计算。</li>
        <li><strong>提示三：把样本点个数当概率。</strong>只有在样本点等可能时，概率才等于个数比。若袋中三种球数目不等，摸到每种颜色的机会就不同，必须按球数占比算，不能按「三种颜色」就除以 3。</li>
        <li><strong>提示四：混淆随机变量与它的取值。</strong><Katex tex="X" /> 是「颜色编号」这一整套对应规则，<Katex tex="X=2" /> 才是一个具体事件；写 <Katex tex="P(X)=0.3" /> 是不成立的表述。</li>
      </ul>
    </div>
    <p>回收与预告：分布列把概率问题整理成了一张表，但很多表有共同结构，不必每次都用计数原理重算。分2 处理两类最常见的结构：n 次独立重复试验中的成功次数，与不放回抽取中某类球的个数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRvList } from '../../../boards/probability/rv/rvlist.js';
import { RV_CHAPTERS } from './rvnav.js';
</script>
