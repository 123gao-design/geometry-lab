<template>
  <ChPage :cur="1" no="性1" base="/inequalities/p" :chapters="P_CHAPTERS"
    title="不等式的性质：变形中的方向" sub="实数大小关系的根本定义是作差：$a-b>0\iff a>b$，一切性质都是这条定义经合法变形的推论 —— 同加减任意实数次序不变；同乘除时符号起决定作用：乘正保序、乘负反序、乘零归零。每条性质都有正用（化简变形）与逆用（放缩、估算）两个方向。"
    :toc="[{ id: 'p1-src', t: '性质的来源：作差定义' }, { id: 'p1-four', t: '四条常用性质' }, { id: 'p1-chain', t: '传递性与运算规则' }, { id: 'p1-use', t: '应用：性质的逆用' }, { id: 'p1-pit', t: '乘负、倒数与同向相乘' }]">
    <div class="note good" id="p1-law">作差定义：<Katex tex="a>b\iff a-b>0" />。可加性：<Katex tex="a>b\iff a+c>b+c" />；可乘性：<Katex tex="a>b,\ c>0\Rightarrow ac>bc" />、<Katex tex="a>b,\ c<0\Rightarrow ac<bc" />；传递性：<Katex tex="a>b,\ b>c\Rightarrow a>c" /> —— 加减与传递无条件成立，乘除必须先定 c 的符号。</div>
    <div class="board-wrap">
      <BoardMount :factory="createKO" />
      <div class="cap">图 性1 · <b>保序变形</b>：金点 a、蓝点 b 是原位置，橙点 a′、红点 b′ 是变形后的位置；选四种变形、拖 c 或点 ⏩ 让 c 扫过零。看点：同加减时两点整体平移、间距不变；同乘负数时两点按比例穿过原点、左右互换，方向当场反转；c=0 时不等号退化为等号。</div>
    </div>

    <h3 class="sec" id="p1-src">性质的来源：作差定义</h3>
    <p>数轴上右边的数大（J1 的序关系），代数上翻译成一条定义：<Katex tex="a-b>0\iff a>b" />。性质清单不是新的公理，而是这条定义的推论：证可加性只须一步 —— <Katex tex="(a+c)-(b+c)=a-b" />，差没变，大小关系自然不变。图 性1 的数轴把这件事画成几何：加 c 是两点整体平移（减 c 即加 <Katex tex="-c" />，同理）；乘 c 是以原点为中心的缩放，<Katex tex="c>0" /> 时两点保持在原点同侧、次序不变，<Katex tex="c<0" /> 时两点一起被映到对侧、左右互换。理解了几何来源，「乘负反序」就不必死记。</p>

    <h3 class="sec" id="p1-four">四条常用性质</h3>
    <p><strong>对称性</strong> <Katex tex="a>b\iff b<a" />：不等号两边交换则方向掉头，写「反之亦然」时用的就是它。<strong>传递性</strong> <Katex tex="a>b,\ b>c\Rightarrow a>c" />：数轴上三点次序的代数化，链式比较以此为据。<strong>可加性</strong>：两边同加减任意实数方向不变，而且是双向等价 —— 移项的合法性全在这里：移项就是把某一项加到两边。<strong>可乘性</strong>：必须按 c 的符号分类，这是不等式与等式行为的分水岭 —— 等式两边随便乘，不等式乘负要掉头；<Katex tex="c=0" /> 时两边同变为 0，不等号退化为等号，原不等式携带的大小信息全部失去（图 性1 把 c 拖到 0 即见）。</p>

    <h3 class="sec" id="p1-chain">传递性与运算规则</h3>
    <p>两条同向不等式可以相加：<Katex tex="a>b,\ c>d\Rightarrow a+c>b+d" />（两个正差相加仍正）；相减须先转成同向：<Katex tex="a>b,\ c<d\Rightarrow a-c>b-d" />（<Katex tex="c<d" /> 即 <Katex tex="-c>-d" />，再相加）。乘法规则限制更多：两边同正才可同向相乘 <Katex tex="a>b>0,\ c>d>0\Rightarrow ac>bd" />；正数两边可乘方、开方 <Katex tex="a>b>0\Rightarrow a^n>b^n,\ \sqrt[n]{a}>\sqrt[n]{b}" />。这些规则全部可由作差验证 —— 例如 <Katex tex="a^n-b^n=(a-b)(a^{n-1}+a^{n-2}b+\cdots+b^{n-1})" />，第二个因子在 a、b 同正时为正，差的符号由 <Katex tex="a-b" /> 决定。记结论不如会推导：每条规则都问一句「差的符号由什么决定」。</p>

    <h3 class="sec" id="p1-use">应用：性质的逆用</h3>
    <p>判断变形是否成立，是性质的典型考法。<Katex tex="a>b\Rightarrow\tfrac{1}{a}<\tfrac{1}{b}" />？不成立 —— 反例 a=1、b=−1，倒数反而保持大小；补上同号条件才成立（见下节提示二）。<Katex tex="a>b\Rightarrow a^3>b^3" />？成立 —— 幂函数 <Katex tex="y=x^3" /> 在 ℝ 上单调递增（S1：这里性质的代数面貌正是函数的单调性）。<Katex tex="a>b\Rightarrow ac^2>bc^2" />？不成立 —— <Katex tex="c=0" /> 时两边相等；补 <Katex tex="c\ne 0" /> 即真。逆用的另一形态是放缩：已知 <Katex tex="a>b" /> 时主动写出 <Katex tex="a+c>b+c" /> 或（b>0 时）<Katex tex="ab>b^2" />，把估计往目标方向推进 —— 这是子专题四放缩法的全部技术基础。</p>

    <h3 class="sec" id="p1-pit">乘负、倒数与同向相乘</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：乘除不查符号。</strong>两边同乘一个符号未定的式子（含参数、含未知数）时必须分正、负、零讨论 —— 图 性1 的「同乘 c」把 c 从正拖到负，方向反转就是反例现场。</li>
        <li><strong>提示二：倒数反向想当然。</strong><Katex tex="\tfrac{1}{a}-\tfrac{1}{b}=\tfrac{b-a}{ab}" />：倒数的差由 b−a 与 ab 共同决定 —— a、b 同号（ab&gt;0）时倒数确实反序；a、b 异号时正数的倒数仍正、负数的倒数仍负，大小关系没有反转。所以「大数的倒数小」须以同号为前提。</li>
        <li><strong>提示三：同向相乘忘了同正。</strong>a=1&gt;b=0 与 c=−2&gt;d=−3 都成立，但 <Katex tex="ac=-2<0=bd" /> —— 两条同向不等式相乘，须两边都限定为正。</li>
      </ul>
    </div>
    <p>性质回答「变形之后方向如何保持」；下一章把作差本身升格为方法 —— 比较两个代数式的大小，差的符号是唯一的判据。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createKO } from '../../../boards/inequalities/prop/keeporder.js';
import { P_CHAPTERS } from './pnav.js';
</script>
