<template>
  <ChPage :cur="2" no="K2" base="/trig/k" :chapters="K_CHAPTERS"
    title="建模与最值：三角函数的综合应用" sub="情境翻译成 $y=k+A\sin(\omega(x-x_0))$，四步读出全部参数；最值问题交给辅助角 —— $a\sin x+b\cos x+k\in[k-R,\ k+R]$，R 管峰高、c 管中线，有界换元 $t=\sin x$ 把复合函数收口在 $[-1,1]$。"
    :toc="[{ id: 'k2-model', t: '建模四步' }, { id: 'k2-fit', t: '从观测点估计参数' }, { id: 'k2-ext', t: '辅助角最值' }, { id: 'k2-sub', t: '有界换元：收口 [−1,1]' }, { id: 'k2-pit', t: '相位·截断·收口' }]">
    <div class="note good" id="k2-def"><strong>建模与最值两件套</strong>：情境 → <Katex tex="y=k+A\sin(\omega(x-x_0))" />（<Katex tex="A" /> 振幅、<Katex tex="T" /> 周期、<Katex tex="k" /> 中线、<Katex tex="x_0" /> 向上穿过中线的时刻）；最值 → <Katex tex="a\sin x+b\cos x+k=R\sin(x+\varphi)+k" />，值域 <Katex tex="[k-R,\ k+R]" />（<Katex tex="R=\sqrt{a^2+b^2}" />）。两者共享一件事：<strong>先确认界限，再求极值</strong>。</div>
    <ConicFigure number="K2" title="潮汐拟合与合成波的最值" head="bottom" :factory="createLab">在潮汐图中，先对齐相邻两次高潮，再调整曲线的高度。选“半周期错配”，观察峰谷对调时误差如何变化。切换到“合成波最值”，拖动中线 <Katex tex="c"/>，比较波峰与波谷是否移动了相同的距离。</ConicFigure>

    <h3 class="sec" id="k2-model">建模四步</h3>
    <p>实际情境的翻译表只有四行：<strong>周期 <Katex tex="T" /></strong> 看重复一次要多久（潮汐两峰相距 <Katex tex="12" /> 小时、摩天轮转一圈、交流电一个波形），<strong>振幅 <Katex tex="A" /></strong> 看峰谷差的一半，<strong>中线 <Katex tex="k" /></strong> 看峰谷平均（水深有基准、体温有基线），<strong>上穿中线时刻 <Katex tex="x_0"/></strong> 看水深<strong>上升</strong>时穿过中线的时刻。四行各管一件事 —— 与<RouterLink class="xref" to="/trig/f1"><Katex tex="y=A\sin(\omega x+\varphi)" /></RouterLink>各管一件事是同一原则，只是 <Katex tex="\omega" /> 换算 <Katex tex="\omega=\tfrac{2\pi}{T}" /> 由「多久一圈」直接读数。位置量（水深、身高、温度）必有中线；角度量（摩天轮座位高度若以圆心为基准）中线常为 <Katex tex="0" /> —— 建模第一问就是问「量从哪儿量起」。</p>

    <h3 class="sec" id="k2-fit">从观测点估计参数</h3>
    <p>先找连续两次高潮，它们的时间差给出周期 <Katex tex="T"/> 的估计值。再读最高水深 <Katex tex="M"/> 和最低水深 <Katex tex="m"/>：中线在两者正中，振幅是潮差的一半。最后看水深何时从下往上穿过中线，据此调整 <Katex tex="x_0"/>。同一时刻，观测点到拟合曲线的竖直距离就是该点的绝对误差。图中以 <Katex tex="0.35\,\mathrm m"/> 区分偏差小和偏差大的点。下方的均方根误差汇总所有观测点，数值越小，整体拟合越好。</p>

    <h3 class="sec" id="k2-ext">辅助角最值</h3>
    <p>用<RouterLink class="xref" to="/trig/q2">辅助角公式</RouterLink>把 <Katex tex="a\sin x+b\cos x+c"/> 写成 <Katex tex="R\sin(x+\varphi)+c"/>，其中 <Katex tex="R=\sqrt{a^2+b^2}"/>。若 <Katex tex="R>0"/>，当正弦取 <Katex tex="1"/> 时，曲线比中线高一个振幅，达到最大值 <Katex tex="c+R"/>。半个周期后正弦取 <Katex tex="-1"/>，达到最小值 <Katex tex="c-R"/>。例如选“合成振幅 <Katex tex="5"/>”，右图两直角边为 <Katex tex="3"/> 和 <Katex tex="4"/>，斜边长 <Katex tex="5"/>。在左图从中线 <Katex tex="y=2"/> 向上、向下各量 <Katex tex="5"/>，就能读出最大值 <Katex tex="7"/>、最小值 <Katex tex="-3"/>。</p>

    <h3 class="sec" id="k2-sub">有界换元：收口 [−1,1]</h3>
    <p>复合题型「求 <Katex tex="y=2-2\sin^2x+\sin x" /> 的值域」走换元：<Katex tex="t=\sin x\in[-1,1]" />，得开口向下的二次 <Katex tex="y=-2t^2+t+2" /> —— 到这一步是<RouterLink class="xref" to="/functions/e2">二次函数：区间最值与根的分布</RouterLink>的区间最值：对称轴 <Katex tex="t=\tfrac14" /> 在界内，顶点收 <Katex tex="\max=\tfrac{17}{8}" />；<Katex tex="\min" /> 在离轴远的端点 <Katex tex="t=-1"/> 处收 <Katex tex="-1"/>。<strong>判断轴在界内还是界外，就是<RouterLink class="xref" to="/trig/z3">面积与范围</RouterLink>「达到最大」判读的换元版</strong>：<Katex tex="\gamma=90^\circ"/> 达到最大 <Katex tex="S\le\tfrac12ab"/> 说的是 <Katex tex="\sin\gamma"/> 能不能取到 <Katex tex="1" />，此处说的是 <Katex tex="t" /> 能不能取到对称轴 —— 同一句话。换元 <Katex tex="t" /> 的收口 <Katex tex="[-1,1]"/> 与<RouterLink class="xref" to="/trig/k1">已知值求角与三角方程</RouterLink>的增根检验是同一道限制：界外没有 <Katex tex="t" />，就没有那一段极值。</p>

    <h3 class="sec" id="k2-pit">相位·截断·收口</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：振幅恒正。</strong><Katex tex="A=(M-m)/2"/> 恒非负，负号交给相位：把 <Katex tex="x_0"/> 平移半个周期与写 <Katex tex="-A"/> 是同一件事，别在 A 上记负号。</li>
        <li><strong>提示二：零点认错段。</strong><Katex tex="x_0"/> 是<strong>升段</strong>过中线的点 —— 取成向下穿过中线的时刻整波反相（预设②的半周期错配）；也不能把峰值时刻当作 <Katex tex="x_0"/>（那是 <Katex tex="x_0+T/4"/>）。</li>
        <li><strong>提示三：定义域截断。</strong>应用题常只要 <Katex tex="[0,24]"/> 一窗：理论最值若落在窗外，须改用窗内端点确定 —— 先查界，再定极值（与<RouterLink class="xref" to="/functions/e2">二次函数：区间最值与根的分布</RouterLink>的判断相同）。</li>
        <li><strong>提示四：换元忘收口。</strong><Katex tex="t=\sin x"/> 只在 <Katex tex="[-1,1]"/> 内取值且必须回代成 <Katex tex="x" /> 写族或值域，界外的根与界外的极值都应排除。</li>
        <li><strong>提示五：辅助角 <Katex tex="\tan\varphi"/> 的象限。</strong><Katex tex="\tan\varphi=\tfrac{b}{a}" /> 只定角的参考值，<Katex tex="\varphi" /> 的象限要按 <Katex tex="(a,b)" /> 的符号落在正确的象限 —— 直角三角形的参考形式取在第一象限，<Katex tex="b\lt0"/> 时 <Katex tex="\varphi"/> 得取负。</li>
      </ul>
    </div>
    <p>至此三角函数与三角形模块 23 章全部完结：从旋转成角到弧度量角，从单位圆定义到图象变换，从恒等变换的公式群到反三角的反向求解，再到解三角形与综合应用 —— 每一步都有画板演示作证。顶栏<strong>速查</strong>总表收录全部核心结论，考前一页带走。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/synth/tidemodel.js';
import { K_CHAPTERS } from './knav.js';
</script>
