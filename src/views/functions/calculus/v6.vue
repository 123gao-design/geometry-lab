<template>
  <ChPage :cur="6" no="V6" base="/functions/v" :chapters="V_CHAPTERS"
    title="泰勒展开：从拟合到 e" sub="切线只对齐「值与斜率」，抛物线再匹配一条二阶导数……多项式在 0 处逐阶匹配函数，匹配到第 n 阶就是麦克劳林多项式 $P_n$。令 $x=1$、$f=e^x$，$P_n(1)$ 一路奔向 $e$ —— 级数 $\sum 1/k!$ 与复利极限 $\lim(1+1/n)^n$ 是同一对象的两种表达。"
    :toc="[{ id: 'v6-fit', t: '拟合：从切线到逐阶对齐' }, { id: 'v6-e', t: 'e 的两种表达：级数与复利' }, { id: 'v6-table', t: '常用麦克劳林展开速查表' }, { id: 'v6-pit', t: '收敛半径与滥用' }]">
    <div class="note good" id="v6-law"><strong>麦克劳林公式（x₀=0 处的泰勒）</strong>：与 f 在 0 处同值、同各阶导数（直到 n 阶）的多项式是 <Katex tex="P_n(x)=\sum_{k=0}^{n}\dfrac{f^{(k)}(0)}{k!}\,x^k" /> —— 阶乘来自求导计数：x^k 连求 k 次导得 k!。e^x 求导不变形 ⟹ 展开系数全是 1/k!：<Katex tex="e^x=1+x+\dfrac{x^2}{2!}+\dfrac{x^3}{3!}+\cdots" />；令 x=1 得 <Katex tex="e=\sum_{k=0}^{\infty}\dfrac{1}{k!}\approx 2.71828" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFit" />
      <div class="cap">图 V6 · <b>泰勒拟合机</b>：蓝=目标函数，金=部分和 <Katex tex="P_n"/> —— 拖「阶数」看金曲线一项项逼近蓝曲线，检验点误差徽章同步骤减（<Katex tex="e^x"/> 例 <Katex tex="x=1"/>：误差从 <Katex tex="n=0"/> 的 1.72 降到 <Katex tex="n=6"/> 的 0.0002）；「虚线逐项」看每一项各自的形状。第三原图把检验点拖过 1：越出 <Katex tex="\ln(1+x)"/> 的收敛半径，加阶数也无法弥补。</div>
    </div>

    <h3 class="sec" id="v6-fit">拟合：从切线到逐阶对齐</h3>
    <p>V1 的切线是「一阶拟合」：<Katex tex="P_1(x)=f(0)+f'(0)x"/>，在 0 处与 f 同值同斜率 —— 但离 0 一远误差立即增大（检验点误差徽章实时显示）。想贴得更远，就再匹配一阶：让二阶导数也对上。设 <Katex tex="P_n(x)=a_0+a_1x+\cdots+a_nx^n"/>，逐阶求导代 <Katex tex="x=0"/> 即得 <Katex tex="a_0=f(0),\ a_1=f'(0),\ a_2=\dfrac{f''(0)}{2!},\ \ldots,\ a_k=\dfrac{f^{(k)}(0)}{k!}" />：<Katex tex="x^2"/> 求两次导剩 2、<Katex tex="x^3"/> 求三次导剩 6 —— <strong>阶乘记录求导的次数</strong>，除回去恰好还原。V4 的逐级放缩（<Katex tex="e^x\ge 1+x"/> 推出 <Katex tex="\ge 1+x+x^2/2"/>）就是逐阶匹配的具体形式。</p>
    <p>图 V6 的「⏩ 阶数加一」把这一过程做成动画：每加一项，金曲线在 0 附近多匹配一阶、有效范围更远一点。快到什么程度？检验点固定 <Katex tex="x=1"/>、原图 <Katex tex="e^x"/>：误差从 <Katex tex="n=0"/> 的 1.72 到 <Katex tex="n=2"/> 的 0.22、<Katex tex="n=4"/> 的 0.0099、<Katex tex="n=6"/> 的 0.0002 —— 每加一阶，误差大约缩小为 <Katex tex="1/(n+1)"/> 倍；离 0 越远，需要的阶数越多（把检验点拖远看误差回升，这是「展开以展开点为中心」的第一直觉）。</p>

    <h3 class="sec" id="v6-e">e 的两种表达：级数与复利</h3>
    <p><strong>复利表达</strong>：<Katex tex="e=\lim_{n\to\infty}\Bigl(1+\dfrac{1}{n}\Bigr)^n" /> —— 本金 1、年利率 100%，一年计息 n 次的期末余额（E4 已展示 a=e 的临界情形）。<strong>级数表达</strong>：<Katex tex="e=1+\dfrac{1}{1!}+\dfrac{1}{2!}+\dfrac{1}{3!}+\cdots" />。两种表达给出同一个数：把 <Katex tex="\Bigl(1+\dfrac{1}{n}\Bigr)^n" /> 按二项式定理展开，第 k 项是 <Katex tex="\tbinom{n}{k}\dfrac{1}{n^k}=\dfrac{1}{k!}\cdot\dfrac{n(n-1)\cdots(n-k+1)}{n^k}" />，n→∞ 时后面的因子趋于 1，每一项趋近 <Katex tex="\dfrac{1}{k!}" />（严格证明需要大学的一致收敛理论，主要结构高中可看懂）。</p>
    <p>级数脸的收敛快得惊人：<Katex tex="P_6(1)=2.71806" />，与 <Katex tex="e"/> 只差 0.00023 —— 分母的阶乘是天然的增长冠军，第 10 项就只剩 <Katex tex="\dfrac{1}{10!}\approx 2.8\times10^{-7}" />。这也是 <Katex tex="e^x"/> 的专属回报：求导不变形的函数，展开式自己就是自己的生成器 —— 图 V6 上把 n 拖满、检验点放 1，误差徽章直接读出 0.0002。</p>

    <h3 class="sec" id="v6-table">常用麦克劳林展开速查表</h3>
    <p>五条常用展开（收敛范围一并记录，括号不是装饰）：</p>
    <p><Katex tex="e^x=\sum\dfrac{x^k}{k!}" />（一切 x）；<Katex tex="\sin x=x-\dfrac{x^3}{3!}+\dfrac{x^5}{5!}-\cdots" />（一切 x，只含奇次幂 —— S3 的奇函数身份在系数表里原样保留）；<Katex tex="\cos x=1-\dfrac{x^2}{2!}+\dfrac{x^4}{4!}-\cdots" />（一切 x，偶函数）；<Katex tex="\ln(1+x)=x-\dfrac{x^2}{2}+\dfrac{x^3}{3}-\cdots" />（−1&lt;x≤1，交错）；<Katex tex="\dfrac{1}{1-x}=1+x+x^2+\cdots" />（|x|&lt;1，等比数列求和的函数版）。</p>
    <p>图 V6 的三个例子正好是表里的第 1、2、4 条：sin 原图开「虚线逐项」，只剩奇次幂的虚线（偶次系数全为 0 的可视化）；ln 原图把检验点拖过 1，「越出收敛半径」的提示亮起 —— 表里那条括号对应的发散直接可见。</p>

    <h3 class="sec" id="v6-pit">收敛半径与滥用</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把展开当恒等式。</strong><Katex tex="P_n"/> 只是近似，严格的等号要靠余项 <Katex tex="R_n"/> 或取极限；用 <Katex tex="P_3"/> 代 <Katex tex="e^x"/> 算小数第四位，误差 0.05 起步 —— 精度以检验点误差为准。</li>
        <li><strong>提示二：无视收敛半径。</strong><Katex tex="\ln(1+x)"/> 的级数只在 <Katex tex="-1<x\le 1"/> 收敛，<Katex tex="x=2"/> 时部分和随项数增加偏离更大（图 V6 第三原图）；出了半径，多项式与函数不再相关，增加阶数也无济于事。</li>
        <li><strong>提示三：以为「逼近」全局有效。</strong>泰勒展开以展开点为中心：离 0 越远需要的阶数越多；要逼近远处的值得换展开中心 <Katex tex="x_0\ne 0"/>（一般泰勒，高中不要求，但「中心」这个观念值得注意）。</li>
      </ul>
    </div>
    <p>下一讲把「多项式的加法」换成「矩形的加法」：从 <Katex tex="\sum k^2"/> 的金字塔出发，÷<Katex tex="n^3"/> 铺回 [0,1]，看离散求和的极限怎样成为 <Katex tex="\int_0^1 x^2\,\mathrm{d}x=\dfrac{1}{3}"/> —— 积分由求和的极限导出。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFit } from '../../../boards/functions/calculus/taylorfit.js';
import { V_CHAPTERS } from './vnav.js';
</script>
