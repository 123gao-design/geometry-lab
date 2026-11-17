<template>
  <ChPage :cur="2" no="行2" base="/linalg/d" :chapters="LD_CHAPTERS"
    title="三阶行列式、体积与行列式的性质"
    sub="三支空间向量张成平行六面体，行列式是它的体积带上定向的正负号。三阶可以硬算，再往上就要靠性质把行列化简成三角形，或者按一行展开成几个低阶行列式。"
    :toc="[{ id: 'd2-def', t: '三阶的两种算法' }, { id: 'd2-vol', t: '体积与定向' }, { id: 'd2-prop', t: '行列式的性质' }, { id: 'd2-higher', t: '余子式与高阶计算' }, { id: 'd2-pit', t: '对角线法则的适用范围' }]">

    <div class="note good" id="d2-def">三阶行列式 <Katex tex="D=\begin{vmatrix}a_1&amp;a_2&amp;a_3\\b_1&amp;b_2&amp;b_3\\c_1&amp;c_2&amp;c_3\end{vmatrix}" /> 按第一行展开：<Katex tex="D=a_1\begin{vmatrix}b_2&amp;b_3\\c_2&amp;c_3\end{vmatrix}-a_2\begin{vmatrix}b_1&amp;b_3\\c_1&amp;c_3\end{vmatrix}+a_3\begin{vmatrix}b_1&amp;b_2\\c_1&amp;c_2\end{vmatrix}" />。三个符号依次是正、负、正。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDet3D" />
      <div class="cap">图 行2 · <b>三阶行列式与体积</b>：三支向量 <Katex tex="a" />、<Katex tex="b" />、<Katex tex="c" /> 张成平行六面体，六个面各涂一色。看点：拖动视角能看清底面积与高；把 <Katex tex="c" /> 的仰角推过 0°，体积大小不变而符号翻转；把 <Katex tex="c" /> 的方位角转一圈，体积一路不动——它的长度与仰角没变，高就没变。</div>
    </div>

    <h3 class="sec" id="d2-def">三阶的两种算法</h3>
    <p>第一种是按行展开（上面的公式），本质是把三阶降成三个二阶。第二种是<b>对角线法则</b>：把前两列抄到右边，三条主方向的对角线相乘取正、三条副方向的对角线相乘取负，六项相加。两种算法结果相同，对角线法则写起来快，但只对二阶、三阶成立。</p>
    <p>展开式的每一项都是从每一行、每一列各取一个元素相乘，共 6 项，正负号由排列的奇偶决定：<Katex tex="(+)a_1b_2c_3 ,\ (+)a_2b_3c_1 ,\ (+)a_3b_1c_2 ,\ (-)a_3b_2c_1 ,\ (-)a_1b_3c_2 ,\ (-)a_2b_1c_3" />。记住这六项的三正三负，等于记住了三阶行列式的全部内容。</p>

    <h3 class="sec" id="d2-vol">体积与定向</h3>
    <p>把三支向量作为三列（或三行）写进矩阵，行列式的绝对值就是它们张成的平行六面体体积。理由是拆成底乘高：前两支向量张成的平行四边形面积是 <Katex tex="|a\times b|" />（第 积4b 的结论），第三支向量在这个平行四边形法向上的投影长度就是高 <Katex tex="h=|c|\cos\varphi" />，两者相乘正好等于混合积 <Katex tex="|(a\times b)\cdot c|" />，而混合积按坐标展开就是三阶行列式。</p>
    <p>符号的含义同样来自定向：<Katex tex="c" /> 落在 <Katex tex="a\times b" /> 指向的一侧时为正，这一侧由右手定则确定（四指从 <Katex tex="a" /> 转向 <Katex tex="b" />，拇指的方向即 <Katex tex="a\times b" />）。<Katex tex="a" />、<Katex tex="b" />、<Katex tex="c" /> 构成右手系时行列式为正，左手系时为负，三者共面时为零。</p>
    <p>图 行2 的「俯仰」滑块把这件事摆得很清楚：仰角从 58° 降到 −30°，平行六面体上下翻过去，体积先缩小到零（共面）再变大，而符号始终为负。体积是几何量，不带符号；定向是代数量，两面各一个符号。</p>

    <h3 class="sec" id="d2-prop">行列式的性质</h3>
    <p>把行列式看成「行向量的多线性交替函数」，六条性质一次说清：</p>
    <p>① <b>转置不变</b>：<Katex tex="D^T=D" />，行与列的地位完全对称，凡是对行成立的性质对列也成立。② <b>两行互换变号</b>：交换一次翻一次，交换两次回到原值。③ <b>某行有公因子可提出</b>：<Katex tex="\begin{vmatrix}\lambda a_1&amp;\lambda b_1\\c_1&amp;c_2\end{vmatrix}=\lambda\begin{vmatrix}a_1&amp;b_1\\c_1&amp;c_2\end{vmatrix}" />，整行乘 <Katex tex="\lambda" /> 等于整个行列式乘 <Katex tex="\lambda" />。④ <b>两行成比例（含相等）则为零</b>：成比例时其中一行可由另一行提出倍数，再用「有两行相同则互换后不变又变号」推出值为零。⑤ <b>对每一行线性</b>：只有一行的元素是两数之和时，行列式可拆成两个行列式之和。⑥ <b>某行的倍数加到另一行，值不变</b>：这是化简最常用的一条。</p>
    <p>性质 ⑥ 是<b>高斯消元</b>的基础：反复用倍加把行列式化成上三角，值等于对角元之积。三阶手算时，先看哪一列有零可消；行列里有分数时先提公因子，运算会轻很多。矩阵一章的初等变换与这里的六条是同一批操作的两种语言。</p>

    <h3 class="sec" id="d2-higher">余子式与高阶计算</h3>
    <p>划去第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列后剩下的行列式叫<b>余子式</b> <Katex tex="M_{ij}" />，配上符号得到<b>代数余子式</b> <Katex tex="A_{ij}=(-1)^{i+j}M_{ij}" />。按任一行（或任一列）展开都成立：<Katex tex="D=\sum_j a_{ij}A_{ij}" />。符号按棋盘格排布，左上角为正，相邻格变号。</p>
    <p>按行展开把 <Katex tex="n" /> 阶换成 <Katex tex="n" /> 个 <Katex tex="n-1" /> 阶，直接算的运算量按阶乘增长，四阶以上就要改用「先消元、再展开」：选一行零最多的展开，或先用倍加制造零。数值计算里的高斯消元用同一套动作，只是关心误差与主元的选取（第 迭2 的牛顿法、第 拟1 的最小二乘都要解这类线性方程组）。</p>
    <p>另有一条<b>异乘变零</b>：<Katex tex="\sum_j a_{ij}A_{kj}=0\ (i\ne k)" />，即某一行的元素与另一行的代数余子式相乘再求和必为零。它与展开式合起来说明：代数余子式构成的行列，正是逆矩阵的来源。</p>

    <h3 class="sec" id="d2-pit">对角线法则的适用范围</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：对角线法则只适用于二阶与三阶。</strong>四阶若照搬六条对角线，会漏掉大部分项（四阶共 24 项），结果与真值无关。四阶以上一律按行展开或先消元。</li>
        <li><strong>提示二：展开时别漏符号。</strong>按第一行展开是「正负正」，按第二行展开是「负正负」。符号由 <Katex tex="(-1)^{i+j}" /> 决定，不是由位置序号直接给出。</li>
        <li><strong>提示三：提公因子只提一行。</strong>整行提出 <Katex tex="\lambda" /> 是一次；两行都提出就成了 <Katex tex="\lambda^2" />。三行都提是 <Katex tex="\lambda^3" />，等于 <Katex tex="\lambda" /> 乘了三次。</li>
        <li><strong>提示四：倍加不变，倍乘要变。</strong>「某行乘 <Katex tex="\lambda" /> 加到另一行」值不变；「某行乘 <Katex tex="\lambda" />」值变成 <Katex tex="\lambda" /> 倍。两种操作差一个字，效果差一个因子。</li>
      </ul>
    </div>
    <p>回收与预告：二阶看面积、三阶看体积，四阶以上没有直观图形，只能靠性质与展开。矩阵一章把这套「用初等变换化简」的做法系统化，并把行列式作为判断可逆与方程组解的结构的一个数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDet3D } from '../../../boards/linalg/det/det3d.js';
import { LD_CHAPTERS } from './ldnav.js';
</script>
