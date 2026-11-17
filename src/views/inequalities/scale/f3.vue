<template>
  <ChPage :cur="3" no="放3" base="/inequalities/f" :chapters="F_CHAPTERS"
    title="常用放缩：裂项·夹逼·舍项"
    sub="求和式算不出来的场合，放缩是证明式的最后一刀：裂项把每项换成一个更像上一项差的量（错位相消求得到和）；逐项夹逼把每项用小列与大列包住、整和随之被夹；二项舍项只看前几项、非负部分整个扔掉。三法都换回「等号在哪」作交代。"
    :toc="[{ id: 'f3-tel', t: '裂项放大：$1/k^2\\to 1/(k-1)k$' }, { id: 'f3-clamp', t: '逐项夹逼：$S_n$ 界于两相邻分数' }, { id: 'f3-drop', t: '二项舍项：$(1+1/n)^n\\ge 2$' }, { id: 'f3-pattern', t: '放缩的配方与取等' }, { id: 'f3-pit', t: '方向、首项与取等' }]">
    <div class="note good" id="f3-law">求不出和的式子，常用三类放缩。<strong>裂项放大</strong>——把难求和的项换成差的形式：<Katex tex="\frac1{k^2}<\frac1{k(k-1)}=\frac1{k-1}-\frac1k" />，错位相消后整列可求和；<strong>逐项夹逼</strong>——每项 <Katex tex="m_k\le x_k\le M_k" />，对 k 求和得 <Katex tex="\sum m_k\le S_n\le\sum M_k" />，夹逼出极限；<strong>舍非负项</strong>——<Katex tex="t_k\ge0" /> 时 <Katex tex="\sum_{k=0}^{n}t_k\ge\sum_{k=0}^{m}t_k\ (m\le n)" /> 恒真，少算几项得到下界。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSQ" />
      <div class="cap">图 放3 · <b>常用放缩与夹逼</b>：三模式同台。裂项：金柱 <Katex tex="1/k^2"/> 被蓝柱 <Katex tex="1/(k(k-1))"/> 逐项包住，红虚线上界 <Katex tex="2-1/n"/>、紫虚线极限 2；夹逼：金条长 <Katex tex="S_n"/> 被绿下界 <Katex tex="\tfrac12"/> 与红上界 <Katex tex="\tfrac12+1/(2n)"/> 夹住，n 增大时两线靠拢；舍项：橙柱 <Katex tex="k=0,1"/>（和 2）即绿下界，蓝柱 <Katex tex="k\ge2"/> 的非负项舍去，紫线是完整展开和。看点：拖 n，夹逼的两条界随 n 收缩，舍项的多余项缩成小尾巴——三处取等都只在退化位置。</div>
    </div>

    <h3 class="sec" id="f3-tel">裂项放大：<Katex tex="1/k^2\to 1/(k-1)k"/></h3>
    <p>先看教科书经典：证明 <Katex tex="\sum_{k=1}^{n}\frac1{k^2}<2" />。求和式没有通项公式，但每项都可放大成可裂项的量——</p>
    <Katex tex="\frac1{k^2}<\frac1{k(k-1)}=\frac1{k-1}-\frac1k\quad (k\ge2)" display />
    <p>放大后的列逐项相消：</p>
    <Katex tex="1+\sum_{k=2}^{n}\Bigl(\frac1{k-1}-\frac1k\Bigr)=1+\Bigl(1-\frac1n\Bigr)=2-\frac1n<2" display />
    <p>图 放3 裂项模式把这两列画成柱：蓝柱（放大的）永远不低于金柱（原列），错位相消后蓝列总高度恰为 <Katex tex="2-1/n"/>，红线上界随之可见。这里的取等是「没有取到」：放大严格（<Katex tex="1/k^2"/> 恒小于 <Katex tex="1/(k-1)k"/>），只是上界 <Katex tex="2-1/n"/> 随 n 增大逼近 2——放缩换回的不是相等，而是一串越来越紧的单侧界。</p>

    <h3 class="sec" id="f3-clamp">逐项夹逼：<Katex tex="S_n"/> 界于两相邻分数</h3>
    <p>典型题 <Katex tex="S_n=\sum_{k=1}^{n}\frac{k}{n^2+k}" />。每项同时放大缩小：</p>
    <Katex tex="\frac{k}{n^2+n}\ \le\ \frac{k}{n^2+k}\ \le\ \frac{k}{n^2}" display />
    <p>对 k 求和，两组界都化为可算的等差和 <Katex tex="\sum k=\frac{n(n+1)}2" />：</p>
    <Katex tex="\frac{n(n+1)/2}{n(n+1)}=\frac12\ \le\ S_n\ \le\ \frac{n(n+1)/2}{n^2}=\frac{n+1}{2n}=\frac12+\frac1{2n}" display />
    <p>于是 <Katex tex="\frac12\le S_n\le \frac12+\frac1{2n}" />，上界随 n 压向 <Katex tex="\frac12" />，由夹逼得 <Katex tex="\lim S_n=\frac12" />。图 放3 夹逼模式用水平金条显示 S_n 累积值，绿红两虚线标出两端界，n 增大时红线上界滑向绿线下界。这一式子里等号仍取不到：上、下界只在把 <Katex tex="n^2+k" /> 换成分母 <Katex tex="n^2+n"/> 或 <Katex tex="n^2"/> 时才各自「碰到」某项，<Katex tex="S_n"/> 严格居于两界之间。</p>

    <h3 class="sec" id="f3-drop">二项舍项：<Katex tex="(1+1/n)^n\ge 2"/></h3>
    <p>第三类是舍非负项。二项展开各项皆非负：</p>
    <Katex tex="\Bigl(1+\frac1n\Bigr)^n=\sum_{k=0}^{n}\binom nk\frac1{n^k}=1+n\cdot\frac1n+\sum_{k=2}^{n}\binom nk\frac1{n^k}" display />
    <p>保留前两项 <Katex tex="1+1=2" />，舍去 <Katex tex="k\ge2" /> 的非负项得下界 <Katex tex="(1+1/n)^n\ge2" />。n=1 时 (1+1)¹=2 取等；n≥2 时第二项之后还有正项 <Katex tex="\binom n2\frac1{n^2}=\frac{n-1}{2n}>0" />，故严格大于 2。图 放3 舍项模式里橙柱即前两项，蓝柱是被舍掉的非负项，绿色下界线直接画在 2 处，紫线是完整展开和略高一点。同样的舍项思想在泰勒展开的「保留低阶项」里反复出现（V6）。</p>

    <h3 class="sec" id="f3-pattern">放缩的配方与取等</h3>
    <p>放缩不等式的写法有固定套路：先看得出「原式难算、什么好算」，再动手放大或缩小，最后交代取等。图 放3 的三模式对应三副配方——裂项好算是因为差式可相消，夹逼好算是因为两端的界都是等差和，舍项好算是因为非负项扔掉仍是下界。取等的位置各不相同：裂项严格、永远取不到，夹逼只有极限处两界重合，舍项在 <Katex tex="n=1"/> 或保留项数与取等点对齐时。把「<Katex tex="\le"/> 是否可达」写清楚，放的界才落地成最值（呼应基2 的一正二定三相等、放1 同号取等的规定）。</p>

    <h3 class="sec" id="f3-pit">方向、首项与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向依赖要证的式。</strong>证 <Katex tex="\sum\frac1{k^2}<2" /> 要放大，证 <Katex tex="S_n>1/2" /> 要缩小；放错方向整个链条崩。</li>
        <li><strong>提示二：裂项别丢首项。</strong>上面 <Katex tex="1/k^2"/> 的裂项从 <Katex tex="k=2"/> 开始，<Katex tex="k=1"/> 的项 1 单独留下——直接从头写 <Katex tex="1/(k-1)k"/> 首项无定义、错位相消也会把起点弄乱。</li>
        <li><strong>提示三：夹逼的界要会「贴」。</strong>上界、下界分别取最紧的一组：逐项夹逼常用「把 2n 提出来」的同分母技巧，这里上下界取 <Katex tex="k/n^2"/> 与 <Katex tex="k/(n^2+n)"/> 两极端。</li>
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
import { createBoard as createSQ } from '../../../boards/inequalities/scale/squeeze.js';
import { F_CHAPTERS } from './fnav.js';
</script>