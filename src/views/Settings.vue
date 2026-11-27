<template>
  <div class="settings">
    <div class="chapter-head">
      <h1>设置</h1>
      <p class="sub">这些都存在本机浏览器里，换设备不同步。改动即时生效，关掉页面也会记住。</p>
    </div>

    <h3 class="sec">界面布局</h3>
    <div class="set-card">
      <div class="set-row">
        <div class="set-label">
          <strong>章节目录方向</strong>
          <span>顶栏「章节目录」的抽屉从哪一侧滑出，整个目录连遮罩一起换边。</span>
        </div>
        <div class="seg" role="group" aria-label="章节目录方向">
          <button v-for="o in SIDES" :key="o.v" type="button" :class="{ on: PREFS.drawerSide === o.v }"
            @click="setPref('drawerSide', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画板小窗方向</strong>
          <span>讲解页右下角圆形按钮开出的半屏画板贴哪一边，正文自动让出那一半。</span>
        </div>
        <div class="seg" role="group" aria-label="画板小窗方向">
          <button v-for="o in SIDES" :key="o.v" type="button" :class="{ on: PREFS.dockSide === o.v }"
            @click="setPref('dockSide', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>助手小窗方向</strong>
          <span>聊天窗从哪一侧滑出。左侧圆形按钮与顶栏「助手」都是它的入口。</span>
        </div>
        <div class="seg" role="group" aria-label="助手小窗方向">
          <button v-for="o in SIDES" :key="o.v" type="button" :class="{ on: PREFS.chatSide === o.v }"
            @click="setPref('chatSide', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>助手默认尺寸</strong>
          <span>打开时占半屏还是铺满整屏；窗内右上角随时可以切换。</span>
        </div>
        <div class="seg" role="group" aria-label="助手默认尺寸">
          <button v-for="o in SIZES" :key="o.v" type="button" :class="{ on: PREFS.chatSize === o.v }"
            @click="setPref('chatSize', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>显示思考过程</strong>
          <span>推理模型返回的思考链默认折叠展示；关掉后只留最终回答。聊天窗底部也有一个开关。</span>
        </div>
        <div class="seg" role="group" aria-label="显示思考过程">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.chatThink === o.v }"
            @click="setPref('chatThink', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>整屏对话列表</strong>
          <span>整屏时左侧是否常驻历史对话；关掉后仍可从聊天窗顶部「记录」下拉里翻。</span>
        </div>
        <div class="seg" role="group" aria-label="整屏对话列表">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.chatHist === o.v }"
            @click="setPref('chatHist', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画布半屏方向</strong>
          <span>画布（右下铅笔钮）开成半屏时贴哪一边，正文自动让出那一半；顶栏「✏ 画布」打开的始终是整屏。</span>
        </div>
        <div class="seg" role="group" aria-label="画布半屏方向">
          <button v-for="o in SIDES" :key="o.v" type="button" :class="{ on: PREFS.canvasSide === o.v }"
            @click="setPref('canvasSide', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>章节导航默认折叠</strong>
          <span>讲解页左栏进页时的状态：只展开当前子专题、全部展开、全部收起。栏顶两枚按钮随时可改。</span>
        </div>
        <div class="seg" role="group" aria-label="章节导航默认折叠">
          <button v-for="o in NAVOPTS" :key="o.v" type="button" :class="{ on: PREFS.navOpen === o.v }"
            @click="setPref('navOpen', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>搜索框样式</strong>
          <span>顶栏右上角的全站搜索（Ctrl K）怎么出现：顶栏展开时搜索框直接长在导航条里，结果从下面浮出；居中弹窗是原来那种盖住页面的大框。改完马生效。</span>
        </div>
        <div class="seg" role="group" aria-label="搜索框样式">
          <button v-for="o in SEARCH" :key="o.v" type="button" :class="{ on: PREFS.searchBox === o.v }"
            @click="setPref('searchBox', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>页面切换动画</strong>
          <span>{{ PREFS.pageAnim === 'particles' ? '「轨道粒子」会在页面加载稍慢时出现。已就绪的页面直接打开。' : '选择正文切换时的入场方式。' }}</span>
        </div>
        <div class="seg" role="group" aria-label="页面切换动画">
          <button v-for="o in ANIMS" :key="o.v" type="button" :class="{ on: PREFS.pageAnim === o.v }"
            @click="pickAnim(o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div v-if="PREFS.pageAnim === 'particles'" class="particle-preview" aria-label="加载动画预览">
        <ParticleField />
        <span>加载动画预览</span>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>主题切换动画</strong>
          <span>顶栏 🎨 换主题时的过渡方式：圆形从点击处扩散、整页淡入，或自左向右展开。页面与画板在同一次换色里一起过渡；浏览器不支持 View Transitions 或系统开了减少动态效果时直接换色。</span>
        </div>
        <div class="seg" role="group" aria-label="主题切换动画">
          <button v-for="o in THEME_ANIMS" :key="o.v" type="button" :class="{ on: PREFS.themeAnim === o.v }"
            @click="setPref('themeAnim', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>卡片悬停亮线</strong>
          <span>首页卡片鼠标移上去，沿圆角边框跑的那段亮线用什么颜色；其余页面卡片上的淡色渐变填充也取同一个色。跟随主题就按各主题的强调色走；自定义用右边的取色器，挑亮一点的颜色更显眼。</span>
        </div>
        <div class="seg" role="group" aria-label="卡片悬停亮线颜色">
          <button type="button" :class="{ on: PREFS.cardInk === 'theme' }" @click="setPref('cardInk', 'theme')">跟随主题</button>
          <button type="button" :class="{ on: PREFS.cardInk !== 'theme' }" @click="pickInk">自定义</button>
          <input class="ink-pick" type="color" :value="inkHex" aria-label="自定义亮线颜色" @input="onInk" />
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>页面缓存</strong>
          <span>左上角圆形按钮里记多少个最近打开的页面，点一条就能跳回去。最多 20 个。</span>
        </div>
        <div class="seg" role="group" aria-label="页面缓存条数">
          <button v-for="o in CAPS" :key="o.v" type="button" :class="{ on: PREFS.visitCap === o.v }"
            @click="setPref('visitCap', o.v)">{{ o.t }}</button>
        </div>
      </div>
    </div>

    <h3 class="sec">背景动画</h3>
    <div class="set-card">
      <div class="set-row">
        <div class="set-label">
          <strong>背景动画</strong>
          <span>页面空白处缓慢移动的图形，画在正文之下，不接收点击，也不影响阅读。</span>
        </div>
        <div class="seg" role="group" aria-label="背景动画开关">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.bgMotionOn === o.v }"
            @click="setPref('bgMotionOn', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row scene-row">
        <div class="set-label">
          <strong>背景类型</strong>
          <span>{{ sceneBlurb }}</span>
        </div>
        <div class="seg scene-options" role="group" aria-label="背景类型">
          <button v-for="o in SCENE_LIST" :key="o.id" type="button" :class="{ on: PREFS.bgScene === o.id }"
            @click="pickScene(o.id)">{{ o.name }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>背景线条颜色</strong>
          <span>混沌场景（洛伦兹、罗斯勒、艾泽瓦、托马斯、克利福德、NS）那几档的线条色相。默认是一条冷蓝色带、随时间缓慢漂移；自定义换成所挑颜色的色相，深浅分层不变。呼吸光影与旋转多面体不吃这条。</span>
        </div>
        <div class="seg" role="group" aria-label="背景线条颜色">
          <button type="button" :class="{ on: PREFS.bgInk === 'auto' }" @click="setPref('bgInk', 'auto')">默认冷蓝</button>
          <button type="button" :class="{ on: PREFS.bgInk !== 'auto' }" @click="pickBgInk">自定义</button>
          <input class="ink-pick" type="color" :value="bgInkHex" aria-label="自定义背景线条颜色" @input="onBgInk" />
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>背景线条浓度</strong>
          <span>适用于轨道粒子和混沌场景。100% 是标准浓度，调整即刻生效，画面会接续当前相位。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.3" max="2.5" step="0.1" :value="PREFS.bgAlpha"
            aria-label="背景线条浓度" @input="onBgAlpha" />
          <span class="ink-val">{{ Math.round(PREFS.bgAlpha * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>旋转多面体</strong>
          <span>一枚缓慢自转的线框二十面体，内嵌一颗反向转的正八面体，垫在正文之下。选左、右两侧留白时会按页面实际空出来的宽度自动定尺寸，整颗都露在留白里；留白不足 200px 的窄窗口自动收起。</span>
        </div>
        <div class="seg" role="group" aria-label="旋转多面体开关">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.bgSolidOn === o.v }"
            @click="setPref('bgSolidOn', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>多面体位置</strong>
          <span>右下角是固定大小的一角装饰；左、右两侧贴着页面留白摆放。</span>
        </div>
        <div class="seg" role="group" aria-label="多面体位置">
          <button v-for="o in SOLID_POS" :key="o.v" type="button" :class="{ on: PREFS.bgSolidPos === o.v }"
            @click="setPref('bgSolidPos', o.v)">{{ o.t }}</button>
        </div>
      </div>
    </div>

    <h3 class="sec">画板</h3>
    <div class="set-card">
      <div class="set-row">
        <div class="set-label">
          <strong>操作条位置</strong>
          <span>画板操作条放在板外还是板内；半屏、全屏时自动收回板内。</span>
        </div>
        <div class="seg" role="group" aria-label="画板操作条位置">
          <button v-for="o in DL_POS" :key="o.v" type="button" :class="{ on: PREFS.dlPos === o.v }"
            @click="setPref('dlPos', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>物理画板纸面</strong>
          <span>讲义演示与实验页的画板底色，默认跟随主题。操作条上的「▦ 纸面」是同一项。</span>
        </div>
        <div class="seg wide" role="group" aria-label="物理画板纸面">
          <button v-for="o in PAPERS" :key="o.v" type="button" :class="{ on: PREFS.physPaper === o.v }"
            @click="setPref('physPaper', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板纸面</strong>
          <span>各章 SVG 画板的底色，默认跟随主题；选定后所有画板统一换过去。</span>
        </div>
        <div class="seg wide" role="group" aria-label="数学画板纸面">
          <button v-for="o in PAPERS" :key="o.v" type="button" :class="{ on: PREFS.boardPaper === o.v }"
            @click="setPref('boardPaper', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画板字号</strong>
          <span>画板内文字（读数、刻度、公式）的字号倍率。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.8" max="1.6" step="0.05" :value="PREFS.physFont"
            aria-label="画板字号" @input="onPhysFont" />
          <span class="ink-val">{{ Math.round(PREFS.physFont * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画板线条粗细</strong>
          <span>曲线、箭头与物体轮廓的粗细倍率，拖动即刻生效。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.6" max="2.5" step="0.05" :value="PREFS.physLineW"
            aria-label="画板线条粗细" @input="onPhysLine" />
          <span class="ink-val">{{ Math.round(PREFS.physLineW * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>坐标轴线宽</strong>
          <span>坐标轴的粗细，独立于线条粗细。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.6" max="3" step="0.05" :value="PREFS.physAxisW"
            aria-label="坐标轴线宽" @input="onPhysAxis" />
          <span class="ink-val">{{ Math.round(PREFS.physAxisW * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画板背景网格</strong>
          <span>板底纸面方格：自动时遇到坐标网格就收起，也可固定显示或隐藏。</span>
        </div>
        <div class="seg" role="group" aria-label="画板背景网格">
          <button v-for="o in GRID_MODES" :key="o.v" type="button" :class="{ on: PREFS.physGrid === o.v }"
            @click="setPref('physGrid', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板字号</strong>
          <span>数学画板内文字的字号倍率。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.8" max="1.6" step="0.05" :value="PREFS.boardFont"
            aria-label="数学画板字号" @input="onBoardFont" />
          <span class="ink-val">{{ Math.round(PREFS.boardFont * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板线条粗细</strong>
          <span>曲线、辅助线与图形轮廓的粗细倍率。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.6" max="2.5" step="0.05" :value="PREFS.boardLineW"
            aria-label="数学画板线条粗细" @input="onBoardLine" />
          <span class="ink-val">{{ Math.round(PREFS.boardLineW * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板坐标轴线宽</strong>
          <span>坐标轴的粗细，独立于线条粗细。</span>
        </div>
        <div class="ink-slide">
          <input class="ink-range" type="range" min="0.6" max="3" step="0.05" :value="PREFS.boardAxisW"
            aria-label="数学画板坐标轴线宽" @input="onBoardAxis" />
          <span class="ink-val">{{ Math.round(PREFS.boardAxisW * 100) }}%</span>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板背景纸格</strong>
          <span>板底纸纹：自动、方格、点阵或横线，跟随画板缩放。</span>
        </div>
        <div class="seg wide" role="group" aria-label="数学画板背景纸格">
          <button v-for="o in MATH_GRID" :key="o.v" type="button" :class="{ on: PREFS.boardGrid === o.v }"
            @click="setPref('boardGrid', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画布工具条</strong>
          <span>自动收回还是常驻；自动时点画布空白即收起。</span>
        </div>
        <div class="seg" role="group" aria-label="画布工具条">
          <button v-for="o in BAR_MODES" :key="o.v" type="button" :class="{ on: PREFS.inkBar === o.v }"
            @click="setPref('inkBar', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>套索选择方式</strong>
          <span>按形状剪选：圈到哪一段就选哪一段，跨过边界的笔画在边界处剪开，外面剩下的仍留在板上（框也跟着套索走，不再是外接矩形）；整条选：碰到就用整条，和以前一样。画布工具条上套索右边那枚「剪选 / 整条」钮可以直接切。</span>
        </div>
        <div class="seg" role="group" aria-label="套索选择方式">
          <button v-for="o in SEL_MODES" :key="o.v" type="button" :class="{ on: PREFS.inkSelMode === o.v }"
            @click="setPref('inkSelMode', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>操作提示</strong>
          <span>批注时的短提示（吸附成功、搬到画布、截图失败之类）在这块画板的底部弹一条，一会儿自己消失；不想看就选「不提示」。</span>
        </div>
        <div class="seg" role="group" aria-label="操作提示">
          <button v-for="o in TIP_MODES" :key="o.v" type="button" :class="{ on: PREFS.inkTip === o.v }"
            @click="setPref('inkTip', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>记住板内文字位置</strong>
          <span>把画板里拖到别处的标注、底部说明行记在本机。开着时刷新页面、重启浏览器、重启服务都还在；关掉后文字回出场位置，存档仍留着，再打开就恢复。</span>
        </div>
        <div class="seg" role="group" aria-label="记住板内文字位置">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.lblPin === o.v }"
            @click="setPref('lblPin', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>默认位置文件</strong>
          <span>相对站点根目录、放在 public/ 下的 JSON，每次打开站点先读它当默认位置；本机拖过的位置覆盖它。改路径后刷新页面生效。</span>
        </div>
        <div class="dir-btns">
          <input class="lbl-path" :value="PREFS.lblPath" spellcheck="false" @change="setLblPath" />
          <button class="md-btn" type="button" @click="updateDefaultFile">更新位置</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>文字位置存档</strong>
          <span>本机 {{ lblCount }} 块、默认档 {{ defCount }} 块有记录。导出成文件可以留底或换浏览器用；清除只清本机记录，默认档不动。</span>
        </div>
        <div class="dir-btns">
          <button class="md-btn" type="button" @click="exportLbl">导出</button>
          <button class="md-btn" type="button" @click="pickLblFile">导入</button>
          <button class="md-btn danger" type="button" @click="clearLbl">清除</button>
        </div>
      </div>
      <input ref="lblFile" class="lbl-file" type="file" accept=".json,application/json" @change="importLbl" />
    </div>

    <h3 class="sec">模型与 API</h3>
    <div class="set-card">
      <div class="md-hint">
        <p>按 OpenAI 兼容格式调用：接口地址填到 <code>/v1</code> 这一层，直接粘整条端点也可以。密钥只存在本机浏览器里，明文保存，公用电脑请留意。</p>
        <p>浏览器直连要求对方允许跨域（CORS）。配好后点卡片里的「测试连接」，能直接看到是网络、鉴权还是地址的问题。</p>
      </div>
      <div class="md-presets">
        <span class="md-presets-t">快速添加：</span>
        <button v-for="p in PRESETS" :key="p.name" class="md-preset" type="button" @click="addPreset(p)">{{ p.name }}</button>
        <button class="md-preset" type="button" @click="addBlank">自定义</button>
      </div>

      <p v-if="!MODELS.list.length" class="md-empty">还没有模型。点上面任意一个先加进来，再填密钥。</p>

      <div v-for="m in MODELS.list" :key="m.id" class="md-card" :class="{ on: m.id === MODELS.active }">
        <button class="md-sum" type="button" :aria-expanded="isOpen(m)" @click="toggleOpen(m)">
          <span class="md-caret" :class="{ open: isOpen(m) }">▸</span>
          <strong class="md-sum-name">{{ m.name || '未命名模型' }}</strong>
          <span class="md-model">{{ m.model || '未填模型名' }}</span>
          <span class="md-sp" />
          <span v-if="m.id === MODELS.active" class="md-tag">使用中</span>
        </button>
        <div v-show="isOpen(m)" class="md-body">
          <div class="md-row">
            <label class="md-name">
              <input :value="m.name" @input="edit(m.id, { name: $event.target.value })" placeholder="显示名称" />
            </label>
            <span class="md-sp" />
            <button class="md-btn" type="button" :class="{ on: m.id === MODELS.active }"
              @click="setActiveModel(m.id)">{{ m.id === MODELS.active ? '使用中' : '用它' }}</button>
            <button class="md-btn danger" type="button" @click="askRemove(m)">删除</button>
          </div>
          <div class="md-grid">
            <label class="md-f">
              <span>接口地址</span>
              <input :value="m.baseUrl" spellcheck="false" placeholder="https://api.example.com/v1"
                @input="edit(m.id, { baseUrl: $event.target.value })" />
              <em class="md-url">{{ endpointOf(m.baseUrl) || '填上地址后显示实际请求地址' }}</em>
            </label>
            <label class="md-f">
              <span>模型名</span>
              <input :value="m.model" spellcheck="false" placeholder="gpt-4o-mini"
                @input="edit(m.id, { model: $event.target.value })" />
            </label>
            <div class="md-f wide">
              <span>API Key</span>
              <div class="md-key">
                <input :value="m.key" :type="keyShow[m.id] ? 'text' : 'password'" spellcheck="false"
                  autocomplete="off" placeholder="sk-…（本地模型可留空）"
                  @input="edit(m.id, { key: $event.target.value })" />
                <button class="md-eye" type="button" @click="toggleKey(m.id)">{{ keyShow[m.id] ? '隐藏' : '显示' }}</button>
              </div>
            </div>
            <label class="md-f">
              <span>温度 {{ Number(m.temp).toFixed(1) }}</span>
              <input class="md-range" type="range" min="0" max="1.5" step="0.1" :value="m.temp"
                @input="edit(m.id, { temp: Number($event.target.value) })" />
            </label>
          </div>
          <div class="md-foot">
            <button class="md-btn" type="button" :disabled="!!(probe[m.id] && probe[m.id].busy)" @click="testModel(m)">
              {{ probe[m.id] && probe[m.id].busy ? '连接中…' : '测试连接' }}
            </button>
            <span v-if="probe[m.id] && probe[m.id].msg" class="md-probe"
              :class="{ ok: probe[m.id].ok, bad: probe[m.id].ok === false }">{{ probe[m.id].msg }}</span>
          </div>
        </div>
      </div>
    </div>

    <h3 class="sec">保存位置</h3>
    <div class="set-card">
      <div class="set-row">
        <div class="set-label">
          <strong>对话保存目录</strong>
          <span>{{ chatDir ? '对话会自动写成 md 存进这个文件夹；浏览器权限过期后，在聊天窗点一次「存到目录」即可续上。' : '还没选。选一个文件夹后对话会自动写成 md；不选也能用，对话实时存在浏览器里，刷新不丢。' }}</span>
        </div>
        <div class="dir-btns">
          <button class="md-btn" type="button" @click="pick('chat')">{{ chatDir ? '更换' : '选择文件夹' }}</button>
          <button v-if="chatDir" class="md-btn danger" type="button" @click="drop('chat')">清除</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>笔记保存目录</strong>
          <span>{{ noteDir || '还没选。选一个文件夹后，笔记会按标题写成 .md / .tex 存进去。' }}</span>
        </div>
        <div class="dir-btns">
          <button class="md-btn" type="button" @click="pick('note')">{{ noteDir ? '更换' : '选择文件夹' }}</button>
          <button v-if="noteDir" class="md-btn danger" type="button" @click="drop('note')">清除</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>笔记自动存到文件夹</strong>
          <span>开：停手一两秒就把改过的那几篇写进上面这个目录，不用每次点「存到文件夹」。关：只在点按钮时写，浏览器里的存档照旧随时进行。</span>
        </div>
        <div class="seg" role="group" aria-label="笔记自动存到文件夹">
          <button v-for="o in ONS" :key="o.v" type="button" :class="{ on: PREFS.noteAuto === o.v }"
            @click="setPref('noteAuto', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <p class="dir-note">
        {{ fsOk ? '文件夹读写只在 Chrome / Edge 这类浏览器里可用；没选目录时笔记仍在浏览器里存，笔记页侧栏的「备份」能把全部笔记导出成一份 JSON，换机器再「导入」回来。' : '当前浏览器不支持直接写文件夹，请用「下载」按钮保存到本地，或者换 Chrome / Edge。' }}
      </p>
    </div>

    <h3 class="sec">这些设置的边界</h3>
    <div class="note">
      <p>方向只影响弹出层落在哪边，画板内容、章节顺序、阅读进度都不受牵连。配色仍在顶栏「🎨 主题」里调；菜单底部那行「✨ 背景光影」是一道总闸，关掉之后本页选的背景也一并停下。</p>
    </div>

    <div class="set-actions">
      <button class="set-btn" type="button" @click="resetAll">恢复默认</button>
      <router-link class="set-btn ghost" to="/">回到目录</router-link>
      <span class="set-tip">默认：目录靠左，画板与助手靠右半屏；操作条排在板上方靠左；悬停亮线跟随主题；背景为呼吸光影；板内文字位置记在本机；笔记停手后自动存入选定文件夹。</span>
    </div>
  </div>
</template>

<script setup>
// 设置页：界面偏好在 lib/settings.js（PREFS），模型在 lib/models.js，保存目录句柄在 IndexedDB（lib/fsdir.js）。
import { computed, onMounted, reactive, ref } from 'vue';
import { PREFS, setPref, resetPrefs } from '../lib/settings.js';
import { SCENE_LIST } from '../lib/chaos.js';
import ParticleField from '../components/ParticleField.vue';
import { MODELS, PRESETS, setActiveModel, addModel, updateModel, removeModel } from '../lib/models.js';
import { fsSupported, pickDir, getHandle, dropHandle } from '../lib/fsdir.js';
import { pingModel, endpointOf } from '../lib/chat.js';
import { readLabels, writeLabels, clearLabels, mergeLabels, countBoards, effectiveLabels, defaultsSnapshot, setDefaultLabels } from '../lib/labelstore.js';
import { playPageAnim } from '../lib/pagetransition.js';

const SIDES = [{ v: 'left', t: '靠左' }, { v: 'right', t: '靠右' }];
const SIZES = [{ v: 'half', t: '半屏' }, { v: 'full', t: '整屏' }];
const NAVOPTS = [{ v: 'cur', t: '当前子专题' }, { v: 'all', t: '全部展开' }, { v: 'none', t: '全部收起' }];
// 全站搜索的呈现：顶栏直接展开 / 屏幕中间弹窗（见 components/SearchPalette.vue 的 mode）
const SEARCH = [{ v: 'inline', t: '顶栏展开' }, { v: 'popup', t: '居中弹窗' }];
// 旋转多面体摆哪儿（见 components/BgPoly.vue 的 pos 属性）
const SOLID_POS = [{ v: 'br', t: '右下角' }, { v: 'left', t: '左侧留白' }, { v: 'right', t: '右侧留白' }];
// 面包屑缓存条数：硬上限 20（见 lib/visits.js 的 MAX_VISITS）
const CAPS = [{ v: '5', t: '5 个' }, { v: '8', t: '8 个' }, { v: '12', t: '12 个' }, { v: '20', t: '20 个' }];
const ANIMS = [
  { v: 'particles', t: '轨道粒子' },
  { v: 'fade', t: '淡入' },
  { v: 'up', t: '上滑' },
  { v: 'zoom', t: '缩放' },
  { v: 'slide', t: '侧滑' },
  { v: 'blur', t: '模糊' },
  { v: 'none', t: '不做' },
];
// 换主题的过渡（见 lib/theme.js 的 applyTheme 与 global.css 的 vt-* 规则）
const THEME_ANIMS = [
  { v: 'circle', t: '圆形扩散' },
  { v: 'fade', t: '淡入' },
  { v: 'sweep', t: '左向展开' },
  { v: 'none', t: '不做' },
];
const ONS = [{ v: 'on', t: '开' }, { v: 'off', t: '关' }];
// 画板操作条放哪儿（见 lib/board.js 的 _placeBar）：
const DL_POS = [{ v: 'left', t: '板上靠左' }, { v: 'right', t: '板上靠右' }, { v: 'in', t: '板内右上' }];
const PAPERS = [
  { v: 'theme', t: '跟随主题' },
  { v: 'paper', t: '纸白' }, { v: 'sand', t: '暖沙' }, { v: 'mint', t: '青瓷' }, { v: 'sakura', t: '樱粉' },
  { v: 'slate', t: '板岩' }, { v: 'abyss', t: '墨蓝' }, { v: 'forest', t: '林深' }, { v: 'plum', t: '紫夜' },
];
// 画布批注工具条：点空白自动收回 / 常驻（见 lib/board.js 的 _inkFoldTo 与 pointerup 判空白）
const BAR_MODES = [{ v: 'auto', t: '自动收回' }, { v: 'pin', t: '常驻' }];
// 套索选择：圈到哪段选哪段 / 整条选（见 lib/board.js 的 _inkEndSel → _inkCutByPoly）
const SEL_MODES = [{ v: 'cut', t: '按形状剪选' }, { v: 'whole', t: '整条选' }];
// 批注操作提示：画板底部弹一条 / 不提示（见 lib/board.js 的 _inkTipSay）
const TIP_MODES = [{ v: 'toast', t: '弹出提示' }, { v: 'off', t: '不提示' }];
// 卡片悬停亮线颜色：默认跟主题走（'theme'），选自定义就存一个 '#rrggbb'（见 lib/settings.js 的 cardInk）
const inkHex = computed(() => (PREFS.cardInk === 'theme' ? '#5cadff' : PREFS.cardInk));
const pickInk = () => setPref('cardInk', inkHex.value);
const onInk = (e) => setPref('cardInk', e.target.value);
// 背景混沌线条的颜色与浓度（见 components/BgMotion.vue 的 parseInk / gain）
const bgInkHex = computed(() => (PREFS.bgInk === 'auto' ? '#5cadff' : PREFS.bgInk));
const pickBgInk = () => setPref('bgInk', bgInkHex.value);
const onBgInk = (e) => setPref('bgInk', e.target.value);
const onBgAlpha = (e) => setPref('bgAlpha', Number(e.target.value));
const onPhysFont = (e) => setPref('physFont', Number(e.target.value));
const onPhysLine = (e) => setPref('physLineW', Number(e.target.value));
const onPhysAxis = (e) => setPref('physAxisW', Number(e.target.value));
const GRID_MODES = [
  { v: 'auto', t: '自动' },
  { v: 'on', t: '显示' },
  { v: 'off', t: '隐藏' },
];
// 数学画板的三个倍率（见 lib/board.js 的 boardFontPx / mk / grid）与背景纸格（见 _paperStyle）
const onBoardFont = (e) => setPref('boardFont', Number(e.target.value));
const onBoardLine = (e) => setPref('boardLineW', Number(e.target.value));
const onBoardAxis = (e) => setPref('boardAxisW', Number(e.target.value));
const MATH_GRID = [
  { v: 'off', t: '不画' },
  { v: 'auto', t: '自动' },
  { v: 'square', t: '方格' },
  { v: 'dots', t: '点阵' },
  { v: 'lines', t: '横线' },
];

const sceneBlurb = computed(() => {
  const s = SCENE_LIST.find(x => x.id === PREFS.bgScene);
  return s ? s.blurb : '';
});

const fsOk = fsSupported();
const chatDir = ref('');
const noteDir = ref('');
const lblFile = ref();
const lblCount = ref(0);
const defCount = ref(0);

function refreshLblCount() {
  lblCount.value = countBoards(readLabels());
  defCount.value = countBoards(defaultsSnapshot());
}

function downloadJson(name, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function normLblPath(v) {
  const p = String(v || '').trim().replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^public\//, '');
  if (!p || p.includes('..') || !/\.json$/i.test(p)) return '';
  return p;
}

function setLblPath(ev) {
  const el = ev.target;
  const p = normLblPath(el.value);
  if (!p) {
    window.alert('路径要写成 public/ 下的 .json 文件名，例如 lbl-default.json。');
    el.value = PREFS.lblPath;
    return;
  }
  setPref('lblPath', p);
  el.value = p;
}

async function updateDefaultFile() {
  const p = normLblPath(PREFS.lblPath);
  if (!p) { window.alert('先填一个 public/ 下的 .json 路径，例如 lbl-default.json。'); return; }
  const data = effectiveLabels();
  if (!countBoards(data) && !window.confirm('现在还没有任何位置记录，写进去会是一份空档。仍然更新？')) return;
  try {
    const r = await fetch('/__lbl-write', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: 'public/' + p, data }),
    });
    let j = null;
    try { j = await r.json(); } catch (_) { j = null; }
    if (j && j.ok === false) { window.alert('没有写成：' + j.error); return; }
    if (!j || !j.ok) throw new Error('没有写入接口');
    setDefaultLabels(data);
    refreshLblCount();
    window.alert('已写入 public/' + p + '。换一台机器打开站点就会读到这份默认位置。');
  } catch (e) {
    downloadJson('lbl-default.json', data);
    window.alert('这个环境不能直接写文件（构建产物或静态部署），已改为下载 lbl-default.json；把它放到站点目录的 ' + p + ' 即可。');
  }
}

function exportLbl() {
  const store = readLabels();
  if (!countBoards(store)) { window.alert('还没有存过文字位置。'); return; }
  try { downloadJson('gl-lbl.json', store); } catch (e) { window.alert('导出失败：' + (e.message || e)); }
}

function pickLblFile() { if (lblFile.value) lblFile.value.click(); }

async function importLbl(ev) {
  const input = ev.target;
  const f = input && input.files && input.files[0];
  if (input) input.value = '';
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (!data || typeof data !== 'object') throw new Error('文件内容不是文字位置存档。');
    writeLabels(mergeLabels(readLabels(), data));
    refreshLblCount();
    window.alert('已并入存档。打开画板页后生效。');
  } catch (e) {
    window.alert('读不了这个文件：' + (e.message || e));
  }
}

function clearLbl() {
  if (!window.confirm('清掉所有画板的文字位置记录？已打开的画板页刷新后生效。')) return;
  if (!clearLabels()) { window.alert('这个浏览器不让清除本机存档。'); return; }
  refreshLblCount();
}

onMounted(async () => {
  refreshLblCount();
  try {
    const a = await getHandle('chat');
    const b = await getHandle('note');
    chatDir.value = a ? a.name : '';
    noteDir.value = b ? b.name : '';
  } catch (e) { /* 无痕模式 */ }
});

function pickAnim(v) {
  setPref('pageAnim', v);
  playPageAnim();
}

// 选类型顺手把开关打开，免得点了没反应
function pickScene(id) {
  setPref('bgScene', id);
  if (PREFS.bgMotionOn !== 'on') setPref('bgMotionOn', 'on');
}

function edit(id, patch) { updateModel(id, patch); if (probe[id]) delete probe[id]; }
function addPreset(p) { addModel(p); }
function addBlank() { addModel({ name: '自定义模型' }); }
function askRemove(m) {
  if (!window.confirm('删掉「' + m.name + '」？密钥也会一起删掉。')) return;
  removeModel(m.id);
}

// 模型卡：折叠状态、密钥显隐、连接测试
const openMap = ref({});
const keyShow = reactive({});
const probe = reactive({});
function isOpen(m) {
  const v = openMap.value[m.id];
  return v === undefined ? m.id === MODELS.active : v;
}
function toggleOpen(m) { openMap.value[m.id] = !isOpen(m); }
function toggleKey(id) { keyShow[id] = !keyShow[id]; }
async function testModel(m) {
  probe[m.id] = { busy: true, ok: null, msg: '正在连接…' };
  try {
    await pingModel({ ...m });
    probe[m.id] = { busy: false, ok: true, msg: '连接成功，模型可用。' };
  } catch (e) {
    probe[m.id] = { busy: false, ok: false, msg: (e && e.message) || String(e) };
  }
}

async function pick(kind) {
  try {
    const name = await pickDir(kind);
    if (kind === 'chat') chatDir.value = name; else noteDir.value = name;
  } catch (e) {
    if (e && e.name === 'AbortError') return; // 用户取消
    window.alert(e.message || String(e));
  }
}
async function drop(kind) {
  await dropHandle(kind);
  if (kind === 'chat') chatDir.value = ''; else noteDir.value = '';
}

function resetAll() {
  resetPrefs();
  playPageAnim();
}
</script>

<style scoped>
.particle-preview {
  display: grid; grid-template-rows: minmax(0, 1fr) auto;
  width: min(100%, 700px); height: clamp(170px, 32vw, 290px); margin: 3px auto 12px; overflow: hidden;
  background: radial-gradient(ellipse at 50% 45%, color-mix(in srgb, var(--blue) 8%, var(--bg2)), var(--bg2) 70%);
  border: 1px solid var(--line); border-radius: 9px;
}
.particle-preview span {
  padding: 0 12px 8px; color: var(--mut); font-size: 12px; text-align: center;
}
.set-card {
  border: 1px solid var(--line); border-radius: 14px; background: var(--card);
  padding: 6px 18px; margin: 12px 0 4px;
}
.set-row {
  display: flex; align-items: center; gap: 18px;
  padding: 14px 0; border-bottom: 1px solid var(--line);
}
.set-row:last-child { border-bottom: none; }
.set-label { flex: 1; min-width: 0; }
.set-label strong { display: block; font-size: 14.5px; color: var(--ink); font-weight: 600; }
.set-label span { display: block; margin-top: 3px; font-size: 12.5px; line-height: 1.7; color: var(--mut); }
.seg {
  flex: none; display: flex; gap: 4px; padding: 3px; flex-wrap: wrap;
  border: 1px solid var(--line); border-radius: 99px; background: var(--bg2);
}
.seg button {
  font: inherit; font-size: 12.5px; color: var(--mut); background: transparent; border: none;
  border-radius: 99px; padding: 4px 14px; cursor: pointer; transition: color .15s ease, background .15s ease;
}
.seg button:hover { color: var(--ink); }
.seg button.on { color: var(--ink); background: var(--line); }
/* 「卡片悬停亮线」那格的取色器：压成小圆片，跟两侧按钮同一个高度 */
.seg .ink-pick {
  width: 26px; height: 26px; margin: 0 2px; padding: 0; flex: none;
  border: 1px solid var(--line); border-radius: 99px; background: transparent; cursor: pointer;
}
.seg .ink-pick::-webkit-color-swatch-wrapper { padding: 2px; }
.seg .ink-pick::-webkit-color-swatch { border: none; border-radius: 99px; }
.seg .ink-pick::-moz-color-swatch { border: none; border-radius: 99px; }
/* 「背景线条浓度」那格的滑块：右侧跟一枚百分比读数，宽度跟着行走 */
.ink-slide { flex: none; display: flex; align-items: center; gap: 10px; }
.ink-range { width: 210px; accent-color: var(--blue); cursor: pointer; }
.ink-val { font-size: 12px; color: var(--mut); min-width: 42px; text-align: right; font-variant-numeric: tabular-nums; }
.scene-row .set-label { min-width: min(190px, 100%); }
.seg.scene-options {
  flex: 0 1 auto; min-width: 0; max-width: 100%; flex-wrap: nowrap;
  overflow-x: auto; scrollbar-width: thin;
}
.scene-options button { flex: none; white-space: nowrap; }
/* 页脚两个动作钮：各自成颗、文字不换行；说明另起一行铺满 */
.set-actions {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  margin-top: 28px; padding-top: 16px; border-top: 1px dashed var(--line);
}
.set-actions .set-btn {
  flex: 0 0 auto; white-space: nowrap; font: inherit; font-size: 13px; line-height: 1;
  padding: 9px 18px; border-radius: 999px; border: 1px solid var(--line);
  background: var(--card); color: var(--mut); text-decoration: none; cursor: pointer;
  transition: color .16s ease, border-color .16s ease, background-color .16s ease, transform .12s ease;
}
.set-actions .set-btn:hover {
  color: var(--ink); border-color: var(--mut);
  background: color-mix(in srgb, var(--ink) 7%, var(--card));
}
.set-actions .set-btn:active { transform: translateY(1px); }
.set-actions .set-btn.ghost { background: transparent; }
.set-actions .set-tip { flex: 1 1 100%; color: var(--faint); font-size: 12px; line-height: 1.7; }

/* 模型区 */
.md-hint { padding: 12px 0 6px; font-size: 12.5px; color: var(--mut); line-height: 1.8; }
.md-hint p { margin: 0 0 4px; }
.md-hint code { font-family: var(--font-mono); background: var(--bg2); padding: 0 4px; border-radius: 4px; }
.md-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 0 10px; }
.md-presets-t { font-size: 12.5px; color: var(--faint); }
.md-preset { font: inherit; font-size: 12px; color: var(--mut); background: var(--bg2); border: 1px solid var(--line);
  border-radius: 99px; padding: 3px 11px; cursor: pointer; }
.md-preset:hover { color: var(--blue); border-color: var(--blue); }
.md-empty { color: var(--faint); font-size: 12.5px; padding: 6px 0 14px; }
.md-card { border: 1px solid var(--line); border-radius: 12px; padding: 8px 12px; margin-bottom: 10px; background: var(--bg2); }
.md-card.on { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
/* 折叠头：整行可点，左侧三角跟着开合转 */
.md-sum {
  display: flex; align-items: center; gap: 8px; width: 100%;
  font: inherit; color: var(--ink); background: transparent; border: 0;
  padding: 4px 2px; cursor: pointer; text-align: left;
}
.md-caret { flex: none; width: 14px; color: var(--faint); font-size: 11px; transition: transform .16s ease; }
.md-caret.open { transform: rotate(90deg); }
.md-sum-name { font-size: 13.5px; font-weight: 600; }
.md-sum .md-model { font-size: 12px; color: var(--faint); font-family: var(--font-mono); }
.md-tag {
  flex: none; font-size: 11px; line-height: 1; padding: 3px 8px; border-radius: 99px;
  color: var(--blue); border: 1px solid color-mix(in srgb, var(--blue) 45%, transparent);
  background: color-mix(in srgb, var(--blue) 10%, transparent);
}
.md-body { padding-top: 4px; }
/* 密钥一格：输入框 + 显示/隐藏 */
.md-key { display: flex; align-items: center; gap: 6px; }
.md-key input { flex: 1; min-width: 0; }
/* 接口地址下面一行：把最终请求地址显出来，免得「怎么连到别的域名去了」 */
.md-url { display: block; margin-top: 4px; font-style: normal; font-size: 11.5px; line-height: 1.5;
  color: var(--faint); font-family: var(--font-mono);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-eye {
  flex: none; font: inherit; font-size: 12px; line-height: 1; padding: 6px 10px;
  border-radius: 8px; border: 1px solid var(--line); background: transparent;
  color: var(--mut); cursor: pointer;
}
.md-eye:hover { color: var(--ink); border-color: var(--mut); }
/* 折叠体底部：测试连接与结果 */
.md-foot { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; padding: 8px 0 2px; }
.md-probe { flex: 1 1 260px; font-size: 12px; line-height: 1.65; color: var(--faint); }
.md-probe.ok { color: var(--green); }
.md-probe.bad { color: var(--orange); }
.md-row { display: flex; align-items: center; gap: 8px; }
.md-name { flex: 1; min-width: 0; }
.md-name input { width: 100%; font: inherit; font-size: 14px; font-weight: 600; color: var(--ink);
  background: transparent; border: none; border-bottom: 1px dashed transparent; padding: 2px 0; outline: none; }
.md-name input:focus { border-bottom-color: var(--line); }
.md-model { flex: none; font-size: 12px; color: var(--faint); font-family: var(--font-mono); }
.md-sp { flex: 1; }
.md-btn { font: inherit; font-size: 12px; color: var(--mut); background: transparent; border: 1px solid var(--line);
  border-radius: 8px; padding: 3px 10px; cursor: pointer; white-space: nowrap; }
.md-btn:hover { color: var(--ink); border-color: var(--mut); }
.md-btn:disabled { opacity: .55; cursor: default; }
.md-btn.on { color: var(--blue); border-color: var(--blue); }
.md-btn.danger:hover { color: var(--pink); border-color: var(--pink); }
.md-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-top: 8px; }
.md-f { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.md-f.wide { grid-column: 1 / -1; }
.md-f span { font-size: 11.5px; color: var(--faint); }
.md-f input { font: inherit; font-size: 12.5px; color: var(--ink); background: var(--card);
  border: 1px solid var(--line); border-radius: 8px; padding: 5px 9px; outline: none; min-width: 0; }
.md-f input:focus { border-color: var(--blue); }
.md-f .md-range { padding: 0; border: none; background: transparent; accent-color: var(--blue); }
.dir-btns { display: flex; gap: 8px; flex: none; align-items: center; }
.lbl-file { display: none; }
.lbl-path { font: inherit; font-size: 12.5px; color: var(--ink); background: var(--card);
  border: 1px solid var(--line); border-radius: 8px; padding: 5px 9px; width: 208px; outline: none; }
.lbl-path:focus { border-color: var(--blue); }
.dir-note { font-size: 12px; color: var(--faint); line-height: 1.7; padding: 10px 0 4px; }
@media (max-width: 720px) {
  .set-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .md-grid { grid-template-columns: 1fr; }
}
</style>
