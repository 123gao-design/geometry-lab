<template>
  <ChPage :cur="5" no="S5" base="/functions/s" :chapters="S_CHAPTERS"
    title="对称性专题：抽象式与由一半写另一半" sub="对称点的函数值相等时，图象关于竖直轴对称。对应值互为相反数时，对称中心在横轴上。"
    :toc="[{ id: 's5-def', t: '两条判定式（图 S5）' }, { id: 's5-half', t: '由一半写另一半' }, { id: 's5-trap', t: '三处易错' }]">
    <div class="note good" id="s5-def"><strong>轴对称的判定式</strong>：若对一切 x 都有 <Katex tex="f(a+x)=f(b-x)" />，则图象关于直线 <Katex tex="x=\tfrac{a+b}{2}" /> 对称；<strong>中心对称的判定式</strong>：把等号换成 <Katex tex="f(a+x)+f(b-x)=0" />，则图象关于点 <Katex tex="\left(\tfrac{a+b}{2},\ 0\right)" /> 对称。反过来也成立（充要）。证明只是代入：令 <Katex tex="u=x+\tfrac{b-a}{2}" />，则 <Katex tex="a+u" /> 变成 <Katex tex="x+\tfrac{a+b}{2}" />、<Katex tex="b-u" /> 变成 <Katex tex="\tfrac{a+b}{2}-x" />，两条式子分别化为 <Katex tex="f(c+x)=f(c-x)" /> 与 <Katex tex="f(c+x)+f(c-x)=0" />（<Katex tex="c=\tfrac{a+b}{2}" />）—— 一切对称信息都锁在 a、b 的<strong>中点</strong>里。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSymTrans" />
      <div class="cap">图 S5 · <b>对称轴与对称中心</b>。移动关于 x=2 等距的取样点并比较两个函数值。切到只给出半支的例子，观察对称性如何确定另一半。</div>
    </div>

    <h3 class="sec" id="s5-half">由一半写另一半</h3>
    <p>若图象关于 <Katex tex="x=t" /> 对称，且 <Katex tex="x\ge t" /> 时 <Katex tex="f(x)=g(x)" />，则左侧满足 <Katex tex="f(x)=f(2t-x)=g(2t-x)" />。图 S5 ③ 中 <Katex tex="t=2" />、<Katex tex="g(x)=(x-3)^2" />，所以左侧表达式是 <Katex tex="g(4-x)=(1-x)^2" />，两段在 (2,1) 相接。</p>
    <p>同一台机器也管「读轴」：见 <Katex tex="f(1+x)=f(3-x)" />，轴是 <Katex tex="x=\tfrac{1+3}{2}=2" />；见 <Katex tex="f(x+2)=f(4-x)" />？先换元成标准形 —— 两翼端点的中点 <Katex tex="\tfrac{(x+2)+(4-x)}{2}=3" />，轴 <Katex tex="x=3" />，与 x 无关（式子里 x 消掉了才叫对称式）。二次函数的已有结论在这里同样成立：<Katex tex="f(x)=ax^2+bx+c" /> 配方 <Katex tex="f(x)=a\left(x+\tfrac{b}{2a}\right)^2+\cdots" />，轴 <Katex tex="x=-\tfrac{b}{2a}" /> —— 图 S5 ④ 拖 m 验收的就是这条：式子要的轴是 2，自有轴 <Katex tex="x=-\tfrac{m}{2}" />，两者重合 ⟺ <Katex tex="m=-4" />。</p>

    <h3 class="sec" id="s5-trap">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把式子里的 a、b 读成轴。</strong><Katex tex="f(a+x)=f(b-x)" /> 的轴不是 a、不是 b、更不是 a+b，而是中点 <Katex tex="\tfrac{a+b}{2}" /> —— 两翼端点 a+x 与 b−x 的中点。图 S5 ① 的 1 和 3 都在图象上，轴却在 2；用探针两翼读一读，比背口诀牢。</li>
        <li><strong>提示二：整体代入被拆开。</strong>「由一半写另一半」最容易错在 ② 步：把 <Katex tex="g(2t-x)" /> 拆成 <Katex tex="g(x)-2t" /> 之类不成立的规则。代入是「换名」不是「分配」—— 2t−x 是一个整体进 g 的括号；算完别忘了另一半答案要带范围（x&lt;t）。</li>
        <li><strong>提示三：对称与周期混为一谈。</strong><Katex tex="f(a+x)=f(b-x)" /> 是<strong>翻折</strong>重合（对称），<Katex tex="f(x+T)=f(x)" /> 是<strong>平移</strong>重合（周期）—— 长得像双胞胎，方向完全不同。好消息是它们能互相换算（两条对称轴能推出周期），这正是下一讲 S6 的主角。</li>
      </ul>
    </div>
    <p>回收与预告：S3 的 y 轴折叠是本章 <Katex tex="a=-1,\ b=1" /> 的特例（轴 <Katex tex="x=0" />）；C5 的位移机器里「<Katex tex="f(x)+h" /> 上下平移」保持对称轴不动 —— 对称轴跟着水平平移走，<Katex tex="f(x+k)" /> 把轴送到 <Katex tex="x=t-k" />。下一讲 S6 周期性专题：两条对称轴相距 <Katex tex="d" /> <Katex tex="\Longrightarrow" /> 周期 <Katex tex="T=2d" />，对称信息直接换算出周期。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSymTrans } from '../../../boards/functions/properties/symtrans.js';
import { S_CHAPTERS } from './snav.js';
</script>

<style src="./preset-row.css"></style>
