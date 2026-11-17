<template>
  <ChPage :cur="3" no="特3" base="/linalg/e" :chapters="EL_CHAPTERS"
    title="反复作用与主特征方向"
    sub="把同一个矩阵连乘多次，相当于把同一个变换反复施加。取任意一个初始向量，反复作用之后它的方向几乎总是被拉向同一个方向，长度每步乘的倍数也越来越接近同一个数。这个方向与这个倍数，就是主特征值与主特征方向。"
    :toc="[{ id: 'e3-iter', t: '迭代序列与幂' }, { id: 'e3-dom', t: '为什么只剩主方向' }, { id: 'e3-ratio', t: '比值决定快慢' }, { id: 'e3-pit', t: '极限与前提' }]">

    <div class="note good" id="e3-iter">取非零向量 <Katex tex="\vec{x}_0" />，令 <Katex tex="\vec{x}_{k+1}=A\vec{x}_k" />，则 <Katex tex="\vec{x}_k=A^k\vec{x}_0" />。若 <Katex tex="A" /> 的特征值满足 <Katex tex="|\lambda_1|>|\lambda_2|" />，则当 <Katex tex="k" /> 增大时 <Katex tex="\vec{x}_k" /> 的方向趋于 <Katex tex="\vec{v}_1" /> 所在方向，长度比值 <Katex tex="|\vec{x}_{k+1}|/|\vec{x}_k|\to|\lambda_1|" />。称 <Katex tex="\lambda_1,\vec{v}_1" /> 为<b>主特征值与主特征向量</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPow2D" />
      <div class="cap">图 特3 · <b>反复作用与主特征方向</b>：每一步的向量都按长度归一后画在单位圆上，橙色是初始方向，绿色是第九步，青色小点是中间各步，相邻两步之间用圆弧连接。看点：拖动橙色端点换初始方向，青色点总是沿着圆弧滑向金线；切到「两个都在收缩」档，靠拢的路线不变而长度一路缩短；切到「主特征值为负」档，青点在金线两侧来回跳，方向仍然锁定在同一条线上。</div>
    </div>

    <h3 class="sec" id="e3-iter">迭代序列与幂</h3>
    <p><Katex tex="\vec{x}_{k+1}=A\vec{x}_k" /> 这种写法把矩阵乘法读成了「一步推进」。它与 数1 的递推、递3 的不动点迭代是同一套语言，只是把数换成了向量、把函数换成了线性变换。<Katex tex="A^k" /> 则是推进一步 <Katex tex="k" /> 次的合成算子。</p>
    <p>用特征基展开可以看出每一步在做什么。设 <Katex tex="\vec{x}_0=c_1\vec{v}_1+c_2\vec{v}_2" />，反复作用 <Katex tex="k" /> 次：</p>
    <p style="text-align:center"><Katex tex="\vec{x}_k=c_1\lambda_1^k\vec{v}_1+c_2\lambda_2^k\vec{v}_2=\lambda_1^k\left(c_1\vec{v}_1+c_2\left(\dfrac{\lambda_2}{\lambda_1}\right)^k\vec{v}_2\right)" display /></p>
    <p>括号里的第二项带着一个 <Katex tex="k" /> 次幂，而这个底数的绝对值小于 1，所以它随 <Katex tex="k" /> 增大而消失。整个向量只剩第一项的方向——这就是主方向的来源。图 特3 右栏的「九步后与 <Katex tex="v_1" /> 相差多少度」正是括号里残余项的大小。</p>

    <h3 class="sec" id="e3-dom">为什么只剩主方向</h3>
    <p>把上面那条式子读两遍：方向由两项的相对大小决定，而两项的比值是 <Katex tex="\left(\lambda_2/\lambda_1\right)^k" />。只要这个比值严格小于 1，它的 <Katex tex="k" /> 次方就趋于零，第二项被压得越来越小，向量方向被第一项独占。</p>
    <p>例外情形都能指出来：<Katex tex="|\lambda_1|=|\lambda_2|" /> 时比值不趋于零，两个方向一直并存（旋转矩阵就是这种，方向永不收敛）；<Katex tex="c_1=0" /> 时初始向量本身就落在 <Katex tex="\vec{v}_2" /> 上，自然保持 <Katex tex="\vec{v}_2" /> 方向——这一条在图 特3 里可以验证，把橙色端点拖到紫线上，所有青点都不动。</p>
    <p>反过来，这个现象给出了一种求主特征值的方法：随便取一个初始向量反复乘矩阵，把长度比值 <Katex tex="|\vec{x}_{k+1}|/|\vec{x}_k|" /> 记下来，它会向 <Katex tex="|\lambda_1|" /> 收敛；方向收敛到的那条线就是 <Katex tex="\vec{v}_1" />。数值计算中的幂迭代正是这个做法，优点是不需要展开特征方程。</p>

    <h3 class="sec" id="e3-ratio">比值决定快慢</h3>
    <p>残余项的衰减速度完全由 <Katex tex="r=|\lambda_2/\lambda_1|" /> 决定。每推进一步，残余项乘上 <Katex tex="r" />，要缩小到原来的千分之一大约需要 <Katex tex="\lg 1000/\lg(1/r)" /> 步。图 特3 的第一档 <Katex tex="r\approx0.38" />，几步之内就贴住金线；把 <Katex tex="\lambda_2" /> 调到接近 <Katex tex="\lambda_1" />，青点就要绕很久才靠拢。</p>
    <p>比值的大小也决定长度序列的形态。第一档 <Katex tex="\lambda_1\approx2.03" />，长度每步翻倍，右栏的数字迅速变大；第二档两个特征值都小于 1，长度一路缩短，向量整体趋向原点；第三档主特征值为负，长度仍在增长（<Katex tex="|\lambda_1|\approx1.34" />），但方向每隔一步换到金线的另一侧。</p>
    <p>符号的正负不影响「方向收敛到哪条线」，只影响「停在线的哪一侧」。因此说「方向收敛到 <Katex tex="\vec{v}_1" />」时，指的是收敛到这条直线，而不是收敛到某个固定箭头。</p>

    <h3 class="sec" id="e3-pit">极限与前提</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：收敛的是方向，不是向量。</strong>向量本身一般不收敛（<Katex tex="|\lambda_1|>1" /> 时长度发散，<Katex tex="<1" /> 时趋于零向量）。<Katex tex="\vec{v}_1" /> 只在方向的意义上出现。</li>
        <li><strong>提示二：<Katex tex="c_1=0" /> 是唯一不收敛到 <Katex tex="\vec{v}_1" /> 的初始方向。</strong>这时序列停在 <Katex tex="\vec{v}_2" /> 上。实际计算中浮点误差会让 <Katex tex="c_1" /> 变成很小的非零数，几步之后仍然被拉回主方向。</li>
        <li><strong>提示三：<Katex tex="|\lambda_1|=|\lambda_2|" /> 时没有主方向。</strong>两个方向等权，谁也说不上主导。旋转矩阵属于这种情形，此时序列绕圈，不收敛。</li>
        <li><strong>提示四：长度比值的极限是 <Katex tex="|\lambda_1|" />，不是 <Katex tex="\lambda_1" />。</strong>长度非负，负号只体现在方向上。</li>
      </ul>
    </div>
    <p>回收与预告：特1 用一条二次方程给出特征值，特2 用它拆出对角形，特3 把对角形里的两个幂放回几何——长期行为只由绝对值最大的那个决定。三条线索到此收束。子专题五会把这套语言接到二次型上：椭圆的两条轴，其实就是二次型矩阵的特征方向。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPow2D } from '../../../boards/linalg/eigen/pow2d.js';
import { EL_CHAPTERS } from './elnav.js';
</script>
