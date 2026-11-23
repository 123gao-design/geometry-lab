<template>
  <ChPage :cur="5" no="L5" base="/conics/lin" :chapters="LIN_CHAPTERS"
    title="定点 · 定值 · 最值：大题三宝" sub="解析几何大题的完结题型，全部建立在同一条流程上：设线 → 联立 → 韦达 → 把目标式对称化。本讲把三宝各自的判定依据拆开 —— 定点看「参数无关」，定值看「对偶阅读」，最值看「目标 + 约束」。"
    :toc="[{ id: 'l5-lab', t: '定点问题（图 L5）' }, { id: 'l5-fix', t: '定点 · 完整解法' }, { id: 'l5-const', t: '定值 · 对偶阅读' }, { id: 'l5-min', t: '最值 · 三条方法' }]">
    <div class="note good"><strong>本讲主角</strong>：弦 <strong>AB</strong> 过定点问题。顶点视角最经典的版本：椭圆上两点 A、B 满足 <Katex tex="k_{VA}\cdot k_{VB}=K" />（V 为右顶点，K 为定值），则弦 <strong>AB</strong> 恒过 <strong>x 轴上一个定点</strong> —— 且定点坐标有闭式 <Katex tex="t=a\cdot\tfrac{K'+1}{K'-1}" />（<Katex tex="K'=K\tfrac{a^2}{b^2}" />）。斜率积换一个值，定点就在 x 轴上挪一个位置：从左顶点、中心（直径）到右焦点，一条 K 轴串起三种身份。</div>

    <h3 class="sec" id="l5-lab">定点问题</h3>
    <div class="board-wrap">
      <BoardMount :factory="createFixedPt" />
      <div class="cap">图 L5 · <b>定点与定值</b>：橙色弦绕椭圆转（「扫弦」或拖 u），但所有弦都过金色定点 T，理论与实测读数同步变绿。滑 K：<strong>定点沿 x 轴滑过左顶点（<Katex tex="K\to 0^-" />）、中心（<Katex tex="K=-\tfrac{b^2}{a^2}" />，弦全是直径）、右焦点（<Katex tex="K=K^*" />）</strong>，右下角标签实时显示。</div>
    </div>

    <h3 class="sec" id="l5-fix">定点：完整解法</h3>
    <p><strong>设线</strong>：把弦写成 <Katex tex="x=my+t" />（过点 <Katex tex="(t,\ 0)" />；m=1/k，竖直线由 m=0 自动覆盖 —— L2 的免退化技巧）。代入 <Katex tex="\tfrac{x^2}{a^2}+\tfrac{y^2}{b^2}=1" />：</p>
    <Katex tex="(b^2m^2+a^2)\,y^2+2b^2mt\,y+b^2(t^2-a^2)=0" display />
    <p><strong>韦达</strong>（记 <Katex tex="D_0=b^2m^2+a^2" />）：</p>
    <Katex tex="y_1+y_2=-\frac{2b^2mt}{D_0},\qquad y_1y_2=\frac{b^2(t^2-a^2)}{D_0}" display />
    <p><strong>翻译约束</strong>：顶点 <Katex tex="V=(a,0)" /> 出发的斜率 <Katex tex="k_i=\tfrac{y_i}{x_i-a}=\tfrac{y_i}{my_i+t-a}" />，于是</p>
    <Katex tex="k_1k_2=\frac{y_1y_2}{m^2y_1y_2+m(t-a)(y_1+y_2)+(t-a)^2}" display />
    <p>分母三项全部韦达化，通分后的 <Katex tex="D_0" /> 与交叉项双双对消，只剩</p>
    <Katex tex="k_1k_2=\frac{b^2(t^2-a^2)}{a^2(t-a)^2}=\frac{b^2}{a^2}\cdot\frac{t+a}{t-a}" display />
    <p><strong>定点判定</strong>：右端与 m 无关 —— 只要斜率积 <Katex tex="K" /> 给定，<Katex tex="t=a\tfrac{K'+1}{K'-1}" /> 就被唯一确定：<strong>弦恒过定点 <Katex tex="(t,\ 0)" /></strong>，且判别式 <Katex tex="\Delta&gt;0" />（弦存在）已由画板里每条实弦验证。</p>
    <p>三个刻度点对应关系：<Katex tex="K=0\Rightarrow t=-a" />（左顶点）；<Katex tex="K=-\tfrac{b^2}{a^2}\Rightarrow t=0" />（<strong>直径</strong> —— D5 第三定义的顶点版）；<Katex tex="K^*=-\tfrac{b^2}{a^2}\cdot\tfrac{1+e}{1-e}\Rightarrow t=c" />（<strong>右焦点</strong> —— 焦点弦家族的判定条件）。</p>
    <div class="note">离心角速推（P1 回收）：顶点到 <Katex tex="(a\cos\alpha,\ b\sin\alpha)" /> 的斜率是 <Katex tex="-\tfrac ba\cot\tfrac\alpha2" />，故约束即 <Katex tex="\cot\tfrac\alpha2\cot\tfrac\beta2=K'" />；而弦与 x 轴交点 <Katex tex="x=a\tfrac{\cos\frac{\alpha-\beta}2}{\cos\frac{\alpha+\beta}2}=a\tfrac{\cot\frac\alpha2\cot\frac\beta2+1}{\cot\frac\alpha2\cot\frac\beta2-1}" /> —— 两行就得闭式，与韦达路线殊途同归。</div>

    <h3 class="sec" id="l5-const">定值：对偶阅读</h3>
    <p>同一个等式 <Katex tex="k_1k_2=\tfrac{b^2}{a^2}\cdot\tfrac{t+a}{t-a}" />，把「t 定 → k 积定」倒过来读就是<strong>定值题</strong>：弦 AB 恒过定点 <Katex tex="(t,0)" />，求证 <Katex tex="k_{VA}\cdot k_{VB}" /> 为定值 —— 答案 <Katex tex="\tfrac{b^2}{a^2}\cdot\tfrac{t+a}{t-a}" />。定点与定值是同一结论的两种形式：<strong>消掉的参数成了「定」，留下的参数成了「点」</strong>。另一组高频定值：焦点弦的 <Katex tex="\tfrac1{|AF|}+\tfrac1{|BF|}=\tfrac{2}{ed}" />（P4 极坐标两行直接得出）、<Katex tex="y_1y_2=-p^2" />（抛物线焦点弦，L2 韦达直出）。</p>

    <h3 class="sec" id="l5-min">最值：三条方法</h3>
    <table>
      <tbody>
        <tr><th>方法</th><th>适用场景</th><th>代表结论</th></tr>
        <tr><td><strong>① 判别式定域</strong>：目标化成 k 的二次式，用 <Katex tex="\Delta\ge 0" /> 圈出 k 的取值域，在域上求最值</td><td>弦长 / 面积最值</td><td>通径最短：L2 的 <Katex tex="L=\tfrac{2ed}{1-e^2\cos^2\theta}" /> 在 <Katex tex="\theta=90^\circ" /> 取最小（P3）</td></tr>
        <tr><td><strong>② 三角有界</strong>：点参数化 <Katex tex="(a\cos\varphi,\ b\sin\varphi)" />，目标变 <Katex tex="A\cos\varphi+B\sin\varphi" /></td><td>焦半径、距离类</td><td><Katex tex="a-c\le|PF|\le a+c" />（顶点处取到，D1 焦半径 <Katex tex="r=a\pm ex" />）</td></tr>
        <tr><td><strong>③ 仿射降维</strong>：圆里先算，再压缩平移</td><td>面积、比例类</td><td>内接矩形最大 <Katex tex="2ab" />、内接三角形最大 <Katex tex="\tfrac{3\sqrt3}{4}ab" />（A3 割圆术直接批发）</td></tr>
      </tbody>
    </table>
    <p>方法之间常有「先 ① 后 ②」的衔接：设线联立得到 <Katex tex="L(k)" /> 后，先由 <Katex tex="\Delta\ge0" /> 求 k 的可行域，再在域上做二次式最值 —— 两个工具都来自本子专题的前几讲。</p>
    <p><strong>回收</strong>：L2 韦达与弦长（分母对消那一步就是本讲推导的核心）、L1 判别式（可行域的判据）、L4 曲线系（「恒过定点」的代数原形：<Katex tex="\varphi+k\psi=0" /> 两线找公共零点）、D5 第三定义（<Katex tex="K=-\tfrac{b^2}{a^2}" /> 的直径行）、P4 极坐标（焦点弦定值一步到位）、A3 割圆术（最值方法 ③ 的来源）。子专题五至此收线：判别式判定位置、韦达给出读数、点位确定身份、曲线系给出定点、三宝完成收束。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFixedPt } from '../../../boards/conics/lines/fixedpt.js';
import { LIN_CHAPTERS } from './linnav.js';
</script>
