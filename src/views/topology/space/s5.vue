<template>
  <ChPage :cur="5" no="拓5" base="/topology/s" :chapters="TSP_CHAPTERS"
    title="度量空间与序列收敛"
    sub="开集公理把「远近」抽掉了，可大多数情形里远近明明还在：平面上的距离、函数之间的最大偏差、码字之间的不同位数。只要有一个满足三条性质的二元函数 d，就能拿它生出开球，再用开球生出整个拓扑。这一章补上这条来路，顺带把「收敛」写成一个不等式。"
    :toc="[{ id: 's5-met', t: '距离与三条性质' }, { id: 's5-ball', t: '开球生成拓扑' }, { id: 's5-seq', t: '序列与连续' }, { id: 's5-cpl', t: '柯西列与完备化' }, { id: 's5-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="X" /> 是非空集，<Katex tex="d:X\times X\to\mathbb{R}" /> 满足：<Katex tex="d(x,y)\ge0" />，等号仅在 <Katex tex="x=y" /> 时成立；<Katex tex="d(x,y)=d(y,x)" />；<Katex tex="d(x,z)\le d(x,y)+d(y,z)" />。称 <Katex tex="(X,d)" /> 为度量空间，<Katex tex="B(x,r)=\{y:d(x,y)<r\}" /> 为以 <Katex tex="x" /> 为心、<Katex tex="r" /> 为半径的开球。全部开球的并集（含空集）就是 <Katex tex="d" /> 诱导的拓扑。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMetric" />
      <div class="cap">图 拓5 · <b>度量球与序列机</b>：左图是 <Katex tex="p" />-范数下的单位球，右图是同一个球放大成半径 <Katex tex="\varepsilon" /> 的邻域，点列 <Katex tex="z_n=(1+1/n,\ \sin(2.2n)/n)" /> 落在球内的涂绿、球外的留橙。看点：① 拖 <Katex tex="p" /> 从 <Katex tex="1" /> 到 <Katex tex="6" />，菱形鼓成圆再收向方框，两图的球同步变；② 拖 <Katex tex="\varepsilon" /> 收紧，绿点变少，「阈值」一格跳到更靠后的项，尾巴一旦全部进圈，这个数就不再变；③ 换到 <Katex tex="p=\infty" />，球变成方框，同一批点在「坐标差的最大值」这把尺子下重新判一次内外。</div>
    </div>

    <h3 class="sec" id="s5-met">距离与三条性质</h3>
    <p>三条性质各管一件事。非负与正定让「距离为零」等价于「同一点」；对称让方向无关；三角不等式把「直接走」与「绕道走」比出大小。前两条几乎自动成立，真正有内容的是第三条，几乎所有关于收敛的估计最后都落在它上面。</p>
    <p>同一集合上可以装很多把尺子。<Katex tex="\mathbb{R}^2" /> 上最常用的是 <Katex tex="p" />-范数距离</p>
    <p style="text-align:center"><Katex display tex="d_p(x,y)=\left(|x_1-y_1|^{p}+|x_2-y_2|^{p}\right)^{1/p},\qquad 1\le p<\infty," /></p>
    <p>以及 <Katex tex="p\to\infty" /> 时的极限形式，也就是最大范数 <Katex tex="d_\infty(x,y)=\max\{|x_1-y_1|,|x_2-y_2|\}" />。画板左图的单位球把这些尺子画成了形状：<Katex tex="p=1" /> 是菱形，<Katex tex="p=2" /> 是圆，<Katex tex="p" /> 越大越接近方框。同一句「距离小于 1」，三把尺子给出的区域完全不同。</p>
    <p>别处还有别的尺子。连续函数空间上可以取 <Katex tex="d(f,g)=\max_{x\in[0,1]}|f(x)-g(x)|" />，也可以取 <Katex tex="\int_0^1|f-g|" />；后者更宽松，两条曲线可以在很窄的高峰上差得很远，积分却很小。两把尺子给出的开集不同，得到的拓扑也就不同。这一点在函数空间里是实质性的，不能想当然地互换。</p>

    <h3 class="sec" id="s5-ball">开球生成拓扑</h3>
    <p>有了球，开集就有了定义：<Katex tex="U" /> 是开集，当且仅当对每个 <Katex tex="x\in U" />，存在 <Katex tex="r>0" /> 使 <Katex tex="B(x,r)\subseteq U" />。三个公理随即成立：空集与全集显然；任意并集里每点所属的那一块已经给出半径；有限交时取各半径的最小值即可。无限交不行，因为一串正的 <Katex tex="r_n" /> 下确界可能是零。</p>
    <p>这样一来，开球全体构成拓扑的一个基：任何开集都能写成若干开球的并。第 2 章讲的「基」在度量空间里有了最自然的例子，而第 1 章的开集公理在这里有了来路——它是把度量空间的开集族的三条性质抽象出来的结果。</p>
    <p>反过来，拓扑不一定来自度量。同一点集上两个度量若给出同一族开集，称它们<b>等价</b>。在有限维 <Katex tex="\mathbb{R}^n" /> 上，所有 <Katex tex="p" />-范数都等价，开集族一模一样，所以画板上球变了形而「谁在球内」的判定在 <Katex tex="p" /> 变动时只是量上的差别，不产生新的拓扑。无限维空间里这条就失效了，那正是泛函分析要处理的情形。</p>

    <h3 class="sec" id="s5-seq">序列与连续</h3>
    <p>度量空间里，收敛可以完全写成不等式：<Katex tex="x_n\to x" /> 指对任意 <Katex tex="\varepsilon>0" />，存在 <Katex tex="N" />，当 <Katex tex="n>N" /> 时 <Katex tex="d(x_n,x)<\varepsilon" />。换成球的说法就是：从第 <Katex tex="N" /> 项起，所有 <Katex tex="x_n" /> 都落在 <Katex tex="B(x,\varepsilon)" /> 内。画板右栏的「阈值」就是这句话里的 <Katex tex="N+1" />：拖 <Katex tex="\varepsilon" /> 变小，它往后跳；一旦某一项之后全部入球，后面再拖也不会退回。</p>
    <p>极限必唯一：若 <Katex tex="x_n\to x" /> 又 <Katex tex="x_n\to y" />，则 <Katex tex="d(x,y)\le d(x,x_n)+d(x_n,y)\to0" />，由正定性 <Katex tex="x=y" />。这条证明只用三角不等式，是度量空间里最标准的写法。</p>
    <p>连续性也有了序列刻画：<Katex tex="f" /> 在 <Katex tex="x" /> 连续，当且仅当 <Katex tex="x_n\to x" /> 推出 <Katex tex="f(x_n)\to f(x)" />。这在一般拓扑空间里只单向成立（连续推出序列连续，反之需要空间满足第一可数性），在度量空间里两个方向都对，因为每点都有可数的球基 <Katex tex="B(x,1/n)" />。第 4 章说「开集的原像仍为开集」，到这里可以换成一个更熟悉的 ε-δ 说法，两者恰好等价。</p>

    <h3 class="sec" id="s5-cpl">柯西列与完备化</h3>
    <p>收敛要求先有一个极限点在那儿。很多时候手里只有「项与项越来越近」这一条，于是把这种列单独命名：对任意 <Katex tex="\varepsilon>0" />，存在 <Katex tex="N" />，当 <Katex tex="m,n>N" /> 时 <Katex tex="d(x_m,x_n)<\varepsilon" />，称 <Katex tex="\{x_n\}" /> 为柯西列。收敛列一定是柯西列；反过来不成立，<Katex tex="\mathbb{Q}" /> 里逼近 <Katex tex="\sqrt2" /> 的有理数列就是柯西列，却在 <Katex tex="\mathbb{Q}" /> 中无极限。</p>
    <p>每个柯西列都收敛的度量空间叫<b>完备</b>。<Katex tex="\mathbb{R}" /> 完备，<Katex tex="\mathbb{Q}" /> 不完备，把 <Katex tex="\mathbb{Q}" /> 的柯西列按「差趋于零」分类、再把每一类补成一个点，得到的正是 <Katex tex="\mathbb{R}" />。这套手续叫完备化，任意度量空间都能做，做法是用柯西列本身当新点。</p>
    <p>完备性最实用的推论是压缩映射原理：若 <Katex tex="f" /> 把完备度量空间映到自身，且存在 <Katex tex="q<1" /> 使 <Katex tex="d(f(x),f(y))\le q\,d(x,y)" />，则 <Katex tex="f" /> 有唯一不动点，且从任一点出发迭代都收敛到它。证明靠柯西列——相邻两项的距离按 <Katex tex="q" /> 的幂衰减，部分和因此可估——与完备性接上。微分方程解的存在唯一性、迭代求根法的收敛性，都由此而来。</p>

    <h3 class="sec" id="s5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：开球严格小于半径。</strong>球面本身不在球内。<Katex tex="d(x,y)=r" /> 的点不属于 <Katex tex="B(x,r)" />，证明「存在球包含于 U」时不能把球面算进去。</li>
        <li><strong>提示二：无限交不保持开性。</strong><Katex tex="\bigcap_{n}(-1/n,1/n)=\{0\}" /> 不是开集。开集只对有限交封闭，这条与拓扑公理里写的完全一致。</li>
        <li><strong>提示三：柯西列不等于收敛列。</strong>判断收敛要先看清空间是否完备。在 <Katex tex="\mathbb{Q}" /> 里讨论 <Katex tex="\sqrt2" /> 的极限，答案只能是「在 <Katex tex="\mathbb{R}" /> 中收敛」。</li>
        <li><strong>提示四：换度量可能换拓扑。</strong>有限维 <Katex tex="\mathbb{R}^n" /> 上各 <Katex tex="p" />-范数等价，画板上球变形而开集族不变；函数空间上 <Katex tex="\max" /> 与积分两种距离给出的开集并不相同，不能随手替换。</li>
      </ul>
    </div>
    <p>回收与预告：度量空间把「远近」重新装了回来，开集、连续、收敛在这一层全部落成不等式，前面几章的抽象结论在这里都能验算。下一章回到整体性质：连通与紧致，看这两条在度量空间里怎么读，以及它们为什么能代替连续性论证里最常用的「闭区间」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMetric } from '../../../boards/topology/space/metric.js';
import { TSP_CHAPTERS } from './snav.js';
</script>
