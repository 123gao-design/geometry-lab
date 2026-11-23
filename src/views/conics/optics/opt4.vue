<template>
  <ChPage :cur="4" no="T4" base="/conics/opt" :chapters="OPT_CHAPTERS"
    title="双曲线：虚焦点与光学总结" sub="反射光的反向延长线过另一焦点 —— 仿佛从「虚焦点」发出；三种曲线的光学性质在此合流。"
    :toc="[{ id: 't4-st', t: '定理陈述与画板（图 T4）' }, { id: 't4-proof', t: '证明 · 内角平分线（与椭圆互补）' }, { id: 't4-app', t: '卡塞格林望远镜' }, { id: 't4-sum', t: '光学性质总结' }]">
    <div class="note good" id="t4-st"><strong>双曲线的光学性质</strong>：从双曲线一个焦点发出的光线，经双曲线（外凸的一侧）反射后，反射光线的<strong>反向延长线</strong>必经过另一个焦点 —— 观察者会感觉光是从那个"虚焦点"发出的。等价几何陈述：<strong>切线平分两焦半径所成角的内角</strong>（与椭圆恰好互补：那边是外角）。</div>
    <ConicFigure head="bottom" number="T4" title="双曲线反射光与虚焦点" :factory="createHypRefl"
      :legend="[['mint', '双曲线'], ['orange', '入射光'], ['green', '反射光'], ['guide', '反向延长线', 'dashed']]">
      光脉冲从近焦点射向曲面上的 P，被弹开 —— 看似射向四面八方，实则反射线的反向延长线（灰色虚线）永远穿过另一焦点。拖动 P 可换支；金色圆弧标出对切线的入射角与反射角，恒相等。
    </ConicFigure>

    <h3 class="sec" id="t4-proof">证明：切线是内角平分线</h3>
    <p>与 T2 的证明逐行平行，只是符号翻转。设 <Katex tex="P(x_0,\ y_0)" /> 在右支（<Katex tex="x_0 \ge a" />），切线 <Katex tex="\frac{xx_0}{a^2}-\frac{yy_0}{b^2}=1" /> 与 x 轴交于</p>
    <Katex tex="T=\left(\frac{a^2}{x_0},\ 0\right),\qquad 0<\frac{a^2}{x_0}<a" display />
    <p>T 落在线段 <Katex tex="F_1F_2" /> <strong>内部</strong>（椭圆时在外部 —— 位置一换，内外角就换）。右支焦半径 <Katex tex="|PF_1|=ex_0+a,\ |PF_2|=ex_0-a" />，比值：</p>
    <Katex tex="\frac{|TF_1|}{|TF_2|}=\frac{c+a^2/x_0}{c-a^2/x_0}=\frac{cx_0+a^2}{cx_0-a^2}=\frac{ex_0+a}{ex_0-a}=\frac{|PF_1|}{|PF_2|}" display />
    <p>由<strong>内角平分线定理的逆定理</strong>：PT 平分 <Katex tex="\angle F_1PF_2" /> 的内角。∎ 于是从近焦点 <Katex tex="F_2" /> 射向 P 的光，相对切线的入射角等于"背离 <Katex tex="F_1" /> 方向"的反射角 —— 反射线看似发散，延长回去却全指向虚焦点 <Katex tex="F_1" />。</p>

    <h3 class="sec" id="t4-app">应用：卡塞格林望远镜 —— 三种曲线的一次合奏</h3>
    <p>双曲线"虚焦点"最漂亮的应用是<strong>卡塞格林反射望远镜</strong>（多数现代天文望远镜的光路）：</p>
    <ul>
      <li>主镜是<strong>抛物面</strong>：遥远的星光（平行光）反射后聚向焦点 F；</li>
      <li>在光路中拦一块<strong>双曲面副镜</strong>：让它的一个焦点与主镜焦点 F 重合，光被弹向镜筒尾端的目镜 —— 仿佛从副镜的另一个焦点（虚焦点，恰是目镜位置）发出；</li>
      <li>结果：镜筒被"折叠"得很短，仪器不必悬在镜口，成像同时消除了球差。</li>
    </ul>
    <p>抛物线的聚平行光与双曲线的虚焦点配合，一台望远镜里两种光学性质协同工作 —— 数形结合不只是解题技巧，更是设计现代光学系统的语言。</p>

    <h3 class="sec" id="t4-sum">光学性质总结：三种曲线，一条定律</h3>
    <table>
      <tbody>
        <tr><th>曲线</th><th>切线平分什么</th><th>光学性质</th><th>代表应用</th></tr>
        <tr><td>椭圆</td><td>两焦半径夹角的<strong>外角</strong></td><td>焦点 → 曲面 → 另一焦点</td><td>耳语廊、激光腔、体外碎石</td></tr>
        <tr><td>抛物线</td><td>"焦点线"与"轴向平行线"的角</td><td>平行光 ↔ 焦点</td><td>卫星天线、探照灯、FAST</td></tr>
        <tr><td>双曲线</td><td>两焦半径夹角的<strong>内角</strong></td><td>反向延长线过另一焦点（虚焦点）</td><td>卡塞格林副镜</td></tr>
      </tbody>
    </table>
    <p>三种表述其实是同一句话的三种方言："<strong>入射角 = 反射角，而切线恰好平分一对由焦点定义的方向</strong>"。再往深处走一层：抛物线是"一个焦点在无穷远"的椭圆 —— 把 T2 的远焦点拖到无穷远，"射向另一焦点"的光就变成了平行光；双曲线则是焦点翻越无穷远回到实轴另一侧的版本。光学性质随 D4 的统一定义连续变形，正如离心率滑块上那三段曲线 —— 从未真正断裂过。</p>
    <p>最后作一点延伸：T1 里说过"切线 = 曲上点的极线"。于是在射影几何看来，三种光学性质其实是同一性质 —— 配极变换下的对称 —— 在三个离心率区间的三种读法。子专题六的伏笔，在这里再次回收。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHypRefl } from '../../../boards/conics/optics/hyprefl.js';
import { OPT_CHAPTERS } from './optnav.js';
</script>
