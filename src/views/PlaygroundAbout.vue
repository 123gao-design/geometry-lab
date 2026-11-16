<template>
  <div>
    <div class="chapter-head">
      <h1>关于画板</h1>
      <p class="sub">自由画板把 GeoGebra 完整版放在本站本地，断网也能打开。它不承担讲解：函数、方程、几何作图都交给它，学生自己在代数栏里敲、在图上拖，用来验证教材里的结论。教材正文那些画板仍然按原来的分工，负责把每一步讲清楚。</p>
    </div>

    <h3 class="sec">三个入口</h3>
    <div class="note good">
      <p><strong>顶栏「画板」</strong>进的就是本页，画板铺满整屏，适合长时间作图。</p>
      <p><strong>页面右下角的圆形按钮</strong>在任意讲解页都能点：正文让出右半边，GeoGebra 贴在右侧，边看推导边改参数，再点一次收起。小窗标题栏的「整页 ↗」把这套参数带到本页继续做。</p>
      <p><strong>章节画板右上角的「↗ GeoGebra」</strong>会把当前画板的图形一起带过去，命令按顺序列在画板上，可以接着改参数、加对象。</p>
    </div>

    <h3 class="sec">命令示例</h3>
    <div class="note">
      <p>左侧代数栏直接输入命令即可：<Katex tex="f(x)=\sin x" />、<Katex tex="Circle((1,2),3)" />、<Katex tex="u=(1,2,3)" />。命令写错时 GeoGebra 会把它标出来，改到对的写法为止。</p>
      <p>工具栏上的几何作图按钮同样可用，画出来的对象会同步进代数栏，两边可以混着来。</p>
    </div>

    <h3 class="sec">两档的差别</h3>
    <div class="pg-two">
      <div class="note">
        <p><strong>平面档</strong>是 GeoGebra 的经典界面，只开代数与图象两栏，指令集完整：函数、隐式方程、圆锥曲线、动点轨迹，连同多边形、矩阵变换都在这一档里做。</p>
      </div>
      <div class="note">
        <p><strong>三维档</strong>换成立体视图，命令语法不变，只是每个点多写一个分量。平面、球、平行六面体都可以建，也能拖出来转。</p>
      </div>
    </div>

    <h3 class="sec">授权与体积</h3>
    <p>GeoGebra 允许非商业用途自由分发，本站按这个条件自托管了 5.4 版的 GeoGebra Classic 与三维应用，源码未做任何修改。代价是体积：<code>public/ggb/</code> 约 69 MB，只在打开画板时加载，其余章节不受影响。</p>
    <p>不装网线时这套文件同样能跑，因为它不依赖 geogebra.org 的任何资源。若之后要换版本，把新的 <code>geogebra-math-apps-bundle</code> 解压覆盖同一目录即可，页面里的路径不用改。</p>

    <div class="read-row">
      <router-link class="readmark" to="/playground">← 回到画板</router-link>
      <router-link class="readmark" to="/playground/guide">使用说明 →</router-link>
      <span class="readtip">用法与脚本写法都在使用说明里</span>
    </div>
  </div>
</template>

<script setup>
import Katex from '../components/Katex.vue';
</script>

<style scoped>
.pg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.read-row a { text-decoration: none; }
@media (max-width: 820px) { .pg-two { grid-template-columns: 1fr; } }
</style>
