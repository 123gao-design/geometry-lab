<template>
  <ChPage :cur="2" no="拟2" base="/numeric/f" :chapters="NF_CHAPTERS"
    title="非线性拟合与线性化"
    sub="指数型与幂函数型的数据，取对数之后都变成直线。先对变换后的数据做最小二乘，再把截距与斜率还原成原来的参数。"
    :toc="[{ id: 'f2-why', t: '曲线不好拟合，直线好拟合' }, { id: 'f2-exp', t: '指数型：纵轴取对数' }, { id: 'f2-pow', t: '幂函数型：双对数' }, { id: 'f2-pit', t: '变换会改变误差的权重' }]">

    <div class="note good" id="f2-why">两类常见模型的线性化：
      <Katex tex="y=Ae^{bx}\ \Longleftrightarrow\ \ln y=\ln A+bx" />，纵轴取对数，横轴不动；
      <Katex tex="y=Ax^{b}\ \Longleftrightarrow\ \ln y=\ln A+b\ln x" />，两个坐标都取对数。两种情形都是「新坐标下用直线拟合，斜率给出 <Katex tex="b" />，截距取指数还原出 <Katex tex="A" />」。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCurveFit" />
      <div class="cap">图 拟2 · <b>线性化拟合机</b>：左图是原坐标里样本与拟合曲线，右图是取对数后的散点与拟合直线。看点：切换「指数型 / 幂函数型」，右图的横轴在 <Katex tex="x" /> 与 <Katex tex="\ln x" /> 之间换掉；把真实 <Katex tex="b_0" /> 调大，右图直线变陡，回代得到的 <Katex tex="\hat b" /> 跟着变，而 <Katex tex="\hat A" /> 始终贴着真实值。</div>
    </div>

    <h3 class="sec" id="f2-why">曲线不好拟合，直线好拟合</h3>
    <p>最小二乘的公式只对线性模型现成可用：待定参数以一次形式出现，法方程才是一次方程组。指数型里的 <Katex tex="A" />、<Katex tex="b" /> 都长在指数上，直接对残差平方和求导会得到非线性方程组，没有闭式解。</p>
    <p>取对数把乘法变成加法，指数变成系数，模型就回到了线性。这一步在解方程里叫换元，在数据里叫坐标变换——两件事是同一件事。</p>
    <p>图 拟2 的右图中，紫点几乎排成一条直线。这条直线的斜率与截距可以用拟1 的两个公式直接算出，不需要任何迭代。</p>

    <h3 class="sec" id="f2-exp">指数型：纵轴取对数</h3>
    <p>设 <Katex tex="y=Ae^{bx}" />，两边取自然对数得 <Katex tex="u=\ln y" /> 与 <Katex tex="x" /> 之间的线性关系 <Katex tex="u=bx+\ln A" />。用 <Katex tex="(x_i,\ln y_i)" /> 做最小二乘，得到 <Katex tex="\hat k" />（当作 <Katex tex="b" />）与截距 <Katex tex="\hat c" />，则
      <Katex tex="\hat b=\hat k,\qquad \hat A=e^{\hat c}." display="true" /></p>
    <p>指数型有两个可以互相校验的特征：取对数后的点应当近似共线；<Katex tex="x" /> 每增加一个固定量，<Katex tex="y" /> 就按固定倍数缩放。后者常被写成「倍增期」或「半衰期」，与斜率的关系是倍增期 <Katex tex="=\dfrac{\ln 2}{b}" />。</p>
    <p>注意 <Katex tex="A" /> 必须是正经的指数型才有意义：若数据本身更像整条直线（<Katex tex="b\approx 0" />），两种模型差别不大，不要硬套。</p>

    <h3 class="sec" id="f2-pow">幂函数型：双对数</h3>
    <p>设 <Katex tex="y=Ax^b" />（要求 <Katex tex="x>0" />），取对数得 <Katex tex="\ln y=b\ln x+\ln A" />。令 <Katex tex="u=\ln x" />、<Katex tex="v=\ln y" />，同样做直线拟合，再回代。</p>
    <p>双对数坐标下直线斜率就是指数 <Katex tex="b" />，这一点在幂律的研究里用得极多。判断数据更像指数型还是幂函数型，看哪一种取对数方式能让点排成直线：只纵轴取对数变直的是指数型，两轴都取对数才变直的是幂函数型。</p>
    <p>图 拟2 切到幂函数型时，右图的横轴随之换成 <Katex tex="\ln x" />。同一组数据在两种模型下的残差平方和不同，可以据此比较哪个模型更合适。</p>

    <h3 class="sec" id="f2-pit">变换会改变误差的权重</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：对 <Katex tex="y" /> 取对数会改变残差的含义。</strong>最小二乘在 <Katex tex="\ln y" /> 上做，最小化的是相对误差的平方和，不再是 <Katex tex="y" /> 的绝对误差。原来 <Katex tex="y" /> 小的地方在变换后权重更大，回代到原坐标时可能有系统性偏差。</li>
        <li><strong>提示二：<Katex tex="y\le 0" /> 或 <Katex tex="x\le 0" /> 时对数无定义。</strong>幂函数型要求两个变量都为正；指数型只要求 <Katex tex="y>0" />。</li>
        <li><strong>提示三：不要对「取对数后拟合出的直线」直接报 <Katex tex="R^2" />。</strong>那是变换空间的解释力，不是原空间的。要比较模型优劣，回到原坐标算残差。</li>
        <li><strong>提示四：参数相近不等于模型正确。</strong>三种模型（线性、指数、幂）在有限区间上都能大致贴合，模型的选取要靠机理与残差形状，不能只看相关系数。</li>
      </ul>
    </div>
    <p>回收与预告：拟1 给出直线的两个公式，本章只是换一组坐标再套用它。逼1 起进入函数逼近：不再用一条曲线去贴近样本点，而是用一个多项式去贴近一个已知函数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCurveFit } from '../../../boards/numeric/fit/curvefit.js';
import { NF_CHAPTERS } from './nfnav.js';
</script>
