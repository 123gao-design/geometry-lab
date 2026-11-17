<template>
  <ChPage :cur="4" no="级4" base="/complexvar/s" :chapters="CY_CHAPTERS"
    title="保角映射"
    sub="导数在一点是一个复数，乘法由一个旋转和一个伸缩拼成。因此解析映射在局部把图形拧一下、放缩一下，两条曲线的夹角原样保留——这就是保角。导数为零的点是唯一的例外，那里角度会被放大。"
    :toc="[{ id: 's4-der', t: '导数的几何意义' }, { id: 's4-conf', t: '保角性与例外' }, { id: 's4-mob', t: '分式线性变换' }, { id: 's4-ex', t: '三个映射的对照' }, { id: 's4-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在 <Katex tex="z_0" /> 解析且 <Katex tex="f'(z_0)\ne0" />，则 <Katex tex="f" /> 在 <Katex tex="z_0" /> 处的映射是<b>保角</b>的：过 <Katex tex="z_0" /> 的任意两条曲线，其夹角在像点 <Katex tex="w_0=f(z_0)" /> 处保持不变，且旋转方向一致。称这样的映射为<b>共形映射</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMobius" />
      <div class="cap">图 级4 · <b>保角映射</b>：左图 z 平面画同心圆（青）与过原点的射线（金），两族曲线处处正交，点 <Katex tex="z" /> 可拖，两枚小箭头沿射线与圆的切线方向；右图是它们在 <Katex tex="w=f(z)" /> 下的像，同一个点分成两枚箭头。看点：① <Katex tex="w=z^2" /> 把角度放大一倍，原点处箭头挤成一条，读数不再是直角；② <Katex tex="w=e^z" /> 把圆映成竖直带里的圆、射线映成水平射线，夹角处处仍为直角；③ <Katex tex="w=\dfrac{z-1}{z+1}" /> 把圆映成圆，<Katex tex="z=-1" /> 是它的极点。</div>
    </div>

    <h3 class="sec" id="s4-der">导数的几何意义</h3>
    <p>差商 <Katex tex="\dfrac{f(z)-f(z_0)}{z-z_0}\to f'(z_0)" /> 的模与辐角各有一句几何话。写成极坐标 <Katex tex="f'(z_0)=r e^{i\varphi}" />，则小位移 <Katex tex="\Delta z" /> 映成</p>
    <p style="text-align:center"><Katex display tex="\Delta w\approx f'(z_0)\,\Delta z=r\,e^{i\varphi}\,\Delta z ." /></p>
    <p>右边是一次<b>旋转</b>加一次<b>伸缩</b>：模乘 <Katex tex="r" />，辐角加 <Katex tex="\varphi" />。两者都与 <Katex tex="\Delta z" /> 的方向无关——这是可导的定义逼出来的：所有方向的差商读到同一个数，映射在局部就只能做同一件事。</p>
    <p>乘一个固定的复数把每条方向向量都按同样的角度转，两条向量的夹角因此不变。保角性的全部内容就是这一句话，<Katex tex="f" /> 具体长什么样并不重要。</p>
    <p>画板左图的两枚箭头来自两族曲线：沿射线的径向与圆的切向。它们在左图里互相垂直；右图里同一个点也画两枚箭头，方向换成 <Katex tex="f'(z)" /> 乘过之后的方向，夹角照样是直角。</p>

    <h3 class="sec" id="s4-conf">保角性与例外</h3>
    <p>由上面的近似可以看出，<Katex tex="f'(z_0)\ne0" /> 时夹角保持不变。若 <Katex tex="f'(z_0)=0" />，一次近似退成零，得看更高阶的项：<Katex tex="f(z)-f(z_0)\approx c\,(z-z_0)^m" />，位移的辐角被乘上 <Katex tex="m" />，夹角随之放大成 <Katex tex="m" /> 倍。画板第一个预设 <Katex tex="w=z^2" /> 把点拖到原点，两枚箭头就挤成一条，读数不再是 <Katex tex="90^\circ" />。</p>
    <p><Katex tex="f'(z_0)=0" /> 的点叫<b>临界点</b>。它不是「映射坏掉了」，只是不再保角。解析函数在临界点附近仍然有定义，角度按固定倍数放大，这类点在后来的黎曼映射定理里还会出现在边界上。</p>
    <p>保角的另一面是「反向保角」：若把 <Katex tex="f" /> 看成从 <Katex tex="w" /> 平面回到 <Katex tex="z" /> 平面，<Katex tex="w=f(z)" /> 的反函数在 <Katex tex="f'(z_0)\ne0" /> 的邻域内解析，导数是 <Katex tex="1/f'(z_0)" />，因此保角是双向的。</p>
    <p>把「保角」与「共形」区分一下：有的书只用「共形」指保角且保持定向的映射，有的把保角性也叫共形性。本站在本义上使用二者。</p>

    <h3 class="sec" id="s4-mob">分式线性变换</h3>
    <p>形如 <Katex tex="w=\dfrac{az+b}{cz+d}" />（<Katex tex="ad-bc\ne0" />）的映射叫<b>分式线性变换</b>，也叫默比乌斯变换。它把扩充复平面映到自身，四个参数只有三个自由（同乘一个常数不改映射），因此三个点的像定住唯一的变换。</p>
    <p>把式子解出来，<Katex tex="z=\dfrac{dw-b}{-cw+a}" />，仍是分式线性变换。所以它总有逆，是一个一一对应的变换。求导得</p>
    <p style="text-align:center"><Katex display tex="f'(z)=\frac{ad-bc}{(cz+d)^2}," /></p>
    <p>导数在 <Katex tex="z\ne-d/c" /> 处不为零，因此在定义好的地方处处保角。唯一的极点 <Katex tex="z=-d/c" /> 映到无穷远，<Katex tex="z=\infty" /> 映到 <Katex tex="a/c" />。</p>
    <p>它最重要的几何性质是：<b>把圆周映成圆周</b>，把直线看作过无穷远的圆周之后，这句话就统一了。画板第三个预设 <Katex tex="w=\dfrac{z-1}{z+1}" /> 把圆心在原点的圆映成另一族圆，就是这条性质的图示。</p>
    <p>顺带一条好用的性质：交比 <Katex tex="\dfrac{(z_1-z_2)(z_3-z_4)}{(z_1-z_4)(z_3-z_2)}" /> 在分式线性变换下不变。要找一个把三对点对应起来的变换，用交比列方程最快。</p>

    <h3 class="sec" id="s4-ex">三个映射的对照</h3>
    <p><Katex tex="w=z^2" />：极坐标下 <Katex tex="re^{i\theta}\mapsto r^2e^{2i\theta}" />，模平方、辐角加倍。它把上半平面映成整个平面，把每条射线映成射线、每个圆映成圆，除原点之外处处保角。</p>
    <p><Katex tex="w=e^z" />：<Katex tex="x+iy\mapsto e^xe^{iy}" />，横坐标管模、纵坐标管辐角。竖线 <Katex tex="x=c" /> 映成半径 <Katex tex="e^c" /> 的圆，横线 <Katex tex="y=\theta_0" /> 映成辐角 <Katex tex="\theta_0" /> 的射线，宽 <Katex tex="2\pi" /> 的横带映满整个平面。导数 <Katex tex="e^z" /> 处处非零，所以它处处保角。</p>
    <p><Katex tex="w=\dfrac{z-1}{z+1}" />：把右半平面映到单位圆盘，把左半平面映到单位圆外。这是一个把「直线边界」变成「圆边界」的标准例子，也是解拉普拉斯方程边值问题的常用工具。</p>
    <p>三个映射的共同点写在画板上：无论像的形状变成什么样，画出来的两枚箭头始终在像点处构成直角，或是按固定倍数张开的角。</p>

    <h3 class="sec" id="s4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：保角要求导数非零。</strong><Katex tex="w=z^2" /> 在原点不保角，夹角被放大成两倍。遇到临界点先算 <Katex tex="f'" />，别默认处处保角。</li>
        <li><strong>提示二：保角是局部的。</strong>它只保证每一点附近的小图形形状不变，整体形状照样可以拧得面目全非：<Katex tex="w=z^2" /> 把半平面折成整平面。</li>
        <li><strong>提示三：分式线性变换的参数不是四个。</strong>同乘一个非零常数给出同一个映射，所以真正自由的只有三个，正好用三对对应点定下来。</li>
        <li><strong>提示四：圆映成圆，要连直线一起算。</strong>直线是过无穷远点的圆周，把它排除在外，这句性质就不成立。</li>
      </ul>
    </div>
    <p>回收与预告：本模块十一章的骨架到这里就齐了。复数把乘法变成旋转与伸缩，解析性把方向无关变成柯西-黎曼的两条等式，两条等式逼出闭路积分为零，积分公式又把边界与内部接上，级数展开把局部信息展开成一列系数，留数把这些系数用于计算，保角性则把这些代数结论翻译回几何。往后的高等模块——复分析选讲、调和函数、位势理论——都以这套语言起步。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMobius } from '../../../boards/complexvar/series/mobius.js';
import { CY_CHAPTERS } from './cynav.js';
</script>
