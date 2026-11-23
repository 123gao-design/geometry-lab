<template>
  <ChPage :cur="4" no="L4" base="/conics/lin" :chapters="LIN_CHAPTERS"
    title="曲线系：用 f + λg 编制一族曲线" sub="两个条件定不出一条曲线？把所有候选写成 $f+\lambda g=0$ —— 公共点自动满足，剩余自由度 $\lambda$ 留给最后一个条件。共渐近线、共焦点、过交点三大高频族，同一套方法全管。"
    :toc="[{ id: 'l4-lab', t: '曲线系（图 L4）' }, { id: 'l4-def', t: '原理与 λ 法' }, { id: 'l4-fam', t: '三大高频族' }, { id: 'l4-use', t: '速用与回收' }]">
    <div class="note good"><strong>本讲主角</strong>：曲线系。设曲线 <Katex tex="f(x,y)=0" /> 与 <Katex tex="g(x,y)=0" /> 交于若干点，则 <Katex tex="F_\lambda=f+\lambda g=0" />（<Katex tex="\lambda\in\mathbb R" />）是<strong>过它们全部公共点</strong>的二次曲线族：交点处 <Katex tex="f=g=0" />，代入得 <Katex tex="F_\lambda=0+\lambda\cdot 0=0" />，与 λ 无关 —— 一个参数白手起家，包下所有公共点。</div>

    <h3 class="sec" id="l4-lab">曲线系</h3>
    <ConicFigure head="bottom" number="L4" title="同一个方程族中保持不变的几何对象" :factory="createPencil"
      :legend="[['mint', '当前成员'], ['gold', '经过指定点的成员'], ['guide', '其他成员', 'dashed']]">
      （三模式）：「过交点族」里全族曲线（实线+虚影）被固定在椭圆与直线的两个交点上，拖 <Katex tex="P_0" /> 看 <Katex tex="\lambda" /> 法一步定出金色成员；「共渐近线族」里 <Katex tex="\lambda" /> 扫过 0 时横竖开口对调（L1 第四态正是 <Katex tex="\lambda\to 0" /> 的极限）；「共焦点族」里 t 穿过 0 时椭圆连续变形为双曲线，两个红焦点纹丝不动。
    </ConicFigure>

    <h3 class="sec" id="l4-def">原理与 λ 法</h3>
    <p>反方向才是主要题型：<strong>已知曲线过某些点 / 满足某些相切条件，求这条曲线</strong>。标准步骤两步：<strong>① 设系</strong>，把已知的公共点全部代入 <Katex tex="F_\lambda=f+\lambda g" />（g 常取直线或直线对）；<strong>② 定 λ</strong>，把剩余条件代入 —— <Katex tex="F_\lambda(P_0)=0" /> 关于 λ 是<strong>一次方程</strong>，一步解出。</p>
    <p>例：求过椭圆 <Katex tex="\tfrac{x^2}{4}+\tfrac{y^2}{3}=1" /> 与直线 y=x 的交点、且过点 <Katex tex="P_0=(0,\ \tfrac32)" /> 的二次曲线。设 <Katex tex="f=\tfrac{x^2}4+\tfrac{y^2}3-1" />、<Katex tex="\ell=y-x" />，族为 <Katex tex="f+\lambda\ell=0" />。把 <Katex tex="P_0" /> 代入：</p>
    <Katex tex="-\tfrac14+\tfrac32\lambda=0\ \Rightarrow\ \lambda=\tfrac16\ \Rightarrow\ \tfrac{x^2}4+\tfrac{y^2}3-1+\tfrac{y-x}6=0" display />
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>λ 法包下的是「过全部公共点的二次曲线」，不是「全部二次曲线」：若题目指定形状（圆 / 双曲线）或要求非退化，解出 λ 后必须回验 —— 族里可能混着退化成员（两条直线、一点、甚至空集）。</p>
    </div>

    <h3 class="sec" id="l4-fam">三大高频族</h3>
    <table>
      <tbody>
        <tr><th>族</th><th>设法</th><th>为什么成立</th><th>典型用法</th></tr>
        <tr><td><strong>共渐近线</strong></td><td><Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=\lambda" /></td><td>渐近线只由二次部分 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=0" /> 决定，常数管不着（A4：渐近线是轴的像）</td><td>已知渐近线 + 一个点 ⟹ 一个 λ；<Katex tex="\lambda&gt;0" /> 横开、<Katex tex="\lambda&lt;0" /> 竖开</td></tr>
        <tr><td><strong>共焦点</strong></td><td><Katex tex="\tfrac{x^2}{c^2+t}+\tfrac{y^2}{t}=1" /></td><td><Katex tex="a^2=c^2+t" />、<Katex tex="b^2=t" />：<Katex tex="t&gt;0" /> 时 <Katex tex="a^2-b^2=c^2" />（椭圆），<Katex tex="-c^2&lt;t&lt;0" /> 时 <Katex tex="a^2+b^2=c^2" />（双曲线）</td><td>共焦点 <Katex tex="\Rightarrow" /> 一个 t；椭圆族与双曲线族在交点处互相垂直</td></tr>
        <tr><td><strong>过交点</strong></td><td><Katex tex="f+\lambda\ell=0" /></td><td>公共点处两项各为零</td><td>λ 法（上一节）；「恒过定点」题的代数原形</td></tr>
      </tbody>
    </table>
    <p>第三行值得多念一遍：高考的「无论 k 取何值，曲线恒过定点」题型，翻成曲线系语言就是 —— 曲线族 <Katex tex="F(x,y,k)=0" /> 关于 k 整理成 <Katex tex="\varphi(x,y)+k\,\psi(x,y)=0" />，要恒过定点，需 <Katex tex="\varphi=0" /> 与 <Katex tex="\psi=0" /> 有公共解。这正是 <Katex tex="f+\lambda g" /> 的「倒读」，下一讲（L5）定点问题的解析推导用的就是这套整理方法。</p>

    <h3 class="sec" id="l4-use">速用与回收</h3>
    <p><strong>① 双曲线待定系数</strong>：渐近线 <Katex tex="y=\pm\tfrac{2}{3}x" />、过点 (3, 2√2)：设 <Katex tex="\tfrac{x^2}9-\tfrac{y^2}4=\lambda" />，代入得 <Katex tex="1-2=\lambda\Rightarrow\lambda=-1" /> —— 纵向开口的 <Katex tex="\tfrac{y^2}4-\tfrac{x^2}9=1" />，两行即得。<strong>② 共焦点速查</strong>：与椭圆 <Katex tex="\tfrac{x^2}{25}+\tfrac{y^2}{9}=1" />（c=4）共焦点且过点 (3, 2√2) 的曲线：设 <Katex tex="\tfrac{x^2}{16+t}+\tfrac{y^2}{t}=1" />，代点得 <Katex tex="\tfrac9{16+t}+\tfrac8t=1" />，通分即 <Katex tex="t^2-t-128=0" /> —— 一元化，不动二元大方程。两根一正一负（且负根落在 (−16, 0) 内）：<strong>椭圆一枚、双曲线一枚</strong>，恰好把 L4 画板里 t 穿 0 前后的两个成员各对应一个。</p>
    <p><strong>回收</strong>：L1（公共交点由判别式现场算出；第四态 = 共渐近线族 λ→0 的退化成员）、A4（渐近线是轴的像：母本 <Katex tex="uv=1" /> 的族 <Katex tex="uv=k" /> 就是共「坐标轴」族）、A5（对勾函数 <Katex tex="xy=ax^2+b" /> 里的 a 正是「共渐近线」的倾斜版）、P2（族的扫描思想：L4 是「同时画一族」，P2 是「让一族轮流跑」）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPencil } from '../../../boards/conics/lines/pencil.js';
import { LIN_CHAPTERS } from './linnav.js';
</script>
