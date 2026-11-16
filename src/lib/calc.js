// 计算器求值：把面板按钮拼出来的表达式解析成数值。
// 只认下列记号，写错一律抛错由面板显示原文；不用 eval，也不透传任何脚本。
//   数：12、3.5；常量：π、e、Ans（上一次结果）
//   运算：+ − × ÷ ^ ! % 、括号
//   函数：sin cos tan asin acos atan ln log sqrt abs exp（√ 视作 sqrt）
// 隐式乘法：2π、3(4+5)、(1+2)(3+4) 都按乘法算。
// opts.deg 为真时三角函数按角度制；opts.ans 供 Ans 取用。

const FUNCS = ['asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'abs', 'exp'];

function tokenize(src) {
  const s = String(src).replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if ((c >= '0' && c <= '9') || c === '.') {
      let j = i;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++;
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1) throw new Error('小数点写多了：' + raw);
      const v = Number(raw);
      if (!Number.isFinite(v)) throw new Error('数字写得不对：' + raw);
      out.push({ t: 'num', v });
      i = j;
      continue;
    }
    if (c === 'π') { out.push({ t: 'num', v: Math.PI }); i++; continue; }
    if (c === '√') { out.push({ t: 'fn', v: 'sqrt' }); i++; continue; }
    if ('+-*/^!%()'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    if (/[A-Za-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const lw = word.toLowerCase();
      if (lw === 'ans') { out.push({ t: 'ans' }); i = j; continue; }
      if (word === 'e' || word === 'E') { out.push({ t: 'num', v: Math.E }); i = j; continue; }
      if (FUNCS.includes(lw)) { out.push({ t: 'fn', v: lw }); i = j; continue; }
      throw new Error('不认识的符号：' + word);
    }
    throw new Error('不认识的字符：' + c);
  }
  return out;
}

function factorial(v) {
  if (!Number.isInteger(v) || v < 0) throw new Error('阶乘只对非负整数有定义。');
  if (v > 170) throw new Error('阶乘太大，算不出来。');
  let r = 1;
  for (let k = 2; k <= v; k++) r *= k;
  return r;
}

export function evaluate(src, opts = {}) {
  const toks = tokenize(src);
  if (!toks.length) throw new Error('还没有输入。');
  const deg = !!opts.deg;
  const ans = Number(opts.ans) || 0;
  const D = Math.PI / 180;
  const fns = {
    sin: x => Math.sin(deg ? x * D : x),
    cos: x => Math.cos(deg ? x * D : x),
    tan: x => Math.tan(deg ? x * D : x),
    asin: x => Math.asin(x) / (deg ? D : 1),
    acos: x => Math.acos(x) / (deg ? D : 1),
    atan: x => Math.atan(x) / (deg ? D : 1),
    ln: x => Math.log(x),
    log: x => Math.log10(x),
    sqrt: x => Math.sqrt(x),
    abs: x => Math.abs(x),
    exp: x => Math.exp(x),
  };

  let p = 0;
  const isOp = v => { const t = toks[p]; return !!t && t.t === 'op' && t.v === v; };
  const startsValue = () => {
    const t = toks[p];
    return !!t && (t.t === 'num' || t.t === 'fn' || t.t === 'ans' || (t.t === 'op' && t.v === '('));
  };

  function expr() {
    let a = term();
    for (;;) {
      if (isOp('+')) { p++; a += term(); }
      else if (isOp('-')) { p++; a -= term(); }
      else return a;
    }
  }
  function term() {
    let a = unary();
    for (;;) {
      if (isOp('*')) { p++; a *= unary(); }
      else if (isOp('/')) {
        p++;
        const b = unary();
        if (b === 0) throw new Error('除数不能为 0。');
        a /= b;
      } else if (startsValue()) {
        a *= unary();
      } else return a;
    }
  }
  function unary() {
    if (isOp('-')) { p++; return -unary(); }
    if (isOp('+')) { p++; return unary(); }
    return power();
  }
  function power() {
    const base = postfix();
    if (isOp('^')) { p++; return Math.pow(base, unary()); }
    return base;
  }
  function postfix() {
    let v = primary();
    for (;;) {
      if (isOp('!')) { p++; v = factorial(v); }
      else if (isOp('%')) { p++; v /= 100; }
      else return v;
    }
  }
  function primary() {
    const t = toks[p];
    if (!t) throw new Error('算式没写完。');
    if (t.t === 'num') { p++; return t.v; }
    if (t.t === 'ans') { p++; return ans; }
    if (t.t === 'fn') {
      p++;
      let arg;
      if (isOp('(')) {
        p++;
        arg = expr();
        if (!isOp(')')) throw new Error('括号没有配对。');
        p++;
      } else {
        arg = unary();
      }
      const r = fns[t.v](arg);
      if (Number.isNaN(r)) throw new Error('这个数不在函数的定义域内。');
      return r;
    }
    if (isOp('(')) {
      p++;
      const v = expr();
      if (!isOp(')')) throw new Error('括号没有配对。');
      p++;
      return v;
    }
    throw new Error('这里少了一个数。');
  }

  const v = expr();
  if (p < toks.length) throw new Error('最后一段没有算完。');
  if (!Number.isFinite(v)) throw new Error('结果超出能表示的范围。');
  if (Math.abs(v) < 1e-13) return 0;
  return Number(v.toPrecision(12));
}

// 显示用：大数走科学记数法，其余去掉浮点尾巴（0.30000000000000004 → 0.3）
export function fmt(v) {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e12 || a < 1e-9)) {
    return v.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return String(Number(v.toPrecision(12)));
}
