import Home from './views/Home.vue';
// 模块一 · 集合与常用逻辑
const SetsHome = () => import('./views/sets/SetsHome.vue');
// 子专题一 · 集合的语言
const J1 = () => import('./views/sets/lang/j1.vue');
const J2 = () => import('./views/sets/lang/j2.vue');
// 子专题二 · 集合间的关系
const X1 = () => import('./views/sets/rel/x1.vue');
const X2 = () => import('./views/sets/rel/x2.vue');
// 子专题三 · 集合的运算
const Y1 = () => import('./views/sets/ops/y1.vue');
const Y2 = () => import('./views/sets/ops/y2.vue');
const Y3 = () => import('./views/sets/ops/y3.vue');
const Y4 = () => import('./views/sets/ops/y4.vue');
const O1 = () => import('./views/sets/logic/o1.vue');
const O2 = () => import('./views/sets/logic/o2.vue');
const O3 = () => import('./views/sets/logic/o3.vue');
const O4 = () => import('./views/sets/logic/o4.vue');
// 模块 · 三角函数与三角形（阶段一：任意角与弧度制 B、任意角的三角函数 U）
const TrigHome = () => import('./views/trig/TrigHome.vue');
// 子专题一 · 任意角与弧度制
const TB1 = () => import('./views/trig/angle/b1.vue');
const TB2 = () => import('./views/trig/angle/b2.vue');
// 子专题二 · 任意角的三角函数
const TU1 = () => import('./views/trig/unit/u1.vue');
const TU2 = () => import('./views/trig/unit/u2.vue');
// 子专题三 · 诱导公式
const TI1 = () => import('./views/trig/induce/i1.vue');
const TI2 = () => import('./views/trig/induce/i2.vue');
const TW1 = () => import('./views/trig/graph/w1.vue');
const TW2 = () => import('./views/trig/graph/w2.vue');
const TW3 = () => import('./views/trig/graph/w3.vue');
const TF1 = () => import('./views/trig/trans/f1.vue');
const TF2 = () => import('./views/trig/trans/f2.vue');
// 子专题六 · 和差公式
const TM1 = () => import('./views/trig/sumdiff/m1.vue');
// 子专题七 · 倍角与升降幂
const TN1 = () => import('./views/trig/double/n1.vue');
const TN2 = () => import('./views/trig/double/n2.vue');
// 子专题八 · 积化和差与辅助角
const TQ1 = () => import('./views/trig/prodsum/q1.vue');
const TQ2 = () => import('./views/trig/prodsum/q2.vue');
const TH1 = () => import('./views/trig/inverse/h1.vue');
const TH2 = () => import('./views/trig/inverse/h2.vue');
// 子专题十 · 解三角形
const TZ1 = () => import('./views/trig/solve/z1.vue');
const TZ2 = () => import('./views/trig/solve/z2.vue');
const TZ3 = () => import('./views/trig/solve/z3.vue');
// 子专题十一 · 综合应用
const TK1 = () => import('./views/trig/synth/k1.vue');
const TK2 = () => import('./views/trig/synth/k2.vue');
const ConicsHome = () => import('./views/conics/ConicsHome.vue');
// 子专题六 · 极点极线与配极理论
const Ch1 = () => import('./views/conics/projective/ch1.vue');
const Ch2 = () => import('./views/conics/projective/ch2.vue');
const Ch3 = () => import('./views/conics/projective/ch3.vue');
const Ch4 = () => import('./views/conics/projective/ch4.vue');
const Ch5 = () => import('./views/conics/projective/ch5.vue');
const Ch6 = () => import('./views/conics/projective/ch6.vue');
const Ch7 = () => import('./views/conics/projective/ch7.vue');
// 子专题一 · 圆锥曲线的定义与标准方程
const Def1 = () => import('./views/conics/definitions/def1.vue');
const Def2 = () => import('./views/conics/definitions/def2.vue');
const Def3 = () => import('./views/conics/definitions/def3.vue');
const Def4 = () => import('./views/conics/definitions/def4.vue');
const Def5 = () => import('./views/conics/definitions/def5.vue');
// 子专题二 · 光学性质与切线
const Opt1 = () => import('./views/conics/optics/opt1.vue');
const Opt2 = () => import('./views/conics/optics/opt2.vue');
const Opt3 = () => import('./views/conics/optics/opt3.vue');
const Opt4 = () => import('./views/conics/optics/opt4.vue');
// 子专题三 · 仿射变换看圆锥曲线
const Aff1 = () => import('./views/conics/affine/aff1.vue');
const Aff2 = () => import('./views/conics/affine/aff2.vue');
const Aff3 = () => import('./views/conics/affine/aff3.vue');
const Aff4 = () => import('./views/conics/affine/aff4.vue');
const Aff5 = () => import('./views/conics/affine/aff5.vue');
const Aff6 = () => import('./views/conics/affine/aff6.vue');
// 子专题四 · 参数方程与轨迹
const Par1 = () => import('./views/conics/locus/par1.vue');
const Par2 = () => import('./views/conics/locus/par2.vue');
const Par3 = () => import('./views/conics/locus/par3.vue');
const Par4 = () => import('./views/conics/locus/par4.vue');
const Par5 = () => import('./views/conics/locus/par5.vue');
// 子专题五 · 直线与圆锥曲线
const Lin1 = () => import('./views/conics/lines/lin1.vue');
const Lin2 = () => import('./views/conics/lines/lin2.vue');
const Lin3 = () => import('./views/conics/lines/lin3.vue');
const Lin4 = () => import('./views/conics/lines/lin4.vue');
const Lin5 = () => import('./views/conics/lines/lin5.vue');
// 模块二 · 函数与微积分初步（原「函数与导数」，2026-11-05 更名；路由 /functions 不变）
const FunctionsHome = () => import('./views/functions/FunctionsHome.vue');
// 子专题一 · 从映射到函数
const C1 = () => import('./views/functions/concept/c1.vue');
const C2 = () => import('./views/functions/concept/c2.vue');
const C3 = () => import('./views/functions/concept/c3.vue');
const C4 = () => import('./views/functions/concept/c4.vue');
const C5 = () => import('./views/functions/concept/c5.vue');
// 子专题二 · 函数的基本性质
const S1 = () => import('./views/functions/properties/s1.vue');
const S2 = () => import('./views/functions/properties/s2.vue');
const S3 = () => import('./views/functions/properties/s3.vue');
const S4 = () => import('./views/functions/properties/s4.vue');
const S5 = () => import('./views/functions/properties/s5.vue');
const S6 = () => import('./views/functions/properties/s6.vue');
const S7 = () => import('./views/functions/properties/s7.vue');
// 子专题三 · 零点与存在性定理
const R1 = () => import('./views/functions/zeros/r1.vue');
const R2 = () => import('./views/functions/zeros/r2.vue');
const R3 = () => import('./views/functions/zeros/r3.vue');
const R4 = () => import('./views/functions/zeros/r4.vue');
// 根分布已并入 E2（基本初等函数），R 系列止于 R4
// 子专题四 · 基本初等函数
const E1 = () => import('./views/functions/elementary/e1.vue');
const E2 = () => import('./views/functions/elementary/e2.vue');
const E3 = () => import('./views/functions/elementary/e3.vue');
const E4 = () => import('./views/functions/elementary/e4.vue');
const E5 = () => import('./views/functions/elementary/e5.vue');
const E6 = () => import('./views/functions/elementary/e6.vue');
const E7 = () => import('./views/functions/elementary/e7.vue');
const E8 = () => import('./views/functions/elementary/e8.vue');
// 子专题五 · 图象变换
const G1 = () => import('./views/functions/transforms/g1.vue');
const G2 = () => import('./views/functions/transforms/g2.vue');
const G3 = () => import('./views/functions/transforms/g3.vue');
// 子专题六 · 变化率与导数
const V1 = () => import('./views/functions/calculus/v1.vue');
const V2 = () => import('./views/functions/calculus/v2.vue');
const V3 = () => import('./views/functions/calculus/v3.vue');
const V4 = () => import('./views/functions/calculus/v4.vue');
const V5 = () => import('./views/functions/calculus/v5.vue');
const V6 = () => import('./views/functions/calculus/v6.vue');
const V7 = () => import('./views/functions/calculus/v7.vue');
const V8 = () => import('./views/functions/calculus/v8.vue');
// 模块 · 不等式
const IneqHome = () => import('./views/inequalities/IneqHome.vue');
// 子专题一 · 性质与比较
const IP1 = () => import('./views/inequalities/prop/p1.vue');
const IP2 = () => import('./views/inequalities/prop/p2.vue');
// 子专题二 · 一元二次不等式
const IQ1 = () => import('./views/inequalities/quad/q1.vue');
const IQ2 = () => import('./views/inequalities/quad/q2.vue');
const IQ3 = () => import('./views/inequalities/quad/q3.vue');
// 子专题三 · 基本不等式
const IG1 = () => import('./views/inequalities/basic/g1.vue');
const IG2 = () => import('./views/inequalities/basic/g2.vue');
const IG3 = () => import('./views/inequalities/basic/g3.vue');
// 子专题四 · 放缩与常用不等式
const IF1 = () => import('./views/inequalities/scale/f1.vue');
const IF2 = () => import('./views/inequalities/scale/f2.vue');
const IF3 = () => import('./views/inequalities/scale/f3.vue');
// 子专题五 · 简单线性规划
const IL1 = () => import('./views/inequalities/plan/l1.vue');
const IL2 = () => import('./views/inequalities/plan/l2.vue');
const IL3 = () => import('./views/inequalities/plan/l3.vue');
const IL4 = () => import('./views/inequalities/plan/l4.vue');
// 模块 · 向量与复数
const VectorsHome = () => import('./views/vectors/VectorsHome.vue');
// 子专题一 · 平面向量的概念与线性运算
const VX1 = () => import('./views/vectors/linear/x1.vue');
const VX2 = () => import('./views/vectors/linear/x2.vue');
const VX3 = () => import('./views/vectors/linear/x3.vue');
// 子专题二 · 平面向量基本定理与坐标运算
const VB1 = () => import('./views/vectors/basis/b1.vue');
const VB2 = () => import('./views/vectors/basis/b2.vue');
const VB3 = () => import('./views/vectors/basis/b3.vue');
// 子专题三 · 数量积与度量
const VI1 = () => import('./views/vectors/inner/i1.vue');
const VI2 = () => import('./views/vectors/inner/i2.vue');
const VI3 = () => import('./views/vectors/inner/i3.vue');
const VI4 = () => import('./views/vectors/inner/i4.vue');
// 子专题四 · 向量的应用
const VY1 = () => import('./views/vectors/apply/a1.vue');
const VY2 = () => import('./views/vectors/apply/a2.vue');
// 子专题五 · 复数
const VC1 = () => import('./views/vectors/complex/c1.vue');
const VC2 = () => import('./views/vectors/complex/c2.vue');
const VC3 = () => import('./views/vectors/complex/c3.vue');
// 子专题六 · 三角形式与欧拉公式
const VE1 = () => import('./views/vectors/euler/o1.vue');
const VE2 = () => import('./views/vectors/euler/o2.vue');
// 模块 · 直线与圆
const LineCircleHome = () => import('./views/linecircle/LineCircleHome.vue');
const LCL1 = () => import('./views/linecircle/line/l1.vue');
const LCL2 = () => import('./views/linecircle/line/l2.vue');
const LCL3 = () => import('./views/linecircle/line/l3.vue');
const LCL4 = () => import('./views/linecircle/line/l4.vue');
// 子专题二 · 圆的方程
const LCC1 = () => import('./views/linecircle/circle/c1.vue');
const LCC2 = () => import('./views/linecircle/circle/c2.vue');
const LCC3 = () => import('./views/linecircle/circle/c3.vue');
// 子专题三 · 圆的性质与定理
const LCT1 = () => import('./views/linecircle/theorem/t1.vue');
const LCT2 = () => import('./views/linecircle/theorem/t2.vue');
const LCT3 = () => import('./views/linecircle/theorem/t3.vue');
const LCT4 = () => import('./views/linecircle/theorem/t4.vue');
// 子专题四 · 综合应用
const LCA1 = () => import('./views/linecircle/apply/z1.vue');
const LCA2 = () => import('./views/linecircle/apply/z2.vue');
const PolarHome = () => import('./views/polar/PolarHome.vue');
// 子专题一 · 极坐标系与互化
const PJ1 = () => import('./views/polar/coords/j1.vue');
const PJ2 = () => import('./views/polar/coords/j2.vue');
// 子专题二 · 曲线的极坐标方程
const PQ1 = () => import('./views/polar/curves/q1.vue');
const PQ2 = () => import('./views/polar/curves/q2.vue');
// 子专题三 · 参数方程
const PS1 = () => import('./views/polar/param/s1.vue');
const PS2 = () => import('./views/polar/param/s2.vue');
const PS3 = () => import('./views/polar/param/s3.vue');
const PG1 = () => import('./views/polar/apply/g1.vue');
const PG2 = () => import('./views/polar/apply/g2.vue');
// 模块 · 立体几何（子专题一、二、三与标1 已上线）
const SolidHome = () => import('./views/solid/SolidHome.vue');
// 子专题一 · 认识空间几何体
const SR1 = () => import('./views/solid/recog/r1.vue');
const SR2 = () => import('./views/solid/recog/r2.vue');
// 子专题二 · 体积与表面积
const SM1 = () => import('./views/solid/measure/m1.vue');
const SM2 = () => import('./views/solid/measure/m2.vue');
const SM3 = () => import('./views/solid/measure/m3.vue');
// 子专题三 · 空间中的位置关系
const SW1 = () => import('./views/solid/relation/p1.vue');
const SW2 = () => import('./views/solid/relation/p2.vue');
// 子专题四 · 空间直角坐标系
const SC1 = () => import('./views/solid/coords/c1.vue');
const SC2 = () => import('./views/solid/coords/c2.vue');
const SC3 = () => import('./views/solid/coords/c3.vue');
// 模块 · 数列
const SequencesHome = () => import('./views/sequences/SequencesHome.vue');
// 子专题一 · 数列的概念与表示
const SQ1 = () => import('./views/sequences/concept/s1.vue');
const SQ2 = () => import('./views/sequences/concept/s2.vue');
const SQ3 = () => import('./views/sequences/concept/s3.vue');
// 子专题二 · 等差数列
const DQ1 = () => import('./views/sequences/diff/d1.vue');
const DQ2 = () => import('./views/sequences/diff/d2.vue');
const DQ3 = () => import('./views/sequences/diff/d3.vue');
// 子专题三 · 等比数列
const GQ1 = () => import('./views/sequences/geo/g1.vue');
const GQ2 = () => import('./views/sequences/geo/g2.vue');
const GQ3 = () => import('./views/sequences/geo/g3.vue');
// 子专题四 · 数列求和的方法
const HQ1 = () => import('./views/sequences/sum/h1.vue');
const HQ2 = () => import('./views/sequences/sum/h2.vue');
const HQ3 = () => import('./views/sequences/sum/h3.vue');
// 子专题五 · 递推与构造
const RQ1 = () => import('./views/sequences/recur/r1.vue');
const RQ2 = () => import('./views/sequences/recur/r2.vue');
const RQ3 = () => import('./views/sequences/recur/r3.vue');
const RQ4 = () => import('./views/sequences/recur/r4.vue');
// 子专题六 · 数学归纳法
const IN1 = () => import('./views/sequences/induct/i1.vue');
const IN2 = () => import('./views/sequences/induct/i2.vue');
// 子专题七 · 数列的应用
const UQ1 = () => import('./views/sequences/apply/u1.vue');
const UQ2 = () => import('./views/sequences/apply/u2.vue');
// 模块 · 组合学与二项式定理
const CombinatoricsHome = () => import('./views/combinatorics/CombinatoricsHome.vue');
// 子专题一 · 计数原理
const CC1 = () => import('./views/combinatorics/counting/c1.vue');
const CC2 = () => import('./views/combinatorics/counting/c2.vue');
// 子专题二 · 排列与组合
const CP1 = () => import('./views/combinatorics/permcomb/p1.vue');
const CP2 = () => import('./views/combinatorics/permcomb/p2.vue');
// 子专题三 · 二项式定理
const CB1 = () => import('./views/combinatorics/binomial/b1.vue');
const CB2 = () => import('./views/combinatorics/binomial/b2.vue');
const CB3 = () => import('./views/combinatorics/binomial/b3.vue');
// 子专题四 · 组合恒等式与应用
const CI1 = () => import('./views/combinatorics/identity/i1.vue');
const CI2 = () => import('./views/combinatorics/identity/i2.vue');
// 模块 · 概率与统计
const ProbabilityHome = () => import('./views/probability/ProbabilityHome.vue');
// 子专题一 · 随机事件与概率
const PB1 = () => import('./views/probability/sample/g1.vue');
const PB2 = () => import('./views/probability/sample/g2.vue');
// 子专题二 · 条件概率与独立性
const PC1 = () => import('./views/probability/cond/c1.vue');
const PC2 = () => import('./views/probability/cond/c2.vue');
const PC3 = () => import('./views/probability/cond/c3.vue');
// 子专题三 · 随机变量及其分布
const PR1 = () => import('./views/probability/rv/r1.vue');
const PR2 = () => import('./views/probability/rv/r2.vue');
const PR3 = () => import('./views/probability/rv/r3.vue');
const PR4 = () => import('./views/probability/rv/r4.vue');
// 子专题四 · 数字特征
const PN1 = () => import('./views/probability/num/n1.vue');
const PN2 = () => import('./views/probability/num/n2.vue');
const PN3 = () => import('./views/probability/num/n3.vue');
// 子专题五 · 统计
const PT1 = () => import('./views/probability/stat/t1.vue');
const PT2 = () => import('./views/probability/stat/t2.vue');
const PT3 = () => import('./views/probability/stat/t3.vue');
// 子专题六 · 统计检验
const PTJ1 = () => import('./views/probability/test/j1.vue');
const PTJ2 = () => import('./views/probability/test/j2.vue');
const PTJ3 = () => import('./views/probability/test/j3.vue');
// 模块 · 数值计算
const NumericHome = () => import('./views/numeric/NumericHome.vue');
// 子专题一 · 误差
const NE1 = () => import('./views/numeric/error/e1.vue');
const NE2 = () => import('./views/numeric/error/e2.vue');
// 子专题二 · 方程求根
const NI1 = () => import('./views/numeric/root/i1.vue');
const NI2 = () => import('./views/numeric/root/i2.vue');
const NI3 = () => import('./views/numeric/root/i3.vue');
// 子专题三 · 数据拟合
const NF1 = () => import('./views/numeric/fit/f1.vue');
const NF2 = () => import('./views/numeric/fit/f2.vue');
// 子专题四 · 函数逼近
const NA1 = () => import('./views/numeric/approx/a1.vue');
const NA2 = () => import('./views/numeric/approx/a2.vue');
const NA3 = () => import('./views/numeric/approx/a3.vue');
// 模块 · 线性代数初步
const LinalgHome = () => import('./views/linalg/LinalgHome.vue');
// 子专题一 · 行列式
const LD1 = () => import('./views/linalg/det/d1.vue');
const LD2 = () => import('./views/linalg/det/d2.vue');
// 子专题二 · 矩阵
const LM1 = () => import('./views/linalg/matrix/m1.vue');
const LM2 = () => import('./views/linalg/matrix/m2.vue');
const LM3 = () => import('./views/linalg/matrix/m3.vue');
// 子专题三 · 矩阵与空间
const LS1 = () => import('./views/linalg/space/s1.vue');
const LS2 = () => import('./views/linalg/space/s2.vue');
const LS3 = () => import('./views/linalg/space/s3.vue');
// 子专题四 · 特征值
const LE1 = () => import('./views/linalg/eigen/e1.vue');
const LE2 = () => import('./views/linalg/eigen/e2.vue');
const LE3 = () => import('./views/linalg/eigen/e3.vue');
// 子专题五 · 二次型
const LQ1 = () => import('./views/linalg/quad/q1.vue');
const LQ2 = () => import('./views/linalg/quad/q2.vue');
const LQ3 = () => import('./views/linalg/quad/q3.vue');
// 定理速查总览
const CheatSheet = () => import('./views/CheatSheet.vue');
const Playground = () => import('./views/Playground.vue');
const PlaygroundAbout = () => import('./views/PlaygroundAbout.vue');
const PlaygroundGuide = () => import('./views/PlaygroundGuide.vue');
const Settings = () => import('./views/Settings.vue');
const Notes = () => import('./views/Notes.vue');
// 数字游戏（24 点 / 数字华容道 / 60 秒速算 / 猜数字），入口在左侧竖排圆按钮
const Games = () => import('./views/Games.vue');
// 游戏子页：2048（边长可选）与数独，入口是游戏页顶部的页签
const Games2048 = () => import('./views/Games2048.vue');
const GamesSudoku = () => import('./views/GamesSudoku.vue');
// 日历 · 待办（月视图 + 当日清单），入口在左侧竖排圆按钮与首页工具卡
const Calendar = () => import('./views/Calendar.vue');
// 站务三页：关于本站 / 使用说明 / 更新日志，入口在页脚
const About = () => import('./views/About.vue');
const Guide = () => import('./views/Guide.vue');
const Changelog = () => import('./views/Changelog.vue');
// 高等数学 · 一元函数微积分（已开写）
const Calc1Home = () => import('./views/calc1/Calc1Home.vue');
const SpacegeomHome = () => import('./views/spacegeom/SpacegeomHome.vue');
// 高等数学 · 多元函数微积分
const Calc2Home = () => import('./views/calc2/Calc2Home.vue');
const CM1 = () => import('./views/calc2/mul/m1.vue');
const CM2 = () => import('./views/calc2/mul/m2.vue');
const CM3 = () => import('./views/calc2/mul/m3.vue');
const CM4 = () => import('./views/calc2/mul/m4.vue');
const CM5 = () => import('./views/calc2/mul/m5.vue');
const CM6 = () => import('./views/calc2/mul/m6.vue');
const CR1 = () => import('./views/calc2/riemann/r1.vue');
const CR2 = () => import('./views/calc2/riemann/r2.vue');
const CR3 = () => import('./views/calc2/riemann/r3.vue');
const CR4 = () => import('./views/calc2/riemann/r4.vue');
const CR5 = () => import('./views/calc2/riemann/r5.vue');
const CR6 = () => import('./views/calc2/riemann/r6.vue');
const MC1 = () => import('./views/calc2/curve/c1.vue');
const MC2 = () => import('./views/calc2/curve/c2.vue');
const MC3 = () => import('./views/calc2/curve/c3.vue');
const MC4 = () => import('./views/calc2/curve/c4.vue');
const MC5 = () => import('./views/calc2/curve/c5.vue');
const MC6 = () => import('./views/calc2/curve/c6.vue');
const ComplexvarHome = () => import('./views/complexvar/ComplexvarHome.vue');
const CV1 = () => import('./views/complexvar/cplx/c1.vue');
const CV2 = () => import('./views/complexvar/cplx/c2.vue');
const CV3 = () => import('./views/complexvar/cplx/c3.vue');
const CW1 = () => import('./views/complexvar/analytic/a1.vue');
const CW2 = () => import('./views/complexvar/analytic/a2.vue');
const CW3 = () => import('./views/complexvar/analytic/a3.vue');
const CW4 = () => import('./views/complexvar/analytic/a4.vue');
const CY1 = () => import('./views/complexvar/series/s1.vue');
const CY2 = () => import('./views/complexvar/series/s2.vue');
const CY3 = () => import('./views/complexvar/series/s3.vue');
const CY4 = () => import('./views/complexvar/series/s4.vue');
const CY5 = () => import('./views/complexvar/series/s5.vue');
const NumtheoryHome = () => import('./views/numtheory/NumtheoryHome.vue');
const NZ1 = () => import('./views/numtheory/basic/z1.vue');
const NZ2 = () => import('./views/numtheory/basic/z2.vue');
const NZ3 = () => import('./views/numtheory/basic/z3.vue');
const NZ4 = () => import('./views/numtheory/basic/z4.vue');
const ND1 = () => import('./views/numtheory/theorem/d1.vue');
const ND2 = () => import('./views/numtheory/theorem/d2.vue');
const ND3 = () => import('./views/numtheory/theorem/d3.vue');
const ND4 = () => import('./views/numtheory/theorem/d4.vue');
const ND5 = () => import('./views/numtheory/theorem/d5.vue');
const NS1 = () => import('./views/numtheory/residue/s1.vue');
const NS2 = () => import('./views/numtheory/residue/s2.vue');
const NS3 = () => import('./views/numtheory/residue/s3.vue');
const NS4 = () => import('./views/numtheory/residue/s4.vue');
// 高等数学 · 拓扑学基础（已开写）
const TopologyHome = () => import('./views/topology/TopologyHome.vue');
// 子专题一 · 拓扑空间（5 章）
const TS1 = () => import('./views/topology/space/s1.vue');
const TS2 = () => import('./views/topology/space/s2.vue');
const TS3 = () => import('./views/topology/space/s3.vue');
const TS4 = () => import('./views/topology/space/s4.vue');
const TS5 = () => import('./views/topology/space/s5.vue');
// 子专题二 · 连通与紧致（4 章）
const TC1 = () => import('./views/topology/compact/c1.vue');
const TC2 = () => import('./views/topology/compact/c2.vue');
const TC3 = () => import('./views/topology/compact/c3.vue');
const TC4 = () => import('./views/topology/compact/c4.vue');
// 子专题三 · 不变量初步（3 章）
const TV1 = () => import('./views/topology/invariant/v1.vue');
const TV2 = () => import('./views/topology/invariant/v2.vue');
const TV3 = () => import('./views/topology/invariant/v3.vue');
// 高等数学 · 分形几何
const FractalHome = () => import('./views/fractal/FractalHome.vue');
const FRD1 = () => import('./views/fractal/dim/d1.vue');
const FRD2 = () => import('./views/fractal/dim/d2.vue');
const FRD3 = () => import('./views/fractal/dim/d3.vue');
const FRD4 = () => import('./views/fractal/dim/d4.vue');
const FRS1 = () => import('./views/fractal/shape/s1.vue');
const FRS2 = () => import('./views/fractal/shape/s2.vue');
const FRS3 = () => import('./views/fractal/shape/s3.vue');
const FRS4 = () => import('./views/fractal/shape/s4.vue');
const FRG1 = () => import('./views/fractal/gen/g1.vue');
const FRG2 = () => import('./views/fractal/gen/g2.vue');
const FRG3 = () => import('./views/fractal/gen/g3.vue');
// 高等数学 · 高等几何（射影几何）
const ProjgeomHome = () => import('./views/projgeom/ProjgeomHome.vue');
const PJP1 = () => import('./views/projgeom/plane/p1.vue');
const PJP2 = () => import('./views/projgeom/plane/p2.vue');
const PJP3 = () => import('./views/projgeom/plane/p3.vue');
const PJP4 = () => import('./views/projgeom/plane/p4.vue');
const PJP5 = () => import('./views/projgeom/plane/p5.vue');
const PJC1 = () => import('./views/projgeom/conic/c1.vue');
const PJC2 = () => import('./views/projgeom/conic/c2.vue');
const PJC3 = () => import('./views/projgeom/conic/c3.vue');
const PJG1 = () => import('./views/projgeom/group/g1.vue');
const PJG2 = () => import('./views/projgeom/group/g2.vue');
const PJG3 = () => import('./views/projgeom/group/g3.vue');
// 高等数学 · 抽象代数
const AlgebraHome = () => import('./views/algebra/AlgebraHome.vue');
const ALS1 = () => import('./views/algebra/struct/s1.vue');
const ALS2 = () => import('./views/algebra/struct/s2.vue');
const ALS3 = () => import('./views/algebra/struct/s3.vue');
const ALS4 = () => import('./views/algebra/struct/s4.vue');
const ALG1 = () => import('./views/algebra/groupt/g1.vue');
const ALG2 = () => import('./views/algebra/groupt/g2.vue');
const ALG3 = () => import('./views/algebra/groupt/g3.vue');
const ALG4 = () => import('./views/algebra/groupt/g4.vue');
const ALG5 = () => import('./views/algebra/groupt/g5.vue');
const ALG6 = () => import('./views/algebra/groupt/g6.vue');
const ALG7 = () => import('./views/algebra/groupt/g7.vue');
const ALN1 = () => import('./views/algebra/graph/n1.vue');
const ALN2 = () => import('./views/algebra/graph/n2.vue');
const ALN3 = () => import('./views/algebra/graph/n3.vue');
const ALN4 = () => import('./views/algebra/graph/n4.vue');
const ALN5 = () => import('./views/algebra/graph/n5.vue');
const ALN6 = () => import('./views/algebra/graph/n6.vue');
const CL1 = () => import('./views/calc1/limit/l1.vue');
const CL2 = () => import('./views/calc1/limit/l2.vue');
const CL3 = () => import('./views/calc1/limit/l3.vue');
const CL4 = () => import('./views/calc1/limit/l4.vue');
const CL5 = () => import('./views/calc1/limit/l5.vue');
// 子专题二 · 导数与微分（8 章）
const CD1 = () => import('./views/calc1/deriv/d1.vue');
const CD2 = () => import('./views/calc1/deriv/d2.vue');
const CD3 = () => import('./views/calc1/deriv/d3.vue');
const CD4 = () => import('./views/calc1/deriv/d4.vue');
const CD5 = () => import('./views/calc1/deriv/d5.vue');
const CD6 = () => import('./views/calc1/deriv/d6.vue');
const CD7 = () => import('./views/calc1/deriv/d7.vue');
const CD8 = () => import('./views/calc1/deriv/d8.vue');
// 子专题三 · 不定积分（4 章）
const CU1 = () => import('./views/calc1/integral/i1.vue');
const CU2 = () => import('./views/calc1/integral/i2.vue');
const CU3 = () => import('./views/calc1/integral/i3.vue');
const CU4 = () => import('./views/calc1/integral/i4.vue');
// 子专题四 · 定积分（5 章）
const CF1 = () => import('./views/calc1/definite/f1.vue');
const CF2 = () => import('./views/calc1/definite/f2.vue');
const CF3 = () => import('./views/calc1/definite/f3.vue');
const CF4 = () => import('./views/calc1/definite/f4.vue');
const CF5 = () => import('./views/calc1/definite/f5.vue');

const CZ1 = () => import('./views/calc1/ode/o1.vue');
const CZ2 = () => import('./views/calc1/ode/o2.vue');
const CZ3 = () => import('./views/calc1/ode/o3.vue');
const CZ4 = () => import('./views/calc1/ode/o4.vue');
const CZ5 = () => import('./views/calc1/ode/o5.vue');
const CZ6 = () => import('./views/calc1/ode/o6.vue');

const CS1 = () => import('./views/calc1/series/s1.vue');
const CS2 = () => import('./views/calc1/series/s2.vue');
const CS3 = () => import('./views/calc1/series/s3.vue');
const CS4 = () => import('./views/calc1/series/s4.vue');
const CS5 = () => import('./views/calc1/series/s5.vue');
// 高等数学 · 空间解析几何（已开写）
const SV1 = () => import('./views/spacegeom/vector/v1.vue');
const SV2 = () => import('./views/spacegeom/vector/v2.vue');
const SV3 = () => import('./views/spacegeom/vector/v3.vue');
const SV4 = () => import('./views/spacegeom/vector/v4.vue');
// 子专题二 · 平面与直线（4 章）
const SP1 = () => import('./views/spacegeom/plane/p1.vue');
const SP2 = () => import('./views/spacegeom/plane/p2.vue');
const SP3 = () => import('./views/spacegeom/plane/p3.vue');
const SP4 = () => import('./views/spacegeom/plane/p4.vue');
// 子专题三 · 曲面与曲线（4 章）
const SS1 = () => import('./views/spacegeom/surface/s1.vue');
const SS2 = () => import('./views/spacegeom/surface/s2.vue');
const SS3 = () => import('./views/spacegeom/surface/s3.vue');
const SS4 = () => import('./views/spacegeom/surface/s4.vue');
// 物理演示：与数学模块分页，实验体（Rapier / three.js）由各实验自己动态 import
const PhysicsHome = () => import('./views/PhysicsHome.vue');
const PhysicsPart = () => import('./views/PhysicsPart.vue');
const PhysicsLab = () => import('./views/PhysicsLab.vue');
// 电路实验台（三段 /physics/lab/circuit，自搭元件、自连线、实时解电路）
const CircuitLab = () => import('./views/physics/CircuitLab.vue');
// 原生 anatomy 生成的演示（/physics/anatomy/<id>，iframe 载 public/anatomy 下的自包含 HTML）
const AnatomyLab = () => import('./views/physics/AnatomyLab.vue');
// 物理讲义章（/physics/ch/<id> 三段，与上面的 /physics/:id 不冲突）
const PM1 = () => import('./views/physics/mech/motion1.vue');
const PM2 = () => import('./views/physics/mech/motion2.vue');
const PM3 = () => import('./views/physics/mech/motion3.vue');
const PM4 = () => import('./views/physics/mech/motion4.vue');
const PM5 = () => import('./views/physics/mech/motion5.vue');
// 相互作用（重力与弹力 / 摩擦力 / 力的合成与平衡）
const PF1 = () => import('./views/physics/mech/gravity.vue');
const PF2 = () => import('./views/physics/mech/friction.vue');
const PF3 = () => import('./views/physics/mech/forcecomb.vue');
// 牛顿运动定律
const PW1 = () => import('./views/physics/mech/newton1.vue');
const PW2 = () => import('./views/physics/mech/newton2.vue');
const PW3 = () => import('./views/physics/mech/newton3.vue');
const PW4 = () => import('./views/physics/mech/newton4.vue');
// 抛体运动（运动的合成与分解 / 平抛 / 斜抛）
const PW5 = () => import('./views/physics/mech/proj1.vue');
const PW6 = () => import('./views/physics/mech/proj2.vue');
const PW7 = () => import('./views/physics/mech/proj3.vue');
// 圆周运动（描述与向心力 / 竖直平面内 / 离心现象）
const PW8 = () => import('./views/physics/mech/circ1.vue');
const PW9 = () => import('./views/physics/mech/circ2.vue');
const PW10 = () => import('./views/physics/mech/circ3.vue');
const PW11 = () => import('./views/physics/mech/grav1.vue');
const PW12 = () => import('./views/physics/mech/grav2.vue');
const PW13 = () => import('./views/physics/mech/grav3.vue');
// 机械能（功与功率 / 动能定理 / 机械能守恒 / 功能关系）
const PW14 = () => import('./views/physics/mech/energy1.vue');
const PW15 = () => import('./views/physics/mech/energy2.vue');
const PW16 = () => import('./views/physics/mech/energy3.vue');
const PW17 = () => import('./views/physics/mech/energy4.vue');
// 动量（冲量与动量定理 / 动量守恒与碰撞）
const PW18 = () => import('./views/physics/mech/momentum1.vue');
const PW19 = () => import('./views/physics/mech/momentum2.vue');
// 机械振动（简谐运动 / 单摆 / 阻尼与受迫振动）
const PV1 = () => import('./views/physics/vib/vib1.vue');
const PV2 = () => import('./views/physics/vib/vib2.vue');
const PV3 = () => import('./views/physics/vib/vib3.vue');
// 机械波（波的形成 / 波的图像 / 干涉衍射 / 波的方程）
const PW21 = () => import('./views/physics/vib/wave1.vue');
const PW22 = () => import('./views/physics/vib/wave2.vue');
const PW23 = () => import('./views/physics/vib/wave3.vue');
const PW24 = () => import('./views/physics/vib/wave4.vue');
// 热学（分子动理论 / 气体实验定律 / 状态方程 / 热力学两定律）
const PH1 = () => import('./views/physics/heat/heat1.vue');
const PH2 = () => import('./views/physics/heat/heat2.vue');
const PH3 = () => import('./views/physics/heat/heat3.vue');
const PH4 = () => import('./views/physics/heat/heat4.vue');
const PH5 = () => import('./views/physics/heat/heat5.vue');
// 电磁学（静电场 / 恒定电流 / 磁场 / 电磁感应 / 交变电流）
const EF1 = () => import('./views/physics/em/efield1.vue');
const EF2 = () => import('./views/physics/em/efield2.vue');
const EF3 = () => import('./views/physics/em/efield3.vue');
const EF4 = () => import('./views/physics/em/efield4.vue');
const CIR1 = () => import('./views/physics/em/circuit1.vue');
const CIR2 = () => import('./views/physics/em/circuit2.vue');
const CIR3 = () => import('./views/physics/em/circuit3.vue');
const MAG1 = () => import('./views/physics/em/mag1.vue');
const MAG2 = () => import('./views/physics/em/mag2.vue');
const MAG3 = () => import('./views/physics/em/mag3.vue');
const IND1 = () => import('./views/physics/em/ind1.vue');
const IND2 = () => import('./views/physics/em/ind2.vue');
const IND3 = () => import('./views/physics/em/ind3.vue');
const IND4 = () => import('./views/physics/em/ind4.vue');
const AC1 = () => import('./views/physics/em/ac1.vue');
const AC2 = () => import('./views/physics/em/ac2.vue');
const AC3 = () => import('./views/physics/em/ac3.vue');
// 光学（几何光学 / 波动光学）
const OP1 = () => import('./views/physics/opt/opt1.vue');
const OP2 = () => import('./views/physics/opt/opt2.vue');
const OP3 = () => import('./views/physics/opt/opt3.vue');
const OP4 = () => import('./views/physics/opt/opt4.vue');
const OP5 = () => import('./views/physics/opt/opt5.vue');
// 近代物理（波粒二象性 / 原子与原子核）
const MOD1 = () => import('./views/physics/mod/mod1.vue');
const MOD2 = () => import('./views/physics/mod/mod2.vue');
const MOD3 = () => import('./views/physics/mod/mod3.vue');
const MOD4 = () => import('./views/physics/mod/mod4.vue');
const MOD5 = () => import('./views/physics/mod/mod5.vue');

// 实验与测量（力学 / 电学 / 其他与数据处理）
const EXP1 = () => import('./views/physics/exps/exp1.vue');
const EXP2 = () => import('./views/physics/exps/exp2.vue');
const EXP3 = () => import('./views/physics/exps/exp3.vue');
const EXP4 = () => import('./views/physics/exps/exp4.vue');
const EXP5 = () => import('./views/physics/exps/exp5.vue');
const EXP6 = () => import('./views/physics/exps/exp6.vue');
const EXP7 = () => import('./views/physics/exps/exp7.vue');
const EXP8 = () => import('./views/physics/exps/exp8.vue');
const EXP9 = () => import('./views/physics/exps/exp9.vue');
const EXP10 = () => import('./views/physics/exps/exp10.vue');
const EXP11 = () => import('./views/physics/exps/exp11.vue');
const EXP12 = () => import('./views/physics/exps/exp12.vue');
const EXP13 = () => import('./views/physics/exps/exp13.vue');
const EXP14 = () => import('./views/physics/exps/exp14.vue');
const EXP15 = () => import('./views/physics/exps/exp15.vue');

export default [
  { path: '/', name: 'home', component: Home },
  // 物理演示实验室（首页的学科页签切到这里）
  { path: '/physics', name: 'physics', component: PhysicsHome },
  // 物理讲义的部分页（首页 → 部分 → 章），与数学的模块主页同一层；三段，不与下面的 /physics/:id 撞
  { path: '/physics/p/:part', name: 'physics-part', component: PhysicsPart },
  { path: '/physics/lab/circuit', name: 'physics-circuit-lab', component: CircuitLab },
  { path: '/physics/anatomy/:id', name: 'physics-anatomy', component: AnatomyLab },
  { path: '/physics/:id', name: 'physics-lab', component: PhysicsLab },
  // 物理讲义 · 一 力学 · 运动的描述与匀变速直线运动
  { path: '/physics/ch/motion1', component: PM1 },
  { path: '/physics/ch/motion2', component: PM2 },
  { path: '/physics/ch/motion3', component: PM3 },
  { path: '/physics/ch/motion4', component: PM4 },
  { path: '/physics/ch/motion5', component: PM5 },
  // 物理讲义 · 一 力学 · 相互作用
  { path: '/physics/ch/gravity', component: PF1 },
  { path: '/physics/ch/friction', component: PF2 },
  { path: '/physics/ch/forcecomb', component: PF3 },
  // 物理讲义 · 一 力学 · 牛顿运动定律
  { path: '/physics/ch/newton1', component: PW1 },
  { path: '/physics/ch/newton2', component: PW2 },
  { path: '/physics/ch/newton3', component: PW3 },
  { path: '/physics/ch/newton4', component: PW4 },
  // 物理讲义 · 一 力学 · 抛体运动
  { path: '/physics/ch/proj1', component: PW5 },
  { path: '/physics/ch/proj2', component: PW6 },
  { path: '/physics/ch/proj3', component: PW7 },
  { path: '/physics/ch/circ1', component: PW8 },
  { path: '/physics/ch/circ2', component: PW9 },
  { path: '/physics/ch/circ3', component: PW10 },
  { path: '/physics/ch/grav1', component: PW11 },
  { path: '/physics/ch/grav2', component: PW12 },
  { path: '/physics/ch/grav3', component: PW13 },
  { path: '/physics/ch/energy1', component: PW14 },
  { path: '/physics/ch/energy2', component: PW15 },
  { path: '/physics/ch/energy3', component: PW16 },
  { path: '/physics/ch/energy4', component: PW17 },
  { path: '/physics/ch/momentum1', component: PW18 },
  { path: '/physics/ch/momentum2', component: PW19 },
  { path: '/physics/ch/vib1', component: PV1 },
  { path: '/physics/ch/vib2', component: PV2 },
  { path: '/physics/ch/vib3', component: PV3 },
  { path: '/physics/ch/wave1', component: PW21 },
  { path: '/physics/ch/wave2', component: PW22 },
  { path: '/physics/ch/wave3', component: PW23 },
  { path: '/physics/ch/wave4', component: PW24 },
  // 物理讲义 · 三 热学 · 分子动理论与气体
  { path: '/physics/ch/heat1', component: PH1 },
  { path: '/physics/ch/heat2', component: PH2 },
  { path: '/physics/ch/heat3', component: PH3 },
  { path: '/physics/ch/heat4', component: PH4 },
  { path: '/physics/ch/heat5', component: PH5 },
  // 物理讲义 · 四 电磁学 · 静电场
  { path: '/physics/ch/efield1', component: EF1 },
  { path: '/physics/ch/efield2', component: EF2 },
  { path: '/physics/ch/efield3', component: EF3 },
  { path: '/physics/ch/efield4', component: EF4 },
  { path: '/physics/ch/circuit1', component: CIR1 },
  { path: '/physics/ch/circuit2', component: CIR2 },
  { path: '/physics/ch/circuit3', component: CIR3 },
  { path: '/physics/ch/mag1', component: MAG1 },
  { path: '/physics/ch/mag2', component: MAG2 },
  { path: '/physics/ch/mag3', component: MAG3 },
  { path: '/physics/ch/ind1', component: IND1 },
  { path: '/physics/ch/ind2', component: IND2 },
  { path: '/physics/ch/ind3', component: IND3 },
  { path: '/physics/ch/ind4', component: IND4 },
  { path: '/physics/ch/ac1', component: AC1 },
  { path: '/physics/ch/ac2', component: AC2 },
  { path: '/physics/ch/ac3', component: AC3 },
  // 物理讲义 · 五 光学 · 几何光学
  { path: '/physics/ch/opt1', component: OP1 },
  { path: '/physics/ch/opt2', component: OP2 },
  { path: '/physics/ch/opt3', component: OP3 },
  { path: '/physics/ch/opt4', component: OP4 },
  { path: '/physics/ch/opt5', component: OP5 },
  // 物理讲义 · 六 近代物理 · 波粒二象性
  { path: '/physics/ch/mod1', component: MOD1 },
  { path: '/physics/ch/mod2', component: MOD2 },
  { path: '/physics/ch/mod3', component: MOD3 },
  { path: '/physics/ch/mod4', component: MOD4 },
  { path: '/physics/ch/mod5', component: MOD5 },
  // 物理讲义 · 七 实验与测量
  { path: '/physics/ch/exp1', component: EXP1 },
  { path: '/physics/ch/exp2', component: EXP2 },
  { path: '/physics/ch/exp3', component: EXP3 },
  { path: '/physics/ch/exp4', component: EXP4 },
  { path: '/physics/ch/exp5', component: EXP5 },
  { path: '/physics/ch/exp6', component: EXP6 },
  { path: '/physics/ch/exp7', component: EXP7 },
  { path: '/physics/ch/exp8', component: EXP8 },
  { path: '/physics/ch/exp9', component: EXP9 },
  { path: '/physics/ch/exp10', component: EXP10 },
  { path: '/physics/ch/exp11', component: EXP11 },
  { path: '/physics/ch/exp12', component: EXP12 },
  { path: '/physics/ch/exp13', component: EXP13 },
  { path: '/physics/ch/exp14', component: EXP14 },
  { path: '/physics/ch/exp15', component: EXP15 },
  // 模块一 · 集合与常用逻辑
  { path: '/sets', name: 'sets', component: SetsHome },
  // 子专题一 · 集合的语言
  { path: '/sets/j1', component: J1 },
  { path: '/sets/j2', component: J2 },
  // 子专题二 · 集合间的关系
  { path: '/sets/x1', component: X1 },
  { path: '/sets/x2', component: X2 },
  // 子专题三 · 集合的运算
  { path: '/sets/y1', component: Y1 },
  { path: '/sets/y2', component: Y2 },
  { path: '/sets/y3', component: Y3 },
  { path: '/sets/y4', component: Y4 },
  // 子专题四 · 常用逻辑
  { path: '/sets/o1', component: O1 },
  { path: '/sets/o2', component: O2 },
  { path: '/sets/o3', component: O3 },
  { path: '/sets/o4', component: O4 },
  // 模块 · 三角函数与三角形（阶段一）
  { path: '/trig', name: 'trig', component: TrigHome },
  // 子专题一 · 任意角与弧度制
  { path: '/trig/b1', component: TB1 },
  { path: '/trig/b2', component: TB2 },
  // 子专题二 · 任意角的三角函数
  { path: '/trig/u1', component: TU1 },
  { path: '/trig/u2', component: TU2 },
  // 子专题三 · 诱导公式
  { path: '/trig/i1', component: TI1 },
  { path: '/trig/i2', component: TI2 },
  // 子专题四 · 图象与性质
  { path: '/trig/w1', component: TW1 },
  { path: '/trig/w2', component: TW2 },
  { path: '/trig/w3', component: TW3 },
  // 子专题五 · 图象变换
  { path: '/trig/f1', component: TF1 },
  { path: '/trig/f2', component: TF2 },
  // 子专题六 · 和差公式
  { path: '/trig/m1', component: TM1 },
  // 子专题七 · 倍角与升降幂
  { path: '/trig/n1', component: TN1 },
  { path: '/trig/n2', component: TN2 },
  // 子专题八 · 积化和差与辅助角
  { path: '/trig/q1', component: TQ1 },
  { path: '/trig/q2', component: TQ2 },
  // 子专题九 · 反三角函数
  { path: '/trig/h1', component: TH1 },
  { path: '/trig/h2', component: TH2 },
  // 子专题十 · 解三角形
  { path: '/trig/z1', component: TZ1 },
  { path: '/trig/z2', component: TZ2 },
  { path: '/trig/z3', component: TZ3 },
  // 子专题十一 · 综合应用
  { path: '/trig/k1', component: TK1 },
  { path: '/trig/k2', component: TK2 },
  { path: '/conics', name: 'conics', component: ConicsHome },
  // 子专题六 · 极点极线与配极理论
  { path: '/conics/ch1', component: Ch1 },
  { path: '/conics/ch2', component: Ch2 },
  { path: '/conics/ch3', component: Ch3 },
  { path: '/conics/ch4', component: Ch4 },
  { path: '/conics/ch5', component: Ch5 },
  { path: '/conics/ch6', component: Ch6 },
  { path: '/conics/ch7', component: Ch7 },
  // 子专题一 · 圆锥曲线的定义与标准方程
  { path: '/conics/def1', component: Def1 },
  { path: '/conics/def2', component: Def2 },
  { path: '/conics/def3', component: Def3 },
  { path: '/conics/def4', component: Def4 },
  { path: '/conics/def5', component: Def5 },
  // 子专题二 · 光学性质与切线
  { path: '/conics/opt1', component: Opt1 },
  { path: '/conics/opt2', component: Opt2 },
  { path: '/conics/opt3', component: Opt3 },
  { path: '/conics/opt4', component: Opt4 },
  // 子专题三 · 仿射变换看圆锥曲线
  { path: '/conics/aff1', component: Aff1 },
  { path: '/conics/aff2', component: Aff2 },
  { path: '/conics/aff3', component: Aff3 },
  { path: '/conics/aff4', component: Aff4 },
  { path: '/conics/aff5', component: Aff5 },
  { path: '/conics/aff6', component: Aff6 },
  // 子专题四 · 参数方程与轨迹
  { path: '/conics/par1', component: Par1 },
  { path: '/conics/par2', component: Par2 },
  { path: '/conics/par3', component: Par3 },
  { path: '/conics/par4', component: Par4 },
  { path: '/conics/par5', component: Par5 },
  // 子专题五 · 直线与圆锥曲线
  { path: '/conics/lin1', component: Lin1 },
  { path: '/conics/lin2', component: Lin2 },
  { path: '/conics/lin3', component: Lin3 },
  { path: '/conics/lin4', component: Lin4 },
  { path: '/conics/lin5', component: Lin5 },
  // 函数与微积分初步模块
  { path: '/functions', name: 'functions', component: FunctionsHome },
  // 子专题一 · 从映射到函数
  { path: '/functions/c1', component: C1 },
  { path: '/functions/c2', component: C2 },
  { path: '/functions/c3', component: C3 },
  { path: '/functions/c4', component: C4 },
  { path: '/functions/c5', component: C5 },
  // 子专题二 · 函数的基本性质
  { path: '/functions/s1', component: S1 },
  { path: '/functions/s2', component: S2 },
  { path: '/functions/s3', component: S3 },
  { path: '/functions/s4', component: S4 },
  { path: '/functions/s5', component: S5 },
  { path: '/functions/s6', component: S6 },
  { path: '/functions/s7', component: S7 },
  // 子专题三 · 零点与存在性定理
  { path: '/functions/r1', component: R1 },
  { path: '/functions/r2', component: R2 },
  { path: '/functions/r3', component: R3 },
  { path: '/functions/r4', component: R4 },
  // 子专题四 · 基本初等函数
  { path: '/functions/e1', component: E1 },
  { path: '/functions/e2', component: E2 },
  { path: '/functions/e3', component: E3 },
  { path: '/functions/e4', component: E4 },
  { path: '/functions/e5', component: E5 },
  { path: '/functions/e6', component: E6 },
  { path: '/functions/e7', component: E7 },
  { path: '/functions/e8', component: E8 },
  { path: '/functions/g1', component: G1 },
  { path: '/functions/g2', component: G2 },
  { path: '/functions/g3', component: G3 },
  // 子专题六 · 变化率与导数
  { path: '/functions/v1', component: V1 },
  { path: '/functions/v2', component: V2 },
  { path: '/functions/v3', component: V3 },
  { path: '/functions/v4', component: V4 },
  { path: '/functions/v5', component: V5 },
  { path: '/functions/v6', component: V6 },
  { path: '/functions/v7', component: V7 },
  { path: '/functions/v8', component: V8 },
  // 不等式模块
  { path: '/inequalities', name: 'ineq', component: IneqHome },
  // 子专题一 · 性质与比较
  { path: '/inequalities/p1', component: IP1 },
  { path: '/inequalities/p2', component: IP2 },
  // 子专题二 · 一元二次不等式
  { path: '/inequalities/q1', component: IQ1 },
  { path: '/inequalities/q2', component: IQ2 },
  { path: '/inequalities/q3', component: IQ3 },
  // 子专题三 · 基本不等式
  { path: '/inequalities/g1', component: IG1 },
  { path: '/inequalities/g2', component: IG2 },
  { path: '/inequalities/g3', component: IG3 },
  // 子专题四 · 放缩与常用不等式
  { path: '/inequalities/f1', component: IF1 },
  { path: '/inequalities/f2', component: IF2 },
  { path: '/inequalities/f3', component: IF3 },
  // 子专题五 · 简单线性规划
  { path: '/inequalities/l1', component: IL1 },
  { path: '/inequalities/l2', component: IL2 },
  { path: '/inequalities/l3', component: IL3 },
  { path: '/inequalities/l4', component: IL4 },
  // 向量与复数模块
  { path: '/vectors', name: 'vectors', component: VectorsHome },
  // 子专题一 · 平面向量的概念与线性运算
  { path: '/vectors/x1', component: VX1 },
  { path: '/vectors/x2', component: VX2 },
  { path: '/vectors/x3', component: VX3 },
  // 子专题二 · 平面向量基本定理与坐标运算
  { path: '/vectors/b1', component: VB1 },
  { path: '/vectors/b2', component: VB2 },
  { path: '/vectors/b3', component: VB3 },
  // 子专题三 · 数量积与度量
  { path: '/vectors/i1', component: VI1 },
  { path: '/vectors/i2', component: VI2 },
  { path: '/vectors/i3', component: VI3 },
  { path: '/vectors/i4', component: VI4 },

  { path: '/vectors/y1', component: VY1 },
  { path: '/vectors/y2', component: VY2 },

  { path: '/vectors/c1', component: VC1 },
  { path: '/vectors/c2', component: VC2 },
  { path: '/vectors/c3', component: VC3 },

  { path: '/vectors/e1', component: VE1 },
  { path: '/vectors/e2', component: VE2 },
  // 极坐标与参数方程模块
  { path: '/linecircle', name: 'linecircle', component: LineCircleHome },
  { path: '/linecircle/l1', component: LCL1 },
  { path: '/linecircle/l2', component: LCL2 },
  { path: '/linecircle/l3', component: LCL3 },
  { path: '/linecircle/l4', component: LCL4 },
  { path: '/linecircle/c1', component: LCC1 },
  { path: '/linecircle/c2', component: LCC2 },
  { path: '/linecircle/c3', component: LCC3 },
  { path: '/linecircle/t1', component: LCT1 },
  { path: '/linecircle/t2', component: LCT2 },
  { path: '/linecircle/t3', component: LCT3 },
  { path: '/linecircle/t4', component: LCT4 },
  { path: '/linecircle/z1', component: LCA1 },
  { path: '/linecircle/z2', component: LCA2 },
  { path: '/polar', name: 'polar', component: PolarHome },
  // 子专题一 · 极坐标系与互化
  { path: '/polar/j1', component: PJ1 },
  { path: '/polar/j2', component: PJ2 },
  { path: '/polar/q1', component: PQ1 },
  { path: '/polar/q2', component: PQ2 },
  { path: '/polar/s1', component: PS1 },
  { path: '/polar/s2', component: PS2 },
  { path: '/polar/s3', component: PS3 },
  { path: '/polar/g1', component: PG1 },
  { path: '/polar/g2', component: PG2 },
  // 立体几何模块
  { path: '/solid', name: 'solid', component: SolidHome },
  // 子专题一 · 认识空间几何体
  { path: '/solid/r1', component: SR1 },
  { path: '/solid/r2', component: SR2 },
  // 子专题二 · 体积与表面积
  { path: '/solid/m1', component: SM1 },
  { path: '/solid/m2', component: SM2 },
  { path: '/solid/m3', component: SM3 },
  // 子专题三 · 空间中的位置关系
  { path: '/solid/w1', component: SW1 },
  { path: '/solid/w2', component: SW2 },
  // 子专题四 · 空间直角坐标系
  { path: '/solid/c1', component: SC1 },
  { path: '/solid/c2', component: SC2 },
  { path: '/solid/c3', component: SC3 },
  // 数列模块
  { path: '/sequences', name: 'sequences', component: SequencesHome },
  // 子专题一 · 数列的概念与表示
  { path: '/sequences/s1', component: SQ1 },
  { path: '/sequences/s2', component: SQ2 },
  { path: '/sequences/s3', component: SQ3 },
  // 子专题二 · 等差数列
  { path: '/sequences/d1', component: DQ1 },
  { path: '/sequences/d2', component: DQ2 },
  { path: '/sequences/d3', component: DQ3 },
  // 子专题三 · 等比数列
  { path: '/sequences/g1', component: GQ1 },
  { path: '/sequences/g2', component: GQ2 },
  { path: '/sequences/g3', component: GQ3 },
  // 子专题四 · 数列求和的方法
  { path: '/sequences/h1', component: HQ1 },
  { path: '/sequences/h2', component: HQ2 },
  { path: '/sequences/h3', component: HQ3 },
  // 子专题五 · 递推与构造
  { path: '/sequences/r1', component: RQ1 },
  { path: '/sequences/r2', component: RQ2 },
  { path: '/sequences/r3', component: RQ3 },
  { path: '/sequences/r4', component: RQ4 },
  // 子专题六 · 数学归纳法
  { path: '/sequences/i1', component: IN1 },
  { path: '/sequences/i2', component: IN2 },
  // 子专题七 · 数列的应用
  { path: '/sequences/u1', component: UQ1 },
  { path: '/sequences/u2', component: UQ2 },
  // 组合学与二项式定理模块
  { path: '/combinatorics', name: 'combinatorics', component: CombinatoricsHome },
  // 子专题一 · 计数原理
  { path: '/combinatorics/c1', component: CC1 },
  { path: '/combinatorics/c2', component: CC2 },
  // 子专题二 · 排列与组合
  { path: '/combinatorics/p1', component: CP1 },
  { path: '/combinatorics/p2', component: CP2 },
  // 子专题三 · 二项式定理
  { path: '/combinatorics/b1', component: CB1 },
  { path: '/combinatorics/b2', component: CB2 },
  { path: '/combinatorics/b3', component: CB3 },
  // 子专题四 · 组合恒等式与应用
  { path: '/combinatorics/i1', component: CI1 },
  { path: '/combinatorics/i2', component: CI2 },
  // 概率与统计模块
  { path: '/probability', name: 'probability', component: ProbabilityHome },
  // 子专题一 · 随机事件与概率
  { path: '/probability/g1', component: PB1 },
  { path: '/probability/g2', component: PB2 },
  // 子专题二 · 条件概率与独立性
  { path: '/probability/c1', component: PC1 },
  { path: '/probability/c2', component: PC2 },
  { path: '/probability/c3', component: PC3 },
  // 子专题三 · 随机变量及其分布
  { path: '/probability/r1', component: PR1 },
  { path: '/probability/r2', component: PR2 },
  { path: '/probability/r3', component: PR3 },
  { path: '/probability/r4', component: PR4 },
  // 子专题四 · 数字特征
  { path: '/probability/n1', component: PN1 },
  { path: '/probability/n2', component: PN2 },
  { path: '/probability/n3', component: PN3 },
  { path: '/probability/t1', component: PT1 },
  { path: '/probability/t2', component: PT2 },
  { path: '/probability/t3', component: PT3 },
  { path: '/probability/j1', component: PTJ1 },
  { path: '/probability/j2', component: PTJ2 },
  { path: '/probability/j3', component: PTJ3 },
  // 数值计算模块
  { path: '/numeric', name: 'numeric', component: NumericHome },
  // 子专题一 · 误差
  { path: '/numeric/e1', component: NE1 },
  { path: '/numeric/e2', component: NE2 },
  // 子专题二 · 方程求根
  { path: '/numeric/i1', component: NI1 },
  { path: '/numeric/i2', component: NI2 },
  { path: '/numeric/i3', component: NI3 },
  { path: '/numeric/f1', component: NF1 },
  { path: '/numeric/f2', component: NF2 },
  { path: '/numeric/a1', component: NA1 },
  { path: '/numeric/a2', component: NA2 },
  { path: '/numeric/a3', component: NA3 },
  // 模块 · 线性代数初步
  { path: '/linalg', name: 'linalg', component: LinalgHome },
  { path: '/linalg/d1', component: LD1 },
  { path: '/linalg/d2', component: LD2 },
  { path: '/linalg/m1', component: LM1 },
  { path: '/linalg/m2', component: LM2 },
  { path: '/linalg/m3', component: LM3 },
  { path: '/linalg/s1', component: LS1 },
  { path: '/linalg/s2', component: LS2 },
  { path: '/linalg/s3', component: LS3 },
  { path: '/linalg/e1', component: LE1 },
  { path: '/linalg/e2', component: LE2 },
  { path: '/linalg/e3', component: LE3 },
  { path: '/linalg/q1', component: LQ1 },
  { path: '/linalg/q2', component: LQ2 },
  { path: '/linalg/q3', component: LQ3 },
  // 高等数学 · 九个模块（规划中，只有章节大纲；slug 避开 /projective，它已重定向到 conics）
  { path: '/calc1', name: 'calc1', component: Calc1Home },
  // 子专题一 · 极限与连续（已上线 5 章）
  { path: '/calc1/l1', component: CL1 },
  { path: '/calc1/l2', component: CL2 },
  { path: '/calc1/l3', component: CL3 },
  { path: '/calc1/l4', component: CL4 },
  { path: '/calc1/l5', component: CL5 },
  // 子专题二 · 导数与微分（已上线 8 章）
  { path: '/calc1/d1', component: CD1 },
  { path: '/calc1/d2', component: CD2 },
  { path: '/calc1/d3', component: CD3 },
  { path: '/calc1/d4', component: CD4 },
  { path: '/calc1/d5', component: CD5 },
  { path: '/calc1/d6', component: CD6 },
  { path: '/calc1/d7', component: CD7 },
  { path: '/calc1/d8', component: CD8 },
  // 子专题三 · 不定积分（已上线 4 章）
  { path: '/calc1/i1', component: CU1 },
  { path: '/calc1/i2', component: CU2 },
  { path: '/calc1/i3', component: CU3 },
  { path: '/calc1/i4', component: CU4 },
  // 子专题四 · 定积分（已上线 5 章）
  { path: '/calc1/f1', component: CF1 },
  { path: '/calc1/f2', component: CF2 },
  { path: '/calc1/f3', component: CF3 },
  { path: '/calc1/f4', component: CF4 },
  { path: '/calc1/f5', component: CF5 },
  // 子专题五 · 常微分方程（已上线 6 章）
  { path: '/calc1/o1', component: CZ1 },
  { path: '/calc1/o2', component: CZ2 },
  { path: '/calc1/o3', component: CZ3 },
  { path: '/calc1/o4', component: CZ4 },
  { path: '/calc1/o5', component: CZ5 },
  { path: '/calc1/o6', component: CZ6 },
  // 子专题六 · 无穷级数（已上线 5 章）
  { path: '/calc1/s1', component: CS1 },
  { path: '/calc1/s2', component: CS2 },
  { path: '/calc1/s3', component: CS3 },
  { path: '/calc1/s4', component: CS4 },
  { path: '/calc1/s5', component: CS5 },
  { path: '/spacegeom', name: 'spacegeom', component: SpacegeomHome },
  // 子专题一 · 空间向量（已上线 4 章）
  { path: '/spacegeom/v1', component: SV1 },
  { path: '/spacegeom/v2', component: SV2 },
  { path: '/spacegeom/v3', component: SV3 },
  { path: '/spacegeom/v4', component: SV4 },
  // 子专题二 · 平面与直线（已上线 4 章）
  { path: '/spacegeom/p1', component: SP1 },
  { path: '/spacegeom/p2', component: SP2 },
  { path: '/spacegeom/p3', component: SP3 },
  { path: '/spacegeom/p4', component: SP4 },
  // 子专题三 · 曲面与曲线（已上线 4 章）
  { path: '/spacegeom/s1', component: SS1 },
  { path: '/spacegeom/s2', component: SS2 },
  { path: '/spacegeom/s3', component: SS3 },
  { path: '/spacegeom/s4', component: SS4 },
  { path: '/calc2', name: 'calc2', component: Calc2Home },
  // 子专题一 · 多元函数微分学（已上线 6 章）
  { path: '/calc2/m1', component: CM1 },
  { path: '/calc2/m2', component: CM2 },
  { path: '/calc2/m3', component: CM3 },
  { path: '/calc2/m4', component: CM4 },
  { path: '/calc2/m5', component: CM5 },
  { path: '/calc2/m6', component: CM6 },
  // 子专题二 · 重积分（已上线 6 章）
  { path: '/calc2/r1', component: CR1 },
  { path: '/calc2/r2', component: CR2 },
  { path: '/calc2/r3', component: CR3 },
  { path: '/calc2/r4', component: CR4 },
  { path: '/calc2/r5', component: CR5 },
  { path: '/calc2/r6', component: CR6 },
  // 子专题三 · 曲线与曲面积分（已上线 6 章）
  { path: '/calc2/c1', component: MC1 },
  { path: '/calc2/c2', component: MC2 },
  { path: '/calc2/c3', component: MC3 },
  { path: '/calc2/c4', component: MC4 },
  { path: '/calc2/c5', component: MC5 },
  { path: '/calc2/c6', component: MC6 },
  { path: '/complexvar', name: 'complexvar', component: ComplexvarHome },
  // 子专题一 · 复数与复变函数（已上线 3 章）
  { path: '/complexvar/c1', component: CV1 },
  { path: '/complexvar/c2', component: CV2 },
  { path: '/complexvar/c3', component: CV3 },
  { path: '/complexvar/a1', component: CW1 },
  { path: '/complexvar/a2', component: CW2 },
  { path: '/complexvar/a3', component: CW3 },
  { path: '/complexvar/a4', component: CW4 },
  { path: '/complexvar/s1', component: CY1 },
  { path: '/complexvar/s2', component: CY2 },
  { path: '/complexvar/s3', component: CY3 },
  { path: '/complexvar/s4', component: CY4 },
  { path: '/complexvar/s5', component: CY5 },
  { path: '/numtheory', name: 'numtheory', component: NumtheoryHome },
  { path: '/numtheory/z1', component: NZ1 },
  { path: '/numtheory/z2', component: NZ2 },
  { path: '/numtheory/z3', component: NZ3 },
  { path: '/numtheory/z4', component: NZ4 },
  { path: '/numtheory/d1', component: ND1 },
  { path: '/numtheory/d2', component: ND2 },
  { path: '/numtheory/d3', component: ND3 },
  { path: '/numtheory/d4', component: ND4 },
  { path: '/numtheory/d5', component: ND5 },
  { path: '/numtheory/s1', component: NS1 },
  { path: '/numtheory/s2', component: NS2 },
  { path: '/numtheory/s3', component: NS3 },
  { path: '/numtheory/s4', component: NS4 },
  { path: '/topology', name: 'topology', component: TopologyHome },
  // 子专题一 · 拓扑空间（5 章）
  { path: '/topology/s1', component: TS1 },
  { path: '/topology/s2', component: TS2 },
  { path: '/topology/s3', component: TS3 },
  { path: '/topology/s4', component: TS4 },
  { path: '/topology/s5', component: TS5 },
  // 子专题二 · 连通与紧致（4 章）
  { path: '/topology/c1', component: TC1 },
  { path: '/topology/c2', component: TC2 },
  { path: '/topology/c3', component: TC3 },
  { path: '/topology/c4', component: TC4 },
  // 子专题三 · 不变量初步（3 章）
  { path: '/topology/v1', component: TV1 },
  { path: '/topology/v2', component: TV2 },
  { path: '/topology/v3', component: TV3 },
  { path: '/fractal', name: 'fractal', component: FractalHome },
  // 子专题一 · 自相似与维数（4 章）
  { path: '/fractal/d1', component: FRD1 },
  { path: '/fractal/d2', component: FRD2 },
  { path: '/fractal/d3', component: FRD3 },
  { path: '/fractal/d4', component: FRD4 },
  // 子专题二 · 典型分形（4 章）
  { path: '/fractal/s1', component: FRS1 },
  { path: '/fractal/s2', component: FRS2 },
  { path: '/fractal/s3', component: FRS3 },
  { path: '/fractal/s4', component: FRS4 },
  // 子专题三 · 生成与应用（3 章）
  { path: '/fractal/g1', component: FRG1 },
  { path: '/fractal/g2', component: FRG2 },
  { path: '/fractal/g3', component: FRG3 },
  { path: '/projgeom', name: 'projgeom', component: ProjgeomHome },
  // 子专题一 · 射影平面（5 章）
  { path: '/projgeom/p1', component: PJP1 },
  { path: '/projgeom/p2', component: PJP2 },
  { path: '/projgeom/p3', component: PJP3 },
  { path: '/projgeom/p4', component: PJP4 },
  { path: '/projgeom/p5', component: PJP5 },
  // 子专题二 · 二次曲线（3 章）
  { path: '/projgeom/c1', component: PJC1 },
  { path: '/projgeom/c2', component: PJC2 },
  { path: '/projgeom/c3', component: PJC3 },
  // 子专题三 · 变换群与几何（3 章）
  { path: '/projgeom/g1', component: PJG1 },
  { path: '/projgeom/g2', component: PJG2 },
  { path: '/projgeom/g3', component: PJG3 },
  { path: '/algebra', name: 'algebra', component: AlgebraHome },
  // 子专题一 · 代数结构（4 章）
  { path: '/algebra/s1', component: ALS1 },
  { path: '/algebra/s2', component: ALS2 },
  { path: '/algebra/s3', component: ALS3 },
  { path: '/algebra/s4', component: ALS4 },
  // 子专题二 · 群论（7 章）
  { path: '/algebra/g1', component: ALG1 },
  { path: '/algebra/g2', component: ALG2 },
  { path: '/algebra/g3', component: ALG3 },
  { path: '/algebra/g4', component: ALG4 },
  { path: '/algebra/g5', component: ALG5 },
  { path: '/algebra/g6', component: ALG6 },
  { path: '/algebra/g7', component: ALG7 },
  // 子专题三 · 图论（6 章）
  { path: '/algebra/n1', component: ALN1 },
  { path: '/algebra/n2', component: ALN2 },
  { path: '/algebra/n3', component: ALN3 },
  { path: '/algebra/n4', component: ALN4 },
  { path: '/algebra/n5', component: ALN5 },
  { path: '/algebra/n6', component: ALN6 },
  // 定理速查总览
  { path: '/cheatsheet', name: 'cheatsheet', component: CheatSheet },
  // 自由画板（自托管 GeoGebra）
  { path: '/playground', name: 'playground', component: Playground },
  { path: '/playground/about', name: 'playground-about', component: PlaygroundAbout },
  { path: '/playground/guide', name: 'playground-guide', component: PlaygroundGuide },
  { path: '/settings', name: 'settings', component: Settings },
  // 笔记（md / LaTeX，本地保存，可导出 PDF）
  { path: '/notes', name: 'notes', component: Notes },
  // 数字游戏，入口是左侧竖排圆按钮里那枚骰子
  { path: '/games', name: 'games', component: Games },
  // 游戏子页：2048 与数独各占一页，入口是游戏页顶部的页签
  { path: '/games/2048', name: 'games-2048', component: Games2048 },
  { path: '/games/sudoku', name: 'games-sudoku', component: GamesSudoku },
  // 旧路径：两页合并时的地址，重定向到 2048
  { path: '/games/classic', redirect: '/games/2048' },
  // 日历 · 待办（月视图 + 当日清单，数据存本机 gl-todos）
  { path: '/calendar', name: 'calendar', component: Calendar },
  // 站务三页，入口在页脚
  { path: '/about', name: 'about', component: About },
  { path: '/guide', name: 'guide', component: Guide },
  { path: '/changelog', name: 'changelog', component: Changelog },
  // 旧路径重定向：/projective[/chN] → /conics[/chN]
  { path: '/projective/:pathMatch(.*)*', redirect: to => '/conics' + (to.params.pathMatch ? '/' + to.params.pathMatch : '') },
];
