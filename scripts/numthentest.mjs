/* numtheory 模块 12 台画板的无头测试（构造 / 徽章读数 / 滑块改参 / NaN 坐标审计）。
   跑法：export PATH="$HOME/apps/node/bin:$PATH" && node scripts/numthentest.mjs
   徽章读数比较的是 tex 源串（chipM 的「源串镜像」），\\dfrac、\\varphi 之类原样保留。 */
import { install, rootEl, chips, chipVal, inputs, setSlider, audit, chk, done } from './boardmock.mjs';

install();

const B = {};
async function build(key, file) {
  const mod = await import(file);
  const root = rootEl();
  B[key] = { B: mod.createBoard(root), root };
  return B[key];
}
const R = key => B[key].root;
const reRender = () => {};

/* ---------- 整1 带余除法 ---------- */
await build('divmod', '../src/boards/numtheory/basic/divmodlab.js');
{
  const { root } = B.divmod;
  chk(chips(root).length === 3, '整1 三个徽章');
  chk(chipVal(root, '商') === '$q=6$', '整1 47÷7 商 6，读到 ' + chipVal(root, '商'));
  chk(chipVal(root, '余数') === '$r=5$', '整1 47÷7 余 5，读到 ' + chipVal(root, '余数'));
  chk(audit(root, '整1').length === 0, '整1 初始无 NaN 坐标');
  const [a, m] = inputs(root);
  setSlider(a, 17); setSlider(m, 5);
  chk(chipVal(root, '商') === '$q=3$' && chipVal(root, '余数') === '$r=2$', '整1 17÷5 → 商 3 余 2');
  setSlider(a, 60); setSlider(m, 2);
  chk(chipVal(root, '余数') === '$r=0$' && chipVal(root, '判读').includes('整除'), '整1 60÷2 整除');
  chk(audit(root, '整1').length === 0, '整1 改参后无 NaN 坐标');
}

/* ---------- 整2 欧几里得 ---------- */
await build('gcd', '../src/boards/numtheory/basic/gcdlab.js');
{
  const { root } = B.gcd;
  chk(chips(root).length === 3, '整2 三个徽章');
  chk(chipVal(root, '最大公约数') === '$\\gcd(30,18)=6$', '整2 gcd(30,18)=6，读到 ' + chipVal(root, '最大公约数'));
  chk(chipVal(root, '步数') === '3 步', '整2 三步，读到 ' + chipVal(root, '步数'));
  chk(chipVal(root, '裴蜀等式') === '$30\\cdot(-1)+18\\cdot(2)=6$', '整2 裴蜀等式，读到 ' + chipVal(root, '裴蜀等式'));
  const [a, b] = inputs(root);
  setSlider(b, 12);
  chk(chipVal(root, '最大公约数') === '$\\gcd(30,12)=6$' && chipVal(root, '步数') === '2 步', '整2 30 与 12 两步');
  setSlider(a, 40); setSlider(b, 15);
  chk(chipVal(root, '最大公约数') === '$\\gcd(40,15)=5$', '整2 gcd(40,15)=5');
  chk(audit(root, '整2').length === 0, '整2 无 NaN 坐标');
}

/* ---------- 整3 同余 ---------- */
await build('cong', '../src/boards/numtheory/basic/conglab.js');
{
  const { root } = B.cong;
  chk(chips(root).length === 4, '整3 四个徽章');
  chk(chipVal(root, 'a\\bmod m') === '$a\\bmod m=5$', '整3 47 mod 7=5，读到 ' + chipVal(root, 'a\\bmod m'));
  chk(chipVal(root, 'b\\bmod m') === '$b\\bmod m=5$', '整3 26 mod 7=5');
  chk(chipVal(root, 'a-b') === '$a-b=21$', '整3 a−b=21');
  chk(chipVal(root, '判读') === '同余', '整3 47≡26 (mod 7) 判同余');
  const [, , bIn] = inputs(root);
  setSlider(bIn, 30);
  chk(chipVal(root, '判读') === '不同余', '整3 47 与 30 不同余');
  chk(audit(root, '整3').length === 0, '整3 无 NaN 坐标');
}

/* ---------- 整4 一次同余方程 ---------- */
await build('lin', '../src/boards/numtheory/basic/linearcong.js');
{
  const { root } = B.lin;
  chk(chips(root).length === 4, '整4 四个徽章');
  chk(chipVal(root, 'd=\\gcd') === '$d=4$', '整4 d=4，读到 ' + chipVal(root, 'd=\\gcd'));
  chk(chipVal(root, '解个数') === '3 个', '整4 4x≡8 (mod 12) 三类，读到 ' + chipVal(root, '解个数'));
  chk(chipVal(root, '解集') === '$x=2,\\ 5,\\ 8$', '整4 解集 2,5,8，读到 ' + chipVal(root, '解集'));
  const [, bIn] = inputs(root);
  setSlider(bIn, 5);
  chk(chipVal(root, '解个数') === '0 个' && chipVal(root, '解集') === '空集', '整4 4x≡5 (mod 12) 无解');
  chk(chipVal(root, '判读') === '$d\\nmid b$', '整4 判读 d∤b');
  chk(audit(root, '整4').length === 0, '整4 无 NaN 坐标');
}

/* ---------- 定1 素数与算术基本定理 ---------- */
await build('prime', '../src/boards/numtheory/theorem/primelab.js');
{
  const { root } = B.prime;
  chk(chips(root).length === 4, '定1 四个徽章');
  chk(chipVal(root, '素数个数') === '$\\pi(60)=17$', '定1 π(60)=17，读到 ' + chipVal(root, '素数个数'));
  chk(chipVal(root, '最后一个素数') === '$p=59$', '定1 末素数 59');
  chk(chipVal(root, '$n$ 的分解') === '$60=2^{2}\\times3\\times5$', '定1 60 分解，读到 ' + chipVal(root, '$n$ 的分解'));
  const [nIn] = inputs(root);
  setSlider(nIn, 10);
  chk(chipVal(root, '素数个数') === '$\\pi(10)=4$' && chipVal(root, '最后一个素数') === '$p=7$', '定1 n=10 四个素数');
  setSlider(nIn, 13);
  chk(chipVal(root, '判读') === '13 是素数', '定1 13 是素数');
  chk(audit(root, '定1').length === 0, '定1 无 NaN 坐标');
}

/* ---------- 定2 欧拉函数 ---------- */
await build('phi', '../src/boards/numtheory/theorem/philab.js');
{
  const { root } = B.phi;
  chk(chips(root).length === 3, '定2 三个徽章');
  chk(chipVal(root, '\\varphi(n)') === '$\\varphi(24)=8$', '定2 φ(24)=8，读到 ' + chipVal(root, '\\varphi(n)'));
  chk(chipVal(root, '按质因数算').includes('=8'), '定2 乘积式同读 8');
  const [nIn] = inputs(root);
  setSlider(nIn, 36);
  chk(chipVal(root, '\\varphi(n)') === '$\\varphi(36)=12$', '定2 φ(36)=12');
  setSlider(nIn, 7);
  chk(chipVal(root, '\\varphi(n)') === '$\\varphi(7)=6$', '定2 φ(7)=6');
  chk(audit(root, '定2').length === 0, '定2 无 NaN 坐标');
}

/* ---------- 定3 费马小定理与欧拉定理 ---------- */
await build('fermat', '../src/boards/numtheory/theorem/fermatlab.js');
{
  const { root } = B.fermat;
  chk(chips(root).length === 3, '定3 三个徽章');
  chk(chipVal(root, '阶') === '$6$', '定3 3 模 7 的阶 6，读到 ' + chipVal(root, '阶'));
  chk(chipVal(root, 'a^{\\varphi(m)}\\bmod m') === '$1$', '定3 3^6 mod 7=1，读到 ' + chipVal(root, 'a^{\\varphi(m)}'));
  const [, aIn] = inputs(root);
  setSlider(aIn, 6);
  chk(chipVal(root, '阶') === '$2$', '定3 6 模 7 的阶 2，读到 ' + chipVal(root, '阶'));
  const [mIn] = inputs(root);
  setSlider(mIn, 12); setSlider(aIn, 5);
  chk(chipVal(root, '阶') === '$2$', '定3 5 模 12 的阶 2');
  chk(audit(root, '定3').length === 0, '定3 无 NaN 坐标');
}

/* ---------- 定4 中国剩余定理 ---------- */
await build('crt', '../src/boards/numtheory/theorem/crtlab.js');
{
  const { root } = B.crt;
  chk(chips(root).length === 3, '定4 三个徽章');
  chk(chipVal(root, 'x\\bmod m_1') === '$1$', '定4 7 mod 3=1，读到 ' + chipVal(root, 'x\\bmod m_1'));
  chk(chipVal(root, 'x\\bmod m_2') === '$2$', '定4 7 mod 5=2');
  chk(chipVal(root, '判读') === '模数互素，组合唯一', '定4 互素判读');
  const [m1, m2, x] = inputs(root);
  setSlider(x, 20);
  chk(chipVal(root, 'x\\bmod m_1') === '$2$' && chipVal(root, 'x\\bmod m_2') === '$0$', '定4 x=20 余数 2 与 0');
  setSlider(m1, 4); setSlider(m2, 6);
  chk(chipVal(root, '判读') === '模数不互素，解不唯一', '定4 模 4 与 6 不互素');
  chk(audit(root, '定4').length === 0, '定4 无 NaN 坐标');
}

/* ---------- 剩1 二次剩余 ---------- */
await build('quad', '../src/boards/numtheory/residue/quadres.js');
{
  const { root } = B.quad;
  chk(chips(root).length === 3, '剩1 三个徽章');
  chk(chipVal(root, '二次剩余个数') === '$3=\\dfrac{7-1}{2}$', '剩1 模 7 三个剩余，读到 ' + chipVal(root, '二次剩余个数'));
  chk(chipVal(root, '欧拉判别式') === '$1$', '剩1 2^3≡1 (mod 7)');
  chk(chipVal(root, '判读').startsWith('两根'), '剩1 a=2 有两根');
  const [pIn, aIn] = inputs(root);
  setSlider(aIn, 3);
  chk(chipVal(root, '欧拉判别式') === '$6$' && chipVal(root, '判读') === '非二次剩余', '剩1 3 是模 7 的非剩余');
  setSlider(pIn, 3); setSlider(aIn, 22);
  chk(chips(root)[2].cls.includes('warn'), '剩1 a 超过 p−1 时判读转警示');
  chk(audit(root, '剩1').length === 0, '剩1 无 NaN 坐标');
}

/* ---------- 剩2 原根与指数 ---------- */
await build('root2', '../src/boards/numtheory/residue/primroot.js');
{
  const { root } = B.root2;
  chk(chips(root).length === 3, '剩2 三个徽章');
  chk(chipVal(root, '阶') === '$6$', '剩2 3 模 7 的阶 6，读到 ' + chipVal(root, '阶'));
  chk(chipVal(root, '原根个数') === '$\\varphi(6)=2$', '剩2 φ(6)=2，读到 ' + chipVal(root, '原根个数'));
  const [, gIn] = inputs(root);
  setSlider(gIn, 2);
  chk(chipVal(root, '阶') === '$3$', '剩2 2 模 7 的阶 3，读到 ' + chipVal(root, '阶'));
  chk(audit(root, '剩2').length === 0, '剩2 无 NaN 坐标');
}

/* ---------- 剩3 不定方程 ---------- */
await build('dio', '../src/boards/numtheory/residue/diophant.js');
{
  const { root } = B.dio;
  chk(chips(root).length === 3, '剩3 三个徽章');
  chk(chipVal(root, '\\gcd(a,b)') === '$2$', '剩3 gcd(4,6)=2，读到 ' + chipVal(root, '\\gcd(a,b)'));
  chk(/^\(-?\d+,-?\d+\)$/.test(chipVal(root, '特解')), '剩3 4x+6y=14 给出整数特解 ' + chipVal(root, '特解'));
  chk(/个格点$/.test(chipVal(root, '判读')), '剩3 判读给出格点数 ' + chipVal(root, '判读'));
  const [, , cIn] = inputs(root);
  setSlider(cIn, 15);
  chk(chipVal(root, '特解') === '无' && chipVal(root, '判读') === '无整数解', '剩3 4x+6y=15 无整数解');
  chk(audit(root, '剩3').length === 0, '剩3 无 NaN 坐标');
}

/* ---------- 剩4 RSA ---------- */
await build('rsa', '../src/boards/numtheory/residue/rsalab.js');
{
  const { root } = B.rsa;
  chk(chips(root).length === 3, '剩4 三个徽章');
  chk(chipVal(root, '公钥') === '$(35,5)$', '剩4 p=5,q=7 时 e 自动抬到 5 且与 φ 互素，读到 ' + chipVal(root, '公钥'));
  chk(chipVal(root, '密文') === '$7$', '剩4 报文 7 加密后回到 7，读到 ' + chipVal(root, '密文'));
  chk(chipVal(root, '判读') === '往返还原成功', '剩4 往返还原成功');
  const [pIn, qIn, eIn, mIn] = inputs(root);
  setSlider(mIn, 12);
  chk(chipVal(root, '判读') === '往返还原成功', '剩4 报文 12 仍能还原');
  setSlider(pIn, 2); setSlider(qIn, 2);
  chk(chipVal(root, '判读') === '往返还原成功', '剩4 p=q=11 仍能还原');
  chk(audit(root, '剩4').length === 0, '剩4 无 NaN 坐标');
}

done('numtheory');
