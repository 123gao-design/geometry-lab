<template>
  <ChPage :cur="1" no="R1" base="/functions/r" :chapters="R_CHAPTERS"
    title="零点：数、式、图三种身份" sub="f(c)=0（数）、方程 f(x)=0 的根（式）、曲线与 x 轴交点的横坐标（图）—— 三种语言说的是同一个数 c，而零点是数、不是点。"
    :toc="[{ id: 'r1-def', t: '定义与三语言（图 R1）' }, { id: 'r1-iso', t: '易错清单' }, { id: 'r1-val', t: '值域视角与预告' }]">
    <div class="note good" id="r1-def"><strong>零点</strong>：设函数 <Katex tex="y=f(x)" /> 的定义域为 D，若 <Katex tex="c\in D" /> 使 <Katex tex="f(c)=0" />，则称 c 为 f 的零点。<strong>数</strong> —— <Katex tex="f(c)=0" /> 代入验证成立；<strong>式</strong> —— x=c 是方程 <Katex tex="f(x)=0" /> 的实根；<strong>图</strong> —— 曲线与 x 轴交点 <Katex tex="(c,\,0)" /> 的<strong>横坐标</strong>。判定只认第一条，后两条是「解方程」与「看图」的两种途径 —— 图 R1 的探针落在金点上时，三个徽章同时点亮，说的都是同一个 c。</div>
    <div class="board-wrap">
      <BoardMount :factory="createZeroLang" />
      <div class="cap">图 R1 · <b>零点的图象判读</b>：曲线按 f 的符号分色（绿 = <Katex tex="f>0"/>、红 = <Katex tex="f<0"/>）—— <strong>颜色交界的穿轴处就是零点</strong>。① 整根 −1、3 一读就对上；② 三个无理根，探针只能靠近、永远落不上（<Katex tex="f(c)=0"/> 要求严格成立）—— 逼出 R3 二分法与 R4 牛顿法；③ <Katex tex="1/x"/> 与 x 轴只渐近相望，永不相交，无零点；④ 二重零点：触轴不穿轴，两侧同为绿色 —— <Katex tex="f(a)f(b)<0"/> 检测不到它。</div>
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
    <p>回收与预告：C2 教的「先审定义域」是零点判定的前提；C3 的值域把「有无零点」翻译成「0 ∈ 值域」；R1 ② 的无理根探针拖不上 —— 但端点异号的保证能把区间对半缩到它头上：下一讲 R2 先立「存在性定理」，R3 再把它变成可执行的算法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createZeroLang } from '../../../boards/functions/zeros/zerolang.js';
import { R_CHAPTERS } from './znav.js';
</script>
