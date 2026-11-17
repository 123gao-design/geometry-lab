<template>
  <ChPage :cur="1" no="基1" base="/vectors/b" :chapters="VB_CHAPTERS"
    title="平面向量基本定理"
    sub="平面内的向量有无穷多个，但只要取定两个不共线的向量，其余每一个都能由它们拼出来，而且拼法唯一。这一条把几何里的「作平行线」翻译成代数里的「一对系数」，坐标由此成立。"
    :toc="[{ id: 'b1-th', t: '定理与基底' }, { id: 'b1-why', t: '存在与唯一' }, { id: 'b1-coef', t: '基底下的系数' }, { id: 'b1-pit', t: '共线、零向量与基底选择' }]">
    <div class="note good" id="b1-def">如果 <Katex tex="\vec e_1" />、<Katex tex="\vec e_2" /> 是同一平面内两个<strong>不共线</strong>的向量，那么对这一平面内的任一向量 <Katex tex="\vec a" />，存在唯一的一对实数 <Katex tex="\lambda_1,\lambda_2" />，使 <Katex tex="\vec a=\lambda_1\vec e_1+\lambda_2\vec e_2" />。不共线的两个向量 <Katex tex="\vec e_1,\vec e_2" /> 叫做这一平面内所有向量的<strong>一个基底</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBasisVec" />
      <div class="cap">图 基1 · <b>平面向量基本定理</b>：蓝色、橙色两支是不共线的基底，绿色是目标向量 <Katex tex="\vec p" />。看点：金色折线从原点沿 <Katex tex="\vec e_1" /> 走 <Katex tex="x" /> 步、再沿 <Katex tex="\vec e_2" /> 走 <Katex tex="y" /> 步到达 <Katex tex="\vec p" /> 的终点，系数徽章读的正是这对步数；切到 ③，两支基向量落到同一条直线上，系数就解不出来了。</div>
    </div>

    <h3 class="sec" id="b1-th">定理与基底</h3>
    <p>在平面上取定两个不共线的向量，好比给平面配了一副坐标架。故事实上并不依赖直角：只要两向量不共线，就能撑开整个平面。定理说的就是这件事：任一向量 <Katex tex="\vec a" /> 都能写成 <Katex tex="\vec e_1" /> 与 <Katex tex="\vec e_2" /> 的实数倍之和，而这一对倍数是唯一的。</p>
    <p>「基底」这个词强调两个要点。<strong>不共线</strong>是硬条件——两支箭头若落在同一条直线上，它们只能拼出这条直线上的向量，平面就撑不开。基底<strong>不唯一</strong>——同一平面可以取许多组基底，直角坐标的那组 <Katex tex="\vec e_1=(1,0)" />、<Katex tex="\vec e_2=(0,1)" /> 只是其中最方便的一组。</p>

    <h3 class="sec" id="b1-why">存在与唯一</h3>
    <p><strong>存在性</strong>可以画出来。把 <Katex tex="\vec a" />、<Katex tex="\vec e_1" />、<Katex tex="\vec e_2" /> 的起点都放在 <Katex tex="O" />，过 <Katex tex="\vec a" /> 的终点分别作 <Katex tex="\vec e_1" />、<Katex tex="\vec e_2" /> 的平行线，与另一条基向量所在的直线各交于一点。这两个交点连同 <Katex tex="O" /> 与 <Katex tex="\vec a" /> 的终点围成一个平行四边形，两条邻边正好是 <Katex tex="\vec e_1" />、<Katex tex="\vec e_2" /> 的若干倍。图 基1 的金色折线画的就是这个平行四边形：先沿 <Katex tex="\vec e_1" /> 走，再沿 <Katex tex="\vec e_2" /> 走。</p>
    <p><strong>唯一性</strong>用反证。设 <Katex tex="\vec a" /> 有两组系数：<Katex tex="\lambda_1\vec e_1+\lambda_2\vec e_2=\mu_1\vec e_1+\mu_2\vec e_2" />。移项得 <Katex tex="(\lambda_1-\mu_1)\vec e_1+(\lambda_2-\mu_2)\vec e_2=\vec 0" />。若 <Katex tex="\lambda_2\ne\mu_2" />，就能解出 <Katex tex="\vec e_2=-\dfrac{\lambda_1-\mu_1}{\lambda_2-\mu_2}\vec e_1" />，即两支基向量共线，与前提矛盾；所以 <Katex tex="\lambda_2=\mu_2" />，同理 <Katex tex="\lambda_1=\mu_1" />。基底不共线这个条件，恰好就是唯一性用得到的地方。</p>

    <h3 class="sec" id="b1-coef">基底下的系数</h3>
    <p>系数 <Katex tex="\lambda_1,\lambda_2" /> 就是向量 <Katex tex="\vec a" /> 在这组基底下的<strong>坐标</strong>。取标准基底 <Katex tex="\vec e_1=(1,0)" />、<Katex tex="\vec e_2=(0,1)" />，任意向量 <Katex tex="(x,y)" /> 就写成 <Katex tex="x\vec e_1+y\vec e_2" />。换一组基底，同一个向量的系数会变，向量本身不变——图 基1 的 ① 与 ② 两支绿箭头是同一个 <Katex tex="\vec p" />，系数徽章读出的却是两对数。</p>
    <p>从坐标求系数，就是解一个二元一次方程组。把 <Katex tex="\vec p=\lambda_1\vec e_1+\lambda_2\vec e_2" /> 按分量展开：<Katex tex="\lambda_1 e_{1x}+\lambda_2 e_{2x}=p_x" />、<Katex tex="\lambda_1 e_{1y}+\lambda_2 e_{2y}=p_y" />，两个方程两个未知数，系数行列式 <Katex tex="e_{1x}e_{2y}-e_{1y}e_{2x}" /> 不为零时解唯一；这个行列式为零，正是两基向量共线。</p>

    <h3 class="sec" id="b1-pit">共线、零向量与基底选择</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：共线的两个向量不能作基底。</strong><Katex tex="\vec e_1=(2,1)" />、<Katex tex="\vec e_2=(4,2)" /> 虽然不平行于坐标轴，却互相共线，只张成一条直线。图 基1 的 ③ 就是这种情形，系数徽章会写明解不出。</li>
        <li><strong>提示二：零向量不能作基向量。</strong>零向量与任何向量共线，取它当基向量违反不共线的前提；但零向量在<strong>任何</strong>基底下的系数都是 <Katex tex="(0,0)" />，表示法仍然唯一。</li>
        <li><strong>提示三：系数可以是负数，也可以是零。</strong>「<Katex tex="\vec a=\lambda_1\vec e_1+\lambda_2\vec e_2" />」不要求两个倍数为正；<Katex tex="\lambda_1<0" /> 表示沿 <Katex tex="\vec e_1" /> 的反方向走，<Katex tex="\lambda_2=0" /> 表示只用一支基向量。</li>
        <li><strong>提示四：同一个向量的「坐标」要说明是哪组基底。</strong>写 <Katex tex="(x,y)" /> 默认直角坐标基底；换成斜基底，同一支箭头的坐标就变了，不能把两组系数混用。</li>
      </ul>
    </div>
    <p>回收与预告：向3 的共线定理说「一维」情形——一个向量就是另一个的倍数；基本定理把它扩到二维，需要两支不共线的方向。基2 把系数写成 <Katex tex="(x,y)" /> 直接放进坐标运算；基3 用这套坐标判三点共线，并解出定比分点的位置。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBasisVec } from '../../../boards/vectors/basis/basisvec.js';
import { VB_CHAPTERS } from './vbnav.js';
</script>
