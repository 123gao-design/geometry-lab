<template>
  <ChPage :cur="1" no="换1" base="/projgeom/g" :chapters="PRG_CHAPTERS"
    title="变换群"
    sub="把平面上的可逆变换收集起来，若对复合封闭、含恒等变换、每个变换都有逆，这族变换就构成一个群。几何研究的对象不再只是图形，而是群作用下的整个轨道。"
    :toc="[{ id: 'g1-group', t: '变换群的四条要求' }, { id: 'g1-orbit', t: '轨道与不变量' }, { id: 'g1-d4', t: '正方形的二面体群' }, { id: 'g1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="G" /> 是平面（或射影平面）上一族可逆变换。若 <Katex tex="G" /> 对复合封闭、含恒等变换、每个元素都有逆，则 <Katex tex="G" /> 按复合构成一个<b>变换群</b>。给定图形 <Katex tex="S" />，它在 <Katex tex="G" /> 下的像的全体叫 <Katex tex="S" /> 的<b>轨道</b>；在 <Katex tex="G" /> 的所有元素下都保持不变的量叫<b>不变量</b>。几何学的任务，就是找出群与不变量的对应。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTGroup" />
      <div class="cap">图 换1 · <b>变换群机</b>：灰色是字母 F 的原位，蓝色是变换后的像，下方八个按钮对应正方形的八个对称变换。看点：① <Katex tex="e" /> 不动，<Katex tex="r" /> 转 <Katex tex="90^\circ" />，<Katex tex="s" /> 上下翻转；② 每点一次按钮，徽章读出元素、阶与逆元；③ 八个变换两两复合仍在其中，这正是「群」的意思。</div>
    </div>

    <h3 class="sec" id="g1-group">变换群的四条要求</h3>
    <p>先要有一个集合 <Katex tex="G" />，元素是可逆变换，运算取复合。四条要求与抽象群的公理逐条对应：封闭（两个变换复合后仍是 <Katex tex="G" /> 的元素）、结合律（复合天然满足）、幺元（恒等变换 <Katex tex="e" /> 属于 <Katex tex="G" />）、逆元（每个变换的逆也属于 <Katex tex="G" />）。</p>
    <p>射影变换的全体按复合构成一个群，记 <Katex tex="\mathrm{PGL}_3(\mathbb{R})" />。仿射变换、相似变换、欧氏变换分别是它的子群，逐层增加限制，逐层缩小。</p>
    <p>群的定义只认运算规律，不认具体图形。正方形的旋转与反射是群，模 <Katex tex="n" /> 的加法也是群，两者结构上可以完全相同——这正是把几何交给群论的理由。</p>

    <h3 class="sec" id="g1-orbit">轨道与不变量</h3>
    <p>从一个图形出发，把它在群里所有变换下的像收集起来，得到一条轨道。给一条圆锥曲线，射影群把它送到所有非退化圆锥曲线，轨道巨大；仿射群把它只送到同类（椭圆仍椭圆）；欧氏群则只让它在平面上挪动、转动。</p>
    <p>不变量就是沿轨道不变的东西。群越大，能变的花样越多，能保住的东西越少。射影群下只剩交比与共线性，仿射群下多了平行与面积比，欧氏群下再有长度与角度。</p>
    <p>用轨道与不变量看几何，问题就分成两半：哪些量在群里不变？两个图形何时在同一条轨道上？后半问的完整答案就是「分类」。</p>

    <h3 class="sec" id="g1-d4">正方形的二面体群</h3>
    <p>正方形的对称变换共八个：四个旋转 <Katex tex="e,r,r^2,r^3" />（转角 <Katex tex="0,\pi/2,\pi,3\pi/2" />）与四个反射 <Katex tex="s,sr,sr^2,sr^3" />。记作 <Katex tex="D_4" />，阶为 8。</p>
    <p>画板上按钮依次施加，徽章给出元素的阶与逆元：<Katex tex="r" /> 的阶是 4（转四次回到原位），<Katex tex="r^2" /> 的阶是 2，四个反射的阶都是 2。旋转与反射复合，得到的是反射；两个反射复合，得到的是旋转。</p>
    <p>把字母 F 换成正方形本身，八个变换都把它送回自己。形状的对称性就是「让它不变的变换构成一个群」，对称性的大小由群的阶衡量。正 <Katex tex="n" /> 边形的对称群是 <Katex tex="D_n" />，阶 <Katex tex="2n" />。</p>

    <h3 class="sec" id="g1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：元素必须可逆。</strong>只压缩不放大的相似（相似比为 0.5）不是一个变换，它没有逆。变换群的元素一律取双射。</li>
        <li><strong>提示二：运算顺序有影响。</strong>先转再翻与先翻再转一般得到不同结果。群论里把复合写成从右往左作用，书写与计算要保持一致。</li>
        <li><strong>提示三：阶是元素的性质，不是群的大小。</strong>元素的阶指多少次复合回到恒等；群的阶指元素个数。<Katex tex="D_4" /> 群阶 8，其中 <Katex tex="r" /> 的阶是 4。</li>
        <li><strong>提示四：不变量随群变大而减少。</strong>说「这是射影性质」意味着它在更大的群里仍不变；反过来，长度只在欧氏群里不变，不能当成射影不变量。</li>
      </ul>
    </div>
    <p>回收与预告：既然每种几何对应一个变换群，几何学就可以按群排成一张表。克莱因把这个想法写成爱尔兰根纲领，每个层级各管一类不变量。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTGroup } from '../../../boards/projgeom/group/tgroup.js';
import { PRG_CHAPTERS } from './prgnav.js';
</script>
