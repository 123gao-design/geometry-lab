# 几何演示实验室 · Geometry Lab

交互式数学演示站：把定理做成可拖动、可实时读数的 SVG 实验台，配 KaTeX 推导，数形结合、由浅入深。技术栈 Vue 3（`<script setup>`）+ Vite 5 + vue-router 4（hash 路由）+ KaTeX；画板是手写引擎（`src/lib/board.js`），三维板支持拖拽旋转、曲面走 WebGL。现有 23 个模块、350 余章、380 余块交互画板。构建产物纯静态，可 file:// 直接打开，也可用 Tauri 2 打包成桌面应用。

## 主要内容

路由两级：`/<模块>` 是模块主页，`/<模块>/<章>` 是章节页；首页按「初等数学 / 高等数学」分两栏。首页顶部另有「数学 / 物理」两枚页签，物理在 `/physics`，自成一套目录（见下）。

**物理演示实验室（`/physics`，六个实验）**

首页点「物理」切到 `/physics`，实验页在 `/physics/<实验 id>`。刚体与接触求解走 Rapier（2D / 3D 各一份，`src/vendor/` 里的 compat 构建内联了 wasm，进实验页才加载），二维画面用 canvas 2D 自绘，三维用 three.js。每个实验的画面按窗口整幅铺开（圆角矩形、四周留一道边距），标题与二维 / 三维标记在左上，实时读数在右上，参数滑块在左下（可收起），缩放与分析、原理、暂停、重置、前后翻页在右下。二维画面可滚轮缩放、按住拖动平移、双击复原，动画滑出屏幕时用得上；三维档按住画面转视角、滚轮拉近。**鼠标停在物体上会画出受力与速度**（右下「分析」可切成常显），**「原理」面板列出物理模型、轨迹的生成方式与公式**；右下另有「速度」与「物体」两根滑块（速度 0.1×–3×、物体 50%–180%，双击各回 1× / 100%）与「悬停定格」一枚钮，碰撞、落地这类一闪而过的过程可以放慢看，物体大小按整幅画面的比例缩放，指针碰到物体时实验会停在那一刻。

| 分组 | 实验 | 路由 | 主要参数 |
| --- | --- | --- | --- |
| 经典力学 | 斜面与摩擦 | `/physics/incline` | 倾角 θ、摩擦因数 μ、质量 m、初速度 v₀ |
| 经典力学 | 一维碰撞 | `/physics/collide` | 两车质量与初速、弹性系数 e |
| 经典力学 | 三维弹跳小球 | `/physics/bounce3d` | 小球数 n、重力 g、弹性 e、摩擦因数 |
| 运动学 | 抛体运动 | `/physics/projectile` | 初速度 v₀、仰角 θ、重力 g、空气阻力、地面弹性 |
| 电磁学 | 带电粒子在磁场中 | `/physics/lorentz` | 磁感应强度 B、电场强度 E、电荷量 q、入射速度 v₀ |
| 机械振动 | 弹簧振子 | `/physics/spring` | 劲度系数 k、质量 m、阻尼系数 c、初始位移 |

实验元数据（标题、分组、简介、参数表）集中在 `src/physics/index.js`，实验本体按 id 动态 import；新增实验在那里登记一行、再写一个 `src/physics/<id>.js` 导出 `create(st)` 即可（`st` 的约定见 `CLAUDE.md`）。

**物理讲义（`/physics/ch/<章 id>`）**

实验只负责看，讲义负责讲。课程目录在 `src/physics/plan.js`（部分 → 分组 → 章三级，一章不省，未写的章标「规划中」），讲义页走 `components/PhysicsCh.vue` 的三栏骨架：左栏整份目录按部分折叠、顶部横排同组已上线的几章、右侧「本讲结构」，与数学各模块的章节页同一套版式。章号取「部分字 + 组内序号」，如力学第一章写作 力1，与图注「图 力1」对得上。

每章的行文照课本：先把概念摆清楚（定义、区别、判据），再推公式（一张 v-t 图或一次面积求和，逐步化成最终式子），然后给易错点，末尾与下一章接上。公式不只写在正文里——每章配一台「演示推导」：`src/physics/demos/` 下按章登记（`index.js` 的 `DEMOS`），演示模块导出 `create(st)` 返回 `{ frame(dt), reset? }`，画布上画出图线与实时读数，讲义里的每个式子都能在读数栏里当场核验。`st` 的约定与实验页相同，演示外壳是 `components/PhysicsDemo.vue`。

| 部分 | 已上线 | 章 |
| --- | --- | --- |
| 一 力学 | 27 | 运动学、牛顿运动定律、曲线运动、机械能与动量 |
| 二 机械振动与机械波 | 7 | 简谐运动、振动的能量、波的传播与叠加 |
| 三 热学 | 5 | 分子动理论、气体定律、理想气体、热力学 |
| 四 电磁学 | 17 | 电场、电路、磁场、电磁感应与交变电流 |
| 五 光学 | 5 | 折射、全反射、干涉、衍射与成像 |
| 六 近代物理 | 5 | 光电效应、物质波、原子结构与核物理 |
| 七 实验与测量 | 15 | 力学与电学实验、测量及数据处理 |

物理首页还提供电路实验室（`/physics/lab/circuit`），可摆放元件、自行连线并读取计算结果。

**初等数学（14 个模块，全部上线）**

| 模块 | 路由 | 章 · 板 |
| --- | --- | --- |
| 集合与常用逻辑 | `/sets` | 12 · 12 |
| 函数与微积分初步 | `/functions` | 35 · 36 |
| 不等式 | `/inequalities` | 15 · 17 |
| 三角函数与三角形 | `/trig` | 23 · 22 |
| 向量与复数 | `/vectors` | 17 · 18 |
| 数列 | `/sequences` | 20 · 23 |
| 直线与圆 | `/linecircle` | 13 · 16 |
| 极坐标与参数方程 | `/polar` | 9 · 10 |
| 圆锥曲线 | `/conics` | 32 · 42 |
| 立体几何 | `/solid` | 10 · 14 |
| 组合学与二项式定理 | `/combinatorics` | 9 · 9 |
| 概率与统计 | `/probability` | 18 · 22 |
| 数值计算 | `/numeric` | 10 · 10 |
| 线性代数初步 | `/linalg` | 14 · 14 |

**高等数学（9 个模块，全部上线）**

| 模块 | 路由 | 章 · 板 |
| --- | --- | --- |
| 一元函数微积分 | `/calc1` | 33 · 36 |
| 空间解析几何 | `/spacegeom` | 12 · 12 |
| 多元函数微积分 | `/calc2` | 18 · 20 |
| 复变函数 | `/complexvar` | 12 · 12 |
| 初等数论 | `/numtheory` | 13 · 13 |
| 拓扑学基础 | `/topology` | 12 · 12 |
| 分形几何 | `/fractal` | 11 · 11 |
| 高等几何（射影几何） | `/projgeom` | 11 · 11 |
| 抽象代数 | `/algebra` | 17 · 17 |

**工具页**：`/cheatsheet` 定理速查（23 个模块 376 条核心结论，卡片即章节内链）、`/playground` 自托管 GeoGebra 自由画板（离线可用，章节画板可带参数跳入）、`/notes` 笔记（md / LaTeX 两格式，可存进所选文件夹）、`/games` 数字游戏（24 点、华容道、速算、猜数字、2048、数独）、`/calendar` 日历 · 待办（月视图 + 当日清单，格内带农历与节日，本机保存、可导出 JSON）、`/settings` 设置。站务另有三页：`/about` 关于本站、`/guide` 使用说明、`/changelog` 更新日志，入口在页脚。站点另有全站搜索（Ctrl+K，覆盖 409 章与 376 条速查）、AI 助手、随页笔记、可拖计算器、阅读进度、八套配色主题与可打印讲义。

## 目录结构

```
geometry-lab/
├── index.html                    # Vite 入口模板
├── vite.config.js                # base:'./'，构建产物离线可用
├── .npmrc                        # npmmirror 镜像
├── public/                       # favicon、自托管 GeoGebra 运行时（ggb/，约 69 MB）、板内文字默认位置档
├── scripts/gen-icon.mjs          # 桌面端图标生成器（零依赖，npm run icon）
├── .github/workflows/release.yml # 发版 CI：推 v* 标签，三平台矩阵出安装包
├── src-tauri/                    # 桌面壳（Tauri 2）：tauri.conf.json、Cargo.toml、capabilities/
└── src/
    ├── main.js                   # 入口：先初始化主题与光影再挂载
    ├── router.js                 # hash 路由：/<模块> 与 /<模块>/<章> 两级
    ├── App.vue                   # 顶栏、浮钮与助手 / 画板 / 笔记小窗的挂载点
    ├── styles/global.css         # 八套主题变量与全站版式
    ├── lib/                      # 引擎与数据仓库
    │   ├── board.js              # 画板引擎：SVG 绘制、把手拖动、滑块/按钮/徽章控件、缩放与浮层、PNG/视频导出（re-export math.js）
    │   ├── solid3d.js            # 三维画板：正交投影、按深度排序、拖拽旋转
    │   ├── gl3d.js               # 三维曲面的 WebGL 层（three 动态加载，失败退回 SVG 线网）
    │   ├── record.js             # 画板录像（MediaRecorder，零依赖）
    │   ├── ggb.js                # GeoGebra 出口：章节画板带参数跳进自由画板
    │   ├── mdmini.js             # 轻量 Markdown + KaTeX 渲染（聊天与笔记共用）
    │   └── …                     # progress 阅读进度 / modnav 大纲 / settings 偏好 / notes 笔记 / chat 对话 / calc 计算器 / chaos 背景动画 等
    ├── components/               # Katex（公式）、BoardMount（画板挂载）、ChPage（章节页三栏骨架）、
    │                             # ChatDock（AI 助手）、NotesDock（随页笔记）、GeoGebraApp/Dock（自由画板）、
    │                             # FloatRail（左侧浮钮）、CalcDock（计算器）、Breadcrumb（面包屑）等
    ├── boards/                   # 每台实验台一个文件：boards/<模块>/<子专题>/<图>.js，导出 createBoard(root) → Board
    └── views/                    # 与 boards 同构：views/<模块>/<子专题>/<章>.vue，每组一个 xxxnav.js 章节元数据
```

## 运行

需要 Node.js ≥ 18。本机无系统 node 且无 sudo 时装用户级的：

```bash
# 用户级安装 node（已有可跳过）
mkdir -p ~/apps && cd ~/apps
curl -sL -o node.tar.xz https://registry.npmmirror.com/-/binary/node/v22.20.0/node-v22.20.0-linux-x64.tar.xz
tar -xJf node.tar.xz && rm node.tar.xz && ln -sfn ~/apps/node-v22.20.0-linux-x64 ~/apps/node
export PATH="$HOME/apps/node/bin:$PATH"   # 建议写进 ~/.bashrc
```

然后：

```bash
cd geometry-lab
npm install        # 依赖已配置 npmmirror 镜像（见 .npmrc）
npm run dev        # 开发服务器，默认 http://localhost:5173
npm run build      # 产出 dist/ —— 纯静态，可 file:// 直接打开（hash 路由 + base:'./'）
npm run preview    # 本地预览构建产物
```

## 网页版部署（GitHub Pages）

站点是纯静态的，往 GitHub 上推就能在线开：`.github/workflows/pages.yml` 在 `main` 分支每次推送时 `npm ci && npm run build`，把 `dist/` 作为 Pages 站点发布，也可以到 Actions 页面手动跑一次。

一次性设置：仓库 **Settings → Pages → Source** 选 **GitHub Actions**（选分支那种方式不行，产物是 Actions 传上去的）。之后的地址是 `https://<用户名>.github.io/geometry-lab/`。

hash 路由让它部署在子路径下也不用改配置（`vite.config.js` 的 `base:'./'`），刷新任何一页都还落在 `index.html`，不需要 404 兜底。`public/` 里的 GeoGebra 套件会一起进站点（约 70 MB），首次发布会慢一点。

**换到线上域名时注意**：笔记、偏好、画板文字位置都存在 localStorage，按站点 origin 分开存，`localhost:5173` 里的那些不会跟着过来。搬笔记用笔记页侧栏的「⇪ 备份」，到线上再「⇩ 导入」；偏好与文字位置在设置页重新调一次即可。

## 桌面端（Tauri 2）

同一份 Vite 产物装进系统 WebView，不打 Chromium。本地跑 `npm run icon` 生成图标（`scripts/gen-icon.mjs`，零依赖），再 `npm run tauri dev` / `npm run tauri build`（需 Rust 工具链）。发版走 CI：推一个 `v*` 标签，`.github/workflows/release.yml` 在 windows / macos(arm+x64) / ubuntu 矩阵上出安装包挂到 draft Release——Windows 是 NSIS `-setup.exe`，macOS 按芯片选 `.dmg`，Linux 出 `.deb` 与 `.AppImage`。配置见 `src-tauri/tauri.conf.json`。

---

更详细的约定（版式、画板引擎 API、内容风格、扩展步骤、已知坑）见 [`CLAUDE.md`](CLAUDE.md)。

画板问题、视觉方案与验收条件见[交互画板评审与改进记录](docs/visualization-review.md)。
