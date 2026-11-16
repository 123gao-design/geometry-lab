<template>
  <ChPage :cur="5" no="D5" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="第三定义与焦点三角形" sub="斜率之积 = $\pm b^2/a^2$；焦点三角形面积 = $b^2\cdot\tan(\theta/2)$ —— 两个最常考的推论。"
    :toc="[{ id: 'd5-def', t: '第三定义与实验台（图 D5）' }, { id: 'd5-deriv', t: '第三定义的推导与逆命题' }, { id: 'd5-tri', t: '焦点三角形面积（图 D6）' }, { id: 'd5-sum', t: '五种定义一览' }]">
    <p>前四个定义都离不开"量距离"。第三定义换了角度：只看动点与两个定点连线的<strong>斜率</strong>。它常以"轨迹题"的形式出现在试卷上，本质仍是圆锥曲线。</p>
    <div class="note good" id="d5-def"><strong>第三定义</strong>：设 <Katex tex="A(-a,\ 0)" />、<Katex tex="B(a,\ 0)" /> 为两定点，动点 P 满足直线 PA 与 PB 的斜率之积为定值 <Katex tex="\lambda" />（<Katex tex="\lambda \ne 0" />）。则 <Katex tex="\lambda < 0" /> 时轨迹为<strong>椭圆</strong>（<Katex tex="\lambda = -1" /> 时恰为圆），<Katex tex="\lambda > 0" /> 时轨迹为<strong>双曲线</strong>（均需去掉 A、B 两个退化点）。当 A、B 恰为长轴（实轴）顶点时，<Katex tex="\lambda = -b^2/a^2" />（椭圆）、<Katex tex="\lambda = +b^2/a^2" />（双曲线）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createThirdDef" />
      <div class="cap">图 D5 · <b>第三定义实验台</b>：拖动 P，绿线 <Katex tex="k(PA)" /> 与紫线 <Katex tex="k(PB)" /> 各自变动，乘积却固定为 <Katex tex="-b^2/a^2" />（椭圆）或 <Katex tex="+b^2/a^2" />（双曲线，可切换）。把椭圆调成 <Katex tex="a = b" />（圆），乘积恰为 <Katex tex="-1" /> —— 那是"直径所对圆周角为直角"的斜率翻译。</div>
    </div>

    <h3 class="sec" id="d5-deriv">推导与逆命题：两个方向都成立</h3>
    <p>设 <Katex tex="P(x_0,\ y_0)" />，直接计算斜率之积：</p>
    <Katex tex="k_{PA}\cdot k_{PB}=\dfrac{y_0}{x_0+a}\cdot\dfrac{y_0}{x_0-a}=\dfrac{y_0^2}{x_0^2-a^2}" display />
    <p>若 P 在椭圆上，代入 <Katex tex="y_0^2=b^2\Big(1-\dfrac{x_0^2}{a^2}\Big)=-\dfrac{b^2}{a^2}(x_0^2-a^2)" />，得乘积 = <Katex tex="-b^2/a^2" />；双曲线用 <Katex tex="y_0^2=\dfrac{b^2}{a^2}(x_0^2-a^2)" />，得 <Katex tex="+b^2/a^2" />。<strong>逆命题</strong>同样成立：若乘积恒为 <Katex tex="\lambda" />，则 <Katex tex="y^2 = \lambda(x^2 - a^2)" />，整理得</p>
    <Katex tex="\dfrac{x^2}{a^2}-\dfrac{y^2}{\lambda a^2}=1" display />
    <p><Katex tex="\lambda < 0" /> 时分母变号成加 —— 椭圆；<Katex tex="\lambda > 0" /> —— 双曲线。所以第三定义定义的确实是同一族曲线。它与第一、第二定义的关系：<strong><Katex tex="-b^2/a^2 = e^2 - 1" /></strong>，斜率之积里藏着的仍是离心率。</p>

    <h3 class="sec" id="d5-tri">推论：焦点三角形的面积</h3>
    <p>曲线上一点 P 与两个焦点围成的 <Katex tex="\triangle PF_1F_2" /> 称为<strong>焦点三角形</strong>。设 <Katex tex="\theta = \angle F_1PF_2" />，<Katex tex="r_1 = |PF_1|" />、<Katex tex="r_2 = |PF_2|" />。对椭圆用余弦定理与 <Katex tex="r_1 + r_2 = 2a" />：</p>
    <Katex tex="4c^2=r_1^2+r_2^2-2r_1r_2\cos\theta=(r_1+r_2)^2-2r_1r_2(1+\cos\theta)=4a^2-2r_1r_2(1+\cos\theta)" display />
    <p>移项即用掉全部已知：<Katex tex="r_1r_2=\dfrac{2b^2}{1+\cos\theta}" />，于是面积</p>
    <Katex tex="S=\dfrac12 r_1r_2\sin\theta=b^2\cdot\dfrac{\sin\theta}{1+\cos\theta}=b^2\tan\dfrac{\theta}{2}" display />
    <p>双曲线版本把 <Katex tex="(r_1 + r_2)^2" /> 换成 <Katex tex="(r_1 - r_2)^2" />，得 <Katex tex="r_1r_2 = 2b^2/(1 - \cos\theta)" />，于是 <Katex tex="S = b^2\cdot\cot(\theta/2)" />。整个推导只有余弦定理与半角公式，漂亮得像一道例题 —— 它确实常考。</p>
    <div class="board-wrap">
      <BoardMount :factory="createFocusTri" />
      <div class="cap">图 D6 · <b>焦点三角形实验台</b>：拖动 P，阴影三角形的形状与张角 θ 时刻在变，而"S 实测"与"公式值"两栏始终吻合（相对误差读数为证）。可切换双曲线模式验证 cot 版本。把 P 拖到长轴端点附近：θ → 0，面积 → 0，公式依然成立。</div>
    </div>

    <h3 class="sec" id="d5-sum">五种定义一览：同族曲线的五种刻画</h3>
    <table>
      <tbody>
        <tr><th>定义</th><th>条件</th><th>椭圆</th><th>双曲线</th><th>抛物线</th></tr>
        <tr><td>第一定义</td><td>两焦点距离之和 / 之差</td><td><Katex tex="|PF_1|+|PF_2| = 2a" /></td><td><Katex tex="\bigl||PF_1|-|PF_2|\bigr| = 2a" /></td><td>—</td></tr>
        <tr><td>第二定义</td><td>焦点准线距离之比 e</td><td><Katex tex="e < 1" /></td><td><Katex tex="e > 1" /></td><td><Katex tex="e = 1" /></td></tr>
        <tr><td>第三定义</td><td>过两顶点斜率之积 λ</td><td><Katex tex="\lambda = -b^2/a^2" /></td><td><Katex tex="\lambda = +b^2/a^2" /></td><td>—</td></tr>
        <tr><td>标准方程</td><td>建系后的代数形</td><td><Katex tex="x^2/a^2 + y^2/b^2 = 1" /></td><td><Katex tex="x^2/a^2 - y^2/b^2 = 1" /></td><td><Katex tex="y^2 = 2px" /></td></tr>
        <tr><td>焦点三角形</td><td>S 与 <Katex tex="\theta = \angle F_1PF_2" /></td><td><Katex tex="S = b^2\cdot\tan(\theta/2)" /></td><td><Katex tex="S = b^2\cdot\cot(\theta/2)" /></td><td>—</td></tr>
      </tbody>
    </table>
    <p>五种刻画指向同族曲线，这正是"数形结合"的深意：<strong>解题时选最合适的那个定义</strong>。距离和差找第一定义，比值问题找第二定义，斜率条件找第三定义，面积与角度找焦点三角形。本专题的子专题一（极点极线）则展示了第六种刻画 —— 射影几何视角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createThirdDef } from '../../../boards/conics/definitions/thirddef.js';
import { createBoard as createFocusTri } from '../../../boards/conics/definitions/focustri.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
