# 几何演示实验室 · Geometry Lab

交互式数学演示站：把定理做成可拖动、可实时读数的 SVG 实验台，配 KaTeX 推导，数形结合、由浅入深。技术栈 Vue 3（`<script setup>`）+ Vite 5 + vue-router 4（hash 路由）+ KaTeX；画板是手写引擎（`src/lib/board.js`），三维板支持拖拽旋转、曲面走 WebGL。现有 23 个模块、350 余章、380 余台实验台。构建产物纯静态，可 file:// 直接打开，也可用 Tauri 2 打包成桌面应用。

## 主要内容

路由两级：`/<模块>` 是模块主页，`/<模块>/<章>` 是章节页；首页按「初等数学 / 高等数学」分两栏。

**初等数学（14 个模块，全部上线）**

| 模块 | 路由 | 章 · 台 |
| --- | --- | --- |
| 集合与常用逻辑 | `/sets` | 12 · 12 |
| 函数与微积分初步 | `/functions` | 35 · 35 |
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

| 模块 | 路由 | 章 · 台 |
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

**工具页**：`/cheatsheet` 定理速查（23 个模块 376 条核心结论，卡片即章节内链）、`/playground` 自托管 GeoGebra 自由画板（离线可用，章节画板可带参数跳入）、`/notes` 笔记（md / LaTeX 两格式，可存进所选文件夹）、`/games` 数字游戏（24 点、华容道、速算、猜数字、2048、数独）、`/settings` 设置。站点另有全站搜索（Ctrl+K，覆盖 409 章与 376 条速查）、AI 助手、随页笔记、可拖计算器、阅读进度、八套配色主题与可打印讲义。

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
