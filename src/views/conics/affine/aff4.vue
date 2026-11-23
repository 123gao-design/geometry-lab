<template>
  <ChPage :cur="4" no="A4" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="双曲线与反比例函数：母曲线" sub="$y=k/x$ 的图象就是双曲线 —— 不止如此：一切（标准位置的）中心双曲线都是它的仿射像。矩形被变换成平行四边形、两条坐标轴被变换成渐近线；等轴双曲线则只差一个旋转 $45^\circ$。仿射家族的母本谱系，在此立起 —— 后两讲再把它剪斜、一般化。"
    :toc="[{ id: 'a4-lab', t: '反比例函数作母本（图 A4）' }, { id: 'a4-der', t: '推导 · 把双曲线压回 $y=1/x$' }, { id: 'a4-eq', t: '等轴特例 · 旋转 $45^\circ$ 与 $e=\\sqrt2$' }, { id: 'a4-use', t: '速递与回收' }]">
    <div class="note good"><strong>本讲主角</strong>：反比例函数 <Katex tex="y=\tfrac{k}{x}" />，即 <Katex tex="xy=k" />。它的图象是双曲线 —— 而且是整个双曲线家族的<strong>母本</strong>：对任意 <Katex tex="a,\ b>0" />，可逆线性变换 <Katex tex="T(u,v)=\big(\tfrac{a(u+v)}{2},\ \tfrac{b(u-v)}{2}\big)" /> 把 <Katex tex="uv=1" /> 逐点变换到 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=1" /> 上。要找双曲线的性质？先在母本上考察。</div>

    <h3 class="sec" id="a4-lab">反比例函数作母本</h3>
    <ConicFigure head="bottom" number="A4" title="反比例函数与双曲线的点位对应" :factory="createRecipHyp"
      :legend="[['green', '反比例函数'], ['mint', '双曲线'], ['gold', '对应面积']]">
      左是母本 <Katex tex="y=1/x" />（两条渐近线就是坐标轴），右是目标双曲线。拖动 Q 沿母本跑：面积恒为 1 的矩形被变换成平行四边形，<Katex tex="P=T(Q)" /> 始终落在双曲线上，两条坐标轴被变换成渐近线方向 <Katex tex="(a,\ \pm b)" />。把 a 拖到与 b 相等：渐近线夹角回到 <Katex tex="90^\circ" />，变换只剩正交变换+均匀放缩 —— <strong>相似</strong>；<Katex tex="a\ne b" /> 时夹角不保，必须真仿射。
    </ConicFigure>
    <p>这一步是 A1 伸缩变换的"斜切版"：伸缩变换把<strong>圆</strong>变成椭圆（保住对称轴），这里的斜切把<strong>反比例函数</strong>变成双曲线（保住渐近线结构）。不变量清单（A1）在这里逐条兑现：相切、共线、平行、比例、中点全部保持，唯独角度与长度不保持 —— 所以母本里"垂直的两条渐近线"到像里可以不垂直。</p>

    <h3 class="sec" id="a4-der">推导：把双曲线压回 <Katex tex="y=1/x" /></h3>
    <p>对双曲线 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=1" /> 作可逆线性替换（逆变换就是 T）：</p>
    <Katex tex="u=\frac{x}{a}+\frac{y}{b},\qquad v=\frac{x}{a}-\frac{y}{b}\quad\Longrightarrow\quad uv=\frac{x^2}{a^2}-\frac{y^2}{b^2}" display />
    <p>方程右端逐字就是这个乘积，于是双曲线 <strong>就是</strong> <Katex tex="uv=1" />，即 <Katex tex="y=1/x" /> —— 两者只隔一层坐标替换，而坐标替换正是仿射变换的代数形式（A1 的"可逆线性替换不改根的重数"在此续写）。</p>
    <p><strong>渐近线的仿射来源</strong>由此随之成立：母本的两条渐近线是 u=0 与 v=0（坐标轴）。轴的像：u=0 上的点 <Katex tex="(0,\ v)" /> 被送到方向 <Katex tex="\big(\tfrac{a}{2}v,\ -\tfrac{b}{2}v\big)\parallel(a,\ -b)" />；v=0 被送到方向 (a, b)。所以像双曲线的渐近线是</p>
    <Katex tex="y=\pm\frac{b}{a}\,x" display />
    <p>D2 里背的渐近线公式，原来就是"母本坐标轴的像"—— 不是巧合，是平移。同理母本上 <Katex tex="|uv|=1" /> 恒定（矩形面积不变量），到像里读作 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=1" /> 恒定：曲线上的点永远满足方程，这本是显然的，但"面积不变"的几何说法在大学里发展为双曲角的定义（P1b 埋下的双曲函数伏笔在此得到部分验证）。</p>

    <h3 class="sec" id="a4-eq">等轴特例：旋转 <Katex tex="45^\circ" /> 与 <Katex tex="e=\sqrt2" /></h3>
    <p>a = b 时 T 里"各向异性缩放"退化为均匀缩放，只剩正交部分（旋转/翻折）—— 母本与像是<strong>相似</strong>的。这类双曲线叫<strong>等轴双曲线</strong>（<Katex tex="x^2-y^2=m" />）。对 <Katex tex="xy=k" /> 直接旋转 45°（换轴 <Katex tex="X=\tfrac{x+y}{\sqrt2},\ Y=\tfrac{y-x}{\sqrt2}" />）：</p>
    <Katex tex="xy=\frac{X^2-Y^2}{2}=k\quad\Longrightarrow\quad X^2-Y^2=2k" display />
    <p>于是高考三连立得：<strong>等轴 <Katex tex="\iff" /> 渐近线互相垂直 <Katex tex="\iff" /> 离心率 <Katex tex="e=\sqrt2" /></strong>（D4 的特例值有了出处）。一般地，两条渐近线方向 <Katex tex="(a,\ b)" /> 与 <Katex tex="(a,\ -b)" /> 的夹角满足</p>
    <Katex tex="\cos\varphi=\frac{a^2-b^2}{a^2+b^2},\qquad e=\frac{\sqrt{a^2+b^2}}{a}" display />
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>经典双答案题：已知双曲线渐近线夹角为 60°，求离心率。由 <Katex tex="\cos\varphi=\pm\tfrac12" /> 解得 <Katex tex="a^2=3b^2" /> 或 <Katex tex="b^2=3a^2" />，对应 <Katex tex="e=\tfrac{2\sqrt3}{3}" /> 或 <Katex tex="e=2" /> —— 两个都对。夹角 60° 分不清"实轴开口大"还是"渐近线张角取劣角"，务必分情况。这正是 A1 边界条款的直接例证：<strong>夹角是相似不变量，但不是仿射不变量</strong> —— 相似（a=b）固定 90°，仿射可以任意张合。</p>
    </div>

    <h3 class="sec" id="a4-use">速递与回收</h3>
    <table>
      <tbody>
        <tr><th>结论</th><th>在母本里看</th><th>在像里读</th></tr>
        <tr><td>离心率（<Katex tex="e=\sqrt2" /> 判据）</td><td><Katex tex="y=k/x" /> 旋转后 <Katex tex="a=b" /></td><td>等轴双曲线离心率 <Katex tex="\sqrt2" />；渐近线垂直 <Katex tex="\iff" /> 等轴</td></tr>
        <tr><td>矩形面积不变量</td><td><Katex tex="|uv|=|k|" /> 恒定</td><td>点与两条渐近线"坐标"的乘积恒定（双曲角的基础）</td></tr>
        <tr><td>渐近线方程</td><td>两条坐标轴</td><td><Katex tex="y=\pm\tfrac{b}{a}x" />（轴的像）</td></tr>
        <tr><td>平行与比例</td><td>矩形对边平行</td><td>像必是平行四边形（A1 不变清单）</td></tr>
      </tbody>
    </table>
    <p><strong>回收</strong>：A1 的不变量清单（相切/平行/比例保持，角度不保持）、A3 的面积变换方法（母本里的比较可以整体平移到像里）、D2 的渐近线（轴的像）、D4 的 <Katex tex="e=\sqrt2" />（等轴特判）、P1b 的双曲函数伏笔（双曲角 = 面积）在此全部得到印证。</p>
    <p>最后把仿射家族的谱系写全：<strong>圆是椭圆的母本，<Katex tex="y=k/x" /> 是双曲线的母本</strong>；而抛物线一族自给自足 —— <strong>所有抛物线彼此相似</strong>（离心率恒为 1，参数 p 被均匀放缩吸收），它自己就是自己的母本。不变量清单、点差法、面积 <Katex tex="\pi ab" />、母曲线，四件工具齐备；下一讲 A5 对母本作剪切变换 —— 对勾函数由 <Katex tex="y=k/x" /> 剪切得到。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRecipHyp } from '../../../boards/conics/affine/reciphyp.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
