<template>
  <ChPage :cur="6" no="A6" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="一般二次方程：移轴、转轴与分类" sub="任意 $Ax^2+Bxy+Cy^2+Dx+Ey+F=0$ 都是圆锥曲线（或其退化）—— 三步考古把它挖回标准形：$B^2-4AC$ 定类型、一阶偏导找中心移轴、$\tan 2\theta=B/(A-C)$ 转轴消交叉项。新系数就是特征值，A5 的对勾函数在这里直接核验。"
    :toc="[{ id: 'a6-lab', t: '化简全流程（图 A6）' }, { id: 'a6-type', t: '第一步 · $B^2-4AC$ 定类型' }, { id: 'a6-move', t: '移轴与转轴 · 消一次项与交叉项' }, { id: 'a6-std', t: '标准形 · e 的统一公式与核验' }]">
    <div class="note good"><strong>本讲主角</strong>：一般二次曲线 <Katex tex="Ax^2+Bxy+Cy^2+Dx+Ey+F=0" />（<Katex tex="A,B,C" /> 不全为零）。三步考古步骤：<strong>①</strong> <Katex tex="B^2-4AC" /> 的符号定类型（旋转、平移都不改它）；<strong>②</strong> 若 <Katex tex="4AC-B^2\ne0" />（有心曲线），解一阶条件找中心、移轴消一次项；<strong>③</strong> 取 <Katex tex="\tan 2\theta=\tfrac{B}{A-C}" /> 转轴消交叉项，新系数即特征值 <Katex tex="\lambda_\pm=\tfrac{(A+C)\pm\sqrt{(A-C)^2+B^2}}2" />。抛物型（<Katex tex="4AC-B^2=0" />）没有中心，步骤对调：先转轴、再配方。</div>

    <h3 class="sec" id="a6-lab">化简全流程</h3>
    <div class="board-wrap">
      <BoardMount :factory="createQuadDig" />
      <div class="cap">图 A6 · <b>一般二次方程的化简</b>：滑六个系数看曲线形态改变，读数区把三个步骤全部列出 —— 类型 → 中心 → 特征值 → 标准形（e 与焦点自动给出）。预设按钮一键回到典型曲线：按下「对勾」，读数区给出 <strong><Katex tex="e\approx 1.082" /></strong>、转轴角 <Katex tex="67.5^\circ" />、半轴 2.20 与 0.91 —— 与 A5 的 <Katex tex="\sec(\psi/2)" /> 一字不差。</div>
    </div>

    <h3 class="sec" id="a6-type">第一步：<Katex tex="B^2-4AC" /> 定类型</h3>
    <p>把坐标旋转任意角、平移任意量，<Katex tex="B^2-4AC" /> 的符号纹丝不动（它是不变量 <Katex tex="4AC-B^2" /> 的反号；A4/A5 早已反复使用这一结论：<strong>二次部分决定渐近线方向</strong>）。于是曲线在动笔之前就已分类：</p>
    <p><Katex tex="B^2-4AC&lt;0" /> 椭圆型（含虚椭圆与一点）；<Katex tex="B^2-4AC=0" /> 抛物型（含平行直线对）；<Katex tex="B^2-4AC&gt;0" /> 双曲型（含两条相交直线）。</p>
    <table>
      <tbody>
        <tr><th>判别</th><th>类型</th><th>典型成员</th><th>退化成员</th></tr>
        <tr><td><Katex tex="B^2-4AC&lt;0" /></td><td>椭圆型</td><td>椭圆、圆</td><td>一点、虚椭圆（无实轨迹）</td></tr>
        <tr><td><Katex tex="B^2-4AC=0" /></td><td>抛物型</td><td>抛物线</td><td>平行直线对、重合直线</td></tr>
        <tr><td><Katex tex="B^2-4AC&gt;0" /></td><td>双曲型</td><td>双曲线</td><td>两条相交直线（K=0 时的渐近线本身）</td></tr>
      </tbody>
    </table>

    <h3 class="sec" id="a6-move">移轴与转轴：消一次项与交叉项</h3>
    <p><strong>移轴（有心时）</strong>：标准形里没有一次项 —— 所以中心就是一次项的「平衡点」，即一阶偏导为零处。解线性方程组</p>
    <Katex tex="2Au_0+Bv_0=-D,\qquad Bu_0+2Cv_0=-E" display />
    <p>（系数行列式 <Katex tex="4AC-B^2" /> 恰是类型判别！非零才有唯一中心。）移轴 <Katex tex="u=\tilde u+u_0" />、<Katex tex="v=\tilde v+v_0" /> 后，一次项消失，常数项变为 <Katex tex="K=-f(u_0,v_0)" />，方程瘦成 <Katex tex="A\tilde u^2+B\tilde u\tilde v+C\tilde v^2=K" />。</p>
    <p><strong>转轴</strong>：令 <Katex tex="u=u'\cos\theta-v'\sin\theta" />、<Katex tex="v=u'\sin\theta+v'\cos\theta" />，展开后交叉项系数是 <Katex tex="(C-A)\sin2\theta+B\cos2\theta" /> —— 归零即得 <strong><Katex tex="\tan 2\theta=\tfrac{B}{A-C}" /></strong>。而此时 <Katex tex="u'^2" /> 的新系数是</p>
    <Katex tex="A\cos^2\theta+B\sin\theta\cos\theta+C\sin^2\theta=\frac{A+C}2+\frac{(A-C)\cos2\theta+B\sin2\theta}2=\frac{(A+C)+\sqrt{(A-C)^2+B^2}}2=\lambda_+" display />
    <p><Katex tex="v'^2" /> 的系数同理是 <Katex tex="\lambda_-=\tfrac{(A+C)-\sqrt{(A-C)^2+B^2}}2" />。<strong>转轴后的系数根本不用代入展开 —— 就是特征值</strong>；且 <Katex tex="\lambda_+\lambda_-=AC-\tfrac{B^2}4=\tfrac{4AC-B^2}4" />，又一次认出类型判别。抛物型的步骤对调：<Katex tex="4AC-B^2=0" /> 时先转轴（一个特征值为零），剩下的 <Katex tex="\lambda u'^2" /> 加线性项沿轴配方，即得 <Katex tex="v''^2=2\tilde p\,u''" /> 型抛物线。</p>

    <h3 class="sec" id="a6-std">标准形：e 的统一公式与核验</h3>
    <p>移轴 + 转轴后方程只剩 <Katex tex="\lambda_1u'^2+\lambda_2v'^2=K" />，四类判定如下：</p>
    <table>
      <tbody>
        <tr><th>条件</th><th>身份</th><th>半轴</th><th>离心率</th></tr>
        <tr><td><Katex tex="\lambda_1\lambda_2&gt;0" />，K 与 λ 同号</td><td>椭圆</td><td><Katex tex="a^2=\max\big(\tfrac K{\lambda_1},\ \tfrac K{\lambda_2}\big)" />，<Katex tex="b^2=\min(\cdot)" /></td><td><Katex tex="e=\sqrt{1-\tfrac{b^2}{a^2}}\in(0,1)" /></td></tr>
        <tr><td><Katex tex="\lambda_1\lambda_2&lt;0" />，K≠0</td><td>双曲线</td><td><Katex tex="a^2=\tfrac{K}{\lambda_1}" />（λ₁ 取与 K 同号者），<Katex tex="b^2=-\tfrac{K}{\lambda_2}" /></td><td><Katex tex="e=\sqrt{1-\tfrac{\lambda_1}{\lambda_2}}&gt;1" /></td></tr>
        <tr><td><Katex tex="K=0" /></td><td>退化</td><td colspan="2">过中心的一对相交直线（渐近线自己）</td></tr>
        <tr><td><Katex tex="\lambda_1\lambda_2&gt;0" />，K 与 λ 异号</td><td>虚椭圆</td><td colspan="2">实平面无轨迹 —— 代数结论不变（L3 内点极线的对应情形）</td></tr>
      </tbody>
    </table>
    <p><strong>核验：A5 的对勾函数</strong> <Katex tex="y=x+\tfrac1x" />，即 <Katex tex="-x^2+xy=1" />（A=−1, B=1, C=0, F=−1）：</p>
    <Katex tex="\lambda_\pm=\frac{-1\pm\sqrt2}2=0.207\ /\ -1.207,\qquad K=1" display />
    <p>双曲型：<Katex tex="\text{实半轴}^2=\tfrac1{0.207}=4.83" />（<Katex tex="a\approx 2.20" />），<Katex tex="\text{共轭半轴}^2=\tfrac1{1.207}=0.83" />（<Katex tex="b\approx 0.91" />），转轴角 <Katex tex="\theta=\tfrac12\arctan\tfrac{1}{-1}=67.5^\circ" /> —— 与 A5 算出的 <Katex tex="A=\sqrt{2(\sqrt2+1)}\approx2.20" />、<Katex tex="B=\sqrt{2(\sqrt2-1)}\approx0.91" />、实轴方向 <Katex tex="\beta=67.5^\circ" /> <strong>逐项吻合</strong>；离心率两种算法结果一致：</p>
    <Katex tex="\sqrt{1-\frac{\lambda_1}{\lambda_2}}=\sqrt{1+\frac{0.207}{1.207}}=\sqrt{1.1716}\approx1.082=\sqrt{4-2\sqrt2}=\sec\frac{45^\circ}{2}" display />
    <p><strong>回收</strong>：A4（xy=k 旋转 45° 就是本步骤的招牌特例）、A5（对勾函数的核验表）、L3/L4（二次部分定渐近线、K=0 退化成员 = 渐近线本身）、T1（切线速查表的「偏导方法」正是一阶条件的又一用法）、D4（e 的谱系在此有了第三个统一公式）。仿射家族至此集齐：<strong>伸缩 A1 → 旋转 A4 → 剪切 A5 → 一般化 A6</strong> —— 任何二次曲线，都能由标准形经这一族变换得到。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuadDig } from '../../../boards/conics/affine/quaddig.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
