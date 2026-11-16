<template>
  <ChPage :cur="1" no="拟1" base="/numeric/f" :chapters="NF_CHAPTERS"
    title="最小二乘与线性拟合"
    sub="用一条直线去贴近一组散点，衡量好坏的标准取残差的平方和。平方和是斜率与截距的二次函数，最小值点可以用公式直接写出。"
    :toc="[{ id: 'f1-idea', t: '为什么平方和' }, { id: 'f1-norm', t: '法方程与两个公式' }, { id: 'f1-prop', t: '拟合直线的三条性质' }, { id: 'f1-pit', t: '样本、异常点与因果' }]">

    <div class="note good" id="f1-idea">设样本为 <Katex tex="(x_1,y_1),\dots,(x_n,y_n)" />，拟合直线记作 <Katex tex="\hat y=\hat a x+\hat b" />。残差 <Katex tex="e_i=y_i-\hat y_i" />，最小二乘解就是使 <Katex tex="S(a,b)=\sum e_i^{\,2}" /> 取最小值的那一对 <Katex tex="(a,b)" />。它由法方程唯一确定：
      <Katex tex="\hat a=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2},\qquad \hat b=\bar y-\hat a\,\bar x." display="true" /></div>

    <div class="board-wrap">
      <BoardMount :factory="createLsFit" />
      <div class="cap">图 拟1 · <b>最小二乘拟合机</b>：蓝点是样本，金色直线是拟合结果，青色十字交出样本中心 <Katex tex="(\bar x,\bar y)" />，红色竖线是各点的残差，旁边的小方块面积就是这一个残差的平方。看点：上下拖动任意一点，直线整体重新算一遍，右栏的 <Katex tex="S" /> 随之涨落；拖动幅度滑杆，看 <Katex tex="S" /> 与基准 <Katex tex="S_0" /> 的比值如何变化。</div>
    </div>

    <h3 class="sec" id="f1-idea">为什么平方和</h3>
    <p>残差有正有负，直接相加会互相抵消，绝对值又不便于求导。取平方有两个好处：一是符号统一，二是 <Katex tex="S" /> 成了 <Katex tex="a,b" /> 的二次函数，配方之后最小值点一目了然。</p>
    <p>平方还有一个并不显然的性质：如果误差是独立、同方差、均值为零的随机量，那么最小二乘解与最大似然估计一致。这条联系在本模块不展开，只记住「平方和最小」不是随手定的标准，它有概率论上的依据。</p>
    <p>图 拟1 中各点的小方块面积 <Katex tex="e_i^{\,2}" /> 与残差长度成平方关系，所以远离直线的一个点，哪怕只远出两倍，对 <Katex tex="S" /> 的贡献就是四倍。这是最小二乘对异常点敏感的原因，也是它偏向「照顾大偏差」的由来。</p>

    <h3 class="sec" id="f1-norm">法方程与两个公式</h3>
    <p>把 <Katex tex="S" /> 展开：<Katex tex="S=\sum\big(y_i-ax_i-b\big)^2" />，分别对 <Katex tex="a" /> 与 <Katex tex="b" /> 求偏导并令其为零，得到法方程</p>
    <p><Katex tex="\begin{cases}\sum x_i^{\,2}\,a+\sum x_i\,b=\sum x_iy_i\\[2pt] \sum x_i\,a+n\,b=\sum y_i\end{cases}" display="true" /></p>
    <p>这是关于 <Katex tex="a,b" /> 的二元一次方程组，其二阶矩阵 <Katex tex="(\sum x_i^2)(n)-\left(\sum x_i\right)^2>0" />（只要 <Katex tex="x_i" /> 不全相等），所以解唯一且是最小值点。</p>
    <p>把第二式代回第一式，就得到上面那条用离差表示的形式。离差形式的分子是 <Katex tex="x" /> 与 <Katex tex="y" /> 的协方差的和，分母是 <Katex tex="x" /> 的方差的和，都是非负或可正可负的量，计算时不必求很大的平方和，也不容易丢有效数字。</p>

    <h3 class="sec" id="f1-prop">拟合直线的三条性质</h3>
    <p><b>一、过样本中心。</b>由 <Katex tex="\hat b=\bar y-\hat a\bar x" /> 立刻得到 <Katex tex="\hat y(\bar x)=\bar y" />。这是图 拟1 中青色十字的意义：无论怎么拖动样本点，金色直线总穿过新的中心。</p>
    <p><b>二、残差之和为零。</b>对 <Katex tex="b" /> 求偏导为零给出 <Katex tex="\sum e_i=0" />，正负残差恰好抵消。</p>
    <p><b>三、残差与 <Katex tex="x" /> 不相关。</b>对 <Katex tex="a" /> 求偏导为零给出 <Katex tex="\sum x_ie_i=0" />，残差对自变量不再残留任何线性趋势。这两条合起来说明：拟合直线已经吃掉了数据里所有与 <Katex tex="x" /> 有关的线性信息。</p>
    <p>衡量解释力常用 <Katex tex="R^2=1-\dfrac{S}{S_0}" />，其中 <Katex tex="S_0=\sum(y_i-\bar y)^2" /> 是只用水平线时的残差平方和。图 拟1 右栏读出的就是这个比值：它越接近 1，说明起伏中能被直线解释的部分越多。</p>

    <h3 class="sec" id="f1-pit">样本、异常点与因果</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：直线不能外推太远。</strong>最小二乘只在样本覆盖的区间内有依据，把 <Katex tex="x" /> 推到远处，得到的只是那条直线自己的延长线，与真实规律无关。</li>
        <li><strong>提示二：一个异常点能拽动整条线。</strong>平方放大了大残差的权重，个别离谱的点会明显改变斜率。先画散点图，必要时剔除或改用稳健方法。</li>
        <li><strong>提示三：相关不等于因果。</strong>拟合得好只说明两组数据同步变化，并不能说明其中一个导致另一个。</li>
        <li><strong>提示四：平方和最小不等于误差都小。</strong>它最小化的是总和，某一点的残差仍可能很大；要逐点看残差图，而不是只看 <Katex tex="R^2" />。</li>
      </ul>
    </div>
    <p>回收与预告：统3 里的一元线性回归用的就是这两个公式，只是把样本换成随机变量、把 <Katex tex="R^2" /> 换成相关系数 <Katex tex="r" /> 的平方。拟2 处理非线性数据：先取对数把曲线拉直，再回到这里用直线拟合。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLsFit } from '../../../boards/numeric/fit/lsfit.js';
import { NF_CHAPTERS } from './nfnav.js';
</script>
