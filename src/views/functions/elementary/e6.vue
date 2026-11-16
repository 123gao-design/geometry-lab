<template>
  <ChPage :cur="6" no="E6" base="/functions/e" :chapters="E_CHAPTERS"
    title="指与对：互为反演" sub="$y=a^x$ 与 $y=\log_a x$ 同底成对 —— 图象关于 $y=x$ 对折重合：一个正运算、一个逆运算，横纵坐标整体对调。五条性质的互换在这一刻有了几何解释。"
    :toc="[{ id: 'e6-inv', t: '反演镜：坐标对调（图 E6）' }, { id: 'e6-prop', t: '互反的性质对照表' }, { id: 'e6-cmp', t: '与折缝的交点与同框比较' }]">
    <div class="note good" id="e6-inv"><strong>互为反函数</strong>：<Katex tex="y=a^x" /> 与 <Katex tex="y=\log_a x" />（同底）互为反函数 —— 把 y=a^x 里的 x、y <strong>对调</strong>再解出 y，就得到 <Katex tex="x=a^y" /> 即 <Katex tex="y=\log_a x" />。几何上，点 (t, a^t) 与 (a^t, t) 关于直线 y=x 互为镜像，所以<strong>两图象关于 y=x 对称</strong>；代数上，<Katex tex="\log_a(a^t)=t" /> —— 先正运算再逆运算，回到原地。</div>
    <div class="board-wrap">
      <BoardMount :factory="createMirror" />
      <div class="cap">图 E6 · <b>指对反演镜</b>：金虚线 <Katex tex="y=x" /> 是折缝（等单位取景，<Katex tex="45^\circ" /> 才是 <Katex tex="45^\circ" />）。把手 P 锁在指数上，镜像点 <Katex tex="P'=(a^t,\ t)" /> 落在对数上 —— 红虚线正是「对折」的动作线。灰点 <Katex tex="(0,1)" /> 与 <Katex tex="(1,0)" /> 互为镜像：恒过点也互换。③ 预设 <Katex tex="a=\sqrt{2}" /> 与折缝恰有交点（<Katex tex="(\sqrt{2})^4=4" />）。</div>
    </div>

    <h3 class="sec" id="e6-prop">互反的性质对照表</h3>
    <p>五条性质的「整列互换」现在全部对上：<strong>定义域与值域对调</strong>（指数输入 R、输出 (0,+∞)，对数输入 (0,+∞)、输出 R —— 一个的值域恰是另一个的定义域）；<strong>恒过点对调</strong>（(0,1) ↔ (1,0)）；<strong>渐近线对调</strong>（水平 y=0 ↔ 竖直 x=0）；<strong>单调性同号</strong> —— a&gt;1 时同增、0&lt;a&lt;1 时同减，镜像不改变升降方向（y=x 这条斜率为正的镜子，翻不出减函数来）。图 E6 的徽章实时回代：log_a(a^t)=t，误差在 10⁻⁶ 级以下。</p>

    <h3 class="sec" id="e6-cmp">与折缝的交点与同框比较</h3>
    <p>指数与对数都和 <Katex tex="y=x" /> 有交点吗？对数侧：<Katex tex="a>1" /> 时 <Katex tex="\log_a x" /> 在 <Katex tex="x=1" /> 处已到 0、之后虽增却慢 —— 与 <Katex tex="y=x" /> 恰有一个交点。指数侧：要求 <Katex tex="a^x=x" /> 有解，需 a 落在 <Katex tex="(1,\ e^{1/e}]" />（约 1.445）内 —— ② <Katex tex="a=2" /> 与 ① <Katex tex="a=\tfrac{1}{2}" /> 的蓝线都与折缝无交点，③ <Katex tex="a=\sqrt{2}" /> 恰好擦着过（交于 <Katex tex="x=2" /> 与 <Katex tex="x=4" />，因为 <Katex tex="(\sqrt{2})^4=4" />）。于是「指对同框比较大小」的关键就是这条折缝：<Katex tex="a^x" /> 在 <Katex tex="y=x" /> 之下当且仅当 <Katex tex="\log_a x" /> 在其之上，两线关于 <Katex tex="y=x" /> 对称。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：以为互反会翻增减。</strong>反函数保持单调性（同增同减）—— 镜像改变的是图象位置，不改变单调性。</li>
        <li><strong>提示二：反函数的定义域要单独声明。</strong><Katex tex="a^{\log_a x}=x" /> 只对 x&gt;0 成立，超出对数的定义域就失效。</li>
        <li><strong>提示三：把 y=x 当对称轴记成 y=−x。</strong>坐标对调 (x,y)→(y,x) 对应的是 y=x；y=−x 对应 (x,y)→(−y,−x) 那种「中心翻」，不是这里的反演。</li>
      </ul>
    </div>
    <p>回收与预告：C1 机器观早就留了位置 —— 正运算是「输入 <Katex tex="x" />、输出 <Katex tex="a^x" />」，逆运算是「输入 <Katex tex="a^x" />、输出 <Katex tex="x" />」；E4、E5 的五条性质互换由本章统一解释。往后 G3 的「关于 <Katex tex="y=x" /> 翻折」是同一动作的一般化；V 系列里 <Katex tex="\exp" /> 与 <Katex tex="\ln" /> 互为反函数的导数关系 <Katex tex="(\ln x)'=\dfrac{1}{x}" /> 将成为微积分最常走的往返通道。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMirror } from '../../../boards/functions/elementary/invmirror.js';
import { E_CHAPTERS } from './enav.js';
</script>
