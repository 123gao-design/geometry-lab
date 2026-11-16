<template>
  <ChPage :cur="2" no="K2" base="/trig/k" :chapters="K_CHAPTERS"
    title="建模与最值：三角函数的综合应用" sub="情境翻译成 $y=k+A\sin(\omega(x-x_0))$，四步读出全部参数；最值问题交给辅助角 —— $a\sin x+b\cos x+k\in[k-R,\ k+R]$，R 管峰高、c 管中线，有界换元 $t=\sin x$ 把复合函数收口在 $[-1,1]$。"
    :toc="[{ id: 'k2-model', t: '建模四步' }, { id: 'k2-fit', t: '三点定参与验收' }, { id: 'k2-ext', t: '辅助角最值' }, { id: 'k2-sub', t: '有界换元：收口 [−1,1]' }, { id: 'k2-pit', t: '相位·截断·收口' }]">
    <div class="note good" id="k2-def"><strong>建模与最值两件套</strong>：情境 → <Katex tex="y=k+A\sin(\omega(x-x_0))" />（A 振幅、T 周期、k 中线、x₀ 升段零点）；最值 → <Katex tex="a\sin x+b\cos x+k=R\sin(x+\varphi)+k" />，值域 <Katex tex="[k-R,\ k+R]" />（<Katex tex="R=\sqrt{a^2+b^2}" />）。两者共享一件事：<strong>先确认界限，再求极值</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 K2 · <b>潮汐建模机</b>：<strong>模式一 · 建模</strong> —— 港口水深散点按残差实时染色（近蓝远红），调 A/T/<Katex tex="x_0"/>/k 四旋钮把金线压上数据，右栏「建模四步」从数据读出参数核验；<strong>模式二 · 最值竞技</strong> —— <Katex tex="a\sin x+b\cos x+c"/> 的波峰波谷由辅助角直读，右栏直角三角形现读 R 与 φ，max/min 与数值实测完全重合。</div>
    </div>

    <h3 class="sec" id="k2-model">建模四步</h3>
    <p>实际情境的翻译表只有四行：<strong>周期 T</strong> 看重复一次要多久（潮汐两峰相距 12 小时、摩天轮转一圈、交流电一个波形），<strong>振幅 A</strong> 看峰谷差的一半，<strong>中线 k</strong> 看峰谷平均（水深有基准、体温有基线），<strong>升零点 <Katex tex="x_0"/></strong> 看从中线<strong>上坡</strong>穿过中线的那个时刻。四行各管一件事 —— 与 F1 三旋钮各管一件事是同一原则，只是 ω 换算 <Katex tex="\omega=\tfrac{2\pi}{T}" /> 由「多久一圈」直接读数。位置量（水深、身高、温度）必有中线；角度量（摩天轮座位高度若以圆心为基准）中线常为 0 —— 建模第一问就是问「量从哪儿量起」。</p>

    <h3 class="sec" id="k2-fit">三点定参与验收</h3>
    <p>数据给够三个点，参数就齐了：<strong>峰 M</strong> 与 <strong>谷 m</strong> 给 <Katex tex="A=\tfrac{M-m}{2}" />、<Katex tex="k=\tfrac{M+m}{2}" />；<strong>升段过中线的时刻</strong>给 x₀。板上把这套公式写成「建模四步」对照表：实测峰谷直接读数，你调的四旋钮与真实参数逐项核验，残差最大的点标红 —— 拟合的判据不是「看着像」，是<strong>残差 RMS 小于一格噪声</strong>。错配预设②演示了经典的「半周期陷阱」：升零点取成降零点（差 T/2），整条曲线反相 —— 峰谷全对不上号，残差直接显著增大。</p>

    <h3 class="sec" id="k2-ext">辅助角最值</h3>
    <p>「求 <Katex tex="f(x)=a\sin x+b\cos x+k" /> 的最大最小值」是模块里综合程度最高的一道题：Q2 的辅助角把它叠成 <Katex tex="R\sin(x+\varphi)+k" /> —— R 管峰高、k 管中线，<Katex tex="f_{\max}=k+R" />（在 <Katex tex="x=\tfrac{\pi}{2}-\varphi" /> 取得）、<Katex tex="f_{\min}=k-R" />（再隔半周期）。板上右栏的直角三角形把 <Katex tex="R=\sqrt{a^2+b^2}"/> 与 <Katex tex="\tan\varphi=\tfrac{b}{a}" /> 画成可读的关系，波峰波谷的数值实测与理论直接核对 —— a、b 两列波在此叠成一列，R 作为直角三角形的斜边第二次出现 —— 第一次在 N1 倍角面积机：<Katex tex="\cos\alpha"/>、<Katex tex="\sin\alpha"/> 为直角边，单位圆半径 1 为斜边。含参变式 a=3、b=4、k=2 给出整数结果 <Katex tex="R=5"/>：<Katex tex="max=7"/>、<Katex tex="min=-3"/>，考场的 3-4-5 三角形直接呈现于波形。</p>

    <h3 class="sec" id="k2-sub">有界换元：收口 [−1,1]</h3>
    <p>复合题型「求 <Katex tex="y=2-2\sin^2x+\sin x" /> 的值域」走换元：<Katex tex="t=\sin x\in[-1,1]" />，得开口向下的二次 <Katex tex="y=-2t^2+t+2" /> —— 到这一步是 E2 的区间最值：对称轴 <Katex tex="t=\tfrac14" /> 在界内，顶点收 max=<Katex tex="\tfrac{17}{8}" />；min 在离轴远的端点 <Katex tex="t=-1"/> 处收 <Katex tex="-1"/>。<strong>判断轴在界内还是界外，就是 Z3 达到最大判断的换元版</strong>：<Katex tex="\gamma=90^\circ"/> 达到最大 <Katex tex="S\le\tfrac12ab"/> 说的是 <Katex tex="\sin\gamma"/> 能不能取到 1，此处说的是 t 能不能取到对称轴 —— 同一句话。换元 t 的收口 <Katex tex="[-1,1]"/> 与 K1 的增根检验是同一道限制：界外没有 t，就没有那一段极值。</p>

    <h3 class="sec" id="k2-pit">相位·截断·收口</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：振幅恒正。</strong><Katex tex="A=(M-m)/2"/> 恒非负，负号交给相位：把 <Katex tex="x_0"/> 平移半个周期与写 <Katex tex="-A"/> 是同一件事，别在 A 上记负号。</li>
        <li><strong>提示二：零点认错段。</strong><Katex tex="x_0"/> 是<strong>升段</strong>过中线的点 —— 取成降段零点整波反相（预设②的半周期错配）；也不能把峰值时刻当作 <Katex tex="x_0"/>（那是 <Katex tex="x_0+T/4"/>）。</li>
        <li><strong>提示三：定义域截断。</strong>应用题常只要 <Katex tex="[0,24]"/> 一窗：理论最值若落在窗外，须改用窗内端点确定 —— 先查界，再定极值（与 E2 判定机相同）。</li>
        <li><strong>提示四：换元忘收口。</strong><Katex tex="t=\sin x"/> 只在 <Katex tex="[-1,1]"/> 内取值且必须回代成 x 写族或值域，界外的根与界外的极值都应排除。</li>
        <li><strong>提示五：辅助角 <Katex tex="\tan\varphi"/> 的象限。</strong><Katex tex="\tan\varphi=\tfrac{b}{a}" /> 只定角的参考值，φ 的象限要按 (a,b) 的符号落在正确的象限 —— 直角三角形的参考形式取在第一象限，<Katex tex="b<0"/> 时 <Katex tex="\varphi"/> 得取负。</li>
      </ul>
    </div>
    <p>至此三角函数与三角形模块 23 章全部完结：从旋转成角到弧度量角，从单位圆定义到图象变换，从恒等变换的公式群到反三角的反向求解，再到解三角形与综合应用 —— 每一步都有实验台作证。顶栏<strong>速查</strong>总表收录全部核心结论，考前一页带走。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/synth/tidemodel.js';
import { K_CHAPTERS } from './knav.js';
</script>
