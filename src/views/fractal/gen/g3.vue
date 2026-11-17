<template>
  <ChPage :cur="3" no="生3" base="/fractal/g" :chapters="FG_CHAPTERS"
    title="分形与自然"
    sub="海岸线有多长？换一把更短的尺子，答案就变长。量出的长度按幂律随尺长变化，指数里藏着海岸线的维数——分形几何正是从这个问题进入自然科学的。"
    :toc="[{ id: 'g3-coast', t: '海岸线悖论' }, { id: 'g3-law', t: '幂律与维数' }, { id: 'g3-apps', t: '自然与应用' }, { id: 'g3-tip', t: '四条提示' }]">
    <div class="note good">用长度为 <Katex tex="\varepsilon" /> 的尺子沿曲线量长度，得到 <Katex tex="L(\varepsilon)" />。若曲线在尺度 <Katex tex="\varepsilon" /> 下约有 <Katex tex="N(\varepsilon)\propto\varepsilon^{-D}" /> 段，则 <Katex display tex="L(\varepsilon)=N(\varepsilon)\varepsilon\propto\varepsilon^{1-D}." /> 在双对数坐标里，<Katex tex="\ln L" /> 对 <Katex tex="\ln(1/\varepsilon)" /> 的斜率是 <Katex tex="1-D" />，由此读出维数 <Katex tex="D" />。英国西海岸的读数约为 1.25。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCoast" />
      <div class="cap">图 生3 · <b>海岸线与尺长</b>：左图用橙色折线尺沿海岸走，右图是双对数散点与拟合直线。看点：① 尺长 <Katex tex="\varepsilon" /> 每减半，量出的 <Katex tex="L" /> 就往上跳一截；② 斜率稳定在 0.26 附近，加 1 得维数 1.26；③ 尺长缩到最小时，测得长度逼近科赫曲线的总长，曲线本身却还在无限加密。</div>
    </div>

    <h3 class="sec" id="g3-coast">海岸线悖论</h3>
    <p>拿圆规沿海岸线一步一步量，每一步张开固定长度 <Katex tex="\varepsilon" />。步子越小，绕过的海湾与岬角越多，总步数增加，量出的长度变长。换一把更短的尺子，答案继续变长，没有收敛的迹象。</p>
    <p>曼德博在 1967 年把这个观察写成论文，引用了理查森整理的海岸线数据。英格兰西海岸的测量值从约 1.2 倍直线距离一路涨到 2 倍以上，完全取决于尺长。传统几何里「长度」是曲线的固有属性，这里却依赖测量方式。</p>
    <p>出路不是找一把无限短的尺子，而是承认长度随尺度按幂律变化。把不同尺长下的测量值画成双对数图，点几乎落在一条直线上，斜率为负，大小由海岸的曲折程度决定。</p>

    <h3 class="sec" id="g3-law">幂律与维数</h3>
    <p>设尺长 <Katex tex="\varepsilon" /> 时需要 <Katex tex="N(\varepsilon)" /> 步，海岸线长度 <Katex tex="L(\varepsilon)=\varepsilon N(\varepsilon)" />。若 <Katex tex="N(\varepsilon)\approx c\,\varepsilon^{-D}" />，则</p>
    <p style="text-align:center"><Katex display tex="L(\varepsilon)\approx c\,\varepsilon^{1-D}." /></p>
    <p>取对数：<Katex tex="\ln L=\ln c+(1-D)\ln\varepsilon" />。以 <Katex tex="\ln(1/\varepsilon)" /> 为横轴，斜率就是 <Katex tex="D-1" />；斜率越陡，维数越高，海岸越曲折。普通光滑曲线的 <Katex tex="D=1" />，长度与尺长无关；海岸线的 <Katex tex="D" /> 略大于 1。</p>
    <p>科赫曲线是这条幂律的精确模型：<Katex tex="D=\ln4/\ln3\approx1.262" />，画板测出的斜率约 0.26，与 1.262 对得上。真实海岸不是严格自相似，但在几公里到几百公里的尺度范围内，幂律近似得相当好。</p>

    <h3 class="sec" id="g3-apps">自然与应用</h3>
    <p>肺的支气管分叉、血管网络、神经元树突，都在有限空间里铺开巨大的表面积，维数介于 2 与 3 之间。山脉轮廓、云层边界、闪电路径、材料断口，也常呈现分形特征，用维数作为粗糙度的量化指标。</p>
    <p>工程上的用法很直接：分形天线把折线结构印在有限面积里，让同一条天线覆盖多个频段；分形图像压缩用 IFS 参数代替像素块；多孔介质的渗流模型用维数描述孔隙的连通方式。</p>
    <p>要留一分克制。自然对象只在有限的尺度范围内近似自相似，超出范围（分子尺度、行星尺度）幂律就断了。分形是描述粗糙程度的模型，不是断言自然界的每一层都无限复制同一个图案。</p>

    <h3 class="sec" id="g3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：斜率加 1 才是维数。</strong>双对数图里 <Katex tex="\ln L" /> 对 <Katex tex="\ln(1/\varepsilon)" /> 的斜率是 <Katex tex="D-1" />。把斜率直接当维数，会少算 1。</li>
        <li><strong>提示二：尺长范围要选对。</strong>幂律只在中间一段尺度成立。尺子太长，量不出细节；太短，碰到原子或像素分辨率，直线弯曲。取中间段做拟合。</li>
        <li><strong>提示三：分形维数不是唯一指标。</strong>两条海岸线可以维数相同、形状完全不同。维数只记录「随尺度变化的速率」，不记录具体形状。</li>
        <li><strong>提示四：模型有适用范围。</strong>自然分形是统计意义上的近似，不是严格的数学自相似集。用它做预测时，先确认尺度范围与误差可以接受。</li>
      </ul>
    </div>
    <p>回收与预告：从自相似集到维数，从典型图形到生成算法，再到真实世界的海岸线，分形几何的主线走完了。下一站换一套语言：不再问「形状多粗糙」，而问「变换之下什么保持不变」——射影几何。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoast } from '../../../boards/fractal/gen/coast.js';
import { FG_CHAPTERS } from './fgnav.js';
</script>
