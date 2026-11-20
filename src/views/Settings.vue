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
          <span>切页时正文的入场方式，选一个马上能看到效果。</span>
        </div>
        <div class="seg" role="group" aria-label="页面切换动画">
          <button v-for="o in ANIMS" :key="o.v" type="button" :class="{ on: PREFS.pageAnim === o.v }"
            @click="pickAnim(o.v)">{{ o.t }}</button>
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
      <div class="set-row">
        <div class="set-label">
          <strong>背景类型</strong>
          <span>{{ sceneBlurb }}</span>
        </div>
        <div class="seg wide" role="group" aria-label="背景类型">
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
          <span>线条与烟气的透明度倍数，100% 是标准值。嫌淡往右拉，嫌抢眼往左拉；拖动即刻生效，画面不会重播。</span>
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
          <span>画板右上角那一排按钮（缩放、半屏、底色、导出等）放哪儿。选板外时它们排到画板上方的一条里，不再压住图形；半屏/全屏展示时自动收回板内顶部。物理讲义的演示画板同此设置。</span>
        </div>
        <div class="seg" role="group" aria-label="画板操作条位置">
          <button v-for="o in DL_POS" :key="o.v" type="button" :class="{ on: PREFS.dlPos === o.v }"
            @click="setPref('dlPos', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>物理画板纸面</strong>
          <span>讲义演示与实验页那块画板的底色、方格与墨色。默认跟随主题——深色家族是一方深板岩纸，浅色家族是一张暖米色的纸；另有四档浅纸（纸白 · 浅蓝、暖沙 · 米黄、青瓷 · 薄荷、樱粉 · 淡桃）与四档深纸（深板岩、墨蓝、林深、紫夜），每档自带一整套墨色与语义色，暗色主题下选浅纸也照样看得清。画板操作条上的「▦ 纸面」是同一项。</span>
        </div>
        <div class="seg wide" role="group" aria-label="物理画板纸面">
          <button v-for="o in PAPERS" :key="o.v" type="button" :class="{ on: PREFS.physPaper === o.v }"
            @click="setPref('physPaper', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画板字号</strong>
          <span>画板里所有图内文字（读数、刻度、公式符号与单位）的字号倍率。数字与公式走 KaTeX 的衬线数学体，带汉字的说明仍用系统字体。</span>
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
          <span>图里曲线、箭头、辅助线与物体轮廓的粗细倍率，100% 是原来的画法。觉得线太细往右拉；拖动即刻生效，不会重播实验。</span>
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
          <span>坐标图里两条轴的粗细，是绝对倍率、不与「线条粗细」叠乘。刻度短线与网格线仍随线条粗细走。</span>
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
          <span>板底那层纸面方格。自动：演示里有坐标网格时先收起来，免得两套线条叠在一起互相咬；显示：始终画；隐藏：完全不画。方格会跟着缩放平移一起走，与图上的坐标网格同一个相位。</span>
        </div>
        <div class="seg" role="group" aria-label="画板背景网格">
          <button v-for="o in GRID_MODES" :key="o.v" type="button" :class="{ on: PREFS.physGrid === o.v }"
            @click="setPref('physGrid', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>数学画板字号</strong>
          <span>数学画板（各章的 SVG 演示台）里图内文字的字号倍率。数字、拉丁与希腊字母、运算符一律排成 KaTeX 的数学体，变量斜体、函数名与数字正体，汉字仍用系统字体；100% 与原来的版面一致。</span>
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
          <span>图里曲线、辅助线、网格与图形轮廓的粗细倍率，100% 是原来的画法。批注墨迹与把手不吃这一项。</span>
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
          <span>函数图象板两条坐标轴的粗细，是绝对倍率、不与「线条粗细」叠乘；箭头与轴字母跟着一起变。刻度短线与网格线仍随线条粗细走。</span>
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
          <span>垫在整块画板底下的一层纸纹。自动：板上有坐标网格时收起，免得两套线条叠在一起；方格、点阵、横线：始终铺。纸格跟着画板缩放平移一起走，导出图里也带着它。画布页自己选的纸面不受这一项影响。画板操作条上的「▤ 外观」面板里有同一个开关。</span>
        </div>
        <div class="seg wide" role="group" aria-label="数学画板背景纸格">
          <button v-for="o in MATH_GRID" :key="o.v" type="button" :class="{ on: PREFS.boardGrid === o.v }"
            @click="setPref('boardGrid', o.v)">{{ o.t }}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">
          <strong>画布工具条</strong>
          <span>自动收回：在画布空白处点一下，工具条收成一个小钮（工具条右侧的图钉可以随手切换）；常驻：一直留在原位，点空白也不会收。</span>
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
        <p>按 OpenAI 兼容格式调用，接口地址填到 <code>/v1</code> 这一层即可。密钥只存在本机浏览器里，明文保存，用公用电脑请自己留意。</p>
        <p>浏览器直连要求对方允许跨域（CORS）；被拦下时换成自建代理或本地服务的地址。</p>
      </div>
      <div class="md-presets">
        <span class="md-presets-t">快速添加：</span>
        <button v-for="p in PRESETS" :key="p.name" class="md-preset" type="button" @click="addPreset(p)">{{ p.name }}</button>
        <button class="md-preset" type="button" @click="addBlank">自定义</button>
      </div>

      <p v-if="!MODELS.list.length" class="md-empty">还没有模型。点上面任意一个先加进来，再填密钥。</p>

      <div v-for="m in MODELS.list" :key="m.id" class="md-card" :class="{ on: m.id === MODELS.active }">
        <div class="md-row">
          <label class="md-name">
            <input :value="m.name" @input="edit(m.id, { name: $event.target.value })" placeholder="显示名称" />
          </label>
          <span class="md-model">{{ m.model || '未填模型名' }}</span>
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
          </label>
          <label class="md-f">
            <span>模型名</span>
            <input :value="m.model" spellcheck="false" placeholder="gpt-4o-mini"
              @input="edit(m.id, { model: $event.target.value })" />
          </label>
          <label class="md-f wide">
            <span>API Key</span>
            <input :value="m.key" type="password" spellcheck="false" placeholder="sk-…（本地模型可留空）"
              @input="edit(m.id, { key: $event.target.value })" />
          </label>
          <label class="md-f">
            <span>温度 {{ Number(m.temp).toFixed(1) }}</span>
            <input class="md-range" type="range" min="0" max="1.5" step="0.1" :value="m.temp"
              @input="edit(m.id, { temp: Number($event.target.value) })" />
          </label>
        </div>
      </div>
    </div>

    <h3 class="sec">保存位置</h3>
    <div class="set-card">
      <div class="set-row">
        <div class="set-label">
          <strong>对话保存目录</strong>
          <span>{{ chatDir || '还没选。选一个文件夹后，「存到目录」会把对话写成 md 存进去。' }}</span>
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

    <div class="read-row">
      <button class="readmark" type="button" @click="resetAll">恢复默认</button>
      <router-link class="readmark" to="/">回到目录</router-link>
      <span class="readtip">默认：目录靠左，画板与助手靠右，半屏，只展开当前子专题，画板操作条排在板上方靠左，画布半屏靠右、工具条贴顶部，卡片悬停亮线跟随主题，背景是三团呼吸光影（混沌场景的线条默认冷蓝、浓度 30%），右下角一枚旋转多面体，拖过的板内文字自动记在本机，笔记停手后自动写进所选文件夹</span>
    </div>
  </div>
</template>

<script setup>
// 设置页：界面偏好在 lib/settings.js（PREFS），模型在 lib/models.js，保存目录句柄在 IndexedDB（lib/fsdir.js）。
import { computed, onMounted, ref } from 'vue';
import { PREFS, setPref, resetPrefs } from '../lib/settings.js';
import { SCENE_LIST } from '../lib/chaos.js';
import { MODELS, PRESETS, setActiveModel, addModel, updateModel, removeModel } from '../lib/models.js';
import { fsSupported, pickDir, getHandle, dropHandle } from '../lib/fsdir.js';
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
  { v: 'fade', t: '淡入' },
  { v: 'up', t: '上滑' },
  { v: 'zoom', t: '缩放' },
  { v: 'slide', t: '侧滑' },
  { v: 'blur', t: '模糊' },
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

function edit(id, patch) { updateModel(id, patch); }
function addPreset(p) { addModel(p); }
function addBlank() { addModel({ name: '自定义模型' }); }
function askRemove(m) {
  if (!window.confirm('删掉「' + m.name + '」？密钥也会一起删掉。')) return;
  removeModel(m.id);
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
/* 六个背景类型一行排不下就折行，圆角改小一点，折行时不至于成个怪圆 */
.seg.wide { border-radius: 14px; justify-content: flex-end; max-width: 560px; }
.read-row a { text-decoration: none; }
.read-row .readmark { font: inherit; }

/* 模型区 */
.md-hint { padding: 12px 0 6px; font-size: 12.5px; color: var(--mut); line-height: 1.8; }
.md-hint p { margin: 0 0 4px; }
.md-hint code { font-family: ui-monospace, Menlo, monospace; background: var(--bg2); padding: 0 4px; border-radius: 4px; }
.md-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 0 10px; }
.md-presets-t { font-size: 12.5px; color: var(--faint); }
.md-preset { font: inherit; font-size: 12px; color: var(--mut); background: var(--bg2); border: 1px solid var(--line);
  border-radius: 99px; padding: 3px 11px; cursor: pointer; }
.md-preset:hover { color: var(--blue); border-color: var(--blue); }
.md-empty { color: var(--faint); font-size: 12.5px; padding: 6px 0 14px; }
.md-card { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; background: var(--bg2); }
.md-card.on { border-color: color-mix(in srgb, var(--blue) 55%, transparent); }
.md-row { display: flex; align-items: center; gap: 8px; }
.md-name { flex: 1; min-width: 0; }
.md-name input { width: 100%; font: inherit; font-size: 14px; font-weight: 600; color: var(--ink);
  background: transparent; border: none; border-bottom: 1px dashed transparent; padding: 2px 0; outline: none; }
.md-name input:focus { border-bottom-color: var(--line); }
.md-model { flex: none; font-size: 12px; color: var(--faint); font-family: ui-monospace, Menlo, monospace; }
.md-sp { flex: 1; }
.md-btn { font: inherit; font-size: 12px; color: var(--mut); background: transparent; border: 1px solid var(--line);
  border-radius: 8px; padding: 3px 10px; cursor: pointer; white-space: nowrap; }
.md-btn:hover { color: var(--ink); border-color: var(--mut); }
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
