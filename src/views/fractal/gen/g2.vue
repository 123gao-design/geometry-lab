<template>
  <ChPage :cur="2" no="生2" base="/fractal/g" :chapters="FG_CHAPTERS"
    title="L 系统与分枝"
    sub="给一个初始字符串和几条替换规则，每代同时替换所有字符，再把结果当成龟的行进指令。F 画线，加减号转向，方括号分叉——一条规则就能长出一棵树。"
    :toc="[{ id: 'g2-rewrite', t: '并行重写' }, { id: 'g2-turtle', t: '龟行解释' }, { id: 'g2-plant', t: '从草到树' }, { id: 'g2-tip', t: '四条提示' }]">
    <div class="note good"><b>L 系统</b>由字母表、初始串（公理）与产生式组成。每一代把串中每个字符按产生式<b>同时</b>替换，不做顺序依赖。把结果交给龟：<Katex tex="F" /> 前进并画线，<Katex tex="+" />、<Katex tex="-" /> 按固定角度左转、右转，<Katex tex="[" /> 压栈保存位置与朝向，<Katex tex="]" /> 出栈恢复。科赫曲线、分形草、二叉分枝都能用三五条规则写出。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLSystem" />
      <div class="cap">图 生2 · <b>L 系统龟行机</b>：三种规则，层数逐代展开。看点：① 雪花曲线每代线段数乘 4，与科赫曲线同一套折角；② 分形草用方括号分出侧枝，主茎仍在向前；③ 二叉分枝把 <Katex tex="F" /> 换成两个 <Katex tex="F" />、把 <Katex tex="X" /> 换成带分枝的串，层数加到 5 就长成树冠。</div>
    </div>

    <h3 class="sec" id="g2-rewrite">并行重写</h3>
    <p>L 系统与形式语言里的文法很像，区别在替换方式：文法一次只改一处，L 系统每一代把所有字符同时改掉。第 <Katex tex="n" /> 代的串由第 <Katex tex="n-1" /> 代逐字替换得到，长度通常按指数增长。</p>
    <p>科赫曲线写成 <Katex tex="F\mapsto F+F--F+F" />，初始串 <Katex tex="F" />，转角 60 度。第一代得到 4 个 <Katex tex="F" />，第二代 16 个，与手工折线的段数完全对应。</p>
    <p>雪花用初始串 <Katex tex="F--F--F" />，三条边同时替换，闭合形状自然出现。规则里没有一处直接写「三角形」，三角形的结构由转角与初始串共同决定。</p>

    <h3 class="sec" id="g2-turtle">龟行解释</h3>
    <p>把字符串读成动作序列：<Katex tex="F" /> 沿当前朝向前进一步并留下线段；<Katex tex="+" /> 左转、<Katex tex="-" /> 右转，转角是系统的参数；方括号把当前位置与朝向压栈，遇到 <Katex tex="]" /> 再取回。</p>
    <p>压栈一出栈，侧枝画完就回到分叉点，主茎继续往前。没有方括号，所有枝条会首尾相接成一条长链；有了方括号，树才有主干与侧枝的层次。</p>
    <p>画板先按规则展开字符串，再用龟走一遍，最后按所有线段的包围盒自动缩放。层数每加一，线段数按规则中的 <Katex tex="F" /> 个数相乘，图形在同一个轮廓里加密。</p>

    <h3 class="sec" id="g2-plant">从草到树</h3>
    <p>规则 <Katex tex="F\mapsto F[+F]F[-F]F" /> 每代把一段茎换成「一段主茎、左右各一枝、再一段主茎」。层数加到 4，形状像一丛草；把转角调小、把 <Katex tex="F" /> 换成 <Katex tex="FF" />，同一套机制长出细长的枝条。</p>
    <p>二叉分枝用两个非终结符：<Katex tex="X\mapsto F[+X]F[-X]+X" /> 负责分叉，<Katex tex="F\mapsto FF" /> 负责把每段茎拉长。初始串只有一个 <Katex tex="X" />，几代之后就成为树冠。</p>
    <p>植物学家用 L 系统描述真实的叶序与分枝模式：主茎、侧芽、花序都能对应到符号与产生式。计算机图形学里的树木生成，多数从这套重写系统出发，再叠加随机扰动与光照。</p>

    <h3 class="sec" id="g2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：替换是同时的。</strong>每一代用上一代的串整体替换，不能在同一个串里边替换边读取，否则结果依赖字符顺序。</li>
        <li><strong>提示二：方括号必须配对。</strong>多一个 <Katex tex="]" /> 会取空栈，少一个 <Katex tex="]" /> 会让后面的枝条叠在错误的起点上。检查时先数括号。</li>
        <li><strong>提示三：非终结符不画线。</strong><Katex tex="X" />、<Katex tex="Y" /> 这类字母只参与替换，龟遇到时不前进。把它们误当成 <Katex tex="F" />，主干会多出一截。</li>
        <li><strong>提示四：层数不能无限加。</strong>串长按指数增长，层数每加一，计算量与线段数成倍上涨。图上看着还在同一轮廓内，实际线段数早已翻了几番。</li>
      </ul>
    </div>
    <p>回收与预告：IFS 与 L 系统都是「用短规则生成复杂图形」。自然界里的海岸线、云、血管并不严格自相似，却在一段尺度范围内呈现同样的幂律。下一章把尺子带到真实世界，量一量海岸线到底有多长。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLSystem } from '../../../boards/fractal/gen/lsys.js';
import { FG_CHAPTERS } from './fgnav.js';
</script>
