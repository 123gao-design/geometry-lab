<template>
  <ChPage :cur="5" no="P5" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="蒙日圆：垂直切线的交点轨迹" sub="椭圆的两条互相垂直的切线，其交点从不在椭圆附近闲逛 —— 它们被精确关押在一个圆上：$x^2+y^2=a^2+b^2$。这是 T1 切线速查表、L1 相切判据与 L3 极线的三方合演。"
    :toc="[{ id: 'p5-lab', t: '蒙日圆（图 P5）' }, { id: 'p5-der', t: '推导 · 六行代数' }, { id: 'p5-fam', t: '家族版本 · 抛物线与双曲线' }, { id: 'p5-use', t: '高考落点与回收' }]">
    <div class="note good"><strong>蒙日圆定理</strong>：椭圆 <Katex tex="\tfrac{x^2}{a^2}+\tfrac{y^2}{b^2}=1" /> 的两条<strong>互相垂直</strong>的切线，其交点 M 的轨迹是圆 <Katex tex="x^2+y^2=a^2+b^2" />（半径 <Katex tex="\sqrt{a^2+b^2}&gt;a" />，与椭圆同心）。反之，该圆上每一点恰好向椭圆发出一对垂直切线。</div>

    <h3 class="sec" id="p5-lab">蒙日圆</h3>
    <div class="board-wrap">
      <BoardMount :factory="createMonge" />
      <div class="cap">图 P5 · <b>蒙日圆</b>：拖 M 任意走 —— 两条切线由极线（切点弦）现场求出。把 M 拖到金色圆上：两切线恰好成直角，右角标记现身，<strong>两块读数同时变绿</strong>；按「巡游」让 M 贴圆走一整圈，垂直关系纹丝不动。</div>
    </div>

    <h3 class="sec" id="p5-der">推导：六行代数</h3>
    <p>全部工具来自 T1 切线速查表（L1 判别式给出的那条）：斜率为 k 的切线满足 <Katex tex="m^2=a^2k^2+b^2" />。设两条垂直切线的斜率为 <Katex tex="k" /> 与 <Katex tex="-\tfrac{1}{k}" />：</p>
    <Katex tex="l_1:\ y=kx+m_1,\quad m_1^2=a^2k^2+b^2;\qquad l_2:\ y=-\tfrac{x}{k}+m_2,\quad m_2^2=\tfrac{a^2}{k^2}+b^2" display />
    <p>联立解交点（两式相减消 y）：</p>
    <Katex tex="x=\frac{k\,(m_2-m_1)}{1+k^2},\qquad y=\frac{m_1+k^2m_2}{1+k^2}" display />
    <p>平方相加，交叉项 <Katex tex="\mp2k^2m_1m_2" /> 恰好对消：</p>
    <Katex tex="x^2+y^2=\frac{m_1^2+k^2m_2^2}{1+k^2}=\frac{(a^2k^2+b^2)+k^2\big(\frac{a^2}{k^2}+b^2\big)}{1+k^2}=a^2+b^2" display />
    <p>分母分子里的 <Katex tex="1+k^2" /> 一约而尽，<strong>k 与切点坐标全程没有出场</strong> —— 轨迹是定圆。反向也成立（把上式逐步倒读即可），故「垂直 <Katex tex="\iff" /> 在圆上」。</p>

    <h3 class="sec" id="p5-fam">家族版本：抛物线与双曲线</h3>
    <p><strong>抛物线 <Katex tex="y^2=2px" /></strong>：切线 <Katex tex="y=kx+\tfrac{p}{2k}" />（T1 表中抛物线行），垂直对 <Katex tex="y=-\tfrac{x}{k}-\tfrac{pk}{2}" />，联立解得 <Katex tex="x=-\tfrac{p}{2}" /> 与 k 无关 —— <strong>蒙日圆退化为准线</strong>（半径无穷大的圆）。顺手一证（L3 极线）：准线上点 M 的切点弦 <Katex tex="yy_0=p\big(x-\tfrac{p}{2}\big)" /> 恒过焦点 <Katex tex="\big(\tfrac{p}{2},0\big)" /> —— 准线、焦点、垂直切线在同一幅图里各就各位。</p>
    <p><strong>双曲线 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=1" /></strong>：切线 <Katex tex="m^2=a^2k^2-b^2" />（要求 <Katex tex="|k|&gt;\tfrac{b}{a}" />），同样的六行代数给出</p>
    <Katex tex="x^2+y^2=a^2-b^2" display />
    <p>半径为实需 <Katex tex="a&gt;b" />（即 <Katex tex="e&lt;\sqrt2" />，渐近线夹角为锐角）。<strong>等轴双曲线没有垂直切线对</strong>：切线斜率必须满足 <Katex tex="|k|&gt;1" />，而垂直伙伴 <Katex tex="-\tfrac1k" /> 又要求 <Katex tex="|k|&lt;1" />，矛盾 —— A4 的母本 <Katex tex="y=\tfrac{k}{x}" /> 因此没有蒙日圆；A5 的对勾函数（<Katex tex="1&lt;e&lt;\sqrt2" /> 恒成立）倒是一直有。</p>

    <h3 class="sec" id="p5-use">高考落点与回收</h3>
    <p><strong>存在性速判</strong>：椭圆 <Katex tex="\tfrac{x^2}{4}+\tfrac{y^2}{3}=1" /> 的蒙日圆是 <Katex tex="x^2+y^2=7" />。问过点 (2, 1) 能否作两条垂直切线：<Katex tex="2^2+1^2=5\ne 7" />，不在圆上，<strong>不能</strong> —— 一步判定。轨迹题同理：已知两切线垂直求交点轨迹，答案直接记为 <Katex tex="a^2+b^2" />。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>别用 A1 抄圆的答案：圆的垂直切线交点轨迹是半径 <Katex tex="\sqrt2\,r" /> 的圆，但「垂直」不是仿射不变量 —— 压扁后原来垂直的切线不再垂直，蒙日圆 <Katex tex="\sqrt{a^2+b^2}" /> 并非 <Katex tex="\sqrt2\,a" /> 的仿射像（<Katex tex="a=2,\ b=\sqrt3" /> 时前者 <Katex tex="\sqrt7\approx 2.65" />，后者 <Katex tex="2\sqrt2\approx 2.83" />）。角度失守，A1 的不变清单里没有它。</p>
    </div>
    <p><strong>回收</strong>：T1 切线速查表（<Katex tex="m^2=a^2k^2\pm b^2" /> 本就是 L1 判别式的相切判据）、L3 极线（画板里切线全由切点弦直接求出）、L5 定点问题（垂直切线对是「过定点曲线族」的典型成员）、P2 交轨法（蒙日圆=交点扫出的集合，轨迹思想的完结实例）、A4/A5（等轴与非等轴双曲线在此分类）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMonge } from '../../../boards/conics/locus/monge.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
