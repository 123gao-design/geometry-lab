<template>
  <ChPage :cur="2" no="P2" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="轨迹与包络：动点怎样画出曲线" sub="定义法、相关点法、交轨法 —— 轨迹问题的三种方法；交轨法画板让 D5 的第三定义从定理变成动态演示。"
    :toc="[{ id: 'p2-lab', t: '交轨法（图 P2）' }, { id: 'p2-cross', t: '交轨法 · 两行推导' }, { id: 'p2-rel', t: '相关点法 · 杆子与卡当椭圆' }, { id: 'p2-env', t: '包络 · 另一种生成方式' }]">
    <p>"求动点的轨迹方程"是解析几何的典型题型。三类方法归结起来只有三问：<strong>动点被什么约束？</strong>约束可以直接写成距离（定义法）、可以继承自另一个动点（相关点法）、可以是两条动直线的交点（交轨法）。</p>

    <h3 class="sec" id="p2-lab">交轨法</h3>
    <ConicFigure head="bottom" number="P2" title="由两条受约束的直线生成轨迹" :factory="createLocusGen"
      :legend="[['blue', '过 A 的直线'], ['orange', '过 B 的直线'], ['gold', '交点', 'point']]">
      过 A(−a,0) 的蓝线与过 B(a,0) 的橙线，被约束 <Katex tex="k_1k_2=K" />（定值）拴在一起。拖动蓝线，交点 P 应声而动；按「生成轨迹」看 P 扫出整条曲线。切到双曲线模式，留意 k₁ 越过 <Katex tex="\pm\tfrac{b}{a}" /> 时两线平行 —— 那正是渐近线方向，P 从一支跳到另一支。
    </ConicFigure>

    <h3 class="sec" id="p2-cross">交轨法：两行推导</h3>
    <p>设 P(x, y)，两条线的斜率直接写出来再相乘：</p>
    <Katex tex="k_1=\frac{y}{x+a},\qquad k_2=\frac{y}{x-a},\qquad k_1k_2=\frac{y^2}{x^2-a^2}=K" display />
    <p>整理：</p>
    <Katex tex="K\,x^2-y^2=K\,a^2\quad\Longleftrightarrow\quad \frac{x^2}{a^2}-\frac{y^2}{Ka^2}=1" display />
    <div class="note good">一个公式三种命运：<strong><Katex tex="K<0" /></strong>（记 <Katex tex="K=-\tfrac{b^2}{a^2}" />）得椭圆 —— 这正是 D5 第三定义的<strong>逆用</strong>：第三定义说"椭圆上的点都满足"，交轨法说"满足的点都在椭圆上"，合起来才是"="；<strong><Katex tex="K=-1" /></strong> 得圆（<Katex tex="x^2+y^2=a^2" />，Thales 定理：直径所张圆周角是直角 <Katex tex="\iff" /> 两线垂直）；<strong><Katex tex="K>0" /></strong> 得双曲线。A2 的平行弦中点轨迹是同一个方程在"中点世界"里的投影 —— 点差法与交轨法在代数上共享这两行。</div>
    <p>交轨法的解题步骤：给两条动线各设斜率（或各设一个参数），写出<strong>约束条件</strong>（乘积、和差、夹角），再把"交点在两线上"翻译成两个方程，消去辅助参数。核心动作始终是那两个字：<strong>消参</strong>。</p>

    <h3 class="sec" id="p2-rel">相关点法：杆子问题与卡当椭圆</h3>
    <p>经典题：长为 ℓ 的杆 AB 两端分别在 x 轴、y 轴上滑动，求杆上到 A 端距离恒为 <Katex tex="d_1" />（到 B 端 <Katex tex="d_2" />，<Katex tex="d_1+d_2=\ell" />）的定点 P 的轨迹。</p>
    <p><strong>相关点法三步</strong>：① 相关动点 A(x_A, 0)、B(0, y_B) 满足主约束 <Katex tex="x_A^2+y_B^2=\ell^2" />；② 待求点用相关点线性表出 —— P 在 AB 上按定比分割：<Katex tex="x=\tfrac{d_2}{\ell}x_A,\ y=\tfrac{d_1}{\ell}y_B" />；③ 回代消去 <Katex tex="x_A, y_B" />：</p>
    <Katex tex="\left(\frac{\ell x}{d_2}\right)^2+\left(\frac{\ell y}{d_1}\right)^2=\ell^2\quad\Longleftrightarrow\quad \frac{x^2}{d_2^2}+\frac{y^2}{d_1^2}=1" display />
    <p>轨迹是<strong>椭圆</strong> —— 这就是"卡当椭圆"（Cardan 椭圆），阿基米德椭圆规的同类：传说伽利略就是用这类连杆在墙上画椭圆的。特别地取 <Katex tex="d_1=d_2=\tfrac{\ell}{2}" />（P 是中点），得圆 <Katex tex="x^2+y^2=\big(\tfrac{\ell}{2}\big)^2" /> —— 又是 Thales：直角杆 AB 对中点张直角。这一题同时复习了 P1 的双辅助圆构造：P 的横坐标随 A 滑动被"均匀线性地"牵引，正是两个辅助圆投影叠加的结果。</p>

    <h3 class="sec" id="p2-env">包络：曲线的另一种生成方式</h3>
    <p>轨迹是"<strong>点</strong>随参数跑出的集合"；包络是"<strong>直线族</strong>扫过后留下的边线"。把 T1 的切线画板打开、把 P 拖一圈：切线扫过的区域边界恰好是曲线本身 —— 椭圆是其全部切线的包络。参数语言里，切线族是 <Katex tex="\tfrac{x\cos t}{a}+\tfrac{y\sin t}{b}=1" />，t 跑遍一周，包络回 <Katex tex="\tfrac{x^2}{a^2}+\tfrac{y^2}{b^2}=1" />。P3 将看到包络视角的完结应用：焦点弦的端点扫过全曲线，弦长公式随 θ 呼吸。</p>
    <p>至此，曲线有四种来源：方程（D 板块）、定义（D1–D4）、变换的像（A 板块）、轨迹与包络（本讲）。下一讲单独讨论"过焦点"的弦 —— 那是三种曲线共享的又一个章节。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLocusGen } from '../../../boards/conics/locus/locusgen.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
