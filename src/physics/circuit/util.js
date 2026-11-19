// 电路各模块共用的小工具：取数、读数格式、空结果。
// 放在这里而不是各自复制一份，右栏与求解器的有效数字口径才不会走样。

/** 把输入框里可能是空串 / 字符串的值收成一个数，不像数就取默认值 */
export const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

/** 读数格式：大数少留位、小数多留位，量级在 1e-4 以下直接写 0 */
export const f2 = v => {
  const a = Math.abs(v);
  if (!Number.isFinite(v)) return '—';
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  if (a >= 0.01) return v.toFixed(2);
  if (a < 1e-4) return '0';
  return v.toFixed(4);
};

/** 没解出来的支路用它兜底，省得每处再判空 */
export const EMPTY_R = {
  I: 0, U: 0, Idc: 0, Udc: 0, Iac: 0, Uac: 0, IacRe: 0, UacRe: 0,
  Irms: 0, Urms: 0, Imax: 0, P: 0,
};
