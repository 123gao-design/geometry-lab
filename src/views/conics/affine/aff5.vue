<template>
  <ChPage :cur="5" no="A5" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="对勾函数：剪出来的双曲线" sub="$y=ax+b/x$ 的图象是货真价实的双曲线 —— A4 母本经「剪切」的像。离心率有一个十分简洁的公式：$e=\sec(\psi/2)$，只看勾的倾角 a，与 b 无关。对勾函数的高考考点（均值不等式）与双曲线的解析几何身份在此结合。"
    :toc="[{ id: 'a5-lab', t: '对勾函数与剪切（图 A5）' }, { id: 'a5-der', t: '推导 · 渐近线与剪切来源' }, { id: 'a5-e', t: '离心率 · 只看倾角' }, { id: 'a5-use', t: '勾底 ≠ 顶点 · 速递与回收' }]">
    <div class="note good"><strong>本讲主角</strong>：对勾函数（耐克函数）<Katex tex="y=ax+\dfrac{b}{x}\ (a>0,\ b>0)" />。移项得 <Katex tex="xy=ax^2+b" /> —— 一个二次型方程，双曲线。它是 A4 母本 <Katex tex="uv=b" /> 经<strong>剪切变换</strong> <Katex tex="T(u,v)=(u,\ v+au)" /> 的像（代回验证：<Katex tex="xy-a x^2=uv=b" /> ✓）。至此三种基本仿射变换集齐：<strong>伸缩</strong>（A1，圆→椭圆）、<strong>旋转</strong>（A4，反比例→等轴）、<strong>剪切</strong>（A5，反比例→对勾）。</div>

    <h3 class="sec" id="a5-lab">对勾函数与剪切</h3>
    <ConicFigure head="bottom" number="A5" title="对勾函数的渐近线、实轴与焦点" :factory="createHookHyp"
      :legend="[['mint', '双曲线'], ['gold', '实轴', 'dashed'], ['green', '渐近线夹角']]">
      焦点、实轴、顶点全套实时画出 —— 这不是示意图，是按公式直接生成的真双曲线。拖 P（或按「换支」换到另一支）验证第一定义（<Katex tex="|r_1-r_2|=2A" />），按「演化」看 a 从 0 增到 2.5：渐近线夹角 <Katex tex="\psi" /> 逐渐变窄，e 从 <Katex tex="\sqrt2" /> 递减到 1。注意绿点勾底与金点顶点<strong>不是同一个点</strong>。
    </ConicFigure>
    <p>画板里最反直觉的一幕：对勾函数的「最低点」（勾底，均值不等式的等号处）并不是双曲线的顶点。顶点在<strong>角平分线</strong>（实轴）上、是曲线上离中心最近的点；勾底只是切线放平的地方。两个头衔，两个主人。</p>

    <h3 class="sec" id="a5-der">推导：渐近线与剪切来源</h3>
    <p>看无穷远，扔掉常数 b：二次部分 <Katex tex="ax^2-xy=x\,(ax-y)" /> —— 两条渐近线直接现形：</p>
    <Katex tex="x=0\qquad\text{与}\qquad y=ax" display />
    <p>这与 A4 完全同构：母本的两条渐近线是坐标轴，剪切 <Katex tex="(u,\,v)\mapsto(u,\ v+au)" /> 把 u 轴（v=0）剪斜成直线 y=ax，把 v 轴（u=0）原样留在 x=0 —— <strong>渐近线是轴的像</strong>，在剪切下照旧成立。两条渐近线的锐夹角（记 ψ）随 a 连续变化：</p>
    <Katex tex="\psi=90^\circ-\arctan a" display />
    <p><Katex tex="a=0" /> 时 <Katex tex="\psi=90^\circ" />：剪切退化为恒等，回到 A4 的母本 <Katex tex="y=b/x" />（等轴，<Katex tex="e=\sqrt2" />）；a 越大，勾越歪，<Katex tex="\psi" /> 越窄。</p>

    <h3 class="sec" id="a5-e">离心率：只看倾角</h3>
    <p>离心率不需要旋转展开就能拿全 —— 三步：<strong>①</strong> 双曲线的实轴平分两条渐近线的夹角（画板里两焦点始终落在角平分线上，即证据）；<strong>②</strong> 主轴系里渐近线与实轴夹角是 ψ/2，而渐近线斜率恰是 <Katex tex="\tfrac{B}{A}" />，故 <Katex tex="\tan\tfrac{\psi}{2}=\tfrac{B}{A}" />；<strong>③</strong> 代入离心率定义：</p>
    <Katex tex="e=\sqrt{1+\Big(\frac{B}{A}\Big)^2}=\sec\frac{\psi}{2},\qquad \tan\frac{\psi}{2}=\sqrt{1+a^2}-a" display />
    <p>最后一步是半角公式两行：<Katex tex="\tan\big(45^\circ-\tfrac{\arctan a}{2}\big)=\sqrt{1+a^2}-a" />（分子分母同乘 <Katex tex="\sqrt{1+a^2}+a" />，乘积为 1）。于是</p>
    <Katex tex="e^2=1+\big(\sqrt{1+a^2}-a\big)^2=2\sqrt{1+a^2}\,\big(\sqrt{1+a^2}-a\big)" display />
    <p><strong>b 全程没有出场</strong> —— e 只由勾的倾角 a 决定，b 只管整体缩放（标准形里 <Katex tex="A^2=2b(\sqrt{1+a^2}+a)" />、<Katex tex="B^2=2b(\sqrt{1+a^2}-a)" />、<Katex tex="c^2=4b\sqrt{1+a^2}" />，全部随 b 同倍放大）。三个刻度点：</p>
    <table>
      <tbody>
        <tr><th>特例</th><th>渐近线夹角 ψ</th><th>离心率 e</th><th>身份</th></tr>
        <tr><td><Katex tex="a=0" />（y=b/x）</td><td>90°</td><td><Katex tex="\sqrt2" /></td><td>A4 母本回归（等轴）</td></tr>
        <tr><td><Katex tex="a=1" />（y=x+1/x）</td><td>45°</td><td><Katex tex="\sqrt{4-2\sqrt2}\approx1.082" /></td><td>最经典的对勾</td></tr>
        <tr><td><Katex tex="a\to\infty" /></td><td>→0°</td><td>→1</td><td>渐近线几乎平行：抛物线极限（D4 谱系末端）</td></tr>
      </tbody>
    </table>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>① 同 a 异 b 的对勾彼此相似</strong>：均匀缩放 <Katex tex="\sqrt{b_2/b_1}" />，这是 A4 相似判据（夹角是相似不变量）的又一例。</li>
        <li><strong>② 一般式 <Katex tex="y=ax+\tfrac{b}{x}" />（ab&lt;0 或 a&lt;0 皆同）的 e 只依赖 |a|</strong>：a&lt;0 时两条渐近线换成 x=0 与 y=ax（在第二、四象限），夹角公式取 |a| 即可，e 公式原样成立。</li>
      </ul>
    </div>

    <h3 class="sec" id="a5-use">勾底 ≠ 顶点 · 速递与回收</h3>
    <p><strong>勾底</strong>（均值不等式视角）：<Katex tex="y=ax+\tfrac{b}{x}\ge 2\sqrt{ab}" />，等号在 <Katex tex="x=\sqrt{b/a}" /> —— 此处切线水平。<strong>顶点</strong>（解析几何视角）：在实轴（角平分线）上，坐标 <Katex tex="\big(\sqrt{b/\sqrt{1+a^2}},\ (a+\sqrt{1+a^2})\sqrt{b/\sqrt{1+a^2}}\big)" />，此处切线垂直于实轴。a 越大勾收得越紧，两点越靠近（<Katex tex="a\to\infty" /> 时收敛到抛物线极限的同一顶点）；<Katex tex="a\to 0" /> 时顶点留在 <Katex tex="(\sqrt b,\ \sqrt b)" /> 附近，勾底却趋向无穷 —— 母本 <Katex tex="y=b/x" /> 没有最小值点，<strong>勾底是剪切带来的新结果</strong>。</p>
    <p><strong>回收</strong>：A4 的母本（<Katex tex="a=0" /> 极限）、A1 的不变量清单（剪切也是仿射：相切/中点/平行照用，角度不保 <Katex tex="\to\ \psi" /> 才会动）、D2 的第一定义（画板 <Katex tex="|r_1-r_2|=2A" /> 实时验）、D4 的 e 谱系（<Katex tex="\sqrt2\to 1" /> 的两端正是等轴与抛物线）、T1 的顶点切线（<Katex tex="\perp" /> 实轴）。三种基本仿射变换至此集齐：母本 <Katex tex="y=1/x" /> 在伸缩、旋转、剪切下生成全部中心双曲线，谱系表写在 A4 结尾；下一讲 A6 推进到最一般情形 —— 任意二次方程怎么化回标准形。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHookHyp } from '../../../boards/conics/affine/hookhyp.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
