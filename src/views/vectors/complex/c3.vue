<template>
  <ChPage :cur="3" no="复3" base="/vectors/c" :chapters="VC_CHAPTERS"
    title="复数的模与共轭"
    sub="模把复数压成一个非负实数，共轭把点翻过实轴。这两个工具配合，能把许多复数问题改写成实数的等式：乘积的模等于模的乘积，复数乘它的共轭得模的平方，共轭对加减乘除都保持原运算。"
    :toc="[{ id: 'c3-mod', t: '模的性质' }, { id: 'c3-conj', t: '共轭的性质' }, { id: 'c3-dist', t: '模的几何意义' }, { id: 'c3-pit', t: '模与平方、三角不等式' }]">
    <div class="note good">复数 <Katex tex="z=a+b\mathrm{i}" /> 的模是 <Katex tex="|z|=\sqrt{a^2+b^2}" />，共轭是 <Katex tex="\bar z=a-b\mathrm{i}" />。两者之间最基本的一条是 <Katex tex="z\bar z=a^2+b^2=|z|^2" />：一个复数乘它的共轭，虚部抵消，得到的正是模的平方。所有模的化简都可以从这条出发。</div>
    <div class="board-wrap">
      <BoardMount :factory="createComplexIdent" />
      <div class="cap">图 复3 · <b>模与共轭的性质</b>：金色箭头是 <Katex tex="z_1z_2" />，紫色虚线是它的共轭（把金点翻过实轴），绿色圆环是先各自共轭再相乘得到的 <Katex tex="\bar z_1\bar z_2" />。看点：① 档取一对共轭复数相乘，积的虚部为零，紫箭头与金箭头重合落在实轴上；② 档乘 <Katex tex="\mathrm{i}" />，积转到虚轴正方向；③ 档两支都随意拖，绿环始终扣在紫箭头的终点上。</div>
    </div>

    <h3 class="sec" id="c3-mod">模的性质</h3>
    <p>模是复数到原点的距离，因此乘法对应长度相乘：</p>
    <p style="text-align:center"><Katex tex="|z_1z_2|=|z_1||z_2|,\qquad \left|\frac{z_1}{z_2}\right|=\frac{|z_1|}{|z_2|}\ (z_2\ne0),\qquad |z^n|=|z|^n." /></p>
    <p>这三条都可以用三角形式或直接平方来证：把 <Katex tex="|z_1z_2|^2=(z_1z_2)(\overline{z_1z_2})" /> 展开，再用共轭保持乘法，立刻回到 <Katex tex="|z_1|^2|z_2|^2" />。图 复3 的第三枚徽章就是把左右两边分别算出数值对照。</p>
    <p>模的平方写成 <Katex tex="|z|^2=z\bar z" /> 有时比开根号方便，尤其是要判断一个复数是不是实数、或者证明两条模相等的时候。</p>

    <h3 class="sec" id="c3-conj">共轭的性质</h3>
    <p>共轭与四则运算可以交换顺序：</p>
    <p style="text-align:center"><Katex tex="\overline{z_1\pm z_2}=\bar z_1\pm\bar z_2,\qquad \overline{z_1z_2}=\bar z_1\bar z_2,\qquad \overline{\left(\frac{z_1}{z_2}\right)}=\frac{\bar z_1}{\bar z_2}." /></p>
    <p>最后一条只要求 <Katex tex="z_2\ne0" />。图 复3 把第二条画了出来：金色箭头翻过实轴得到紫箭头，先共轭再相乘得到绿环，两者同一点。这一条在证明乘积的模时要用到。</p>
    <p>由共轭还能把实部与虚部单独取出来：<Katex tex="\operatorname{Re}z=\dfrac{z+\bar z}{2}" />，<Katex tex="\operatorname{Im}z=\dfrac{z-\bar z}{2\mathrm{i}}" />。两式都利用了虚部在相加时抵消、在相减时留下。<Katex tex="z" /> 是实数的判据因此可以写成 <Katex tex="z=\bar z" />，纯虚数则是 <Katex tex="z+\bar z=0" /> 且 <Katex tex="z\ne0" />。</p>

    <h3 class="sec" id="c3-dist">模的几何意义</h3>
    <p><Katex tex="|z_1-z_2|" /> 是复平面上两点 <Katex tex="Z_1" />、<Katex tex="Z_2" /> 之间的距离，与向量的差向量长度一致。于是方程 <Katex tex="|z-z_0|=r" /> 表示以 <Katex tex="z_0" /> 为圆心、<Katex tex="r" /> 为半径的圆；<Katex tex="|z-z_1|=|z-z_2|" /> 表示到两点等距的点集，即线段 <Katex tex="Z_1Z_2" /> 的垂直平分线。</p>
    <p>这类轨迹题不必设 <Katex tex="z=x+y\mathrm{i}" /> 硬算，先把模的式子翻译成距离，再按几何意义写答案，通常一步到位。要验证时再把 <Katex tex="z=x+y\mathrm{i}" /> 代进去，两边平方消去根号即可。</p>

    <h3 class="sec" id="c3-pit">模与平方、三角不等式</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="|z|^2\ne z^2" />。</strong>左边是非负实数，右边仍是复数。例如 <Katex tex="z=1+\mathrm{i}" /> 时 <Katex tex="|z|^2=2" />，而 <Katex tex="z^2=2\mathrm{i}" />。凡是写 <Katex tex="z^2" /> 的地方都不能随手换成 <Katex tex="|z|^2" />。</li>
        <li><strong>提示二：模不能直接相加。</strong><Katex tex="|z_1+z_2|\le|z_1|+|z_2|" />，等号只在两支同向时成立。图 复2 的加法档可以核对：两支成角时金色对角线比两条邻边之短。减法一侧同理，<Katex tex="|z_1-z_2|\ge\big||z_1|-|z_2|\big|" />。</li>
        <li><strong>提示三：共轭要作用到每一项。</strong><Katex tex="\overline{z_1+z_2}" /> 是 <Katex tex="\bar z_1+\bar z_2" />，不是 <Katex tex="z_1+\bar z_2" />。式子里有几项就翻几项，系数是实数不用翻。</li>
        <li><strong>提示四：<Katex tex="z\bar z" /> 必为实数，<Katex tex="\bar z^2" /> 不一定。</strong>前者虚部严格抵消，后者只是一般的复数平方。判断一个式子是否为实数，先看能不能整理成 <Katex tex="z\bar z" /> 或 <Katex tex="w+\bar w" /> 的形状。</li>
      </ul>
    </div>
    <p>回收与预告：复1 给出复平面与共轭的图形，复2 给出四则运算，这一页把模与共轭的性质收拢成一组等式。子专题五到此收尾。下一子专题换成三角形式：把 <Katex tex="z=r(\cos\theta+\mathrm{i}\sin\theta)" /> 写出来后，乘法就是模相乘、角相加，欧拉公式 <Katex tex="\mathrm{e}^{\mathrm{i}\theta}=\cos\theta+\mathrm{i}\sin\theta" /> 再把这条规则压成一个指数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createComplexIdent } from '../../../boards/vectors/complex/complexident.js';
import { VC_CHAPTERS } from './vcnav.js';
</script>
