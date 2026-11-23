<template>
  <ChPage :cur="3" no="T3" base="/conics/opt" :chapters="OPT_CHAPTERS"
    title="抛物线：把平行光拧成一束" sub="平行于轴的光反射后全部汇聚于焦点 —— 卫星锅、探照灯、太阳灶的几何原理。"
    :toc="[{ id: 't3-st', t: '定理陈述与画板（图 T3）' }, { id: 't3-proof', t: '证明 · 倍角恒等式' }, { id: 't3-path', t: '为什么光程相同' }, { id: 't3-app', t: '真实应用' }]">
    <div class="note good" id="t3-st"><strong>抛物线的光学性质</strong>：平行于抛物线轴的光线，经抛物线反射后，必经过焦点；反过来，从焦点发出的光经抛物线反射后，必平行于轴射出。等价几何陈述：<strong>切线平分"焦点线 PF 与轴向平行线"的夹角</strong>。</div>
    <ConicFigure head="bottom" number="T3" title="平行光反射到焦点的等光程实验" :factory="createDishRefl"
      :legend="[['mint', '反射面'], ['orange', '入射方向'], ['green', '反射方向'], ['violet', '法线', 'dashed']]">
      拖动抛物面上的 P，比对入射和反射方向。点「发送同一波前」，看从右侧发射面的不同高度同时出发的光，怎样沿各自的折线路径到达同一焦点。
    </ConicFigure>
    <p>抛物线可以看作"一个焦点被拖到无穷远的椭圆"：固定左焦点与顶点，把右焦点拖向无穷远，从右焦点射来的光就变成了平行光。于是椭圆的"聚光于另一焦点"退化成抛物线的"聚平行光于焦点" —— 光学性质与 D4 的统一定义完全同步。</p>

    <h3 class="sec" id="t3-proof">证明：一个漂亮的倍角恒等式</h3>
    <p>设 <Katex tex="P(x_0,\ y_0)" /> 在 <Katex tex="y^2 = 2px" /> 上。由 T1 速查表，切线 <Katex tex="yy_0 = p(x + x_0)" /> 的斜率 <Katex tex="k_t=p/y_0" />。设切线与 x 轴（入射方向）的夹角为 <Katex tex="\theta" />，则 <Katex tex="\tan\theta = p/y_0" />。焦点线 PF 的斜率为：</p>
    <Katex tex="k_F=\frac{y_0}{x_0-\tfrac{p}{2}}=\frac{y_0}{\tfrac{y_0^2}{2p}-\tfrac{p}{2}}=\frac{2py_0}{y_0^2-p^2}" display />
    <p>用二倍角公式把 θ 加倍：</p>
    <Katex tex="\tan 2\theta=\frac{2\tan\theta}{1-\tan^2\theta}=\frac{2(p/y_0)}{1-p^2/y_0^2}=\frac{2py_0}{y_0^2-p^2}=k_F" display />
    <p>所以 <strong>PF 与轴的夹角恰为切线倾角的两倍</strong> —— 切线正中平分"轴向平行线与焦点线"这对角。于是水平射来的光相对切线的入射角，等于它折向焦点所需的反射角，反射后必过焦点。∎</p>
    <p>上述斜率计算避开了竖直线。若 <Katex tex="y_0=0" />，切线竖直，轴向光沿原方向的反向射回焦点。若 <Katex tex="y_0^2=p^2" />，焦点线竖直，切线与坐标轴成 <Katex tex="45^\circ" />，等角关系仍然成立。</p>

    <h3 class="sec" id="t3-path">为什么从同一波前出发会同时到达焦点？</h3>
    <p>选一条在反射面开口一侧、垂直于轴的发射面 <Katex tex="x=X" />。各条平行入射线从这个面同时出发。设它经过反射点 <Katex tex="P=(x,y)" />，准线为 <Katex tex="x=x_\ell" />。入射段长 <Katex tex="X-x" />，反射段长 <Katex tex="|PF|=x-x_\ell" />，最后一个等号来自抛物线定义。</p>
    <Katex tex="(X-x)+|PF|=X-x_\ell." display />
    <p>所以无论打在反射面的哪个位置，同一介质中的折线路径都一样长。实验里靠边的光束更早遇到反射面，却要走更长的反射段，长短正好互相补偿。把这条性质和反射方向合在一起，才解释了图中各条光束为什么<strong>同时</strong>到达焦点。</p>

    <h3 class="sec" id="t3-app">真实应用</h3>
    <ul>
      <li><strong>卫星天线 / 射电望远镜</strong>：来自同步卫星或遥远天体的电磁波近似平行光，抛物面反射面把它汇聚到焦点处的馈源（接收机）。中国天眼 FAST 更进一步：它以球面为基准面，观测时用促动器把照射区域实时<strong>变形为抛物面</strong>，兼顾大口径与完美聚焦；</li>
      <li><strong>探照灯与汽车远光灯</strong>：光源放在焦点，反射后射出严格平行的光束 —— 性质反过来用；</li>
      <li><strong>太阳灶 / 太阳炉</strong>：平行阳光聚于焦点，焦点温度足以熔化金属（传说阿基米德用抛物面镜烧毁敌舰的"死光"，原理正在于此）。</li>
    </ul>
    <p>聚焦与平行射出互为逆过程，一条抛物线两头通吃 —— 这是"焦点"一词的由来：拉丁语 focus，炉灶。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDishRefl } from '../../../boards/conics/optics/dishrefl.js';
import { OPT_CHAPTERS } from './optnav.js';
</script>
