<template>
  <ChPage :cur="4" no="维4" base="/fractal/d" :chapters="FS_CHAPTERS"
    title="豪斯多夫维数"
    sub="盒维数把尺子固定成网格，换一种摆法数出来的盒子数就不一样，收敛性也不总有保证。豪斯多夫的办法更彻底：允许覆盖用任意多、任意小的区间，只要求所有直径不超过 δ，然后看「直径的 s 次方之和」随 δ 收窄时飞向无穷还是落向零，把两个区域的分界点定义成维数。"
    :toc="[{ id: 'd4-def', t: '从覆盖到测度' }, { id: 'd4-crit', t: '临界指数' }, { id: 'd4-cantor', t: '康托集的计算' }, { id: 'd4-cmp', t: '与盒维数比较' }, { id: 'd4-pit', t: '四条提示' }]">
    <div class="note good">对 <Katex tex="s\ge0" /> 与 <Katex tex="\delta>0" />，令 <Katex tex="\mathcal{H}^s_\delta(E)=\inf\left\{\sum_i(\operatorname{diam}U_i)^s\right\}" />，下确界取遍所有直径不超过 <Katex tex="\delta" /> 的覆盖；再令 <Katex tex="\delta\to0" /> 得 <Katex tex="\mathcal{H}^s(E)" />。存在唯一的临界值 <Katex tex="s_0" />，使 <Katex tex="s<s_0" /> 时测度为无穷、<Katex tex="s>s_0" /> 时测度为零，这个 <Katex tex="s_0" /> 就是豪斯多夫维数。</div>

    <div class="board-wrap">
      <BoardMount :factory="createHausdorff" />
      <div class="cap">图 维4 · <b>豪斯多夫维数</b>：左图逐层搭康托集，第 <Katex tex="k" /> 层的 <Katex tex="2^k" /> 条区间就是直径 <Katex tex="\delta=3^{-k}" /> 的覆盖；右图画 <Katex tex="F_k(s)=\sum\delta^{s}" /> 的对数曲线，每条是一条直线。看点：① 拖层数 <Katex tex="k" />，左图区间数翻倍、每条缩到三分之一，右图直线的斜率随之变陡；② 拖 <Katex tex="s" /> 越过 <Katex tex="0.6309" />，读数栏的 <Katex tex="F_k" /> 从随 <Katex tex="k" /> 猛涨变成迅速衰减；③ 把 <Katex tex="s" /> 停在虚线处，每一层的 <Katex tex="F_k" /> 都恰好等于 <Katex tex="1" />——测度既不零也不无穷，这正是维数的含义。</div>
    </div>

    <h3 class="sec" id="d4-def">从覆盖到测度</h3>
    <p>把「长度」推广到分数阶，想法是把一维的长度 <Katex tex="|U|" /> 换成 <Katex tex="|U|^{s}" />。用直径不超过 <Katex tex="\delta" /> 的一族集合把 <Katex tex="E" /> 盖住，把各块的 <Katex tex="|U_i|^{s}" /> 加起来，再对所有这样的覆盖取下确界：</p>
    <p style="text-align:center"><Katex display tex="\mathcal{H}^s_\delta(E)=\inf\left\{\sum_i|U_i|^{s}:\ E\subseteq\bigcup_iU_i,\ |U_i|\le\delta\right\}." /></p>
    <p><Katex tex="\delta" /> 变小，可用的覆盖变少，下确界只增不减，因此 <Katex tex="\delta\to0" /> 时的极限（允许取 <Katex tex="+\infty" />）存在：</p>
    <p style="text-align:center"><Katex display tex="\mathcal{H}^s(E)=\lim_{\delta\to0}\mathcal{H}^s_\delta(E)." /></p>
    <p>它满足测度的几条要求：空集为零、可数可加、单调。值得注意的是「直径」而不是「边长」，因为覆盖用的集合不必是方块，圆、线段、任何有界集都可以参与，只要直径够小。这一点比盒计数宽松得多。</p>

    <h3 class="sec" id="d4-crit">临界指数</h3>
    <p>固定 <Katex tex="E" />，把 <Katex tex="s" /> 当变量看。若 <Katex tex="s" /> 增大，每个 <Katex tex="|U_i|^{s}" /> 都变小，因为 <Katex tex="|U_i|\le\delta" /> 可能小于 1；一旦某个 <Katex tex="s_1" /> 使测度有限，更大的 <Katex tex="s" /> 只会更小，直接为零。反过来也一样。所以 <Katex tex="\mathcal{H}^s" /> 关于 <Katex tex="s" /> 是一个阶梯：先是无穷，跨过一点后变成零。</p>
    <p style="text-align:center"><Katex display tex="\dim_H E=\inf\{s:\mathcal{H}^s(E)=0\}=\sup\{s:\mathcal{H}^s(E)=\infty\}." /></p>
    <p>在临界值上测度可以是零、可以是正有限、也可以是无穷，得看具体集合。康托集属于最好的那一类：<Katex tex="\mathcal{H}^{D}(C)=1" />，不偏不倚。画板右图把这一点画得一目了然：所有直线都穿过 <Katex tex="(\log2/\log3,\,1)" /> 这个交点，左边一段上扬、右边一段下坠，交点就是临界指数。</p>

    <h3 class="sec" id="d4-cantor">康托集的计算</h3>
    <p>第 <Katex tex="k" /> 层的 <Katex tex="2^{k}" /> 条闭区间是一族自然覆盖，每条直径 <Katex tex="3^{-k}" />，代入定义：</p>
    <p style="text-align:center"><Katex display tex="\mathcal{H}^s_{\delta_k}(C)\le 2^{k}\cdot3^{-ks}=\left(\frac{2}{3^{s}}\right)^{k},\qquad \delta_k=3^{-k}." /></p>
    <p>这个上界在 <Katex tex="2<3^{s}" />，即 <Katex tex="s>\log2/\log3" /> 时随 <Katex tex="k" /> 指数衰减，于是 <Katex tex="\mathcal{H}^s(C)=0" />。下界要靠「把一条长区间拆成若干短区间后 <Katex tex="\sum|U|^s" /> 不增」这条凸性，推出任何覆盖的代价都不小于一个与 <Katex tex="2/3^{s}" /> 相当的常数，因此 <Katex tex="s<\log2/\log3" /> 时测度为无穷。两头一夹，维数只能是</p>
    <p style="text-align:center"><Katex display tex="\dim_H C=\frac{\log2}{\log3}\approx0.6309." /></p>
    <p>同一条路子给出另外两个熟数：科赫曲线 <Katex tex="\dim_H=\dfrac{\log4}{\log3}\approx1.2619" />，谢尔宾斯基三角形 <Katex tex="\dim_H=\dfrac{\log3}{\log2}\approx1.5850" />。自相似集若满足开集条件，维数就由 <Katex tex="\sum r_i^{s}=1" /> 唯一确定，这条定理让大量计算变成解一个方程。</p>

    <h3 class="sec" id="d4-cmp">与盒维数比较</h3>
    <p>盒维数与豪斯多夫维数大体同阶，但不总相等。一般有</p>
    <p style="text-align:center"><Katex display tex="\dim_H E\le\underline{\dim}_B E\le\overline{\dim}_B E." /></p>
    <p>原因是盒计数只允许用同一种尺子，而豪斯多夫允许不同大小的块混搭，能挑最省的一种盖法，所以它的数只会更小。对自相似集两者相同，对某些靠得很近的集合，盒维数会被「靠近」这件事虚增，豪斯多夫维数则不受影响。</p>
    <p>两条基本事实值得记住：可数集的豪斯多夫维数为零（单个点维数为零，可数个零维集之并仍为零）；<Katex tex="\mathbb{R}^{n}" /> 中任何集合的维数不超过 <Katex tex="n" />。所以维数介于零与所在空间的维数之间，分数维意味着集在每一层尺度上都有结构，而不是稀稀落落几个点。</p>

    <h3 class="sec" id="d4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：覆盖的直径要一致地小。</strong>定义里要求所有 <Katex tex="|U_i|\le\delta" />，一块大区间混进来，整族覆盖就作废。这与盒计数里「边长固定」是同一个精神，只是豪斯多夫更灵活。</li>
        <li><strong>提示二：维数不是唯一确定的量。</strong>临界指数上的测度可以是零、有限或无穷，三种情形都合法。说「<Katex tex="D" /> 维测度」时必须先说明是哪个集合、归一化到多少。</li>
        <li><strong>提示三：算上界用自然覆盖，算下界要另想办法。</strong>把 <Katex tex="k" /> 层区间直接代进去只给出上界。下界通常靠质量分布原理：在集合上放一个测度，若每块直径 <Katex tex="r" /> 的集合质量不超过 <Katex tex="r^{s}" />，就能压出 <Katex tex="\mathcal{H}^s>0" />。</li>
        <li><strong>提示四：盒维数可能偏大。</strong>两者相等的条件要单独验证，自相似集满足开集条件时可以放心用相似维数的公式，一般集合不能直接套。</li>
      </ul>
    </div>
    <p>回收与预告：三章把「维数」这件事从比例、从网格、从覆盖三个角度各说了一遍，分形的度量基础到此齐了。下一章从康托集开始，逐个看具体的自相似集：它们由一条替换规则长出来，规则一经给定，图形就被完全锁死。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHausdorff } from '../../../boards/fractal/dim/hausdorff.js';
import { FS_CHAPTERS } from './fsnav.js';
</script>
