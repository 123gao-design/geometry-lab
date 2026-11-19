<template>
  <div ref="rootEl" class="clab" :class="{ paused: !running }">
    <header class="cl-head">
      <div class="cl-lead">
        <h1>电路实验室</h1>
      </div>
      <div class="cl-tools">
        <button class="cl-b hl" @click="helpOpen = true">使用说明</button>
        <button class="cl-b" @click="loadSample">载入示例</button>
        <button class="cl-b" @click="clearAll">清空</button>
        <button class="cl-b" title="电路越画越大、格子不够用时，往右下方再接几列几行" @click="growGrid(4, 4)">＋ 格网</button>
        <button class="cl-b" @click="running = !running">{{ running ? '暂停流动' : '继续流动' }}</button>
        <router-link class="cl-b" to="/physics">回物理首页</router-link>
      </div>
    </header>

    <div class="cl-body" :style="bodyStyle">
      <aside class="cl-pal">
        <template v-for="g in PAL" :key="g.t">
          <div class="cl-pal-t">{{ g.t }}</div>
          <button
            v-for="t in g.items" :key="t.k"
            class="cl-tool" :class="{ on: tool === t.k }"
            :title="t.tip" @click="tool = t.k">
            <svg class="cl-pic" viewBox="0 0 24 24" aria-hidden="true">
              <path v-for="(s, si) in t.ico" :key="si" :d="s.d" :class="{ f: s.f }" />
            </svg>
            <span class="cl-tn">{{ t.t }}</span>
          </button>
        </template>
        <div class="cl-pal-t">工具</div>
        <button
          v-for="t in TOOLS" :key="t.k"
          class="cl-tool" :class="{ on: tool === t.k }"
          :title="t.tip" @click="tool = t.k">
          <svg class="cl-pic" viewBox="0 0 24 24" aria-hidden="true">
            <path v-for="(s, si) in t.ico" :key="si" :d="s.d" :class="{ f: s.f }" />
          </svg>
          <span class="cl-tn">{{ t.t }}</span>
        </button>
        <p class="cl-tip">{{ toolTip }}</p>
      </aside>

      <div class="cl-stage">
        <svg ref="svgEl" class="cl-svg" :class="['cur-' + tool, { moving: drag && drag.mode === 'move' && drag.moved }]" :style="{ cursor: boardCursor }" :viewBox="VB"
             @pointerdown="onDown" @pointermove="onMove"
             @pointerup="onUp" @pointercancel="onCancel" @pointerleave="onCancel"
             @wheel.prevent="onWheel" @dblclick="resetView">
          <!-- 格线：横竖铺满整块画板 -->
          <g class="cl-lat">
            <line v-for="i in COLS" :key="'lv' + i"
                  :x1="PADX + (i - 1) * CELL" :y1="PADY"
                  :x2="PADX + (i - 1) * CELL" :y2="H - PADY" />
            <line v-for="j in ROWS" :key="'lh' + j"
                  :x1="PADX" :y1="PADY + (j - 1) * CELL"
                  :x2="W - PADX" :y2="PADY + (j - 1) * CELL" />
          </g>
          <!-- 对角线同样能摆元件：拿起能放东西的工具时，淡描出来 -->
          <g v-if="showDiag" class="cl-lat diag">
            <line v-for="b in DIAG" :key="'ld' + b.k" :x1="b.x1" :y1="b.y1" :x2="b.x2" :y2="b.y2" />
          </g>

          <!-- 节点 -->
          <g class="cl-nodes">
            <circle v-for="n in NODESV" :key="'nd' + n.id" :cx="n.x" :cy="n.y" :r="n.used ? 3.4 : 2.2"
                    :class="n.used ? 'cl-node on' : 'cl-node'" />
          </g>

          <!-- 电流小点（画在元件之前，穿过元件时被元件本体盖住） -->
          <g class="cl-flow-l">
            <g v-for="e in items" :key="'f' + e.key" v-show="e.flow"
               class="cl-flow" :class="e.flow && e.flow.ac ? 'ac' : ''"
               :style="flowStyle(e.flow)">
              <circle v-for="(d, i) in (e.flow ? e.flow.dots : [])" :key="i"
                      :cx="d.x" :cy="d.y" r="2.8" class="cl-dotf" />
            </g>
            <g v-for="e in items" :key="'f2' + e.key" v-show="e.flow2"
               class="cl-flow" :class="e.flow2 && e.flow2.ac ? 'ac' : ''"
               :style="flowStyle(e.flow2)">
              <circle v-for="(d, i) in (e.flow2 ? e.flow2.dots : [])" :key="i"
                      :cx="d.x" :cy="d.y" r="2.8" class="cl-dotf" />
            </g>
          </g>

          <!-- 元件 -->
          <g v-for="e in items" :key="e.key" :class="['cl-el', e.sel ? 'sel' : '']">
            <!-- 选中框 -->
            <rect v-if="e.sel" class="cl-ring"
                  :x="e.mx - e.ring.w / 2" :y="e.my - e.ring.h / 2"
                  :width="e.ring.w" :height="e.ring.h" rx="10" />

            <!-- 导线 -->
            <template v-if="e.kind === 'wire'">
              <line class="cl-wire" :x1="e.p.x" :y1="e.p.y" :x2="e.q.x" :y2="e.q.y" />
            </template>

            <!-- 电阻 -->
            <template v-else-if="e.kind === 'res'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y" :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <rect class="cl-body2" x="-22" y="-10" width="44" height="20" rx="3" />
              </g>
            </template>

            <!-- 灯泡 -->
            <template v-else-if="e.kind === 'bulb'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y" :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle v-if="e.bright > 0.03" class="cl-glow" cx="0" cy="0" r="26" :opacity="e.bright * 0.8" />
                <circle class="cl-body2" cx="0" cy="0" r="13" />
                <path class="cl-fil" d="M-8 -8 L8 8 M8 -8 L-8 8" />
                <circle class="cl-glow-core" cx="0" cy="0" r="9" :opacity="e.bright" />
              </g>
            </template>

            <!-- 电池 -->
            <template v-else-if="e.kind === 'bat'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 7" :y2="e.my - e.uy * 7" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 6" :y1="e.my + e.uy * 6"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <line class="cl-plate long" x1="-7" y1="-17" x2="-7" y2="17" />
                <line class="cl-plate short" x1="6" y1="-9" x2="6" y2="9" />
                <text class="cl-sign" x="-13" y="-8" :transform="e.tex">+</text>
                <text class="cl-sign" x="9" y="16" :transform="e.tex">−</text>
              </g>
            </template>

            <!-- 开关 -->
            <template v-else-if="e.kind === 'sw'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 17" :y2="e.my - e.uy * 17" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 17" :y1="e.my + e.uy * 17"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-contact" cx="-17" cy="0" r="2.6" />
                <circle class="cl-contact" cx="17" cy="0" r="2.6" />
                <line class="cl-lever" x1="-17" y1="0" x2="17" y2="0" v-if="e.swOn" />
                <line class="cl-lever" x1="-17" y1="0" x2="15" y2="-14" v-else />
              </g>
            </template>

            <!-- 交流电源 -->
            <template v-else-if="e.kind === 'ac'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 12" :y2="e.my - e.uy * 12" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 12" :y1="e.my + e.uy * 12"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-body2" cx="0" cy="0" r="12" />
                <path class="cl-sine" d="M-8 0 C-6 -7 -2 -7 0 0 C2 7 6 7 8 0" />
              </g>
            </template>

            <!-- 发电机 -->
            <template v-else-if="e.kind === 'gen'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 12" :y2="e.my - e.uy * 12" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 12" :y1="e.my + e.uy * 12"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-body2" cx="0" cy="0" r="12" />
                <text class="cl-mtr" x="0" y="0" :transform="e.tex">G</text>
              </g>
            </template>

            <!-- 电容 -->
            <template v-else-if="e.kind === 'cap'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 6" :y2="e.my - e.uy * 6" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 6" :y1="e.my + e.uy * 6"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <line class="cl-plate cap" x1="-5" y1="-15" x2="-5" y2="15" />
                <line class="cl-plate cap" x1="5" y1="-15" x2="5" y2="15" />
              </g>
            </template>

            <!-- 电感 -->
            <template v-else-if="e.kind === 'ind'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 20" :y2="e.my - e.uy * 20" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 20" :y1="e.my + e.uy * 20"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <path class="cl-coil" :d="COIL" />
              </g>
            </template>

            <!-- 变压器：两只线圈，中间两道铁芯 -->
            <template v-else-if="e.kind === 'xfmr'">
              <line v-for="(l, i) in e.leads" :key="'xa' + i" class="cl-lead"
                    :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
              <line v-for="(l, i) in e.leads2" :key="'xb' + i" class="cl-lead"
                    :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
              <g :transform="e.tf"><path class="cl-coil" :d="COIL" /></g>
              <g :transform="e.tf2"><path class="cl-coil" :d="COIL" /></g>
              <line class="cl-core" :x1="e.core.x1" :y1="e.core.y1" :x2="e.core.x2" :y2="e.core.y2" />
              <line class="cl-core" :x1="e.core2.x1" :y1="e.core2.y1" :x2="e.core2.x2" :y2="e.core2.y2" />
            </template>

            <!-- 二极管 -->
            <template v-else-if="e.kind === 'diode'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 9" :y2="e.my - e.uy * 9" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 9" :y1="e.my + e.uy * 9"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <polygon class="cl-dio" points="-9,-9 -9,9 8,0" />
                <line class="cl-plate long" x1="8" y1="-9" x2="8" y2="9" />
              </g>
            </template>

            <!-- 电流表 / 电压表 -->
            <template v-else-if="e.kind === 'amm' || e.kind === 'volt'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 11" :y2="e.my - e.uy * 11" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 11" :y1="e.my + e.uy * 11"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-body2" cx="0" cy="0" r="11" />
                <text class="cl-mtr" x="0" y="0" :transform="e.tex">{{ e.kind === 'amm' ? 'A' : 'V' }}</text>
              </g>
            </template>

            <!-- 灵敏电流计：表头本体，指针按 |I|/Ig 偏转 -->
            <template v-else-if="e.kind === 'galv'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 11" :y2="e.my - e.uy * 11" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 11" :y1="e.my + e.uy * 11"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-body2" cx="0" cy="0" r="11" />
                <path class="cl-scale" d="M-6.2 -1.6 A6.4 6.4 0 0 1 6.2 -1.6" />
                <line v-if="e.ndl" class="cl-needle" x1="0" y1="1.8" :x2="e.ndl.x2" :y2="e.ndl.y2" />
                <text class="cl-mtr" x="0" y="6.8" :transform="e.tex">G</text>
              </g>
            </template>

            <!-- 电动机：电枢电阻与反电动势，转动时画一道转向弧 -->
            <template v-else-if="e.kind === 'motor'">
              <line class="cl-lead" :x1="e.p.x" :y1="e.p.y"
                    :x2="e.mx - e.ux * 12" :y2="e.my - e.uy * 12" />
              <line class="cl-lead"
                    :x1="e.mx + e.ux * 12" :y1="e.my + e.uy * 12"
                    :x2="e.q.x" :y2="e.q.y" />
              <g :transform="e.tf">
                <circle class="cl-body2" cx="0" cy="0" r="12" />
                <path v-if="e.spin" class="cl-spin" d="M-3.6 -14.4 A15 15 0 0 1 8.4 -11.6 M8.4 -11.6 l3.2 1.4 M8.4 -11.6 l-1.4 -3" />
                <text class="cl-mtr" x="0" y="0" :transform="e.tex">M</text>
              </g>
            </template>

            <!-- 三极管：圆圈里一道基极条，基极从共用节点那条边接出去 -->
            <template v-else-if="e.kind === 'qnp'">
              <line v-for="(l, i) in e.leads" :key="'qa' + i" class="cl-lead"
                    :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
              <line class="cl-lead" :x1="e.tr.base.x1" :y1="e.tr.base.y1"
                    :x2="e.tr.base.x2" :y2="e.tr.base.y2" />
              <g :transform="e.tf"><circle class="cl-body2" cx="0" cy="0" r="15" /></g>
              <line class="cl-plate long" :x1="e.tr.bar.x1" :y1="e.tr.bar.y1"
                    :x2="e.tr.bar.x2" :y2="e.tr.bar.y2" />
              <polygon class="cl-dio" :points="e.tr.arrow" />
            </template>

            <!-- 放大器：输入边上的三角形，顶点引一线接到输出那条边 -->
            <template v-else-if="e.kind === 'amp'">
              <line v-for="(l, i) in e.leads" :key="'aa' + i" class="cl-lead"
                    :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
              <polygon class="cl-body2" :points="e.ampPts" />
              <line class="cl-wire" :x1="e.outLine.x1" :y1="e.outLine.y1"
                    :x2="e.outLine.x2" :y2="e.outLine.y2" />
            </template>

            <!-- 文字：参数与电流 -->
            <template v-if="e.lb1">
              <text class="cl-lb" :x="e.lb1.x" :y="e.lb1.y" :text-anchor="e.lb1.anchor">{{ e.val }}</text>
              <text v-if="e.cur" class="cl-lb cur" :x="e.lb2.x" :y="e.lb2.y" :text-anchor="e.lb2.anchor">{{ e.cur }}</text>
            </template>
          </g>

          <!-- 拉线预览与落点提示 -->
          <g v-if="hoverLine" class="cl-prev hover">
            <line :x1="hoverLine.x1" :y1="hoverLine.y1" :x2="hoverLine.x2" :y2="hoverLine.y2" />
          </g>
          <g v-if="drag && drag.from" class="cl-prev">
            <line :x1="drag.from.x" :y1="drag.from.y" :x2="drag.x" :y2="drag.y" />
          </g>
          <!-- 搬元件时的落点：虚线画出它要占的那条（或两条）格线 -->
          <g v-if="movePreview" class="cl-prev move" :class="{ bad: !movePreview.ok }">
            <line v-for="(s, i) in movePreview.segs" :key="'mv' + i"
                  :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2" />
          </g>
        </svg>
        <div class="cl-zoom">
          <button aria-label="缩小" title="缩小" @click="zoomBy(1 / 1.3)">－</button>
          <button class="cl-zv" title="双击画板或点这里复原" @click="resetView">{{ Math.round(VIEW.z * 100) }}%</button>
          <button aria-label="放大" title="放大" @click="zoomBy(1.3)">＋</button>
        </div>
        <div class="cl-warn" v-if="warn">{{ warn }}</div>
        <div class="cl-warn" v-else-if="msg">{{ msg }}</div>
      </div>

      <aside class="cl-side">
        <div class="cl-card" v-if="sel">
          <h2>选中元件</h2>
          <div class="cl-sel-t">{{ selTitle }}</div>

          <template v-if="sel.kind === 'bat'">
            <div class="cl-row"><span>电动势 ε</span><b>{{ sel.p.emf.toFixed(1) }} V</b></div>
            <input class="cl-rg" type="range" min="1.5" max="12" step="0.5" v-model.number="sel.p.emf" />
            <div class="cl-row"><span>内阻 r</span><b>{{ sel.p.r.toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="0.1" max="2" step="0.1" v-model.number="sel.p.r" />
          </template>

          <template v-else-if="sel.kind === 'ac'">
            <div class="cl-row"><span>峰值电压</span><b>{{ sel.p.A.toFixed(1) }} V</b></div>
            <input class="cl-rg" type="range" min="1.5" max="12" step="0.5" v-model.number="sel.p.A" />
            <div class="cl-row"><span>频率 f</span><b>{{ sel.p.f.toFixed(0) }} Hz</b></div>
            <input class="cl-rg" type="range" min="5" max="200" step="5" v-model.number="sel.p.f" />
            <div class="cl-row"><span>内阻 r</span><b>{{ sel.p.r.toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="0.1" max="2" step="0.1" v-model.number="sel.p.r" />
          </template>

          <template v-else-if="sel.kind === 'gen'">
            <div class="cl-row"><span>线圈匝数 N</span><b>{{ num(sel.p.N, 100).toFixed(0) }}</b></div>
            <input class="cl-rg" type="range" min="20" max="200" step="10" v-model.number="sel.p.N" />
            <div class="cl-row"><span>磁感应强度 B</span><b>{{ num(sel.p.B, 0.2).toFixed(2) }} T</b></div>
            <input class="cl-rg" type="range" min="0.05" max="0.5" step="0.05" v-model.number="sel.p.B" />
            <div class="cl-row"><span>线圈面积 S</span><b>{{ num(sel.p.S, 0.02).toFixed(2) }} m²</b></div>
            <input class="cl-rg" type="range" min="0.01" max="0.05" step="0.01" v-model.number="sel.p.S" />
            <div class="cl-row"><span>转速 n</span><b>{{ num(sel.p.n, 5).toFixed(1) }} r/s</b></div>
            <input class="cl-rg" type="range" min="1" max="10" step="0.5" v-model.number="sel.p.n" />
            <div class="cl-row"><span>内阻 r</span><b>{{ num(sel.p.r, 0.5).toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="0.1" max="2" step="0.1" v-model.number="sel.p.r" />
            <div class="cl-row hl"><span>峰值电动势 εm = NBSω</span><b>{{ f2(genPeak(sel.p)) }} V</b></div>
            <div class="cl-row hl"><span>频率 f = n</span><b>{{ f2(num(sel.p.n, 5)) }} Hz</b></div>
          </template>

          <template v-else-if="sel.kind === 'res'">
            <div class="cl-row"><span>阻值 R</span><b>{{ sel.p.R.toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="1" max="20" step="0.5" v-model.number="sel.p.R" />
          </template>

          <template v-else-if="sel.kind === 'bulb'">
            <div class="cl-row"><span>灯丝模型</span></div>
            <div class="cl-seg">
              <button :class="{ on: sel.p.mode === 'curve' }" @click="sel.p.mode = 'curve'">电阻曲线</button>
              <button :class="{ on: sel.p.mode !== 'curve' }" @click="sel.p.mode = 'fixed'">恒定电阻</button>
            </div>
            <template v-if="sel.p.mode === 'curve'">
              <div class="cl-row"><span>额定电压</span><b>{{ sel.p.Ur.toFixed(1) }} V</b></div>
              <input class="cl-rg" type="range" min="1.5" max="12" step="0.5" v-model.number="sel.p.Ur" />
              <div class="cl-row"><span>额定功率</span><b>{{ sel.p.Pr.toFixed(1) }} W</b></div>
              <input class="cl-rg" type="range" min="0.5" max="6" step="0.1" v-model.number="sel.p.Pr" />
              <div class="cl-row"><span>特性指数 α</span><b>{{ num(sel.p.alpha, 0.5).toFixed(2) }}</b></div>
              <input class="cl-rg" type="range" min="0" max="2.5" step="0.05" v-model.number="sel.p.alpha" />
              <div class="cl-row hl"><span>曲线形状</span><b>{{ bulbShape }}</b></div>
              <!-- 伏安曲线：额定点空心、此刻工作点实心 -->
              <svg v-if="bulbPlot" class="cl-bc" viewBox="0 0 236 124" role="img" aria-label="灯泡的伏安特性曲线">
                <line class="cl-ba" x1="30" y1="98" x2="226" y2="98" />
                <line class="cl-ba" x1="30" y1="98" x2="30" y2="10" />
                <path class="cl-bcurve" :d="bulbPlot.d" />
                <line class="cl-bdash" x1="30" :y1="98" :x2="bulbPlot.rx" :y2="98" />
                <line class="cl-bdash" :x1="bulbPlot.rx" :y1="98" :x2="bulbPlot.rx" :y2="bulbPlot.ry" />
                <circle class="cl-brated" :cx="bulbPlot.rx" :cy="bulbPlot.ry" r="3.4" />
                <circle class="cl-bop" :cx="bulbPlot.ox" :cy="bulbPlot.oy" r="3.8" />
                <text class="cl-blab" x="226" y="112" text-anchor="end">U / V</text>
                <text class="cl-blab" x="16" y="12" text-anchor="middle">I / A</text>
                <text class="cl-blab" :x="bulbPlot.rx" y="112" text-anchor="middle">{{ bulbPlot.uTxt }}</text>
                <text class="cl-blab" x="24" :y="bulbPlot.ry + 3.6" text-anchor="end">{{ bulbPlot.iTxt }}</text>
              </svg>
              <div class="cl-row"><span>额定电流 Pr / Ur</span><b>{{ bulbPlot ? bulbPlot.iHTxt : '—' }} A</b></div>
              <div class="cl-row"><span>热态电阻 Ur² / Pr</span><b>{{ bulbPlot ? bulbPlot.rHTxt : '—' }} Ω</b></div>
              <div class="cl-row"><span>此时灯丝电阻</span><b>{{ f2(selItem ? selItem.Rnow : 0) }} Ω</b></div>
              <div class="cl-row hl"><span>此刻工作点</span><b>{{ bulbPlot ? bulbPlot.opTxt : '—' }}</b></div>
            </template>
            <template v-else>
              <div class="cl-row"><span>阻值 R</span><b>{{ sel.p.R.toFixed(0) }} Ω</b></div>
              <input class="cl-rg" type="range" min="2" max="20" step="1" v-model.number="sel.p.R" />
            </template>
          </template>

          <template v-else-if="sel.kind === 'sw'">
            <div class="cl-row"><span>状态</span><b>{{ sel.p.on ? '闭合' : '断开' }}</b></div>
            <button class="cl-b wide" @click="sel.p.on = !sel.p.on">{{ sel.p.on ? '断开它' : '闭合它' }}</button>
          </template>

          <template v-else-if="sel.kind === 'cap'">
            <div class="cl-row"><span>电容 C</span><b>{{ sel.p.C.toFixed(0) }} μF</b></div>
            <input class="cl-rg" type="range" min="1" max="1000" step="1" v-model.number="sel.p.C" />
            <div class="cl-row"><span>容抗 1/(ωC)</span><b>{{ f2(selItem ? selItem.X : 0) }} Ω</b></div>
          </template>

          <template v-else-if="sel.kind === 'ind'">
            <div class="cl-row"><span>电感 L</span><b>{{ sel.p.L.toFixed(0) }} mH</b></div>
            <input class="cl-rg" type="range" min="1" max="1000" step="1" v-model.number="sel.p.L" />
            <div class="cl-row"><span>直流电阻 r</span><b>{{ sel.p.r.toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="0.1" max="5" step="0.1" v-model.number="sel.p.r" />
            <div class="cl-row"><span>感抗 ωL</span><b>{{ f2(selItem ? selItem.X : 0) }} Ω</b></div>
          </template>

          <template v-else-if="sel.kind === 'xfmr'">
            <div class="cl-row"><span>原边匝数 N₁</span><b>{{ sel.p.n1.toFixed(0) }}</b></div>
            <input class="cl-rg" type="range" min="20" max="400" step="10" v-model.number="sel.p.n1" />
            <div class="cl-row"><span>副边匝数 N₂</span><b>{{ sel.p.n2.toFixed(0) }}</b></div>
            <input class="cl-rg" type="range" min="20" max="400" step="10" v-model.number="sel.p.n2" />
            <div class="cl-row"><span>匝数比 N₂ : N₁</span><b>{{ f2(sel.p.n2 / sel.p.n1) }}</b></div>
          </template>

          <template v-else-if="sel.kind === 'diode'">
            <div class="cl-row"><span>导通电压 U_D</span><b>0.70 V</b></div>
            <div class="cl-row"><span>此刻状态</span><b>{{ selItem && Math.abs(selItem.r.I) > 1e-3 ? '导通' : '截止' }}</b></div>
          </template>

          <template v-else-if="sel.kind === 'amm'">
            <div class="cl-row"><span>读数</span><b>{{ f2(selItem ? Math.abs(selItem.r.I) : 0) }} A</b></div>
          </template>

          <template v-else-if="sel.kind === 'volt'">
            <div class="cl-row"><span>读数</span><b>{{ f2(selItem ? Math.abs(selItem.r.U) : 0) }} V</b></div>
          </template>

          <template v-else-if="sel.kind === 'galv'">
            <div class="cl-row"><span>满偏电流 Ig</span><b>{{ sel.p.Ig.toFixed(1) }} mA</b></div>
            <input class="cl-rg" type="range" min="0.1" max="10" step="0.1" v-model.number="sel.p.Ig" />
            <div class="cl-row"><span>内阻 Rg</span><b>{{ sel.p.Rg.toFixed(0) }} Ω</b></div>
            <input class="cl-rg" type="range" min="10" max="1000" step="10" v-model.number="sel.p.Rg" />
            <div class="cl-row"><span>此刻电流</span><b>{{ f2(galvNow.mA) }} mA</b></div>
            <div class="cl-row hl"><span>指针偏转 |I| / Ig</span><b>{{ f2(galvNow.pct) }} %{{ galvNow.pct > 101 ? '（超满偏）' : '' }}</b></div>
          </template>

          <template v-else-if="sel.kind === 'motor'">
            <div class="cl-row"><span>电枢电阻 R</span><b>{{ sel.p.R.toFixed(1) }} Ω</b></div>
            <input class="cl-rg" type="range" min="0.2" max="10" step="0.2" v-model.number="sel.p.R" />
            <div class="cl-row"><span>反电动势 E</span><b>{{ sel.p.E.toFixed(1) }} V</b></div>
            <input class="cl-rg" type="range" min="0" max="12" step="0.5" v-model.number="sel.p.E" />
            <div class="cl-seg">
              <button :class="{ on: !sel.p.stall }" @click="sel.p.stall = false">转动</button>
              <button :class="{ on: sel.p.stall }" @click="sel.p.stall = true">堵转</button>
            </div>
            <div class="cl-row"><span>此刻电流</span><b>{{ f2(Math.abs(selItem ? selItem.r.Idc : 0)) }} A</b></div>
            <div class="cl-row hl"><span>机械功率 Pm = E·I</span><b>{{ f2(motorNow.Pm) }} W</b></div>
            <div class="cl-row hl"><span>效率 η = Pm / UI</span><b>{{ motorNow.eta }}</b></div>
          </template>

          <template v-else-if="sel.kind === 'qnp'">
            <div class="cl-row"><span>电流放大系数 β</span><b>{{ num(sel.p.beta, 100).toFixed(0) }}</b></div>
            <input class="cl-rg" type="range" min="10" max="300" step="10" v-model.number="sel.p.beta" />
            <div class="cl-row"><span>发射结电阻 Rbe</span><b>{{ num(sel.p.Rbe, 1000).toFixed(0) }} Ω</b></div>
            <input class="cl-rg" type="range" min="100" max="5000" step="50" v-model.number="sel.p.Rbe" />
            <div class="cl-row"><span>集电极电阻 rce</span><b>{{ (num(sel.p.rce, 50000) / 1000).toFixed(0) }} kΩ</b></div>
            <input class="cl-rg" type="range" min="1000" max="200000" step="1000" v-model.number="sel.p.rce" />
            <template v-if="qnpNow">
              <div class="cl-row"><span>发射结状态</span><b>{{ qnpNow.on ? '导通' : '截止' }}</b></div>
              <div class="cl-row"><span>基极电流 Ib</span><b>{{ f2(qnpNow.Ib * 1000) }} mA</b></div>
              <div class="cl-row"><span>发射结电压 Ube</span><b>{{ f2(qnpNow.Ube) }} V</b></div>
              <div class="cl-row"><span>集电极电流 Ic</span><b>{{ f2(qnpNow.Ic * 1000) }} mA</b></div>
              <div class="cl-row hl"><span>管压降 Uce</span><b>{{ f2(qnpNow.Uce) }} V</b></div>
              <div class="cl-row"><span>实测 Ic / Ib</span><b>{{ qnpNow.beta }}</b></div>
            </template>
          </template>

          <template v-else-if="sel.kind === 'amp'">
            <div class="cl-row"><span>电压放大倍数 A</span><b>{{ num(sel.p.A, 10).toFixed(1) }}</b></div>
            <input class="cl-rg" type="range" min="-20" max="20" step="0.5" v-model.number="sel.p.A" />
            <div class="cl-row"><span>输入电阻 Ri</span><b>{{ (num(sel.p.Ri, 10000) / 1000).toFixed(1) }} kΩ</b></div>
            <input class="cl-rg" type="range" min="100" max="100000" step="100" v-model.number="sel.p.Ri" />
            <div class="cl-row"><span>输出电阻 Ro</span><b>{{ num(sel.p.Ro, 100).toFixed(0) }} Ω</b></div>
            <input class="cl-rg" type="range" min="1" max="1000" step="1" v-model.number="sel.p.Ro" />
            <template v-if="ampNow">
              <div class="cl-row"><span>输入电压 Uin</span><b>{{ f2(ampNow.uin) }} V</b></div>
              <div class="cl-row"><span>输出电压 Uout</span><b>{{ f2(ampNow.uout) }} V</b></div>
              <div class="cl-row hl"><span>实测放大 Uout / Uin</span><b>{{ ampNow.gain }}</b></div>
            </template>
          </template>

          <p class="cl-note" v-if="sel.kind !== 'wire'">
            {{ selHint }}
          </p>
          <button class="cl-del" @click="removeEl(selKey)">删除这个元件</button>
        </div>

        <div class="cl-card" v-else>
          <h2>没有选中</h2>
          <p class="cl-note">用「选择」工具点一个元件，这里就能调它的电动势、阻值、电容、电感与匝数，开关还能直接切换通断。</p>
        </div>

        <div class="cl-card">
          <h2>各元件读数</h2>
          <table class="cl-tb" v-if="readRows.length">
            <thead>
              <tr><th>元件</th><th>I/A</th><th>U/V</th><th>P/W</th></tr>
            </thead>
            <tbody>
              <tr v-for="r in readRows" :key="r.key">
                <td class="cl-name">{{ r.name }}<i>{{ r.extra }}</i></td>
                <td>{{ f2(r.I) }}</td>
                <td>{{ f2(r.U) }}</td>
                <td>{{ f2(r.P) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="cl-note" v-else>格线上还没有元件。</p>
          <p class="cl-tot" v-if="readRows.length">
            <template v-if="totals.mech > 1e-6">
              电源提供 {{ f2(totals.srcP) }} W：{{ f2(totals.mech) }} W 变成机械能，{{ f2(totals.heat) }} W 变成热。
            </template>
            <template v-else>电源提供 {{ f2(totals.srcP) }} W，全部变成热 {{ f2(totals.heat) }} W。</template>
          </p>
        </div>

        <div class="cl-card">
          <h2>使用说明</h2>
          <p class="cl-note">怎么摆元件、怎么连导线、每个元件是做什么的，都收在同一份说明里。</p>
          <button class="cl-b wide" @click="helpOpen = true">打开使用说明</button>
        </div>
      </aside>
    </div>

    <!-- 使用说明：挂到 body 上，免得被 main 的切页动画当成定位包含块 -->
    <Teleport to="body">
      <div v-if="helpOpen" class="cl-modal" @click.self="helpOpen = false">
        <div class="cl-doc" role="dialog" aria-modal="true" aria-label="电路实验室使用说明">
          <div class="cl-doc-hd">
            <h2>电路实验室 · 使用说明</h2>
            <button class="cl-x" aria-label="关闭" @click="helpOpen = false">✕</button>
          </div>
          <div class="cl-doc-bd">
            <p class="cl-doc-lead">左边取元件放到格线上，用导线把节点连起来，点中元件就能调参数。每一帧都按节点电压法重算一遍：导线上的小点沿电流方向走，走得快慢就是电流大小；交流电路里小点随电流来回摆，摆动的幅度就是峰值电流。</p>

            <h3>怎么玩</h3>
            <ul class="cl-doc-ls">
              <li>选「导线」，从一个节点按住拖到另一个节点，导线沿格线自动铺好；点一条空格线也能铺一段。两个节点正好斜着相对时，拖过去铺的是一条对角导线。</li>
              <li>其余元件点一条格线就放上去；再点同一条可换成别的元件。「变压器」一次占两条相邻的平行格线。</li>
              <li>对角线也能放元件：拿起能放置的工具后，两条对角线会淡描在画板上，指针底下那条边还会亮出一道虚线，点下去就落在它上面。变压器、放大器与三极管要占两条边，只能摆在横线或竖线上。</li>
              <li>「选择」点元件调参数，点开关直接切通断；「橡皮」点谁删谁，选中后按 Delete 也能删。</li>
              <li>电池的长板是正极，电流从正极流出、经外电路回到负极，小点就是这么走的。</li>
              <li>接上交流电源或发电机，电容、电感与变压器才起作用：电容通交流、隔直流，电感通直流、阻交流。</li>
              <li>画板可以放缩与平移：滚轮在指针处放大缩小（倍率 0.55×–3.2×），按住画面空白处拖动平移，双击画板或点右下角的百分数复原。选「选择」时点空白只取消选中，按住不放才开始拖。</li>
              <li>灯泡选「电阻曲线」一档时，右栏画出它的伏安特性曲线：横轴电压、纵轴电流，曲线随电压上翘（灯丝越热电阻越大），空心圈是额定点，实心点是此刻的工作点。</li>
              <li>右栏「各元件读数」逐条列电流、电压与功率，表下一行给出电源提供的功率；接了电动机时这一行拆成机械能与热两部分。</li>
            </ul>

            <h3>元件说明</h3>
            <template v-for="g in PAL" :key="'dg' + g.t">
              <h4>{{ g.t }}</h4>
              <div v-for="t in g.items" :key="'de' + t.k" class="cl-doc-el">
                <svg class="cl-pic" viewBox="0 0 24 24" aria-hidden="true">
                  <path v-for="(s, si) in t.ico" :key="si" :d="s.d" :class="{ f: s.f }" />
                </svg>
                <div class="cl-doc-tx"><b>{{ t.t }}</b><span>{{ t.about }}</span></div>
              </div>
            </template>

            <h4>工具</h4>
            <div v-for="t in TOOLS" :key="'dt' + t.k" class="cl-doc-el">
              <svg class="cl-pic" viewBox="0 0 24 24" aria-hidden="true">
                <path v-for="(s, si) in t.ico" :key="si" :d="s.d" :class="{ f: s.f }" />
              </svg>
              <div class="cl-doc-tx"><b>{{ t.t }}</b><span>{{ t.about }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { PAL, TOOLS, DEFAULTS, KIND_NAME } from '../../physics/circuit/data.js';
import { num, f2, EMPTY_R } from '../../physics/circuit/util.js';
import {
  SQ2, bulbRAt, acOf, genPeak, solveAll,
} from '../../physics/circuit/solve.js';
import { flowOf, bulbPlotOf } from '../../physics/circuit/plot.js';

/* ── 网格 ─────────────────────────────────────────────── */
/* 格网按画板的实际尺寸现算：格距固定，列数与行数跟着画板宽高走，两端留边由
   余下的宽度均分（最多半格），格线因此铺满整块画板，不再缩在正中间。 */
const CELL = 84;         // 格距（viewBox 单位，与 CSS 像素 1:1）
const COLS = ref(12);    // 节点列数
const ROWS = ref(8);     // 节点行数
const PADX = ref(36);    // 左右留边
const PADY = ref(36);    // 上下留边
// 画板放不下时手工 / 自动往右下方再接的列数与行数：只往外长，不收回来
const EXTRA = reactive({ c: 0, r: 0 });
const W = computed(() => PADX.value * 2 + (COLS.value - 1) * CELL);
const H = computed(() => PADY.value * 2 + (ROWS.value - 1) * CELL);
// 电感线圈的四个半圆，正中间对齐边中点，沿边占 ±20
const COIL = 'M-20 0 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0';

const NODES = computed(() => {
  const list = [];
  for (let j = 0; j < ROWS.value; j++) {
    for (let i = 0; i < COLS.value; i++) {
      list.push({ id: j * COLS.value + i, i, j, x: PADX.value + i * CELL, y: PADY.value + j * CELL });
    }
  }
  return list;
});

/* 量到画板尺寸之后重排格网。格数只增不减：窗口缩小时，已经摆下的元件
   宁可留在格网外沿，也不能让它们的坐标失效。 */
function fitGrid() {
  const svg = svgEl.value;
  if (!svg) return;
  const r = svg.getBoundingClientRect();
  if (r.width < 80 || r.height < 80) return;
  const cols = Math.max(6, Math.floor((r.width - 52) / CELL) + 1);
  const rows = Math.max(4, Math.floor((r.height - 52) / CELL) + 1);
  let needI = 0;
  let needJ = 0;
  for (const key of Object.keys(cells)) {
    const el = cells[key];
    const edges = [key];
    if (el.p && el.p.k2) edges.push(el.p.k2);
    for (const k of edges) {
      for (const [i, j] of endsOf(k)) {
        needI = Math.max(needI, i);
        needJ = Math.max(needJ, j);
      }
    }
  }
  const nextCols = Math.max(cols, needI + 1) + EXTRA.c;
  const nextRows = Math.max(rows, needJ + 1) + EXTRA.r;
  const changed = nextCols !== COLS.value || nextRows !== ROWS.value;
  COLS.value = nextCols;
  ROWS.value = nextRows;
  PADX.value = Math.max(18, (r.width - (nextCols - 1) * CELL) / 2);
  PADY.value = Math.max(18, (r.height - (nextRows - 1) * CELL) / 2);
  if (changed) resetView();
}

/* 格网不够用：往右下方再接几列几行。视野由 fitGrid 的 resetView 重新框住
   整块（更大的）格网，所以接完仍然一眼看全，不会只露出半张板。 */
function growGrid(dc = 4, dr = 4) {
  EXTRA.c += dc;
  EXTRA.r += dr;
  fitGrid();
}
/** 摆件落到最后一列 / 最后一行时顺手把格网往外接一段，画到边就自动长出空地 */
function keepRoom(...keys) {
  for (const k of keys) {
    if (!k) continue;
    for (const [i, j] of endsOf(k)) {
      if (i >= COLS.value - 1 || j >= ROWS.value - 1) { growGrid(4, 4); return; }
    }
  }
}

/* 元件表、工具表、默认参数与中文名都在 physics/circuit/data.js；这里只留布局与交互 */


const tool = ref('wire');
const cells = reactive({});
const selKey = ref('');
const running = ref(true);
const drag = ref(null);
const svgEl = ref(null);
const rootEl = ref(null);
const helpOpen = ref(false);   // 使用说明弹窗
// 画板高度：进页与窗口变化时按「顶栏以下、页脚以上还剩多少」现算，按死高度写回去。
// 题头 + 画板 + 页脚正好一屏，页脚那一行字与下面的链接不会被顶出视野。
const bodyH = ref(0);
const bodyStyle = computed(() => (bodyH.value ? { height: bodyH.value + 'px' } : {}));
// 画板上的鼠标样式随所选工具换：选择是箭头（落在元件上再转手形），
// 走线是十字准星，橡皮是自绘的小方块（取色后仍是浅底也能看清），
// 摆元件用「复制」光标提示「这一下是放置」，量具另用一个十字加框区分。
const ERASE_CUR = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">' +
  '<rect x="4" y="8" width="14" height="9" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/>' +
  '<rect x="4" y="8" width="14" height="9" rx="2" fill="none" stroke="#333" stroke-width="1.4"/></svg>',
) + '") 11 12, cell';
const MEASURE_KINDS = ['amm', 'volt', 'galv'];
const boardCursor = computed(() => {
  if (tool.value === 'sel') {
    const d = drag.value;
    return d && d.mode === 'move' && d.moved ? 'grabbing' : 'default';
  }
  if (tool.value === 'erase') return ERASE_CUR;
  if (tool.value === 'wire') return 'crosshair';
  if (MEASURE_KINDS.includes(tool.value)) return 'cell';
  return 'copy';
});
function fitHeight() {
  const el = rootEl.value ? rootEl.value.querySelector('.cl-body') : null;
  if (!el) return;
  // 量的是 .cl-body 在文档里的顶边，与它自己的高度无关，直接读当前矩形即可
  const top = el.getBoundingClientRect().top + window.scrollY;
  // 页脚留在板子底下：按它的实际高度预留，画板与页脚正好拼成一屏
  const foot = document.querySelector('footer');
  const fh = foot ? Math.round(foot.getBoundingClientRect().height) : 0;
  bodyH.value = Math.max(320, Math.round(window.innerHeight - top - fh - 16));
}
// 放不下时的临时提示（与下面的电路告警共用一个位置，告警优先）
const msg = ref('');
let msgT = 0;
function say(t) {
  msg.value = t;
  clearTimeout(msgT);
  msgT = setTimeout(() => { msg.value = ''; }, 2400);
}

const ALL_TIPS = PAL.flatMap(g => g.items).concat(TOOLS);
const toolTip = computed(() => {
  const t = ALL_TIPS.find(x => x.k === tool.value);
  return t ? t.tip : '';
});
const sel = computed(() => (selKey.value && cells[selKey.value] ? cells[selKey.value] : null));
const selTitle = computed(() => (sel.value ? (KIND_NAME[sel.value.kind] || '元件') : ''));

const selHint = computed(() => {
  if (!sel.value) return '';
  const k = sel.value.kind;
  if (k === 'bat') return '内阻越大，接上负载后路端电压掉得越多；内阻拖到 0.1 Ω 再接一条纯导线，就是短路。';
  if (k === 'ac') return '峰值电压是正弦波的最大值，有效值是它的 0.707 倍。整个电路共用这一台的频率。';
  if (k === 'gen') return '线圈匀速转动时电动势按 ε = NBSω 现算：峰值与匝数、磁感应强度、线圈面积、转速都成正比，频率就等于转速。';
  if (k === 'bulb') return '电阻曲线一档按灯丝的伏安特性走：两端电压越高、灯丝越热、电阻越大；恒定电阻一档相当于一只固定的电阻。';
  if (k === 'res') return '改阻值，回路电流按欧姆定律跟着变。';
  if (k === 'cap') return '电容隔直流、通交流。容抗 1/(ωC) 随频率与容量反比变小，直流下相当于断路。';
  if (k === 'ind') return '电感通直流、阻交流。感抗 ωL 随频率与电感正比变大，直流下只剩这段线圈的直流电阻 r。';
  if (k === 'xfmr') return '变压器占两条相邻的平行格线，原边接电源、副边接负载；匝数比决定电压比，电流比反过来取倒数。';
  if (k === 'diode') return '两端电压到 0.7 V 才导通，反向截止。三角形指向的一方是负极。';
  if (k === 'amm') return '电流表串联在电路里，内阻当作 0，读数是这条支路上的电流。';
  if (k === 'volt') return '电压表并联在电路里，内阻当作 1 MΩ，读数是这条支路两端的电压。';
  if (k === 'galv') return '灵敏电流计就是表头：满偏电流 Ig 只有毫安量级、内阻 Rg 有上百欧，指针偏转角与通过它的电流成正比。串一只大电阻分压就是电压表，并一只小电阻分流就是电流表。';
  if (k === 'motor') return '电动机不是纯电阻：电流按 (U − E)/R 走，电功一部分变成机械能 E·I、一部分变成热 I²R。堵转时反电动势记作 0，电流按 U/R 走。';
  if (k === 'qnp') return '三极管占两条相邻的格线：主边是集电极与发射极，另一条从它们的共用端接出去的是基极。发射结到 0.65 V 才导通，集电极电流按 β 倍基极电流走。';
  if (k === 'amp') return '放大器占两条相邻的格线：输入边上是它的输入电阻与取样电压，另一条是输出边。输出端电压等于输入电压的 A 倍，A 为负时相位相反。';
  if (k === 'sw') return '闭合时当作零阻支路，断开时这一格不再导电。';
  return '';
});

/* ── 边的表示：h:i,j 从 (i,j) 到 (i+1,j)，v 到 (i,j+1)，d 到 (i+1,j+1)，u 到 (i+1,j-1) ── */
function endsOf(key) {
  const [t, rest] = key.split(':');
  const [i, j] = rest.split(',').map(Number);
  if (t === 'h') return [[i, j], [i + 1, j]];
  if (t === 'v') return [[i, j], [i, j + 1]];
  if (t === 'd') return [[i, j], [i + 1, j + 1]];
  return [[i, j], [i + 1, j - 1]];
}
function posOf(ij) {
  return { x: PADX.value + ij[0] * CELL, y: PADY.value + ij[1] * CELL };
}
/* 对角线也能摆元件：两条方向都列出来，拿起放置类工具时淡描在画板上，
   免得只有斜着拖线的时候才碰得到 */
const DIAG = computed(() => {
  const list = [];
  const C = COLS.value;
  const R = ROWS.value;
  for (let j = 0; j < R; j++) {
    for (let i = 0; i < C; i++) {
      const a = posOf([i, j]);
      if (i < C - 1 && j < R - 1) {
        const b = posOf([i + 1, j + 1]);
        list.push({ k: 'd' + i + '_' + j, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
      if (i < C - 1 && j > 0) {
        const b = posOf([i + 1, j - 1]);
        list.push({ k: 'u' + i + '_' + j, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    }
  }
  return list;
});
const showDiag = computed(() => tool.value !== 'sel' && tool.value !== 'erase');
// 指针底下那条边：按住之前先亮出来，点下去就落在它上面
const hoverEdge = ref('');
const hoverLine = computed(() => {
  if (!hoverEdge.value) return null;
  const [A, B] = endsOf(hoverEdge.value);
  const a = posOf(A);
  const b = posOf(B);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
});
// 换了工具就把旧提示抹掉，免得鼠标还没回到画板上时留着一截虚线
watch(tool, () => { hoverEdge.value = ''; });
/* num / f2 在 physics/circuit/util.js，右栏与求解器共用同一套读数口径 */

/* ── 复数与节点电压法 ───────────────────────────────── */
/* 复数运算、节点电压法与各类元件的等效都在 physics/circuit/solve.js */








/* ── 视图模型 ───────────────────────────────────────── */
/* EMPTY_R / flowOf / bulbPlotOf 在 physics/circuit/ 下，这里只管拼装 */

const items = computed(() => {
  const sol = solveAll({ cells, cols: COLS.value, endsOf });
  const wFreq = sol.__w || 0;
  const list = [];
  for (const key of Object.keys(cells)) {
    const el = cells[key];
    const [A, B] = endsOf(key);
    const p = posOf(A);
    const q = posOf(B);
    const horiz = p.y === q.y;
    const vert = p.x === q.x;
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    // 边的方向：横 0°、竖 90°、两条对角线 ±45°，图符统一按它转
    const segL = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const ux = (q.x - p.x) / segL;
    const uy = (q.y - p.y) / segL;
    const ang = Math.round(Math.atan2(uy, ux) * 180 / Math.PI);
    const tex = `rotate(${-ang})`;
    const ring = horiz ? { w: 68, h: 52 } : vert ? { w: 52, h: 68 } : { w: 64, h: 64 };
    const r = sol[key] || EMPTY_R;

    let val = '';
    if (el.kind === 'bat') val = `ε ${f2(el.p.emf)} V，r ${f2(el.p.r)} Ω`;
    else if (el.kind === 'ac') val = `${f2(el.p.A)} V / ${f2(el.p.f)} Hz`;
    else if (el.kind === 'gen') {
      const ga = acOf(el);
      val = `εm ${f2(ga.A)} V / ${f2(ga.f)} Hz`;
    }
    else if (el.kind === 'res') val = `R ${f2(el.p.R)} Ω`;
    else if (el.kind === 'bulb') val = el.p.mode === 'curve' ? `${f2(el.p.Ur)} V ${f2(el.p.Pr)} W` : `R ${f2(el.p.R)} Ω`;
    else if (el.kind === 'sw') val = el.p.on ? '闭合' : '断开';
    else if (el.kind === 'cap') val = `C ${f2(el.p.C)} μF`;
    else if (el.kind === 'ind') val = `L ${f2(el.p.L)} mH`;
    else if (el.kind === 'xfmr') val = `${f2(el.p.n1)} : ${f2(el.p.n2)}`;
    else if (el.kind === 'qnp') val = `β ${f2(el.p.beta)}`;
    else if (el.kind === 'amp') val = `A ×${f2(el.p.A)}`;
    else if (el.kind === 'diode') val = '0.7 V';
    else if (el.kind === 'galv') val = `Ig ${f2(el.p.Ig)} mA`;
    else if (el.kind === 'motor') val = el.p.stall ? `堵转 R ${f2(el.p.R)} Ω` : `R ${f2(el.p.R)} Ω / E ${f2(el.p.E)} V`;

    let X = 0;
    if (el.kind === 'cap') X = wFreq > 0 ? 1 / (wFreq * Math.max(1e-12, num(el.p.C, 100) * 1e-6)) : Infinity;
    else if (el.kind === 'ind') X = wFreq * Math.max(1e-9, num(el.p.L, 100) * 1e-3);

    const Rnow = el.kind === 'bulb' ? (r.R || bulbRAt(el.p, 0)) : 0;

    let bright = 0;
    if (el.kind === 'bulb') {
      const Pm = r.Irms * r.Irms * Rnow;
      const ref = el.p.mode === 'curve' ? Math.max(0.5, num(el.p.Pr, 3)) : 2;
      bright = Math.min(1, Math.pow(Math.max(0, Pm) / ref, 0.55));
    }

    let ndl = null;
    let spin = false;
    if (el.kind === 'galv') {
      // 指针端点：偏转角与 |I| / Ig 成正比，满偏时扫到刻度弧右端
      const Ig = Math.max(0.01, num(el.p.Ig, 1));
      const fr = Math.min(1, (r.Irms * 1000) / Ig);
      const sg = Math.sign(r.Idc) || Math.sign(r.IacRe) || 1;
      const a = -Math.PI / 2 + sg * fr * (Math.PI / 3);
      ndl = { x2: 7.2 * Math.cos(a), y2: 1.8 + 7.2 * Math.sin(a) };
    } else if (el.kind === 'motor') {
      spin = !el.p.stall && Math.max(Math.abs(r.Idc), r.Irms) > 0.05;
    }

    const item = {
      key, kind: el.kind, p, q, mx, my, horiz, vert, ux, uy, ang, tex, ring,
      r, X, Rnow, bright, ndl, spin,
      flow: flowOf(p, q, r.Idc, r.Iac, sol.__f),
      flow2: null,
      tf: `translate(${mx} ${my}) rotate(${ang})`,
      lb1: null, lb2: null, val,
      cur: Math.max(Math.abs(r.Idc), r.Irms) > 1e-4 ? `I = ${f2(r.Irms)} A` : '',
      sel: key === selKey.value,
      swOn: el.kind === 'sw' && el.p.on,
      leads: null, leads2: null, tf2: null, core: null, core2: null, r2: null,
    };

    // 变压器占两条平行格线：原边一条、副边一条，箭头与记号都按各自的中点摆
    if (el.kind === 'xfmr' && el.p.k2) {
      const r2 = sol[key + '\u0000s'] || EMPTY_R;
      item.r2 = r2;
      const [A2, B2] = endsOf(el.p.k2);
      const p2 = posOf(A2);
      const q2 = posOf(B2);
      const mx2 = (p2.x + q2.x) / 2;
      const my2 = (p2.y + q2.y) / 2;
      const L = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const ux = (q.x - p.x) / L;
      const uy = (q.y - p.y) / L;
      const lead = (a, b, cx, cy) => [
        { x1: a.x, y1: a.y, x2: cx - ux * 20, y2: cy - uy * 20 },
        { x1: cx + ux * 20, y1: cy + uy * 20, x2: b.x, y2: b.y },
      ];
      item.leads = lead(p, q, mx, my);
      item.leads2 = lead(p2, q2, mx2, my2);
      item.tf2 = `translate(${mx2} ${my2}) rotate(${horiz ? 0 : 90})`;
      const sg = Math.sign(horiz ? my2 - my : mx2 - mx) || 1;
      item.core = horiz
        ? { x1: mx - 8, y1: my + sg * 12, x2: mx - 8, y2: my2 - sg * 12 }
        : { x1: mx + sg * 12, y1: my - 8, x2: mx2 - sg * 12, y2: my - 8 };
      item.core2 = horiz
        ? { x1: mx + 8, y1: my + sg * 12, x2: mx + 8, y2: my2 - sg * 12 }
        : { x1: mx + sg * 12, y1: my + 8, x2: mx2 - sg * 12, y2: my + 8 };
      // 参数标在副边那一条的外侧，避开中间的铁芯
      item.lb1 = horiz
        ? { x: mx, y: Math.max(my, my2) + 26, anchor: 'middle' }
        : { x: Math.max(mx, mx2) + 26, y: my + 4, anchor: 'start' };
      item.lb2 = { x: item.lb1.x, y: item.lb1.y + 16, anchor: item.lb1.anchor };
      item.flow2 = flowOf(p2, q2, r2.Idc, r2.Iac, sol.__f);
    } else if (el.kind === 'amp' && el.p.k2) {
      // 放大器：输入端那条边画成三角形，顶点朝输出那条边引一条线接到它的中点
      const r2 = sol[key + '\u0000o'] || EMPTY_R;
      item.r2 = r2;
      const [A2, B2] = endsOf(el.p.k2);
      const p2 = posOf(A2);
      const q2 = posOf(B2);
      const mx2 = (p2.x + q2.x) / 2;
      const my2 = (p2.y + q2.y) / 2;
      const L = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const ux = (q.x - p.x) / L;
      const uy = (q.y - p.y) / L;
      let dx = -uy;
      let dy = ux;
      if ((mx2 - mx) * dx + (my2 - my) * dy < 0) { dx = -dx; dy = -dy; }
      const b1 = { x: mx - ux * 20, y: my - uy * 20 };
      const b2 = { x: mx + ux * 20, y: my + uy * 20 };
      const ap = { x: mx + dx * 30, y: my + dy * 30 };
      item.ampPts = `${b1.x},${b1.y} ${b2.x},${b2.y} ${ap.x},${ap.y}`;
      item.leads = [
        { x1: p.x, y1: p.y, x2: b1.x, y2: b1.y },
        { x1: b2.x, y1: b2.y, x2: q.x, y2: q.y },
        { x1: ap.x, y1: ap.y, x2: mx2, y2: my2 },
      ];
      item.outLine = { x1: p2.x, y1: p2.y, x2: q2.x, y2: q2.y };
      item.flow2 = flowOf(p2, q2, r2.Idc, r2.Iac, sol.__f);
      // 参数标在输出那条边的外侧，避开三角形与中间那条引线
      item.lb1 = horiz
        ? { x: mx2, y: Math.max(my, my2) + 26, anchor: 'middle' }
        : { x: Math.max(mx, mx2) + 26, y: my + 4, anchor: 'start' };
      item.lb2 = { x: item.lb1.x, y: item.lb1.y + 16, anchor: item.lb1.anchor };
    } else if (el.kind === 'qnp' && el.p.k2) {
      // 三极管：主边是集电极—发射极，另一条从共用节点接出去到基极
      const r2 = sol[key + '\u0000b'] || EMPTY_R;
      item.r2 = r2;
      const [A2, B2] = endsOf(el.p.k2);
      const p2 = posOf(A2);
      const q2 = posOf(B2);
      const same = (a, b) => a[0] === b[0] && a[1] === b[1];
      const sharedIsA = same(A, A2) || same(A, B2);
      const cEnd = sharedIsA ? q : p;
      const eEnd = sharedIsA ? p : q;
      const bEnd = (same(A2, A) || same(A2, B)) ? q2 : p2;
      const L = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const ux = (q.x - p.x) / L;
      const uy = (q.y - p.y) / L;
      let dx = -uy;
      let dy = ux;
      if ((bEnd.x - mx) * dx + (bEnd.y - my) * dy < 0) { dx = -dx; dy = -dy; }
      const sC = cEnd === q ? 1 : -1;
      const sE = -sC;
      item.leads = [
        { x1: cEnd.x, y1: cEnd.y, x2: mx + sC * ux * 15, y2: my + sC * uy * 15 },
        { x1: mx + sE * ux * 15, y1: my + sE * uy * 15, x2: eEnd.x, y2: eEnd.y },
      ];
      // 发射极那一头加箭头：NPN 的箭头由基极指向发射极，也就是朝外
      const ax = mx + sE * ux * 24;
      const ay = my + sE * uy * 24;
      const nx = -sE * uy;
      const ny = sE * ux;
      item.tr = {
        cx: mx, cy: my, r: 15,
        bar: { x1: mx - ux * 9, y1: my - uy * 9, x2: mx + ux * 9, y2: my + uy * 9 },
        base: { x1: mx, y1: my, x2: bEnd.x, y2: bEnd.y },
        arrow: `${ax - sE * ux * 7 + nx * 4.4},${ay - sE * uy * 7 + ny * 4.4} `
             + `${ax},${ay} `
             + `${ax - sE * ux * 7 - nx * 4.4},${ay - sE * uy * 7 - ny * 4.4}`,
      };
      // 基极那条引线是斜的，小点按画出来的那一段布，才贴着线走
      const bl = Math.hypot(bEnd.x - mx, bEnd.y - my) || 1;
      const bux = (bEnd.x - mx) / bl;
      const buy = (bEnd.y - my) / bl;
      item.flow2 = flowOf({ x: mx + bux * 16, y: my + buy * 16 }, bEnd, r2.Idc, r2.Iac, sol.__f);
      // 参数标在基极那头的外侧
      item.lb1 = Math.abs(dy) > Math.abs(dx)
        ? { x: bEnd.x, y: bEnd.y + dy * 22 + 4, anchor: 'middle' }
        : { x: bEnd.x + dx * 18, y: bEnd.y + 4, anchor: dx > 0 ? 'start' : 'end' };
      item.lb2 = { x: item.lb1.x, y: item.lb1.y + 16, anchor: item.lb1.anchor };
    } else if (val) {
      item.lb1 = horiz
        ? { x: mx, y: my + 34, anchor: 'middle' }
        : { x: mx + 24, y: my - 2, anchor: 'start' };
      item.lb2 = { x: item.lb1.x, y: item.lb1.y + 18, anchor: item.lb1.anchor };
    }

    list.push(item);
  }
  return list;
});

const selItem = computed(() => items.value.find(e => e.key === selKey.value) || null);

/* 灯泡的伏安特性：曲线与工作点由 plot.js 的 bulbPlotOf 现算，
   空心圈是额定点、实心点是此刻的工作点 */
const bulbPlot = computed(() => {
  const it = selItem.value;
  const el = sel.value;
  if (!el || el.kind !== 'bulb' || el.p.mode !== 'curve') return null;
  const opU = Math.abs(it ? it.r.Urms : 0);
  const opI = Math.abs(it ? it.r.Irms : 0);
  return bulbPlotOf(el.p, opU, opI);
});

/* 特性指数 α 的档位说法：只改曲线弯法，额定点不动 */
const bulbShape = computed(() => {
  const el = sel.value;
  if (!el || el.kind !== 'bulb') return '';
  const a = num(el.p.alpha, 0.5);
  if (a < 0.2) return '近恒流：电流几乎不随电压变';
  if (a < 0.9) return '凹：电阻随电压升高，电流涨得越来越慢';
  if (a <= 1.1) return '直线：相当于一只定值电阻';
  return '凸：电阻随电压下降，电流涨得越来越快';
});

/* 灵敏电流计：指针偏转量按 |I| / Ig 算，超过满偏单独标一句 */
const galvNow = computed(() => {
  const it = selItem.value;
  const el = sel.value;
  if (!it || !el) return { mA: 0, pct: 0 };
  const mA = it.r.Irms * 1000;
  const Ig = Math.max(0.01, num(el.p.Ig, 1));
  return { mA, pct: (mA / Ig) * 100 };
});

/* 电动机：机械功率 Pm = E·I，输入功率 = Pm + 热功率 I²R */
const motorNow = computed(() => {
  const it = selItem.value;
  const el = sel.value;
  if (!it || !el) return { Pm: 0, eta: '—' };
  if (el.p.stall) return { Pm: 0, eta: '0（堵转，全变成热）' };
  const Pm = Math.max(0, num(el.p.E, 0) * it.r.Idc);
  const Pin = Pm + it.r.P;
  if (Pm < 1e-6 || Pin < 1e-9) return { Pm, eta: '—' };
  return { Pm, eta: `${f2((Pm / Pin) * 100)} %` };
});

/* 三极管：主边记集电极电流与管压降，基极那条边另记 Ib 与 Ube */
const qnpNow = computed(() => {
  const it = selItem.value;
  if (!it || it.kind !== 'qnp' || !it.r.q) return null;
  const q = it.r.q;
  const b = it.r.qB;
  return {
    Ic: q.I, Uce: q.U,
    Ib: b ? b.I : 0, Ube: b ? b.U : 0,
    on: !!it.r.qOn,
    beta: Math.abs(b ? b.I : 0) > 1e-7 ? f2(q.I / b.I) : '—',
  };
});

/* 放大器：输入端与输出端的电压，比值即这一级的实测放大倍数 */
const ampNow = computed(() => {
  const it = selItem.value;
  if (!it || it.kind !== 'amp' || !it.r2) return null;
  const uin = it.r.U;
  const uout = it.r2.U;
  return { uin, uout, gain: Math.abs(uin) > 1e-6 ? f2(uout / uin) : '—' };
});

const usedIds = computed(() => {
  const s = new Set();
  for (const key of Object.keys(cells)) {
    const el = cells[key];
    const [A, B] = endsOf(key);
    s.add(A[1] * COLS.value + A[0]);
    s.add(B[1] * COLS.value + B[0]);
    if (el.p && el.p.k2) {
      const [C, D] = endsOf(el.p.k2);
      s.add(C[1] * COLS.value + C[0]);
      s.add(D[1] * COLS.value + D[0]);
    }
  }
  return s;
});
const NODESV = computed(() => NODES.value.map(n => ({ ...n, used: usedIds.value.has(n.id) })));

const flowStyle = f => (f
  ? {
    '--ox': f.ox + 'px', '--oy': f.oy + 'px',
    '--fx': f.fx + 'px', '--fy': f.fy + 'px',
    animationDuration: f.dur + 's',
  }
  : {});

/* ── 读数 ───────────────────────────────────────────── */
const readRows = computed(() => {
  const list = [];
  for (const e of items.value) {
    if (e.kind === 'wire') continue;
    const el = cells[e.key];
    let base = KIND_NAME[e.kind] || '元件';
    let extra = '';
    if (e.kind === 'bat') extra = `ε ${f2(el.p.emf)} V / r ${f2(el.p.r)} Ω`;
    else if (e.kind === 'ac') extra = `${f2(el.p.A)} V / ${f2(el.p.f)} Hz`;
    else if (e.kind === 'gen') extra = `εm ${f2(acOf(el).A)} V / ${f2(acOf(el).f)} Hz`;
    else if (e.kind === 'res') extra = `R ${f2(el.p.R)} Ω`;
    else if (e.kind === 'bulb') extra = el.p.mode === 'curve' ? `灯丝 ${f2(e.Rnow)} Ω` : `R ${f2(el.p.R)} Ω`;
    else if (e.kind === 'sw') extra = el.p.on ? '闭合' : '断开';
    else if (e.kind === 'cap') extra = `C ${f2(el.p.C)} μF / Xc ${f2(e.X)} Ω`;
    else if (e.kind === 'ind') extra = `L ${f2(el.p.L)} mH / Xl ${f2(e.X)} Ω`;
    else if (e.kind === 'xfmr') extra = `N₁ ${f2(el.p.n1)} : N₂ ${f2(el.p.n2)}`;
    else if (e.kind === 'diode') extra = Math.abs(e.r.I) > 1e-3 ? '导通' : '截止';
    else if (e.kind === 'galv') extra = `Ig ${f2(el.p.Ig)} mA / Rg ${f2(el.p.Rg)} Ω`;
    else if (e.kind === 'motor') extra = el.p.stall ? `堵转 / R ${f2(el.p.R)} Ω` : `R ${f2(el.p.R)} Ω / E ${f2(el.p.E)} V`;
    else if (e.kind === 'qnp') extra = `β ${f2(el.p.beta)} / ${e.r.qOn ? '导通' : '截止'}`;
    else if (e.kind === 'amp') extra = `A ×${f2(el.p.A)}`;
    list.push({ key: e.key, base, extra, I: e.r.Irms, U: e.r.Urms, P: e.r.P });
    if (e.kind === 'xfmr' && e.r2) {
      list.push({
        key: e.key + '\u0000s', base: '变压器(副)', extra: `N₂ ${f2(el.p.n2)} 匝`,
        I: e.r2.Irms, U: e.r2.Urms, P: e.r2.P,
      });
    }
    if (e.kind === 'amp' && e.r2) {
      list.push({
        key: e.key + '\u0000o', base: '放大器(出)', extra: `A ×${f2(el.p.A)}`,
        I: e.r2.Irms, U: e.r2.Urms, P: e.r2.P,
      });
    }
  }
  const cnt = {};
  for (const it of list) cnt[it.base] = (cnt[it.base] || 0) + 1;
  const seen = {};
  for (const it of list) {
    if (cnt[it.base] > 1) { seen[it.base] = (seen[it.base] || 0) + 1; it.name = it.base + seen[it.base]; }
    else it.name = it.base;
  }
  return list;
});

const totals = computed(() => {
  let srcP = 0;
  let heat = 0;
  let mech = 0;
  for (const e of items.value) {
    const el = cells[e.key];
    heat += e.r.P + (e.r2 ? e.r2.P : 0);
    if (e.kind === 'bat') srcP += Math.max(0, num(el.p.emf, 6) * -e.r.Idc);
    // 交流电源与发电机的峰值电压与峰值电流之间再乘 1/2 才是平均功率，符号与直流那一支同口径
    else if (e.kind === 'ac' || e.kind === 'gen') srcP += Math.max(0, -0.5 * acOf(el).A * e.r.IacRe);
    // 电动机：E·I 是转成机械能的那一部分，转不动（堵转）时为零
    else if (e.kind === 'motor' && !el.p.stall) mech += Math.max(0, num(el.p.E, 0) * e.r.Idc);
  }
  return { srcP, heat, mech };
});

const warn = computed(() => {
  const srcs = items.value.filter(e => e.kind === 'bat' || e.kind === 'ac' || e.kind === 'gen');
  if (!srcs.length) return '还没有电源：从左边取一颗电池、一台交流电源或一台发电机放到格线上。';
  // 短路判据按支路电流与短路电流比：导线直接跨接时电流逼近这个上限。
  // 直流的上限是 ε/r；交流的上限要换算到有效值，即峰值 A 乘 0.707 再除内阻
  const shorted = srcs.some(e => {
    const el = cells[e.key];
    const r = Math.max(0.05, num(el.p.r, 0.5));
    const lim = e.kind === 'bat' ? num(el.p.emf, 6) / r : acOf(el).A * SQ2 / r;
    return e.r.Irms > 0.85 * lim;
  });
  if (shorted) return '电源两端被导线直接连通，电流逼近短路电流，这是短路。';
  const live = items.value.some(e => e.r.Irms > 2e-3);
  if (!live) return '回路还没接通：导线要首尾相连，开关要闭合。';
  return '';
});

/* ── 放置与删除 ─────────────────────────────────────── */
/** 一条边是不是还在格线范围内 */
function validEdge(key) {
  if (!key) return false;
  const [t, rest] = key.split(':');
  const [i, j] = rest.split(',').map(Number);
  if (!Number.isFinite(i) || !Number.isFinite(j)) return false;
  if (t === 'h') return i >= 0 && i < COLS.value - 1 && j >= 0 && j < ROWS.value;
  if (t === 'v') return i >= 0 && i < COLS.value && j >= 0 && j < ROWS.value - 1;
  if (t === 'd') return i >= 0 && i < COLS.value - 1 && j >= 0 && j < ROWS.value - 1;
  if (t === 'u') return i >= 0 && i < COLS.value - 1 && j >= 1 && j < ROWS.value;
  return false;
}

/** 占了两条边的元件（变压器 / 放大器 / 三极管），第二条边归哪一台管；普通边返回空串 */
function ownerOf(key) {
  if (!key) return '';
  for (const k of Object.keys(cells)) {
    const el = cells[k];
    if (el.p && el.p.k2 === key) return k;
  }
  return '';
}

/** 变压器的另一半落在哪条边上：同向、前后相邻，且那条边既没元件也没被别的变压器占作副边 */
function partnerOf(key) {
  const [t, rest] = key.split(':');
  const [i, j] = rest.split(',').map(Number);
  const cands = t === 'h'
    ? ['h:' + i + ',' + (j - 1), 'h:' + i + ',' + (j + 1)]
    : ['v:' + (i - 1) + ',' + j, 'v:' + (i + 1) + ',' + j];
  for (const c of cands) {
    if (!validEdge(c)) continue;
    if (cells[c] || ownerOf(c)) continue;
    return c;
  }
  return '';
}

/** 三极管的第二条边：与这条边垂直、和它共用一个节点（那个节点就是发射极），
    且既没有元件也没被别的多端元件占着 */
function perpPartnerOf(key) {
  const [t, rest] = key.split(':');
  const [i, j] = rest.split(',').map(Number);
  const cands = t === 'h'
    ? ['v:' + (i + 1) + ',' + j, 'v:' + (i + 1) + ',' + (j - 1), 'v:' + i + ',' + j, 'v:' + i + ',' + (j - 1)]
    : ['h:' + i + ',' + (j + 1), 'h:' + (i - 1) + ',' + (j + 1), 'h:' + i + ',' + j, 'h:' + (i - 1) + ',' + j];
  for (const c of cands) {
    if (!validEdge(c)) continue;
    if (cells[c] || ownerOf(c)) continue;
    return c;
  }
  return '';
}

function placeEl(key, kind, quiet) {
  // 占两条边的元件要借用相邻的一条横线或竖线，斜边上放不了
  const isDiag = key[0] === 'd' || key[0] === 'u';
  if ((kind === 'xfmr' || kind === 'amp') && isDiag) {
    say(`${KIND_NAME[kind]}要占两条相邻的平行格线，请摆在横线或竖线上。`);
    return;
  }
  if (kind === 'qnp' && isDiag) {
    say('三极管要占两条相邻且共用一个节点的格线，请摆在横线或竖线上。');
    return;
  }
  if (kind === 'xfmr' || kind === 'amp') {
    // 变压器与放大器一次占两条相邻的平行格线：这条是原边 / 输入端，旁边那条是副边 / 输出端
    const k2 = partnerOf(key);
    if (!k2) { say(`${KIND_NAME[kind]}要占两条相邻的平行格线，先把旁边那条腾出来。`); return; }
    if (cells[key]) delete cells[key];
    cells[key] = { kind, p: { ...DEFAULTS[kind], k2 } };
    if (!quiet) selKey.value = key;
    keepRoom(key, k2);
    return;
  }
  if (kind === 'qnp') {
    // 三极管占两条互相垂直、共用一个节点的格线：共用那头是发射极
    const k2 = perpPartnerOf(key);
    if (!k2) { say('三极管要占两条相邻且共用一个节点的格线，把这个角腾出来再放。'); return; }
    if (cells[key]) delete cells[key];
    cells[key] = { kind, p: { ...DEFAULTS.qnp, k2 } };
    if (!quiet) selKey.value = key;
    keepRoom(key, k2);
    return;
  }
  cells[key] = { kind, p: { ...DEFAULTS[kind] } };
  if (!quiet) selKey.value = kind === 'wire' ? '' : key;
  keepRoom(key);
}
function removeEl(key) {
  if (!key || !cells[key]) return;
  delete cells[key];
  if (selKey.value === key) selKey.value = '';
}

/** 把一台元件搬到另一条边上：单边元件直接换键；占两条边的元件先摘下来，
    再按新位置重找搭档（变压器 / 放大器找平行的那条，三极管找共角点垂直的那条）。
    找不到落点就原样放回去，一个参数都不动。 */
function moveEl(key, target) {
  if (!key || !target || key === target || !cells[key]) return false;
  const el = cells[key];
  const multi = el.kind === 'xfmr' || el.kind === 'amp' || el.kind === 'qnp';
  if (multi && (target[0] === 'd' || target[0] === 'u')) {
    say(`${KIND_NAME[el.kind]}要占两条相邻的格线，请搬到横线或竖线上。`);
    return false;
  }
  // 先把它从原来的位置摘下来，它占着的那条副边 / 基极边随之空出来
  delete cells[key];
  const taken = k => (k ? !!cells[k] || !!ownerOf(k) : false);
  let k2 = '';
  if (multi) k2 = el.kind === 'qnp' ? perpPartnerOf(target) : partnerOf(target);
  if (taken(target) || (multi && !k2)) {
    cells[key] = el;
    if (taken(target)) say('那条格线上已经有元件了。');
    else say(`${KIND_NAME[el.kind]}旁边没有空着的格线，搬不过去。`);
    return false;
  }
  const p = { ...el.p };
  if (multi) p.k2 = k2;
  else delete p.k2;
  cells[target] = { kind: el.kind, p };
  if (selKey.value === key) selKey.value = target;
  keepRoom(target, k2);
  return true;
}

/** 拖动搬家的落点预览：指针底下的那条边，占两条边的元件连搭档那条一起画 */
const movePreview = computed(() => {
  const d = drag.value;
  if (!d || d.mode !== 'move' || !d.moved || !d.target) return null;
  const el = cells[d.key];
  const keys = [d.target];
  let ok = true;
  if (el && (el.kind === 'xfmr' || el.kind === 'amp' || el.kind === 'qnp')) {
    const k2 = el.kind === 'qnp' ? perpPartnerOf(d.target) : partnerOf(d.target);
    if (k2) keys.push(k2);
    else ok = false;
  }
  const segs = keys.map(k => {
    const [A, B] = endsOf(k);
    const a = posOf(A);
    const b = posOf(B);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });
  return { ok, segs };
});
function clearAll() {
  for (const k of Object.keys(cells)) delete cells[k];
  selKey.value = '';
  drag.value = null;
  // 清空了就把接出去的格网也收回画板原本的尺寸
  EXTRA.c = 0;
  EXTRA.r = 0;
  fitGrid();
}
function loadSample() {
  clearAll();
  const put = (k, kind, p) => { cells[k] = { kind, p: { ...DEFAULTS[kind], ...(p || {}) } }; };
  // 左边一列：电池与两段导线
  put('v:2,2', 'wire');
  put('v:2,3', 'bat', { emf: 6, r: 0.5 });
  put('v:2,4', 'wire');
  // 上边一行：导线—电阻—导线—电流表—导线
  put('h:2,2', 'wire');
  put('h:3,2', 'res', { R: 5 });
  put('h:4,2', 'wire');
  put('h:5,2', 'wire');
  put('h:6,2', 'wire');
  put('h:7,2', 'amm');
  put('h:8,2', 'wire');
  // 右边一列：灯泡
  put('v:9,2', 'wire');
  put('v:9,3', 'bulb', { mode: 'curve', Ur: 6, Pr: 3 });
  put('v:9,4', 'wire');
  // 下边一行：开关
  put('h:2,5', 'wire');
  put('h:3,5', 'wire');
  put('h:4,5', 'sw', { on: true });
  put('h:5,5', 'wire');
  put('h:6,5', 'wire');
  put('h:7,5', 'wire');
  put('h:8,5', 'wire');
  tool.value = 'sel';
}

/* ── 视野：把 viewBox 当相机，只改取景框，图形一个点都不动 ── */
const VIEW = reactive({ z: 1, cx: W.value / 2, cy: H.value / 2 });
const VB = computed(() => {
  const w = W.value / VIEW.z;
  const h = H.value / VIEW.z;
  return `${VIEW.cx - w / 2} ${VIEW.cy - h / 2} ${w} ${h}`;
});
function clampView() {
  VIEW.z = Math.min(3.2, Math.max(0.55, VIEW.z));
  const w = W.value / VIEW.z;
  const h = H.value / VIEW.z;
  // 取景框比画板大时画板整块居中；比画板小时，框的中心不许挪出画板
  if (w >= W.value) VIEW.cx = W.value / 2;
  else VIEW.cx = Math.min(W.value - w / 2, Math.max(w / 2, VIEW.cx));
  if (h >= H.value) VIEW.cy = H.value / 2;
  else VIEW.cy = Math.min(H.value - h / 2, Math.max(h / 2, VIEW.cy));
}
/** 以画板坐标 a 为锚点换倍率：屏幕上 a 那一点原地不动 */
function setZoom(z2, a) {
  const z1 = VIEW.z;
  const z = Math.min(3.2, Math.max(0.55, z2));
  if (Math.abs(z - z1) < 1e-6) return;
  const p = a || { x: VIEW.cx, y: VIEW.cy };
  const k = z / z1;
  VIEW.cx = p.x - (p.x - VIEW.cx) / k;
  VIEW.cy = p.y - (p.y - VIEW.cy) / k;
  VIEW.z = z;
  clampView();
}
function zoomBy(f) { setZoom(VIEW.z * f); }
function resetView() {
  VIEW.z = 1;
  VIEW.cx = W.value / 2;
  VIEW.cy = H.value / 2;
}
function onWheel(ev) {
  setZoom(VIEW.z * Math.exp(-ev.deltaY * 0.0016), toLocal(ev));
}

/* ── 指针 ───────────────────────────────────────────── */
/** 屏幕坐标 → 画板坐标：交给浏览器的 CTM 反算，缩放与上下黑边一并算进去 */
function toLocal(ev) {
  const svg = svgEl.value;
  if (!svg) return { x: 0, y: 0 };
  const ctm = svg.getScreenCTM ? svg.getScreenCTM() : null;
  if (ctm && svg.createSVGPoint) {
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const q = pt.matrixTransform(ctm.inverse());
    return { x: q.x, y: q.y };
  }
  // 兜底：按 preserveAspectRatio 的等比居中手算
  const r = svg.getBoundingClientRect();
  const [vx, vy, vw, vh] = VB.value.split(' ').map(Number);
  const s = Math.min(r.width / vw, r.height / vh) || 1;
  return {
    x: (ev.clientX - r.left - (r.width - vw * s) / 2) / s + vx,
    y: (ev.clientY - r.top - (r.height - vh * s) / 2) / s + vy,
  };
}

/** 开始拖动平移：按屏幕位移换算成画板位移，视图中心照位移反向走 */
function startPan(ev) {
  const svg = svgEl.value;
  const ctm = svg && svg.getScreenCTM ? svg.getScreenCTM() : null;
  const k = 1 / (ctm && ctm.a ? ctm.a : 1);
  drag.value = { mode: 'pan', sx: ev.clientX, sy: ev.clientY, cx0: VIEW.cx, cy0: VIEW.cy, k };
}

function nodeAt(p) {
  let best = null;
  let bd = 24;
  for (const n of NODES.value) {
    const d = Math.hypot(p.x - n.x, p.y - n.y);
    if (d < bd) { bd = d; best = n; }
  }
  return best;
}

function segDist(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L2 = dx * dx + dy * dy || 1;
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / L2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

function edgeAt(p) {
  let best = null;
  let bd = 28;
  for (let j = 0; j < ROWS.value; j++) {
    for (let i = 0; i < COLS.value - 1; i++) {
      const a = posOf([i, j]);
      const b = posOf([i + 1, j]);
      const d = segDist(p, a, b);
      if (d < bd) { bd = d; best = 'h:' + i + ',' + j; }
    }
  }
  for (let j = 0; j < ROWS.value - 1; j++) {
    for (let i = 0; i < COLS.value; i++) {
      const a = posOf([i, j]);
      const b = posOf([i, j + 1]);
      const d = segDist(p, a, b);
      if (d < bd) { bd = d; best = 'v:' + i + ',' + j; }
    }
  }
  // 两条对角线后查：落在节点附近时横竖线先占住，对角线只在真正贴着它时才认
  for (let j = 0; j < ROWS.value - 1; j++) {
    for (let i = 0; i < COLS.value - 1; i++) {
      const a = posOf([i, j]);
      const b = posOf([i + 1, j + 1]);
      const d = segDist(p, a, b);
      if (d < bd) { bd = d; best = 'd:' + i + ',' + j; }
    }
  }
  for (let j = 1; j < ROWS.value; j++) {
    for (let i = 0; i < COLS.value - 1; i++) {
      const a = posOf([i, j]);
      const b = posOf([i + 1, j - 1]);
      const d = segDist(p, a, b);
      if (d < bd) { bd = d; best = 'u:' + i + ',' + j; }
    }
  }
  return best;
}

function elAt(p) {
  let best = null;
  let bd = 22;
  for (const key of Object.keys(cells)) {
    const el = cells[key];
    const [A, B] = endsOf(key);
    let d = segDist(p, posOf(A), posOf(B));
    if (el.p && el.p.k2) {
      const [C, D] = endsOf(el.p.k2);
      d = Math.min(d, segDist(p, posOf(C), posOf(D)));
    }
    if (d < bd) { bd = d; best = key; }
  }
  return best;
}

function onDown(ev) {
  const p = toLocal(ev);
  hoverEdge.value = '';
  if (ev.target && ev.target.setPointerCapture) {
    try { ev.target.setPointerCapture(ev.pointerId); } catch (e) { /* 忽略 */ }
  }
  const hit = elAt(p);

  if (tool.value === 'sel') {
    if (hit) {
      selKey.value = hit;
      // 按住元件就能把它搬到别的格线上；只是点一下、没有位移，抬笔时再按原来的意思处理
      drag.value = { mode: 'move', key: hit, sx: ev.clientX, sy: ev.clientY, x: p.x, y: p.y, moved: false, target: '' };
    } else {
      selKey.value = '';
      // 点空白处：不算取消，按住就能拖着画板走
      startPan(ev);
    }
    return;
  }
  if (tool.value === 'erase') {
    if (hit) removeEl(hit);
    else startPan(ev);
    return;
  }
  if (tool.value === 'wire') {
    const nd = nodeAt(p);
    if (nd) { drag.value = { from: { x: nd.x, y: nd.y }, node: { i: nd.i, j: nd.j }, x: p.x, y: p.y }; return; }
    const ed = edgeAt(p);
    if (ed && !cells[ed] && !ownerOf(ed)) placeEl(ed, 'wire', true);
    else startPan(ev);
    return;
  }
  const ed = edgeAt(p);
  if (!ed) { startPan(ev); return; }
  // 点在别的变压器的副边那条上：先把那台搬走，再在空出来的这条边放新元件
  const own = ownerOf(ed);
  if (own) removeEl(own);
  placeEl(ed, tool.value);
}

function onMove(ev) {
  const d = drag.value;
  if (!d) {
    // 还没按住：把指针底下的那条边亮出来，横竖与两条对角线一视同仁
    if (tool.value === 'sel' || tool.value === 'erase') { hoverEdge.value = ''; return; }
    const ed = edgeAt(toLocal(ev));
    hoverEdge.value = ed && !cells[ed] && !ownerOf(ed) ? ed : '';
    return;
  }
  if (d.mode === 'pan') {
    // 屏幕位移 ÷ 当前比例尺 = 画板位移；视图中心朝反方向走，画面就跟着手
    VIEW.cx = d.cx0 - (ev.clientX - d.sx) * d.k;
    VIEW.cy = d.cy0 - (ev.clientY - d.sy) * d.k;
    clampView();
    return;
  }
  if (d.mode === 'move') {
    // 位移超过几个像素才算搬家，否则仍然只是一次点击
    if (!d.moved && Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy) < 5) return;
    d.moved = true;
    const p = toLocal(ev);
    d.x = p.x;
    d.y = p.y;
    const ed = edgeAt(p);
    const own = ed ? ownerOf(ed) : '';
    d.target = ed && (ed === d.key || (!cells[ed] && (!own || own === d.key))) ? ed : '';
    return;
  }
  const p = toLocal(ev);
  d.x = p.x;
  d.y = p.y;
}

function onUp(ev) {
  const d = drag.value;
  drag.value = null;
  if (!d || d.mode === 'pan') return;
  if (d.mode === 'move') {
    if (!d.moved) {
      // 没拖动：仍旧当一次点击，开关照样切通断
      const el = cells[d.key];
      if (el && el.kind === 'sw') el.p.on = !el.p.on;
      return;
    }
    if (d.target && d.target !== d.key) moveEl(d.key, d.target);
    return;
  }
  if (ev && ev.clientX !== undefined) {
    const p = toLocal(ev);
    const nd = nodeAt(p);
    if (nd) { routeWire(d.node, { i: nd.i, j: nd.j }); return; }
  }
  routeWire(d.node, d.node);
}

function onCancel() {
  drag.value = null;
  hoverEdge.value = '';
}

function routeWire(a, b) {
  if (a.i === b.i && a.j === b.j) return;
  // 斜着拖到另一个节点：一步一条对角导线，不再折成横竖两段
  if (a.i !== b.i && Math.abs(b.i - a.i) === Math.abs(b.j - a.j)) {
    const sgnI = b.i > a.i ? 1 : -1;
    const sgnJ = b.j > a.j ? 1 : -1;
    // d 族从左上连到右下，起点取两端的左上一点；u 族从左下连到右上，起点取左端、行号大的一点
    const same = sgnI === sgnJ;
    let i = a.i;
    let j = a.j;
    while (i !== b.i) {
      const ni = i + sgnI;
      const nj = j + sgnJ;
      const key = same
        ? 'd:' + Math.min(i, ni) + ',' + Math.min(j, nj)
        : 'u:' + Math.min(i, ni) + ',' + Math.max(j, nj);
      if (!cells[key] && !ownerOf(key)) placeEl(key, 'wire', true);
      i = ni;
      j = nj;
    }
    return;
  }
  let i = a.i;
  let j = a.j;
  while (i !== b.i) {
    const ni = i + (b.i > i ? 1 : -1);
    const key = 'h:' + Math.min(i, ni) + ',' + j;
    if (!cells[key] && !ownerOf(key)) placeEl(key, 'wire', true);
    i = ni;
  }
  while (j !== b.j) {
    const nj = j + (b.j > j ? 1 : -1);
    const key = 'v:' + i + ',' + Math.min(j, nj);
    if (!cells[key] && !ownerOf(key)) placeEl(key, 'wire', true);
    j = nj;
  }
}

function onKey(ev) {
  if (ev.key === 'Escape' && helpOpen.value) { helpOpen.value = false; return; }
  // 说明弹窗盖在整页上，底下的元件不该再吃 Delete
  if (helpOpen.value) return;
  const t = ev.target;
  const tag = t && t.tagName ? String(t.tagName).toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return;
  if ((ev.key === 'Delete' || ev.key === 'Backspace') && selKey.value) {
    ev.preventDefault();
    removeEl(selKey.value);
  }
}

function onMountedLayout() {
  // 先按视口定高度，格网再按画板此刻的尺寸重排：格线与页脚一起落在一屏里
  fitHeight();
  fitGrid();
}
onMounted(() => {
  window.addEventListener('keydown', onKey);
  // 整页横向铺开，浏览器宁可有横向滚动条也别让页面被撑出白边
  document.body.classList.add('clab-full');
  if (!Object.keys(cells).length) loadSample();
  // 画板高度按视口现算：等字体与左栏排完再量一次，窗口一变就跟着重算
  requestAnimationFrame(() => { onMountedLayout(); requestAnimationFrame(onMountedLayout); });
  window.addEventListener('resize', onMountedLayout);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', onMountedLayout);
  document.body.classList.remove('clab-full');
  clearTimeout(msgT);
});
</script>

<style scoped>
/* 整页横向铺开：破开 main 的居中宽度与内边距，中间那块画板才吃得满；
   上下左右各留一段，标题不贴顶、也不顶到视口左缘 */
.clab { width: 100vw; margin-inline: calc(50% - 50vw); padding: 16px 28px 12px; box-sizing: border-box; }
:global(body.clab-full) { overflow-x: clip; }
.cl-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin: 0 0 10px; flex-wrap: wrap; }
.cl-lead h1 { font-size: 24px; margin: 0; letter-spacing: .5px; }

.cl-tools { display: flex; gap: 8px; flex-wrap: wrap; }
.cl-b { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 10px;
  padding: 7px 14px; font-size: 13px; cursor: pointer; text-decoration: none; transition: border-color .18s, color .18s; }
.cl-b:hover { border-color: var(--blue); color: var(--blue); }
.cl-b.wide { display: block; width: 100%; margin-top: 8px; }
.cl-b.hl { border-color: color-mix(in srgb, var(--blue) 46%, var(--line)); color: var(--blue); }

/* 中间那块画板吃满剩下的宽度与高度：左边元件栏 216，右边读数固定 300。
   真实高度由脚本按视口现算写进内联 height（题头 + 画板 + 页脚正好一屏），
   这里留一档兜底，首帧没量到之前也不至于塌成一条 */
.cl-body { display: grid; grid-template-columns: 216px minmax(0, 1fr) 300px; gap: 14px;
  align-items: stretch; min-height: 300px; }
@media (max-width: 1180px) {
  .cl-body { grid-template-columns: 186px minmax(0, 1fr); height: auto !important; }
}
@media (max-width: 760px) {
  .cl-body { grid-template-columns: 1fr; min-height: 0; }
}

.cl-pal { position: sticky; top: 12px; align-self: start; background: var(--card); border: 1px solid var(--line);
  border-radius: 16px; padding: 10px; display: flex; flex-direction: column; gap: 5px;
  max-height: 100%; min-height: 0; overflow-y: auto; }
.cl-pal-t { font-size: 12px; color: var(--faint); padding: 7px 4px 3px; letter-spacing: .3px; }
.cl-pal-t:first-child { padding-top: 2px; }
.cl-tool { display: flex; align-items: center; gap: 9px; border: 1px solid var(--line); background: var(--bg2);
  color: var(--ink); border-radius: 10px; padding: 7px 10px; font-size: 13px; cursor: pointer; transition: all .16s; text-align: left; }
.cl-tool:hover { border-color: var(--mut); }
.cl-tool.on { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, var(--bg2)); }
/* 元件图标：24×24 的线稿，取 currentColor，随主题与选中态换色 */
.cl-pic { width: 18px; height: 18px; flex: 0 0 auto; fill: none; stroke: currentColor;
  stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.cl-pic path.f { fill: currentColor; stroke: none; }
.cl-tn { white-space: nowrap; }
.cl-tip { font-size: 11.5px; color: var(--faint); line-height: 1.6; margin: 6px 2px 2px; }
/* 左栏元件板与右栏读数卡的滚动条：8px 细条、透明轨道、圆角半透明拇指，
   平时压得很淡、悬停才深一档，与讲义页左栏同一套调子 */
.cl-pal, .cl-side { scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ink) 22%, transparent) transparent; }
.cl-pal::-webkit-scrollbar, .cl-side::-webkit-scrollbar { width: 8px; height: 8px; }
.cl-pal::-webkit-scrollbar-track, .cl-side::-webkit-scrollbar-track { background: transparent; }
.cl-pal::-webkit-scrollbar-thumb, .cl-side::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ink) 20%, transparent);
  border-radius: 99px; border: 2px solid transparent; background-clip: content-box; }
.cl-pal::-webkit-scrollbar-thumb:hover, .cl-side::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ink) 38%, transparent); background-clip: content-box;
  border-radius: 99px; border: 2px solid transparent; }
/* 单列时左栏转横排、贴回文档流：这几条要排在基样式之后，否则同样权重下被基样式盖回竖排 */
@media (max-width: 760px) {
  .cl-pal { flex-direction: row; flex-wrap: wrap; max-height: none; position: static; align-self: auto; }
  .cl-tip { flex: 1 1 100%; }
}

.cl-stage { position: relative; display: flex; background: var(--card); border: 1px solid var(--line);
  border-radius: 18px; padding: 8px; min-width: 0; min-height: 0; }
/* 单列排版时高度交还给内容，画板自己要有个下限，免得塌成一条 */
@media (max-width: 760px) { .cl-stage { min-height: 62vw; } }
.cl-svg { display: block; flex: 1 1 0; min-width: 0; height: 100%; min-height: 300px; touch-action: none;
  border-radius: 12px; background: var(--bg2); user-select: none; }
/* 选择工具下，指针落到元件上时换手形（光标主体由脚本按工具写在内联 style 上） */
.cl-svg.cur-sel .cl-el { cursor: grab; }
.cl-svg.cur-sel.moving .cl-el { cursor: grabbing; }
.cl-svg.cur-erase .cl-el { cursor: crosshair; }
/* 缩放钮：－ 倍率 ＋，倍率那枚点一下复原（与画板页的操作条同一套用法） */
.cl-zoom { position: absolute; right: 20px; bottom: 18px; z-index: 3; display: flex; align-items: center; gap: 1px;
  padding: 2px 3px; border: 1px solid var(--line); border-radius: 99px;
  background: color-mix(in srgb, var(--card) 94%, transparent); box-shadow: 0 4px 14px rgba(0, 0, 0, .14); }
.cl-zoom button { border: 0; background: transparent; color: var(--mut); font-size: 13px; line-height: 1;
  width: 26px; height: 24px; border-radius: 99px; cursor: pointer; transition: color .16s, background .16s; }
.cl-zoom button:hover { color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent); }
.cl-zoom .cl-zv { width: 54px; font-size: 12px; color: var(--ink); font-variant-numeric: tabular-nums; }

.cl-lat line { stroke: var(--line); stroke-width: 1; opacity: .55; }
/* 对角格的虚线提示：只在拿起放置类工具时出现，压得够淡，不抢主格线 */
.cl-lat.diag line { opacity: .3; stroke-dasharray: 3 7; }
.cl-node { fill: var(--faint); opacity: .55; }
.cl-node.on { fill: var(--mut); opacity: .9; }

/* 电流小点：直流整组匀速平移一格（起点取在节点上，负方向的电流也不出线段）；
   交流在原地来回摆，摆幅就是峰值电流 */
.cl-flow { animation-name: clflow; animation-timing-function: linear; animation-iteration-count: infinite; }
.cl-flow.ac { animation-name: clac; animation-timing-function: ease-in-out; }
@keyframes clflow {
  from { transform: translate(var(--ox, 0px), var(--oy, 0px)); }
  to { transform: translate(calc(var(--ox, 0px) + var(--fx, 0px)), calc(var(--oy, 0px) + var(--fy, 0px))); }
}
@keyframes clac {
  0%, 50%, 100% { transform: translate(var(--ox, 0px), var(--oy, 0px)); }
  25% { transform: translate(calc(var(--ox, 0px) + var(--fx, 0px)), calc(var(--oy, 0px) + var(--fy, 0px))); }
  75% { transform: translate(calc(var(--ox, 0px) - var(--fx, 0px)), calc(var(--oy, 0px) - var(--fy, 0px))); }
}
.clab.paused .cl-flow { animation-play-state: paused; }
.cl-dotf { fill: var(--orange); opacity: .92; }

.cl-wire { stroke: var(--mut); stroke-width: 2.6; stroke-linecap: round; }
.cl-lead { stroke: var(--mut); stroke-width: 2.2; stroke-linecap: round; }
.cl-body2 { fill: var(--card); stroke: var(--ink); stroke-width: 2; }
.cl-fil { stroke: var(--mut); stroke-width: 1.4; fill: none; }
.cl-glow { fill: var(--orange); }
.cl-glow-core { fill: var(--orange); }
.cl-plate { stroke: var(--ink); stroke-linecap: round; }
.cl-plate.long { stroke-width: 3.4; }
.cl-plate.short { stroke-width: 2.6; }
.cl-plate.cap { stroke-width: 3; }
.cl-sine { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; }
.cl-coil { fill: none; stroke: var(--ink); stroke-width: 2; stroke-linecap: round; }
.cl-core { stroke: var(--mut); stroke-width: 2.2; stroke-linecap: round; }
.cl-dio { fill: var(--ink); stroke: var(--ink); stroke-width: 1.2; }
.cl-mtr { fill: var(--ink); font-size: 12px; text-anchor: middle; dominant-baseline: central; }
.cl-sign { fill: var(--mut); font-size: 12px; }
.cl-contact { fill: var(--ink); }
.cl-lever { stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; }
.cl-ring { fill: none; stroke: var(--blue); stroke-width: 1.4; stroke-dasharray: 5 4; opacity: .85; }
/* 灵敏电流计：刻度弧与指针；电动机：转动方向那道弧 */
.cl-scale { fill: none; stroke: var(--mut); stroke-width: 1.3; stroke-linecap: round; }
.cl-needle { stroke: var(--pink); stroke-width: 1.6; stroke-linecap: round; }
.cl-spin { fill: none; stroke: var(--blue); stroke-width: 1.5; stroke-linecap: round; }
.cl-el.sel .cl-body2 { stroke: var(--blue); }
.cl-el.sel .cl-wire { stroke: var(--blue); }

.cl-lb { fill: var(--mut); font-size: 12px; font-variant-numeric: tabular-nums; pointer-events: none; }
.cl-lb.cur { fill: var(--green); }
.cl-warn { position: absolute; top: 16px; left: 50%; transform: translateX(-50%);
  background: color-mix(in srgb, var(--card) 94%, transparent); border: 1px solid var(--orange);
  color: var(--orange); font-size: 12.5px; padding: 6px 14px; border-radius: 99px; box-shadow: 0 4px 14px rgba(0,0,0,.18); }
.cl-prev line { stroke: var(--blue); stroke-width: 2; stroke-dasharray: 6 5; }
/* 指针底下的落点提示：比拉线更淡、更短，一按下去就变成元件 */
.cl-prev.hover line { stroke-width: 3; stroke-dasharray: 3 6; opacity: .55; }
/* 搬元件的落点：略粗、常显，搬不过去时转成告警色 */
.cl-prev.move line { stroke-width: 4; stroke-dasharray: 2 5; opacity: .8; }
.cl-prev.move.bad line { stroke: var(--orange); }

.cl-side { display: flex; flex-direction: column; gap: 12px; min-height: 0; overflow-y: auto; padding-right: 2px; }
/* 两栏以下：右栏挪到画板底下，按卡片并排铺开；高度交还给内容，页面照常滚动 */
@media (max-width: 1180px) {
  .cl-side { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    align-items: start; overflow: visible; padding-right: 0; }
}
.cl-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 13px 14px; }
.cl-card h2 { font-size: 12.5px; font-weight: 600; color: var(--faint); margin: 0 0 9px; letter-spacing: .4px; }
.cl-sel-t { font-size: 15px; margin-bottom: 8px; }
.cl-row { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--mut); margin: 6px 0 4px; }
.cl-row b { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
/* 只读的派生量：发电机的峰值电动势与频率，与可调的几根滑块隔开 */
.cl-row.hl { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--line); }
.cl-row.hl b { color: var(--blue); }
.cl-rg { width: 100%; accent-color: var(--blue); margin: 0 0 6px; }
/* 灯泡的伏安特性小图：两条轴、一条曲线、额定点（空心）与工作点（实心） */
.cl-bc { display: block; width: 100%; height: auto; margin: 10px 0 2px; }
.cl-ba { stroke: var(--line); stroke-width: 1.2; }
.cl-bcurve { fill: none; stroke: var(--orange); stroke-width: 2; stroke-linecap: round; }
.cl-bdash { stroke: var(--line); stroke-width: 1; stroke-dasharray: 3 3; }
.cl-brated { fill: var(--card); stroke: var(--orange); stroke-width: 1.8; }
.cl-bop { fill: var(--blue); }
.cl-blab { fill: var(--mut); font-size: 10px; font-variant-numeric: tabular-nums; }
.cl-seg { display: flex; gap: 6px; margin: 4px 0 8px; }
.cl-seg button { flex: 1; border: 1px solid var(--line); background: var(--bg2); color: var(--mut);
  border-radius: 9px; padding: 5px 6px; font-size: 12px; cursor: pointer; transition: border-color .16s, color .16s; }
.cl-seg button:hover { border-color: var(--mut); }
.cl-seg button.on { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, var(--bg2)); }
.cl-note { font-size: 12px; color: var(--faint); line-height: 1.7; margin: 9px 0 0; }
.cl-del { margin-top: 10px; width: 100%; border: 1px solid var(--line); background: transparent; color: var(--pink);
  border-radius: 9px; padding: 6px; font-size: 12.5px; cursor: pointer; }
.cl-del:hover { border-color: var(--pink); }
.cl-tb { width: 100%; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }
.cl-tb th { color: var(--faint); font-weight: 500; text-align: right; padding: 3px 0 5px; border-bottom: 1px solid var(--line); }
.cl-tb td { text-align: right; padding: 4px 0; border-bottom: 1px solid color-mix(in srgb, var(--line) 55%, transparent); }
.cl-tb th:first-child, .cl-tb td:first-child { text-align: left; }
.cl-name i { display: block; font-style: normal; font-size: 11px; color: var(--faint); }
.cl-tot { font-size: 12px; color: var(--mut); line-height: 1.7; margin: 10px 0 0; }

/* 使用说明弹窗：挂 body，fixed 铺满，点背板、点 ✕ 或按 Esc 关闭 */
.cl-modal { position: fixed; inset: 0; z-index: 260; display: flex; align-items: center; justify-content: center;
  padding: 24px 18px; background: rgba(0, 0, 0, .46); }
.cl-doc { width: min(780px, 100%); max-height: min(86vh, 900px); display: flex; flex-direction: column;
  background: var(--card); border: 1px solid var(--line); border-radius: 18px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, .34); overflow: hidden; }
.cl-doc-hd { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 15px 18px; border-bottom: 1px solid var(--line); }
.cl-doc-hd h2 { font-size: 15px; margin: 0; letter-spacing: .3px; }
.cl-x { border: 1px solid var(--line); background: var(--bg2); color: var(--mut); width: 28px; height: 28px;
  border-radius: 9px; font-size: 13px; line-height: 1; cursor: pointer; }
.cl-x:hover { border-color: var(--pink); color: var(--pink); }
.cl-doc-bd { padding: 16px 20px 22px; overflow-y: auto; }
.cl-doc-lead { margin: 0; font-size: 13.5px; line-height: 1.9; color: var(--ink); }
.cl-doc-bd h3 { font-size: 13px; color: var(--faint); font-weight: 600; letter-spacing: .4px;
  margin: 20px 0 8px; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
.cl-doc-bd h4 { font-size: 12.5px; color: var(--blue); font-weight: 600; margin: 14px 0 4px; }
.cl-doc-ls { margin: 0; padding-left: 20px; font-size: 13px; color: var(--mut); line-height: 1.9; }
.cl-doc-ls li { margin-bottom: 5px; }
.cl-doc-el { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; }
.cl-doc-el .cl-pic { width: 20px; height: 20px; margin-top: 2px; color: var(--mut); }
.cl-doc-tx { min-width: 0; font-size: 12.8px; line-height: 1.75; }
.cl-doc-tx b { display: block; color: var(--ink); font-weight: 600; font-size: 13px; }
.cl-doc-tx span { color: var(--mut); }

@media (prefers-reduced-motion: reduce) { .cl-flow, .cl-flow.ac { animation: none; } }
</style>
