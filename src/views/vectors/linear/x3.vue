<template>
  <ChPage :cur="3" no="向3" base="/vectors/x" :chapters="VX_CHAPTERS"
    title="数乘与共线向量"
    sub="一个向量连加若干次，方向不变、长度按次数放大；这个「若干次」可以推广到任意实数，得到数乘。数乘把长度与方向分开处理：绝对值管长度，正负管方向。由它立刻得到共线向量的判定。"
    :toc="[{ id: 'x3-def', t: '数乘的定义与运算律' }, { id: 'x3-coll', t: '共线向量定理' }, { id: 'x3-coord', t: '坐标下的判定' }, { id: 'x3-pit', t: '唯一性、同向与零向量' }]">
    <div class="note good" id="x3-def">实数 <Katex tex="\lambda" /> 与向量 <Katex tex="\vec a" /> 的乘积仍是一个向量，记作 <Katex tex="\lambda\vec a" />，它的模为 <Katex tex="|\lambda||\vec a|" />。当 <Katex tex="\lambda>0" /> 时与 <Katex tex="\vec a" /> 同向，当 <Katex tex="\lambda<0" /> 时与 <Katex tex="\vec a" /> 反向，当 <Katex tex="\lambda=0" /> 或 <Katex tex="\vec a=\vec 0" /> 时得到零向量。</div>
    <div class="board-wrap">
      <BoardMount :factory="createScaleLab" />
      <div class="cap">图 向3 · <b>数乘与共线</b>：蓝色是 <Katex tex="\vec a" />，金色一支是 <Katex tex="\lambda\vec a" />，绿色是 <Katex tex="\vec b" />。看点：拖动 λ 滑块越过 0，金色箭头在原点处翻向反面，长度按 <Katex tex="|λ|" /> 伸缩；把绿箭头的终点拖到蓝箭头的延长线上，共线徽章给出 <Katex tex="\vec b=\lambda\vec a" /> 中的那个倍数，拖偏一点则横排判定的差不为零。</div>
    </div>

    <h3 class="sec" id="x3-def">数乘的定义与运算律</h3>
    <p>三个 <Katex tex="\vec a" /> 相加，按三角形法则首尾相接三次，得到一支与 <Katex tex="\vec a" /> 同向、长度是三倍的箭头，记作 <Katex tex="3\vec a" />。一般地，实数 <Katex tex="\lambda" /> 与向量 <Katex tex="\vec a" /> 相乘，结果仍然是一个向量：<Katex tex="|\lambda|" /> 把长度伸缩，<Katex tex="\lambda" /> 的正负把方向定下来。这一条把「伸长缩短」与「正反朝向」两件事分开，图 向3 的判读按区间逐段说明。</p>
    <p>数乘与向量加法之间有两条分配律：<Katex tex="\lambda(\vec a+\vec b)=\lambda\vec a+\lambda\vec b" />，以及 <Katex tex="(\lambda+\mu)\vec a=\lambda\vec a+\mu\vec a" />；还有结合律 <Katex tex="\lambda(\mu\vec a)=(\lambda\mu)\vec a" />。它们在图上都能验证：先把两支箭头各自伸缩再相加，与先把两支箭头接起来再整体伸缩，得到的是同一支箭头。</p>

    <h3 class="sec" id="x3-coll">共线向量定理</h3>
    <p>数乘的结果总与原向量共线，因为伸缩与反向只改长度与朝向，不离开原来那条直线。反过来也成立：<strong>若 <Katex tex="\vec a\ne\vec 0" />，则 <Katex tex="\vec b" /> 与 <Katex tex="\vec a" /> 共线，当且仅当存在唯一实数 <Katex tex="\lambda" /> 使 <Katex tex="\vec b=\lambda\vec a" />。</strong></p>
    <p>两个方向都说一遍。若 <Katex tex="\vec b=\lambda\vec a" />，由数乘的定义立刻知道两者共线。若两向量共线且 <Katex tex="\vec a\ne\vec 0" />，取 <Katex tex="\lambda=\pm\dfrac{|\vec b|}{|\vec a|}" />，同向取正、反向取负，就得到 <Katex tex="\vec b=\lambda\vec a" />。唯一性来自长度与方向同时被固定：若另有一个 <Katex tex="\mu" /> 也满足，则 <Katex tex="\lambda\vec a=\mu\vec a" />，移项得 <Katex tex="(\lambda-\mu)\vec a=\vec 0" />，而 <Katex tex="\vec a\ne\vec 0" />，只能 <Katex tex="\lambda=\mu" />。</p>
    <p>定理里 <Katex tex="\vec a\ne\vec 0" /> 这个条件不能丢：若 <Katex tex="\vec a=\vec 0" />，则对任何 <Katex tex="\lambda" /> 都有 <Katex tex="\lambda\vec a=\vec 0" />，<Katex tex="\vec b=\vec 0" /> 时实数取几个都行，唯一性被破坏，定理只剩下「共线」那一半。</p>

    <h3 class="sec" id="x3-coord">坐标下的判定</h3>
    <p>设 <Katex tex="\vec a=(x_1,y_1)" />，<Katex tex="\vec b=(x_2,y_2)" />。若两向量共线，则存在 <Katex tex="\lambda" /> 使 <Katex tex="x_2=\lambda x_1" />、<Katex tex="y_2=\lambda y_1" />。把两式交叉相乘再相减，消去 <Katex tex="\lambda" />，得到 <Katex tex="x_1y_2-x_2y_1=0" />。这个式子也是坐标下共线的充要条件，图 向3 的共线徽章读的正是这个差：差为零给出倍率，差不为零则两向量不共线。</p>
    <p>要注意 <Katex tex="x_1y_2-x_2y_1=0" /> 判的是<strong>共线</strong>，不区分同向与反向；方向由倍率 <Katex tex="\lambda" /> 的正负单独读出。模也顺便有了关系：<Katex tex="|\vec b|=|\lambda||\vec a|" />。若 <Katex tex="\vec a\ne\vec 0" />，倍率可以写成 <Katex tex="\lambda=\dfrac{x_1x_2+y_1y_2}{x_1^2+y_1^2}" />，这个式子的分子分母在下一章会以「数量积」与「模的平方」的名字重新出现。</p>

    <h3 class="sec" id="x3-pit">唯一性、同向与零向量</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：倍率唯一要先排除零向量。</strong>命题「共线则倍数唯一」的前提是 <Katex tex="\vec a\ne\vec 0" />。若题目只说两向量共线，不能直接设 <Katex tex="\vec b=\lambda\vec a" /> 而不管 <Katex tex="\vec a" /> 是否为零，否则可能丢掉 <Katex tex="\vec a=\vec 0" /> 这一类情形。</li>
        <li><strong>提示二：共线不等于同向。</strong>倍率 <Katex tex="\lambda" /> 为负时两向量反向，仍然共线。判断三点共线时只看差为零就够；判断两支箭头是否同向，还要看 <Katex tex="\lambda>0" />。</li>
        <li><strong>提示三：<Katex tex="\lambda=0" /> 的乘积是零向量，不是数 0。</strong><Katex tex="0\cdot\vec a" /> 与 <Katex tex="\vec 0" /> 是同一个向量，不能写成数零；反过来 <Katex tex="\lambda\vec a=\vec 0" /> 只推出 <Katex tex="\lambda=0" /> 或 <Katex tex="\vec a=\vec 0" />，两条都要写出。</li>
        <li><strong>提示四：数乘的系数可以相加，但不能直接乘到坐标之外。</strong><Katex tex="\lambda(x,y)=(\lambda x,\lambda y)" /> 是逐分量进行，而 <Katex tex="\lambda(\vec a+\vec b)" /> 要先把两个向量的坐标相加再乘系数；两种顺序的结果相同，但中间步骤不能漏掉分量。</li>
      </ul>
    </div>
    <p>回收与预告：向1 说零向量平行于任何向量，向3 的定理正是这一规定的用处——它是唯一让「共线 ⟺ 倍数」出现例外的地方。下一子专题把不共线的两个向量取作基，证明平面内任一向量都能写成它们的线性组合，坐标运算由此展开；数量积则在模与夹角上再补一层度量。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createScaleLab } from '../../../boards/vectors/linear/scalelab.js';
import { VX_CHAPTERS } from './vxnav.js';
</script>
