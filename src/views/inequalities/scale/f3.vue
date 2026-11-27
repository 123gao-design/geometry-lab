<template>
  <ChPage :cur="3" no="放3" base="/inequalities/f" :chapters="F_CHAPTERS"
    title="常用放缩：裂项·夹逼·舍项"
    sub="比较一个和，先看换掉一项会使它增大还是减小。下面三个例子分别用相邻分数的差求上界，用两个可求的和确定极限，用展开式中的正项给出下界。"
    :toc="[{ id: 'f3-tel', t: '裂项放大：$1/k^2\\to 1/[k(k-1)]$' }, { id: 'f3-clamp', t: '逐项夹逼：$S_n$ 界于两相邻分数' }, { id: 'f3-drop', t: '二项舍项：$(1+1/n)^n\\ge 2$' }, { id: 'f3-pattern', t: '放缩的配方与取等' }, { id: 'f3-pit', t: '方向、首项与取等' }]">
    <div class="note good" id="f3-law">求不出和的式子，常用三类放缩。<strong>裂项放大</strong>——把难求和的项换成差的形式：<Katex tex="\frac1{k^2}<\frac1{k(k-1)}=\frac1{k-1}-\frac1k\ (k\ge2)" />，错位相消后整列可求和；<strong>逐项夹逼</strong>——每项 <Katex tex="m_k\le x_k\le M_k" />，对 k 求和得 <Katex tex="\sum m_k\le S_n\le\sum M_k" />，夹逼出极限；<strong>舍非负项</strong>——<Katex tex="t_k\ge0" /> 时 <Katex tex="\sum_{k=0}^{n}t_k\ge\sum_{k=0}^{m}t_k\ (m\le n)" /> 恒真，少算几项得到下界。</div>

    <h3 class="sec" id="f3-tel">裂项放大：<Katex tex="1/k^2\to 1/[k(k-1)]"/></h3>
    <p>先看教科书经典：证明 <Katex tex="\sum_{k=1}^{n}\frac1{k^2}<2" />。把首项 1 留下。从第二项起，稍微减小分母，就能把每一项放大成两个相邻分数的差。</p>
    <Katex tex="\frac1{k^2}<\frac1{k(k-1)}=\frac1{k-1}-\frac1k\quad(k\ge2)" display />
    <p>放大后的列逐项相消：</p>
    <Katex tex="1+\sum_{k=2}^{n}\Bigl(\frac1{k-1}-\frac1k\Bigr)=1+\Bigl(1-\frac1n\Bigr)=2-\frac1n<2" display />
    <div class="board-wrap">
      <BoardMount :factory="createTelescope" />
      <div class="cap"><b>图 放3a　把相邻的差拼起来</b> · 上方放大第 <Katex tex="n"/> 项，金段是原项，补足蓝段便得到替代项。下方在同一条数轴上排列所有替代项：每段从 <Katex tex="1/k"/> 到 <Katex tex="1/(k-1)"/>，相邻端点正好接上。拖动滑块，每增加一项，蓝带就向左延伸一段。</div>
    </div>

    <h3 class="sec" id="f3-clamp">逐项夹逼：<Katex tex="S_n"/> 界于两相邻分数</h3>
    <p>典型题 <Katex tex="S_n=\sum_{k=1}^{n}\frac{k}{n^2+k}" />。每项同时放大缩小：</p>
    <Katex tex="\frac{k}{n^2+n}\ \le\ \frac{k}{n^2+k}\ \le\ \frac{k}{n^2}" display />
    <p>对 k 求和，两组界都化为可算的等差和 <Katex tex="\sum k=\frac{n(n+1)}2" />：</p>
    <Katex tex="\frac{n(n+1)/2}{n(n+1)}=\frac12\ \le\ S_n\ \le\ \frac{n(n+1)/2}{n^2}=\frac{n+1}{2n}=\frac12+\frac1{2n}" display />
    <p>于是 <Katex tex="\frac12\le S_n\le \frac12+\frac1{2n}" />，上界随 n 压向 <Katex tex="\frac12" />，由夹逼得 <Katex tex="\lim S_n=\frac12" />。当 <Katex tex="n=1"/> 时，唯一一项恰好等于下界；当 <Katex tex="n\ge2"/> 时，至少一项严格大于其下界，而每一项都严格小于其上界，所以部分和严格夹在两界之间。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSqueeze" />
      <div class="cap"><b>图 放3b　原和离下界还能有多远</b> · 横轴是项数 <Katex tex="n"/>，每个金点是一个完整的部分和。滑块选中的竖线从下界伸到上界，它的长度是 <Katex tex="1/(2n)"/>。沿横轴向右读，金点离 <Katex tex="1/2"/> 的距离始终受这段长度限制。</div>
    </div>

    <h3 class="sec" id="f3-drop">二项舍项：<Katex tex="(1+1/n)^n\ge 2"/></h3>
    <p>第三类是舍非负项。二项展开各项皆非负：</p>
    <Katex tex="\Bigl(1+\frac1n\Bigr)^n=\sum_{k=0}^{n}\binom nk\frac1{n^k}=1+n\cdot\frac1n+\sum_{k=2}^{n}\binom nk\frac1{n^k}" display />
    <p>保留前两项 <Katex tex="1+1=2" />，舍去 <Katex tex="k\ge2" /> 的非负项得下界 <Katex tex="(1+1/n)^n\ge2" />。n=1 时 (1+1)¹=2 取等；n≥2 时第二项之后还有正项 <Katex tex="\binom n2\frac1{n^2}=\frac{n-1}{2n}>0" />，故严格大于 2。</p>
    <div class="board-wrap">
      <BoardMount :factory="createBinomial" />
      <div class="cap"><b>图 放3c　舍去的长度就是误差</b> · 两条色带从同一个零点开始，每段的长度等于一项。上条显示完整展开，下条保留到 <Katex tex="k=m"/>。先取 <Katex tex="m=1"/> 看下界 2，再固定 <Katex tex="n"/> 增大 <Katex tex="m"/>，观察蓝色余项何时消失。</div>
    </div>

    <h3 class="sec" id="f3-pattern">放缩的配方与取等</h3>
    <p>选替代式时，可以先问自己想控制什么。要证和小于 2，就找一个能相消的较大项；要确定极限，就估计上下界之间还有多宽；要证和至少为 2，就先保留已经凑足 2 的项，再检查余项的符号。第三幅图中，余项恰好等于原式与下界之差，因此判断取等只需看余项是否为零。</p>

    <h3 class="sec" id="f3-pit">方向、首项与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向依赖要证的式。</strong>证 <Katex tex="\sum\frac1{k^2}<2" /> 要放大，证 <Katex tex="S_n>1/2" /> 要缩小；放错方向整个链条崩。</li>
        <li><strong>提示二：裂项别丢首项。</strong>上面 <Katex tex="1/k^2"/> 的裂项从 <Katex tex="k=2"/> 开始，<Katex tex="k=1"/> 的项 1 单独留下——直接从头写 <Katex tex="1/[k(k-1)]"/> 首项无定义、错位相消也会把起点弄乱。</li>
        <li><strong>提示三：夹逼的界要会「贴」。</strong>要让两组和的差趋于零。本例利用分母随 k 增大的性质，上下界分别取 <Katex tex="k/n^2"/> 与 <Katex tex="k/(n^2+n)"/> 两极端。</li>
        <li><strong>提示四：舍项要看清符号。</strong>二项展开舍的非负项、舍完仍是下界；若被舍项有负号，舍项可能翻转方向。</li>
        <li><strong>提示五：取等要交代。</strong>放缩换回的不一定是等号，把「哪里取到、哪里只是逼近」写清，界才能转成最值。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createTelescope, createSqueeze, createBinomial } from '../../../boards/inequalities/scale/squeeze.js';
import { F_CHAPTERS } from './fnav.js';
</script>