<template>
  <ChPage :cur="1" no="M1" base="/trig/m" :chapters="M_CHAPTERS"
    title="和差公式" sub="两角和与差的展开 —— $\cos(\alpha-\beta)$ 由单位圆上一根弦的两种表达式推出，sin、tan 全部由它派生。"
    :toc="[{ id: 'm1-chord', t: '弦长两式：$\\cos(\\alpha-\\beta)$ 的来源' }, { id: 'm1-sin', t: 'sin 展开：换名推导' }, { id: 'm1-tan', t: 'tan 展开与排除预警' }, { id: 'm1-pit', t: '符号、排除与任意角' }]">
    <div class="note good" id="m1-law"><strong>和差公式全体</strong>：<Katex tex="\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta" />；<Katex tex="\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta" />；<Katex tex="\tan(\alpha\pm\beta)=\dfrac{\tan\alpha\pm\tan\beta}{1\mp\tan\alpha\tan\beta}" />。全站只推一次 —— 其余都是换名与换角的代数练习。</div>
    <ConicFigure number="M1" title="弦长的两种求法" head="bottom" :factory="createLab">单位圆上 <Katex tex="P(\alpha)"/>、<Katex tex="Q(\beta)"/> 拖动，橙弦 <strong><Katex tex="d"/></strong> 的长有两种表达式 —— <strong>坐标距离式</strong>（<RouterLink class="xref" to="/trig/u1">单位圆定义与三角函数线</RouterLink>的坐标展开）与<strong>余弦定理式</strong>（夹角 <Katex tex="\alpha-\beta"/>）；两种表达式记同一根弦，<Katex tex="\cos(\alpha-\beta)"/> 的展开式随即得到。「<Katex tex="\alpha\leftrightarrow\beta" />」互换按钮验证偶性：式子纹丝不动。</ConicFigure>

    <h3 class="sec" id="m1-chord">弦长两式：<Katex tex="\cos(\alpha-\beta)"/> 的来源</h3>
    <p>两种表达式各写一遍：</p>
    <p><Katex display tex="\text{①坐标距离式：}\quad d^2=(\cos\alpha-\cos\beta)^2+(\sin\alpha-\sin\beta)^2=2-2(\cos\alpha\cos\beta+\sin\alpha\sin\beta)" /></p>
    <p><Katex display tex="\text{②余弦定理式：}\quad d^2=1^2+1^2-2\cdot1\cdot1\cdot\cos(\alpha-\beta)=2-2\cos(\alpha-\beta)" /></p>
    <p>同一根弦，两种表达式必须相等 —— 抵消后就是定理框里那条金式。<strong>这是全站三角公式唯一一次「从头推」</strong>：<RouterLink class="xref" to="/trig/u1">单位圆定义与三角函数线</RouterLink>给了 <Katex tex="P" />、<Katex tex="Q" /> 的坐标，<RouterLink class="xref" to="/trig/b2">弧度制</RouterLink>给了角的度量，余弦定理是初中遗产。按「<Katex tex="\alpha\leftrightarrow\beta" />」互换：<Katex tex="d" /> 不变（弦只认夹角），式子两边都不动 —— <Katex tex="\cos(\alpha-\beta)" /> 是<strong>偶函数</strong>，<RouterLink class="xref" to="/trig/i1">诱导公式</RouterLink>的镜像结论在此复现。再把 <Katex tex="\beta" /> 拖到 <Katex tex="0" />：<Katex tex="Q" /> 落在 <Katex tex="(1,0)" />，式子退化为 <Katex tex="\cos\alpha=\cos\alpha\cdot1+\sin\alpha\cdot0" /> —— 自检通过。</p>
    <p><strong>加号的变体</strong>：把 β 换成 −β，用偶性立得 <Katex tex="\cos(\alpha+\beta)=\cos\alpha\cos\beta-\sin\alpha\sin\beta" />。注意符号反转发生在「加号版」—— 这正是下一节提示一的出处。</p>

    <h3 class="sec" id="m1-sin">sin 展开：换名推导</h3>
    <p><Katex tex="\sin" /> 的两条展开不另起炉灶，用<RouterLink class="xref" to="/trig/i2">互配两组与奇变偶不变</RouterLink>的互配组 <strong><Katex tex="\cos(\pi/2-x)=\sin x"/></strong> 换名即可：</p>
    <p><Katex display tex="\sin(\alpha+\beta)=\cos\Bigl[\tfrac{\pi}{2}-(\alpha+\beta)\Bigr]=\cos\Bigl[(\tfrac{\pi}{2}-\alpha)-\beta\Bigr]=\underbrace{\cos(\tfrac{\pi}{2}-\alpha)}_{\sin\alpha}\cos\beta+\underbrace{\sin(\tfrac{\pi}{2}-\alpha)}_{\cos\alpha}\sin\beta" /></p>
    <p>也就是 <Katex tex="\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta" />；把 β 换 −β 得减版。诱导公式的真正用途在此显现：它不是孤立的「符号游戏」，而是让 <Katex tex="\cos(\alpha-\beta)" /> 一条推导推出全部公式的<strong>换名法</strong>。<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>的坐标定义（横 <Katex tex="\cos" /> 纵 <Katex tex="\sin" />）与上一章的「<Katex tex="\pi/2" /> 互配」都为此作了铺垫。</p>

    <h3 class="sec" id="m1-tan"><Katex tex="\tan" /> 展开与排除预警</h3>
    <p><Katex tex="\tan" /> 不用图推，做除法：<Katex tex="\tan(\alpha+\beta)=\sin(\alpha+\beta)/\cos(\alpha+\beta)"/>，分子分母同除 <Katex tex="\cos\alpha\cos\beta" />：</p>
    <p><Katex display tex="\tan(\alpha+\beta)=\frac{\tan\alpha+\tan\beta}{1-\tan\alpha\tan\beta},\qquad \tan(\alpha-\beta)=\frac{\tan\alpha-\tan\beta}{1+\tan\alpha\tan\beta}" /></p>
    <p>分母 <Katex tex="1-\tan\alpha\tan\beta=0" /> ⟺ <Katex tex="\tan\alpha\tan\beta=1" /> ⟺ <Katex tex="\alpha+\beta"/> 距 <Katex tex="\pi/2+k\pi"/> —— 此时 <Katex tex="\cos(\alpha+\beta)=0"/>，<Katex tex="\tan(\alpha+\beta)"/> 排除。板上把 <Katex tex="\alpha"/>、<Katex tex="\beta"/> 拨到 <Katex tex="\pi/4"/> 与 <Katex tex="\pi/4"/> 即可看到预警读数变红：公式不是失效，是<strong>分母先归零</strong>，<RouterLink class="xref" to="/trig/q2">和差化积与辅助角</RouterLink>会给出绕行方案。</p>

    <h3 class="sec" id="m1-pit">符号、排除与任意角</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：符号的反直觉。</strong>减号版 <Katex tex="\cos(\alpha-\beta)"/> 两项<strong>全是加号</strong>；加号版 <Katex tex="\cos(\alpha+\beta)"/> 反而出减号 —— 记「减得加、加得减」不如记推导：余弦定理里本来就有个减号。</li>
        <li><strong>提示二：tan 分母为零。</strong><Katex tex="\alpha+\beta=\pi/2+k\pi"/> 时 <Katex tex="\tan(\alpha+\beta)"/> 无定义，硬套公式会得到 <Katex tex="0/0"/> —— 先查分母再动笔。</li>
        <li><strong>提示三：<Katex tex="\alpha" />、<Katex tex="\beta" /> 是任意角。</strong>推导画的图是锐角，但两种表达式按<RouterLink class="xref" to="/trig/u1">单位圆定义与三角函数线</RouterLink>的坐标定义对任意角都成立（弦长只认终边方向）—— 别把适用范围缩回第一象限。</li>
      </ul>
    </div>
    <p>和差公式是后面几章的源头：下一讲把 <Katex tex="\beta" /> 换成 <Katex tex="\alpha" />，得<strong>倍角</strong>（<RouterLink class="xref" to="/trig/n1">倍角公式</RouterLink>）；两行公式相加减，得<strong>积化和差</strong>（<RouterLink class="xref" to="/trig/q1">积化和差：加减消元</RouterLink>）；反向换元，得<strong>和差化积</strong>（<RouterLink class="xref" to="/trig/q2">和差化积与辅助角</RouterLink>）。这一条弦公式，就是后面全部公式的来源。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/sumdiff/cosdiff.js';
import { M_CHAPTERS } from './mnav.js';
</script>
