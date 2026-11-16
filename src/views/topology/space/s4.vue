<template>
  <ChPage :cur="4" no="拓4" base="/topology/s" :chapters="TSP_CHAPTERS"
    title="连续映射"
    sub="在拓扑里，连续不需要距离和极限。只要值域里每个开集的原像都还开着，映射就连续。把这条判据倒过来用：什么样的映射可逆、逆也连续？答案是同胚，两个空间从此视为同一个。"
    :toc="[{ id: 's4-def', t: '用开集定义连续' }, { id: 's4-equ', t: '与 ε-δ 的说法一致' }, { id: 's4-homeo', t: '同胚' }, { id: 's4-example', t: '同胚与不同胚' }, { id: 's4-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f:X\to Y" /> 是两个拓扑空间之间的映射。若对 <Katex tex="Y" /> 中每个开集 <Katex tex="V" />，原像
      <Katex tex="f^{-1}(V)=\{x\in X:\ f(x)\in V\}" /> 都是 <Katex tex="X" /> 中的开集，就称 <Katex tex="f" /> <b>连续</b>。若 <Katex tex="f" /> 是双射、且 <Katex tex="f" /> 与 <Katex tex="f^{-1}" /> 都连续，就称 <Katex tex="f" /> 是<b>同胚</b>，<Katex tex="X" /> 与 <Katex tex="Y" /> 同胚。</div>

    <div class="board-wrap">
      <BoardMount :factory="createContMap" />
      <div class="cap">图 拓4 · <b>开区间原像机</b>：蓝线是 <Katex tex="f(x)=x^2" />，橙色横带是值域里的一段开区间 <Katex tex="(a,b)" />。看点：① 绿色竖带是这段区间的原像，<Katex tex="a" />、<Katex tex="b" /> 一拖，竖带跟着伸缩；② 只要曲线连续，原像总是开区间的并，端点画空心；③ 按「跳断函数」把曲线换成 <Katex tex="y=x" /> 与 <Katex tex="y=x+1" /> 拼接，原像靠近断点的一端就变成实心，连续性在那里断掉。</div>
    </div>

    <h3 class="sec" id="s4-def">用开集定义连续</h3>
    <p>这条定义的落点全在「原像」上，不在像上。连续函数的像可以是开区间也可以是闭区间，甚至可以不是开集；被约束的只有原像。方向反了，定义就失效。</p>
    <p>原像还有一条好用的性质：它保住并、交、补的运算，</p>
    <p style="text-align:center"><Katex display tex="f^{-1}\!\left(\bigcup_i V_i\right)=\bigcup_i f^{-1}(V_i),\qquad f^{-1}(Y\setminus V)=X\setminus f^{-1}(V)." /></p>
    <p>所以只要闭集的原像也闭，连续的定义就能改写成闭集版本，两者等价。有些证明用闭集更顺手，比如「连续函数的零点集是闭集」。</p>

    <h3 class="sec" id="s4-equ">与 ε-δ 的说法一致</h3>
    <p>在度量空间里，开集原像的定义与 <Katex tex="\varepsilon" />-<Katex tex="\delta" /> 完全是同一句话。给定 <Katex tex="\varepsilon>0" />，取值域里那颗开球 <Katex tex="V=B(f(x_0),\varepsilon)" />，它的原像开，所以在 <Katex tex="x_0" /> 处配得上一颗球 <Katex tex="B(x_0,\delta)" /> 整颗落在原像里。把最后这句翻译回来，就是</p>
    <p style="text-align:center"><Katex display tex="d(x,x_0)<\delta\ \Longrightarrow\ d(f(x),f(x_0))<\varepsilon." /></p>
    <p>反过来，任给开集 <Katex tex="V" /> 与 <Katex tex="x\in f^{-1}(V)" />，由 <Katex tex="f(x)" /> 在 <Katex tex="V" /> 里配一颗球，再用 <Katex tex="\varepsilon" />-<Katex tex="\delta" /> 找回一颗原像里的球。两套说法互相翻译，一个字都不差。</p>
    <p>这也说明拓扑定义并没有放宽标准，它只是把「球」换成了「开集」，因而能用在没有距离的空间上。余有限拓扑里没有小球，却照样能谈连续。</p>

    <h3 class="sec" id="s4-homeo">同胚</h3>
    <p>连续双射的逆未必连续。数轴上的 <Katex tex="f(x)=x^3" /> 逆也连续，可换成 <Katex tex="[0,2\pi)" /> 到单位圆、<Katex tex="t\mapsto(\cos t,\sin t)" /> 就不行：它连续且是双射，但逆映射在 <Katex tex="(1,0)" /> 处不连续——圆上靠近这一点的两侧，被拉到了 <Katex tex="0" /> 与 <Katex tex="2\pi" /> 两头。</p>
    <p>所以同胚要两条一起要：双向连续。同胚是拓扑空间之间的「等号」：它把开集与开集一一对上，任何只用开集能说出的性质，同胚两边完全一样。这类性质叫拓扑性质。</p>
    <p>拓扑性质举例：连通、紧致、有无孤立点、是不是离散空间、点数（在有限集上）。长度、角度、面积不是拓扑性质——同胚可以把一段弧拉成任意形状，长度随便变。</p>

    <h3 class="sec" id="s4-example">同胚与不同胚</h3>
    <p>开区间 <Katex tex="(0,1)" /> 与整个实数轴同胚，靠 <Katex tex="x\mapsto\tan\left(\pi\left(x-\tfrac12\right)\right)" />：把有限的开区间掰直、拉长成无限长，两头越靠近端点拉得越狠。闭区间 <Katex tex="[0,1]" /> 与 <Katex tex="(0,1)" /> 不同胚：前者紧致后者不紧致，紧致性是拓扑性质，同胚保不住就说明两者不是同一个空间。</p>
    <p>圆周与正方形边界同胚：把方角磨圆，磨的过程可以写成连续可逆的映射。圆周与线段不同胚：从圆上挖掉一点还剩连通的一块，从线段内部挖掉一点断成两段，而「挖一点后是否连通」由同胚保持。</p>
    <p>判断不同胚的常用手法就是找不变量：数一数连通分支、看紧致性、看基本群。下一节开始建立的不变量，全部服务于这个目的——同胚的东西不变量相同，不变量不同的东西一定不同胚。</p>

    <h3 class="sec" id="s4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：连续看原像，不看像。</strong>「开集的像是开集」是开映射，比连续强得多，不能拿来当连续的定义。常数映射连续，但把开集映成单点，不是开映射。</li>
        <li><strong>提示二：连续双射不等于同胚。</strong>逆映射还得连续。圆周参数化的例子说明，双射可以连续而逆不连续，缺一条就不是同胚。</li>
        <li><strong>提示三：同胚保的是拓扑性质。</strong>连通、紧致、分支个数都能带过去；长度、角度、曲率带不过去。用长度论证不同胚，方向就错了。</li>
        <li><strong>提示四：比较两个空间，先找一条简单的判据。</strong>挖点法、紧致性、连通分支数，通常比硬构造同胚快。要证明同胚才需要把映射写出来，并验双向连续。</li>
      </ul>
    </div>
    <p>回收与预告：同胚把空间分成等价类，接下来要问每一类内部还有什么结构。最基础的一对性质是连通与紧致——它们不靠距离，却能把许多空间一眼分开，下一节从连通开始。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createContMap } from '../../../boards/topology/space/contmap.js';
import { TSP_CHAPTERS } from './snav.js';
</script>
