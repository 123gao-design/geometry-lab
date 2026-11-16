<template>
  <ChPage :cur="2" no="性2" base="/inequalities/p" :chapters="P_CHAPTERS"
    title="比较大小：作差与作商" sub="作差法把比较大小化归为定符号：$a-b>0\iff a>b$，对一切实数成立，功夫全在变形 —— 通分、因式分解、配方，把差整理成符号明确的因子乘积。作商法以 1 为基准，只适用于同号两数：同正时商大于 1 即 a>b，同负时结论恰好相反；异号时不须比较。"
    :toc="[{ id: 'p2-diff', t: '作差法：三步定号' }, { id: 'p2-quot', t: '作商法：同号才可用' }, { id: 'p2-form', t: '变形手段：分解、配方与有理化' }, { id: 'p2-link', t: '与后续章节的连接' }, { id: 'p2-pit', t: '平方与倒数' }]">
    <div class="note good" id="p2-law">作差：<Katex tex="a-b>0\iff a>b" />（对一切实数成立）。作商：<Katex tex="a,b>0:\ \tfrac{a}{b}>1\iff a>b" />；<Katex tex="a,b<0:\ \tfrac{a}{b}>1\iff a<b" />（同负时结论相反）；异号时不须比较，<Katex tex="b=0" /> 时作商失效。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCMP" />
      <div class="cap">图 性2 · <b>大小比较机</b>：拖 a、b 两滑块或点三个预设（同正 / 同负 / 异号），在「作差比零」「作商比一」两模式间切换。看点：作差永远可靠；作商在预设② 处给出警示 —— 两数同负时商大于 1，结论反而反转；异号时商为负，与 1 比较给不出结论。</div>
    </div>

    <h3 class="sec" id="p2-diff">作差法：三步定号</h3>
    <p>流程固定为三步：<strong>作差 → 变形 → 定号</strong>。例一：比较 <Katex tex="(x+1)(x+2)" /> 与 <Katex tex="(x-1)(x-3)" />，差 <Katex tex="=(x^2+3x+2)-(x^2-4x+3)=7x-1" />，符号随 x 变 —— <Katex tex="x>\tfrac17" /> 时前者大、<Katex tex="x<\tfrac17" /> 时后者大、相等处只有一点。例二：<Katex tex="x^2+3" /> 与 <Katex tex="3x" />，差 <Katex tex="=x^2-3x+3=(x-\tfrac32)^2+\tfrac34>0" />，配方后恒正，对一切 x 前者大。两个例子代表定号的两种结局：随参变号（须分类讨论）与恒定号（恒成立）—— 高次情形的定号由下一子专题的穿根法系统完成。</p>

    <h3 class="sec" id="p2-quot">作商法：同号才可用</h3>
    <p>同正时除以 b（正）不反序，<Katex tex="\tfrac{a}{b}>1\iff a>b" />；同负时除以 b（负）反序，<Katex tex="\tfrac{a}{b}>1\iff a<b" />（图 性2 预设② 现场演示）；异号时正数恒大于负数，不须比较；<Katex tex="b=0" /> 时作商直接失效。适用对象是「作商后能约分或化同底」的式子：同底幂 <Katex tex="\tfrac{3^{\sqrt3}}{3^{\sqrt2}}" /> 约成 <Katex tex="3^{\sqrt3-\sqrt2}>1" />、同指数幂 <Katex tex="\tfrac{2^{0.3}}{3^{0.3}}=(\tfrac23)^{0.3}<1" /> —— 指数单调性（E4）在此与比较法合流。</p>

    <h3 class="sec" id="p2-form">变形手段：分解、配方与有理化</h3>
    <p><strong>因式分解</strong>：差的每个因子符号已知，积的符号即可逐段读出 —— 这正是次2 穿根法的思想源头。<strong>配方</strong>：非负式加常数，恒成立型的标准形态。<strong>通分</strong>：分式比较的标准动作，通分时分子乘上的分母符号是隐藏的分类点。<strong>有理化</strong>：分子分母同乘共轭根式，把根号差转化为可定号的有理式。综合例：<Katex tex="\sqrt7+\sqrt5" /> 与 <Katex tex="2\sqrt6" /> 皆正，平方比较 <Katex tex="12+2\sqrt{30}" /> 与 <Katex tex="12+2\sqrt{35}" />，即比较 <Katex tex="\sqrt{30}" /> 与 <Katex tex="\sqrt{35}" /> —— 平方这一步合法，正因为两数同正（见提示一）。</p>

    <h3 class="sec" id="p2-link">与后续章节的连接</h3>
    <p>比较法是「证明不等式」的最基本工具：子专题三基本不等式的每一条证明都走作差 —— <Katex tex="a^2+b^2\ge 2ab" /> 即 <Katex tex="(a-b)^2\ge 0" /> 一步完成；J1 中 22/7 与 π 的大小是作差（或作商）的数值版本；放缩法（子专题四）是比较法在方向上的推广 —— 不求全等，只求把估计推向需要的一侧。工具箱里还有单调性：S1 的定义（任取 <Katex tex="x_1<x_2" /> 比大小）本身就是作差法的函数化表述。</p>

    <h3 class="sec" id="p2-pit">平方与倒数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：平方比较须同号非负。</strong>−3&lt;2 但 <Katex tex="9>4" /> —— 两数同负时平方反而反序；一正一负更无从比较。平方前先验两数同正（或同负时注意反序）。</li>
        <li><strong>提示二：倒数比较须同号。</strong>p1 提示二的公式 <Katex tex="\tfrac1a-\tfrac1b=\tfrac{b-a}{ab}" /> 在此复用：ab&gt;0 才有「倒数反序」。</li>
        <li><strong>提示三：作商忘同负反转。</strong>预设② 的 <Katex tex="\tfrac{-3}{-2}=1.5>1" /> 而 <Katex tex="-3<-2" /> —— 同负时商大于 1 结论取反，这是作商法最常见的失分点。</li>
      </ul>
    </div>
    <p>单个式子的比较至此完备；下一个子专题把比较的对象升级为整类二次式 —— 函数、方程、不等式在 Δ 与两根上汇合。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCMP } from '../../../boards/inequalities/prop/compare.js';
import { P_CHAPTERS } from './pnav.js';
</script>
