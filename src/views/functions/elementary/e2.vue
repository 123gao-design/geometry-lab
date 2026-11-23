<template>
  <ChPage :cur="2" no="E2" base="/functions/e" :chapters="E_CHAPTERS"
    title="二次函数：区间最值与根的分布" sub="闭区间内的二次函数最值取决于顶点和端点。判断根的位置还需检查判别式。"
    :toc="[{ id: 'e2-thm', t: '区间最值定理（图 E2）' }, { id: 'e2-dyn', t: '双动态：两类大题型' }, { id: 'e2-pos', t: '根的分布（图 E2b）' }, { id: 'e2-pit', t: '距离语言与易错点' }]">
    <div class="note good" id="e2-thm"><strong>区间最值（a&gt;0）</strong>：设对称轴 <Katex tex="x^*=-\dfrac{b}{2a}" />、区间 <Katex tex="[p,q]" />。①轴在区间内（<Katex tex="p\le x^*\le q" />）：min 在顶点 <Katex tex="f(x^*)=\dfrac{4ac-b^2}{4a}" />，max 在距轴较远的端点；②轴在左外（<Katex tex="x^*&lt;p" />）：min=f(p)、max=f(q)；③轴在右外（<Katex tex="x^*&gt;q" />）：min=f(q)、max=f(p)。开口向下（a&lt;0）时全部对调：顶点管 max，端点压 min。</div>
    <div class="board-wrap">
      <BoardMount :factory="createQuadmin" />
      <div class="cap">图 E2 · <b>闭区间上的最值</b>。移动顶点或端点，比较顶点与两端的函数值，观察最值点何时切换。</div>
    </div>

    <h3 class="sec" id="e2-dyn">双动态：两类大题型</h3>
    <p><strong>定轴动区间</strong>（轴 x*=0 定死，区间动）：区间扫过轴，min 从端点移到顶点再移回 —— 图 E2 ① 把手提供手动操作。<strong>动轴定区间</strong>（区间定死，轴动）：图 E2 ② 滑块 t 从左外拖到区间内再拖到右外，min 的取值点经历「右端点 → 顶点 → 左端点」三次更换。两类题的通用结论是同一句：<strong>顶点在不在区间内？在，顶点定一端最值；不在，近端点取最值 —— 另一端永远由「距轴较远者」决定</strong>。</p>
    <p>为什么「距轴较远者」总取到最值？配方后 <Katex tex="f(x)=a(x-x^*)^2+f(x^*)" />：a&gt;0 时值随 <Katex tex="|x-x^*|" />（到轴的距离）单调上升 —— 哪个端点离轴远，哪个端点的值就大。距离语言把三种位置关系统一成一次比较，这正是它优于死记三类算式之处。</p>

    <h3 class="sec" id="e2-pos">根的分布：同一套工具的第二个问题</h3>
    <div class="note good"><strong>根分布</strong>：已知 <Katex tex="ax^2+bx+c=0" />（<Katex tex="a\ne 0" />），问实根相对某个参照位置（点 k 或参照区间 <Katex tex="(1,3)" />）落在哪侧/之内。全部工具与最值共用，只有三项：① <strong>Δ</strong> —— 根存在吗（<Katex tex="\Delta=b^2-4ac\ge 0" /> 是一切讨论的前提，无根则不必讨论分布）；② <strong>对称轴</strong> <Katex tex="x=-\dfrac{b}{2a}" /> —— 根的「平均位置」（两根之和的一半），轴在哪，两根整体就在哪；③ <strong>端点符号 a·f(k)</strong> —— k 在两根之内还是之外，一个乘积即可判定。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRootDist" />
      <div class="cap">图 E2b · <b>一元二次方程根的分布</b>。移动顶点与纵向位置，对照无实根、重根及根落在区间内外的情形。端点函数值为零时，该端点本身是根。</div>
    </div>
    <p>最常用的一条判据：<strong>一根小于 <Katex tex="k" />、一根大于 <Katex tex="k" /> <Katex tex="\iff" /> <Katex tex="a\cdot f(k)<0" /></strong>。推导只有一行 —— 设两根 <Katex tex="r_1\le r_2" />，把 <Katex tex="f" /> 写成因式分解形，代入 <Katex tex="k" />：</p>
    <Katex tex="f(k)=a(k-r_1)(k-r_2)\quad\Longrightarrow\quad a\cdot f(k)=a^2(k-r_1)(k-r_2)" display />
    <p><Katex tex="a^2>0" /> 定号，于是符号全由 <Katex tex="(k-r_1)(k-r_2)" /> 决定：k 夹在两根之间时两因子异号、乘积为负；k 在两根之外时同号为正 —— 与开口方向无关（<Katex tex="a^2" /> 消去了 a 的符号影响），所以判据对开口上下的抛物线一体适用（图 E2b ③）。注意它<strong>不需要 Δ</strong>：a·f(k)&lt;0 时两根必然分居 k 两侧，实根自动存在 —— 三项判据里唯一自带 Δ 的就是它。</p>
    <p>「两根都在 <Katex tex="k" /> 的右侧」（<Katex tex="a>0" /> 为例）需要三条同时成立：<Katex tex="\Delta\ge 0" />（有根）、<Katex tex="-\dfrac{b}{2a}>k" />（轴在 <Katex tex="k" /> 右 —— 两根的平均值在 <Katex tex="k" /> 右，缺这条时两根可能同在 <Katex tex="k" /> 左，符号判据分不出在哪一侧）、<Katex tex="a\cdot f(k)>0" />（<Katex tex="k" /> 在两根之外）。三条各管一段：<Katex tex="\Delta" /> 管「有没有」，轴管「整体偏哪」，端点符号管「<Katex tex="k" /> 是否被夹住」—— 少查一条都有反例使另两条失效（图 E2b ① 拖一拖就能得到「轴在区内但根在外」这类反例）。区间版只是点版用两次：两根都在 <Katex tex="(1,3)" /> 内 <Katex tex="\iff" /> 对 <Katex tex="k=1" />「两根都 <Katex tex="&gt;1" />」且对 <Katex tex="k=3" />「两根都 <Katex tex="&lt;3" />」，各查三条。</p>

    <h3 class="sec" id="e2-pit">距离语言与易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示 · 区间最值</div>
      <ul class="tip-list">
        <li><strong>提示一：不讨论轴与区间的位置关系就下笔。</strong>「顶点值最小」只在轴于区间内成立；轴在外时最小值在端点（图 E2 ② 把 t 拖到 0 或 3.5 看交接）。</li>
        <li><strong>提示二：开口向下忘记对调。</strong>a&lt;0 时顶点是 max，端点压 min —— 图 E2 ③。</li>
        <li><strong>提示三：动轴题只盯顶点。</strong>区间窄而轴在远处时，两端其实都由端点决定；max 与 min 可能落在同一侧的不同端点上，不要用错「远者大」的方向（a&lt;0 时远者小）。</li>
      </ul>
    </div>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示 · 根的分布</div>
      <ul class="tip-list">
        <li><strong>提示一：忘 Δ。</strong>无根则不必讨论分布 —— 先查 <Katex tex="\Delta" /> 再动笔（图 E2b ② 的悬空态）。</li>
        <li><strong>提示二：忘开口方向。</strong>记「f(k)&gt;0」而不带 a 是常见错误：判据是 <strong>a·f(k)</strong> 的符号，开口向下时全部对调（图 E2b ③）。</li>
        <li><strong>提示三：压线情形。</strong>根恰好落在端点（双根压线、或单根压线）时开闭区间口径不同 —— 图 E2b ② c=1 的双根恰好压在 1 上，判定徽章单独提示，答题时「等号要不要并进」要看题目的开闭。</li>
        <li><strong>提示四：区分分居两侧与两根在同侧。</strong><Katex tex="a f(k)<0" /> 表示两根严格分居 k 两侧。两根都大于 k 时，还要结合判别式、端点值和对称轴所在的一侧来判断。</li>
      </ul>
    </div>
    <p>回收与预告：S4 的界墙机问「值域有没有墙」—— 本章在闭区间上把墙的上下界落实为 <Katex tex="\max/\min" />；S2 的顶点与对称轴在本章先是「最值的位置」，再充当根分布里「根的平均位置」，同一根对称轴的两种用法。E7 对勾函数在区间上的最值是它的推广（顶点不在原点、还带渐近线）；V3 将用 <Katex tex="f'=0" /> 统一「确定最值点」这件事 —— 那时「轴在不在区间内」会变成「驻点在不在区间内」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuadmin } from '../../../boards/functions/elementary/quadmin.js';
import { createBoard as createRootDist } from '../../../boards/functions/elementary/rootdist.js';
import { E_CHAPTERS } from './enav.js';
</script>