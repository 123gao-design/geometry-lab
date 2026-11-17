<template>
  <ChPage :cur="2" no="级2" base="/complexvar/s" :chapters="CY_CHAPTERS"
    title="洛朗级数与孤立奇点"
    sub="环带里有一个洞，正幂项展不开它。把负幂也收进来，函数在环带内仍然能被系数唯一地表示，而负幂的那一截——主部——恰好描述奇点附近的全部行为。奇点分三类，就看主部有几项。"
    :toc="[{ id: 's2-lau', t: '环域上的洛朗级数' }, { id: 's2-main', t: '主部与三类奇点' }, { id: 's2-ex', t: '三个例子的对照' }, { id: 's2-zero', t: '零点与极点的阶' }, { id: 's2-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在环域 <Katex tex="r<|z-z_0|<R" /> 内解析，则在此环域内 <Katex tex="f(z)=\sum_{n=-\infty}^{\infty}a_n(z-z_0)^n" />，其中 <Katex tex="a_n=\dfrac1{2\pi i}\oint_C\dfrac{f(z)}{(z-z_0)^{n+1}}\,dz" />，<Katex tex="C" /> 是环内绕 <Katex tex="z_0" /> 一圈的任一条逆时针闭曲线。系数由函数唯一决定，展开式由此唯一。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLaurent" />
      <div class="cap">图 级2 · <b>洛朗级数与孤立奇点</b>：左图金色环带是能展开的区域，红点是奇点，点 <Katex tex="z" /> 可拖；右图是洛朗系数 <Katex tex="a_n" /> 的条形图（纵轴取对数刻度），金色条是负幂项、青色条是非负幂项。看点：① <Katex tex="\dfrac1{z(1-z)}" /> 只有 <Katex tex="a_{-1}=1" /> 一根金色条，一阶极点；② <Katex tex="e^{1/z}" /> 的金色条一直排下去不归零，本性奇点；③ <Katex tex="\dfrac{\sin z}{z}" /> 一根金色条也没有，奇点可去。</div>
    </div>

    <h3 class="sec" id="s2-lau">环域上的洛朗级数</h3>
    <p>把上一章的泰勒定理挪到环域上。圆盘内处处解析，环域里则有内外两个边界，内边界可能藏着一个奇点。仍然以 <Katex tex="z_0" /> 为心，取环内一条圆路 <Katex tex="C" />，把柯西积分公式里的 <Katex tex="\dfrac1{z-\zeta}" /> 按 <Katex tex="|\zeta-z_0|<|z-z_0|" /> 与 <Katex tex="|\zeta-z_0|>|z-z_0|" /> 两种情形分别展成几何级数，逐项积分就得到两边都带幂次的展开式。</p>
    <p>与泰勒级数相比，系数公式里多了一个 <Katex tex="n=-1,-2,\dots" /> 的分支。这是必要的：环内那圈积分不再为零，负幂项恰好承担了内边界上的贡献。</p>
    <p>收敛区域由最近的奇点夹出来。若 <Katex tex="z_0" /> 是奇点，则内半径 <Katex tex="r=0" />，区域是一个去心圆盘；若内侧没有奇点，展开在整个平面上成立（除了无穷远）。环带本身也有讲究：同一个函数在不同的环域里，洛朗展开不同。</p>
    <p>唯一性同样成立，理由与泰勒级数一模一样：两边乘以 <Katex tex="(z-z_0)^{-k-1}" /> 再沿 <Katex tex="C" /> 积分，除 <Katex tex="a_k" /> 之外的项全为零。所以又可以把级数当成代数对象来算。</p>

    <h3 class="sec" id="s2-main">主部与三类奇点</h3>
    <p>洛朗展开分两截：负幂项 <Katex tex="\sum_{n<0}a_n(z-z_0)^n" /> 叫<b>主部</b>，非负幂项叫解析部分。奇点处的行为完全由主部决定，按主部的项数分三类。</p>
    <p><b>可去奇点</b>：主部为零，展开里没有负幂。<Katex tex="f" /> 在 <Katex tex="z_0" /> 附近有界，补上 <Katex tex="f(z_0)=a_0" /> 就变成解析函数。<Katex tex="\dfrac{\sin z}{z}" /> 是标准例子。</p>
    <p><b>极点</b>：主部有限项，且最低次幂是 <Katex tex="(z-z_0)^{-m}" />（<Katex tex="m\ge1" />），叫 <Katex tex="m" /> 阶极点。此时 <Katex tex="|f(z)|\to\infty" />（<Katex tex="z\to z_0" />）。<Katex tex="\dfrac1{z(1-z)}" /> 只有 <Katex tex="\dfrac1z" /> 一项，一阶极点。</p>
    <p><b>本性奇点</b>：主部有无限多项。此时极限既不是有限值也不是无穷大，函数在奇点任意小的邻域内取遍整个复平面除至多一点（皮卡定理）。<Katex tex="e^{1/z}" /> 在原点就是这样：沿正实轴取 <Katex tex="z=x\to0^+" /> 得 <Katex tex="+\infty" />，沿负实轴得 <Katex tex="0" />，两条路径给出两种结局。</p>
    <p>三条判据可以倒过来用：邻域内有界则可去，模趋于无穷则是极点，两者都不是就是本性奇点。做题时先看这几个特征，比逐项算系数省事得多。</p>

    <h3 class="sec" id="s2-ex">三个例子的对照</h3>
    <p><Katex tex="f(z)=\dfrac1{z(1-z)}=\dfrac1z+z^0+z^1+z^2+\cdots" />，环域 <Katex tex="0<|z|<1" />。奇点在 <Katex tex="0" /> 与 <Katex tex="1" />，内半径 <Katex tex="0" />、外半径 <Katex tex="1" />。主部一项，一阶极点。若换到环域 <Katex tex="1<|z|<\infty" />，展开式变成另一串：<Katex tex="-\dfrac1{z^2}-\dfrac1{z^3}-\cdots" />，主部反而无穷多。</p>
    <p><Katex tex="f(z)=e^{1/z}=\sum_{k=0}^{\infty}\dfrac1{k!\,z^k}" />，环域 <Katex tex="0<|z|<\infty" />。所有负幂项都在，非负幂项只有常数 <Katex tex="1" />。本性奇点。</p>
    <p><Katex tex="f(z)=\dfrac{\sin z}{z}=1-\dfrac{z^2}{3!}+\dfrac{z^4}{5!}-\cdots" />，环域 <Katex tex="0<|z|<\infty" />。只有正幂，负幂一个也没有。可去奇点，补上 <Katex tex="f(0)=1" /> 之后就是整函数。</p>
    <p>画板上把同一个函数的两族条形图并列，主部的长短一目了然：一根条、无穷根条、零根条，三类奇点的区别就在这里。</p>

    <h3 class="sec" id="s2-zero">零点与极点的阶</h3>
    <p>零点与极点是一对对偶概念。若 <Katex tex="g" /> 在 <Katex tex="z_0" /> 解析且 <Katex tex="g(z_0)=0" />，但 <Katex tex="g" /> 不恒为零，则 <Katex tex="g" /> 的泰勒展开从某个 <Katex tex="m\ge1" /> 次幂开始：<Katex tex="g(z)=(z-z_0)^m\varphi(z)" />，<Katex tex="\varphi(z_0)\ne0" />。这个 <Katex tex="m" /> 叫零点的<b>阶</b>。</p>
    <p>把零点放到分母上，阶数就转成极点的阶：若 <Katex tex="f=\dfrac{g}{h}" />，<Katex tex="h" /> 在 <Katex tex="z_0" /> 有 <Katex tex="m" /> 阶零点而 <Katex tex="g(z_0)\ne0" />，则 <Katex tex="f" /> 在 <Katex tex="z_0" /> 有 <Katex tex="m" /> 阶极点。分子分母都有零点时先约分，看约过之后剩几阶。</p>
    <p>因此判断极点常走这条捷径：找分母的零点并数阶，再检查分子是否也在那里取零。比展开系数快，也少出错。</p>
    <p>孤立奇点的「孤立」两字也要记住：附近除这一点之外处处解析。若奇点不是孤立的，例如有无穷多个奇点聚集在有限位置，洛朗定理的前提就不成立，展开无从谈起。</p>

    <h3 class="sec" id="s2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：环域不同，展开不同。</strong>同一个 <Katex tex="\dfrac1{z(1-z)}" /> 在 <Katex tex="0<|z|<1" /> 与 <Katex tex="1<|z|<\infty" /> 里是两个完全不同的级数。写之前先看清 <Katex tex="|z|" /> 的范围。</li>
        <li><strong>提示二：主部只看负幂，不看系数大小。</strong>本性奇点的判据是项数无限，与系数衰减多快无关。<Katex tex="e^{1/z}" /> 的高次负幂系数小得可以忽略，可它仍然是本性奇点。</li>
        <li><strong>提示三：可去奇点也能「补成」解析点。</strong>补上函数值之后奇点消失，后面的留数与积分就不该再计入它。</li>
        <li><strong>提示四：先约分再判阶。</strong>分子分母同有零点时，原始次数会误导。<Katex tex="\dfrac{z^2-1}{z-1}" /> 看着是一阶极点，约分后是处处解析的 <Katex tex="z+1" />。</li>
      </ul>
    </div>
    <p>回收与预告：洛朗展开里 <Katex tex="a_{-1}" /> 这一项特殊，它在沿闭路积分时留下唯一不被消掉的一份。把这个系数单独取个名字——留数，闭路积分就只剩它说了算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLaurent } from '../../../boards/complexvar/series/laurent.js';
import { CY_CHAPTERS } from './cynav.js';
</script>
