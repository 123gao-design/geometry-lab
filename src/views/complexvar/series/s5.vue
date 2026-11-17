<template>
  <ChPage :cur="5" no="级5" base="/complexvar/s" :chapters="CY_CHAPTERS"
    title="用留数计算实积分"
    sub="留数定理在复平面上算出的是回路积分，可它真正称手的活计在实轴上：一段看起来无从下手的实积分，补上半圆围成回路，回路内部的极点各自交出一份留数，补上的那段弧又随半径增大自行消失。这一章把三种常用围道摆开，逐一看它们是靠什么条件收口的。"
    :toc="[{ id: 's5-lemma', t: '两条收口引理' }, { id: 's5-type1', t: '有理函数型' }, { id: 's5-type2', t: '含指数因子型' }, { id: 's5-type3', t: '三角有理式型' }, { id: 's5-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在闭合围道 <Katex tex="\Gamma" /> 上及其内部除有限个孤立奇点外解析，则 <Katex tex="\oint_\Gamma f(z)\,dz=2\pi i\sum_{k=1}^{n}\operatorname{Res}[f;z_k]" />，求和只取围道<b>内部</b>的奇点。计算实积分时，围道由上半个大圆与实轴段拼成，<Katex tex="\int_{-R}^{R}" /> 走直线，弧上那段在 <Katex tex="R\to\infty" /> 时归零。</div>

    <div class="board-wrap">
      <BoardMount :factory="createResInt" />
      <div class="cap">图 级5 · <b>用留数计算实积分</b>：左图是上半圆围道与两个极点，右图是实轴上的被积函数和截断到 <Katex tex="[-R,R]" /> 的阴影面积。看点：① 半圆半径怎么变，里面始终只有上半平面那个极点，下半平面的一直留在外面；② 拖 <Katex tex="R" /> 增大，右图阴影向两端铺开，读数栏的「实轴截断」一步步靠向回路积分给出的精确值；③ 换到 ② 号预设，二阶极点要按求导法则算留数，「留数和」从 <Katex tex="-\tfrac{i}{2}" /> 变成 <Katex tex="-\tfrac{i}{4}" />，精确值也跟着从 <Katex tex="\pi" /> 落到 <Katex tex="\tfrac{\pi}{2}" />。</div>
    </div>

    <h3 class="sec" id="s5-lemma">两条收口引理</h3>
    <p>围道的思路固定：实轴段 <Katex tex="[-R,R]" /> 加一个上半圆 <Katex tex="C_R" />。围道积分由留数算出，拆开之后</p>
    <p style="text-align:center"><Katex display tex="\oint_{\Gamma_R}f(z)\,dz=\int_{-R}^{R}f(x)\,dx+\int_{C_R}f(z)\,dz." /></p>
    <p>要让左边等于所求的实积分，右端第二项必须随 <Katex tex="R\to\infty" /> 趋于零。把这一项压下去，靠的是两条引理。</p>
    <p><b>大圆弧引理。</b>若在 <Katex tex="|z|=R" /> 的上半圆弧上有 <Katex tex="|f(z)|\le M_R" />，且 <Katex tex="R\,M_R\to0" />，则 <Katex tex="\int_{C_R}f(z)\,dz\to0" />。估计只用一步：<Katex tex="\left|\int_{C_R}f\,dz\right|\le M_R\cdot\pi R" />，弧长是 <Katex tex="\pi R" />，所以条件写成 <Katex tex="M_R=o(1/R)" /> 就够。有理函数 <Katex tex="P/Q" /> 在分母次数比分子高出至少 2 时恰好满足：<Katex tex="|f|\sim C/R^{2}" />，乘上 <Katex tex="\pi R" /> 仍趋零。</p>
    <p><b>若尔当引理。</b>形如 <Katex tex="e^{iaz}f(z)" />（<Katex tex="a>0" />）的函数，大圆弧条件可以放宽一档：只要 <Katex tex="f" /> 在上半平面一致趋于零，<Katex tex="\int_{C_R}e^{iaz}f(z)\,dz\to0" />。原因是 <Katex tex="e^{iaz}=e^{-ay}" />，在上半平面 <Katex tex="y>0" /> 时它指数衰减，衰减最弱的位置只有圆弧两端附近，中段几乎全是零。这一条让分母只比分子高一次的有理函数也能用围道：没有它，<Katex tex="\pi R/R=\pi" /> 消不掉。</p>
    <p>两条引理各管一类围道，指向的正是下面两种标准型。</p>

    <h3 class="sec" id="s5-type1">有理函数型</h3>
    <p>求 <Katex tex="\int_{-\infty}^{\infty}\dfrac{P(x)}{Q(x)}\,dx" />，其中 <Katex tex="P,Q" /> 是实系数多项式，<Katex tex="Q" /> 在实轴上无零点，且 <Katex tex="\deg Q\ge\deg P+2" />。取上半圆围道，由大圆弧引理弧上积分归零，于是</p>
    <p style="text-align:center"><Katex display tex="\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}\,dx=2\pi i\sum_{\operatorname{Im}z_k>0}\operatorname{Res}\left[\frac{P}{Q};z_k\right]." /></p>
    <p>拿 <Katex tex="\int_{-\infty}^{\infty}\dfrac{dx}{1+x^{2}}" /> 试一遍。极点 <Katex tex="z=\pm i" />，上半平面只有 <Katex tex="i" />，一阶极点用 <Katex tex="\dfrac{P(z_0)}{Q'(z_0)}" />：<Katex tex="\operatorname{Res}=\dfrac{1}{2i}=-\dfrac{i}{2}" />。乘 <Katex tex="2\pi i" /> 得 <Katex tex="\pi" />，与初等算法一致。</p>
    <p>二阶极点就得多求一次导。对 <Katex tex="\int_{-\infty}^{\infty}\dfrac{dx}{(1+x^{2})^{2}}" />，取 <Katex tex="f(z)=\dfrac{1}{(z+i)^{2}}" />，<Katex tex="z_0=i" /> 是它的二阶极点（不是 <Katex tex="f" /> 本身的分母零点，注意区别）：</p>
    <p style="text-align:center"><Katex display tex="\operatorname{Res}[f;i]=\lim_{z\to i}\frac{d}{dz}(z-i)^{2}f(z)=\lim_{z\to i}\frac{-2}{(z+i)^{3}}=\frac{-2}{(2i)^{3}}=-\frac{i}{4}." /></p>
    <p>积分值是 <Katex tex="\dfrac{\pi}{2}" />。画板 ② 号预设走的就是这一条，右图阴影每加宽一次，读数就往 <Katex tex="1.5708" /> 靠一格。</p>

    <h3 class="sec" id="s5-type2">含指数因子型</h3>
    <p>求 <Katex tex="\int_{-\infty}^{\infty}\dfrac{P(x)}{Q(x)}\,e^{iax}\,dx" />（<Katex tex="a>0" />），条件只要求 <Katex tex="\deg Q\ge\deg P+1" />。做法是把 <Katex tex="e^{iax}" /> 换成 <Katex tex="e^{iaz}" />，在上半圆围道上用若尔当引理收口，取实部或虚部即得原积分。这里有一处容易写错的地方：<b>换上去的是 <Katex tex="e^{iaz}" />，不是 <Katex tex="\cos az" /></b>。<Katex tex="\cos az" /> 在复平面上沿虚轴指数增长，大圆弧上根本不衰减，围道收不了口；<Katex tex="e^{iaz}" /> 在上半平面才衰减。</p>
    <p>画板 ③ 号预设算的是 <Katex tex="\int_{-\infty}^{\infty}\dfrac{\cos x}{1+x^{2}}\,dx" />。极点仍是 <Katex tex="z=i" />，留数</p>
    <p style="text-align:center"><Katex display tex="\operatorname{Res}\left[\frac{e^{iz}}{1+z^{2}};i\right]=\frac{e^{i\cdot i}}{2i}=\frac{e^{-1}}{2i}=-\frac{i}{2e},\qquad \int_{-\infty}^{\infty}\frac{\cos x}{1+x^{2}}\,dx=2\pi i\left(-\frac{i}{2e}\right)=\frac{\pi}{e}." /></p>
    <p>数值上 <Katex tex="\pi/e\approx1.1557" />。顺便看一个对称的结论：同一条围道对 <Katex tex="\dfrac{\sin x}{1+x^{2}}" /> 给出的值是 <Katex tex="0" />，因为被积函数是奇函数，围道里的留数虚部也对消了。这说明取实部与取虚部要按题目要求分开算，不能一把抓。</p>

    <h3 class="sec" id="s5-type3">三角有理式型</h3>
    <p>形如 <Katex tex="\int_{0}^{2\pi}R(\cos\theta,\sin\theta)\,d\theta" /> 的积分走另一条围道：单位圆。<Katex tex="z=e^{i\theta}" />，<Katex tex="dz=iz\,d\theta" />，而</p>
    <p style="text-align:center"><Katex display tex="\cos\theta=\frac{z+z^{-1}}{2},\qquad \sin\theta=\frac{z-z^{-1}}{2i},\qquad d\theta=\frac{dz}{iz}." /></p>
    <p>代进去，三角有理式变成 <Katex tex="z" /> 的有理函数，沿单位圆逆时针积分。单位圆内的极点各交一份留数，外面的一概不算。例如</p>
    <p style="text-align:center"><Katex display tex="\int_{0}^{2\pi}\frac{d\theta}{5+4\cos\theta}=\oint_{|z|=1}\frac{1}{5+2(z+z^{-1})}\cdot\frac{dz}{iz}=\oint_{|z|=1}\frac{dz}{i(2z^{2}+5z+2)}." /></p>
    <p>分母的根是 <Katex tex="z=-2" /> 与 <Katex tex="z=-\tfrac{1}{2}" />，只有后者在圆内。一阶留数 <Katex tex="\dfrac{1}{i(4z+5)}\Big|_{z=-1/2}=\dfrac{1}{3i}" />，乘 <Katex tex="2\pi i" /> 得 <Katex tex="\dfrac{2\pi}{3}" />。</p>
    <p>三类围道的共同骨架是「补一段能收口的曲线」。有理函数靠次数差，含指数因子的靠衰减，三角有理式靠单位圆本身闭合，不需要补。选围道之前先看被积函数在无穷远或大圆上的增长速度，这一步定下来，后面的留数只是机械计算。</p>

    <h3 class="sec" id="s5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只算围道内部的极点。</strong>上半圆围道把下半平面的极点排除在外，实轴上的极点则要求绕开（改成小半圆）。画板上灰点和橙点分得很清楚，灰点上的留数不进求和。</li>
        <li><strong>提示二：实轴上有极点时换小半圆。</strong>比如 <Katex tex="\int\dfrac{\sin x}{x}dx" />，<Katex tex="x=0" /> 是极点，需要把实轴段在原点处让开一个半径 <Katex tex="\varepsilon" /> 的小半圆，<Katex tex="\varepsilon\to0" /> 时它贡献半个留数（<Katex tex="\pi i" /> 乘留数）。整条路径漏掉这一小块，答案会差一半。</li>
        <li><strong>提示三：阶数决定求导次数。</strong>一阶极点用 <Katex tex="\dfrac{P(z_0)}{Q'(z_0)}" />，<Katex tex="m" /> 阶极点用 <Katex tex="\dfrac{1}{(m-1)!}\lim_{z\to z_0}\dfrac{d^{m-1}}{dz^{m-1}}\left[(z-z_0)^{m}f(z)\right]" />。把阶数当成 <Katex tex="m-1" /> 代进去，系数就错。</li>
        <li><strong>提示四：积分收敛要先确认。</strong>围道法算的是主值意义下的积分。分母在实轴上有零点、或者次数条件不满足时，原积分可能发散，此时围道算出的数并不等于原积分。动笔前先看条件 <Katex tex="\deg Q\ge\deg P+2" /> 或 <Katex tex="\deg Q\ge\deg P+1" />。</li>
      </ul>
    </div>
    <p>回收与预告：留数定理到此有了两条腿，一条在复平面上算回路积分，一条在实轴上算定积分，中间靠大圆弧引理和若尔当引理把补上的那段抹掉。下一章换一个方向，不再问「积分等于多少」，而是问「变换把图形保成什么形状」：解析函数在导数不为零的地方把角保持住，圆能变成什么样的曲线，这一支叫保角映射。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createResInt } from '../../../boards/complexvar/series/resint.js';
import { CY_CHAPTERS } from './cynav.js';
</script>
