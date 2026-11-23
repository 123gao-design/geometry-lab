<template>
  <ChPage :cur="1" no="R1" base="/functions/r" :chapters="R_CHAPTERS"
    title="零点：数、式、图三种身份" sub="函数零点 c、方程的根和图象横轴交点的横坐标都由 f(c)=0 确定。"
    :toc="[{ id: 'r1-def', t: '定义与三语言（图 R1）' }, { id: 'r1-iso', t: '易错清单' }, { id: 'r1-val', t: '值域视角与预告' }]">
    <div class="note good" id="r1-def"><strong>零点</strong>：设函数 <Katex tex="y=f(x)" /> 的定义域为 D，若 <Katex tex="c\in D" /> 使 <Katex tex="f(c)=0" />，则称 c 为 f 的零点。<strong>数</strong> —— <Katex tex="f(c)=0" /> 代入验证成立；<strong>式</strong> —— x=c 是方程 <Katex tex="f(x)=0" /> 的实根；<strong>图</strong> —— 曲线与 x 轴交点 <Katex tex="(c,\,0)" /> 的<strong>横坐标</strong>。判定只认第一条，后两条是「解方程」与「看图」的两种途径 —— 图 R1 的探针落在金点上时，三个徽章同时点亮，说的都是同一个 c。</div>
    <div class="board-wrap">
      <BoardMount :factory="createZeroLang" />
      <div class="cap">图 R1 · <b>零点的图象判读</b>。比较穿过横轴和与横轴相切的零点。二重根两侧可以同号，因此只查变号会漏掉这类根。</div>
    </div>

    <h3 class="sec" id="r1-iso">易错清单</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把零点写成点。</strong>零点是数 c，不是点 (c, 0)；交点坐标是 (c, 0) 的形状，而零点取的是它的<strong>横坐标</strong> c —— 写答案时用数表示零点。</li>
        <li><strong>提示二：忘定义域。</strong>f(c)=0 的前提是 <Katex tex="c\in D" />：1/x 在 x=0 处连定义都没有，「f(0)=0」没有意义 —— 探针拖到 0，徽章显示无定义（图 R1 ③）。</li>
        <li><strong>提示三：二重零点使符号检查失效。</strong><Katex tex="f(x)=x^2" /> 的零点 0 两侧同为正号 —— 靠「符号改变」找零点的判据全部失效（图 R1 ④ 的曲线两侧同为绿色）。这类零点要用解析法（因式分解）或 V 系列的极值工具，而不是「试符号」。</li>
      </ul>
    </div>

    <h3 class="sec" id="r1-val">值域视角与预告</h3>
    <p>零点还有一个「值域版」身份：<strong>0 在 f 的值域里 <Katex tex="\iff"/> f 有零点</strong>（存在 c 使 <Katex tex="f(c)=0"/>，说的正是 0 被取到 —— C3 的值域扫描机在此复职）。于是「求零点个数」可以改问「x 轴这条水平线被曲线穿过几次」，「无零点」可以改读成「值域不含 0」—— 数形两把椅子随时换坐。</p>
    <p>图象可以用来定位零点的大致范围。精确结论还需要解析式、存在性条件或可控误差的数值方法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createZeroLang } from '../../../boards/functions/zeros/zerolang.js';
import { R_CHAPTERS } from './znav.js';
</script>
