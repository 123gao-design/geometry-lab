<template>
  <ChPage :cur="1" no="生1" base="/fractal/g" :chapters="FG_CHAPTERS"
    title="迭代函数系统"
    sub="给一组压缩映射，反复作用在任意初始图形上，图形会收敛到唯一的不动集。更省事的做法是不迭代图形，只让一个点随机跳——跳出来的点云与不动集一模一样。"
    :toc="[{ id: 'g1-ifs', t: '压缩映射组与吸引子' }, { id: 'g1-chaos', t: '混沌游戏' }, { id: 'g1-collage', t: '拼贴定理' }, { id: 'g1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="S_1,\dots,S_N" /> 是完备度量空间上的压缩映射，压缩比分别为 <Katex tex="r_1,\dots,r_N" />。则算子 <Katex tex="T(K)=\bigcup S_i(K)" /> 有唯一紧不动集 <Katex tex="A" />，称为该<b>迭代函数系统</b>（IFS）的<b>吸引子</b>；从任意紧集出发迭代 <Katex tex="T" />，都收敛到 <Katex tex="A" />。各 <Katex tex="r_i" /> 相等为 <Katex tex="r" /> 时，<Katex tex="\dim A=\ln N/\ln(1/r)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createIFS" />
      <div class="cap">图 生1 · <b>迭代函数系统与混沌游戏</b>：每步随机挑一个映射，把当前点挪过去，只画落点。看点：① 康托尘用两条映射，谢尔宾斯基三角用三条，蕨叶用四条；② 点数从 500 加到 8000，图形从稀疏变清晰，骨架始终不变；③ 三条预设的吸引子与前面几章手画的完全一致——规则相同，形状就相同。</div>
    </div>

    <h3 class="sec" id="g1-ifs">压缩映射组与吸引子</h3>
    <p>一组压缩映射可以这样读：每个 <Katex tex="S_i" /> 把图形缩小并挪到指定位置，<Katex tex="T" /> 把各个像拼在一起。压缩性保证 <Katex tex="T" /> 在紧集空间里是压缩映射，巴拿赫不动点定理给出唯一不动集，也就是吸引子。</p>
    <p>吸引子与初始图形无关。从一枚点、一个方块、整张纸出发，迭代若干次后都落到同一个集合上。计算机生成分形时，正利用这一点：不必解方程，只要反复施加 <Katex tex="T" />。</p>
    <p>维数仍由副本结构给出。各副本相似比相等时用 <Katex tex="N r^D=1" />；比例不等时解 <Katex tex="\sum r_i^D=1" />。谢尔宾斯基三角的 <Katex tex="\ln3/\ln2" />、康托集的 <Katex tex="\ln2/\ln3" /> 都能从映射组直接读出。</p>

    <h3 class="sec" id="g1-chaos">混沌游戏</h3>
    <p>逐层拼图形的计算量随层数指数增长。混沌游戏换了个思路：只跟踪一个点。每一步按固定概率随机选一个映射，把点挪到 <Katex tex="S_i" /> 的像上，记录落点。</p>
    <p>点看起来在乱跳，落点集却收敛到吸引子。原因是每个映射都是压缩的，误差每步都乘上小于 1 的比例，随机选择只影响走哪条路，不影响最终落点集。点云密度与各映射的选取概率有关，支撑集不变。</p>
    <p>画板用固定随机种子，重绘时点云一致。点少时能看见「正在铺」的过程，点多时轮廓稳定。康托尘只在一维上跳，蕨叶的四条映射分别负责茎、主叶、左右小叶，落点自然长出叶脉。</p>

    <h3 class="sec" id="g1-collage">拼贴定理</h3>
    <p>反过来问：给定一张目标图，怎么找一组压缩映射，使吸引子像它？拼贴定理给出误差估计：若用 <Katex tex="\bigcup S_i(T)" /> 去贴目标集 <Katex tex="T" />，贴完后与 <Katex tex="T" /> 的豪斯多夫距离为 <Katex tex="d" />，则吸引子 <Katex tex="A" /> 满足</p>
    <p style="text-align:center"><Katex display tex="d_H(T,A)\le\frac{d}{1-r},\qquad r=\max_i r_i." /></p>
    <p>贴得越准、压缩比越小，吸引子离目标越近。分形图像压缩就按这条定理工作：把图像分块，为每块找一组「从大块缩小过来」的仿射映射，存下映射参数而不是像素。解压时反复迭代，图像逐层清晰。</p>

    <h3 class="sec" id="g1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：吸引子与起点无关。</strong>随便取初始点或初始图形，迭代足够多次都收敛到同一个集合。画板从一个点出发，照样得到完整图形。</li>
        <li><strong>提示二：随机不等于无规律。</strong>混沌游戏的随机只决定下一步走哪个映射，落点集由映射组锁定。换个种子，点云还是那片点云。</li>
        <li><strong>提示三：映射必须压缩。</strong>只要有一个映射的压缩比不小于 1，迭代就不保证收敛，吸引子可能不存在或跑向无穷。</li>
        <li><strong>提示四：拼贴定理给的是上界。</strong>贴得准、压缩比小，误差上界才小。实际做图像压缩时，块划分与映射搜索的代价往往比定理本身更棘手。</li>
      </ul>
    </div>
    <p>回收与预告：IFS 用「一组映射」描述图形，规则是并列的。另一种写法把规则写成字符串替换，让一条指令生长出整株植物——L 系统。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIFS } from '../../../boards/fractal/gen/ifs.js';
import { FG_CHAPTERS } from './fgnav.js';
</script>
