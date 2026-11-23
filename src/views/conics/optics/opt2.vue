<template>
  <ChPage :cur="2" no="T2" base="/conics/opt" :chapters="OPT_CHAPTERS"
    title="椭圆的光学性质：聚光" sub="从一个焦点射出的光，经椭圆反射后必过另一个焦点 —— 切线平分焦半径的外角。"
    :toc="[{ id: 't2-st', t: '定理陈述' }, { id: 't2-lab', t: '聚光的反射性质（图 T2）' }, { id: 't2-proof', t: '证明 · 外角平分线' }, { id: 't2-app', t: '费马原理与应用' }]">
    <div class="note good" id="t2-st"><strong>椭圆的光学性质</strong>：从椭圆一个焦点发出的光线，经椭圆反射后，必经过另一个焦点。等价的几何陈述：<strong>切线平分两焦半径所成角的外角</strong>（因而法线平分内角 <Katex tex="\angle F_1PF_2" />）。</div>

    <h3 class="sec" id="t2-lab">聚光的反射性质</h3>
    <ConicFigure head="bottom" number="T2" title="沿椭圆反射的两段光路" :factory="createEllRefl"
      :legend="[['mint', '椭圆'], ['orange', '入射光'], ['green', '反射光'], ['ink', '切线']]">
      黄色光脉冲从 <Katex tex="F_1" /> 出发，打到曲面上的 P 后折向 <Katex tex="F_2" /> —— 拖动 P，折点随便选，光路永远 <Katex tex="F_1 \to P \to F_2" />。两段金色圆弧标出入射角与反射角（都相对切线度量），读数恒相等；光程一栏始终是 <Katex tex="2a" />。
    </ConicFigure>
    <p>把这个结论倒过来看：因为无论 P 在哪，光程 <Katex tex="|F_1P| + |PF_2|" /> 都等于 <Katex tex="2a" />，光"走哪条路都一样耗时" —— 反射点便可以取遍整个椭圆。这正是下面证明的物理直觉，也是"椭圆台球桌"的规则：从一个焦点开杆的球，无论往哪打，一次反弹后必进另一个焦点。</p>

    <h3 class="sec" id="t2-proof">证明：切线是外角平分线（角平分线定理的逆定理）</h3>
    <p>设 <Katex tex="P(x_0,\ y_0)" /> 在椭圆上，切线 <Katex tex="\frac{xx_0}{a^2}+\frac{yy_0}{b^2}=1" /> 与 x 轴的交点记为 T。令 <Katex tex="y = 0" /> 解得</p>
    <Katex tex="T=\left(\frac{a^2}{x_0},\ 0\right)" display />
    <p>用 D5 已证的两个结论 —— 焦半径 <Katex tex="|PF_1|=a+ex_0,\ |PF_2|=a-ex_0" /> —— 计算比值：</p>
    <Katex tex="\frac{|TF_1|}{|TF_2|}=\frac{\;a^2/x_0+c\;}{\;a^2/x_0-c\;}=\frac{a^2+cx_0}{a^2-cx_0}=\frac{a+ex_0}{a-ex_0}=\frac{|PF_1|}{|PF_2|}" display />
    <p>（因 <Katex tex="x_0 \le a < a^2/c" />，分母 <Katex tex="a^2 - cx_0 > 0" />，绝对值可以放心去掉。）对照<strong>外角平分线定理</strong>：三角形一顶点的外角平分线分对边延长线成两条邻边之比 —— 现在 T 恰好按 <Katex tex="|PF_1| : |PF_2|" /> 分割焦连线，逆定理出手：</p>
    <div class="note good"><strong>PT 是 <Katex tex="\angle F_1PF_2" /> 的外角平分线。</strong>于是法线（垂直于切线）是内角平分线。光从 <Katex tex="F_1" /> 沿 <Katex tex="F_1P" /> 射来，相对法线的入射角等于 <Katex tex="PF_2" /> 相对法线的角 —— 反射定律把光送进 <Katex tex="F_2" />。∎</div>
    <p>注意证明的分量几乎全部由焦半径公式承担，而焦半径公式又是 D1 推导标准方程时"半路捡到的礼物"。层层回收，这就是体系化复习的含义。</p>

    <h3 class="sec" id="t2-app">费马原理与真实应用</h3>
    <p>物理视角给同一件事一个更漂亮的说法（费马原理：光走耗时取极值的路径）。椭圆上任意路径 <Katex tex="F_1 \to P \to F_2" /> 长度恒为 <Katex tex="2a" />，是"处处等时"的曲线，因此光沿曲面任何方向反射都不改变总耗时 —— 这解释了为何反射点可以任意选取。真实应用包括：</p>
    <ul>
      <li><strong>激光谐振腔</strong>：谐振腔两端反射镜做成共焦点椭球面，光在腔内无论怎样散射都被"折回"光路；</li>
      <li><strong>耳语廊</strong>：椭圆形大厅里，一个人在焦点处低语，另一个焦点处的人听得格外清楚 —— 声波同光波一样被墙面聚拢；</li>
      <li><strong>医学碎石</strong>（体外冲击波碎石）：冲击波源与结石分别置于椭球反射面的两个焦点，能量聚焦粉碎结石。</li>
    </ul>
    <p>下一讲把一个焦点拖到无穷远，椭圆的光学性质就退化成抛物线的：平行光。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEllRefl } from '../../../boards/conics/optics/ellrefl.js';
import { OPT_CHAPTERS } from './optnav.js';
</script>
